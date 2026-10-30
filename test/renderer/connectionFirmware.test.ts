import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult, FirmwareRecoveryCheckpoint } from '../../src/shared/deviceContract'
import { useConnectionFirmware } from '../../src/renderer/composables/useConnectionFirmware'
import { useConnection } from '../../src/renderer/composables/useConnection'
import { useDeviceStore } from '../../src/renderer/store'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string, params?: unknown) => Promise<DeviceResult>>(),
  push: vi.fn()
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: vi.fn(), returnToConnection: vi.fn() })
}))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: vi.fn(),
  onUnmounted: vi.fn()
}))

let seid: string
let binding: string
let cos: string
let ble: string
let bootloader: boolean
let updated: boolean
let failedMethod: string
let journal: FirmwareRecoveryCheckpoint | null
function response(method: string, params?: unknown): DeviceResult {
  if (method === failedMethod) return { isSuccess: false, result: `${method}_failed` }
  if (method === 'getFirmwareRecovery')
    return { isSuccess: true, result: journal ? structuredClone(journal) : null }
  if (method === 'saveFirmwareRecovery') {
    journal = structuredClone(params) as FirmwareRecoveryCheckpoint
    return { isSuccess: true, result: undefined }
  }
  if (method === 'clearFirmwareRecovery') {
    journal = null
    return { isSuccess: true, result: undefined }
  }
  if (method === 'cosUpdate') {
    bootloader = false
    updated = true
    cos = '2.0.0'
    ble = '2.1.0'
  }
  if (method === 'deviceBindAcquire') binding = 'bound_this'
  const values: Record<string, unknown> = {
    getUpgradeSeid: seid,
    getSeid: seid,
    isBLStatus: bootloader,
    getFirmwareVersion: cos,
    getBleVersion: ble,
    deviceBindCheck: binding,
    exportBindCode: 'A2345678',
    getInstalledApplets: { list: [{ name: 'Ethereum' }, { name: 'Bitcoin' }] },
    checkUpdate: { status: 'latest', list: [] },
    cosCheckUpdate: {
      isUpdateSuccess: updated,
      latestCosVersion: '2.0.0',
      latestBleVersion: '2.1.0'
    },
    getBTCXpub: 'xpub-ready'
  }
  return { isSuccess: true, result: values[method] ?? 'success' }
}
function calls(method: string) {
  return mocks.call.mock.calls.filter(([name]) => name === method)
}
beforeEach(() => {
  setActivePinia(createPinia())
  seid = 'SEID-A'
  binding = 'unbound'
  cos = '1.0.0'
  ble = '1.1.0'
  bootloader = true
  updated = false
  failedMethod = ''
  journal = null
  mocks.call.mockReset().mockImplementation(async (method, params) => response(method, params))
  mocks.push.mockReset().mockResolvedValue(undefined)
})

it('bootloader recovery captures actual firmware versions and confirms identity before rebinding', async () => {
  const fail = vi.fn()
  const done = vi.fn(async () => {})
  const flow = useConnectionFirmware(vi.fn(), fail, done)
  await flow.toCosUpdate()
  expect(fail).not.toHaveBeenCalled()
  expect(done).toHaveBeenCalledOnce()
  expect(calls('cosUpdate')).toHaveLength(1)
  const methods = mocks.call.mock.calls.map(([method]) => method)
  expect(methods[0]).toBe('getUpgradeSeid')
  expect(methods.indexOf('getFirmwareVersion')).toBeGreaterThan(methods.indexOf('cosUpdate'))
  expect(methods.indexOf('getBleVersion')).toBeLessThan(methods.indexOf('deviceBindAcquire'))
  expect(calls('getUpgradeSeid').length).toBeGreaterThanOrEqual(3)
  expect(flow.hasPendingRecovery()).toBe(false)
})

