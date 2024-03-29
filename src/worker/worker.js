
const { ipcRenderer } = require('electron')
// const deviceManger = remote.app.devicemanagerapi
// const walletApi = remote.app.walletapi
const deviceManger = require('../api/devicemanagerapi')
const walletApi = require('../api/walletapi')
const apiRouter = require('../api/apirouter')
let handleType = ''
ipcRenderer.on('message-from-main-api', (event, arg) => {
  console.log('arg', arg)
  console.log('arg.type:' + arg.type)
  console.log('arg.data:' + arg.data)
  let response
  try {
    if (arg.type === 'api') {
      response = apiRouter.api(arg.data)
      handleType = 'api'
    }
  } catch (e) {
    response = e
  }
  const result = {
    type: handleType,
    data: response
  }
  console.log(result)
  ipcRenderer.send('message-from-worker-api', result)
})
ipcRenderer.on('message-from-main-read-wallet-address', (event, arg) => {
  console.log('arg', arg)
  console.log('arg.type:' + arg.type)
  console.log('arg.data:' + arg.data)
  let response
  const coinAddressArray = []
  try {
    const bindCheckRes = deviceManger.deviceBindCheck(arg.data.filePath)
    if (bindCheckRes.isSuccess) {
    } else {
      response = {
        isSuccess: false,
        result: 'error'
      }
    }
    const coinNameArr = ['Ethereum', 'Polkadot', 'Kusama']
    for (let i = 0; i < coinNameArr.length; i++) {
      if (coinNameArr[i] === 'Ethereum') {
        response = walletApi.getETHAddress({
          path: "m/44'/60'/0'/0/0"
        })
        if (!response.isSuccess) {
          coinAddressArray.push({ chain: 'Ethereum', address: '' })
        }
        coinAddressArray.push({ chain: 'Ethereum', address: response.result.address })
      }
      if (coinNameArr[i] === 'Polkadot') {
        response = walletApi.getDOTAddress({
          path: "m/44'/354'/0'/0'/0'"
        })
        if (!response.isSuccess) {
          coinAddressArray.push({ chain: 'Polkadot', address: '' })
        }
        coinAddressArray.push({ chain: 'Polkadot', address: response.result.address })
      }
      if (coinNameArr[i] === 'Kusama') {
        response = walletApi.getKSMAddress({
          path: "m/44'/434'/0'/0'/0'"
        })
        if (!response.isSuccess) {
          coinAddressArray.push({ chain: 'Kusama', address: '' })
        }
        coinAddressArray.push({ chain: 'Kusama', address: response.result.address })
      }
    }
  } catch (e) {
    response = {
      isSuccess: false,
      result: e
    }
  }
  response = {
    isSuccess: true,
    result: coinAddressArray
  }
  const result = {
    type: handleType,
    data: response
  }
  console.log(result)
  ipcRenderer.send('message-from-worker-read-wallet-address', result)
})
ipcRenderer.on('message-from-main', (event, arg) => {
  console.log('arg', arg)
  console.log('arg.type:' + arg.type)
  console.log('arg.data:' + arg.data)
  let response
  try {
    if (arg.type === 'initImKeyCore') {
      response = deviceManger.initImKeyCore()
      handleType = 'initImKeyCore'
    }
    if (arg.type === 'connectDevice') {
      response = deviceManger.connect()
      handleType = 'connectDevice'
    }
    if (arg.type === 'getSeid') {
      response = deviceManger.getSeid()
      handleType = 'getSeid'
    }
    if (arg.type === 'getSn') {
      response = deviceManger.getSn()
      handleType = 'getSn'
    }
    if (arg.type === 'getRamSize') {
      response = deviceManger.getRamSize()
      handleType = 'getRamSize'
    }
    if (arg.type === 'getFirmwareVersion') {
      response = deviceManger.getFirmwareVersion()
      handleType = 'getFirmwareVersion'
    }
    if (arg.type === 'getBleVersion') {
      response = deviceManger.getBleVersion()
      handleType = 'getBleVersion'
    }
    if (arg.type === 'getSdkInfo') {
      response = deviceManger.getSdkInfo()
      handleType = 'getSdkInfo'
    }
    if (arg.type === 'activeDevice') {
      response = deviceManger.activeDevice()
      handleType = 'activeDevice'
    }
    if (arg.type === 'cosUpdate') {
      response = deviceManger.cosUpdate()
      handleType = 'cosUpdate'
    }
    if (arg.type === 'cosCheckUpdate') {
      response = deviceManger.cosCheckUpdate()
      handleType = 'cosCheckUpdate'
    }
    if (arg.type === 'isBLStatus') {
      response = deviceManger.isBLStatus()
      handleType = 'isBLStatus'
    }
    if (arg.type === 'checkDevice') {
      response = deviceManger.checkDevice()
      handleType = 'checkDevice'
    }
    if (arg.type === 'checkUpdate') {
      response = deviceManger.checkUpdateAppList()
      handleType = 'checkUpdate'
    }
    if (arg.type === 'getInstalledApplets') {
      response = deviceManger.getInstalledAppletList()
      handleType = 'getInstalledApplets'
    }
    if (arg.type === 'downloadApplet') {
      response = deviceManger.downloadApplet(arg.data)
      handleType = 'downloadApplet'
    }
    if (arg.type === 'updateApplet') {
      response = deviceManger.updateApplet(arg.data)
      handleType = 'updateApplet'
    }
    if (arg.type === 'deleteApplet') {
      response = deviceManger.deleteApplet(arg.data)
      handleType = 'deleteApplet'
    }
    if (arg.type === 'deviceBindCheck') {
      response = deviceManger.deviceBindCheck(arg.data)
      handleType = 'deviceBindCheck'
    }
    if (arg.type === 'deviceBindAcquire') {
      response = deviceManger.deviceBindAcquire(arg.data)
      handleType = 'deviceBindAcquire'
    }
    if (arg.type === 'deviceBindDisplay') {
      response = deviceManger.deviceBindDisplay()
      handleType = 'deviceBindDisplay'
    }
    if (arg.type === 'getBTCXpub') {
      const bindCheckRes = deviceManger.deviceBindCheck(arg.data)
      if (bindCheckRes.isSuccess) {
        response = walletApi.getBTCXpub()
      }
      handleType = 'getBTCXpub'
    }
    if (arg.type === 'getUserPath') {
      response = deviceManger.getUserPath()
      handleType = 'getUserPath'
    }
    if (arg.type === 'importBindCode') {
      response = deviceManger.importBindCode(arg.data)
      handleType = 'importBindCode'
    }
    if (arg.type === 'exportBindCode') {
      response = deviceManger.exportBindCode()
      handleType = 'exportBindCode'
    }
    if (arg.type === 'isExistBindCodeFile') {
      response = deviceManger.isExistBindCodeFile()
      handleType = 'isExistBindCodeFile'
    }
    if (arg.type === 'genWalletAddress') {
      const coinAddressArray = []
      try {
        const bindCheckRes = deviceManger.deviceBindCheck(arg.data.filePath)
        if (bindCheckRes.isSuccess) {
        } else {
          response = {
            isSuccess: false,
            result: 'error'
          }
        }
        const coinNameArr = ['Ethereum', 'Polkadot', 'Kusama']
        for (let i = 0; i < coinNameArr.length; i++) {
          if (coinNameArr[i] === 'Ethereum') {
            response = walletApi.getETHAddress({
              path: "m/44'/60'/0'/0/0"
            })
            if (!response.isSuccess) {
              coinAddressArray.push({ chain: 'Ethereum', address: '', chainId: 1, rpcUrl: 'https://mainnet-eth.token.im', symbol: 'ETH' })
            } else {
              coinAddressArray.push({ chain: 'Ethereum', address: response.result.address, chainId: 1, rpcUrl: 'https://mainnet-eth.token.im', symbol: 'ETH' })
            }
          }
          if (coinNameArr[i] === 'Polkadot') {
            response = walletApi.getDOTAddress({
              path: "m/44'/354'/0'/0'/0'"
            })
            if (!response.isSuccess) {
              coinAddressArray.push({ chain: 'Polkadot', address: '', chainId: 'Polkadot', rpcUrl: '', symbol: '' })
            } else {
              coinAddressArray.push({ chain: 'Polkadot', address: response.result.address, chainId: 'Polkadot', rpcUrl: '', symbol: '' })
            }
          }
          if (coinNameArr[i] === 'Kusama') {
            response = walletApi.getKSMAddress({
              path: "m/44'/434'/0'/0'/0'"
            })
            if (!response.isSuccess) {
              coinAddressArray.push({ chain: 'Kusama', address: '', chainId: 'Kusama', rpcUrl: '', symbol: '' })
            } else {
              coinAddressArray.push({ chain: 'Kusama', address: response.result.address, chainId: 'Kusama', rpcUrl: '', symbol: '' })
            }
          }
        }
      } catch (e) {
        response = {
          isSuccess: false,
          result: e
        }
      }
      response = {
        isSuccess: true,
        result: coinAddressArray
      }
      handleType = 'genWalletAddress'
      const result = {
        type: handleType,
        data: response
      }
      console.log(result)
      ipcRenderer.send('message-from-worker', result)
    }
    if (arg.type === 'writeWalletAddress') {
      try {
        const coinNameArr = arg.data.name
        const bindCheckRes = deviceManger.deviceBindCheck(arg.data.filePath)
        if (bindCheckRes.isSuccess) {
        } else {
          response = {
            isSuccess: false,
            result: 'error'
          }
        }
        for (let i = 0; i < coinNameArr.length; i++) {
          if (coinNameArr[i] === 'Bitcoin') {
            response = walletApi.registerBTCAddress({
              network: 'MAINNET',
              path: "m/44'/0'/0'"
            })
            if (!response.isSuccess) {
              response = {
                isSuccess: false,
                result: response.result
              }
            }
          }
          if (coinNameArr[i] === 'Ethereum') {
            response = walletApi.registerETHAddress({
              path: "m/44'/60'/0'/0/0"
            })
            if (!response.isSuccess) {
              response = {
                isSuccess: false,
                result: response.result
              }
            }
          }
          if (coinNameArr[i] === 'EOS') {
            response = walletApi.registerEOSPubKey({
              path: "m/44'/194'/0'/0/0"
            })
            if (!response.isSuccess) {
              response = {
                isSuccess: false,
                result: response.result
              }
            }
          }
          if (coinNameArr[i] === 'Cosmos') {
            response = walletApi.registerCOSMOSAddress({
              path: "m/44'/118'/0'/0/0"
            })
            if (!response.isSuccess) {
              response = {
                isSuccess: false,
                result: response.result
              }
            }
          }
          if (coinNameArr[i] === 'Filecoin') {
            response = walletApi.registerFILECOINAddress({
              path: "m/44'/461'/0'/0/0"
            })
            if (!response.isSuccess) {
              response = {
                isSuccess: false,
                result: response.result
              }
            }
          }
          if (coinNameArr[i] === 'Polkadot') {
            response = walletApi.registerDOTAddress({
              path: "m/44'/354'/0'/0'/0'"
            })
            if (!response.isSuccess) {
              response = {
                isSuccess: false,
                result: response.result
              }
            }
          }
          if (coinNameArr[i] === 'Kusama') {
            response = walletApi.registerKSMAddress({
              path: "m/44'/434'/0'/0'/0'"
            })
            if (!response.isSuccess) {
              response = {
                isSuccess: false,
                result: response.result
              }
            }
          }
          if (coinNameArr[i] === 'TRON') {
            response = walletApi.registerTRONAddress({
              path: "m/44'/195'/0'/0/0"
            })
            if (!response.isSuccess) {
              response = {
                isSuccess: false,
                result: response.result
              }
            }
          }
          if (coinNameArr[i] === 'TEZOS') {
            // response = walletApi.registerXTZAddress({
            //   path: "m/44'/1279'/0'/0/0"
            // })
            // if (!response.isSuccess) {
            //   response = {
            //     isSuccess: false,
            //     result: response.result
            //   }
            // }
          }
          if (coinNameArr[i] === 'NERVOS') {
            // response = walletApi.registerCKBAddress({
            //   path: "m/44'/309'/0'/0/0"
            // })
            // if (!response.isSuccess) {
            //   response = {
            //     isSuccess: false,
            //     result: response.result
            //   }
            // }
          }
          if (coinNameArr[i] === 'Bitcion Cash') {
            // response = walletApi.registerBCHAddress({
            //   path: "m/44'/145'/0'"
            // })
            // if (!response.isSuccess) {
            //   response = {
            //     isSuccess: false,
            //     result: response.result
            //   }
            // }
          }
          if (coinNameArr[i] === 'Litecoin') {
            // response = walletApi.registerLTCAddress({
            //   path: "m/44'/2'/0'"
            // })
            // if (!response.isSuccess) {
            //   response = {
            //     isSuccess: false,
            //     result: response.result
            //   }
            // }
          }
        }
      } catch (error) {
        response = {
          isSuccess: false,
          result: error
        }
      }
      response = {
        isSuccess: true,
        result: 'success'
      }
      handleType = 'writeWalletAddress'
    }
  } catch (e) {
    response = e
  }
  const result = {
    type: handleType,
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
  // const apiRouter = remote.app.apirouter
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
