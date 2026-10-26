import { onMounted, onUnmounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore, useDeviceStore } from '../store'
import { useDeviceOperation } from './useDeviceOperation'
import { operationError } from './operationError'
import { useBindCodeInput } from './useBindCodeInput'
import { useTranslation } from './useTranslation'
import { useDeviceRecovery } from './useDeviceRecovery'
import { connectDeviceSession } from './deviceSession'
import constants from '../../common/constants'

type SetupStep = 'step1' | 'step2' | 'step3'
interface Navigation {
  page: number
  active: number
  isNext: boolean
}
export function useDeviceSetup() {
  const operation = useDeviceOperation()
  const callDevice = operation.call
  const router = useRouter()
  const app = useAppStore()
  const device = useDeviceStore()
  const recovery = useDeviceRecovery(operation)
  const { t } = useTranslation()
  const state = reactive({
    errorInfo: '',
    errorStage: '',
    active: 0,
    page: 1,
    step1: false,
    step2: false,
    step3: false,
    checkTip: true,
    finish: false,
    bindFinish: false,
    checkWalletTip: false,
    bindViewFinish: false,
    busy: false
  })
  let expectedBinding: string | undefined
  let actionRevision = 0
  let retryAction: () => Promise<void> = initialize
  function failed(error: unknown, stage: string, reconnectOnly = false) {
    if (!operation.active()) return
    state.errorInfo = operationError(error)
    state.errorStage = stage
    recovery.offer(error, retry, { reconnectOnly })
  }
  async function execute(action: () => Promise<void>, key = 'action') {
    return operation.run(async () => {
      actionRevision++
      state.errorInfo = ''
      state.busy = true
      retryAction = action
      try {
        await action()
      } catch (error) {
        failed(error, state.errorStage || 'connect')
      } finally {
        state.busy = false
      }
    }, key)
  }
  function retry() {
    return execute(retryAction)
  }
  const binding = useBindCodeInput(code => execute(() => acquire(code)))
  function returnToConnection(): void {
    if (!operation.active() || state.busy || binding.state.bindingStatus === 1) return
    recovery.offer('device_session_restart_required', async () => {}, { reconnectOnly: true })
  }
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || event.defaultPrevented) return
    if (state.busy || binding.state.bindingStatus === 1) return
    event.preventDefault()
    returnToConnection()
  }
  async function connectCurrent(): Promise<boolean> {
    const connected = await connectDeviceSession(callDevice, device, { requireBinding: false })
    if (!connected.isSuccess) {
      failed(connected, 'connect', connected.result === 'device_session_changed')
      return false
    }
    return true
  }
  async function checkBinding(requireBound = false): Promise<boolean> {
    const result = await callDevice('deviceBindCheck', app.userPath)
    if (!operation.active()) return false
    if (!result.isSuccess) {
      failed(result, 'bind')
      return false
    }
    const status = result.result
    device.bindStatus = status
    if (
      ![
        constants.BIND_STATUS_STRING_UNBOUND,
        constants.BIND_STATUS_STRING_BOUND_OTHER,
        constants.BIND_STATUS_STRING_BOUND_THIS
      ].includes(status) ||
      (expectedBinding !== undefined && expectedBinding !== status) ||
      (requireBound && status !== constants.BIND_STATUS_STRING_BOUND_THIS)
    ) {
      binding.resetBindingInput()
      state.bindFinish = false
      failed('device_session_changed', 'bind', true)
      return false
    }
    expectedBinding = status
    return true
  }
  function openExternal(url: string): void {
    if (state.busy || binding.state.bindingStatus === 1) return
    const revision = actionRevision
    const current = () =>
      operation.active() &&
      actionRevision === revision &&
      !state.busy &&
      binding.state.bindingStatus !== 1
    const retryLink = async (): Promise<void> => {
      state.errorStage = 'link'
      await window.imkey.app.openExternal(url)
    }
    const attempt = async (): Promise<void> => {
      try {
        await window.imkey.app.openExternal(url)
        if (current() && state.errorStage === 'link') state.errorInfo = ''
      } catch (error) {
        if (!current()) return
        retryAction = retryLink
        failed(error, 'link')
      }
    }
    void attempt()
  }
  function openUrl(): void {
    openExternal(t('m.imKeyManager.operating_tutorial_url'))
  }
  function openUrlReset(): void {
    openExternal(
      'https://support.imkey.im/hc/zh-cn/articles/360019787533-%E5%A6%82%E4%BD%95%E9%87%8D%E7%BD%AEimKey-'
    )
  }
  async function acquire(code: string): Promise<void> {
    binding.state.bindingStatus = 1
    binding.state.codeIsTrue = true
    state.bindFinish = false
    try {
      if (!(await connectCurrent()) || !(await checkBinding())) return
      const acquired = await callDevice('deviceBindAcquire', code)
      if (!operation.active()) return
      if (acquired.isSuccess && acquired.result === constants.RESULT_STATUS_SUCCESS) {
        expectedBinding = constants.BIND_STATUS_STRING_BOUND_THIS
        device.bindStatus = expectedBinding
        const imported = await callDevice('importBindCode', code)
        if (!operation.active()) return
        if (!imported.isSuccess) failed(imported, 'store')
        if (imported.isSuccess) {
          binding.state.bindingStatus = 2
          binding.state.codeIsTrue = true
          state.bindFinish = true
          return
        }
      } else {
        const codeRejected =
          (acquired.isSuccess && acquired.result === 'error') ||
          (!acquired.isSuccess &&
            ['imkey_authcode_error', 'binding_code_error'].includes(acquired.result))
        binding.state.codeIsTrue = !codeRejected
        if (codeRejected) {
          state.errorInfo = operationError(acquired)
          state.errorStage = 'bind'
        } else failed(acquired, 'bind')
      }
    } finally {
      if (!state.bindFinish) binding.state.bindingStatus = 0
    }
  }
  async function navigate({ page, active, isNext }: Navigation): Promise<void> {
    if (page === 0 && active === 0) {
      if (!state.finish) return
      if (!(await connectCurrent()) || !(await checkBinding(true))) return
      if (await checkWalletReady()) {
        await router.push('/home/welcomeHome')
      }
      return
    }
    if (page === 3 && active === 1 && !isNext) {
      state.step1 = state.step2 = state.step3 = state.finish = false
      state.checkTip = true
    }
    if (
      (page === 3 && active === 1 && !isNext) ||
      (page === 2 && !isNext) ||
      (page === 2 && isNext)
    ) {
      if (state.page === 1 && !state.bindViewFinish) return
      state.active = active
      state.page = page
    }
    if (page === 3 && isNext) {
      if (binding.state.bindingStatus !== 2 || !state.bindFinish) {
        recovery.offer('device_session_restart_required', async () => {}, { reconnectOnly: true })
        return
      }
      if ((await connectCurrent()) && (await checkBinding(true))) {
        state.active = active
        state.page = page
      }
    }
    if (page === 4 && isNext) {
      if ((await connectCurrent()) && (await checkBinding(true))) {
        if (await checkWalletReady()) {
          state.active = active
          state.page = page
          return
        }
      }
      state.checkWalletTip = true
    }
  }
  async function checkWalletReady(): Promise<boolean> {
    const xpub = await callDevice('getBTCXpub', app.userPath)
    if (!operation.active()) return false
    if (!xpub.isSuccess) {
      failed(xpub, 'wallet')
      return false
    }
    if (!xpub.result.startsWith('xpub')) {
      failed('imkey_wallet_not_created', 'wallet')
      return false
    }
    return true
  }
  function changeStep(step: SetupStep): void {
    state[step] = !state[step]
    state.finish = state.step1 && state.step2 && state.step3
    state.checkTip = !state.finish
  }
  async function initialize() {
    state.bindViewFinish = false
    if (!(await connectCurrent())) return
    if (device.activeStatus !== 'latest') {
      const activated = await callDevice('activeDevice')
      if (!activated.isSuccess) return failed(activated, 'activate')
    }
    const result = await callDevice('deviceBindCheck', app.userPath)
    if (!result.isSuccess) return failed(result, 'bind')
    device.bindStatus = result.result
    expectedBinding = result.result
    if (device.bindStatus === constants.BIND_STATUS_STRING_UNBOUND) {
      const display = await callDevice('deviceBindDisplay')
      if (display.isSuccess) state.bindViewFinish = true
      else failed(display, 'bind')
    } else if (
      [constants.BIND_STATUS_STRING_BOUND_THIS, constants.BIND_STATUS_STRING_BOUND_OTHER].includes(
        result.result
      )
    ) {
      state.bindViewFinish = true
      if (result.result === constants.BIND_STATUS_STRING_BOUND_THIS) {
        const local = await callDevice('exportBindCode')
        if (!operation.active()) return
        if (local.isSuccess && /^[a-hj-np-zA-HJ-NP-Z2-9]{8}$/.test(local.result)) {
          await acquire(local.result)
          if (state.bindFinish) {
            state.page = 3
            state.active = 1
          }
        }
      }
    } else {
      failed('device_session_changed', 'bind', true)
    }
  }
  function send(navigation: Navigation) {
    if (state.busy || binding.state.bindingStatus === 1) return Promise.resolve()
    if (state.page === 1 && navigation.page === 2 && !state.bindViewFinish) return Promise.resolve()
    return execute(() => navigate(navigation))
  }
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    void execute(initialize, 'initialize')
  })
  onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
  return {
    ...toRefs(state),
    ...binding,
    openUrl,
    openUrlReset,
    send,
    changeStep,
    retry,
    returnToConnection
  }
}
