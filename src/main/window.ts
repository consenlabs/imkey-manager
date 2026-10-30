import { app, BrowserWindow, Menu } from 'electron'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
export function createMainWindow(allowQuit: () => boolean): BrowserWindow {
  const url =
    process.env.ELECTRON_RENDERER_URL ||
    pathToFileURL(path.join(__dirname, '../renderer/index.html')).toString()
  const window = new BrowserWindow({
    show: false,
    height: 820,
    width: 1500,
    minWidth: 900,
    minHeight: 600,
    useContentSize: true,
    frame: true,
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate([]))
  const appUrl = new URL(url)
  window.webContents.on('will-navigate', (event, targetUrl) => {
    try {
      const target = new URL(targetUrl)
      if (target.origin === appUrl.origin && target.pathname === appUrl.pathname) return
    } catch {
      /* Invalid URLs are blocked. */
    }
    event.preventDefault()
  })
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  window.webContents.on('will-attach-webview', event => event.preventDefault())
  if (process.platform === 'darwin')
    window.webContents.on('before-input-event', (event, input) => {
      if (!input.meta || input.control || input.alt || input.shift || input.type !== 'keyDown')
        return
      const actions: Record<string, () => void> = {
        a: () => window.webContents.selectAll(),
        c: () => window.webContents.copy(),
        v: () => window.webContents.paste()
      }
      const action = actions[input.key.toLowerCase()]
      if (action) {
        event.preventDefault()
        action()
      }
    })
  window.once('ready-to-show', () => window.show())
  window.on('close', event => {
    if (process.platform === 'win32' && !allowQuit()) {
      window.hide()
      event.preventDefault()
    } else if (!allowQuit()) app.quit()
  })
  void window.loadURL(url)
  return window
}
export function installCsp(window: BrowserWindow): void {
  const development = !app.isPackaged
  const policy = development
    ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:"
    : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-src 'none'"
  window.webContents.session.webRequest.onHeadersReceived((details, callback) =>
    callback({
      responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': [policy] }
    })
  )
}
