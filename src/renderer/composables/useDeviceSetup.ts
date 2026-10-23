import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore, useDeviceStore } from '../store'
import { useDeviceOperation } from './useDeviceOperation'
import { operationError } from './operationError'
import { useBindCodeInput } from './useBindCodeInput'
import { useTranslation } from './useTranslation'
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
  const { t } = useTranslation()
  const state = reactive({
    errorInfo: '',
    errorStage: '',
    bindCode: '',
    active: 0,
    page: 1,
    step1: false,
    step2: false,
    step3: false,
    checkTip: true,
    finish: false,
    bindFinish: false,
    checkWalletTip: false,
    bindViewFinish: false
  })
  let retryAction: () => Promise<void> = initialize
  function failed(error: unknown, stage: string) {
    if (!operation.active()) return
    state.errorInfo = operationError(error)
    state.errorStage = stage
  }
  async function execute(action: () => Promise<void>, key = 'action') {
    return operation.run(async () => {
      state.errorInfo = ''
      retryAction = action
      try {
        await action()
      } catch (error) {
        failed(error, state.errorStage || 'connect')
      }
    }, key)
  }
  function retry() {
    return execute(retryAction)
  }
  const binding = useBindCodeInput(code => execute(() => acquire(code)))
  function openUrl(): void {
    void window.imkey.app
      .openExternal(t('m.imKeyManager.operating_tutorial_url'))
      .catch(error => failed(error, 'link'))
  }
  function openUrlReset(): void {
    void window.imkey.app
      .openExternal(
        'https://support.imkey.im/hc/zh-cn/articles/360019787533-%E5%A6%82%E4%BD%95%E9%87%8D%E7%BD%AEimKey-'
      )
      .catch(error => failed(error, 'link'))
  }
  async function acquire(code: string): Promise<void> {
    state.bindCode = code
    const connected = await callDevice('connectDevice')
    if (!connected.isSuccess) failed(connected, 'connect')
    if (connected.isSuccess) {
      const acquired = await callDevice('deviceBindAcquire', code)
      if (acquired.isSuccess && acquired.result === constants.RESULT_STATUS_SUCCESS) {
        const imported = await callDevice('importBindCode', code)
        if (!imported.isSuccess) failed(imported, 'store')
        if (imported.isSuccess) {
          binding.state.bindingStatus = 2
          state.bindFinish = true
          return
        }
      } else failed(acquired, 'bind')
    }
    binding.state.bindingStatus = 0
    binding.state.codeIsTrue = false
    state.bindFinish = false
  }
  async function navigate({ page, active, isNext }: Navigation): Promise<void> {
    if (page === 0 && active === 0) {
      if (!state.finish) return
      const connected = await callDevice('connectDevice')
      if (!connected.isSuccess) return failed(connected, 'connect')
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
      state.active = active
      state.page = page
    }
    if (page === 3 && isNext && binding.state.bindingStatus === 2) {
      const connected = await callDevice('connectDevice')
      if (connected.isSuccess) {
        state.active = active
        state.page = page
      } else failed(connected, 'connect')
    }
    if (page === 4 && isNext) {
      const connected = await callDevice('connectDevice')
      if (connected.isSuccess) {
        if (await checkWalletReady()) {
          state.active = active
          state.page = page
          return
        }
      } else failed(connected, 'connect')
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
    const connected = await callDevice('connectDevice')
    if (!connected.isSuccess) return failed(connected, 'connect')
    if (device.activeStatus !== 'latest') {
      const activated = await callDevice('activeDevice')
      if (!activated.isSuccess) return failed(activated, 'activate')
    }
    const result = await callDevice('deviceBindCheck', app.userPath)
    if (!result.isSuccess) return failed(result, 'bind')
    device.bindStatus = result.result
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
    }
  }
  function send(navigation: Navigation) {
    return execute(() => navigate(navigation))
  }
  onMounted(() => {
    void execute(initialize, 'initialize')
  })
  return { ...toRefs(state), ...binding, openUrl, openUrlReset, send, changeStep, retry }
}
