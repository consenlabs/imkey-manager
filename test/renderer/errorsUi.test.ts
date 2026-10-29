import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useFirmwareUpgrade } from '../../src/renderer/composables/useFirmwareUpgrade'
import { useSoftwareUpdate } from '../../src/renderer/composables/useSoftwareUpdate'
import { operationError } from '../../src/renderer/composables/operationError'
import { useSettings } from '../../src/renderer/composables/useSettings'
import { useConnectionFirmware } from '../../src/renderer/composables/useConnectionFirmware'
import { useDeviceSetup } from '../../src/renderer/composables/useDeviceSetup'
import { useDeviceStore } from '../../src/renderer/store/device'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string, params?: unknown) => Promise<DeviceResult>>(),
  mounted: [] as (() => unknown)[],
  unmounted: [] as (() => unknown)[],
  push: vi.fn()
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: vi.fn(), returnToConnection: vi.fn() })
}))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: () => 'https://imkey.im/' })
}))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: (callback: () => unknown) => mocks.mounted.push(callback),
  onUnmounted: (callback: () => unknown) => mocks.unmounted.push(callback)
}))
let message: (value: unknown) => void
let progress: (value: unknown) => void
const bridge = {
  app: { getVersion: vi.fn(), isOnline: vi.fn(), copyText: vi.fn(), openExternal: vi.fn() },
  updater: {
    check: vi.fn(),
    download: vi.fn(),
    quitAndInstall: vi.fn(),
    onMessage: vi.fn(),
    onProgress: vi.fn()
  }
}
function success(method: string): DeviceResult {
  const results: Record<string, unknown> = {
    getSeid: 'TESTDEVICE',
    getUpgradeSeid: 'TESTDEVICE',
    deviceBindCheck: 'bound_this',
    getBTCXpub: 'xpub-ready',
    getFirmwareVersion: '1.0.0',
    getBleVersion: '1.0.0',
    exportBindCode: 'A2345678',
    getInstalledApplets: { list: [{ name: 'Ethereum' }] },
    isBLStatus: false,
    getFirmwareRecovery: null,
    cosCheckUpdate: {
      latestCosVersion: '1.0.0',
      latestBleVersion: '1.0.0',
      isLatest: true,
      isUpdateSuccess: true
    }
  }
  return { isSuccess: true, result: method in results ? results[method] : 'success' }
}
beforeEach(() => {
  vi.resetAllMocks()
  mocks.mounted.length = mocks.unmounted.length = 0
  setActivePinia(createPinia())
  useDeviceStore().connectedSeid = 'TESTDEVICE'
  useDeviceStore().identityReady = true
  mocks.call.mockResolvedValue({ isSuccess: false, result: 'device_not_connected' })
  bridge.app.getVersion.mockResolvedValue('2.2.0')
  bridge.app.isOnline.mockResolvedValue(true)
  bridge.updater.check.mockResolvedValue(undefined)
  bridge.updater.download.mockResolvedValue(undefined)
  bridge.updater.onMessage.mockImplementation(callback => {
    message = callback
    return vi.fn()
  })
  bridge.updater.onProgress.mockImplementation(callback => {
    progress = callback
    return vi.fn()
  })
  vi.stubGlobal('window', { imkey: bridge })
  vi.stubGlobal('document', { addEventListener: vi.fn(), removeEventListener: vi.fn() })
})
async function offerSoftwareUpdate(update: ReturnType<typeof useSoftwareUpdate>) {
  await update.checkSoftUpdate()
  message({ action: 'updateAva', updateInfo: { version: '2.2.1' } })
}
async function mounted() {
  for (const callback of mocks.mounted) await callback()
  await vi.waitFor(() => expect(mocks.call).toHaveBeenCalled())
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('firmware failures preserve the failing step', () => {
  for (const [method, stage] of [
    ['connectDevice', 'connect'],
    ['cosUpdate', 'update'],
    ['deviceBindAcquire', 'bind'],
    ['importBindCode', 'store'],
    ['writeWalletAddress', 'restore']
  ]) {
    it(`shows ${method} errors`, async () => {
      mocks.call.mockImplementation(async name =>
        name === method ? { isSuccess: false, result: `${method}_failed` } : success(name)
      )
      const firmware = useFirmwareUpgrade('manager')
      await firmware.updateFirmware()
      expect(firmware.state.errorInfo).toBe(`${method}_failed`)
      expect(firmware.state.errorStage).toBe(stage)
      expect(firmware.state.supportCode).toBe(3)
      expect(firmware.state.busy).toBe(false)
    })
  }
})
describe('software updates fail visibly and support retry', () => {
  it('handles check rejection without an unhandled promise', async () => {
    bridge.updater.check.mockRejectedValueOnce(new Error('check unavailable'))
    const status = ref(1)
    const update = useSoftwareUpdate(status)
    await update.checkSoftUpdate()
    expect(status.value).toBe(2)
    expect(update.state.errorInfo).toBe('check unavailable')
    await update.retry()
    expect(bridge.updater.check).toHaveBeenCalledTimes(2)
    expect(update.state.errorInfo).toBe('')
  })
  it('consumes main-process error events', async () => {
    const status = ref(1)
    const update = useSoftwareUpdate(status)
    await update.checkSoftUpdate()
    message({ action: 'error', errorInfo: { message: 'update server unavailable' } })
    expect(update.state.errorInfo).toBe('update server unavailable')
    expect(status.value).toBe(2)
  })
  it('does not install after download rejection, and retries the download', async () => {
    bridge.updater.download.mockRejectedValueOnce(new Error('download unavailable'))
    const status = ref(4)
    const update = useSoftwareUpdate(status)
    await offerSoftwareUpdate(update)
    await update.updateNow()
    expect(update.state.errorInfo).toBe('download unavailable')
    expect(status.value).toBe(4)
    expect(bridge.updater.quitAndInstall).not.toHaveBeenCalled()
    await update.retry()
    expect(bridge.updater.download).toHaveBeenCalledTimes(2)
    expect(bridge.updater.quitAndInstall).toHaveBeenCalledOnce()
  })
  it('rejects invalid progress and ignores callbacks after unmount', async () => {
    let finish!: () => void
    bridge.updater.download.mockImplementation(
      () =>
        new Promise<void>(resolve => {
          finish = resolve
        })
    )
    const status = ref(4)
    const update = useSoftwareUpdate(status)
    await offerSoftwareUpdate(update)
    const downloading = update.updateNow()
    progress({ percent: NaN })
    expect(update.state.progress).toBe(0)
    progress({ percent: 110 })
    expect(update.state.progress).toBe(100)
    mocks.unmounted.forEach(callback => callback())
    progress({ percent: 50 })
    finish()
    await downloading
    expect(update.state.progress).toBe(100)
    expect(bridge.updater.quitAndInstall).not.toHaveBeenCalled()
  })
})
describe('settings and setup do not silently stop', () => {
  it('shows connection failure in settings', async () => {
    const settings = useSettings()
    await settings.init()
    expect(settings.state.errorInfo).toBe('device_not_connected')
    expect(settings.state.errorStage).toBe('connect')
    expect(settings.state.status).toBe(2)
  })
  it('shows binding-code read failure only when explicitly exporting from settings', async () => {
    mocks.call.mockImplementation(async method =>
      method === 'exportBindCode'
        ? { isSuccess: false, result: 'bind_file_unreadable' }
        : success(method)
    )
    const settings = useSettings()
    await settings.init()
    expect(settings.state.status).toBe(1)
    expect(mocks.call.mock.calls.some(([method]) => method === 'exportBindCode')).toBe(false)
    await settings.exportBindCode()
    expect(settings.state.errorInfo).toBe('bind_file_unreadable')
    expect(settings.state.errorStage).toBe('store')
    expect(settings.state.status).toBe(2)
  })
  it('shows activation failure and retries setup initialization', async () => {
    mocks.call.mockImplementation(async method =>
      method === 'activeDevice'
        ? { isSuccess: false, result: 'activation_unavailable' }
        : success(method)
    )
    const setup = useDeviceSetup()
    await mounted()
    expect(setup.errorInfo.value).toBe('activation_unavailable')
    expect(setup.errorStage.value).toBe('activate')
    await setup.retry()
    expect(mocks.call.mock.calls.filter(([method]) => method === 'activeDevice')).toHaveLength(2)
    expect(mocks.push).not.toHaveBeenCalled()
  })
  it('shows copy failure rather than reporting success', async () => {
    bridge.app.copyText.mockRejectedValue(new Error('clipboard unavailable'))
    const settings = useSettings()
    await settings.copyText()
    expect(settings.state.errorInfo).toBe('clipboard unavailable')
    expect(settings.state.copyTooltipDisabled).toBe(false)
  })
})

it('connection firmware reports the actual failed update cause', async () => {
  mocks.call.mockImplementation(async method =>
    method === 'cosUpdate' ? { isSuccess: false, result: 'cos_upgrade_failed' } : success(method)
  )
  const fail = vi.fn()
  const firmware = useConnectionFirmware(vi.fn(), fail, async () => {})
  await firmware.toCosUpdate()
  expect(fail).toHaveBeenCalledWith('cos_upgrade_failed', 5, 'update')
})
it('connection restoration awaits its continuation before finishing', async () => {
  mocks.call.mockImplementation(async method => success(method))
  let complete!: () => void
  const continuation = vi.fn(
    () =>
      new Promise<void>(resolve => {
        complete = resolve
      })
  )
  const firmware = useConnectionFirmware(vi.fn(), vi.fn(), continuation)
  let finished = false
  const recovery = firmware.toCosUpdate().then(() => {
    finished = true
  })
  await vi.waitFor(() => expect(continuation).toHaveBeenCalledOnce())
  expect(finished).toBe(false)
  complete()
  await recovery
  expect(finished).toBe(true)
})
it('settings metadata read failures do not imply a firmware update check', async () => {
  mocks.call.mockImplementation(async method =>
    method === 'getFirmwareVersion'
      ? { isSuccess: false, result: 'get_firmware_version_error' }
      : success(method)
  )
  const settings = useSettings()
  await settings.init()
  expect(settings.state.status).toBe(1)
  expect(settings.state.initializing).toBe(false)
  expect(settings.state.checkingUpdate).toBe(false)
  expect(settings.state.firmwareChecked).toBe(false)
  expect(settings.state.errorInfo).toBe('get_firmware_version_error')
  expect(mocks.call.mock.calls.some(([method]) => method === 'cosCheckUpdate')).toBe(false)
  expect(bridge.app.isOnline).not.toHaveBeenCalled()
})
it('setup wallet readiness failures stay on the setup page and support retry', async () => {
  mocks.call.mockImplementation(async method =>
    method === 'getBTCXpub'
      ? { isSuccess: false, result: 'imkey_wallet_not_created' }
      : success(method)
  )
  const setup = useDeviceSetup()
  setup.finish.value = true
  await setup.send({ page: 0, active: 0, isNext: true })
  expect(setup.errorInfo.value).toBe('imkey_wallet_not_created')
  expect(setup.errorStage.value).toBe('wallet')
  expect(mocks.push).not.toHaveBeenCalled()
  await setup.retry()
  expect(mocks.call.mock.calls.filter(([method]) => method === 'getBTCXpub')).toHaveLength(2)
})

it('setup completion verifies wallet readiness and confirms the same device before entering home', async () => {
  mocks.call.mockImplementation(async method => success(method))
  const setup = useDeviceSetup()
  setup.finish.value = true
  await setup.send({ page: 0, active: 0, isNext: false })
  expect(mocks.call.mock.calls.map(([method]) => method)).toEqual([
    'connectDevice',
    'getSeid',
    'getBTCXpub',
    'getSeid'
  ])
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/home/welcomeHome')
  expect(useDeviceStore().canEnterHome).toBe(true)
})

it('setup completion refuses a device replacement after a successful wallet read', async () => {
  let walletRead = false
  mocks.call.mockImplementation(async method => {
    if (method === 'getBTCXpub') walletRead = true
    return method === 'getSeid' && walletRead
      ? { isSuccess: true, result: 'REPLACEMENT' }
      : success(method)
  })
  const setup = useDeviceSetup()
  setup.finish.value = true
  await setup.send({ page: 0, active: 0, isNext: false })
  expect(setup.errorInfo.value).toBe('device_session_changed')
  expect(setup.errorStage.value).toBe('connect')
  expect(useDeviceStore().canEnterHome).toBe(false)
  expect(mocks.push).not.toHaveBeenCalled()
})

it.each(['', 'not-a-wallet'])('an unready wallet (%s) cannot finish setup', async value => {
  mocks.call.mockImplementation(async method =>
    method === 'getBTCXpub' ? { isSuccess: true, result: value } : success(method)
  )
  const setup = useDeviceSetup()
  setup.finish.value = true
  await setup.send({ page: 0, active: 0, isNext: false })
  expect(setup.errorInfo.value).toBe('imkey_wallet_not_created')
  expect(mocks.push).not.toHaveBeenCalled()
})

it('a changed device binding prevents completion', async () => {
  mocks.call.mockImplementation(async method =>
    method === 'getBTCXpub'
      ? { isSuccess: false, result: 'device_bind_check_failed' }
      : success(method)
  )
  const setup = useDeviceSetup()
  setup.finish.value = true
  await setup.send({ page: 0, active: 0, isNext: false })
  expect(setup.errorInfo.value).toBe('device_bind_check_failed')
  expect(mocks.push).not.toHaveBeenCalled()
})

it('error details preserve safe operation IDs for log correlation', () => {
  expect(operationError({ result: 'get_seid_error', operationId: 'op-123' })).toBe(
    'get_seid_error [op-123]'
  )
  expect(operationError({ result: 'get_seid_error', operationId: 'unsafe/operation' })).toBe(
    'get_seid_error'
  )
  expect(operationError({ result: '', operationId: 'op-123' })).toBe('operation_failed [op-123]')
})

it('delayed home installation is cancelled by later and unmount', async () => {
  vi.useFakeTimers()
  try {
    const update = useSoftwareUpdate(ref(4), { installDelayMs: 5000 })
    await offerSoftwareUpdate(update)
    await update.updateNow()
    expect(bridge.updater.quitAndInstall).not.toHaveBeenCalled()
    expect(update.state.busy).toBe(false)
    update.later()
    await vi.advanceTimersByTimeAsync(5000)
    expect(bridge.updater.quitAndInstall).not.toHaveBeenCalled()
    await update.updateNow()
    mocks.unmounted.forEach(callback => callback())
    await vi.advanceTimersByTimeAsync(5000)
    expect(bridge.updater.quitAndInstall).not.toHaveBeenCalled()
  } finally {
    vi.useRealTimers()
  }
})
it('home updater ignores events while settings owns the UI', async () => {
  let enabled = true
  const status = ref(1)
  const update = useSoftwareUpdate(status, { isEnabled: () => enabled })
  await update.checkSoftUpdate()
  enabled = false
  message({ action: 'error', errorInfo: { message: 'settings error' } })
  message({ action: 'updateAva', updateInfo: { version: '2.2.1' } })
  expect(status.value).toBe(1)
  expect(update.state.errorInfo).toBe('')
  enabled = true
  message({
    action: 'updateAva',
    updateInfo: { version: '2.2.1', releaseNotes: '[{info:"Release note"}]' }
  })
  expect(status.value).toBe(6)
  expect(update.state.softUpdateInfo).toEqual([{ id: 0, info: 'Release note' }])
})
it('updater error events during a successful download response prevent installation', async () => {
  const update = useSoftwareUpdate(ref(4))
  await offerSoftwareUpdate(update)
  bridge.updater.download.mockImplementation(async () => {
    message({ action: 'error', errorInfo: { message: 'download integrity failed' } })
  })
  await update.updateNow()
  expect(update.state.errorInfo).toBe('download integrity failed')
  expect(bridge.updater.quitAndInstall).not.toHaveBeenCalled()
})
