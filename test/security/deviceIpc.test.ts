import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BrowserWindow, IpcMainInvokeEvent } from 'electron'
import type { ServiceClient } from '../../src/main/serviceClient'
import type { BindCodeStore } from '../../src/main/BindCodeStore'
import type { FirmwareRecoveryStore } from '../../src/main/FirmwareRecoveryStore'
import { createDeviceHandlers } from '../../src/service/handlers'
const handlers = vi.hoisted(() => new Map<string, (...args: unknown[]) => Promise<unknown>>())
vi.mock('electron', () => ({
  ipcMain: {
    handle: (channel: string, handler: (...args: unknown[]) => Promise<unknown>) =>
      handlers.set(channel, handler)
  }
}))
import { registerDeviceIpc } from '../../src/main/deviceIpc'
// Names emitted by connector common/src/applet.rs at commit 80ddae2.
const connectorAppletNames = [
  'Bitcoin',
  'Ethereum',
  'EOS',
  'Cosmos',
  'Filecoin',
  'Kusama',
  'Polkadot',
  'TRON',
  'Bitcoin Cash',
  'Litecoin',
  'IMK',
  'Nervos',
  'Tezos'
]
const webContents = {}
const window = { isDestroyed: () => false, webContents } as unknown as BrowserWindow
const event = { sender: webContents } as unknown as IpcMainInvokeEvent
const call = vi.fn()
const importBindCode = vi.fn()
const exportBindCode = vi.fn()
const isExistBindCodeFile = vi.fn()
let invoke: (...args: unknown[]) => Promise<unknown>
beforeEach(() => {
  call.mockReset().mockResolvedValue({ isSuccess: true, result: 'seid' })
  importBindCode.mockReset().mockResolvedValue({ isSuccess: true, result: undefined })
  exportBindCode.mockReset().mockResolvedValue({ isSuccess: true, result: 'BINDCODE' })
  isExistBindCodeFile.mockReset().mockResolvedValue({ isSuccess: true, result: true })
  registerDeviceIpc(
    () => window,
    { call } as unknown as ServiceClient,
    { importBindCode, exportBindCode, isExistBindCodeFile } as unknown as BindCodeStore
  )
  invoke = handlers.get('device:call')!
})
describe('registered device IPC handler', () => {
  it('rejects another window and never forwards its request', async () => {
    await expect(invoke({ sender: {} }, 'getSeid')).rejects.toThrow('Untrusted IPC sender')
    expect(call).not.toHaveBeenCalled()
  })
  it('rejects unknown methods and malformed parameters without forwarding', async () => {
    await expect(invoke(event, 'signTransaction')).rejects.toThrow('Unknown device method')
    await expect(
      invoke(event, 'writeWalletAddress', { filePath: '/user', name: ['invalid-chain'] })
    ).rejects.toThrow('Invalid device parameters')
    await expect(invoke(event, 'getSeid', { unexpected: true })).rejects.toThrow(
      'Invalid device parameters'
    )
    expect(call).not.toHaveBeenCalled()
    expect(importBindCode).not.toHaveBeenCalled()
  })
  it('forwards a valid request and returns its associated result', async () => {
    await expect(invoke(event, 'downloadApplet', 'Ethereum')).resolves.toEqual({
      isSuccess: true,
      result: 'seid'
    })
    expect(call).toHaveBeenCalledWith('downloadApplet', 'Ethereum')
  })
  it.each(connectorAppletNames)('accepts connector registration name %s unchanged', async name => {
    const params = { filePath: '/user', name: [name] }
    await expect(invoke(event, 'writeWalletAddress', params)).resolves.toEqual({
      isSuccess: true,
      result: 'seid'
    })
    expect(call).toHaveBeenCalledExactlyOnceWith('writeWalletAddress', params)
  })
  it('accepts a mixed connector registration list unchanged', async () => {
    const params = { filePath: '/user', name: connectorAppletNames }
    await invoke(event, 'writeWalletAddress', params)
    expect(call).toHaveBeenCalledExactlyOnceWith('writeWalletAddress', params)
  })
  it.each([
    { filePath: '/user', name: ['Ethereum', 'invalid-chain'] },
    { filePath: '/user', name: ['NERVOS'] },
    { filePath: '/user', name: ['TEZOS'] },
    { filePath: '/user', name: ['Bitcion Cash'] },
    { filePath: '/user', name: [null] },
    { filePath: '/user', name: 'Nervos' },
    { filePath: 1, name: ['Nervos'] },
    { filePath: '/user', name: ['Nervos'], unexpected: true }
  ])('rejects malformed registration parameters %j before forwarding', async params => {
    await expect(invoke(event, 'writeWalletAddress', params)).rejects.toThrow(
      'Invalid device parameters'
    )
    expect(call).not.toHaveBeenCalled()
  })
  it('routes binding storage methods to main-process storage', async () => {
    await expect(invoke(event, 'importBindCode', 'BINDCODE')).resolves.toEqual({
      isSuccess: true,
      result: undefined
    })
    await expect(invoke(event, 'exportBindCode')).resolves.toEqual({
      isSuccess: true,
      result: 'BINDCODE'
    })
    await expect(invoke(event, 'isExistBindCodeFile')).resolves.toEqual({
      isSuccess: true,
      result: true
    })
    expect(importBindCode).toHaveBeenCalledWith('BINDCODE')
    expect(exportBindCode).toHaveBeenCalledOnce()
    expect(isExistBindCodeFile).toHaveBeenCalledOnce()
    expect(call).not.toHaveBeenCalled()
  })
  it('returns a structured failure when the service exits', async () => {
    call.mockRejectedValueOnce(new Error('Device service exited (1)'))
    await expect(invoke(event, 'cosUpdate')).resolves.toEqual({
      isSuccess: false,
      result: 'Device service exited (1)'
    })
  })
})

