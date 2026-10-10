import { failureCode } from '../../src/shared/deviceErrors'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DiagnosticLogger, nativeOutputMetadata } from '../../src/main/diagnostics'
import { ServiceClient, type ServiceTransport } from '../../src/main/serviceClient'
import { DeviceQueue } from '../../src/service/queue'
import type { DeviceMethod } from '../../src/shared/deviceContract'
import type { Handler } from '../../src/service/handlers'
const directories: string[] = []
afterEach(async () => {
  vi.useRealTimers()
  await Promise.all(
    directories.splice(0).map(directory => rm(directory, { recursive: true, force: true }))
  )
})
async function temporary(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), 'imkey-diagnostics-'))
  directories.push(directory)
  return directory
}
describe('bounded privacy preserving diagnostics', () => {
  it('rotates serial writes and bounds the number of backups', async () => {
    const directory = await temporary()
    const log = new DiagnosticLogger(directory, 180, 2, () => {})
    for (let id = 0; id < 12; id++)
      log.log('info', 'device.call-queued', { requestId: id, method: 'getSeid' })
    await log.flush()
    expect((await readdir(directory)).sort()).toEqual([
      'manager.jsonl',
      'manager.jsonl.1',
      'manager.jsonl.2'
    ])
    const latest = JSON.parse(await readFile(path.join(directory, 'manager.jsonl'), 'utf8'))
    expect(latest.requestId).toBe(11)
  })
  it('discards unknown fields, unsafe codes and arbitrary native output', async () => {
    const directory = await temporary()
    const terminal: string[] = []
    const log = new DiagnosticLogger(directory, 10000, 2, line => terminal.push(line))
    log.log('warn', 'device.failed', {
      code: 'secret binding code',
      method: 'getSeid',
      ...({ params: 'A2345678', result: 'wallet-address', error: 'private-data' } as object)
    })
    log.log(
      'warn',
      'service.native-output',
      nativeOutputMetadata(
        "thread '<unnamed>' panicked at 'A2345678 wallet-address', api/src/device_manager.rs:186:49"
      )
    )
    await log.flush()
    const output = await readFile(path.join(directory, 'manager.jsonl'), 'utf8')
    expect(output).not.toMatch(/A2345678|wallet-address|private-data|secret binding code/)
    expect(terminal.join('')).toContain('native-panic')
    expect(output).toContain('device_manager.rs')
  })
  it('survives disk and terminal failures without rejecting device work', async () => {
    const directory = await temporary()
    const notDirectory = path.join(directory, 'file')
    await writeFile(notDirectory, 'existing')
    const log = new DiagnosticLogger(notDirectory, 100, 1, () => {
      throw new Error('terminal closed')
    })
    expect(() => log.log('info', 'device.call-queued')).not.toThrow()
    await expect(log.flush()).resolves.toBeUndefined()
    log.log('info', 'device.call-finished')
    await expect(log.flush()).resolves.toBeUndefined()
  })
})
class Transport implements ServiceTransport {
  message?: (message: unknown) => void
  exit?: (code: number) => void
  posted: unknown[] = []
  stderr = {
    on: (_event: 'data', listener: (chunk: Buffer) => void) => {
      this.native = listener
    }
  }
  native?: (chunk: Buffer) => void
  on(
    event: 'message' | 'exit',
    listener: ((value: unknown) => void) | ((value: number) => void)
  ): void {
    if (event === 'message') this.message = listener as (message: unknown) => void
    else this.exit = listener as (code: number) => void
  }
  postMessage(message: unknown): void {
    this.posted.push(message)
  }
  kill(): boolean {
    return true
  }
}
it('correlates queue, execution, native classification and result without logging payloads', async () => {
  const transport = new Transport()
  const events: unknown[] = []
  const client = new ServiceClient(
    () => transport,
    { userDataPath: '/user', libraryPath: '/lib', platform: 'darwin', isPackaged: false },
    () => {},
    (level, event, fields) => events.push({ level, event, ...fields })
  )
  const result = client.call('deviceBindAcquire', 'A2345678', {
    operationId: 'binding-1',
    stage: 'deviceBindAcquire'
  })
  transport.message?.({ type: 'ready' })
  transport.message?.({ type: 'trace', phase: 'start', id: 1, method: 'deviceBindAcquire' })
  transport.native?.(Buffer.from('PANIC secret A2345678'))
  transport.message?.({
    type: 'trace',
    phase: 'end',
    id: 1,
    method: 'deviceBindAcquire',
    durationMs: 42
  })
  transport.message?.({
    id: 1,
    result: { isSuccess: false, result: 'sensitive address', code: 'DEVICE_ERROR' }
  })
  expect(await result).toEqual({
    isSuccess: false,
    result: 'sensitive address',
    code: 'DEVICE_ERROR',
    requestId: 1,
    method: 'deviceBindAcquire',
    stage: 'deviceBindAcquire',
    operationId: 'binding-1'
  })
  expect(events).toContainEqual(
    expect.objectContaining({
      event: 'service.native-output',
      requestId: 1,
      method: 'deviceBindAcquire',
      reason: 'native-output-redacted'
    })
  )
  expect(events).toContainEqual(
    expect.objectContaining({
      event: 'device.call-finished',
      operationId: 'binding-1',
      stage: 'deviceBindAcquire',
      requestId: 1,
      success: false,
      code: 'DEVICE_ERROR'
    })
  )
  expect(JSON.stringify(events)).not.toMatch(/A2345678|sensitive address/)
  client.stop()
})
it('backs off repeated service crashes without limiting device call duration', async () => {
  vi.useFakeTimers()
  const children: Transport[] = []
  const fork = vi.fn(() => {
    const child = new Transport()
    children.push(child)
    return child
  })
  const client = new ServiceClient(fork, {
    userDataPath: '/user',
    libraryPath: '/lib',
    platform: 'darwin',
    isPackaged: false
  })
  client.start()
  children[0].exit?.(1)
  await vi.advanceTimersByTimeAsync(250)
  expect(fork).toHaveBeenCalledTimes(2)
  children[1].exit?.(1)
  await vi.advanceTimersByTimeAsync(499)
  expect(fork).toHaveBeenCalledTimes(2)
  await vi.advanceTimersByTimeAsync(1)
  expect(fork).toHaveBeenCalledTimes(3)
  const pending = client.call('cosUpdate')
  children[2].message?.({ type: 'ready' })
  await vi.advanceTimersByTimeAsync(3600000)
  children[2].message?.({ id: 1, result: { isSuccess: true, result: '' } })
  await expect(pending).resolves.toEqual({ isSuccess: true, result: '' })
  client.stop()
})
it('trace failures never change FIFO results or prevent subsequent requests', async () => {
  const handlers = { getSeid: () => ({ isSuccess: true, result: 'seid' }) } as Record<
    DeviceMethod,
    Handler
  >
  const queue = new DeviceQueue(handlers, undefined, () => {
    throw new Error('logger unavailable')
  })
  await expect(queue.dispatch({ id: 1, method: 'getSeid' })).resolves.toEqual({
    id: 1,
    result: { isSuccess: true, result: 'seid' }
  })
  await expect(queue.dispatch({ id: 2, method: 'getSeid' })).resolves.toEqual({
    id: 2,
    result: { isSuccess: true, result: 'seid' }
  })
})

it('maps exact native error identifiers and rejects secret-shaped diagnostic codes', () => {
  expect(failureCode({ result: 'get_seid_error' })).toBe('GET_SEID_ERROR')
  expect(failureCode({ result: 'device_not_connected' })).toBe('DEVICE_NOT_CONNECTED')
  expect(failureCode({ code: 'A2345678', result: 'private_address' })).toBe(
    'DEVICE_OPERATION_FAILED'
  )
  expect(failureCode({ result: 'get_seid_error secret' })).toBe('DEVICE_OPERATION_FAILED')
  expect(failureCode({ result: 'constructor' })).toBe('DEVICE_OPERATION_FAILED')
})
