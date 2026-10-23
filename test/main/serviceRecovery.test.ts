import { EventEmitter } from 'node:events'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  ServiceClient,
  type ServiceTimeouts,
  type ServiceTransport
} from '../../src/main/serviceClient'
import type { DeviceCallContext, DeviceMethod, DeviceResult } from '../../src/shared/deviceContract'
import { failureCode } from '../../src/shared/deviceErrors'

class Transport extends EventEmitter implements ServiceTransport {
  messages: { id?: number; method?: DeviceMethod; type?: string }[] = []
  kills = 0
  stdout = new EventEmitter()
  postMessage(message: unknown): void {
    this.messages.push(message as (typeof this.messages)[number])
  }
  kill(): boolean {
    this.kills++
    return true
  }
  ready(): void {
    this.emit('message', { type: 'ready' })
  }
  begin(method: DeviceMethod): number {
    const request = [...this.messages].reverse().find(message => message.method === method)
    if (request?.id === undefined) throw new Error(`No queued ${method}`)
    this.emit('message', { type: 'trace', phase: 'start', id: request.id, method })
    return request.id
  }
  reply(id: number, result: DeviceResult = { isSuccess: true, result: 'success' }): void {
    this.emit('message', { type: 'trace', phase: 'end', id, durationMs: 1 })
    this.emit('message', { id, result })
  }
}
const configuration = {
  userDataPath: '/user',
  libraryPath: '/connector.dylib',
  platform: 'darwin' as const,
  isPackaged: false
}
const shortTimeouts: ServiceTimeouts = {
  startupMs: 100,
  readMs: 20,
  connectMs: 40,
  writeMs: 60
}
const clients: ServiceClient[] = []
afterEach(() => {
  clients.splice(0).forEach(client => client.stop())
  vi.unstubAllEnvs()
  vi.useRealTimers()
})
function fixture(timeouts: Partial<ServiceTimeouts> = shortTimeouts) {
  vi.useFakeTimers()
  const transports: Transport[] = []
  const log = vi.fn()
  const client = new ServiceClient(
    () => {
      const transport = new Transport()
      transports.push(transport)
      return transport
    },
    configuration,
    () => {},
    log,
    timeouts
  )
  clients.push(client)
  return { client, transports, log }
}
const timeoutResult = {
  isSuccess: false,
  result: 'device_operation_timeout',
  code: 'DEVICE_OPERATION_TIMEOUT'
}

