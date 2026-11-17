import { app, type BrowserWindow } from 'electron'
export function registerSingleInstance(getWindow: () => BrowserWindow | null): boolean {
  if (!app.requestSingleInstanceLock()) {
    app.quit()
    return false
  }
  app.on('second-instance', () => {
    const window = getWindow()
    if (window && !window.isDestroyed()) {
      if (window.isMinimized()) window.restore()
      window.show()
      window.focus()
    }
  })
  return true
}
