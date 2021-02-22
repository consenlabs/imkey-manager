"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _electron = require("electron");

var _electronUpdater = require("electron-updater");

var Sentry = _interopRequireWildcard(require("@sentry/electron"));

var _package = _interopRequireDefault(require("../../package.json"));

var _saSdkNode = _interopRequireDefault(require("sa-sdk-node"));

var _web = _interopRequireDefault(require("web3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var url = 'https://imtoken.datasink.sensorsdata.cn/sa?project=production&token=27d69b3e7fd25949';
var sa = new _saSdkNode["default"]();
var distinctId = 'imkey-manager';
var envPath;

if (process.platform === 'win32') {
  if (process.env.NODE_ENV === 'production') {
    envPath = require('path').resolve(__dirname, 'key.env').replace('\\resources\\app.asar\\dist\\electron', '');
  } else {
    envPath = require('path').resolve('key.env');
  }
} else if (process.platform === 'darwin') {
  if (process.env.NODE_ENV === 'production') {
    envPath = require('path').resolve(__dirname, 'key.env').replace('/app.asar/dist/electron', '');
  } else {
    envPath = require('path').resolve('key.env');
  }
} else {}

require('dotenv').config({
  path: envPath
});

_electron.app.apirouter = require('../api/apirouter');
_electron.app.devicemanagerapi = require('../api/devicemanagerapi');
_electron.app.walletapi = require('../api/walletapi');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

var mainWindow, workerWindow;
var imkeyproviderURL = process.env.NODE_ENV === 'development' ? require('path').resolve(__dirname, '../api/imkeyprovider.js') : require('path').resolve(__dirname, 'imkeyprovider.js');
var winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080' : "file://".concat(__dirname, "/index.html");
var workerURL = process.env.NODE_ENV === 'development' ? 'worker.html' : "file://".concat(__dirname, "/worker.html"); // const path = require('path')

var ApplicationName = _package["default"].name; // 托盘对象

var appTray = null; // 是否可以退出

var trayClose = false; // 系统托盘右键菜单

var trayMenuTemplate; // 系统托盘图标

var iconPath; // 图标的上上下文

var contextMenu; // 图标闪烁定时器

var flashTrayTimer; // 单一实例

var gotTheLock = _electron.app.requestSingleInstanceLock();

if (process.platform === 'win32') {
  _electron.app.setAppUserModelId(ApplicationName);
} // 创建WorkerWindow


function createWorkerWindow() {
  workerWindow = new _electron.BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  workerWindow.on('closed', function () {
    console.log('background window closed');
    sa.track(distinctId, 'im_app$end', {
      name: 'appEnd'
    });
  });

  if (process.env.NODE_ENV === 'development') {
    workerWindow.loadFile(workerURL); // 调试时的加载方式
  } else {
    workerWindow.loadURL(workerURL); // 打包后的加载方式
  }
}
/**
 * 创建主窗口
 */


function createMainWindow() {
  if (mainWindow) {
    return;
  }
  /**
     * Initial window options
     */


  mainWindow = new _electron.BrowserWindow({
    show: false,
    height: 820,
    width: 1500,
    minWidth: 900,
    minHeight: 600,
    useContentSize: true,
    frame: true,
    // 无边框
    transparent: false,
    // 透明
    // fullscreen: true, // 全屏
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  _electron.Menu.setApplicationMenu(_electron.Menu.buildFromTemplate([]));

  mainWindow.loadURL(winURL);
  mainWindow.once('ready-to-show', function () {
    mainWindow.show(); // 启动http server

    sendWindowMessage(workerWindow, 'start-http-server', '');
  });
  /**
     * 监听
     */

  mainWindow.on('close', function (event) {
    if (process.platform === 'win32') {
      if (!trayClose) {
        // 最小化
        mainWindow.hide();
        event.preventDefault();
      }
    } else {
      _electron.app.quit();
    }
  });
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.on('maximize', function () {});
}
/**
 * 设置系统托盘
 */


function createTray() {
  // 是否可以退出
  trayClose = false; // 系统托盘图标

  iconPath = "".concat(__static, "/icon_16x16@2x.png"); // let iconMessagePath = `${__static}/iconMessageNotWin.png`
  // let iconTransparentPath = `${__static}/iconTransparentNotWin.png`
  // // 通知图标
  // const iconNoticePath = `${__static}/logo.png`

  if (process.platform === 'win32') {
    iconPath = "".concat(__static, "\\logo.ico"); // iconMessagePath = `${__static}\\iconMessage.ico`
    // iconTransparentPath = `${__static}\\iconTransparent.ico`
  }

  var locale = _electron.app.getLocale();

  var help = '';
  var about = '';
  var quit = '';

  if (locale !== 'zh-CN') {
    help = 'Help';
    about = 'About imKey';
    quit = 'Quit';
  } else {
    help = '帮助';
    about = '关于imKey';
    quit = '退出';
  } // 系统托盘右键菜单


  trayMenuTemplate = [{
    label: help,
    click: function click() {
      _electron.shell.openExternal('https://support.imkey.im');
    }
  }, {
    label: about,
    click: function click() {
      _electron.shell.openExternal('https://imkey.im');
    }
  }, {
    label: quit,
    click: function click() {
      trayClose = true;
      setTimeout(function () {
        _electron.app.quit();
      }, 3000);
      sa.track(distinctId, 'im_app$end', {
        name: 'appEnd'
      });
    }
  }];
  appTray = new _electron.Tray(iconPath); // 图标的上上下文

  contextMenu = _electron.Menu.buildFromTemplate(trayMenuTemplate); // 设置此托盘图标的悬停提示内容

  appTray.setToolTip(ApplicationName); // 设置此图标的上下文菜单

  appTray.setContextMenu(contextMenu); // 主窗口显示隐藏切换

  appTray.on('click', function () {
    // 清楚图标闪烁定时器
    clearInterval(flashTrayTimer);
    flashTrayTimer = null; // 还原图标

    appTray.setImage(iconPath);
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
} // /**
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


function autoUpdate() {
  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(obj) {
    mainWindow.webContents.send('updateMessage', obj);
  } // 监测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
  // const message = {
  //   error: '检查更新出错',
  //   checking: '正在检查更新......',
  //   updateAva: '监测到新版本，正在下载......',
  //   updateNotAva: '现在使用的就是最新版本，不用下载'
  // }
  // 当更新出现错误时触发


  _electronUpdater.autoUpdater.on('error', function (err) {
    // sendUpdateMessage('error')
    sendUpdateMessage({
      action: 'error',
      errorInfo: err
    });
  }); // 当开始检查更新的时候触发


  _electronUpdater.autoUpdater.on('checking-for-update', function () {
    // sendUpdateMessage('checking')
    sendUpdateMessage({
      action: 'checking'
    });
  }); // 当发现一个可用更新的时候触发，更新下载包会自动开始


  _electronUpdater.autoUpdater.autoDownload = false;

  _electronUpdater.autoUpdater.on('update-available', function (info) {
    // sendUpdateMessage('updateAva')
    sendUpdateMessage({
      action: 'updateAva',
      updateInfo: info
    });
  }); // 当没有可用更新的时候触发


  _electronUpdater.autoUpdater.on('update-not-available', function (info) {
    // sendUpdateMessage('updateNotAva')
    sendUpdateMessage({
      action: 'updateNotAva',
      updateInfo: info
    });
  }); // 更新下载进度事件


  _electronUpdater.autoUpdater.on('download-progress', function (progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj);
  });
  /**
     * event Event
     * releaseNotes String - 新版本更新公告
     * releaseName String - 新的版本号
     * releaseDate Date - 新版本发布的日期
     * updateUrl String - 更新地址
     */


  _electronUpdater.autoUpdater.on('update-downloaded', function (info) {
    // 下载太快可能无法触发downloadProgress事件，所以手动通知一下
    mainWindow.webContents.send('downloadProgress', {
      percent: 100
    }); // 可以手动选择是否立即退出并更新

    _electron.ipcMain.on('isUpdateNow', function (e, arg) {
      // some code here to handle event
      _electronUpdater.autoUpdater.quitAndInstall();
    });
  });

  _electron.ipcMain.on('checkForUpdate', function () {
    // 执行自动更新检查
    _electronUpdater.autoUpdater.checkForUpdates();
  });

  _electron.ipcMain.on('downloadUpdate', function () {
    // 下载
    _electronUpdater.autoUpdater.downloadUpdate();
  });
}
/**
 * 崩溃报告
 */


function crashReport() {
  // 报告常规错误
  Sentry.init({
    dsn: 'https://36dc1ad5111d44e1ae447e324a4d0141@o359184.ingest.sentry.io/5199393'
  }); // 报告系统错误

  _electron.crashReporter.start({
    companyName: 'imKey',
    productName: 'imKeyDesktop',
    ignoreSystemCrashHandler: true,
    submitURL: 'https://o359184.ingest.sentry.io/api/5199393/security/?sentry_key=36dc1ad5111d44e1ae447e324a4d0141'
  }); // 渲染进程崩溃事件


  mainWindow.webContents.on('crashed', function () {
    var options = {
      type: 'error',
      title: '进程崩溃了',
      message: '这个进程已经崩溃.',
      buttons: ['重载', '退出']
    };
    recordCrash().then(function () {
      _electron.dialog.showMessageBox(options, function (index) {
        if (index === 0) {
          reloadWindow(mainWindow);
        } else {
          _electron.app.quit();
        }
      });
    })["catch"](function (e) {
      console.log('err', e);
    });
  });

  function recordCrash() {
    return new Promise(function (resolve) {
      sa.track(distinctId, 'im_app$crash', {
        name: 'appCrash'
      }); // 崩溃日志请求成功....

      resolve();
    });
  }

  function reloadWindow(mainWin) {
    if (mainWin.isDestroyed()) {
      _electron.app.relaunch();

      _electron.app.exit(0);
    } else {
      _electron.BrowserWindow.getAllWindows().forEach(function (w) {
        if (w.id !== mainWin.id) {
          w.destroy();
        }
      });

      mainWin.reload();
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


function createBrowserView(url, isClose) {
  var view = new _electron.BrowserView({
    webPreferences: {
      nodeIntegration: true,
      // 设置开启nodejs环境
      preload: imkeyproviderURL
    }
  });

  if (isClose) {
    view.destroy();
  }

  mainWindow.setBrowserView(view);

  if (process.platform === 'win32') {
    view.setBounds({
      x: 300,
      y: 0,
      width: 1050,
      height: 700
    });
  } else if (process.platform === 'darwin') {
    view.setBounds({
      x: 300,
      y: 0,
      width: 1140,
      height: 820
    });
  } else {
    view.setBounds({
      x: 300,
      y: 0,
      width: 1140,
      height: 820
    });
  }

  view.setAutoResize({
    width: true,
    height: true
  }); // view.webContents.loadURL(url);

  var options = {
    userAgent: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
  }; // const options = { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1' }
  // view.webContents.loadURL('https://danfinlay.github.io/js-eth-personal-sign-examples/')
  // view.webContents.loadURL('https://polkadot.js.org/apps/#/accounts')
  // view.webContents.loadURL('https://uniswap.token.im/#/swap', options)

  view.webContents.loadURL('https://tokenlon.im/instant', options); //  view.webContents.loadURL('https://app.aave.com/markets', options)
  //  view.webContents.loadURL('https://lite.sushiswap.fi/#/?locale=zh-CN&utm_source=imtoken', options)
  // view.webContents.loadURL('https://www.myetherwallet.com/access-my-wallet',options)
  // view.webContents.loadURL('https://sushiswap.fi/?locale=zh-CN&utm_source=imtoken')
  // view.webContents.loadURL('https://app.zerion.io/connect-wallet')

  view.webContents.openDevTools();
  view.webContents.on('context-menu', function (_ref, _ref2) {
    var webContents = _ref.sender;
    var editFlags = _ref2.editFlags;
    var template = [].concat(_toConsumableArray(editFlags.canCut ? [{
      role: 'cut'
    }, {
      label: 'Cut (custom)',
      click: function click() {
        return webContents.cut();
      }
    }] : []), _toConsumableArray(editFlags.canCopy ? [{
      role: 'copy'
    }, {
      label: 'Copy (custom)',
      click: function click() {
        return webContents.copy();
      }
    }] : []), _toConsumableArray(editFlags.canPaste ? [{
      role: 'paste'
    }, {
      label: 'Paste (custom)',
      click: function click() {
        return webContents.paste();
      }
    }] : []));

    if (!template.length) {
      return;
    }

    _electron.Menu.buildFromTemplate(template).popup({});
  }); //   view.webContents.once('dom-ready', () => {
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

  console.log(url); // setTimeout(()=>{
  //   view.destroy()
  // },5000)
}

function sendWindowMessage(targetWindow, message, payload) {
  if (typeof targetWindow === 'undefined') {
    console.log('Target window does not exist');
    return;
  }

  console.log('message:' + message);
  console.log('type:' + payload.type);
  console.log('data:' + payload.data);
  console.log(payload.data);
  targetWindow.webContents.send(message, payload);
}

function renderDeviceManagerHandler() {
  _electron.ipcMain.on('message-from-worker', function (event, arg) {
    sendWindowMessage(mainWindow, 'message-to-renderer', arg);
  });

  _electron.ipcMain.on('message-from-renderer', function (event, arg) {
    sendWindowMessage(workerWindow, 'message-from-main', arg);
  });

  _electron.ipcMain.on('ready', function (event, arg) {
    console.info('child process ready');
  });

  _electron.ipcMain.on('openUrl', function (event, url) {
    _electron.shell.openExternal(url);
  });

  _electron.ipcMain.on('openBrowserView', function (event, url, isClose) {
    createBrowserView(url, isClose);
  });

  _electron.ipcMain.on('closeBrowserView', function (event, url) {
    _electron.shell.openExternal(url);
  });

  _electron.ipcMain.on('zoomIn', function (event, zoomParam) {
    _electron.webFrame.setZoomFactor(zoomParam);
  });
}

function initSa() {
  sa.disableReNameOption();
  sa.submitTo(url);
}
/**
 * 单一实例
 */


if (!gotTheLock) {
  _electron.app.quit();
} else {
  _electron.app.on('second-instance', function (event, commandLine, workingDirectory) {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  }); // 创建 mainWindow, 加载应用的其余部分, etc...


  _electron.app.on('ready', function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            createMainWindow();
            createWorkerWindow();
            createTray();
            autoUpdate();
            crashReport(); // protocalHandler()

            renderDeviceManagerHandler();
            initSa(); // startHttpServer()

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}

_electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    _electron.app.quit();
  }
});

_electron.app.on('activate', function () {
  if (mainWindow === null) {
    createMainWindow();
  }
});