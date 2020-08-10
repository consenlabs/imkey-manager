const deviceManger = require('../api/devicemanagerapi')
const walletApi = require('../api/walletapi')
const { ipcRenderer } = require('electron')

ipcRenderer.on('message-from-main', (event, arg) => {
  console.log('arg', arg)
  console.log('arg.type:' + arg.type)
  console.log('arg.data:' + arg.data)
  let response
  try{
    if (arg.type === 'connectDevice') {
      response = deviceManger.connect()
    }
    if (arg.type === 'getSeid') {
      response = deviceManger.getSeid()
    }
    if (arg.type === 'getSn') {
      response = deviceManger.getSn()
    }
    if (arg.type === 'getRamSize') {
      response = deviceManger.getRamSize()
    }
    if (arg.type === 'getFirmwareVersion') {
      response = deviceManger.getFirmwareVersion()
    }
    if (arg.type === 'getSdkInfo') {
      response = deviceManger.getSdkInfo()
    }
    if (arg.type === 'activeDevice') {
      response = deviceManger.activeDevice()
    }
    if (arg.type === 'cosUpdate') {
      response = deviceManger.cosUpdate()
    }
    if (arg.type === 'cosCheckUpdate') {
      response = deviceManger.cosCheckUpdate()
    }
    if (arg.type === 'isBLStatus') {
      response = deviceManger.isBLStatus()
    }
    if (arg.type === 'checkDevice') {
      response = deviceManger.checkDevice()
    }
    if (arg.type === 'checkUpdate') {
      response = deviceManger.checkUpdateAppList()
    }
    if (arg.type === 'downloadApplet') {
      response = deviceManger.downloadApplet(arg.data)
    }
    if (arg.type === 'updateApplet') {
      response = deviceManger.updateApplet(arg.data)
    }
    if (arg.type === 'deleteApplet') {
      response = deviceManger.deleteApplet(arg.data)
    }
    if (arg.type === 'deviceBindCheck') {
      response = deviceManger.deviceBindCheck(arg.data)
    }
    if (arg.type === 'deviceBindAcquire') {
      response = deviceManger.deviceBindAcquire(arg.data)
    }
    if (arg.type === 'deviceBindDisplay') {
      response = deviceManger.deviceBindDisplay()
    }
    if (arg.type === 'getBTCXpub') {
      response = walletApi.getBTCXpub()
    }
    if (arg.type === 'getUserPath') {
      response = deviceManger.getUserPath()
    }
    if (arg.type === 'importBindCode') {
      response = deviceManger.importBindCode(arg.data)
    }
    if (arg.type === 'exportBindCode') {
      response = deviceManger.exportBindCode()
    }
  }catch (e) {
    response = e
  }
  const result = {
    type: arg.type,
    data: response
  }
  console.log(result)
  ipcRenderer.send('message-from-worker', result)
})

/**
 * 启动 http server
 */
ipcRenderer.on('start-http-server', (event, arg) => {
  const express = require('express')
  const app = express()
  const cors = require('cors')
  const bodyParser = require('body-parser')
  const apiRouter = require('../api/apirouter')
  // 配置cors解决跨域请求的问题
  app.use(cors())
  // 给app配置bodyParser中间件
  // 通过如下配置再路由种处理request时，可以直接获得post请求的body部分
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  // let router = express.Router();
  // 获得express router对象
  // 用post动词访问 http://localhost:8081/api/imKey
  app.post('/api/imKey', function (req, res) {
    let body = ''
    let jsonStr
    let reqJson
    if (typeof (req.body.method) === 'undefined') {
      req.on('data', function (chunk) {
        body += chunk // 读取参数流转化为字符串
      })
      req.on('end', function () {
        // 读取参数流结束后将转化的body字符串解析成 JSON 格式
        try {
          reqJson = JSON.parse(body)
          jsonStr = apiRouter.api(reqJson)
        } catch (err) {
          if (typeof (jsonStr) === 'undefined' || jsonStr === null) {
            jsonStr = {
              'jsonrpc:': '2.0',
              error: {
                code: -32606,
                message: err
              },
              'id:': 1
            }
          } else {
            jsonStr = {
              'jsonrpc:': reqJson.jsonrpc,
              error: {
                code: -32606,
                message: err
              },
              'id:': reqJson.id
            }
          }
        }
        res.json(jsonStr)
      })
    } else {
      reqJson = req.body
      // 读取参数流结束后将转化的body字符串解析成 JSON 格式
      try {
        jsonStr = apiRouter.api(reqJson)
      } catch (err) {
        if (typeof (jsonStr) === 'undefined' || jsonStr === null) {
          jsonStr = {
            'jsonrpc:': '2.0',
            error: {
              code: -32606,
              message: err
            },
            'id:': 1
          }
        } else {
          jsonStr = {
            'jsonrpc:': reqJson.jsonrpc,
            error: {
              code: -32604,
              message: err
            },
            'id:': reqJson.id
          }
        }
      }
      res.json(jsonStr)
    }
  })
  // 注册路由
  // 所有的路由会加上“／api”前缀
  // pp.use('/api/imKey/', router);
  app.listen(8081)
  console.log('http server  start!')
})
