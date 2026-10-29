import { describe, expect, it, vi } from 'vitest'
import type { callDevice } from '../../src/renderer/device'
import type {
  DeviceMethod,
  DeviceResult,
  FirmwareRecoveryCheckpoint
} from '../../src/shared/deviceContract'
import {
  runFirmwareRecovery,
  restoreFirmwareRecovery,
  loadFirmwareRecovery,
  validateFirmwareResume,
  firmwareRecoveryRequiresBinding,
  type FirmwarePhase,
  type FirmwareRecovery
} from '../../src/renderer/composables/firmwareRecovery'

function setup(overrides: Partial<FirmwareRecovery> = {}) {
  const recovery: FirmwareRecovery = {
    seid: 'SEID-A',
    phase: 'update',
    bindCode: 'A2345678',
    needsBinding: true,
    expectedCos: '1.1.0',
    expectedBle: '2.1.0',
    ...overrides
  }
  let active = true
  const responses: Partial<Record<DeviceMethod, DeviceResult>> = {}
  const defaults: Partial<Record<DeviceMethod, unknown>> = {
    getUpgradeSeid: 'SEID-A',
    isBLStatus: false,
    getFirmwareVersion: '1.1.0',
    getBleVersion: '2.1.0',
    exportBindCode: 'A2345678',
    importBindCode: undefined,
    getFirmwareRecovery: null,
    saveFirmwareRecovery: undefined,
    clearFirmwareRecovery: undefined,
    deviceBindCheck: 'bound_this',
    cosCheckUpdate: { isUpdateSuccess: true },
    getInstalledApplets: {
      status: 'latest',
      total: 2,
      list: [{ name: 'Ethereum' }, { name: 'Bitcoin' }]
    }
  }
  const invoke = vi.fn(async (method: DeviceMethod, _params?: unknown): Promise<DeviceResult> => {
    void _params
    return (
      responses[method] ?? {
        isSuccess: true,
        result: method in defaults ? defaults[method] : 'success'
      }
    )
  })
  const call = invoke as typeof callDevice
  const current = () => active
  const onPhase = vi.fn()
  const run = () => runFirmwareRecovery(recovery, { call, current, userPath: '/user', onPhase })
  const retry = async () => {
    const failure = await validateFirmwareResume(recovery, call, current)
    return failure || run()
  }
  const count = (method: DeviceMethod) =>
    invoke.mock.calls.filter(([name]) => name === method).length
  return {
    recovery,
    responses,
    invoke,
    call,
    current,
    onPhase,
    run,
    retry,
    count,
    cancel: () => {
      active = false
    }
  }
}
const failed = (result = 'device_not_connected'): DeviceResult => ({ isSuccess: false, result })
const writes: DeviceMethod[] = [
  'cosUpdate',
  'deviceBindAcquire',
  'importBindCode',
  'writeWalletAddress'
]

