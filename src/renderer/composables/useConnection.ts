import { onMounted, onUnmounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { operationError } from './operationError'
import { useDeviceOperation } from './useDeviceOperation'
import { toDeviceApplets } from '../models/applets'
import { useAppStore, useDeviceStore } from '../store'
import { useBindCodeInput } from './useBindCodeInput'
import { useConnectionFirmware } from './useConnectionFirmware'
import constants from '../../common/constants'
import { useDeviceRecovery } from './useDeviceRecovery'
import { isSessionRecoveryError } from './deviceSession'

export function useConnection() {
  const operation = useDeviceOperation()
  const callDevice = operation.call
  const router = useRouter()
  const device = useDeviceStore()
  const app = useAppStore()
  const recovery = useDeviceRecovery(operation)
  const state = reactive({
    errorInfo: '',
    errorStage: 'connect',
    status: 1,
    checkFirmwareUpgrade: 1,
    checkDeviceBindingCode: 1,
    checkPinAndWallet: 1
  })
  const binding = useBindCodeInput(bindAcquire, true)
  const firmware = useConnectionFirmware(
    changeState,
    (message, status) => fail(message, status, false),
    connect,
    operation
  )
  const preventScroll = (event: TouchEvent): void => event.preventDefault()
  function changeState(status: number): void {
    state.status = status
  }
  function fail(message: unknown, status = 4, allowRecovery = true): void {
    if (!operation.active()) return
    binding.state.bindingStatus = 0
    state.errorInfo = operationError(message)
    changeState(status)
    if (allowRecovery && isSessionRecoveryError(message)) recovery.offer(message, check)
  }
  function resetConnection(): void {
    device.invalidateDeviceData()
    binding.resetBindingInput()
    state.errorInfo = ''
    state.errorStage = 'connect'
    state.checkFirmwareUpgrade = state.checkDeviceBindingCode = state.checkPinAndWallet = 1
    device.activeStatus = ''
    device.bindStatus = ''
    device.apps = []
    device.connectedSeid = ''
  }
  function cancelBinding(): void {
    if (state.status !== 7 || binding.state.bindingStatus !== 0) return
    resetConnection()
    changeState(1)
  }
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && state.status === 7) {
      event.preventDefault()
      cancelBinding()
    }
  }
  function openUrl(): void {
    void window.imkey.app
      .openExternal(
        'https://support.imkey.im/hc/zh-cn/articles/360019787533-%E5%A6%82%E4%BD%95%E9%87%8D%E7%BD%AEimKey-'
      )
      .catch(error => fail(error instanceof Error ? error.message : String(error)))
  }
  async function check(): Promise<void> {
    await operation.run(async () => {
      resetConnection()
      try {
        await connect()
      } catch (error) {
        fail(error instanceof Error ? error.message : String(error))
      }
    })
  }
  async function connect(): Promise<void> {
    state.errorStage = 'connect'
    const request = callDevice('connectDevice')
    if (state.status === 1) changeState(8)
    const result = await request
    if (!result.isSuccess || result.result !== constants.RESULT_STATUS_SUCCESS) {
      fail(result)
      return
    }
    changeState(3)
    state.errorStage = 'check'
    state.checkFirmwareUpgrade = 2
    const bootloader = await callDevice('isBLStatus')
    if (!bootloader.isSuccess) {
      fail(bootloader)
      return
    }
    if (bootloader.result) {
      await firmware.toCosUpdate()
      return
    }
    if (!device.connectedSeid) {
      const identity = await callDevice('getSeid')
      if (!identity.isSuccess || !identity.result) {
        fail(identity.isSuccess ? 'get_seid_error' : identity)
        return
      }
      device.connectedSeid = identity.result
    }
    await checkIsActive()
  }
  async function checkIsActive(): Promise<void> {
    const update = await callDevice('checkUpdate')
    if (!update.isSuccess) {
      fail(update)
      return
    }
    if (update.result.status !== 'latest') {
      await router.push('imKeySetting')
      return
    }
    const cos = await callDevice('cosCheckUpdate')
    if (!cos.isSuccess) {
      fail(cos)
      return
    }
    if (!cos.result.isUpdateSuccess) {
      await firmware.toCosUpdate()
      return
    }
    state.checkFirmwareUpgrade = 3
    device.activeStatus = update.result.status
    device.apps = toDeviceApplets(update.result.list)
    const imk = update.result.list.find(entry => entry.name === 'IMK')
    if (imk && imk.installedVersion !== null && imk.installedVersion !== imk.latestVersion) {
      const updated = await callDevice('updateApplet', 'IMK')
      if (!updated.isSuccess) return fail(updated)
    }
    await checkIsBind()
  }
  async function checkIsBind(): Promise<void> {
    state.errorStage = 'bind'
    state.checkDeviceBindingCode = 2
    const result = await callDevice('deviceBindCheck', app.userPath)
    if (!result.isSuccess) {
      fail(result)
      return
    }
    device.bindStatus = result.result
    if (device.bindStatus === constants.BIND_STATUS_STRING_BOUND_OTHER) {
      changeState(7)
      return
    }
    if (device.bindStatus === constants.BIND_STATUS_STRING_UNBOUND) {
      await router.push('imKeySetting')
      return
    }
    if (device.bindStatus !== constants.BIND_STATUS_STRING_BOUND_THIS) {
      fail(result)
      return
    }
    const local = await callDevice('isExistBindCodeFile')
    if (!local.isSuccess) return fail(local)
    if (!local.result) {
      changeState(7)
      return
    }
    const stored = await callDevice('exportBindCode')
    if (!stored.isSuccess) {
      state.errorInfo = operationError(stored)
      changeState(7)
      return
    }
    state.checkDeviceBindingCode = 3
    await checkWallet(false)
  }
  async function checkWallet(other: boolean, isCurrent = () => operation.active()): Promise<void> {
    state.errorStage = 'wallet'
    if (!other) state.checkPinAndWallet = 2
    const xpub = await callDevice('getBTCXpub', app.userPath)
    if (!isCurrent()) return
    if (!xpub.isSuccess) {
      if (xpub.result === 'imkey_wallet_not_created') await router.push('imKeySetting')
      else fail(xpub)
      return
    }
    if (!xpub.result.startsWith('xpub')) {
      fail('invalid_wallet_response')
      return
    }
    if (other) binding.state.bindingStatus = 2
    else state.checkPinAndWallet = 3
    await router.push('/home/welcomeHome')
  }
  async function bindAcquire(code: string): Promise<void> {
    const isCurrent = () => operation.active() && state.status === 7
    await operation.run(async () => {
      if (!isCurrent()) return
      state.errorInfo = ''
      try {
        await bindAcquireWithinOperation(code, isCurrent)
      } catch (error) {
        if (!isCurrent()) return
        fail(error instanceof Error ? error.message : String(error))
      }
    })
  }
  async function bindAcquireWithinOperation(code: string, isCurrent: () => boolean): Promise<void> {
    state.errorStage = 'bind'
    const acquired = await callDevice('deviceBindAcquire', code)
    if (!isCurrent()) return
    if (
      (acquired.isSuccess && acquired.result === 'error') ||
      (!acquired.isSuccess &&
        ['imkey_authcode_error', 'binding_code_error'].includes(acquired.result))
    ) {
      state.errorInfo = operationError(acquired)
      binding.state.codeIsTrue = false
      binding.state.bindingStatus = 0
      return
    }
    if (!acquired.isSuccess || acquired.result !== constants.RESULT_STATUS_SUCCESS) {
      fail(acquired)
      return
    }
    const imported = await callDevice('importBindCode', code)
    if (!isCurrent()) return
    if (!imported.isSuccess) {
      fail(imported)
      return
    }
    await checkWallet(true, isCurrent)
  }
  onMounted(async () => {
    document.body.style.overflow = 'hidden'
    document.addEventListener('touchmove', preventScroll, { passive: false })
    document.addEventListener('keydown', handleKeydown)
    await operation.run(async () => {
      const path = await callDevice('getUserPath')
      if (!path.isSuccess) {
        fail(path)
        return
      }
      app.userPath = path.result
      const init = await callDevice('initImKeyCore')
      if (!init.isSuccess) fail(init)
    }, 'initialize')
  })
  onUnmounted(() => {
    document.body.style.overflow = ''
    document.removeEventListener('touchmove', preventScroll)
    document.removeEventListener('keydown', handleKeydown)
  })
  return { ...toRefs(state), ...binding, ...firmware, changeState, check, cancelBinding, openUrl }
}
