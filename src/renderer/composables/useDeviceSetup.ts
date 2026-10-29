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
type PendingAction = '' | 'initialize' | 'binding' | 'next' | 'previous'
interface Navigation {
  page: number
  active: number
  isNext: boolean
}
interface SetupConnection {
  sessionId: number
  seid: string
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
    busy: false,
    pendingAction: '' as PendingAction
  })
  let expectedBinding: string | undefined
  let activationCompleted: SetupConnection | undefined
  let actionRevision = 0
  let retryAction: () => Promise<void> = initialize
  let retryInPlace = false
  let retryPendingAction: PendingAction = 'initialize'
  function failed(error: unknown, stage: string, reconnectOnly = false) {
    if (!operation.active()) return
    const reason = typeof error === 'string' ? error : (error as { result?: unknown })?.result
    if (reason === 'device_session_changed' || reason === 'device_bind_check_failed') {
      activationCompleted = undefined
      binding.resetBindingInput()
      state.bindFinish = false
    }
    state.errorInfo = operationError(error)
    state.errorStage = stage
    recovery.offer(error, retry, {
      reconnectOnly,
      ...(retryInPlace && !reconnectOnly
        ? {
            stayOnCancel: true,
            message: t(
              stage === 'connect'
                ? 'm.imKeyManager.setup_connection_failed'
                : 'm.imKeyManager.setup_operation_failed'
            )
          }
        : {})
    })
  }
  async function execute(
    action: () => Promise<void>,
    key = 'action',
    recoverInPlace = false,
    pendingAction: PendingAction = 'binding'
  ) {
    if (state.busy || !operation.active()) return
    // Show feedback and prevent duplicate clicks even while another operation owns the queue.
    actionRevision++
    state.errorInfo = ''
    state.busy = true
    state.pendingAction = pendingAction
    retryAction = action
    retryInPlace = recoverInPlace
    retryPendingAction = pendingAction
    try {
      return await operation.run(async () => {
        try {
          await action()
        } catch (error) {
          failed(error, state.errorStage || 'connect')
        }
      }, key)
    } finally {
      state.busy = false
      state.pendingAction = ''
    }
  }
  function retry() {
    return execute(retryAction, 'action', retryInPlace, retryPendingAction)
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
    state.errorStage = 'connect'
    const connected = await connectDeviceSession(callDevice, device, { requireBinding: false })
    if (!connected.isSuccess) {
      failed(connected, 'connect', connected.result === 'device_session_changed')
      return false
    }
    device.identityReady = true
    return true
  }
  function currentConnection(): SetupConnection {
    return { sessionId: device.sessionId, seid: device.connectedSeid.toUpperCase() }
  }
  function sameConnection(connection: SetupConnection): boolean {
    return (
      connection.sessionId === device.sessionId &&
      Boolean(connection.seid) &&
      connection.seid === device.connectedSeid.toUpperCase()
    )
  }
  async function confirmStoredCodeDevice(connection: SetupConnection): Promise<boolean> {
    state.errorStage = 'connect'
    if (!sameConnection(connection)) {
      failed('device_session_changed', 'connect', true)
      return false
    }
    const identity = await callDevice('getSeid')
    if (!operation.active()) return false
    if (!identity.isSuccess) {
      failed(identity, 'connect')
      return false
    }
    if (!sameConnection(connection) || identity.result.toUpperCase() !== connection.seid) {
      failed('device_session_changed', 'connect', true)
      return false
    }
    return true
  }
  async function checkBinding(requireBound = false): Promise<boolean> {
    state.errorStage = 'bind'
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
        retryInPlace = false
        retryPendingAction = ''
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
  async function acquire(code: string, connection?: SetupConnection): Promise<void> {
    binding.state.bindingStatus = 1
    binding.state.codeIsTrue = true
    state.bindFinish = false
    try {
      // Only continuous initialization reuses its connection. Re-read identity and
      // binding after loading the code; a later user submission always reconnects.
      const connected = connection
        ? await confirmStoredCodeDevice(connection)
        : await connectCurrent()
      if (!connected || !(await checkBinding())) return
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
    if (state.page === 2 && page === 1 && !isNext) {
      if (!(await connectCurrent()) || !(await checkBinding())) return
      if (device.bindStatus === constants.BIND_STATUS_STRING_UNBOUND) {
        const display = await callDevice('deviceBindDisplay')
        if (!operation.active()) return
        if (!display.isSuccess) return failed(display, 'bind')
        binding.resetBindingInput()
        state.bindFinish = false
      }
      state.bindViewFinish = true
      state.active = active
      state.page = page
      return
    }
    if (page === 0 && active === 0) {
      if (!state.finish) return
      if (!(await connectCurrent())) return
      if (await checkWalletReady(true)) {
        await router.push('/home/welcomeHome')
      }
      return
    }
    if (page === 4 && isNext) {
      if (await connectCurrent()) {
        if (await checkWalletReady()) {
          state.active = active
          state.page = page
          return
        }
      }
      state.checkWalletTip = true
    }
  }
  async function checkWalletReady(authorizeHome = false): Promise<boolean> {
    // The service checks bound_this immediately before reading xpub. Keep that check
    // authoritative rather than sending a second deviceBindCheck from the renderer.
    state.errorStage = 'wallet'
    device.revokeHomeAccess()
    const connection = currentConnection()
    const xpub = await callDevice('getBTCXpub', app.userPath)
    if (!operation.active() || !sameConnection(connection)) return false
    if (!xpub.isSuccess) {
      failed(xpub, 'wallet')
      return false
    }
    if (!xpub.result.startsWith('xpub')) {
      failed('imkey_wallet_not_created', 'wallet')
      return false
    }
    const confirmed = await callDevice('getSeid')
    if (!operation.active() || !sameConnection(connection)) return false
    if (!confirmed.isSuccess) {
      failed(confirmed, 'connect')
      return false
    }
    if (confirmed.result.toUpperCase() !== connection.seid) {
      failed('device_session_changed', 'connect', true)
      return false
    }
    if (authorizeHome && !device.authorizeHome(connection.sessionId, connection.seid, xpub)) {
      failed('device_session_changed', 'wallet', true)
      return false
    }
    return true
  }
  function changeStep(step: SetupStep): void {
    if (state.busy) return
    state[step] = !state[step]
    state.finish = state.step1 && state.step2 && state.step3
    state.checkTip = !state.finish
  }
  async function initialize() {
    state.bindViewFinish = false
    if (!(await connectCurrent())) return
    if (
      device.activeStatus !== 'latest' &&
      !(activationCompleted && sameConnection(activationCompleted))
    ) {
      const connection = currentConnection()
      const activated = await callDevice('activeDevice')
      if (!activated.isSuccess) return failed(activated, 'activate')
      if (!sameConnection(connection)) return failed('device_session_changed', 'activate', true)
      activationCompleted = connection
    }
    if (!(await checkBinding())) return
    if (device.bindStatus === constants.BIND_STATUS_STRING_UNBOUND) {
      const display = await callDevice('deviceBindDisplay')
      if (display.isSuccess) state.bindViewFinish = true
      else failed(display, 'bind')
    } else if (
      [constants.BIND_STATUS_STRING_BOUND_THIS, constants.BIND_STATUS_STRING_BOUND_OTHER].includes(
        device.bindStatus
      )
    ) {
      state.bindViewFinish = true
      if (device.bindStatus === constants.BIND_STATUS_STRING_BOUND_THIS) {
        const connection = currentConnection()
        const local = await callDevice('exportBindCode')
        if (!operation.active()) return
        if (local.isSuccess && /^[a-hj-np-zA-HJ-NP-Z2-9]{8}$/.test(local.result)) {
          await acquire(local.result, connection)
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
    if (!operation.active() || state.busy || binding.state.bindingStatus === 1)
      return Promise.resolve()
    if (state.page === 1 && navigation.page === 2 && !state.bindViewFinish) return Promise.resolve()
    const { page, active, isNext } = navigation
    const localNavigation =
      (state.page === 1 && page === 2 && isNext) ||
      (state.page === 2 && page === 3 && isNext) ||
      (state.page === 3 && page === 2 && !isNext) ||
      (state.page === 4 && page === 3 && !isNext)
    if (localNavigation) {
      if (page === 3 && isNext && (binding.state.bindingStatus !== 2 || !state.bindFinish)) {
        recovery.offer('device_session_restart_required', async () => {}, { reconnectOnly: true })
        return Promise.resolve()
      }
      // Instruction pages are local navigation. Reconnect and verify identity before
      // submitting a binding code, checking wallet readiness, and completing setup.
      actionRevision++
      state.errorInfo = ''
      state.errorStage = ''
      if (state.page === 4) {
        state.step1 = state.step2 = state.step3 = state.finish = false
        state.checkTip = true
      }
      state.active = active
      state.page = page
      return Promise.resolve()
    }
    const recoverInPlace = state.page === 2 && page === 1 && !isNext
    return execute(
      () => navigate(navigation),
      'action',
      recoverInPlace,
      isNext || page === 0 ? 'next' : 'previous'
    )
  }
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    void execute(initialize, 'initialize', false, 'initialize')
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