describe('firmware recovery stages', () => {
  it('advances only after a successful response and completes the post-update work', async () => {
    const context = setup()
    let release!: (value: DeviceResult) => void
    const original = context.invoke.getMockImplementation()!
    context.invoke.mockImplementation((method, params) =>
      method === 'cosUpdate'
        ? new Promise(resolve => {
            release = resolve
          })
        : original(method, params)
    )
    const pending = context.run()
    await vi.waitFor(() => expect(context.count('cosUpdate')).toBe(1))
    expect(context.recovery.phase).toBe('update')
    expect(context.count('deviceBindAcquire')).toBe(0)
    release({ isSuccess: true, result: 'success' })
    expect(await pending).toBeUndefined()
    expect(context.recovery.phase).toBe('complete')
    for (const method of writes) expect(context.count(method)).toBe(1)
    expect(context.onPhase).toHaveBeenLastCalledWith('complete')
  })

  it.each([
    { method: 'deviceBindAcquire', phase: 'bind', stage: 'bind' },
    { method: 'importBindCode', phase: 'store', stage: 'store' },
    { method: 'getInstalledApplets', phase: 'apps', stage: 'restore' },
    { method: 'writeWalletAddress', phase: 'restore', stage: 'restore' },
    { method: 'exportBindCode', phase: 'load-code', stage: 'store' }
  ] as const)(
    'retries $phase without repeating the successful firmware write',
    async ({ method, phase, stage }) => {
      const context = setup({ bindCode: phase === 'load-code' ? '' : 'A2345678' })
      context.responses[method] = failed()
      expect(await context.run()).toMatchObject({ stage, error: { isSuccess: false } })
      expect(context.recovery.phase).toBe(phase)
      expect(context.count('cosUpdate')).toBe(1)
      const completedBinding = context.count('deviceBindAcquire')
      const completedStorage = context.count('importBindCode')
      delete context.responses[method]
      expect(await context.retry()).toBeUndefined()
      expect(context.recovery.phase).toBe('complete')
      expect(context.count('cosUpdate')).toBe(1)
      if (['store', 'apps', 'restore'].includes(phase))
        expect(context.count('deviceBindAcquire')).toBe(completedBinding)
      if (['apps', 'restore'].includes(phase))
        expect(context.count('importBindCode')).toBe(completedStorage)
    }
  )

  it('keeps an unsuccessful firmware write pending instead of skipping it on retry', async () => {
    const context = setup()
    context.responses.cosUpdate = { isSuccess: true, result: 'not-complete' }
    expect(await context.run()).toMatchObject({ stage: 'update', error: { isSuccess: false } })
    expect(context.recovery.phase).toBe('update')
    expect(context.count('deviceBindAcquire')).toBe(0)
    delete context.responses.cosUpdate
    expect(await context.retry()).toBeUndefined()
    expect(context.count('cosUpdate')).toBe(2)
  })

  it('rechecks the installed set and retries only failed addresses that remain installed', async () => {
    const context = setup()
    context.responses.getInstalledApplets = {
      isSuccess: true,
      result: { list: [{ name: 'Ethereum' }, { name: 'Bitcoin' }, { name: 'EOS' }] }
    }
    context.responses.writeWalletAddress = {
      isSuccess: false,
      result: 'restore_failed',
      failed: ['Ethereum', 'EOS', 'Ethereum', 'not-installed']
    }
    expect(await context.run()).toMatchObject({ stage: 'restore' })
    expect(context.recovery.pendingAddresses).toEqual(['Ethereum', 'EOS'])
    context.responses.getInstalledApplets = {
      isSuccess: true,
      result: { list: [{ name: 'Ethereum' }, { name: 'Bitcoin' }] }
    }
    delete context.responses.writeWalletAddress
    expect(await context.retry()).toBeUndefined()
    expect(context.count('cosUpdate')).toBe(1)
    expect(context.count('getInstalledApplets')).toBe(2)
    const attempts = context.invoke.mock.calls.filter(([method]) => method === 'writeWalletAddress')
    expect(attempts[1][1]).toEqual({ name: ['Ethereum'], filePath: '/user' })
    expect(context.count('deviceBindAcquire')).toBe(1)
    expect(context.count('importBindCode')).toBe(1)
  })

  it('does not run binding or address restoration for an upgrade that needs neither', async () => {
    const context = setup({ needsBinding: false })
    expect(await context.run()).toBeUndefined()
    expect(context.recovery.phase).toBe('complete')
    expect(context.count('cosUpdate')).toBe(1)
    for (const method of writes.filter(method => method !== 'cosUpdate'))
      expect(context.count(method)).toBe(0)
  })

  it.each([
    { phase: 'update', method: 'cosUpdate' },
    { phase: 'bind', method: 'deviceBindAcquire' },
    { phase: 'store', method: 'importBindCode' },
    { phase: 'apps', method: 'getInstalledApplets' },
    { phase: 'restore', method: 'writeWalletAddress' }
  ] as const)(
    'does not advance $phase or issue later writes after cancellation',
    async ({ phase, method }) => {
      const context = setup({ phase, pendingAddresses: ['Ethereum'] })
      const original = context.invoke.getMockImplementation()!
      context.invoke.mockImplementation(async (called, params) => {
        if (called === method) {
          context.cancel()
          return { isSuccess: true, result: 'success' }
        }
        return original(called, params)
      })
      expect(await context.run()).toMatchObject({ error: { code: 'OPERATION_CANCELLED' } })
      expect(context.recovery.phase).toBe(phase)
      expect(context.invoke.mock.calls.at(-1)?.[0]).toBe(method)
      expect(context.count('saveFirmwareRecovery')).toBe(1)
      expect(context.count('clearFirmwareRecovery')).toBe(0)
      expect(context.count(method)).toBe(1)
    }
  )

  it('does not start any device call for an already cancelled workflow', async () => {
    const context = setup()
    context.cancel()
    expect(await context.run()).toMatchObject({ error: { code: 'OPERATION_CANCELLED' } })
    expect(context.invoke).not.toHaveBeenCalled()
  })
})

