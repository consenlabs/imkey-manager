import { app, BrowserWindow, BrowserView, ipcMain, Menu, shell, Tray, dialog, crashReporter } from 'electron'
// 自动更新相关
import { autoUpdater } from 'electron-updater'
// 崩溃报告
import * as Sentry from '@sentry/electron'
// import ImKeyProvider from '@imkey/web3-provider'
// test.json
import pkg from '../../package.json'
import SensorsAnalytics from 'sa-sdk-node'
const url = 'https://imtoken.datasink.sensorsdata.cn/sa?project=production&token=27d69b3e7fd25949'
const sa = new SensorsAnalytics()
const distinctId = 'imkey-manager'
let envPath
if (process.platform === 'win32') {
  if (process.env.NODE_ENV === 'production') {
    envPath = require('path').resolve(__dirname, 'key.env').replace('\\resources\\app.asar\\dist\\electron', '')
  } else {
    envPath = require('path').resolve('key.env')
  }
} else if (process.platform === 'darwin') {
  if (process.env.NODE_ENV === 'production') {
    envPath = require('path').resolve(__dirname, 'key.env').replace('/app.asar/dist/electron', '')
  } else {
    envPath = require('path').resolve('key.env')
  }
} else {
  console.log('none')
}
require('dotenv').config({ path: envPath })
app.apirouter = require('../api/apirouter')
app.devicemanagerapi = require('../api/devicemanagerapi')
app.walletapi = require('../api/walletapi')
app.web3 = require('web3')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, workerWindow
const polkadotdappURL = process.env.NODE_ENV === 'development'
  ? require('path').resolve(__dirname, '../api/polkadotdapp.js')
  : require('path').resolve(__dirname, 'polkadotdapp.js')
const ethereumdappURL = process.env.NODE_ENV === 'development'
  ? require('path').resolve(__dirname, '../api/ethereumdapp.js')
  : require('path').resolve(__dirname, 'ethereumdapp.js')
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`
const workerURL = process.env.NODE_ENV === 'development'
  ? 'worker.html'
  : `file://${__dirname}/worker.html`
const loadFailPagePath = process.env.NODE_ENV === 'development'
  ? require('path').resolve(__dirname, '../api/loadFail.html')
  : require('path').resolve(__dirname, 'loadFail.html')
// const path = require('path')
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
    sa.track(distinctId, 'im_app$end', { name: 'appEnd' })
  })
  if (process.env.NODE_ENV === 'development') {
    workerWindow.loadFile(workerURL)// 调试时的加载方式
  } else {
    workerWindow.loadURL(workerURL)// 打包后的加载方式
  }
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
  mainWindow.loadURL(winURL)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // 启动http server
    sendWindowMessage(workerWindow, 'start-http-server', '')
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

  mainWindow.on('maximize', () => {

  })
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
        sa.track(distinctId, 'im_app$end', { name: 'appEnd' })
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

// /**
//  * 启动 http server
//  */
// function startHttpServer () {
//   const express = require('express')
//   const app = express()
//   const cors = require('cors')
//   const bodyParser = require('body-parser')
//   const apiRouter = require('../api/apirouter')
//   // 配置cors解决跨域请求的问题
//   app.use(cors())
//   // 给app配置bodyParser中间件
//   // 通过如下配置再路由种处理request时，可以直接获得post请求的body部分
//   app.use(bodyParser.urlencoded({ extended: true }))
//   app.use(bodyParser.json())
//   // let router = express.Router();
//   // 获得express router对象
//   // 用post动词访问 http://localhost:8081/api/imKey
//   app.post('/api/imKey', function (req, res) {
//     let body = ''
//     let jsonStr
//     let reqJson
//     if (typeof (req.body.method) === 'undefined') {
//       req.on('data', function (chunk) {
//         body += chunk // 读取参数流转化为字符串
//       })
//       req.on('end', function () {
//         // 读取参数流结束后将转化的body字符串解析成 JSON 格式
//         reqJson = JSON.parse(body)
//         try {
//           jsonStr = apiRouter.api(reqJson)
//         } catch (err) {
//           jsonStr = {
//             'jsonrpc:': reqJson.jsonrpc,
//             error: {
//               code: -32606,
//               message: err
//             },
//             'id:': reqJson.id
//           }
//         }
//         res.json(jsonStr)
//       })
//     } else {
//       reqJson = req.body
//       // 读取参数流结束后将转化的body字符串解析成 JSON 格式
//       try {
//         jsonStr = apiRouter.api(reqJson)
//       } catch (err) {
//         jsonStr = {
//           'jsonrpc:': reqJson.jsonrpc,
//           error: {
//             code: -32604,
//             message: err
//           },
//           'id:': reqJson.id
//         }
//       }
//       res.json(jsonStr)
//     }
//   })
//   // 注册路由
//   // 所有的路由会加上“／api”前缀
//   // pp.use('/api/imKey/', router);
//   app.listen(8081)
// }

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
      // some code here to handle event
      autoUpdater.quitAndInstall()
    })
  })

  ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })

  ipcMain.on('downloadUpdate', () => {
    // 下载
    autoUpdater.downloadUpdate()
  })
}

