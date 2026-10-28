import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { createDeviceOperation } from '../../src/renderer/composables/useDeviceOperation'
import { useFirmwareUpgrade } from '../../src/renderer/composables/useFirmwareUpgrade'
import { useDeviceStore } from '../../src/renderer/store/device'
import { useAppStore } from '../../src/renderer/store/app'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string, params?: unknown) => Promise<DeviceResult>>(),
  offer: vi.fn()
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: mocks.offer })
}))

let seid: string
let binding: string
const releases: (() => void)[] = []
function response(method: string): DeviceResult {
  const values: Record<string, unknown> = {
    getSeid: seid,
    getUpgradeSeid: seid,
    deviceBindCheck: binding,
    exportBindCode: 'binding-code-A',
    getInstalledApplets: { list: [{ name: 'Nervos' }] }
  }
  return { isSuccess: true, result: values[method] ?? 'success' }
}
function methods() {
  return mocks.call.mock.calls.map(([method]) => method)
}
function setup(kind: 'manager' | 'setting' = 'setting') {
  const operation = createDeviceOperation()
  const firmware = useFirmwareUpgrade(kind, operation)
  Object.assign(firmware.state, {
    bindCode: 'binding-code-A',
    cosOldVersionData: '1.0.0',
    cosNewVersionData: '1.1.0',
    bleOldVersionData: '2.0.0',
    bleNewVersionData: '2.1.0',
    isCosUpdate: true,
    cosUpdateStatus: '1'
  })
  return { firmware, operation, device: useDeviceStore() }
}
function expectCleared(firmware: ReturnType<typeof useFirmwareUpgrade>) {
  expect(useDeviceStore()).toMatchObject({
    connectedSeid: 'SEID-A',
    identityReady: false,
    identityChecking: false,
    deviceInfo: null,
    apps: [],
    verification: { status: 'idle', activationStatus: null, activatedAt: null },
    isCosUpdate: false,
    cosOldVersionData: '',
    cosNewVersionData: '',
    bleOldVersionData: '',
    bleNewVersionData: '',
    installedBleVersion: '',
    isFirstGoToManagerPage: true
  })
  expect(firmware.state).toMatchObject({
    bindCode: '',
    cosOldVersionData: '',
    cosNewVersionData: '',
    bleOldVersionData: '',
    bleNewVersionData: '',
    isCosUpdate: false,
    cosUpdateStatus: '0',
    supportCode: 0,
    busy: false
  })
}
beforeEach(() => {
  setActivePinia(createPinia())
  seid = 'SEID-A'
  binding = 'bound_this'
  const device = useDeviceStore()
  Object.assign(device, {
    connectedSeid: seid,
    bindStatus: binding,
    identityReady: true,
    deviceInfo: {
      seid,
      sn: 'SN-A',
      firmwareVersion: '1.0.0',
      bleVersion: '2.0.0',
      firmwareChecked: true,
      latestFirmwareVersion: '1.1.0',
      latestBleVersion: '2.1.0',
      updateAvailable: true
    },
    verification: {
      status: 'success',
      activationStatus: true,
      activatedAt: '2026-01-01',
      errorInfo: ''
    },
    apps: [{ id: 'Nervos', name: 'Nervos', installedVersion: '1', latestVersion: '1', icon: '' }],
    isCosUpdate: true,
    cosOldVersionData: '1.0.0',
    cosNewVersionData: '1.1.0',
    bleOldVersionData: '2.0.0',
    bleNewVersionData: '2.1.0',
    installedBleVersion: '2.0.0',
    isFirstGoToManagerPage: false
  })
  useAppStore().userPath = '/test/user'
  mocks.call.mockReset().mockImplementation(async method => response(method))
  mocks.offer.mockReset()
})
afterEach(async () => {
  releases.splice(0).forEach(release => release())
  await createDeviceOperation().run(async () => {})
})