describe('firmware resume guards', () => {
  it.each([
    { method: 'isBLStatus', result: true, error: 'firmware_recovery_not_ready' },
    { method: 'getFirmwareVersion', result: '1.0.0', error: 'firmware_recovery_version_mismatch' },
    { method: 'getBleVersion', result: '2.0.0', error: 'firmware_recovery_version_mismatch' },
    { method: 'getUpgradeSeid', result: 'SEID-B', error: 'device_session_changed' }
  ] as const)(
    'blocks post-update writes when $method no longer matches',
    async ({ method, result, error }) => {
      const context = setup({ phase: 'bind' })
      context.responses[method] = { isSuccess: true, result }
      expect(await context.retry()).toMatchObject({ error: { isSuccess: false, result: error } })
      expect(context.recovery.phase).toBe('bind')
      for (const method of writes) expect(context.count(method)).toBe(0)
    }
  )

  it('accepts the same identity regardless of hexadecimal letter case', async () => {
    const context = setup({ phase: 'store' })
    context.responses.getUpgradeSeid = { isSuccess: true, result: 'seid-a' }
    expect(await context.retry()).toBeUndefined()
    expect(context.recovery.phase).toBe('complete')
    expect(context.count('cosUpdate')).toBe(0)
    expect(context.count('deviceBindAcquire')).toBe(0)
  })

  it('preserves the pending stage when a resume read fails or is cancelled', async () => {
    const context = setup({ phase: 'restore', pendingAddresses: ['Ethereum'] })
    context.responses.getBleVersion = failed('ble_read_failed')
    expect(await context.retry()).toMatchObject({
      stage: 'check',
      error: { result: 'ble_read_failed' }
    })
    expect(context.recovery.phase).toBe('restore')
    context.invoke.mockImplementationOnce(async () => {
      context.cancel()
      return { isSuccess: true, result: false }
    })
    expect(await context.retry()).toMatchObject({ error: { code: 'OPERATION_CANCELLED' } })
    expect(context.recovery.phase).toBe('restore')
    for (const method of writes) expect(context.count(method)).toBe(0)
  })
})

