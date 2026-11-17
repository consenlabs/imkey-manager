import { expect, it, vi } from 'vitest'
import { createDeviceOperation } from '../../src/renderer/composables/useDeviceOperation'
import type { callDevice } from '../../src/renderer/device'
import type { DeviceOperationTrace } from '../../src/shared/deviceContract'
import type { FirmwareDiagnosticStage } from '../../src/shared/firmwareDiagnostics'

it('serializes complete workflows and ignores repeated entry', async () => {
  const steps: string[] = []
  let release!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  const a = createDeviceOperation()
  const b = createDeviceOperation()
  const first = a.run(async () => {
    steps.push('a1')
    await gate
    steps.push('a2')
  })
  const duplicate = a.run(async () => {
    steps.push('duplicate')
  })
  const second = b.run(async () => {
    steps.push('b1')
    steps.push('b2')
  })
  await Promise.resolve()
  expect(steps).toEqual(['a1'])
  release()
  await Promise.all([first, duplicate, second])
  expect(steps).toEqual(['a1', 'a2', 'b1', 'b2'])
})
it('does not interrupt an in-flight call but stops subsequent calls after disposal', async () => {
  let release!: (value: { isSuccess: true; result: string }) => void
  const native = vi.fn(
    () =>
      new Promise(resolve => {
        release = resolve
      })
  )
  const operation = createDeviceOperation(native as typeof callDevice)
  const pending = operation.call('cosUpdate')
  operation.dispose()
  release({ isSuccess: true, result: 'success' })
  expect(await pending).toMatchObject({ isSuccess: false, code: 'OPERATION_CANCELLED' })
  expect(await operation.call('deviceBindAcquire', 'PRIVATE')).toMatchObject({
    code: 'OPERATION_CANCELLED'
  })
  expect(native).toHaveBeenCalledTimes(1)
})
it('a rejected workflow releases the queue, and a disposed queued workflow never starts', async () => {
  const a = createDeviceOperation()
  const b = createDeviceOperation()
  const c = createDeviceOperation()
  const task = vi.fn(async () => {})
  const first = a.run(async () => {
    throw new Error('failure')
  })
  const skipped = b.run(task)
  b.dispose()
  const last = c.run(async () => 'next')
  await expect(first).rejects.toThrow('failure')
  await skipped
  expect(task).not.toHaveBeenCalled()
  expect(await last).toBe('next')
})

it('uses one operation ID for every step and a new ID for the next workflow', async () => {
  const invoke = vi.fn(async () => ({ isSuccess: true as const, result: 'success' }))
  const operation = createDeviceOperation(invoke as typeof callDevice)
  await operation.run(async () => {
    await operation.call('connectDevice')
    await operation.call('cosUpdate')
  })
  await operation.run(async () => {
    await operation.call('getSeid')
  })
  const contexts = invoke.mock.calls.map(
    args => (args as unknown[])[2] as { operationId: string; stage: string }
  )
  expect(contexts[0].operationId).toMatch(/^[a-z0-9-]+$/)
  expect(contexts[0].operationId).toBe(contexts[1].operationId)
  expect(contexts[2].operationId).not.toBe(contexts[0].operationId)
  expect(contexts.map(context => context.stage)).toEqual(['connectDevice', 'cosUpdate', 'getSeid'])
})

it('queues a first user action during initialization instead of dropping the click', async () => {
  const operation = createDeviceOperation()
  const steps: string[] = []
  let release!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  const initialized = operation.run(async () => {
    steps.push('initialize')
    await gate
  }, 'initialize')
  const clicked = operation.run(async () => {
    steps.push('connect')
  })
  const repeated = operation.run(async () => {
    steps.push('duplicate')
  })
  await Promise.resolve()
  expect(steps).toEqual(['initialize'])
  release()
  await Promise.all([initialized, clicked, repeated])
  expect(steps).toEqual(['initialize', 'connect'])
})