it.each(['deviceBindAcquire', 'importBindCode', 'writeWalletAddress'])(
  '%s failure resumes the pending phase without repeating a successful firmware write',
  async method => {
    failedMethod = method
    const fail = vi.fn()
    const done = vi.fn(async () => {})
    const flow = useConnectionFirmware(vi.fn(), fail, done)
    await flow.toCosUpdate()
    expect(flow.hasPendingRecovery()).toBe(true)
    expect(done).not.toHaveBeenCalled()
    expect(calls('cosUpdate')).toHaveLength(1)
    failedMethod = ''
    await flow.toCosUpdate()
    expect(done).toHaveBeenCalledOnce()
    expect(calls('cosUpdate')).toHaveLength(1)
    expect(calls('deviceBindAcquire')).toHaveLength(method === 'deviceBindAcquire' ? 2 : 1)
    expect(calls('importBindCode')).toHaveLength(method === 'importBindCode' ? 2 : 1)
    expect(calls('writeWalletAddress')).toHaveLength(method === 'writeWalletAddress' ? 2 : 1)
    expect(flow.hasPendingRecovery()).toBe(false)
  }
)

it('an interrupted version capture retries the capture without reflashing', async () => {
  failedMethod = 'getFirmwareVersion'
  const fail = vi.fn()
  const flow = useConnectionFirmware(vi.fn(), fail, async () => {})
  await flow.toCosUpdate()
  expect(fail).toHaveBeenLastCalledWith('getFirmwareVersion_failed', 5, 'check')
  expect(calls('deviceBindAcquire')).toHaveLength(0)
  failedMethod = ''
  await flow.toCosUpdate()
  expect(calls('cosUpdate')).toHaveLength(1)
  expect(calls('deviceBindAcquire')).toHaveLength(1)
  expect(flow.hasPendingRecovery()).toBe(false)
})

it.each(['identity', 'cos', 'ble', 'bootloader', 'binding'])(
  '%s changes block phase recovery before any further writes',
  async change => {
    failedMethod = 'writeWalletAddress'
    const fail = vi.fn()
    const flow = useConnectionFirmware(vi.fn(), fail, async () => {})
    await flow.toCosUpdate()
    failedMethod = ''
    if (change === 'identity') seid = 'SEID-B'
    if (change === 'cos') cos = 'unexpected-cos'
    if (change === 'ble') ble = 'unexpected-ble'
    if (change === 'bootloader') bootloader = true
    if (change === 'binding') binding = 'bound_other'
    mocks.call.mockClear()
    await flow.toCosUpdate()
    expect(flow.hasPendingRecovery()).toBe(true)
    expect(calls('cosUpdate')).toHaveLength(0)
    expect(calls('deviceBindAcquire')).toHaveLength(0)
    expect(calls('importBindCode')).toHaveLength(0)
    expect(calls('writeWalletAddress')).toHaveLength(0)
    expect(fail).toHaveBeenLastCalledWith(
      change === 'identity'
        ? 'device_session_changed'
        : change === 'bootloader'
          ? 'firmware_recovery_not_ready'
          : change === 'binding'
            ? 'device_bind_check_failed'
            : 'firmware_recovery_version_mismatch',
      change === 'identity' ? 4 : 5,
      change === 'identity' ? 'connect' : change === 'binding' ? 'bind' : 'check'
    )
  }
)

it('a bootloader identity must match the device already selected by the connection flow', async () => {
  useDeviceStore().connectedSeid = 'SEID-B'
  const fail = vi.fn()
  await useConnectionFirmware(vi.fn(), fail, async () => {}).toCosUpdate()
  expect(fail).toHaveBeenCalledWith('device_session_changed', 4, 'connect')
  expect(calls('cosUpdate')).toHaveLength(0)
})

