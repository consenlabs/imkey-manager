import { noDiagnostics, type DiagnosticLog } from './diagnostics'
import { app, BrowserWindow, dialog } from 'electron'
export function registerCrashHandler(
  window: BrowserWindow,
  log: DiagnosticLog = noDiagnostics
): void {
  window.webContents.on('render-process-gone', async (_event, details) => {
    if (details.reason === 'clean-exit') return
    log('error', 'renderer.exited', { reason: details.reason, exitCode: details.exitCode })
    const { response } = await dialog.showMessageBox({
      type: 'error',
      title: '进程崩溃了',
      message: '这个进程已经崩溃.',
      buttons: ['重载', '退出']
    })
    if (response !== 0) {
      app.quit()
      return
    }
    if (window.isDestroyed()) {
      app.relaunch()
      app.exit(0)
      return
    }
    for (const other of BrowserWindow.getAllWindows()) if (other.id !== window.id) other.destroy()
    window.reload()
  })
}
