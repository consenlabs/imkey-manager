import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BrowserWindow, IpcMainInvokeEvent } from 'electron'
import type { ServiceClient } from '../../src/main/serviceClient'
import type { BindCodeStore } from '../../src/main/BindCodeStore'
const handlers = vi.hoisted(() => new Map<string, (...args: unknown[]) => Promise<unknown>>())
vi.mock('electron', () => ({
  ipcMain: {
    handle: (channel: string, handler: (...args: unknown[]) => Promise<unknown>) =>
      handlers.set(channel, handler)
  }
}))
import { registerDeviceIpc } from '../../src/main/deviceIpc'
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
