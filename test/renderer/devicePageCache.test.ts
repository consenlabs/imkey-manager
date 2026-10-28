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

it('reads device information once and restores it synchronously without any calls on reentry', async () => {
  const first = useSettings()
  await first.init()
  expect(first.state.status).toBe(1)
  expect(useDeviceStore().deviceInfo).toMatchObject({
    seid: 'SEID-A',
    sn: 'SN-SEID-A',
    updateAvailable: false,
    firmwareChecked: false
  })
  expect(count('cosCheckUpdate')).toBe(0)
  expect(first.state.firmwareChecked).toBe(false)
  expect(count('getSn')).toBe(1)
  const callsBeforeReentry = mocks.call.mock.calls.length
  const second = useSettings()
  expect(second.state).toMatchObject({ SN: 'SN-SEID-A', initializing: false })
  expect(useDeviceStore().identityReady).toBe(true)
  expect(useDeviceStore().identityChecking).toBe(false)
  await second.init()
  expect(mocks.call).toHaveBeenCalledTimes(callsBeforeReentry)
  expect(second.state.SN).toBe('SN-SEID-A')
  expect(second.firmware.state.cosOldVersionData).toBe('1.0.0')
  expect(count('cosCheckUpdate')).toBe(0)
  expect(second.state.firmwareChecked).toBe(false)
  expect(count('getFirmwareVersion')).toBe(1)
  expect(count('getBleVersion')).toBe(1)
  expect(count('getSn')).toBe(1)
  expect(mocks.online).not.toHaveBeenCalled()
  expect(count('checkDevice')).toBe(0)
  expect(count('deviceSnCheck')).toBe(0)
  expect(count('exportBindCode')).toBe(0)
})

it('reads and reuses device information while offline without contacting the update service', async () => {
  mocks.online.mockResolvedValue(false)
  const first = useSettings()
  await first.init()
  expect(first.state.SN).toBe('SN-SEID-A')
  expect(first.state.firmwareChecked).toBe(false)
  const second = useSettings()
  await second.init()
  expect(second.state.status).toBe(1)
  expect(count('cosCheckUpdate')).toBe(0)
  expect(mocks.online).not.toHaveBeenCalled()
})

it.each(['identity-not-ready', 'different-seid', 'new-session'])(
  'reads the device again when the previous cache is unusable: %s',
  async reason => {
    const first = useSettings()
    await first.init()
    const device = useDeviceStore()
    if (reason === 'identity-not-ready') device.identityReady = false
    else if (reason === 'different-seid') device.connectedSeid = seid = 'SEID-B'
    else device.invalidateDeviceData()
    mocks.call.mockClear()
    const second = useSettings()
    expect(second.state).toMatchObject({ initializing: true, SN: '' })
    await second.init()
    expect(count('connectDevice')).toBeGreaterThan(0)
    expect(count('getFirmwareVersion')).toBe(1)
    expect(count('getBleVersion')).toBe(1)
    expect(second.state).toMatchObject({ initializing: false, SN: `SN-${seid}` })
    expect(device.deviceInfo?.seid).toBe(seid)
    expect(count('exportBindCode')).toBe(0)
  }
)

it('reloads metadata on the first entry after a successful firmware upgrade clears the cache', async () => {
  const first = useSettings()
  await first.init()
  latestFirmware = '1.1.0'
  await first.checkUpdate()
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(async method => {
    if (method === 'getInstalledApplets') return { isSuccess: true, result: { list: [] } }
    if (method === 'cosUpdate') firmwareVersion = latestFirmware
    return normal(method)
  })
  await first.firmware.updateFirmware()
  expect(first.firmware.state.supportCode).toBe(2)
  expect(useDeviceStore().deviceInfo).toBeNull()
  mocks.call.mockClear()
  const second = useSettings()
  expect(second.state.initializing).toBe(true)
  await second.init()
  expect(count('getFirmwareVersion')).toBe(1)
  expect(count('getSn')).toBe(1)
  expect(second.firmware.state.cosOldVersionData).toBe('1.1.0')
  expect(useDeviceStore().deviceInfo?.firmwareVersion).toBe('1.1.0')
})