it.each(['manager', 'setting'] as const)(
  'confirms identity before the first %s upgrade and preserves the write sequence',
  async kind => {
    const { firmware, device } = setup(kind)
    await firmware.updateFirmware()
    expect(methods()).toEqual([
      'connectDevice',
      'getSeid',
      'deviceBindCheck',
      'cosUpdate',
      'deviceBindAcquire',
      'importBindCode',
      'getInstalledApplets',
      'writeWalletAddress'
    ])
    expect(mocks.call.mock.calls.find(([method]) => method === 'deviceBindAcquire')?.[1]).toBe(
      'binding-code-A'
    )
    expect(mocks.call.mock.calls.find(([method]) => method === 'importBindCode')?.[1]).toBe(
      'binding-code-A'
    )
    expect(mocks.call.mock.calls.find(([method]) => method === 'writeWalletAddress')?.[1]).toEqual({
      name: ['Nervos'],
      filePath: '/test/user'
    })
    expect(firmware.state).toMatchObject({
      supportCode: 2,
      busy: false,
      isCosUpdate: false,
      cosUpdateStatus: '0',
      cosOldVersionData: '1.1.0'
    })
    expect(device.isCosUpdate).toBe(false)
    expect(device.verification.status).toBe('success')
    expect(mocks.offer).not.toHaveBeenCalled()
  }
)

it.each(['replacement', 'unbound', 'binding-error'])(
  'clears all stale device and local data and refuses the first upgrade on %s',
  async reason => {
    const { firmware } = setup()
    if (reason === 'replacement') seid = 'SEID-B'
    else if (reason === 'unbound') binding = 'unbound'
    else
      mocks.call.mockImplementation(async method =>
        method === 'deviceBindCheck'
          ? { isSuccess: false, result: 'device_bind_check_failed' }
          : response(method)
      )
    await firmware.updateFirmware()
    expect(methods()).not.toContain('cosUpdate')
    expectCleared(firmware)
    expect(mocks.offer).toHaveBeenCalledExactlyOnceWith(expect.anything(), expect.any(Function), {
      reconnectOnly: true
    })
  }
)

it('loads an uncached binding code after identity confirmation and reuses it during recovery', async () => {
  const { firmware } = setup()
  firmware.state.bindCode = ''
  let fail = true
  mocks.call.mockImplementation(async method => {
    if (method === 'cosUpdate' && fail) {
      fail = false
      return { isSuccess: false, result: 'interrupted-upgrade' }
    }
    return response(method)
  })
  await firmware.updateFirmware()
  expect(methods()).toEqual([
    'connectDevice',
    'getSeid',
    'deviceBindCheck',
    'exportBindCode',
    'connectDevice',
    'getSeid',
    'deviceBindCheck',
    'cosUpdate'
  ])
  expect(firmware.state.bindCode).toBe('binding-code-A')
  binding = 'unbound'
  mocks.call.mockClear()
  await firmware.updateFirmware()
  expect(methods()).toEqual([
    'connectDevice',
    'getUpgradeSeid',
    'cosUpdate',
    'deviceBindAcquire',
    'importBindCode',
    'getInstalledApplets',
    'writeWalletAddress'
  ])
  expect(mocks.call.mock.calls.find(([method]) => method === 'deviceBindAcquire')?.[1]).toBe(
    'binding-code-A'
  )
  expect(firmware.state.supportCode).toBe(2)
})

it('updates BLE alone without reading a binding code or restoring applications', async () => {
  const { firmware, device } = setup()
  firmware.state.bindCode = ''
  firmware.state.cosNewVersionData = firmware.state.cosOldVersionData
  await firmware.updateFirmware()
  expect(methods()).toEqual(['connectDevice', 'getSeid', 'deviceBindCheck', 'cosUpdate'])
  expect(firmware.state).toMatchObject({ supportCode: 2, busy: false, isCosUpdate: false })
  expect(device.installedBleVersion).toBe('2.1.0')
  expect(device.deviceInfo).toBeNull()
})

it('does not read an uncached binding code or write firmware before rejecting a replacement', async () => {
  const { firmware } = setup()
  firmware.state.bindCode = ''
  seid = 'SEID-B'
  await firmware.updateFirmware()
  expect(methods()).toEqual(['connectDevice', 'getSeid'])
  expectCleared(firmware)
})

