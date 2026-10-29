import { contextBridge, ipcRenderer } from 'electron'
import type {
  DeviceMethod,
  DeviceParams,
  DeviceResult,
  DeviceCallContext,
  DeviceOperationTrace
} from '../shared/deviceContract'
function subscribe(
  channel: 'updater:message' | 'updater:progress',
  callback: (value: unknown) => void
): () => void {
  const listener = (_event: Electron.IpcRendererEvent, value: unknown): void => callback(value)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}
export interface ImkeyApi {
  device: {
    trace(event: DeviceOperationTrace): Promise<void>
    call<M extends DeviceMethod>(
      method: M,
      params?: DeviceParams[M],
      context?: DeviceCallContext
    ): Promise<DeviceResult>
  }
  app: {
    getVersion(): Promise<string>
    getLocale(): Promise<string>
    openExternal(url: string): Promise<void>
    copyText(text: string): Promise<void>
    isOnline(): Promise<boolean>
  }
  updater: {
    check(): Promise<unknown>
    download(): Promise<unknown>
    quitAndInstall(): Promise<void>
    onMessage(cb: (value: unknown) => void): () => void
    onProgress(cb: (value: unknown) => void): () => void
  }
}
const api: ImkeyApi = {
  device: {
    call: (method, params, context) =>
      context
        ? ipcRenderer.invoke('device:call', method, params, context)
        : ipcRenderer.invoke('device:call', method, params),
    trace: event => ipcRenderer.invoke('device:trace', event)
  },
  app: {
    getVersion: () => ipcRenderer.invoke('app:version'),
    getLocale: () => ipcRenderer.invoke('app:locale'),
    openExternal: url => ipcRenderer.invoke('app:open-external', url),
    copyText: text => ipcRenderer.invoke('app:copy-text', text),
    isOnline: () => ipcRenderer.invoke('app:online')
  },
  updater: {
    check: () => ipcRenderer.invoke('updater:check'),
    download: () => ipcRenderer.invoke('updater:download'),
    quitAndInstall: () => ipcRenderer.invoke('updater:install'),
    onMessage: cb => subscribe('updater:message', cb),
    onProgress: cb => subscribe('updater:progress', cb)
  }
}
contextBridge.exposeInMainWorld('imkey', api)
declare global {
  interface Window {
    imkey: ImkeyApi
  }
}
