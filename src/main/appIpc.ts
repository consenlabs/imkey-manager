import { app, clipboard, ipcMain, net, shell, type BrowserWindow } from 'electron'
import { assertTrustedSender, isHttpsUrl } from './ipcPolicy'
export function registerAppIpc(getWindow: () => BrowserWindow | null): void {
  const register = (channel: string, handler: (...args: unknown[]) => unknown): void => {
    ipcMain.handle(channel, (event, ...args: unknown[]) => {
      assertTrustedSender(event, getWindow())
      return handler(...args)
    })
  }
  register('app:version', () => app.getVersion())
  register('app:locale', () => app.getLocale())
  register('app:online', () => net.isOnline())
  register('app:open-external', url => {
    if (!isHttpsUrl(url)) throw new Error('Only HTTPS URLs are allowed')
    return shell.openExternal(url)
  })
  register('app:copy-text', text => {
    if (typeof text !== 'string') throw new Error('Invalid clipboard text')
    clipboard.writeText(text)
  })
}
