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
let actualCos: string
let actualBle: string
let bootloader: boolean
const releases: (() => void)[] = []
function response(method: string): DeviceResult {
  if (method === 'deviceBindAcquire') binding = 'bound_this'
  const values: Record<string, unknown> = {
    getSeid: seid,
    getUpgradeSeid: seid,
    deviceBindCheck: binding,
    isBLStatus: bootloader,
    getFirmwareVersion: actualCos,
    getBleVersion: actualBle,
    cosCheckUpdate: {
      isUpdateSuccess: true,
      latestCosVersion: actualCos,
      latestBleVersion: actualBle
    },
    getBTCXpub: 'xpub-ready',
    exportBindCode: 'binding-code-A',
    getInstalledApplets: { list: [{ name: 'Nervos' }] }
  }
  return { isSuccess: true, result: values[method] ?? 'success' }
}
function methods() {
  return mocks.call.mock.calls.map(([method]) => method)
}
function deviceWrites() {
  return methods().filter(method =>
    ['cosUpdate', 'deviceBindAcquire', 'importBindCode', 'writeWalletAddress'].includes(method)
  )
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
  actualCos = '1.1.0'
  actualBle = '2.1.0'
  bootloader = false
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
    expect(methods().slice(0, 3)).toEqual(['connectDevice', 'getSeid', 'deviceBindCheck'])
    expect(deviceWrites()).toEqual([
      'cosUpdate',
      'deviceBindAcquire',
      'importBindCode',
      'writeWalletAddress'
    ])
    expect(methods().indexOf('saveFirmwareRecovery')).toBeLessThan(methods().indexOf('cosUpdate'))
    expect(methods().lastIndexOf('deviceBindCheck')).toBeLessThan(methods().indexOf('getBTCXpub'))
    expect(device.canEnterHome).toBe(true)
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
    'saveFirmwareRecovery',
    'cosUpdate'
  ])
  expect(firmware.state.bindCode).toBe('binding-code-A')
  binding = 'unbound'
  mocks.call.mockClear()
  await firmware.updateFirmware()
  expect(methods().slice(0, 2)).toEqual(['connectDevice', 'getUpgradeSeid'])
  expect(deviceWrites()).toEqual([
    'cosUpdate',
    'deviceBindAcquire',
    'importBindCode',
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
  actualCos = firmware.state.cosOldVersionData
  await firmware.updateFirmware()
  expect(methods().slice(0, 3)).toEqual(['connectDevice', 'getSeid', 'deviceBindCheck'])
  expect(deviceWrites()).toEqual(['cosUpdate'])
  expect(methods()).not.toContain('exportBindCode')
  expect(methods()).not.toContain('getInstalledApplets')
  expect(device.canEnterHome).toBe(true)
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
  expect(methods().slice(0, 9)).toEqual([
    'connectDevice',
    'getSeid',
    'deviceBindCheck',
    'exportBindCode',
    'connectDevice',
    'getSeid',
    'deviceBindCheck',
    'saveFirmwareRecovery',
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
  'resumes only the incomplete stages after a %s failure on the same device',
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
    binding = ['cosUpdate', 'deviceBindAcquire'].includes(method) ? 'unbound' : 'bound_this'
    mocks.call.mockClear()
    await firmware.updateFirmware()
    const verification =
      method === 'cosUpdate'
        ? []
        : [
            ...(method === 'deviceBindAcquire' ? [] : ['deviceBindCheck']),
            'isBLStatus',
            'getFirmwareVersion',
            'getBleVersion',
            'getUpgradeSeid'
          ]
    const writes = [
      ...(method === 'cosUpdate' ? ['cosUpdate'] : []),
      ...(['cosUpdate', 'deviceBindAcquire'].includes(method) ? ['deviceBindAcquire'] : []),
      ...(['cosUpdate', 'deviceBindAcquire', 'importBindCode'].includes(method)
        ? ['importBindCode']
        : []),
      'writeWalletAddress'
    ]
    expect(methods().slice(0, 2 + verification.length)).toEqual([
      'connectDevice',
      'getUpgradeSeid',
      ...verification
    ])
    expect(deviceWrites()).toEqual(writes)
    expect(methods()).toContain('getInstalledApplets')
    expect(device.canEnterHome).toBe(true)
    if (writes.includes('deviceBindAcquire'))
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
  expect(methods().slice(0, 4)).toEqual([
    'connectDevice',
    'getUpgradeSeid',
    'saveFirmwareRecovery',
    'cosUpdate'
  ])
  expect(firmware.state).toMatchObject({ supportCode: 2, busy: false, isCosUpdate: false })
})

it('opens preparation feedback before queueing and keeps it visible while connecting', async () => {
  let releaseQueue!: () => void
  const blocker = createDeviceOperation().run(
    () =>
      new Promise<void>(resolve => {
        releaseQueue = resolve
        releases.push(resolve)
      })
  )
  await vi.waitFor(() => expect(releaseQueue).toBeTypeOf('function'))
  const { firmware, operation } = setup()
  const feedback = vi.spyOn(operation, 'feedback')
  let releaseConnection!: () => void
  mocks.call.mockImplementation(method =>
    method === 'connectDevice'
      ? new Promise(resolve => {
          releaseConnection = () => resolve(response(method))
          releases.push(releaseConnection)
        })
      : Promise.resolve(response(method))
  )
  const pending = firmware.updateFirmware()
  expect(firmware.state).toMatchObject({ supportCode: 1, busy: true, phase: 'preparing' })
  firmware.changeCode(0)
  await firmware.updateFirmware()
  expect(firmware.state.supportCode).toBe(1)
  expect(mocks.call).not.toHaveBeenCalled()
  await vi.waitFor(() => expect(feedback).toHaveBeenCalledOnce())
  releaseQueue()
  await blocker
  await vi.waitFor(() => expect(releaseConnection).toBeTypeOf('function'))
  expect(methods()).toEqual(['connectDevice'])
  expect(firmware.state).toMatchObject({ supportCode: 1, busy: true, phase: 'preparing' })
  releaseConnection()
  await pending
  expect(methods().filter(method => method === 'cosUpdate')).toHaveLength(1)
  expect(firmware.state).toMatchObject({ supportCode: 2, busy: false, phase: 'complete' })
})

it('reports the active upgrade stage without calling preparation a firmware write', async () => {
  const { firmware } = setup()
  const phases: [string, string][] = []
  mocks.call.mockImplementation(async method => {
    phases.push([method, firmware.state.phase])
    expect(firmware.state.supportCode).toBe(1)
    expect(firmware.state.busy).toBe(true)
    return response(method)
  })
  await firmware.updateFirmware()
  expect(
    phases.filter(([method]) =>
      [
        'connectDevice',
        'getSeid',
        'cosUpdate',
        'deviceBindAcquire',
        'importBindCode',
        'getInstalledApplets',
        'writeWalletAddress'
      ].includes(method)
    )
  ).toEqual([
    ['connectDevice', 'preparing'],
    ['getSeid', 'preparing'],
    ['cosUpdate', 'update'],
    ['deviceBindAcquire', 'bind'],
    ['importBindCode', 'store'],
    ['getInstalledApplets', 'restore'],
    ['writeWalletAddress', 'restore']
  ])
})

it('retries only the failed address chains after firmware, binding and storage have succeeded', async () => {
  const { firmware } = setup()
  let failed = false
  mocks.call.mockImplementation(async method => {
    if (method === 'getInstalledApplets')
      return {
        isSuccess: true,
        result: { list: [{ name: 'Bitcoin' }, { name: 'Ethereum' }, { name: 'Bitcoin' }] }
      }
    if (method === 'writeWalletAddress' && !failed) {
      failed = true
      return { isSuccess: false, result: 'address_retry_needed', failed: ['Ethereum'] }
    }
    return response(method)
  })
  await firmware.updateFirmware()
  expect(firmware.state).toMatchObject({ supportCode: 3, recovering: true, errorStage: 'restore' })
  await firmware.updateFirmware()
  for (const method of ['cosUpdate', 'deviceBindAcquire', 'importBindCode'])
    expect(methods().filter(name => name === method)).toHaveLength(1)
  expect(
    mocks.call.mock.calls.filter(([method]) => method === 'writeWalletAddress').map(([, p]) => p)
  ).toEqual([
    { name: ['Bitcoin', 'Ethereum'], filePath: '/test/user' },
    { name: ['Ethereum'], filePath: '/test/user' }
  ])
  expect(firmware.state).toMatchObject({ supportCode: 2, recovering: false })
})

it.each(['cos-version', 'ble-version', 'bootloader'])(
  'blocks post-update recovery on %s mismatch without repeating a completed write',
  async mismatch => {
    const { firmware } = setup()
    let failed = false
    mocks.call.mockImplementation(async method => {
      if (method === 'importBindCode' && !failed) {
        failed = true
        return { isSuccess: false, result: 'storage_unavailable' }
      }
      return response(method)
    })
    await firmware.updateFirmware()
    if (mismatch === 'cos-version') actualCos = '0.9.0'
    else if (mismatch === 'ble-version') actualBle = '1.9.0'
    else bootloader = true
    mocks.call.mockClear()
    await firmware.updateFirmware()
    for (const method of ['cosUpdate', 'deviceBindAcquire', 'importBindCode', 'writeWalletAddress'])
      expect(methods()).not.toContain(method)
    expect(firmware.state).toMatchObject({
      supportCode: 3,
      recovering: true,
      busy: false,
      errorStage: 'check',
      errorInfo:
        mismatch === 'bootloader'
          ? 'firmware_recovery_not_ready'
          : 'firmware_recovery_version_mismatch'
    })
    actualCos = '1.1.0'
    actualBle = '2.1.0'
    bootloader = false
    mocks.call.mockClear()
    await firmware.updateFirmware()
    expect(methods()).not.toContain('cosUpdate')
    expect(methods()).not.toContain('deviceBindAcquire')
    expect(methods()).toContain('importBindCode')
    expect(firmware.state.supportCode).toBe(2)
  }
)

it.each(
  ['importBindCode', 'getInstalledApplets', 'writeWalletAddress'].flatMap(failedMethod =>
    ['unbound', 'bound_other'].map(status => ({ failedMethod, status }))
  )
)('rejects $status binding before resuming $failedMethod', async ({ failedMethod, status }) => {
  const { firmware } = setup()
  let failed = false
  mocks.call.mockImplementation(async method => {
    if (method === failedMethod && !failed) {
      failed = true
      return { isSuccess: false, result: 'retry_needed' }
    }
    return response(method)
  })
  await firmware.updateFirmware()
  binding = status
  mocks.call.mockClear()
  await firmware.updateFirmware()
  expect(methods()).toEqual(['connectDevice', 'getUpgradeSeid', 'deviceBindCheck'])
  expectCleared(firmware)
  expect(mocks.offer).toHaveBeenCalledWith(expect.anything(), expect.any(Function), {
    reconnectOnly: true
  })
})

it.each(['before-resume', 'during-version-read'])(
  'rejects a different device %s before resuming completed firmware stages',
  async timing => {
    const { firmware } = setup()
    let failed = false
    mocks.call.mockImplementation(async method => {
      if (method === 'importBindCode' && !failed) {
        failed = true
        return { isSuccess: false, result: 'storage_unavailable' }
      }
      return response(method)
    })
    await firmware.updateFirmware()
    if (timing === 'before-resume') seid = 'SEID-B'
    else {
      const normal = mocks.call.getMockImplementation()!
      mocks.call.mockImplementation(async (method, params) => {
        const result = await normal(method, params)
        if (method === 'getBleVersion') seid = 'SEID-B'
        return result
      })
    }
    mocks.call.mockClear()
    await firmware.updateFirmware()
    for (const method of ['cosUpdate', 'deviceBindAcquire', 'importBindCode', 'writeWalletAddress'])
      expect(methods()).not.toContain(method)
    expectCleared(firmware)
  }
)

it('resumes the saved stage after reopening another firmware page in the same device session', async () => {
  const { firmware, operation, device } = setup()
  let failed = false
  mocks.call.mockImplementation(async method => {
    if (method === 'importBindCode' && !failed) {
      failed = true
      return { isSuccess: false, result: 'storage_unavailable' }
    }
    return response(method)
  })
  await firmware.updateFirmware()
  const sessionId = device.sessionId
  operation.dispose()
  mocks.call.mockClear()
  const reopened = useFirmwareUpgrade('manager', createDeviceOperation())
  expect(device.sessionId).toBe(sessionId)
  expect(reopened.state).toMatchObject({
    recovering: true,
    isCosUpdate: true,
    cosUpdateStatus: '1',
    bindCode: 'binding-code-A',
    cosNewVersionData: '1.1.0'
  })
  await reopened.ensureFirmwareVersion()
  expect(mocks.call).not.toHaveBeenCalled()
  await reopened.updateFirmware()
  expect(methods()).not.toContain('cosUpdate')
  expect(methods()).not.toContain('deviceBindAcquire')
  expect(methods()).toContain('importBindCode')
  expect(reopened.state).toMatchObject({ supportCode: 2, recovering: false, busy: false })
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