/**
 * 崩溃报告
 */
function crashReport () {
  // 报告常规错误
  Sentry.init({
    dsn: 'https://36dc1ad5111d44e1ae447e324a4d0141@o359184.ingest.sentry.io/5199393'
  })

  // 报告系统错误
  crashReporter.start({
    companyName: 'imKey',
    productName: 'imKeyDesktop',
    ignoreSystemCrashHandler: true,
    submitURL: 'https://o359184.ingest.sentry.io/api/5199393/security/?sentry_key=36dc1ad5111d44e1ae447e324a4d0141'
  })

  // 渲染进程崩溃事件
  mainWindow.webContents.on('crashed', () => {
    const options = {
      type: 'error',
      title: '进程崩溃了',
      message: '这个进程已经崩溃.',
      buttons: ['重载', '退出']
    }
    recordCrash().then(() => {
      dialog.showMessageBox(options, (index) => {
        if (index === 0) {
          reloadWindow(mainWindow)
        } else {
          app.quit()
        }
      })
    }).catch((e) => {
      console.log('err', e)
    })
  })

  function recordCrash () {
    return new Promise(resolve => {
      sa.track(distinctId, 'im_app$crash', { name: 'appCrash' })
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

/**
 * 协议处理
 */
// function protocalHandler () {
//   const args = []
//   if (!app.isPackaged) {
//     // 如果是开发阶段，需要把我们的脚本的绝对路径加入参数中
//     args.push(path.resolve(process.argv[1]))
//   }
//   // 加一个 `--` 以确保后面的参数不被 Electron 处理
//   args.push('--')
//
//   // 注册协议
//   const PROTOCOL = pkg.name
//   console.log('PROTOCOL:' + PROTOCOL)
//   app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args)
//
//   // 如果打开协议时，没有其他实例，则当前实例当做主实例，处理参数
//   handleArgv(process.argv)
//
//   // 其他实例启动时，主实例会通过 second-instance 事件接收其他实例的启动参数 `argv`
//   app.on('second-instance', (event, argv) => {
//     // Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
//     if (process.platform === 'win32') {
//       handleArgv(argv)
//     }
//   })
//
//   // macOS 下通过协议URL启动时，主实例会通过 open-url 事件接收这个 URL
//   app.on('open-url', (event, urlStr) => {
//     handleUrl(urlStr)
//   })
//
//   // 处理参数
//   function handleArgv (argv) {
//     const prefix = `${PROTOCOL}:`
//     // 开发阶段，跳过前两个参数（`electron.exe .`）
//     // 打包后，跳过第一个参数（`myapp.exe`）
//     const offset = app.isPackaged ? 1 : 2
//     const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix))
//     if (url) handleUrl(url)
//   }
//
//   // 解析Url
//   function handleUrl (urlStr) {
//     console.log('urlStr:' + urlStr)
//     // myapp:?a=1&b=2
//     const urlObj = new URL(urlStr)
//     const { searchParams } = urlObj
//     console.log(urlObj.query) // -> a=1&b=2
//     console.log(searchParams.get('a')) // -> 1
//     console.log(searchParams.get('b')) // -> 2
//     // 根据需要做其他事情
//   }
// }
// const KOVAN_RPC_URL = 'https://kovan.infura.io'
// const ETHEREUM_MAIN_NET = 'https://kovan.infura.io'
// const imkeyProvider = new ImKeyProvider({
//   rpcUrl: 'https://eth-mainnet.token.im',
//   chainId: 1,
//   headers: {
//     agent: 'ios:2.4.2:2'
//   }
// })
// imkeyProvider.enable()
let view
function createBrowserView (url, isClose) {
  let perloadjsPath
  if (url === 'https://polkadot.js.org/apps/#/accounts') {
    perloadjsPath = polkadotdappURL
  } else {
    perloadjsPath = ethereumdappURL
  }
  view = new BrowserView({
    webPreferences: {
      nodeIntegration: true, // 设置开启nodejs环境
      enableRemoteModule: true,
      contextIsolation: false,
      preload: perloadjsPath
    }
  })
  mainWindow.setBrowserView(view)
  if (isClose) {
    mainWindow.removeBrowserView(view)
    view.destroy()
    return
  }

  if (process.platform === 'win32') {
    view.setBounds({ x: 300, y: 0, width: 1050, height: 700 })
  } else if (process.platform === 'darwin') {
    view.setBounds({ x: 300, y: 62, width: 1140, height: 820 })
  } else {
    view.setBounds({ x: 300, y: 0, width: 1140, height: 820 })
  }

  view.setAutoResize({ width: true, height: true })
  // view.webContents.loadURL(url);
  const options = { userAgent: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19' }
  // view.webContents.loadURL('https://danfinlay.github.io/js-eth-personal-sign-examples/')
  // const loadingPagePath = require('path').resolve(__dirname, '../api/test.html')
  // view.webContents.loadURL('file://' + loadingPagePath)
  view.webContents.loadURL(url, options)
  // view.webContents.loadURL('https://www.myetherwallet.com/access-my-wallet')
  // view.webContents.loadURL('https://tokenlon.dev.tokenlon.im/#/')
  // view.webContents.loadURL('https://app.zerion.io/connect-wallet')
  // view.webContents.on('did-frame-finish-load', () => {
  //   // if (isDev) {
  //     view.webContents.openDevTools();
  //     view.webContents.on('devtools-opened', () => {
  //       view.focus();
  //     });
  //   // }
  // });
  // view.webContents.openDevTools()

  view.webContents.on('context-menu', ({ sender: webContents }, { editFlags }) => {
    const template = [
      ...(editFlags.canCut
        ? [
            { role: 'cut' },
            { label: 'Cut (custom)', click: () => webContents.cut() }
          ]
        : []
      ),
      ...(editFlags.canCopy
        ? [
            { role: 'copy' },
            { label: 'Copy (custom)', click: () => webContents.copy() }
          ]
        : []
      ),
      ...(editFlags.canPaste
        ? [
            { role: 'paste' },
            { label: 'Paste (custom)', click: () => webContents.paste() }
          ]
        : []
      )
    ]

    if (!template.length) {
      return
    }

    Menu
      .buildFromTemplate(template)
      .popup({})
  })

  view.webContents.on('did-fail-load', function (event, errorCode, errorDescription, url) {
    
    console.log('did-fail-load: ', event, errorCode, errorDescription, url);

    const loadingPagePath = require('path').resolve(__dirname, '../api/loadFailPagePath.html')
    view.loadURL(loadingPagePath)
  })

  view.webContents.on('will-navigate', function(event, url) {
    console.log("will-navigate: ", event, url);
  })

  view.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url);
  })

  //   view.webContents.once('dom-ready', () => {
  //     console.log('dom-ready')
  //     view.webContents.executeJavaScript(`
  //   console.log("This loads no problem!");
  //   window.ethereum = 'test'
  //   console.log(window.ethereum);
  //   console.log(window.web3);
  //   // const ImKeyProvider = require('@imkey/web3-provider‘);
  //   // window.web3 = "ImKeyProvider";
  //   // console.log(window.web3);
  //   const KOVAN_RPC_URL = 'https://kovan.infura.io';
  //   const ETHEREUM_MAIN_NET = 'https://kovan.infura.io';
  //   // const imkeyProvider = new ${ImKeyProvider}({
  //   //  rpcUrl: "https://eth-mainnet.token.im",
  //   //   chainId: 1,
  //   //   headers: {
  //   //       agent: "ios:2.4.2:2",
  //   //   },
  //   // });
  //   // imkeyProvider.enable();
  //   window.web3 = new Web3(${ImKeyProvider})
  //   console.log(window.web3)
  // `)
  //   })

  console.log(url)
  // setTimeout(()=>{
  //   view.destroy()
  // },5000)
}
function sendWindowMessage (targetWindow, message, payload) {
  if (typeof targetWindow === 'undefined') {
    console.log('Target window does not exist')
    return
  }
  console.log('message:' + message)
  console.log('type:' + payload.type)
  console.log('data:' + payload.data)
  console.log(payload.data)
  targetWindow.webContents.send(message, payload)
}
function renderDeviceManagerHandler () {
  ipcMain.on('message-from-worker', (event, arg) => {
    sendWindowMessage(mainWindow, 'message-to-renderer', arg)
  })
  ipcMain.on('message-from-renderer', (event, arg) => {
    sendWindowMessage(workerWindow, 'message-from-main', arg)
  })
  ipcMain.on('ready', (event, arg) => {
    console.info('child process ready')
  })

  ipcMain.on('openUrl', (event, url) => {
    shell.openExternal(url)
  })
  ipcMain.on('openBrowserView', (event, url, isClose) => {
    createBrowserView(url, isClose)
  })
  ipcMain.on('closeBrowserView', (event, url) => {
    shell.openExternal(url)
  })
  ipcMain.on('goForward', (event, url) => {
    view.webContents.goForward()
  })
  ipcMain.on('goBack', (event, url) => {
    view.webContents.goBack()
  })
  ipcMain.on('refresh', (event, url) => {
    view.webContents.reload()
  })
  ipcMain.on('copyLink', (event, url) => {
    // view.webContents.reload()
    const clipboard = require('electron').clipboard
    clipboard.writeText(url)
  })
  ipcMain.on('openInSafari', (event, url) => {
    shell.openExternal(url)
  })
  // ipcMain.on('zoomIn', (event, zoomParam) => {
  //   webFrame.setZoomFactor(zoomParam)
  // })
}
function initSa () {
  sa.disableReNameOption()
  sa.submitTo(url)
}
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
    // protocalHandler()
    renderDeviceManagerHandler()
    initSa()
    // startHttpServer()
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
