import { describe, it, expect, vi } from 'vitest'
const electron = vi.hoisted(() => ({
  exposeInMainWorld: vi.fn(),
  invoke: vi.fn().mockResolvedValue(undefined),
  on: vi.fn(),
  removeListener: vi.fn()
}))
vi.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: electron.exposeInMainWorld },
  ipcRenderer: { invoke: electron.invoke, on: electron.on, removeListener: electron.removeListener }
}))
import type { ImkeyApi } from '../../src/preload/index'
import '../../src/preload/index'
const bridgeName = electron.exposeInMainWorld.mock.calls[0][0]
const api = electron.exposeInMainWorld.mock.calls[0][1] as ImkeyApi

describe('isolated preload bridge', () => {
  it('exposes only the prescribed API groups and methods', () => {
    expect(bridgeName).toBe('imkey')
    expect(Object.keys(api)).toEqual(['device', 'app', 'updater'])
    expect(Object.keys(api.device)).toEqual(['call', 'trace'])
    expect(Object.keys(api.app)).toEqual([
      'getVersion',
      'getLocale',
      'openExternal',
      'copyText',
      'isOnline'
    ])
    expect(Object.keys(api.updater)).toEqual([
      'check',
      'download',
      'quitAndInstall',
      'onMessage',
      'onProgress'
    ])
  })
  it('invokes fixed channels for each API operation', async () => {
    await api.device.call('getSeid')
    await api.device.trace({ operationId: 'operation-1', action: 'action', phase: 'enqueued' })
    await api.app.getVersion()
    await api.app.getLocale()
    await api.app.openExternal('https://imkey.im')
    await api.app.copyText('text')
    await api.app.isOnline()
    await api.updater.check()
    await api.updater.download()
    await api.updater.quitAndInstall()
    expect(electron.invoke.mock.calls).toEqual([
      ['device:call', 'getSeid', undefined],
      ['device:trace', { operationId: 'operation-1', action: 'action', phase: 'enqueued' }],
      ['app:version'],
      ['app:locale'],
      ['app:open-external', 'https://imkey.im'],
      ['app:copy-text', 'text'],
      ['app:online'],
      ['updater:check'],
      ['updater:download'],
      ['updater:install']
    ])
  })
  it('passes update payloads and returns a working unsubscribe function', () => {
    const callback = vi.fn()
    const unsubscribe = api.updater.onMessage(callback)
    const [channel, listener] = electron.on.mock.calls.at(-1) as [
      string,
      (event: unknown, value: unknown) => void
    ]
    listener({}, { action: 'checking' })
    expect(callback).toHaveBeenCalledWith({ action: 'checking' })
    unsubscribe()
    expect(electron.removeListener).toHaveBeenCalledWith(channel, listener)
    const unsubscribeProgress = api.updater.onProgress(callback)
    const [progressChannel, progressListener] = electron.on.mock.calls.at(-1) as [
      string,
      (event: unknown, value: unknown) => void
    ]
    expect(progressChannel).toBe('updater:progress')
    unsubscribeProgress()
    expect(electron.removeListener).toHaveBeenCalledWith(progressChannel, progressListener)
  })
})