it('correlates immediate feedback, queue waiting and native work without exposing results', async () => {
  const clock = vi.spyOn(Date, 'now').mockReturnValue(1000)
  const traces: DeviceOperationTrace[] = []
  const invoke = vi.fn(async () => ({ isSuccess: true as const, result: 'private-device-data' }))
  const operation = createDeviceOperation(invoke as typeof callDevice, event => {
    traces.push(event)
  })
  let release!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  try {
    const initializing = operation.run(() => gate, 'initialize')
    await Promise.resolve()
    clock.mockReturnValue(1100)
    const upgrading = operation.run(() => operation.call('cosUpdate'), 'action', 'firmware-upgrade')
    const duplicate = operation.run(async () => {}, 'action', 'firmware-upgrade')
    const upgradeId = traces.find(event => event.action === 'firmware-upgrade')!.operationId
    expect(invoke).not.toHaveBeenCalled()
    clock.mockReturnValue(1120)
    operation.feedback?.('firmware-upgrade')
    operation.feedback?.('firmware-upgrade')
    clock.mockReturnValue(1500)
    release()
    await Promise.all([initializing, upgrading, duplicate])
    expect(traces.filter(event => event.operationId === upgradeId)).toEqual([
      { operationId: upgradeId, action: 'firmware-upgrade', phase: 'enqueued' },
      { operationId: upgradeId, action: 'firmware-upgrade', phase: 'feedback', durationMs: 20 },
      { operationId: upgradeId, action: 'firmware-upgrade', phase: 'started', queueMs: 400 },
      { operationId: upgradeId, action: 'firmware-upgrade', phase: 'finished', durationMs: 400 }
    ])
    expect(invoke).toHaveBeenCalledExactlyOnceWith('cosUpdate', undefined, {
      operationId: upgradeId,
      stage: 'cosUpdate'
    })
    expect(JSON.stringify(traces)).not.toContain('private-device-data')
  } finally {
    release()
    clock.mockRestore()
  }
})

it('never delays or rejects business work when trace delivery throws or rejects', async () => {
  const trace = vi.fn((): Promise<void> => {
    throw new Error('bridge unavailable')
  })
  const operation = createDeviceOperation(undefined, trace)
  expect(
    await operation.run(async () => {
      operation.failure?.('check', new Error('private-data'))
      return 'first'
    })
  ).toBe('first')
  trace.mockRejectedValue(new Error('IPC unavailable'))
  expect(
    await operation.run(async () => {
      operation.failure?.('wallet', 'invalid_wallet_response')
      return 'second'
    })
  ).toBe('second')
  trace.mockImplementation(() => new Promise(() => {}))
  expect(
    await operation.run(async () => {
      operation.failure?.('restore', { code: 'PRIVATE_BIND_CODE' })
      return 'third'
    })
  ).toBe('third')
})

it('associates safe business failures with the current run and preserves the next run', async () => {
  const traces: DeviceOperationTrace[] = []
  const invoke = vi.fn(async () => ({ isSuccess: true as const, result: 'private-device-data' }))
  const operation = createDeviceOperation(invoke as typeof callDevice, trace => {
    traces.push(trace)
  })
  await operation.run(
    async () => {
      await operation.call('getFirmwareVersion')
      operation.failure?.('capture-versions', {
        result: 'firmware_recovery_version_mismatch',
        code: 'DEVICE_OPERATION_FAILED',
        bindCode: 'A2345678',
        seid: 'SEID-PRIVATE',
        version: '1.9.11',
        wallet: 'xpub-private'
      })
    },
    'action',
    'firmware-upgrade'
  )
  await operation.run(async () => {
    operation.failure?.('wallet', { result: 'private-device-data', code: 'SEID-PRIVATE' })
  })
  const failed = traces.filter(event => event.phase === 'failed')
  expect(failed).toHaveLength(2)
  const firstId = ((invoke.mock.calls[0] as unknown[])[2] as { operationId: string }).operationId
  expect(failed[0]).toEqual({
    operationId: firstId,
    action: 'firmware-upgrade',
    phase: 'failed',
    stage: 'capture-versions',
    code: 'FIRMWARE_RECOVERY_VERSION_MISMATCH'
  })
  expect(failed[1]).toMatchObject({
    action: 'action',
    stage: 'wallet',
    code: 'DEVICE_OPERATION_FAILED'
  })
  expect(failed[1].operationId).not.toBe(firstId)
  expect(traces.filter(event => event.operationId === firstId).map(event => event.phase)).toEqual([
    'enqueued',
    'started',
    'failed',
    'finished'
  ])
  expect(JSON.stringify(traces)).not.toMatch(
    /A2345678|SEID-PRIVATE|1\.9\.11|xpub-private|private-device-data/
  )
})

it('does not invent failure IDs outside an active run or accept unknown stages', async () => {
  const trace = vi.fn()
  const operation = createDeviceOperation(undefined, trace)
  operation.failure?.('check', 'device_session_changed')
  expect(trace).not.toHaveBeenCalled()
  await operation.run(async () => {
    operation.failure?.('A2345678' as FirmwareDiagnosticStage, 'device_session_changed')
    operation.dispose()
    operation.failure?.('check', 'device_session_changed')
  })
  operation.failure?.('check', 'device_session_changed')
  expect(trace.mock.calls.some(([event]) => event.phase === 'failed')).toBe(false)
})
