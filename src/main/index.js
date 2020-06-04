import {app, BrowserWindow, ipcMain, Menu, shell, Tray, Notification, dialog, crashReporter} from 'electron'
// 自动更新相关
import {autoUpdater} from 'electron-updater'
// 崩溃报告
import * as Sentry from '@sentry/electron'
// package.json
import pkg from '../../package.json'
//http
import http from 'http'
// api模块
let ApiRouter = require('../api/apirouter')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

const path = require('path')
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

/**
 * 创建主窗口
 */
function createMainWindow() {
    if (mainWindow) {
        return
    }

    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        show: false,
        height: 1000,
        width: 1600,
        minWidth: 900,
        minHeight: 600,
        useContentSize: true,
        frame: true, // 无边框
        transparent: false, // 透明
        // fullscreen: true, // 全屏
        webPreferences: {
            nodeIntegration: true
        },
    })

    Menu.setApplicationMenu(null)
    mainWindow.loadURL(winURL)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
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
function createTray() {
    // 是否可以退出
    trayClose = false

    // 系统托盘图标
    iconPath = `${__static}/logoNotWin.png`
    let iconMessagePath = `${__static}/iconMessageNotWin.png`
    let iconTransparentPath = `${__static}/iconTransparentNotWin.png`
    // 通知图标
    const iconNoticePath = `${__static}/logo.png`

    if (process.platform === 'win32') {
        iconPath = `${__static}\\logo.ico`
        iconMessagePath = `${__static}\\iconMessage.ico`
        iconTransparentPath = `${__static}\\iconTransparent.ico`
    }


    // 系统托盘右键菜单
    trayMenuTemplate = [
        {
            label: '帮助',
            click: function () {
                shell.openExternal('https://support.imkey.im')
            }
        },
        {
            label: '关于imKey',
            click: function () {
                shell.openExternal('https://imkey.im')
            }
        },
        {
            label: '退出',
            click: function () {
                trayClose = true
                app.quit()
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
 * 启动 http server
 */
function startHttpServer() {
    http.createServer((request, response) => {
        request.on('error', (err) => {
            console.error(err);
            response.statusCode = 400;
            response.end();
        });
        response.on('error', (err) => {
            console.error(err);
        });
        if (request.method === 'POST' && request.url.match('/imkey')) {
            let {headers, method, url} = request;
            let body = [];
            request.on('error', (err) => {
                console.error(err);
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                // BEGINNING OF NEW STUFF

                response.on('error', (err) => {
                    console.error(err);
                });

                // response.statusCode = 200;
                // response.setHeader('Content-Type', 'application/json');
                // Note: the 2 lines above could be replaced with this next one:
                // response.writeHead(200, {'Content-Type': 'application/json'})
                // {"ReturnCode":"000000","ReturnData":{"nextStepKey":"05","seid":"18080000000000860001010000000015"},"ReturnMsg":"操作成功"}
                let reqjson = JSON.parse(body);//获取到request请求中的json对象
                //处理request请求的数据
                //调用rust库把需要的数据发给rust库处理
                console.log(" process.versions.node:" + process.versions.node);
                console.log("request.url.split(\"/imkey/\")[1]" + request.url.split("/imkey/")[1])
                let msg = ApiRouter.api(request.url.split("/imkey/")[1], reqjson);
                msg = JSON.stringify(msg);

                console.log("msg:" + msg)
                //返回response的json对象
                let resjson = {"ReturnCode": "000000", "ReturnMsg": "操作成功", "ReturnData": {msg}};
                // let responseBody = {headers, method, url, resjson};

                response.write(JSON.stringify(resjson));
                response.end();
                // Note: the 2 lines above could be replaced with this next one:
                // response.end(JSON.stringify(responseBody))
                // END OF NEW STUFF
            });
            // request.pipe(response);
        } else {
            response.statusCode = 404;
            response.end();
        }
    }).listen(8080, '127.0.0.1');
}

/**
 * 自动更新
 */
function autoUpdate() {
    // 通过main进程发送事件给renderer进程，提示更新信息
    function sendUpdateMessage(obj) {
        mainWindow.webContents.send('updateMessage', obj)
    }
    // 监测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
    const message = {
        error: '检查更新出错',
        checking: '正在检查更新......',
        updateAva: '监测到新版本，正在下载......',
        updateNotAva: '现在使用的就是最新版本，不用下载'
    }

    // 当更新出现错误时触发
    autoUpdater.on('error', (err) => {
        // sendUpdateMessage('error')
        sendUpdateMessage({action: 'error', errorInfo: err})
    })

    // 当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', () => {
        // sendUpdateMessage('checking')
        sendUpdateMessage({action: 'checking'})
    })

    // 当发现一个可用更新的时候触发，更新下载包会自动开始
    autoUpdater.autoDownload = false
    autoUpdater.on('update-available', (info) => {
        // sendUpdateMessage('updateAva')
        sendUpdateMessage({action: 'updateAva', updateInfo: info})
    })

    // 当没有可用更新的时候触发
    autoUpdater.on('update-not-available', (info) => {
        // sendUpdateMessage('updateNotAva')
        sendUpdateMessage({action: 'updateNotAva', updateInfo: info})
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
        mainWindow.webContents.send('downloadProgress', {percent: 100})
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
function crashReport() {
    // 报告常规错误
    Sentry.init({
        dsn: 'https://36dc1ad5111d44e1ae447e324a4d0141@o359184.ingest.sentry.io/5199393',
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
            buttons: ['重载', '退出'],
        };
        recordCrash().then(() => {
            dialog.showMessageBox(options, (index) => {
                if (index === 0) {
                    reloadWindow(mainWindow)
                } else {
                    app.quit()
                }
            });
        }).catch((e) => {
            console.log('err', e)
        });
    })

    function recordCrash() {
        return new Promise(resolve => {
            // 崩溃日志请求成功....
            resolve();
        })
    }

    function reloadWindow(mainWin) {
        if (mainWin.isDestroyed()) {
            app.relaunch();
            app.exit(0);
        } else {
            BrowserWindow.getAllWindows().forEach((w) => {
                if (w.id !== mainWin.id) {
                    w.destroy()
                }
            });
            mainWin.reload();
        }
    }
}

/**
 * 协议处理
 */
function protocalHandler() {
    const args = [];
    if (!app.isPackaged) {
        // 如果是开发阶段，需要把我们的脚本的绝对路径加入参数中
        args.push(path.resolve(process.argv[1]))
    }
    // 加一个 `--` 以确保后面的参数不被 Electron 处理
    args.push('--')

    // 注册协议
    const PROTOCOL = pkg.name
    console.log("PROTOCOL:"+PROTOCOL)
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args)

    // 如果打开协议时，没有其他实例，则当前实例当做主实例，处理参数
    handleArgv(process.argv)

    // 其他实例启动时，主实例会通过 second-instance 事件接收其他实例的启动参数 `argv`
    app.on('second-instance', (event, argv) => {
        // Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
        if (process.platform === 'win32') {
            handleArgv(argv)
        }
    })

    // macOS 下通过协议URL启动时，主实例会通过 open-url 事件接收这个 URL
    app.on('open-url', (event, urlStr) => {
        handleUrl(urlStr)
    })

    // 处理参数
    function handleArgv(argv) {
        const prefix = `${PROTOCOL}:`;
        // 开发阶段，跳过前两个参数（`electron.exe .`）
        // 打包后，跳过第一个参数（`myapp.exe`）
        const offset = app.isPackaged ? 1 : 2
        const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix))
        if (url) handleUrl(url)
    }

    // 解析Url
    function handleUrl(urlStr) {
        console.log("urlStr:"+urlStr)
        // myapp:?a=1&b=2
        const urlObj = new URL(urlStr);
        const {searchParams} = urlObj;
        console.log(urlObj.query); // -> a=1&b=2
        console.log(searchParams.get('a')); // -> 1
        console.log(searchParams.get('b')); // -> 2
        // 根据需要做其他事情

    }

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
    app.on('ready', () => {
        createMainWindow()
        createTray()
        autoUpdate()
        crashReport()
        protocalHandler()
        startHttpServer()

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
