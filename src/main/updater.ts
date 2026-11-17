import { noDiagnostics, type DiagnosticLog } from './diagnostics'
import { ipcMain, type BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import { assertTrustedSender } from './ipcPolicy'
export function registerUpdater(
  getWindow: () => BrowserWindow | null,
  beforeInstall: () => void,
  log: DiagnosticLog = noDiagnostics
): void {
  const send = (channel: string, data: unknown): void => {
    const window = getWindow()
    if (window && !window.isDestroyed()) window.webContents.send(channel, data)
  }
  autoUpdater.autoDownload = false
  autoUpdater.on('error', (error: Error) => {
    log('error', 'updater.error', { code: 'UPDATE_FAILED' })
    send('updater:message', { action: 'error', errorInfo: { message: error.message } })
  })
  autoUpdater.on('checking-for-update', () => send('updater:message', { action: 'checking' }))
  autoUpdater.on('update-available', info =>
    send('updater:message', { action: 'updateAva', updateInfo: info })
  )
  autoUpdater.on('update-not-available', info =>
    send('updater:message', { action: 'updateNotAva', updateInfo: info })
  )
  autoUpdater.on('download-progress', progress => send('updater:progress', progress))
  let downloaded = false
  autoUpdater.on('update-downloaded', () => {
    downloaded = true
    send('updater:progress', { percent: 100 })
  })
  ipcMain.handle('updater:check', async event => {
    assertTrustedSender(event, getWindow())
    log('info', 'updater.check')
    try {
      await autoUpdater.checkForUpdates()
    } catch (error) {
      log('error', 'updater.check-failed', { code: 'UPDATE_FAILED' })
      throw error
    }
  })
  ipcMain.handle('updater:download', async event => {
    assertTrustedSender(event, getWindow())
    log('info', 'updater.download')
    try {
      await autoUpdater.downloadUpdate()
    } catch (error) {
      log('error', 'updater.download-failed', { code: 'UPDATE_FAILED' })
      throw error
    }
  })
  ipcMain.handle('updater:install', event => {
    assertTrustedSender(event, getWindow())
    if (!downloaded) throw new Error('Update is not downloaded')
    log('info', 'updater.install')
    beforeInstall()
    autoUpdater.quitAndInstall()
  })
}