describe('capturing the actual firmware baseline after upgrading', () => {
  it.each(['getFirmwareVersion', 'getBleVersion'] as const)(
    'retries failed %s reads without repeating COS and captures actual versions together',
    async method => {
      const context = setup({
        expectedCos: '',
        expectedBle: ''
      })
      context.responses[method] = failed('version_read_failed')
      expect(await context.run()).toMatchObject({
        stage: 'check',
        error: { result: 'version_read_failed' }
      })
      expect(context.recovery.phase).toBe('capture-versions')
      expect(context.recovery.expectedCos).toBe('')
      expect(context.recovery.expectedBle).toBe('')
      expect(context.count('deviceBindAcquire')).toBe(0)
      delete context.responses[method]
      expect(await context.retry()).toBeUndefined()
      expect(context.recovery).toMatchObject({
        phase: 'complete',
        expectedCos: '1.1.0',
        expectedBle: '2.1.0'
      })
      expect(context.count('cosUpdate')).toBe(1)
    }
  )

  it('captures actual 1.9.11 when the advertised target is 1.9.12 and the server confirms completion', async () => {
    const context = setup({ expectedCos: '1.9.12', expectedBle: '2.1.01' })
    context.responses.getFirmwareVersion = { isSuccess: true, result: '1.9.11' }
    context.responses.getBleVersion = { isSuccess: true, result: '2.1.00' }
    context.responses.cosCheckUpdate = {
      isSuccess: true,
      result: {
        latestCosVersion: '1.9.12',
        latestBleVersion: '2.1.01',
        isLatest: false,
        isUpdateSuccess: true
      }
    }
    expect(await context.run()).toBeUndefined()
    expect(context.recovery).toMatchObject({
      phase: 'complete',
      expectedCos: '1.9.11',
      expectedBle: '2.1.00'
    })
    const checkpoints = context.invoke.mock.calls
      .filter(([method]) => method === 'saveFirmwareRecovery')
      .map(([, value]) => value as FirmwareRecoveryCheckpoint)
    expect(checkpoints.find(value => value.phase === 'capture-versions')).toMatchObject({
      expectedCos: '',
      expectedBle: ''
    })
    expect(checkpoints.find(value => value.phase === 'bind')).toMatchObject({
      expectedCos: '1.9.11',
      expectedBle: '2.1.00'
    })
    expect(context.count('cosUpdate')).toBe(1)
    expect(context.count('deviceBindAcquire')).toBe(1)
    expect(context.count('clearFirmwareRecovery')).toBe(1)
  })

  it.each([
    { method: 'isBLStatus', response: failed('mode_unavailable') },
    { method: 'isBLStatus', response: { isSuccess: true, result: true } },
    { method: 'getFirmwareVersion', response: failed('cos_unavailable') },
    { method: 'getFirmwareVersion', response: { isSuccess: true, result: '' } },
    { method: 'getBleVersion', response: failed('ble_unavailable') },
    { method: 'getBleVersion', response: { isSuccess: true, result: '' } },
    { method: 'cosCheckUpdate', response: failed('remote_unavailable') },
    { method: 'cosCheckUpdate', response: { isSuccess: true, result: { isUpdateSuccess: false } } },
    { method: 'cosCheckUpdate', response: { isSuccess: true, result: { isLatest: true } } },
    { method: 'getUpgradeSeid', response: failed('identity_unavailable') },
    { method: 'getUpgradeSeid', response: { isSuccess: true, result: 'SEID-B' } }
  ] as { method: DeviceMethod; response: DeviceResult }[])(
    'does not partially commit versions, bind, or clear when capture $method returns $response',
    async ({ method, response }) => {
      const context = setup({ expectedCos: 'stale-target', expectedBle: 'stale-target' })
      context.responses[method] = response
      expect(await context.run()).toMatchObject({ error: { isSuccess: false } })
      expect(context.recovery.phase).toBe('capture-versions')
      expect(context.recovery.expectedCos).toBe('')
      expect(context.recovery.expectedBle).toBe('')
      expect(context.count('cosUpdate')).toBe(1)
      expect(context.count('deviceBindAcquire')).toBe(0)
      expect(context.count('importBindCode')).toBe(0)
      expect(context.count('writeWalletAddress')).toBe(0)
      expect(context.count('clearFirmwareRecovery')).toBe(0)
    }
  )

  it.each([
    'isBLStatus',
    'getFirmwareVersion',
    'getBleVersion',
    'cosCheckUpdate',
    'getUpgradeSeid'
  ] as const)('does not partially commit capture after cancellation during %s', async method => {
    const context = setup({ phase: 'capture-versions', expectedCos: '', expectedBle: '' })
    const original = context.invoke.getMockImplementation()!
    context.invoke.mockImplementation(async (called, params) => {
      const response = await original(called, params)
      if (called === method) context.cancel()
      return response
    })
    expect(await context.run()).toMatchObject({ error: { code: 'OPERATION_CANCELLED' } })
    expect(context.recovery.phase).toBe('capture-versions')
    expect(context.recovery.expectedCos).toBe('')
    expect(context.recovery.expectedBle).toBe('')
    for (const method of writes) expect(context.count(method)).toBe(0)
    expect(context.count('clearFirmwareRecovery')).toBe(0)
    expect(context.invoke.mock.calls.at(-1)?.[0]).toBe(method)
  })

  it('checks mode and identity before recapturing, without comparing stale target versions', async () => {
    const context = setup({
      phase: 'capture-versions',
      expectedCos: '1.9.12',
      expectedBle: '3.0.01'
    })
    expect(
      await validateFirmwareResume(context.recovery, context.call, context.current)
    ).toBeUndefined()
    expect(context.invoke.mock.calls.map(([method]) => method)).toEqual([
      'isBLStatus',
      'getUpgradeSeid'
    ])
    expect(await context.run()).toBeUndefined()
    expect(context.count('cosUpdate')).toBe(0)
    expect(context.recovery).toMatchObject({ expectedCos: '1.1.0', expectedBle: '2.1.0' })
  })

  it.each(['getFirmwareVersion', 'getBleVersion'] as const)(
    'keeps the captured baseline and blocks completion when %s changes later',
    async method => {
      const context = setup({ expectedCos: 'advertised-cos', expectedBle: 'advertised-ble' })
      const original = context.invoke.getMockImplementation()!
      context.invoke.mockImplementation(async (called, params) => {
        const response = await original(called, params)
        if (called === 'writeWalletAddress')
          context.responses[method] = { isSuccess: true, result: '9.9.9' }
        return response
      })
      expect(await context.run()).toMatchObject({
        error: { result: 'firmware_recovery_version_mismatch' }
      })
      expect(context.recovery).toMatchObject({
        phase: 'verify',
        expectedCos: '1.1.0',
        expectedBle: '2.1.0'
      })
      expect(context.count('clearFirmwareRecovery')).toBe(0)
    }
  )
})