it('checks firmware using only SEID and version reads without binding or authenticity checks', async () => {
  const settings = useSettings()
  await settings.init()
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockClear().mockImplementation(async method => {
    if (method === 'deviceBindCheck') throw new Error('Binding must not be checked')
    return normal(method)
  })
  await settings.checkUpdate()
  expect(mocks.call.mock.calls.map(([method]) => method)).toEqual([
    'connectDevice',
    'getSeid',
    'getBleVersion',
    'getFirmwareVersion',
    'cosCheckUpdate',
    'connectDevice',
    'getSeid'
  ])
  expect(settings.state.firmwareChecked).toBe(true)
  expect(useDeviceStore().deviceInfo?.firmwareChecked).toBe(true)
  expect(useDeviceStore().verification.status).toBe('idle')
})

it.each(['before', 'during'])(
  'still rejects a device replacement %s a firmware check without checking binding',
  async timing => {
    const settings = useSettings()
    await settings.init()
    const normal = mocks.call.getMockImplementation()!
    mocks.call.mockClear().mockImplementation(async method => {
      const result = await normal(method)
      if (timing === 'during' && method === 'cosCheckUpdate') seid = 'SEID-B'
      return result
    })
    if (timing === 'before') seid = 'SEID-B'
    await settings.checkUpdate()
    expect(count('deviceBindCheck')).toBe(0)
    expect(count('checkDevice')).toBe(0)
    expect(count('deviceSnCheck')).toBe(0)
    expect(count('cosCheckUpdate')).toBe(timing === 'before' ? 0 : 1)
    expect(useDeviceStore().deviceInfo).toBeNull()
    expect(settings.state.SN).toBe('')
    expect(mocks.offer).toHaveBeenCalledWith(
      expect.objectContaining({ result: 'device_session_changed' }),
      expect.any(Function),
      { reconnectOnly: true }
    )
  }
)

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
  expect(count('cosCheckUpdate')).toBe(1)
  expect(settings.state.firmwareChecked).toBe(true)
  expect(settings.firmware.state.isCosUpdate).toBe(true)
  expect(useDeviceStore().deviceInfo?.latestFirmwareVersion).toBe('1.1.0')
  expect(useDeviceStore().verification.status).toBe('success')
})

it.each(['firmware', 'ble'] as const)(
  'invalidates cached details after a known %s version change',
  async kind => {
    const first = useSettings()
    await first.init()
    await first.checkUpdate()
    expect(first.state.firmwareChecked).toBe(true)
    if (kind === 'firmware') {
      useDeviceStore().cosOldVersionData = firmwareVersion = latestFirmware = '1.1.0'
    } else {
      useDeviceStore().installedBleVersion = bleVersion = latestBle = '2.1.0'
    }
    const second = useSettings()
    await second.init()
    expect(count('cosCheckUpdate')).toBe(1)
    expect(second.state.firmwareChecked).toBe(false)
    expect(useDeviceStore().deviceInfo?.firmwareChecked).toBe(false)
    expect(useDeviceStore().deviceInfo?.firmwareVersion).toBe(firmwareVersion)
    expect(useDeviceStore().deviceInfo?.bleVersion).toBe(bleVersion)
  }
)

