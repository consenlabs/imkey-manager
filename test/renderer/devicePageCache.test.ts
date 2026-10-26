import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useSettings } from '../../src/renderer/composables/useSettings'
import { useDeviceStore } from '../../src/renderer/store/device'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string) => Promise<DeviceResult>>(),
  online: vi.fn<() => Promise<boolean>>(),
  offer: vi.fn(),
  unmounted: [] as (() => void)[]
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: mocks.offer, returnToConnection: vi.fn() })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  getCurrentInstance: () => ({}),
  onMounted: vi.fn(),
  onUnmounted: (callback: () => void) => mocks.unmounted.push(callback)
}))
let seid: string
let firmwareVersion: string
let bleVersion: string
let latestFirmware: string
let latestBle: string
function count(method: string) {
  return mocks.call.mock.calls.filter(([name]) => name === method).length
}
beforeEach(() => {
  setActivePinia(createPinia())
  seid = 'SEID-A'
  firmwareVersion = latestFirmware = '1.0.0'
  bleVersion = latestBle = '2.0.0'
  useDeviceStore().connectedSeid = seid
  mocks.unmounted.length = 0
  mocks.online.mockReset().mockResolvedValue(true)
  mocks.offer.mockReset()
  mocks.call.mockReset().mockImplementation(async method => {
    if (method === 'getSeid') return { isSuccess: true, result: seid }
    if (method === 'deviceBindCheck') return { isSuccess: true, result: 'bound_this' }
    if (method === 'exportBindCode') return { isSuccess: true, result: 'test-binding-code' }
    if (method === 'getSn') return { isSuccess: true, result: `SN-${seid}` }
    if (method === 'getFirmwareVersion') return { isSuccess: true, result: firmwareVersion }
    if (method === 'getBleVersion') return { isSuccess: true, result: bleVersion }
    if (method === 'cosCheckUpdate')
      return {
        isSuccess: true,
        result: {
          latestCosVersion: latestFirmware,
          latestBleVersion: latestBle,
          isLatest: firmwareVersion === latestFirmware && bleVersion === latestBle
        }
      }
    return { isSuccess: true, result: 'success' }
  })
  vi.stubGlobal('window', { imkey: { app: { isOnline: mocks.online } } })
})
afterEach(() => vi.unstubAllGlobals())

it('reads device details and firmware once, then reuses cache following identity confirmation', async () => {
  const first = useSettings()
  await first.init()
  expect(first.state.status).toBe(1)
  expect(useDeviceStore().deviceInfo).toMatchObject({
    seid: 'SEID-A',
    sn: 'SN-SEID-A',
    updateAvailable: false
  })
  expect(count('cosCheckUpdate')).toBe(1)
  expect(count('getSn')).toBe(1)
  const second = useSettings()
  expect(second.state.SN).toBe('')
  expect(useDeviceStore().identityReady).toBe(false)
  await second.init()
  expect(second.state.SN).toBe('SN-SEID-A')
  expect(second.firmware.state.cosOldVersionData).toBe('1.0.0')
  expect(count('cosCheckUpdate')).toBe(1)
  expect(count('getFirmwareVersion')).toBe(1)
  expect(count('getBleVersion')).toBe(1)
  expect(count('getSn')).toBe(1)
  expect(mocks.online).toHaveBeenCalledOnce()
  expect(count('checkDevice')).toBe(0)
  expect(count('deviceSnCheck')).toBe(0)
})

it('reuses valid cached details when offline without contacting the update service', async () => {
  const first = useSettings()
  await first.init()
  mocks.online.mockResolvedValue(false)
  const second = useSettings()
  await second.init()
  expect(second.state.status).toBe(1)
  expect(count('cosCheckUpdate')).toBe(1)
  expect(mocks.online).toHaveBeenCalledOnce()
})

it('manually refreshes firmware information while preserving verification metadata', async () => {
  const settings = useSettings()
  await settings.init()
  useDeviceStore().verification = {
    status: 'success',
    activationStatus: true,
    activatedAt: '2024-01-01',
    errorInfo: ''
  }
  latestFirmware = '1.1.0'
  const refreshing = settings.checkUpdate()
  expect(settings.state.checkingUpdate).toBe(true)
  await refreshing
  expect(settings.state.checkingUpdate).toBe(false)
  expect(count('cosCheckUpdate')).toBe(2)
  expect(settings.firmware.state.isCosUpdate).toBe(true)
  expect(useDeviceStore().deviceInfo?.latestFirmwareVersion).toBe('1.1.0')
  expect(useDeviceStore().verification.status).toBe('success')
})