it('stops before cosUpdate when an uncached binding code cannot be read and retries safely', async () => {
  const { firmware } = setup()
  firmware.state.bindCode = ''
  mocks.call.mockImplementation(async method =>
    method === 'exportBindCode'
      ? { isSuccess: false, result: 'binding_file_unavailable' }
      : response(method)
  )
  await firmware.updateFirmware()
  expect(methods()).not.toContain('cosUpdate')
  expect(firmware.state).toMatchObject({ supportCode: 3, errorStage: 'store', bindCode: '' })
  mocks.call.mockClear().mockImplementation(async method => response(method))
  await firmware.updateFirmware()
  expect(methods().slice(0, 8)).toEqual([
    'connectDevice',
    'getSeid',
    'deviceBindCheck',
    'exportBindCode',
    'connectDevice',
    'getSeid',
    'deviceBindCheck',
    'cosUpdate'
  ])
  expect(firmware.state.supportCode).toBe(2)
})

it('does not retain the lazily read binding code or upgrade if the device changes during its read', async () => {
  const { firmware } = setup()
  firmware.state.bindCode = ''
  mocks.call.mockImplementation(async method => {
    if (method === 'exportBindCode') seid = 'SEID-B'
    return response(method)
  })
  await firmware.updateFirmware()
  expect(methods()).toEqual([
    'connectDevice',
    'getSeid',
    'deviceBindCheck',
    'exportBindCode',
    'connectDevice',
    'getSeid'
  ])
  expectCleared(firmware)
  expect(mocks.offer).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ result: 'device_session_changed' }),
    expect.any(Function),
    { reconnectOnly: true }
  )
})

it.each(['disposed', 'obsolete'])(
  'does not retain a binding code or start an upgrade after its pending read becomes %s',
  async invalidation => {
    const { firmware, operation, device } = setup()
    firmware.state.bindCode = ''
    let release!: () => void
    mocks.call.mockImplementation(method =>
      method === 'exportBindCode'
        ? new Promise(resolve => {
            release = () => resolve(response(method))
            releases.push(release)
          })
        : Promise.resolve(response(method))
    )
    const pending = firmware.updateFirmware()
    await vi.waitFor(() => expect(release).toBeTypeOf('function'))
    if (invalidation === 'disposed') operation.dispose()
    else device.invalidateDeviceData()
    release()
    await pending
    expect(firmware.state.bindCode).toBe('')
    expect(methods()).not.toContain('cosUpdate')
    expect(mocks.offer).not.toHaveBeenCalled()
  }
)

it.each([
  ['cosUpdate', 'update'],
  ['deviceBindAcquire', 'bind'],
  ['importBindCode', 'store'],
  ['getInstalledApplets', 'restore'],
  ['writeWalletAddress', 'restore']
])(
  'retries a %s failure on the same unbound device using its upgrade identity',
  async (method, stage) => {
    const { firmware, device } = setup()
    let fail = true
    mocks.call.mockImplementation(async requested => {
      if (requested === method && fail) {
        fail = false
        return { isSuccess: false, result: 'interrupted-upgrade' }
      }
      return response(requested)
    })
    await firmware.updateFirmware()
    expect(firmware.state).toMatchObject({
      supportCode: 3,
      errorStage: stage,
      busy: false,
      isCosUpdate: true,
      cosUpdateStatus: '1'
    })
    expect(device.isCosUpdate).toBe(true)
    binding = 'unbound'
    mocks.call.mockClear()
    await firmware.updateFirmware()
    expect(methods()).toEqual([
      'connectDevice',
      'getUpgradeSeid',
      'cosUpdate',
      'deviceBindAcquire',
      'importBindCode',
      'getInstalledApplets',
      'writeWalletAddress'
    ])
    expect(mocks.call.mock.calls.find(([name]) => name === 'deviceBindAcquire')?.[1]).toBe(
      'binding-code-A'
    )
    expect(firmware.state).toMatchObject({
      supportCode: 2,
      errorInfo: '',
      busy: false,
      isCosUpdate: false,
      cosOldVersionData: '1.1.0'
    })
    expect(device.isCosUpdate).toBe(false)
    expect(mocks.offer).not.toHaveBeenCalled()
  }
)