it('shows cached information on reentry and detects a replacement only on an explicit check', async () => {
  const first = useSettings()
  await first.init()
  await first.checkUpdate()
  useDeviceStore().verification = {
    status: 'success',
    activationStatus: true,
    activatedAt: '2024-01-01',
    errorInfo: ''
  }
  const callsBeforeReentry = mocks.call.mock.calls.length
  seid = 'SEID-B'
  const second = useSettings()
  expect(second.state).toMatchObject({
    SN: 'SN-SEID-A',
    status: 1,
    initializing: false,
    checkingUpdate: false
  })
  await second.init()
  expect(mocks.call).toHaveBeenCalledTimes(callsBeforeReentry)
  expect(useDeviceStore().identityReady).toBe(true)
  expect(second.secureCheck.state.status).toBe('success')
  await second.checkUpdate()
  expect(second.state.status).toBe(2)
  expect(second.state.initializing).toBe(false)
  expect(second.state.checkingUpdate).toBe(false)
  expect(second.state.SN).toBe('')
  expect(useDeviceStore().deviceInfo).toBeNull()
  expect(useDeviceStore().verification.status).toBe('idle')
  expect(second.state.firmwareChecked).toBe(false)
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
  expect(settings.state.firmwareChecked).toBe(false)
  await settings.checkUpdate()
  expect(settings.state.firmwareChecked).toBe(true)
  expect(useDeviceStore().deviceInfo).toMatchObject({
    seid: 'SEID-A',
    firmwareChecked: false,
    updateAvailable: false
  })
  expect(settings.firmware.state.errorInfo).toBe('network_unavailable')
  fail = false
  await settings.checkUpdate()
  expect(settings.firmware.state.errorInfo).toBe('')
  expect(useDeviceStore().deviceInfo).toMatchObject({ seid: 'SEID-A', sn: 'SN-SEID-A' })
})

it.each(['offline', 'cosCheckUpdate', 'getFirmwareVersion'])(
  'keeps metadata for a silent reentry after a manual %s failure without retaining a stale update result',
  async failure => {
    const first = useSettings()
    await first.init()
    latestFirmware = '1.1.0'
    await first.checkUpdate()
    expect(useDeviceStore().deviceInfo?.updateAvailable).toBe(true)
    if (failure === 'offline') mocks.online.mockResolvedValue(false)
    else {
      const normal = mocks.call.getMockImplementation()!
      mocks.call.mockImplementation(async method =>
        method === failure ? { isSuccess: false, result: 'network_unavailable' } : normal(method)
      )
    }
    await first.checkUpdate()
    expect(useDeviceStore().deviceInfo).toMatchObject({
      seid: 'SEID-A',
      sn: 'SN-SEID-A',
      firmwareVersion: '1.0.0',
      bleVersion: '2.0.0',
      firmwareChecked: false,
      latestFirmwareVersion: '',
      latestBleVersion: '',
      updateAvailable: false
    })
    mocks.call.mockClear()
    mocks.online.mockClear()
    const second = useSettings()
    expect(second.state).toMatchObject({
      initializing: false,
      SN: 'SN-SEID-A',
      firmwareChecked: false
    })
    await second.init()
    expect(mocks.call).not.toHaveBeenCalled()
    expect(mocks.online).not.toHaveBeenCalled()
    expect(second.firmware.state).toMatchObject({
      cosOldVersionData: '1.0.0',
      cosNewVersionData: '',
      bleNewVersionData: '',
      isCosUpdate: false,
      cosUpdateStatus: '0'
    })
  }
)

it('discards details if the device changes while the update request is in flight', async () => {
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(async method => {
    if (method === 'cosCheckUpdate') seid = 'SEID-B'
    return normal(method)
  })
  const settings = useSettings()
  await settings.init()
  await settings.checkUpdate()
  expect(settings.state.SN).toBe('')
  expect(settings.state.status).toBe(2)
  expect(useDeviceStore().deviceInfo).toBeNull()
})

it('does not publish cached details after the page is disposed during a request', async () => {
  let release!: (value: DeviceResult) => void
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(method =>
    method === 'getFirmwareVersion'
      ? new Promise(resolve => {
          release = resolve
        })
      : normal(method)
  )
  const settings = useSettings()
  const pending = settings.init()
  await vi.waitFor(() => expect(release).toBeTypeOf('function'))
  mocks.unmounted.forEach(callback => callback())
  release({ isSuccess: true, result: '1.0.0' })
  await pending
  expect(useDeviceStore().deviceInfo).toBeNull()
})