it('reconnecting cannot skip pending address recovery when firmware now reports success', async () => {
  bootloader = false
  failedMethod = 'writeWalletAddress'
  const flow = useConnection()
  await flow.check()
  expect(flow.status.value).toBe(5)
  expect(flow.errorStage.value).toBe('restore')
  expect(updated).toBe(true)
  expect(mocks.push).not.toHaveBeenCalled()
  const firstUpdateCount = calls('cosUpdate').length
  failedMethod = ''
  flow.changeState(1)
  await flow.check()
  expect(calls('cosUpdate')).toHaveLength(firstUpdateCount)
  expect(calls('writeWalletAddress')).toHaveLength(2)
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/home/welcomeHome')
})

it('a failed firmware write is retried after confirming the same bootloader identity', async () => {
  failedMethod = 'cosUpdate'
  const flow = useConnectionFirmware(vi.fn(), vi.fn(), async () => {})
  await flow.toCosUpdate()
  failedMethod = ''
  await flow.toCosUpdate()
  expect(calls('cosUpdate')).toHaveLength(2)
  expect(flow.hasPendingRecovery()).toBe(false)
})

it('a restart reloads a partial native upgrade before an incompatible catalogue can block recovery', async () => {
  bootloader = false
  let failNative = true
  mocks.call.mockImplementation(async (method, params) => {
    if (method === 'cosUpdate' && failNative) {
      // COS was written, but native application installation never completed.
      cos = '2.0.0'
      return { isSuccess: false, result: 'imkey_tsm_app_download_fail' }
    }
    if (method === 'checkUpdate' && !updated)
      return { isSuccess: false, result: 'imkey_tsm_device_update_check_fail' }
    return response(method, params)
  })
  await useConnection().check()
  expect(journal?.phase).toBe('update')
  expect(calls('checkUpdate')).toHaveLength(0)
  expect(mocks.push).not.toHaveBeenCalled()
  expect(useDeviceStore().canEnterHome).toBe(false)

  setActivePinia(createPinia())
  mocks.call.mockClear()
  failNative = false
  await useConnection().check()
  const methods = mocks.call.mock.calls.map(([method]) => method)
  expect(methods.indexOf('getFirmwareRecovery')).toBeLessThan(methods.indexOf('cosUpdate'))
  expect(methods.indexOf('cosUpdate')).toBeLessThan(methods.indexOf('checkUpdate'))
  expect(calls('cosUpdate')).toHaveLength(1)
  expect(journal).toBeNull()
  expect(useDeviceStore().canEnterHome).toBe(true)
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/home/welcomeHome')
})

it('a restart resumes durable address recovery even when firmware now reports complete', async () => {
  failedMethod = 'writeWalletAddress'
  await useConnection().check()
  expect(journal?.phase).toBe('restore')
  expect(updated).toBe(true)
  expect(useDeviceStore().canEnterHome).toBe(false)
  setActivePinia(createPinia())
  mocks.call.mockClear()
  failedMethod = ''
  await useConnection().check()
  expect(calls('cosUpdate')).toHaveLength(0)
  expect(calls('deviceBindAcquire')).toHaveLength(0)
  expect(calls('writeWalletAddress')).toHaveLength(1)
  expect(journal).toBeNull()
  expect(useDeviceStore().canEnterHome).toBe(true)
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/home/welcomeHome')
})

it.each(['unknown', 'unbound', 'bound_other'])(
  'a successful acquire followed by %s cannot store recovery data or enter home',
  async status => {
    mocks.call.mockImplementation(async (method, params) => {
      if (method === 'deviceBindAcquire') {
        binding = status
        return { isSuccess: true, result: 'success' }
      }
      return response(method, params)
    })
    await useConnection().check()
    expect(calls('importBindCode')).toHaveLength(0)
    expect(calls('writeWalletAddress')).toHaveLength(0)
    expect(calls('getBTCXpub')).toHaveLength(0)
    expect(journal?.phase).toBe('store')
    expect(useDeviceStore().canEnterHome).toBe(false)
    expect(mocks.push).not.toHaveBeenCalled()
  }
)