it('validates optional operation context and rejects extra fields before forwarding', async () => {
  for (const context of [
    null,
    [],
    { operationId: 'A2345678' },
    { operationId: 'connection-1', params: 'binding-code' },
    { operationId: 'connection-1', stage: 'private-address' }
  ]) {
    await expect(invoke(event, 'getSeid', undefined, context)).rejects.toThrow(
      'Invalid device context'
    )
  }
  expect(call).not.toHaveBeenCalled()
  const context = { operationId: 'connection-1', stage: 'getSeid' }
  await expect(invoke(event, 'getSeid', undefined, context)).resolves.toEqual({
    isSuccess: true,
    result: 'seid'
  })
  expect(call).toHaveBeenCalledWith('getSeid', undefined, context)
})

it('correlates binding storage with its nested identity check', async () => {
  const context = { operationId: 'binding-1', stage: 'exportBindCode' }
  await invoke(event, 'exportBindCode', undefined, context)
  expect(exportBindCode).toHaveBeenCalledWith(context)
  await invoke(event, 'importBindCode', 'BINDCODE', context)
  expect(importBindCode).toHaveBeenCalledWith('BINDCODE', context)
  await invoke(event, 'isExistBindCodeFile', undefined, context)
  expect(isExistBindCodeFile).toHaveBeenCalledWith(context)
})

describe('firmware recovery IPC', () => {
  const checkpoint = {
    version: 1,
    seid: 'device-1234',
    phase: 'update',
    needsBinding: true,
    expectedCos: '',
    expectedBle: ''
  }
  it('intercepts all recovery calls in main and logs no checkpoint payload', async () => {
    const getFirmwareRecovery = vi.fn().mockResolvedValue({ isSuccess: true, result: checkpoint })
    const saveFirmwareRecovery = vi.fn().mockResolvedValue({ isSuccess: true, result: undefined })
    const clearFirmwareRecovery = vi.fn().mockResolvedValue({ isSuccess: true, result: undefined })
    const log = vi.fn()
    registerDeviceIpc(
      () => window,
      { call } as unknown as ServiceClient,
      {} as BindCodeStore,
      log,
      {
        getFirmwareRecovery,
        saveFirmwareRecovery,
        clearFirmwareRecovery
      } as unknown as FirmwareRecoveryStore
    )
    const invoke = handlers.get('device:call')!
    const context = { operationId: 'firmware-1', stage: 'saveFirmwareRecovery' }
    await expect(invoke(event, 'getFirmwareRecovery', undefined, context)).resolves.toEqual({
      isSuccess: true,
      result: checkpoint
    })
    await invoke(event, 'saveFirmwareRecovery', checkpoint, context)
    await invoke(event, 'clearFirmwareRecovery', { seid: checkpoint.seid }, context)
    expect(getFirmwareRecovery).toHaveBeenCalledExactlyOnceWith(context)
    expect(saveFirmwareRecovery).toHaveBeenCalledExactlyOnceWith(checkpoint, context)
    expect(clearFirmwareRecovery).toHaveBeenCalledExactlyOnceWith(
      { seid: checkpoint.seid },
      context
    )
    expect(call).not.toHaveBeenCalled()
    expect(JSON.stringify(log.mock.calls)).not.toContain(checkpoint.seid)
    expect(JSON.stringify(log.mock.calls)).not.toContain('needsBinding')
  })

  it('rejects private fields and path parameters before main storage or native access', async () => {
    for (const [method, params] of [
      ['getFirmwareRecovery', { seid: checkpoint.seid }],
      ['saveFirmwareRecovery', { ...checkpoint, bindCode: 'SECRET12' }],
      ['saveFirmwareRecovery', { ...checkpoint, filePath: '/tmp/elsewhere' }],
      ['saveFirmwareRecovery', { ...checkpoint, pendingAddresses: ['unknown'] }],
      ['clearFirmwareRecovery', { seid: '../escape' }],
      ['clearFirmwareRecovery', { seid: checkpoint.seid, bindCode: 'SECRET12' }]
    ])
      await expect(invoke(event, method, params)).rejects.toThrow('Invalid device parameters')
    expect(call).not.toHaveBeenCalled()
  })

  it('fails closed if recovery storage is not configured', async () => {
    expect(await invoke(event, 'getFirmwareRecovery')).toMatchObject({
      isSuccess: false,
      code: 'FIRMWARE_RECOVERY_UNAVAILABLE'
    })
    expect(call).not.toHaveBeenCalled()
  })

  it('never dispatches recovery storage methods to the native connector', async () => {
    const callImKeyApi = vi.fn()
    const nativeHandlers = createDeviceHandlers(
      { callImKeyApi, getLastErrorMessage: () => '' },
      '/tmp/user-data'
    )
    for (const method of [
      'getFirmwareRecovery',
      'saveFirmwareRecovery',
      'clearFirmwareRecovery'
    ] as const) {
      expect(await nativeHandlers[method]()).toEqual({
        isSuccess: false,
        result: 'Firmware recovery storage belongs to main process'
      })
    }
    expect(callImKeyApi).not.toHaveBeenCalled()
  })
})