it('does not publish details from an obsolete session after a pending metadata response', async () => {
  let release!: (value: DeviceResult) => void
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(method =>
    method === 'getFirmwareVersion'
      ? new Promise(resolve => {
          release = resolve
        })
      : normal(method)
  )
  const settings = useSettings()
  const pending = settings.init()
  await vi.waitFor(() => expect(release).toBeTypeOf('function'))
  useDeviceStore().invalidateDeviceData()
  release({ isSuccess: true, result: '1.0.0' })
  await pending
  expect(useDeviceStore().deviceInfo).toBeNull()
  expect(useDeviceStore().identityReady).toBe(false)
})

it.each(['connectDevice', 'cosCheckUpdate'])(
  'keeps page content and verification visible while a manual %s check is pending',
  async delayedMethod => {
    const settings = useSettings()
    await settings.init()
    useDeviceStore().verification = {
      status: 'success',
      activationStatus: true,
      activatedAt: '2024-01-01',
      errorInfo: ''
    }
    const normal = mocks.call.getMockImplementation()!
    const before = count(delayedMethod)
    let release!: (value: DeviceResult) => void
    mocks.call.mockImplementation(method =>
      method === delayedMethod && !release
        ? new Promise(resolve => {
            release = resolve
          })
        : normal(method)
    )
    const pending = settings.checkUpdate()
    await vi.waitFor(() => expect(release).toBeTypeOf('function'))
    expect(settings.state).toMatchObject({ status: 1, SN: 'SN-SEID-A', checkingUpdate: true })
    expect(useDeviceStore().identityReady).toBe(true)
    expect(useDeviceStore().identityChecking).toBe(false)
    expect(settings.secureCheck.state.status).toBe('success')
    expect(settings.firmware.state.cosOldVersionData).toBe('1.0.0')
    expect(settings.checkUpdate()).toBeUndefined()
    expect(count(delayedMethod)).toBe(before + 1)
    release(await normal(delayedMethod))
    await pending
    expect(settings.state).toMatchObject({ status: 1, SN: 'SN-SEID-A', checkingUpdate: false })
  }
)

it('keeps the page after a manual offline failure and offers an explicit retry', async () => {
  const settings = useSettings()
  await settings.init()
  mocks.online.mockResolvedValue(false)
  await settings.checkUpdate()
  expect(settings.state).toMatchObject({ status: 1, SN: 'SN-SEID-A', checkingUpdate: false })
  expect(settings.firmware.state.cosUpdateStatus).toBe('2')
  expect(settings.state.firmwareChecked).toBe(true)
  expect(mocks.offer).toHaveBeenCalledExactlyOnceWith('network_unavailable', expect.any(Function))
  mocks.online.mockResolvedValue(true)
  await settings.checkUpdate()
  expect(settings.firmware.state.cosUpdateStatus).toBe('0')
  expect(settings.state.errorInfo).toBe('')
})

it('clears visible device details when explicit verification detects a replacement', async () => {
  const settings = useSettings()
  await settings.init()
  seid = 'SEID-B'
  await settings.secureCheck.check()
  expect(settings.state).toMatchObject({ status: 2, SN: '' })
  expect(useDeviceStore().deviceInfo).toBeNull()
  expect(settings.secureCheck.state.status).toBe('idle')
  expect(mocks.offer).toHaveBeenCalledOnce()
})

it('does not dismiss the software update state when a manual firmware check completes', async () => {
  const settings = useSettings()
  await settings.init()
  settings.state.status = 6
  await settings.checkUpdate()
  expect(settings.state.status).toBe(6)
  expect(settings.state.checkingUpdate).toBe(false)
})