it('a failed durable checkpoint clear keeps recovery pending and prevents home entry', async () => {
  failedMethod = 'clearFirmwareRecovery'
  await useConnection().check()
  expect(journal?.phase).toBe('verify')
  expect(calls('getBTCXpub')).toHaveLength(0)
  expect(useDeviceStore().canEnterHome).toBe(false)
  expect(mocks.push).not.toHaveBeenCalled()
})

it('a checkpoint for another device cannot authorize recovery writes or home', async () => {
  journal = {
    version: 1,
    seid: 'SEID-B',
    phase: 'update',
    needsBinding: true,
    expectedCos: '2.0.0',
    expectedBle: '2.1.0'
  }
  await useConnection().check()
  expect(calls('cosUpdate')).toHaveLength(0)
  expect(calls('deviceBindAcquire')).toHaveLength(0)
  expect(useDeviceStore().canEnterHome).toBe(false)
  expect(mocks.push).not.toHaveBeenCalled()
})

it('captures installed firmware instead of the published versions when native recovery finishes', async () => {
  bootloader = false
  mocks.call.mockImplementation(async (method, params) => {
    if (method === 'cosCheckUpdate')
      return {
        isSuccess: true,
        result: {
          isUpdateSuccess: updated,
          latestCosVersion: '9.9.9',
          latestBleVersion: '8.8.8'
        }
      }
    return response(method, params)
  })
  await useConnection().check()
  expect(calls('cosUpdate')).toHaveLength(1)
  expect(calls('saveFirmwareRecovery').map(([, checkpoint]) => checkpoint)).toContainEqual(
    expect.objectContaining({ phase: 'bind', expectedCos: '2.0.0', expectedBle: '2.1.0' })
  )
  expect(journal).toBeNull()
  expect(useDeviceStore().canEnterHome).toBe(true)
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/home/welcomeHome')
})

it('resumes an old capture checkpoint with stale published versions while the same device is unbound', async () => {
  bootloader = false
  updated = true
  journal = {
    version: 1,
    seid,
    phase: 'capture-versions',
    needsBinding: true,
    expectedCos: '9.9.9',
    expectedBle: '8.8.8'
  }
  await useConnection().check()
  expect(calls('cosUpdate')).toHaveLength(0)
  expect(calls('deviceBindAcquire')).toHaveLength(1)
  expect(calls('saveFirmwareRecovery').map(([, checkpoint]) => checkpoint)).toContainEqual(
    expect.objectContaining({ phase: 'bind', expectedCos: cos, expectedBle: ble })
  )
  expect(journal).toBeNull()
  expect(useDeviceStore().canEnterHome).toBe(true)
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/home/welcomeHome')
})

it('a capture read failure can restart and recapture both versions without reflashing or prior binding', async () => {
  failedMethod = 'getBleVersion'
  await useConnection().check()
  expect(journal?.phase).toBe('capture-versions')
  expect(binding).toBe('unbound')
  expect(useDeviceStore().canEnterHome).toBe(false)
  expect(mocks.push).not.toHaveBeenCalled()
  setActivePinia(createPinia())
  mocks.call.mockClear()
  failedMethod = ''
  await useConnection().check()
  expect(calls('cosUpdate')).toHaveLength(0)
  expect(calls('getFirmwareVersion').length).toBeGreaterThan(0)
  expect(calls('getBleVersion').length).toBeGreaterThan(0)
  expect(calls('deviceBindAcquire')).toHaveLength(1)
  expect(useDeviceStore().canEnterHome).toBe(true)
})

it.each(['query-failure', 'native-incomplete'])(
  'capture %s cannot bind, clear recovery, or enter home',
  async failure => {
    mocks.call.mockImplementation(async (method, params) => {
      if (method === 'cosCheckUpdate')
        return failure === 'query-failure'
          ? { isSuccess: false, result: 'imkey_tsm_device_update_check_fail' }
          : { isSuccess: true, result: { isUpdateSuccess: false } }
      return response(method, params)
    })
    await useConnection().check()
    expect(calls('cosUpdate')).toHaveLength(1)
    expect(calls('deviceBindAcquire')).toHaveLength(0)
    expect(calls('clearFirmwareRecovery')).toHaveLength(0)
    expect(journal?.phase).toBe('capture-versions')
    expect(useDeviceStore().canEnterHome).toBe(false)
    expect(mocks.push).not.toHaveBeenCalled()
  }
)

