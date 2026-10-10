import { onMounted, onUnmounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { operationError } from './operationError'
import { useDeviceOperation } from './useDeviceOperation'
import { toDeviceApplets } from '../models/applets'
import { useAppStore, useDeviceStore } from '../store'
import { useTranslation } from './useTranslation'
import { useBindCodeInput } from './useBindCodeInput'
import { useConnectionFirmware } from './useConnectionFirmware'
import constants from '../../common/constants'

export function useConnection() {
  const operation = useDeviceOperation()
  const callDevice = operation.call
  const router = useRouter()
  const device = useDeviceStore()
  const app = useAppStore()
  const { t } = useTranslation()
  const state = reactive({
    errorInfo: '',
    connectText: t('m.connectDevice.connect'),
    status: 1,
    checkFirmwareUpgrade: 1,
    checkDeviceBindingCode: 1,
    checkPinAndWallet: 1,
    checkSafetyTest: 1,
    isUpdateIMK: false
  })
  const binding = useBindCodeInput(bindAcquire, true)
  const firmware = useConnectionFirmware(changeState, fail, connect, operation)
  const preventScroll = (event: TouchEvent): void => event.preventDefault()
  function changeState(status: number): void {
    state.status = status
  }
  function fail(message: unknown, status = 4): void {
    if (!operation.active()) return
    state.errorInfo = operationError(message)
    changeState(status)
  }
  function openUrl(): void {
    void window.imkey.app
      .openExternal(
        'https://support.imkey.im/hc/zh-cn/articles/360019787533-%E5%A6%82%E4%BD%95%E9%87%8D%E7%BD%AEimKey-'
      )
      .catch(error => fail(error instanceof Error ? error.message : String(error)))
  }
  function check(): void {
    state.checkFirmwareUpgrade =
      state.checkDeviceBindingCode =
      state.checkPinAndWallet =
      state.checkSafetyTest =
        1
    void operation.run(async () => {
      state.errorInfo = ''
      try {
        await connect()
      } catch (error) {
        fail(error instanceof Error ? error.message : String(error))
      }
    })
  }
  async function connect(): Promise<void> {
    const request = callDevice('connectDevice')
    if (state.status === 1) changeState(8)
    const result = await request
    if (!result.isSuccess || result.result !== constants.RESULT_STATUS_SUCCESS) {
      fail(result)
      return
    }
    changeState(3)
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
    state.checkFirmwareUpgrade = 3
    await checkIsActive()
  }
  async function checkIsActive(): Promise<void> {
    state.checkDeviceBindingCode = 2
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
    device.activeStatus = update.result.status
    device.apps = toDeviceApplets(update.result.list)
    state.connectText = t('m.connectDevice.active_success')
    const imk = update.result.list.find(entry => entry.name === 'IMK')
    if (imk && imk.installedVersion !== null && imk.installedVersion !== imk.latestVersion) {
      state.isUpdateIMK = true
      const updated = await callDevice('updateApplet', 'IMK')
      if (!updated.isSuccess) return fail(updated)
      state.isUpdateIMK = false
    }
    await checkIsBind()
  }
  async function checkIsBind(): Promise<void> {
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
    state.checkDeviceBindingCode = 3
    await checkWallet(false)
  }
  async function checkWallet(other: boolean): Promise<void> {
    if (!other) state.checkPinAndWallet = 2
    const xpub = await callDevice('getBTCXpub', app.userPath)
    if (!xpub.isSuccess) {
      if (other) fail(xpub)
      else await router.push('imKeySetting')
      return
    }
    if (!xpub.result.includes('xpu')) {
      await router.push('imKeySetting')
      return
    }
    if (!other) {
      state.checkPinAndWallet = 3
      state.checkSafetyTest = 2
    }
    const addresses = await callDevice('genWalletAddress', { filePath: app.userPath })
    if (!addresses.isSuccess) {
      fail(addresses)
      return
    }
    app.walletAddresses = addresses.result
    if (other) binding.state.bindingStatus = 2
    else state.checkSafetyTest = 3
    await router.push('/home/welcomeHome')
  }
  async function bindAcquire(code: string): Promise<void> {
    await operation.run(async () => {
      state.errorInfo = ''
      try {
        await bindAcquireWithinOperation(code)
      } catch (error) {
        fail(error instanceof Error ? error.message : String(error))
      }
    })
  }
  async function bindAcquireWithinOperation(code: string): Promise<void> {
    const acquired = await callDevice('deviceBindAcquire', code)
    if (!acquired.isSuccess || acquired.result !== constants.RESULT_STATUS_SUCCESS) {
      state.errorInfo = operationError(acquired)
      binding.state.codeIsTrue = false
      binding.state.bindingStatus = 0
      return
    }
    const imported = await callDevice('importBindCode', code)
    if (!imported.isSuccess) {
      fail(imported)
      return
    }
    await checkWallet(true)
  }
  onMounted(async () => {
    document.body.style.overflow = 'hidden'
    document.addEventListener('touchmove', preventScroll, { passive: false })
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
  })
  return { ...toRefs(state), ...binding, ...firmware, changeState, check, openUrl }
}