it.each(['connectDevice', 'getFirmwareVersion'])(
  'initial %s checking stays on the device page and blocks duplicate actions',
  async delayedMethod => {
    const normal = mocks.call.getMockImplementation()!
    let release!: (value: DeviceResult) => void
    mocks.call.mockImplementation(method =>
      method === delayedMethod && !release
        ? new Promise(resolve => {
            release = resolve
          })
        : normal(method)
    )
    const settings = useSettings()
    const pending = settings.init()
    await vi.waitFor(() => expect(release).toBeTypeOf('function'))
    expect(settings.state).toMatchObject({ status: 1, initializing: true, checkingUpdate: false })
    expect(settings.checkUpdate()).toBeUndefined()
    expect(settings.exportBindCode()).toBeUndefined()
    await settings.init()
    expect(count(delayedMethod)).toBe(1)
    release(await normal(delayedMethod))
    await pending
    expect(settings.state).toMatchObject({
      status: 1,
      initializing: false,
      checkingUpdate: false,
      SN: 'SN-SEID-A'
    })
    expect(useDeviceStore().deviceInfo?.seid).toBe('SEID-A')
  }
)

it('keeps partially read information after an initial metadata failure and offers retry', async () => {
  const normal = mocks.call.getMockImplementation()!
  let fail = true
  mocks.call.mockImplementation(async method =>
    method === 'getSn' && fail ? { isSuccess: false, result: 'serial_read_failed' } : normal(method)
  )
  const settings = useSettings()
  await settings.init()
  expect(settings.state).toMatchObject({
    status: 1,
    initializing: false,
    checkingUpdate: false,
    SN: '',
    errorInfo: 'serial_read_failed'
  })
  expect(settings.firmware.state.bleOldVersionData).toBe('2.0.0')
  expect(settings.state.firmwareChecked).toBe(false)
  expect(useDeviceStore().deviceInfo).toBeNull()
  expect(mocks.offer).toHaveBeenCalledExactlyOnceWith(expect.anything(), expect.any(Function))
  fail = false
  await mocks.offer.mock.calls[0][1]()
  expect(settings.state.SN).toBe('SN-SEID-A')
  expect(settings.state.errorInfo).toBe('')
  expect(settings.state.firmwareChecked).toBe(false)
  expect(count('cosCheckUpdate')).toBe(0)
  expect(mocks.online).not.toHaveBeenCalled()
})

it('preserves a software update notice arriving during the initial device check', async () => {
  const normal = mocks.call.getMockImplementation()!
  const settings = useSettings()
  mocks.call.mockImplementation(async method => {
    if (method === 'getFirmwareVersion') settings.state.status = 6
    return normal(method)
  })
  await settings.init()
  expect(settings.state.status).toBe(6)
  expect(settings.state.initializing).toBe(false)
})

it('confirms the same device before and after displaying the exported binding code', async () => {
  const settings = useSettings()
  await settings.init()
  settings.firmware.state.bindCode = ''
  mocks.call.mockClear()
  await settings.exportBindCode()
  expect(settings.firmware.state).toMatchObject({
    bindCode: 'test-binding-code',
    supportCode: 4
  })
  expect(mocks.call.mock.calls.map(([method]) => method)).toEqual([
    'connectDevice',
    'getSeid',
    'deviceBindCheck',
    'exportBindCode',
    'connectDevice',
    'getSeid',
    'deviceBindCheck'
  ])
  expect(mocks.offer).not.toHaveBeenCalled()
})

it('does not export a binding code when the initial identity check detects a replacement', async () => {
  const settings = useSettings()
  await settings.init()
  settings.firmware.state.bindCode = ''
  mocks.call.mockClear()
  seid = 'SEID-B'
  await settings.exportBindCode()
  expect(count('exportBindCode')).toBe(0)
  expect(settings.firmware.state.bindCode).toBe('')
  expect(settings.firmware.state.supportCode).not.toBe(4)
  expect(useDeviceStore().deviceInfo).toBeNull()
  expect(useDeviceStore().identityReady).toBe(false)
  expect(settings.state).toMatchObject({ status: 2, SN: '' })
  expect(mocks.offer).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ result: 'device_session_changed' }),
    expect.any(Function),
    { reconnectOnly: true }
  )
})

