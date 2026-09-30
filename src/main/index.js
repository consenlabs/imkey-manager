import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  shell,
  Tray,
  dialog
} from 'electron'
// 自动更新相关
import { autoUpdater } from 'electron-updater'
import pkg from '../../package.json'
const path = require('path')
const { pathToFileURL } = require('url')
const { isTrustedSender, isAllowedDeviceMessage } = require('./ipcPolicy')
let envPath
if (process.platform === 'win32') {
  if (process.env.NODE_ENV === 'production') {
    envPath = require('path')
      .resolve(__dirname, 'key.env')
      .replace('\\resources\\app.asar\\dist\\electron', '')
  } else {
    envPath = require('path').resolve('key.env')
  }
} else if (process.platform === 'darwin') {
  if (process.env.NODE_ENV === 'production') {
    envPath = require('path')
      .resolve(__dirname, 'key.env')
      .replace('/app.asar/dist/electron', '')
  } else {
    envPath = require('path').resolve('key.env')
  }
} else {
  console.log('none')
}
require('dotenv').config({ path: envPath })
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow, workerWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:9080'
    : pathToFileURL(path.join(__dirname, 'index.html')).toString()
const workerURL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:9080/worker.html'
    : pathToFileURL(path.join(__dirname, 'worker.html')).toString()
const ApplicationName = pkg.name
// 托盘对象
let appTray = null
// 是否可以退出
let trayClose = false
// 系统托盘右键菜单
let trayMenuTemplate
// 系统托盘图标
let iconPath
// 图标的上上下文
let contextMenu
// 图标闪烁定时器
let flashTrayTimer
// 单一实例
const gotTheLock = app.requestSingleInstanceLock()

if (process.platform === 'win32') {
  app.setAppUserModelId(ApplicationName)
}
// 创建WorkerWindow
function createWorkerWindow () {
  workerWindow = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true, enableRemoteModule: true }
  })
  workerWindow.on('closed', () => {
    console.log('background window closed')
    // sa.track(distinctId, 'im_app$end', { name: 'appEnd' })
  })
  workerWindow.loadURL(workerURL)
}
/**
 * 创建主窗口
 */