describe('binding code identity guards', () => {
  it('rejects unknown binding status before loading or acquiring a recovery code', async () => {
    const context = setup({ phase: 'load-code', bindCode: '' })
    context.responses.deviceBindCheck = { isSuccess: true, result: 'unknown' }
    expect(await context.run()).toMatchObject({
      stage: 'bind',
      error: { result: 'device_bind_check_failed' }
    })
    expect(context.recovery.phase).toBe('load-code')
    expect(context.count('exportBindCode')).toBe(0)
    expect(context.count('deviceBindAcquire')).toBe(0)
    expect(context.count('clearFirmwareRecovery')).toBe(0)
  })
  it('checks identity before reading a binding code and after reading it before binding', async () => {
    const context = setup({ phase: 'load-code', bindCode: '' })
    const original = context.invoke.getMockImplementation()!
    let checkedBeforeReading = false
    let checkedAfterReading = false
    context.invoke.mockImplementation(async (method, params) => {
      if (method === 'getUpgradeSeid') {
        if (context.count('exportBindCode')) checkedAfterReading = true
        else checkedBeforeReading = true
      }
      if (method === 'exportBindCode') expect(checkedBeforeReading).toBe(true)
      if (method === 'deviceBindAcquire') expect(checkedAfterReading).toBe(true)
      return original(method, params)
    })
    expect(await context.run()).toBeUndefined()
    expect(context.recovery.phase).toBe('complete')
  })

  it('does not read another device binding code when identity changed before loading', async () => {
    const context = setup({ phase: 'load-code', bindCode: '' })
    context.responses.getUpgradeSeid = { isSuccess: true, result: 'SEID-B' }
    expect(await context.run()).toMatchObject({
      stage: 'connect',
      error: { result: 'device_session_changed' }
    })
    expect(context.count('exportBindCode')).toBe(0)
    expect(context.count('deviceBindAcquire')).toBe(0)
    expect(context.recovery.bindCode).toBe('')
  })

  it('does not bind a code if identity changes during the file read', async () => {
    const context = setup({ phase: 'load-code', bindCode: '' })
    const original = context.invoke.getMockImplementation()!
    context.invoke.mockImplementation(async (method, params) => {
      const result = await original(method, params)
      if (method === 'exportBindCode')
        context.responses.getUpgradeSeid = { isSuccess: true, result: 'SEID-B' }
      return result
    })
    expect(await context.run()).toMatchObject({
      stage: 'connect',
      error: { result: 'device_session_changed' }
    })
    expect(context.recovery.phase).toBe('load-code')
    expect(context.recovery.bindCode).toBe('')
    expect(context.count('deviceBindAcquire')).toBe(0)
  })
})