it('does not display a binding code when the device changes while it is being read', async () => {
  const settings = useSettings()
  await settings.init()
  settings.firmware.state.bindCode = ''
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockClear().mockImplementation(async method => {
    if (method === 'exportBindCode') seid = 'SEID-B'
    return normal(method)
  })
  await settings.exportBindCode()
  expect(count('exportBindCode')).toBe(1)
  expect(count('getSeid')).toBe(2)
  expect(settings.firmware.state.bindCode).toBe('')
  expect(settings.firmware.state.supportCode).not.toBe(4)
  expect(useDeviceStore().identityReady).toBe(false)
  expect(useDeviceStore().deviceInfo).toBeNull()
  expect(mocks.offer).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ result: 'device_session_changed' }),
    expect.any(Function),
    { reconnectOnly: true }
  )
})

it.each([
  ['disposed', 'exportBindCode'],
  ['obsolete', 'exportBindCode'],
  ['disposed', 'getSeid'],
  ['obsolete', 'getSeid']
] as const)(
  'does not publish a binding code from a %s operation delayed at %s',
  async (invalidation, delayedMethod) => {
    const settings = useSettings()
    await settings.init()
    settings.firmware.state.bindCode = ''
    const normal = mocks.call.getMockImplementation()!
    let release!: (value: DeviceResult) => void
    let exported = false
    mocks.call.mockClear().mockImplementation(method => {
      const delay = method === delayedMethod && (method === 'exportBindCode' || exported)
      if (method === 'exportBindCode') exported = true
      return delay
        ? new Promise(resolve => {
            release = resolve
          })
        : normal(method)
    })
    const pending = settings.exportBindCode()
    await vi.waitFor(() => expect(release).toBeTypeOf('function'))
    expect(settings.firmware.state.bindCode).toBe('')
    expect(settings.firmware.state.supportCode).not.toBe(4)
    if (invalidation === 'disposed') mocks.unmounted.forEach(callback => callback())
    else useDeviceStore().invalidateDeviceData()
    release(await normal(delayedMethod))
    await pending
    expect(settings.firmware.state.bindCode).toBe('')
    expect(settings.firmware.state.supportCode).not.toBe(4)
    expect(mocks.offer).not.toHaveBeenCalled()
    if (delayedMethod === 'exportBindCode') expect(count('getSeid')).toBe(1)
    if (invalidation === 'obsolete') {
      expect(useDeviceStore().identityReady).toBe(false)
      expect(useDeviceStore().deviceInfo).toBeNull()
    }
  }
)

it.each([false, true])(
  'reuses a successful manual update result (update available: %s) without checking again on entry',
  async updateAvailable => {
    const first = useSettings()
    await first.init()
    expect(first.state.firmwareChecked).toBe(false)
    if (updateAvailable) latestFirmware = '1.1.0'
    await first.checkUpdate()
    expect(first.state.firmwareChecked).toBe(true)
    expect(useDeviceStore().deviceInfo).toMatchObject({
      firmwareChecked: true,
      updateAvailable,
      latestFirmwareVersion: latestFirmware
    })
    const requestsBeforeEntry = mocks.call.mock.calls.length
    mocks.online.mockResolvedValue(false)
    const second = useSettings()
    expect(second.state.firmwareChecked).toBe(true)
    expect(second.state.initializing).toBe(false)
    await second.init()
    expect(second.state.firmwareChecked).toBe(true)
    expect(second.firmware.state.isCosUpdate).toBe(updateAvailable)
    expect(second.firmware.state.cosNewVersionData).toBe(latestFirmware)
    expect(count('cosCheckUpdate')).toBe(1)
    expect(mocks.online).toHaveBeenCalledOnce()
    const entryRequests = mocks.call.mock.calls.slice(requestsBeforeEntry).map(([method]) => method)
    expect(entryRequests).toEqual([])
  }
)