describe('non-firmware communication recovery', () => {
  it('fails the whole interrupted generation without replaying requests in its replacement', async () => {
    const { client, transports } = fixture()
    const running = client.call('getSeid', undefined, { operationId: 'read-1', stage: 'getSeid' })
    const queued = client.call('getSn')
    const old = transports[0]
    old.ready()
    old.begin('getSeid')
    await vi.advanceTimersByTimeAsync(20)
    expect(await running).toMatchObject({
      ...timeoutResult,
      method: 'getSeid',
      stage: 'getSeid',
      operationId: 'read-1'
    })
    expect(await queued).toMatchObject({ ...timeoutResult, method: 'getSn' })
    expect(old.kills).toBe(1)
    await vi.advanceTimersByTimeAsync(250)
    expect(transports).toHaveLength(2)
    expect(transports[1].messages).toEqual([{ type: 'init', ...configuration }])
    transports[1].ready()
    expect(transports[1].messages).toHaveLength(1)
    const retry = client.call('getSeid', undefined, { operationId: 'read-2' })
    transports[1].reply(transports[1].begin('getSeid'))
    expect(await retry).toEqual({ isSuccess: true, result: 'success' })
  })

  it('starts execution deadlines from trace start, not while waiting in the queue', async () => {
    const { client, transports } = fixture()
    const first = client.call('getSeid')
    const second = client.call('getSn')
    const transport = transports[0]
    transport.ready()
    const id = transport.begin('getSeid')
    await vi.advanceTimersByTimeAsync(19)
    transport.reply(id)
    await first
    await vi.advanceTimersByTimeAsync(200)
    expect(transport.kills).toBe(0)
    transport.begin('getSn')
    await vi.advanceTimersByTimeAsync(20)
    expect(await second).toMatchObject(timeoutResult)
    expect(transport.kills).toBe(1)
  })

  it.each([
    ['getSeid', 120_000],
    ['connectDevice', 330_000],
    ['downloadApplet', 600_000]
  ] as const)('uses the %s deadline (%i ms)', async (method, duration) => {
    const { client, transports } = fixture({})
    const pending = client.call(method)
    const transport = transports[0]
    transport.ready()
    transport.begin(method)
    await vi.advanceTimersByTimeAsync(duration - 1)
    expect(transport.kills).toBe(0)
    await vi.advanceTimersByTimeAsync(1)
    expect(await pending).toMatchObject(timeoutResult)
    expect(transport.kills).toBe(1)
  })

  it('recovers when a worker never becomes ready, without replaying its waiting request', async () => {
    const { client, transports } = fixture()
    const pending = client.call('getSeid')
    await vi.advanceTimersByTimeAsync(100)
    expect(await pending).toMatchObject(timeoutResult)
    expect(transports[0].kills).toBe(1)
    await vi.advanceTimersByTimeAsync(250)
    expect(transports[1].messages).toEqual([{ type: 'init', ...configuration }])
  })

  it('ignores old replies, exits, trace events and output after replacing the worker', async () => {
    const { client, transports, log } = fixture()
    const first = client.call('getSeid')
    const old = transports[0]
    old.ready()
    const oldId = old.begin('getSeid')
    await vi.advanceTimersByTimeAsync(20)
    await first
    await vi.advanceTimersByTimeAsync(250)
    const current = transports[1]
    current.ready()
    let settled = false
    const retry = client.call('getSeid').then(result => {
      settled = true
      return result
    })
    const id = current.begin('getSeid')
    const logsBeforeLateEvents = log.mock.calls.length
    old.ready()
    old.reply(id)
    old.reply(oldId)
    old.emit('message', { type: 'trace', phase: 'start', id, method: 'cosUpdate' })
    old.emit('exit', 1)
    old.stdout.emit('data', Buffer.from('late native output'))
    expect(log).toHaveBeenCalledTimes(logsBeforeLateEvents)
    await vi.advanceTimersByTimeAsync(19)
    expect(settled).toBe(false)
    expect(current.kills).toBe(0)
    // A stale end event in the current worker cannot cancel another request's timer.
    current.emit('message', { type: 'trace', phase: 'end', id: oldId })
    await vi.advanceTimersByTimeAsync(1)
    expect(await retry).toMatchObject(timeoutResult)
    expect(current.kills).toBe(1)
  })

  it('does not let a cancelled deadline kill the process restarted after an exit', async () => {
    const { client, transports } = fixture()
    const pending = client.call('getSeid')
    const rejected = expect(pending).rejects.toThrow('Device service exited (1)')
    transports[0].ready()
    transports[0].begin('getSeid')
    transports[0].emit('exit', 1)
    await rejected
    await vi.advanceTimersByTimeAsync(250)
    const replacement = transports[1]
    replacement.ready()
    await vi.advanceTimersByTimeAsync(100)
    expect(replacement.kills).toBe(0)
    expect(transports).toHaveLength(2)
  })

  it.each(['false', 'throw'])(
    'isolates a worker whose termination returns %s until its actual exit',
    async termination => {
      const { client, transports } = fixture()
      const pending = client.call('getSeid')
      const old = transports[0]
      const kill = vi.spyOn(old, 'kill').mockImplementation(() => {
        if (termination === 'throw') throw new Error('termination unavailable')
        return false
      })
      old.ready()
      const id = old.begin('getSeid')
      await vi.advanceTimersByTimeAsync(20)
      expect(await pending).toMatchObject(timeoutResult)
      expect(kill).toHaveBeenCalledOnce()
      client.start()
      expect(await client.call('connectDevice')).toMatchObject({
        isSuccess: false,
        result: 'device_recovery_pending',
        code: 'DEVICE_RECOVERY_PENDING'
      })
      old.ready()
      old.reply(id)
      await vi.advanceTimersByTimeAsync(1000)
      expect(transports).toHaveLength(1)
      expect(old.messages.filter(message => message.method === 'connectDevice')).toHaveLength(0)
      old.emit('exit', 1)
      await vi.advanceTimersByTimeAsync(250)
      expect(transports).toHaveLength(2)
      expect(transports[1].messages).toEqual([{ type: 'init', ...configuration }])
      transports[1].ready()
      const retry = client.call('connectDevice')
      transports[1].reply(transports[1].begin('connectDevice'))
      expect((await retry).isSuccess).toBe(true)
    }
  )

  it('handles an exit emitted synchronously by termination without a duplicate restart', async () => {
    const { client, transports } = fixture()
    const pending = client.call('getSeid')
    const old = transports[0]
    vi.spyOn(old, 'kill').mockImplementation(() => {
      old.emit('exit', 0)
      return false
    })
    old.ready()
    old.begin('getSeid')
    await vi.advanceTimersByTimeAsync(20)
    expect(await pending).toMatchObject(timeoutResult)
    await vi.advanceTimersByTimeAsync(250)
    expect(transports).toHaveLength(2)
    transports[1].ready()
  })

  it('uses a known stable timeout identifier for renderer and diagnostics', () => {
    expect(failureCode('device_operation_timeout')).toBe('DEVICE_OPERATION_TIMEOUT')
    expect(failureCode(timeoutResult)).toBe('DEVICE_OPERATION_TIMEOUT')
    expect(failureCode('device_recovery_pending')).toBe('DEVICE_RECOVERY_PENDING')
  })

  it.each([{ isPackaged: true, mockPath: '/test/mock.cjs' }, { isPackaged: false }])(
    'ignores the test deadline without an enabled development mock (%j)',
    async options => {
      vi.useFakeTimers()
      vi.stubEnv('IMKEY_TEST_DEVICE_TIMEOUT_MS', '5')
      const transport = new Transport()
      const client = new ServiceClient(() => transport, { ...configuration, ...options })
      clients.push(client)
      const pending = client.call('getSeid')
      transport.ready()
      const id = transport.begin('getSeid')
      await vi.advanceTimersByTimeAsync(5)
      expect(transport.kills).toBe(0)
      transport.reply(id)
      expect((await pending).isSuccess).toBe(true)
    }
  )

  it('enables the short execution deadline only for an explicit development mock', async () => {
    vi.useFakeTimers()
    vi.stubEnv('IMKEY_TEST_DEVICE_TIMEOUT_MS', '5')
    const transport = new Transport()
    const client = new ServiceClient(() => transport, {
      ...configuration,
      mockPath: '/test/mock.cjs'
    })
    clients.push(client)
    const pending = client.call('getSeid')
    transport.ready()
    transport.begin('getSeid')
    await vi.advanceTimersByTimeAsync(5)
    expect(await pending).toMatchObject(timeoutResult)
    expect(transport.kills).toBe(1)
  })
})