it('refuses every upgrade write if a retry detects a different physical device', async () => {
  const { firmware } = setup()
  mocks.call.mockImplementation(async method =>
    method === 'cosUpdate' ? { isSuccess: false, result: 'interrupted-upgrade' } : response(method)
  )
  await firmware.updateFirmware()
  seid = 'SEID-B'
  mocks.call.mockClear()
  await firmware.updateFirmware()
  expect(methods()).toEqual(['connectDevice', 'getUpgradeSeid'])
  expectCleared(firmware)
  expect(mocks.offer).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ result: 'device_session_changed' }),
    expect.any(Function),
    { reconnectOnly: true }
  )
})

it.each([
  ['cosUpdate', 'device_session_changed'],
  ['deviceBindAcquire', 'device_bind_check_failed'],
  ['importBindCode', 'device_session_changed'],
  ['writeWalletAddress', 'device_bind_check_failed']
])('clears stale state when %s reports %s during an upgrade', async (method, error) => {
  const { firmware } = setup()
  mocks.call.mockImplementation(async requested =>
    requested === method ? { isSuccess: false, result: error } : response(requested)
  )
  await firmware.updateFirmware()
  expect(methods().at(-1)).toBe(method)
  expectCleared(firmware)
  expect(mocks.offer).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ result: error }),
    expect.any(Function),
    { reconnectOnly: true }
  )
})

it('does not write after a failed bootloader identity read and keeps same-device retry inputs', async () => {
  const { firmware } = setup()
  mocks.call.mockImplementation(async method =>
    method === 'cosUpdate' ? { isSuccess: false, result: 'interrupted-upgrade' } : response(method)
  )
  await firmware.updateFirmware()
  mocks.call
    .mockClear()
    .mockImplementation(async method =>
      method === 'getUpgradeSeid'
        ? { isSuccess: false, result: 'bootloader_identity_unavailable' }
        : response(method)
    )
  await firmware.updateFirmware()
  expect(methods()).toEqual(['connectDevice', 'getUpgradeSeid'])
  expect(firmware.state).toMatchObject({
    supportCode: 3,
    errorStage: 'connect',
    bindCode: 'binding-code-A',
    cosOldVersionData: '1.0.0',
    cosNewVersionData: '1.1.0'
  })
  expect(useDeviceStore().verification.status).toBe('idle')
  binding = 'unbound'
  mocks.call.mockClear().mockImplementation(async method => response(method))
  await firmware.updateFirmware()
  expect(methods().slice(0, 3)).toEqual(['connectDevice', 'getUpgradeSeid', 'cosUpdate'])
  expect(firmware.state).toMatchObject({ supportCode: 2, busy: false, isCosUpdate: false })
})

it.each([
  ['disposed', 'cosUpdate', 'resolve'],
  ['obsolete', 'cosUpdate', 'resolve'],
  ['disposed', 'writeWalletAddress', 'resolve'],
  ['obsolete', 'writeWalletAddress', 'resolve'],
  ['disposed', 'cosUpdate', 'reject'],
  ['obsolete', 'cosUpdate', 'reject']
] as const)(
  'does not publish a %s upgrade response delayed at %s (%s)',
  async (invalidation, delayedMethod, settlement) => {
    const { firmware, operation, device } = setup()
    let release!: () => void
    mocks.call.mockImplementation(method =>
      method === delayedMethod
        ? new Promise((resolve, reject) => {
            release = () =>
              settlement === 'reject'
                ? reject(new Error('late transport failure'))
                : resolve(response(method))
            releases.push(release)
          })
        : Promise.resolve(response(method))
    )
    const pending = firmware.updateFirmware()
    await vi.waitFor(() => expect(release).toBeTypeOf('function'))
    if (invalidation === 'disposed') operation.dispose()
    else device.invalidateDeviceData()
    const before = { ...firmware.state, busy: false }
    const beforeDevice = {
      isCosUpdate: device.isCosUpdate,
      cosOldVersionData: device.cosOldVersionData,
      cosNewVersionData: device.cosNewVersionData
    }
    const requestCount = mocks.call.mock.calls.length
    release()
    await pending
    expect(firmware.state).toEqual(before)
    expect(device).toMatchObject(beforeDevice)
    expect(mocks.call).toHaveBeenCalledTimes(requestCount)
    expect(mocks.offer).not.toHaveBeenCalled()
  }
)