it.each(['firmware', 'ble'] as const)(
  'invalidates cached details after a known %s version change',
  async kind => {
    const first = useSettings()
    await first.init()
    if (kind === 'firmware') {
      useDeviceStore().cosOldVersionData = firmwareVersion = latestFirmware = '1.1.0'
    } else {
      useDeviceStore().installedBleVersion = bleVersion = latestBle = '2.1.0'
    }
    const second = useSettings()
    await second.init()
    expect(count('cosCheckUpdate')).toBe(2)
    expect(useDeviceStore().deviceInfo?.firmwareVersion).toBe(firmwareVersion)
    expect(useDeviceStore().deviceInfo?.bleVersion).toBe(bleVersion)
  }
)

it('hides cached information while identity is pending and clears it when another device appears', async () => {
  const first = useSettings()
  await first.init()
  useDeviceStore().verification = {
    status: 'success',
    activationStatus: true,
    activatedAt: '2024-01-01',
    errorInfo: ''
  }
  let release!: (value: DeviceResult) => void
  mocks.call.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        release = resolve
      })
  )
  const second = useSettings()
  const pending = second.init()
  await vi.waitFor(() => expect(release).toBeTypeOf('function'))
  expect(second.state.SN).toBe('')
  expect(second.state.status).toBe(3)
  expect(useDeviceStore().identityReady).toBe(false)
  expect(second.secureCheck.state.status).toBe('idle')
  seid = 'SEID-B'
  release({ isSuccess: true, result: 'success' })
  await pending
  expect(second.state.status).toBe(2)
  expect(second.state.SN).toBe('')
  expect(useDeviceStore().deviceInfo).toBeNull()
  expect(useDeviceStore().verification.status).toBe('idle')
  expect(count('cosCheckUpdate')).toBe(1)
  expect(mocks.offer).toHaveBeenLastCalledWith(expect.anything(), expect.any(Function), {
    reconnectOnly: true
  })
})

it('does not cache failed update checks and allows a later successful retry to populate the cache', async () => {
  const normal = mocks.call.getMockImplementation()!
  let fail = true
  mocks.call.mockImplementation(async method =>
    method === 'cosCheckUpdate' && fail
      ? { isSuccess: false, result: 'network_unavailable' }
      : normal(method)
  )
  const settings = useSettings()
  await settings.init()
  expect(useDeviceStore().deviceInfo).toBeNull()
  expect(settings.firmware.state.errorInfo).toBe('network_unavailable')
  fail = false
  await settings.checkUpdate()
  expect(settings.firmware.state.errorInfo).toBe('')
  expect(useDeviceStore().deviceInfo).toMatchObject({ seid: 'SEID-A', sn: 'SN-SEID-A' })
})

it('discards details if the device changes while the update request is in flight', async () => {
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(async method => {
    if (method === 'cosCheckUpdate') seid = 'SEID-B'
    return normal(method)
  })
  const settings = useSettings()
  await settings.init()
  expect(settings.state.SN).toBe('')
  expect(settings.state.status).toBe(2)
  expect(useDeviceStore().deviceInfo).toBeNull()
})

it('does not publish cached details after the page is disposed during a request', async () => {
  let release!: (value: DeviceResult) => void
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(method =>
    method === 'cosCheckUpdate'
      ? new Promise(resolve => {
          release = resolve
        })
      : normal(method)
  )
  const settings = useSettings()
  const pending = settings.init()
  await vi.waitFor(() => expect(release).toBeTypeOf('function'))
  mocks.unmounted.forEach(callback => callback())
  release({ isSuccess: true, result: { latestCosVersion: '1.0.0', latestBleVersion: '2.0.0' } })
  await pending
  expect(useDeviceStore().deviceInfo).toBeNull()
})

it('does not publish details from an obsolete session after a pending update response', async () => {
  let release!: (value: DeviceResult) => void
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(method =>
    method === 'cosCheckUpdate'
      ? new Promise(resolve => {
          release = resolve
        })
      : normal(method)
  )
  const settings = useSettings()
  const pending = settings.init()
  await vi.waitFor(() => expect(release).toBeTypeOf('function'))
  useDeviceStore().invalidateDeviceData()
  release({ isSuccess: true, result: { latestCosVersion: '1.0.0', latestBleVersion: '2.0.0' } })
  await pending
  expect(useDeviceStore().deviceInfo).toBeNull()
  expect(useDeviceStore().identityReady).toBe(false)
})