describe('durable firmware recovery safety', () => {
  it('limits the missing-binding preflight exception to verify on a BLE-only plan', () => {
    expect(firmwareRecoveryRequiresBinding('verify', false)).toBe(false)
    expect(firmwareRecoveryRequiresBinding('verify', true)).toBe(true)
    for (const phase of ['store', 'apps', 'restore', 'complete'] as const)
      expect(firmwareRecoveryRequiresBinding(phase, false)).toBe(true)
  })
  it.each(['update', 'capture-versions'] as const)(
    'migrates legacy v1 %s targets to an uncaptured baseline',
    phase => {
      const restored = restoreFirmwareRecovery({
        version: 1,
        seid: 'SEID-A',
        phase,
        needsBinding: true,
        expectedCos: '1.9.12',
        expectedBle: '3.0.01'
      })
      expect(restored).toMatchObject({ phase, expectedCos: '', expectedBle: '', bindCode: '' })
    }
  )

  it.each(['load-code', 'bind', 'store', 'apps', 'restore', 'verify'] as const)(
    'retains the observed v1 baseline for %s',
    phase => {
      const restored = restoreFirmwareRecovery({
        version: 1,
        seid: 'SEID-A',
        phase,
        needsBinding: true,
        expectedCos: '1.9.11',
        expectedBle: '3.0.00',
        pendingAddresses: ['Ethereum']
      })
      expect(restored).toMatchObject({
        phase,
        expectedCos: '1.9.11',
        expectedBle: '3.0.00',
        pendingAddresses: ['Ethereum'],
        bindCode: ''
      })
    }
  )

  it.each([
    ['update', false],
    ['capture-versions', false],
    ['load-code', false],
    ['bind', false],
    ['store', true],
    ['apps', true],
    ['restore', true],
    ['verify', true],
    ['complete', true]
  ] as [FirmwarePhase, boolean][])('requires binding for %s: %s', (phase, required) => {
    expect(firmwareRecoveryRequiresBinding(phase)).toBe(required)
  })

  it('discards an old failed-address subset only after native firmware work succeeds', async () => {
    const context = setup({ pendingAddresses: ['Ethereum'] })
    context.responses.cosUpdate = failed('native_update_failed')
    expect(await context.run()).toMatchObject({ stage: 'update' })
    expect(context.recovery.pendingAddresses).toEqual(['Ethereum'])
    expect(context.count('writeWalletAddress')).toBe(0)
    delete context.responses.cosUpdate
    expect(await context.retry()).toBeUndefined()
    const registration = context.invoke.mock.calls.find(
      ([method]) => method === 'writeWalletAddress'
    )
    expect(registration?.[1]).toEqual({ name: ['Ethereum', 'Bitcoin'], filePath: '/user' })
    expect(context.count('cosUpdate')).toBe(2)
  })

  it('does not send COS when the pending update cannot be saved', async () => {
    const context = setup()
    context.responses.saveFirmwareRecovery = {
      isSuccess: false,
      result: 'firmware_recovery_write_failed',
      code: 'FIRMWARE_RECOVERY_WRITE_FAILED'
    }
    expect(await context.run()).toMatchObject({
      stage: 'store',
      error: { code: 'FIRMWARE_RECOVERY_WRITE_FAILED' }
    })
    expect(context.recovery.phase).toBe('update')
    expect(context.invoke.mock.calls.map(([method]) => method)).toEqual(['saveFirmwareRecovery'])
  })

  it('saves each pending phase before its work without persisting a binding code', async () => {
    const context = setup({ bindCode: '' })
    const original = context.invoke.getMockImplementation()!
    const requiredPhase: Partial<Record<DeviceMethod, string>> = {
      cosUpdate: 'update',
      exportBindCode: 'load-code',
      deviceBindAcquire: 'bind',
      importBindCode: 'store',
      getInstalledApplets: 'apps',
      writeWalletAddress: 'restore'
    }
    let persistedPhase = ''
    context.invoke.mockImplementation(async (method, params) => {
      if (method === 'saveFirmwareRecovery') {
        const checkpoint = params as FirmwareRecoveryCheckpoint
        persistedPhase = checkpoint.phase
        expect(checkpoint).not.toHaveProperty('bindCode')
        expect(checkpoint).not.toHaveProperty('captureVersionsAfterUpdate')
        expect(JSON.stringify(checkpoint)).not.toContain('A2345678')
      } else if (method === 'cosCheckUpdate')
        expect(['capture-versions', 'verify']).toContain(persistedPhase)
      else if (requiredPhase[method]) expect(persistedPhase).toBe(requiredPhase[method])
      return original(method, params)
    })
    expect(await context.run()).toBeUndefined()
    const checkpoints = context.invoke.mock.calls
      .filter(([method]) => method === 'saveFirmwareRecovery')
      .map(([, params]) => params as FirmwareRecoveryCheckpoint)
    expect(checkpoints.map(value => value.phase)).toEqual([
      'update',
      'capture-versions',
      'load-code',
      'bind',
      'store',
      'apps',
      'restore',
      'verify'
    ])
    expect(checkpoints.find(value => value.phase === 'restore')?.pendingAddresses).toEqual([
      'Ethereum',
      'Bitcoin'
    ])
    expect(context.invoke.mock.calls.at(-1)).toEqual(['clearFirmwareRecovery', { seid: 'SEID-A' }])
  })

  it('reports clear failure instead of successful completion and retries clearing safely', async () => {
    const context = setup()
    context.responses.clearFirmwareRecovery = failed('firmware_recovery_write_failed')
    expect(await context.run()).toMatchObject({
      stage: 'store',
      error: { result: 'firmware_recovery_write_failed' }
    })
    expect(context.count('cosCheckUpdate')).toBe(2)
    expect(context.count('clearFirmwareRecovery')).toBe(1)
    delete context.responses.clearFirmwareRecovery
    expect(await context.retry()).toBeUndefined()
    expect(context.count('clearFirmwareRecovery')).toBe(2)
    expect(context.count('cosUpdate')).toBe(1)
    expect(context.count('deviceBindAcquire')).toBe(1)
    expect(context.count('writeWalletAddress')).toBe(1)
  })

  it.each([
    failed('binding_transport_failed'),
    { isSuccess: true, result: 'unbound' },
    { isSuccess: true, result: 'bound_other' },
    { isSuccess: true, result: 'unknown' }
  ] as DeviceResult[])(
    'does not trust successful acquire when the next bind check is %j',
    async binding => {
      const context = setup({ phase: 'bind' })
      context.responses.deviceBindCheck = binding
      expect(await context.run()).toMatchObject({ stage: 'bind', error: { isSuccess: false } })
      expect(context.count('deviceBindAcquire')).toBe(1)
      expect(context.recovery.phase).toBe('store')
      for (const method of [
        'importBindCode',
        'getInstalledApplets',
        'writeWalletAddress',
        'clearFirmwareRecovery'
      ] as const)
        expect(context.count(method)).toBe(0)
    }
  )

  it.each([
    failed('remote_check_unavailable'),
    { isSuccess: true, result: { isLatest: true, isUpdateSuccess: false } },
    { isSuccess: true, result: { isLatest: true } }
  ] as DeviceResult[])(
    'retains recovery when final remote completion check returns %j',
    async status => {
      const context = setup({ phase: 'verify' })
      context.responses.cosCheckUpdate = status
      expect(await context.run()).toMatchObject({ stage: 'check', error: { isSuccess: false } })
      expect(context.recovery.phase).toBe('verify')
      expect(context.count('clearFirmwareRecovery')).toBe(0)
      for (const method of writes) expect(context.count(method)).toBe(0)
    }
  )

  it('loads the saved code at store after restart without reacquiring binding or rewriting COS', async () => {
    const checkpoint: FirmwareRecoveryCheckpoint = {
      version: 1,
      seid: 'SEID-A',
      phase: 'store',
      needsBinding: true,
      expectedCos: '1.1.0',
      expectedBle: '2.1.0'
    }
    const context = setup(restoreFirmwareRecovery(checkpoint))
    expect(context.recovery.bindCode).toBe('')
    expect(await context.retry()).toBeUndefined()
    expect(context.count('exportBindCode')).toBe(1)
    expect(context.count('deviceBindAcquire')).toBe(0)
    expect(context.count('cosUpdate')).toBe(0)
    expect(context.invoke).toHaveBeenCalledWith('importBindCode', 'A2345678')
    const methods = context.invoke.mock.calls.map(([method]) => method)
    expect(methods.indexOf('deviceBindCheck')).toBeLessThan(methods.indexOf('exportBindCode'))
    expect(methods.indexOf('exportBindCode')).toBeLessThan(methods.indexOf('importBindCode'))
  })

  it('restores only a valid same-device checkpoint with a blank in-memory binding code', async () => {
    const context = setup()
    const checkpoint: FirmwareRecoveryCheckpoint = {
      version: 1,
      seid: 'seid-a',
      phase: 'restore',
      needsBinding: true,
      expectedCos: '1.1.0',
      expectedBle: '2.1.0',
      pendingAddresses: ['Ethereum']
    }
    context.responses.getFirmwareRecovery = { isSuccess: true, result: checkpoint }
    expect(await loadFirmwareRecovery(context.call, 'SEID-A')).toMatchObject({
      isSuccess: true,
      result: { phase: 'restore', bindCode: '', pendingAddresses: ['Ethereum'] }
    })
    expect(await loadFirmwareRecovery(context.call, 'SEID-B')).toMatchObject({
      isSuccess: false,
      result: 'device_session_changed'
    })
    context.responses.getFirmwareRecovery = {
      isSuccess: true,
      result: { ...checkpoint, bindCode: 'SECRET12' }
    }
    expect(await loadFirmwareRecovery(context.call, 'SEID-A')).toMatchObject({
      isSuccess: false,
      result: 'firmware_recovery_unreadable'
    })
    for (const method of writes) expect(context.count(method)).toBe(0)
  })
})