it('server-confirmed native incompletion clears the old baseline before reentering native recovery', async () => {
  failedMethod = 'writeWalletAddress'
  const flow = useConnectionFirmware(vi.fn(), vi.fn(), async () => {})
  await flow.toCosUpdate()
  expect(journal?.phase).toBe('restore')
  failedMethod = ''
  mocks.call.mockClear()
  mocks.call.mockImplementation(async (method, params) => {
    const result = response(method, params)
    if (method === 'cosUpdate') {
      cos = '3.0.0'
      ble = '3.1.0'
      binding = 'unbound'
    }
    return result
  })
  await flow.toCosUpdate(true)
  expect(calls('cosUpdate')).toHaveLength(1)
  expect(calls('saveFirmwareRecovery')[0][1]).toMatchObject({
    phase: 'update',
    expectedCos: '',
    expectedBle: ''
  })
  expect(calls('saveFirmwareRecovery').map(([, checkpoint]) => checkpoint)).toContainEqual(
    expect.objectContaining({ phase: 'bind', expectedCos: '3.0.0', expectedBle: '3.1.0' })
  )
  expect(flow.hasPendingRecovery()).toBe(false)
  expect(journal).toBeNull()
})

it.each(['unbound', 'bound_other'])(
  'restarts a legacy BLE-only verify record on %s and restores all addresses before home',
  async status => {
    bootloader = false
    updated = true
    binding = status
    journal = {
      version: 1,
      seid,
      phase: 'verify',
      needsBinding: false,
      expectedCos: cos,
      expectedBle: ble,
      pendingAddresses: ['Ethereum']
    }
    await useConnection().check()
    expect(calls('cosUpdate')).toHaveLength(0)
    expect(calls('deviceBindAcquire')).toHaveLength(1)
    expect(calls('writeWalletAddress')[0][1]).toEqual({
      name: ['Ethereum', 'Bitcoin'],
      filePath: ''
    })
    const promoted = calls('saveFirmwareRecovery').find(
      ([, value]) => (value as FirmwareRecoveryCheckpoint).phase === 'load-code'
    )?.[1]
    expect(promoted).toMatchObject({ needsBinding: true, expectedCos: cos, expectedBle: ble })
    expect(promoted).not.toHaveProperty('pendingAddresses')
    expect(journal).toBeNull()
    expect(useDeviceStore().canEnterHome).toBe(true)
    expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/home/welcomeHome')
  }
)

it.each(['unknown', 'binding-error', 'version', 'identity', 'server-error'])(
  'does not let the legacy BLE-only verify exception bypass %s checks',
  async reason => {
    bootloader = false
    updated = true
    binding = 'unbound'
    journal = {
      version: 1,
      seid,
      phase: 'verify',
      needsBinding: false,
      expectedCos: cos,
      expectedBle: ble
    }
    if (reason === 'unknown') binding = 'unknown'
    if (reason === 'binding-error') failedMethod = 'deviceBindCheck'
    if (reason === 'version') cos = 'changed'
    if (reason === 'identity') journal.seid = 'SEID-B'
    if (reason === 'server-error') failedMethod = 'cosCheckUpdate'
    await useConnection().check()
    expect(journal?.needsBinding).toBe(false)
    expect(journal?.phase).toBe('verify')
    for (const method of [
      'cosUpdate',
      'deviceBindAcquire',
      'importBindCode',
      'writeWalletAddress',
      'clearFirmwareRecovery',
      'getBTCXpub'
    ])
      expect(calls(method)).toHaveLength(0)
    expect(useDeviceStore().canEnterHome).toBe(false)
    expect(mocks.push).not.toHaveBeenCalled()
  }
)
