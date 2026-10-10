import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { DiagnosticLogger } from './diagnostics'
import { app, safeStorage, utilityProcess, type BrowserWindow, type Tray } from 'electron'
import path from 'node:path'
import dotenv from 'dotenv'
import { BindCodeStore } from './BindCodeStore'
import { ServiceClient } from './serviceClient'
import { connectorPath, keyEnvPath } from './paths'
import { showConnectorLoadError } from './connectorError'
import { createMainWindow, installCsp } from './window'
import { createTray } from './tray'
import { registerCrashHandler } from './crash'
import { registerSingleInstance } from './singleInstance'
import { registerAppIpc } from './appIpc'
import { registerUpdater } from './updater'
import { registerDeviceIpc } from './deviceIpc'
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let quitting = false
let service: ServiceClient | null = null
let diagnostics: DiagnosticLogger | undefined
const getWindow = (): BrowserWindow | null => mainWindow
const allowQuit = (): void => {
  quitting = true
}
function createWindow(): void {
  if (mainWindow) return
  mainWindow = createMainWindow(() => quitting)
  installCsp(mainWindow)
  registerCrashHandler(mainWindow, diagnostics?.log)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
if (!app.isPackaged && process.env.IMKEY_CONNECTOR_MOCK && process.env.IMKEY_TEST_USER_DATA) {
  app.setPath('userData', process.env.IMKEY_TEST_USER_DATA)
}
if (process.platform === 'win32') app.setAppUserModelId(app.getName())
if (registerSingleInstance(getWindow)) {
  void app.whenReady().then(() => {
    const projectRoot = app.getAppPath()
    diagnostics = new DiagnosticLogger(path.join(app.getPath('userData'), 'logs'))
    const libraryPath = connectorPath(
      app.isPackaged,
      process.platform,
      process.resourcesPath,
      projectRoot
    )
    diagnostics.log('info', 'application.started', {
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron,
      platform: process.platform,
      arch: process.arch,
      packaged: app.isPackaged,
      libraryPath
    })
    const hash = createHash('sha256')
    const library = createReadStream(libraryPath)
    library.on('data', chunk => hash.update(chunk))
    library.on('end', () =>
      diagnostics?.log('info', 'connector.fingerprint', { librarySha256: hash.digest('hex') })
    )
    library.on('error', () => diagnostics?.log('warn', 'connector.fingerprint-unavailable'))
    dotenv.config({
      path: keyEnvPath(app.isPackaged, process.platform, process.resourcesPath, projectRoot)
    })
    service = new ServiceClient(
      () =>
        utilityProcess.fork(path.join(__dirname, 'service.js'), [], {
          serviceName: 'imKey device service',
          stdio: 'pipe'
        }),
      {
        userDataPath: app.getPath('userData'),
        libraryPath,
        platform: process.platform,
        isPackaged: app.isPackaged,
        mockPath: !app.isPackaged ? process.env.IMKEY_CONNECTOR_MOCK : undefined
      },
      error => {
        void showConnectorLoadError(error)
      },
      diagnostics.log
    )
    const store = new BindCodeStore({
      userData: app.getPath('userData'),
      getSeid: () => service!.call('getSeid'),
      safeStorage,
      encryptionKey: process.env.bindCode_encryptionKey
    })
    registerAppIpc(getWindow)
    registerUpdater(getWindow, allowQuit, diagnostics.log)
    registerDeviceIpc(getWindow, service, store, diagnostics.log)
    createWindow()
    tray = createTray(
      app.isPackaged
        ? path.join(__dirname, '../renderer/static')
        : path.join(projectRoot, 'static'),
      getWindow,
      allowQuit
    )
    service.start()
  })
  app.on('activate', createWindow)
}
app.on('before-quit', () => {
  diagnostics?.log('info', 'application.quitting')
  quitting = true
  service?.stop()
  tray?.destroy()
  tray = null
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
