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
import { isFirmwareDiagnosticStage } from '../../shared/firmwareDiagnostics'

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
    (message, status, stage) => {
      if (stage) state.errorStage = stage
      fail(message, status, false, false)
    },
    connect,
    operation
  )
  const preventScroll = (event: TouchEvent): void => event.preventDefault()
  function changeState(status: number): void {
    state.status = status
  }
  function fail(message: unknown, status = 4, allowRecovery = true, logFailure = true): void {
    if (!operation.active()) return
    if (logFailure)
      operation.failure?.(
        isFirmwareDiagnosticStage(state.errorStage) ? state.errorStage : 'check',
        message
      )
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
    if (!device.connectedSeid) {
      const identity = await callDevice(bootloader.result ? 'getUpgradeSeid' : 'getSeid')
      if (!identity.isSuccess || !identity.result) {
        fail(identity.isSuccess ? 'get_seid_error' : identity)
        return
      }
      device.connectedSeid = identity.result
    }
    device.identityReady = true
    const pending = await firmware.loadPendingRecovery(device.connectedSeid)
    if (!pending.isSuccess) {
      fail(pending)
      return
    }
    if (bootloader.result) {
      await firmware.toCosUpdate(true)
      return
    }
    // Native upgrade recovery must be reachable even when the normal application
    // catalogue fails for the partly installed firmware. Never treat that error
    // as successful binding or permission to enter home.
    const cos = await callDevice('cosCheckUpdate')
    if (!cos.isSuccess) {
      if (!pending.result && cos.result === 'imkey_tsm_device_not_activated') {
        device.activeStatus = 'inactivated'
        await router.push('imKeySetting')
        return
      }
      fail(cos)
      return
    }
    if (typeof cos.result.isUpdateSuccess !== 'boolean') {
      fail('invalid_firmware_response')
      return
    }
    if (cos.result.isUpdateSuccess !== true || pending.result) {
      await firmware.toCosUpdate(cos.result.isUpdateSuccess === false)
      return
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
    const stored = await callDevice('exportBindCode')
    if (!stored.isSuccess) {
      if (stored.code === 'BINDING_DEVICE_UNAVAILABLE') return fail(stored)
      // The main process resolves the actual device SEID and reads its file once.
      // A missing file needs code entry; an unreadable file also explains why.
      state.errorInfo = stored.result === 'binding_code_file_missing' ? '' : operationError(stored)
      changeState(7)
      return
    }
    state.checkDeviceBindingCode = 3
    await checkWallet(false)
  }
  async function checkWallet(other: boolean, isCurrent = () => operation.active()): Promise<void> {
    device.revokeHomeAccess()
    const sessionId = device.sessionId
    const seid = device.connectedSeid
    state.errorStage = 'wallet'
    if (!other) state.checkPinAndWallet = 2
    const xpub = await callDevice('getBTCXpub', app.userPath)
    if (!isCurrent() || device.sessionId !== sessionId) return
    if (!xpub.isSuccess) {
      if (xpub.result === 'imkey_wallet_not_created') await router.push('imKeySetting')
      else fail(xpub)
      return
    }
    if (!xpub.result.startsWith('xpub')) {
      fail('invalid_wallet_response')
      return
    }
    const confirmed = await callDevice('getSeid')
    if (!isCurrent() || device.sessionId !== sessionId) return
    if (!confirmed.isSuccess) return fail(confirmed)
    if (confirmed.result.toUpperCase() !== seid.toUpperCase()) return fail('device_session_changed')
    if (!device.authorizeHome(sessionId, seid, xpub)) {
      fail('device_session_changed')
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
    if (firmware.hasPendingRecovery()) {
      await firmware.toCosUpdate()
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