describe('firmware watchdog exclusion', () => {
  it.each([
    ['cosUpdate', undefined],
    ['updateApplet', 'IMK']
  ] as const)(
    'never watches %s, its same-operation followups, or contextless storage queries',
    async (firmwareMethod, params) => {
      const { client, transports } = fixture()
      const context: DeviceCallContext = { operationId: 'firmware-1' }
      const firmware = client.call(firmwareMethod, params, context)
      const transport = transports[0]
      transport.ready()
      const firmwareId = transport.begin(firmwareMethod)
      await vi.advanceTimersByTimeAsync(1000)
      expect(transport.kills).toBe(0)
      transport.reply(firmwareId)
      await firmware
      const stages: [DeviceMethod, DeviceCallContext | undefined][] = [
        ['deviceBindCheck', context],
        ['getSeid', undefined],
        ['deviceBindAcquire', context],
        ['getSeid', undefined],
        ['getInstalledApplets', context],
        ['writeWalletAddress', context]
      ]
      for (const [method, stageContext] of stages) {
        const pending = client.call(method, undefined, stageContext)
        const id = transport.begin(method)
        await vi.advanceTimersByTimeAsync(1000)
        expect(transport.kills, method).toBe(0)
        transport.reply(id)
        expect((await pending).isSuccess).toBe(true)
      }
      const nextOperation = client.call('getSeid', undefined, { operationId: 'read-2' })
      transport.begin('getSeid')
      await vi.advanceTimersByTimeAsync(20)
      expect(await nextOperation).toMatchObject(timeoutResult)
      expect(transport.kills).toBe(1)
    }
  )

  it.each([
    ['cosUpdate', undefined],
    ['updateApplet', 'IMK']
  ] as const)(
    'does not give an unready worker a startup watchdog when %s is waiting',
    async (method, params) => {
      const { client, transports } = fixture()
      const pending = client.call(method, params, { operationId: 'firmware-1' })
      const transport = transports[0]
      await vi.advanceTimersByTimeAsync(1000)
      expect(transport.kills).toBe(0)
      transport.ready()
      transport.reply(transport.begin(method))
      expect((await pending).isSuccess).toBe(true)
    }
  )

  it('retains protection across worker exit until a different user operation starts', async () => {
    const { client, transports } = fixture()
    const context = { operationId: 'firmware-1' }
    const pending = client.call('cosUpdate', undefined, context)
    const rejected = expect(pending).rejects.toThrow('Device service exited (1)')
    transports[0].ready()
    transports[0].begin('cosUpdate')
    transports[0].emit('exit', 1)
    await rejected
    await vi.advanceTimersByTimeAsync(1250)
    expect(transports).toHaveLength(2)
    expect(transports[1].kills).toBe(0)
    const next = client.call('getSeid', undefined, { operationId: 'user-retry-2' })
    await vi.advanceTimersByTimeAsync(100)
    expect(await next).toMatchObject(timeoutResult)
    expect(transports[1].kills).toBe(1)
  })

  it('keeps an unrelated queued operation from timing out active firmware', async () => {
    const { client, transports } = fixture()
    const firmware = client.call('cosUpdate', undefined, { operationId: 'firmware-1' })
    const transport = transports[0]
    transport.ready()
    const firmwareId = transport.begin('cosUpdate')
    const next = client.call('getSeid', undefined, { operationId: 'user-2' })
    await vi.advanceTimersByTimeAsync(1000)
    expect(transport.kills).toBe(0)
    transport.reply(firmwareId)
    await firmware
    transport.begin('getSeid')
    await vi.advanceTimersByTimeAsync(20)
    expect(await next).toMatchObject(timeoutResult)
  })
})