it('accepts only trusted, bounded operation telemetry without device payloads', async () => {
  const log = vi.fn()
  registerDeviceIpc(() => window, { call } as unknown as ServiceClient, {} as BindCodeStore, log)
  const trace = handlers.get('device:trace')!
  const value = {
    operationId: 'operation-1',
    action: 'firmware-upgrade',
    phase: 'started',
    queueMs: 120
  }
  await expect(trace({ sender: {} }, value)).rejects.toThrow('Untrusted IPC sender')
  for (const invalid of [
    null,
    [],
    { ...value, bindCode: 'A2345678' },
    { ...value, result: 'private-device-data' },
    { ...value, action: 'A2345678' },
    { ...value, phase: 'arbitrary-text' },
    { ...value, operationId: 'private device data' },
    { ...value, queueMs: -1 },
    { ...value, queueMs: Infinity },
    { ...value, durationMs: 0.5 }
  ])
    await expect(trace(event, invalid)).rejects.toThrow('Invalid device trace')
  expect(log).not.toHaveBeenCalled()
  await expect(trace(event, value)).resolves.toBeUndefined()
  expect(log).toHaveBeenCalledExactlyOnceWith('info', 'device.operation', value)
  expect(call).not.toHaveBeenCalled()
  log.mockImplementation(() => {
    throw new Error('diagnostics unavailable')
  })
  await expect(trace(event, value)).resolves.toBeUndefined()
})

it('routes only exact allowlisted business failures to warning diagnostics', async () => {
  const log = vi.fn()
  registerDeviceIpc(() => window, { call } as unknown as ServiceClient, {} as BindCodeStore, log)
  const trace = handlers.get('device:trace')!
  const value = {
    operationId: 'operation-1',
    action: 'firmware-upgrade',
    phase: 'failed',
    stage: 'capture-versions',
    code: 'FIRMWARE_RECOVERY_VERSION_MISMATCH'
  }
  await expect(trace({ sender: {} }, value)).rejects.toThrow('Untrusted IPC sender')
  for (const invalid of [
    { ...value, stage: undefined },
    { ...value, code: undefined },
    { ...value, stage: 'A2345678' },
    { ...value, stage: 'getFirmwareVersion' },
    { ...value, stage: 'capture-versions private-device-data' },
    { ...value, code: 'FIRMWARE_RECOVERY_PRIVATE_SECRET' },
    { ...value, code: 'firmware_recovery_version_mismatch' },
    { ...value, code: { value: 'DEVICE_OPERATION_FAILED' } },
    { ...value, result: 'A2345678' },
    { ...value, error: 'private-device-data' },
    { ...value, seid: 'PRIVATE' },
    { ...value, bindCode: 'A2345678' },
    { ...value, version: '1.9.11' },
    { ...value, wallet: 'xpub-private' },
    { ...value, queueMs: 0 },
    { ...value, durationMs: 0 },
    { ...value, action: 'private-device-data' },
    { ...value, operationId: 'A2345678' },
    { ...value, phase: 'finished' }
  ])
    await expect(trace(event, invalid)).rejects.toThrow('Invalid device trace')
  expect(log).not.toHaveBeenCalled()
  await expect(trace(event, value)).resolves.toBeUndefined()
  expect(log).toHaveBeenCalledExactlyOnceWith('warn', 'device.operation-failed', value)
  expect(call).not.toHaveBeenCalled()
  log.mockImplementation(() => {
    throw new Error('private diagnostics failure')
  })
  await expect(trace(event, value)).resolves.toBeUndefined()
})