describe('promoting a BLE-only plan to full recovery', () => {
  function pending(phase: 'capture-versions' | 'verify', status = 'unbound') {
    const context = setup({
      phase,
      needsBinding: false,
      bindCode: '',
      expectedCos: phase === 'verify' ? '1.1.0' : '',
      expectedBle: phase === 'verify' ? '2.1.0' : '',
      pendingAddresses: ['Ethereum']
    })
    let acquired = false
    const original = context.invoke.getMockImplementation()!
    context.invoke.mockImplementation(async (method, params) => {
      if (method === 'deviceBindCheck' && !acquired && !context.responses[method])
        return { isSuccess: true, result: status }
      const result = await original(method, params)
      if (method === 'deviceBindAcquire' && result.isSuccess) acquired = true
      return result
    })
    return context
  }

  it('leaves an unchanged COS with bound_this on the BLE-only path', async () => {
    const context = setup({ needsBinding: false, previousCos: '1.1.0', bindCode: '' })
    expect(await context.run()).toBeUndefined()
    expect(context.recovery.needsBinding).toBe(false)
    for (const method of [
      'exportBindCode',
      'deviceBindAcquire',
      'importBindCode',
      'writeWalletAddress'
    ] as const)
      expect(context.count(method)).toBe(0)
    expect(context.count('cosUpdate')).toBe(1)
    expect(context.count('clearFirmwareRecovery')).toBe(1)
  })

  it('rebuilds every installed address when actual COS changed even if still bound_this', async () => {
    const context = pending('capture-versions', 'bound_this')
    context.recovery.previousCos = '1.0.0'
    expect(await context.run()).toBeUndefined()
    expect(context.recovery.needsBinding).toBe(true)
    expect(context.count('cosUpdate')).toBe(0)
    expect(context.count('exportBindCode')).toBe(1)
    expect(context.count('deviceBindAcquire')).toBe(1)
    expect(context.invoke).toHaveBeenCalledWith('writeWalletAddress', {
      name: ['Ethereum', 'Bitcoin'],
      filePath: '/user'
    })
    const promoted = context.invoke.mock.calls.find(
      ([method, value]) =>
        method === 'saveFirmwareRecovery' &&
        (value as FirmwareRecoveryCheckpoint).phase === 'load-code'
    )?.[1]
    expect(promoted).toMatchObject({
      needsBinding: true,
      previousCos: '1.0.0',
      expectedCos: '1.1.0'
    })
    expect(promoted).not.toHaveProperty('pendingAddresses')
  })

  it.each(['capture-versions', 'verify'] as const)(
    'repairs an old %s checkpoint without previousCos after binding loss',
    async phase => {
      for (const status of ['unbound', 'bound_other']) {
        const context = pending(phase, status)
        expect(await context.run()).toBeUndefined()
        expect(context.recovery.needsBinding).toBe(true)
        expect(context.count('cosUpdate')).toBe(0)
        expect(context.count('deviceBindAcquire')).toBe(1)
        expect(context.invoke).toHaveBeenCalledWith('writeWalletAddress', {
          name: ['Ethereum', 'Bitcoin'],
          filePath: '/user'
        })
        const methods = context.invoke.mock.calls.map(([method]) => method)
        expect(methods.indexOf('cosCheckUpdate')).toBeLessThan(methods.indexOf('exportBindCode'))
        expect(methods.indexOf('getUpgradeSeid')).toBeLessThan(methods.indexOf('exportBindCode'))
        expect(context.count('clearFirmwareRecovery')).toBe(1)
      }
    }
  )

  const failures: { method: DeviceMethod; response: DeviceResult }[] = [
    { method: 'deviceBindCheck', response: failed('binding_unavailable') },
    { method: 'deviceBindCheck', response: { isSuccess: true, result: 'unknown' } },
    { method: 'isBLStatus', response: failed('mode_unavailable') },
    { method: 'isBLStatus', response: { isSuccess: true, result: true } },
    { method: 'getFirmwareVersion', response: failed('cos_unavailable') },
    { method: 'getFirmwareVersion', response: { isSuccess: true, result: '' } },
    { method: 'getBleVersion', response: failed('ble_unavailable') },
    { method: 'getBleVersion', response: { isSuccess: true, result: '' } },
    { method: 'getUpgradeSeid', response: failed('identity_unavailable') },
    { method: 'getUpgradeSeid', response: { isSuccess: true, result: 'SEID-B' } },
    { method: 'cosCheckUpdate', response: failed('server_unavailable') },
    { method: 'cosCheckUpdate', response: { isSuccess: true, result: { isUpdateSuccess: false } } }
  ]
  it.each(
    failures.flatMap(failure =>
      (['capture-versions', 'verify'] as const).map(phase => ({ ...failure, phase }))
    )
  )(
    '$phase refuses promotion when $method returns $response',
    async ({ phase, method, response }) => {
      const context = pending(phase)
      // A changed COS must not bypass the binding/identity validation during capture.
      context.recovery.previousCos = '1.0.0'
      const original = structuredClone(context.recovery)
      context.responses[method] = response
      expect(await context.run()).toMatchObject({ error: { isSuccess: false } })
      expect(context.recovery).toEqual(original)
      for (const method of [...writes, 'exportBindCode', 'clearFirmwareRecovery'] as const)
        expect(context.count(method)).toBe(0)
      expect(
        context.invoke.mock.calls.filter(([name]) => name === 'saveFirmwareRecovery')
      ).toHaveLength(1)
    }
  )

  it.each(['getFirmwareVersion', 'getBleVersion'] as const)(
    'does not repair a legacy verify record whose %s changed',
    async method => {
      const context = pending('verify')
      context.responses[method] = { isSuccess: true, result: '9.9.9' }
      expect(await context.run()).toMatchObject({
        error: { result: 'firmware_recovery_version_mismatch' }
      })
      expect(context.recovery.needsBinding).toBe(false)
      expect(context.recovery.phase).toBe('verify')
      for (const method of [...writes, 'exportBindCode', 'clearFirmwareRecovery'] as const)
        expect(context.count(method)).toBe(0)
    }
  )

  it('does not read a code or bind when the promoted checkpoint cannot be saved', async () => {
    const context = pending('verify')
    const original = context.invoke.getMockImplementation()!
    context.invoke.mockImplementation(async (method, params) => {
      if (
        method === 'saveFirmwareRecovery' &&
        (params as FirmwareRecoveryCheckpoint).phase === 'load-code'
      )
        return failed('firmware_recovery_write_failed')
      return original(method, params)
    })
    expect(await context.run()).toMatchObject({ stage: 'store' })
    for (const method of [...writes, 'exportBindCode', 'clearFirmwareRecovery'] as const)
      expect(context.count(method)).toBe(0)
  })
})
