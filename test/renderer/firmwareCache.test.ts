import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDeviceStore } from '../../src/renderer/store/device'
import { useSettings } from '../../src/renderer/composables/useSettings'
import { useAppManagement } from '../../src/renderer/composables/useAppManagement'
import type { DeviceResult } from '../../src/shared/deviceContract'

const mocks = vi.hoisted(() => ({ call: vi.fn(), offer: vi.fn() }))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: mocks.offer })
}))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: vi.fn(),
  onUnmounted: vi.fn()
}))
let now: number
let seid: string
let installedCos: string
let latestCos: string
let failCheck: boolean
function methods() {
  return mocks.call.mock.calls.map(([method]) => method)
}
function response(method: string): DeviceResult {
  const app = { name: 'Ethereum', installedVersion: null, latestVersion: '1.0', icon: '' }
  const values: Record<string, unknown> = {
    connectDevice: 'success',
    getSeid: seid,
    getUpgradeSeid: seid,
    isBLStatus: false,
    getBTCXpub: 'xpub-ready',
    deviceBindCheck: 'bound_this',
    getFirmwareVersion: installedCos,
    getBleVersion: '3.0.03',
    getSn: 'TEST-SN',
    exportBindCode: 'A2345678',
    checkUpdate: { status: 'latest', total: 1, list: [app] },
    getInstalledApplets: { status: 'latest', total: 0, list: [] },
    cosCheckUpdate: {
      latestCosVersion: latestCos,
      latestBleVersion: '3.0.03',
      isLatest: installedCos === latestCos,
      isUpdateSuccess: true
    }
  }
  if (method === 'cosCheckUpdate' && failCheck)
    return { isSuccess: false, result: 'imkey_tsm_check_update_fail' }
  if (method === 'cosUpdate') installedCos = latestCos
  return { isSuccess: true, result: values[method] ?? 'success' }
}
beforeEach(() => {
  setActivePinia(createPinia())
  now = 100000
  seid = 'TEST-SEID'
  installedCos = latestCos = '1.0.0'
  failCheck = false
  vi.spyOn(Date, 'now').mockImplementation(() => now)
  Object.assign(useDeviceStore(), { connectedSeid: seid, identityReady: true })
  mocks.call.mockReset().mockImplementation(async (method: string) => response(method))
  mocks.offer.mockReset()
  vi.stubGlobal('window', { imkey: { app: { isOnline: async () => true } } })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it('reuses the device page check on app entry while retaining identity and binding checks', async () => {
  const settings = useSettings()
  await settings.init()
  await settings.checkUpdate()
  mocks.call.mockClear()
  const apps = useAppManagement()
  await apps.init()
  expect(methods()).toContain('deviceBindCheck')
  expect(methods()).toContain('getSeid')
  expect(methods()).not.toContain('cosCheckUpdate')
  expect(methods()).not.toContain('getFirmwareVersion')
  expect(methods()).not.toContain('exportBindCode')
  mocks.call.mockClear()
  await useAppManagement().init()
  expect(methods()).toEqual(['connectDevice', 'getSeid', 'deviceBindCheck'])
})

it('publishes a refreshed app result to the existing device metadata snapshot', async () => {
  const settings = useSettings()
  await settings.init()
  await settings.checkUpdate()
  latestCos = '1.1.0'
  now += 5 * 60 * 1000
  await useAppManagement().init()
  expect(useDeviceStore().firmwareInfo?.latestFirmwareVersion).toBe('1.1.0')
  expect(useDeviceStore().deviceInfo?.updateAvailable).toBe(true)
  mocks.call.mockClear()
  const returned = useSettings()
  await returned.init()
  expect(returned.state.firmwareChecked).toBe(true)
  expect(returned.firmware.state.isCosUpdate).toBe(true)
  expect(returned.firmware.state.cosNewVersionData).toBe('1.1.0')
  expect(mocks.call).not.toHaveBeenCalled()
})

it('uses an application check when entering the device page for the first time', async () => {
  latestCos = '1.1.0'
  await useAppManagement().init()
  mocks.call.mockClear()
  const settings = useSettings()
  await settings.init()
  expect(settings.state.firmwareChecked).toBe(true)
  expect(settings.firmware.state.isCosUpdate).toBe(true)
  expect(methods()).not.toContain('cosCheckUpdate')
  expect(methods()).toContain('getSeid')
})

it('manual checks always query the service and never turn a rejection into latest', async () => {
  const settings = useSettings()
  await settings.init()
  latestCos = '1.1.0'
  await settings.checkUpdate()
  failCheck = true
  mocks.call.mockClear()
  await settings.checkUpdate()
  expect(methods()).toContain('cosCheckUpdate')
  expect(settings.firmware.state.cosUpdateStatus).toBe('2')
  expect(settings.firmware.state.errorInfo).toBe('imkey_tsm_check_update_fail')
  expect(useDeviceStore().firmwareInfo).toBeNull()
  expect(useDeviceStore().deviceInfo?.firmwareChecked).toBe(false)
  const returned = useSettings()
  expect(returned.state.firmwareChecked).toBe(false)
  expect(returned.firmware.state.isCosUpdate).toBe(false)
})

it('a successful upgrade invalidates cached checks and the next explicit check can show latest', async () => {
  const settings = useSettings()
  await settings.init()
  latestCos = '1.1.0'
  await settings.checkUpdate()
  await settings.firmware.updateFirmware()
  expect(settings.firmware.state.supportCode).toBe(2)
  expect(useDeviceStore().firmwareInfo).toBeNull()
  expect(installedCos).toBe('1.1.0')
  settings.firmware.changeCode(0)
  mocks.call.mockClear()
  await settings.checkUpdate()
  expect(methods()).toContain('cosCheckUpdate')
  expect(settings.state.firmwareChecked).toBe(true)
  expect(settings.firmware.state.isCosUpdate).toBe(false)
  expect(settings.firmware.state.errorInfo).toBe('')
  expect(settings.firmware.state.cosOldVersionData).toBe('1.1.0')
})

it('a replacement during the app query cannot publish an update under the previous device', async () => {
  mocks.call.mockImplementation(async (method: string) => {
    const result = response(method)
    if (method === 'cosCheckUpdate') seid = 'REPLACEMENT'
    return result
  })
  await useAppManagement().init()
  expect(useDeviceStore().firmwareInfo).toBeNull()
  expect(useDeviceStore().identityReady).toBe(false)
  expect(mocks.offer).toHaveBeenCalledWith('device_session_changed', expect.any(Function), {
    reconnectOnly: true
  })
})

it.each(
  (['settings', 'apps'] as const).flatMap(page =>
    (['cosUpdate', 'deviceBindAcquire'] as const).map(failedMethod => ({ page, failedMethod }))
  )
)(
  '$page initialization preserves a pending $failedMethod recovery without requiring normal metadata',
  async ({ page, failedMethod }) => {
    latestCos = '1.1.0'
    let failed = false
    let blockedMetadata = false
    let bootloader = false
    let binding = 'bound_this'
    const metadataMethods = [
      'getSn',
      'getFirmwareVersion',
      'getBleVersion',
      'checkUpdate',
      'cosCheckUpdate'
    ]
    mocks.call.mockImplementation(async (method: string): Promise<DeviceResult> => {
      if (blockedMetadata && metadataMethods.includes(method))
        return { isSuccess: false, result: 'metadata_unavailable_during_recovery' }
      if (method === 'getSeid' && bootloader)
        return { isSuccess: false, result: 'get_seid_unavailable_in_bootloader' }
      if (method === 'deviceBindCheck') return { isSuccess: true, result: binding }
      if (method === 'isBLStatus') return { isSuccess: true, result: bootloader }
      if (method === failedMethod && !failed) {
        failed = true
        bootloader = method === 'cosUpdate'
        binding = 'unbound'
        return { isSuccess: false, result: 'interrupted_upgrade' }
      }
      if (method === 'cosUpdate') bootloader = false
      if (method === 'deviceBindAcquire') binding = 'bound_this'
      return response(method)
    })
    const first = useAppManagement()
    await first.init()
    expect(first.state.errorInfo).toBe('')
    await first.firmware.updateFirmware()
    expect(first.firmware.state).toMatchObject({
      supportCode: 3,
      busy: false,
      errorStage: failedMethod === 'cosUpdate' ? 'update' : 'bind'
    })
    const device = useDeviceStore()
    const sessionId = device.sessionId
    device.deviceInfo = null
    device.apps = []
    device.isFirstGoToManagerPage = true
    blockedMetadata = true
    mocks.call.mockClear()
    const reopened = page === 'settings' ? useSettings() : useAppManagement()
    await reopened.init()
    expect(device.sessionId).toBe(sessionId)
    expect(reopened.state.errorInfo).toBe('')
    expect(mocks.offer).not.toHaveBeenCalled()
    expect(reopened.firmware.state).toMatchObject({
      isCosUpdate: true,
      cosUpdateStatus: '1',
      bindCode: 'A2345678',
      cosNewVersionData: '1.1.0'
    })
    expect(methods()).toEqual(['connectDevice', 'getUpgradeSeid'])
    if ('firmwareChecked' in reopened.state) {
      expect(reopened.state.firmwareChecked).toBe(true)
      expect(reopened.state.initializing).toBe(false)
      expect(reopened.state.status).toBe(1)
    }
    blockedMetadata = false
    mocks.call.mockClear()
    await reopened.firmware.updateFirmware()
    expect(methods().slice(0, 2)).toEqual(['connectDevice', 'getUpgradeSeid'])
    expect(methods().filter(method => method === 'cosUpdate')).toHaveLength(
      failedMethod === 'cosUpdate' ? 1 : 0
    )
    if (failedMethod === 'deviceBindAcquire') {
      expect(methods()).toContain('isBLStatus')
      expect(methods()).toContain('getFirmwareVersion')
      expect(methods()).toContain('getBleVersion')
    }
    expect(methods()).not.toContain('exportBindCode')
    expect(reopened.firmware.state).toMatchObject({
      supportCode: 2,
      recovering: false,
      busy: false
    })
    expect(device.sessionId).toBe(sessionId)
  }
)