function createMainWindow () {
  if (mainWindow) {
    return
  }

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: false,
    height: 820,
    width: 1500,
    minWidth: 900,
    minHeight: 600,
    useContentSize: true,
    frame: true, // 无边框
    transparent: false, // 透明
    // fullscreen: true, // 全屏
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate([]))
  const appURL = new URL(winURL)
  mainWindow.webContents.on('will-navigate', (event, targetURL) => {
    try {
      const target = new URL(targetURL)
      if (target.origin === appURL.origin && target.pathname === appURL.pathname) return
    } catch (error) {
      // Reject invalid navigation targets.
    }
    event.preventDefault()
  })
  mainWindow.webContents.on('new-window', event => event.preventDefault())
  mainWindow.loadURL(winURL)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (process.platform === 'darwin') {
      const contents = mainWindow.webContents
      const localShortcut = require('electron-localshortcut')
      localShortcut.register(mainWindow, 'CommandOrControl+A', () => {
        contents.selectAll()
      })
      localShortcut.register(mainWindow, 'CommandOrControl+C', () => {
        contents.copy()
      })
      localShortcut.register(mainWindow, 'CommandOrControl+V', () => {
        contents.paste()
      })
    }
    app.locale = app.getLocale()
  })

  /**
   * 监听
   */
  mainWindow.on('close', (event) => {
    if (process.platform === 'win32') {
      if (!trayClose) {
        // 最小化
        mainWindow.hide()
        event.preventDefault()
      }
    } else {
      app.quit()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('maximize', () => {})
}

/**
 * 设置系统托盘
 */
function createTray () {
  // 是否可以退出
  trayClose = false

  // 系统托盘图标
  iconPath = `${__static}/icon_16x16@2x.png`
  // let iconMessagePath = `${__static}/iconMessageNotWin.png`
  // let iconTransparentPath = `${__static}/iconTransparentNotWin.png`
  // // 通知图标
  // const iconNoticePath = `${__static}/logo.png`

  if (process.platform === 'win32') {
    iconPath = `${__static}\\logo.ico`
    // iconMessagePath = `${__static}\\iconMessage.ico`
    // iconTransparentPath = `${__static}\\iconTransparent.ico`
  }
  const locale = app.getLocale()
  let help = ''
  let about = ''
  let quit = ''
  if (locale !== 'zh-CN') {
    help = 'Help'
    about = 'About imKey'
    quit = 'Quit'
  } else {
    help = '帮助'
    about = '关于imKey'
    quit = '退出'
  }
  // 系统托盘右键菜单
  trayMenuTemplate = [
    {
      label: help,
      click: function () {
        shell.openExternal('https://support.imkey.im')
      }
    },
    {
      label: about,
      click: function () {
        shell.openExternal('https://imkey.im')
      }
    },
    {
      label: quit,
      click: function () {
        trayClose = true
        setTimeout(() => {
          app.quit()
        }, 3000)
        // sa.track(distinctId, 'im_app$end', { name: 'appEnd' })
      }
    }
  ]

  appTray = new Tray(iconPath)
  // 图标的上上下文
  contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  // 设置此托盘图标的悬停提示内容
  appTray.setToolTip(ApplicationName)
  // 设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu)
  // 主窗口显示隐藏切换
  appTray.on('click', () => {
    // 清楚图标闪烁定时器
    clearInterval(flashTrayTimer)
    flashTrayTimer = null
    // 还原图标
    appTray.setImage(iconPath)
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
}

/**
 * 自动更新
 */
function autoUpdate () {
  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage (obj) {
    mainWindow.webContents.send('updateMessage', obj)
  }

  // 监测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
  // const message = {
  //   error: '检查更新出错',
  //   checking: '正在检查更新......',
  //   updateAva: '监测到新版本，正在下载......',
  //   updateNotAva: '现在使用的就是最新版本，不用下载'
  // }

  // 当更新出现错误时触发
  autoUpdater.on('error', (err) => {
    // sendUpdateMessage('error')
    sendUpdateMessage({ action: 'error', errorInfo: err })
  })

  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', () => {
    // sendUpdateMessage('checking')
    sendUpdateMessage({ action: 'checking' })
  })

  // 当发现一个可用更新的时候触发，更新下载包会自动开始
  autoUpdater.autoDownload = false
  autoUpdater.on('update-available', (info) => {
    // sendUpdateMessage('updateAva')
    sendUpdateMessage({ action: 'updateAva', updateInfo: info })
  })

  // 当没有可用更新的时候触发
  autoUpdater.on('update-not-available', (info) => {
    // sendUpdateMessage('updateNotAva')
    sendUpdateMessage({ action: 'updateNotAva', updateInfo: info })
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })

  /**
   * event Event
   * releaseNotes String - 新版本更新公告
   * releaseName String - 新的版本号
   * releaseDate Date - 新版本发布的日期
   * updateUrl String - 更新地址
   */
  autoUpdater.on('update-downloaded', (info) => {
    // 下载太快可能无法触发downloadProgress事件，所以手动通知一下
    mainWindow.webContents.send('downloadProgress', { percent: 100 })
    // 可以手动选择是否立即退出并更新
    ipcMain.on('isUpdateNow', (e, arg) => {
      if (!isTrustedSender(e, mainWindow)) return
      // some code here to handle event
      autoUpdater.quitAndInstall()
    })
  })

  ipcMain.on('checkForUpdate', (event) => {
    if (!isTrustedSender(event, mainWindow)) return
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })

  ipcMain.on('downloadUpdate', (event) => {
    if (!isTrustedSender(event, mainWindow)) return
    // 下载
    autoUpdater.downloadUpdate()
  })
}

/**
 * 崩溃报告
 */
function crashReport () {
  // 渲染进程崩溃事件
  mainWindow.webContents.on('crashed', () => {
    const options = {
      type: 'error',
      title: '进程崩溃了',
      message: '这个进程已经崩溃.',
      buttons: ['重载', '退出']
    }
    recordCrash()
      .then(() => {
        dialog.showMessageBox(options, (index) => {
          if (index === 0) {
            reloadWindow(mainWindow)
          } else {
            app.quit()
          }
        })
      })
      .catch((e) => {
        console.log('err', e)
      })
  })

  function recordCrash () {
    return new Promise((resolve) => {
      // sa.track(distinctId, 'im_app$crash', { name: 'appCrash' })
      // 崩溃日志请求成功....
      resolve()
    })
  }

  function reloadWindow (mainWin) {
    if (mainWin.isDestroyed()) {
      app.relaunch()
      app.exit(0)
    } else {
      BrowserWindow.getAllWindows().forEach((w) => {
        if (w.id !== mainWin.id) {
          w.destroy()
        }
      })
      mainWin.reload()
    }
  }
}

function sendWindowMessage (targetWindow, message, payload) {
  if (!targetWindow || targetWindow.isDestroyed()) {
    return
  }
  targetWindow.webContents.send(message, payload)
}

const VC_REDIST_X86_URL = 'https://aka.ms/vs/17/release/vc_redist.x86.exe'
let connectorErrorShown = false

/**
 * connector 库加载失败提示
 * Win32 error 126：依赖模块缺失（通常为 VC++ 运行库）；193：架构不匹配或文件损坏；127：导出函数缺失（版本不匹配）
 */
function showConnectorLoadError (loadError) {
  if (connectorErrorShown) return
  connectorErrorShown = true
  const isZh = app.getLocale() === 'zh-CN'
  const errorMessage = String((loadError && loadError.message) || '')
  const libraryPath = String((loadError && loadError.libraryPath) || '')
  const libraryFile = path.extname(libraryPath)
    ? libraryPath
    : libraryPath + (process.platform === 'win32' ? '.dll' : '.dylib')
  const fileMissing = !require('fs').existsSync(libraryFile)
  const win32Code = Number((/Win32 error (\d+)/.exec(errorMessage) || [])[1])
  const needRuntime = process.platform === 'win32' && !fileMissing && win32Code === 126
  let detail
  if (fileMissing) {
    detail = isZh
      ? `找不到 ${libraryFile}，可能已被杀毒软件隔离或删除。请将 imKey Manager 加入杀毒软件白名单后重新安装。`
      : `${libraryFile} is missing. It may have been quarantined by antivirus software. Please whitelist imKey Manager and reinstall it.`
  } else if (needRuntime) {
    detail = isZh
      ? '可能缺少 Microsoft Visual C++ 运行库（x86）或其他系统依赖。请下载安装运行库后重新启动 imKey Manager；如仍无法启动，请重新安装 imKey Manager。'
      : 'The Microsoft Visual C++ Redistributable (x86) or another system dependency may be missing. Please install the redistributable and restart imKey Manager. If the problem persists, reinstall imKey Manager.'
  } else {
    detail = isZh ? '请尝试重新安装 imKey Manager。' : 'Please try reinstalling imKey Manager.'
  }
  const buttons = needRuntime
    ? (isZh ? ['下载运行库', '关闭'] : ['Download', 'Close'])
    : (isZh ? ['关闭'] : ['Close'])
  dialog.showMessageBox({
    type: 'error',
    title: 'imKey Manager',
    message: isZh ? '设备通信组件加载失败' : 'Failed to load the device connector',
    detail: `${detail}\n\n${errorMessage}`,
    buttons,
    defaultId: 0,
    cancelId: buttons.length - 1
  }).then(({ response }) => {
    if (needRuntime && response === 0) {
      shell.openExternal(VC_REDIST_X86_URL)
    }
  })
}

function renderDeviceManagerHandler () {
  ipcMain.on('connector-load-failed', (event, loadError) => {
    if (!isTrustedSender(event, workerWindow)) return
    showConnectorLoadError(loadError)
  })
  ipcMain.on('message-from-worker', (event, arg) => {
    if (!isAllowedDeviceMessage(event, workerWindow, arg)) {
      return
    }
    sendWindowMessage(mainWindow, 'message-to-renderer', arg)
  })
  ipcMain.on('message-from-renderer', (event, arg) => {
    if (!isAllowedDeviceMessage(event, mainWindow, arg)) {
      return
    }
    sendWindowMessage(workerWindow, 'message-from-main', arg)
  })
  ipcMain.on('ready', (event, arg) => {
    if (!isTrustedSender(event, workerWindow)) return
    console.info('child process ready')
  })
  ipcMain.on('openUrl', (event, url) => {
    if (!isTrustedSender(event, mainWindow)) return
    try {
      if (new URL(url).protocol !== 'https:') return
    } catch (error) {
      return
    }
    shell.openExternal(url)
  })
}

// function initSa () {
//   sa.disableReNameOption()
//   sa.submitTo(url)
// }

/**
 * 单一实例
 */
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // 创建 mainWindow, 加载应用的其余部分, etc...
  app.on('ready', async () => {
    createMainWindow()
    createWorkerWindow()
    createTray()
    autoUpdate()
    crashReport()
    renderDeviceManagerHandler()
    // initSa()
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})
