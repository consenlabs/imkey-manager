const walletApi = require('./walletapi')
const constants = require('../common/constants')
const deviceManger = require('./devicemanagerapi')

export function api (reqJson) {
  const jsonrpc = reqJson.jsonrpc
  const id = reqJson.id
  const method = reqJson.method
  const params = reqJson.params
  let result
  if (params === null || params === '' || params === undefined) {
    result = {
      'jsonrpc:': jsonrpc,
      error: {
        code: -32600,
        message: 'params is null'
      },
      'id:': id
    }
    return result
  }
  if (method === null || method === '' || method === undefined) {
    result = {
      'jsonrpc:': jsonrpc,
      error: {
        code: -32601,
        message: 'method is null'
      },
      'id:': id
    }
    return result
  }

  const initImKeyCore = deviceManger.initImKeyCore()
  if (!initImKeyCore.isSuccess) {
    return initImKeyCore.result
  }
  const connectRes = deviceManger.connect(constants.DEVICE_NAME_IMKEY_PRO)
  if (connectRes.isSuccess) {
    if (connectRes.result !== constants.RESULT_STATUS_SUCCESS) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32602,
          message: connectRes.result
        },
        'id:': id
      }
      return result
    } else {
      // 检查是否绑定
      const bindCheckRes = deviceManger.deviceBindCheck()
      if (bindCheckRes.isSuccess) {
        if (bindCheckRes.result !== constants.BIND_STATUS_STRING_BOUND_THIS) {
          if (bindCheckRes.result === constants.BIND_STATUS_STRING_BOUND_OTHER || bindCheckRes.result === constants.BIND_STATUS_STRING_UNBOUND) {
            result = {
              'jsonrpc:': jsonrpc,
              error: {
                code: -32603,
                message: 'your imKey bind status is ' + bindCheckRes.result + ' ,please bind your imKey.'
              },
              'id:': id
            }
          } else {
            result = {
              'jsonrpc:': jsonrpc,
              error: {
                code: -32603,
                message: bindCheckRes.result
              },
              'id:': id
            }
          }
          return result
        }
      } else {
        result = {
          'jsonrpc:': jsonrpc,
          error: {
            code: -32603,
            message: bindCheckRes.result
          },
          'id:': id
        }
        return result
      }
    }
  } else {
    result = {
      'jsonrpc:': jsonrpc,
      error: {
        code: -32602,
        message: connectRes.result
      },
      'id:': id
    }
    return result
  }

  // else if(method ==="getSeid"){return deviceManger.getSeid()}
  // else if(method ==="getSn"){ return deviceManger.getSn()}
  // else if(method ==="getRamSize"){ return deviceManger.getRamSize()}
  // else if(method ==="getFirmwareVersion"){ return deviceManger.getFirmwareVersion()}
  // else if(method ==="activeDevice"){ return deviceManger.activeDevice()}
  // else if(method ==="checkDevice"){ return deviceManger.checkDevice()}
  // else if(method ==="checkUpdate"){ return deviceManger.checkUpdate()}
  // else if(method ==="downloadApplet"){ return deviceManger.downloadApplet()}
  // else if(method ==="updateApplet"){ return deviceManger.updateApplet()}
  // else if(method ==="deleteApplet"){ return deviceManger.deleteApplet()}
  // else if(method ==="deviceBindCheck"){return deviceManger.deviceBindCheck()}
  if (method === constants.API_NAME_TRANSACTION_BTC) {
    const response = walletApi.btcSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_BTC_SEGWIT) {
    const response = walletApi.btcSegWitSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_BTC_USDT) {
    const response = walletApi.btcUsdtSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_BTC_USDT_SEGWIT) {
    const response = walletApi.btcUsdtSegWitSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_BCH) {
    const response = walletApi.bchSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_LTC) {
    const response = walletApi.ltcSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_ETH) {
    const response = walletApi.ethSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNMSG_ETH) {
    const response = walletApi.ethSignMessage(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: {
          signature: response.result.getSignature()
        },
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_EOS) {
    const response = walletApi.eosSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
      return result
    } else {
      const list = []
      for (let i = 0; i < response.result.length; i++) {
        const hash = response.result[i].getHash()
        const signs = response.result[i].getSignsList()
        result = {
          hash: hash,
          signs: signs
        }
        list.push(result)
      }
      return { 'jsonrpc:': jsonrpc, result: { list }, 'id:': id }
    }
  } else if (method === constants.API_NAME_TRANSACTION_SIGNMSG_EOS) {
    const response = walletApi.eosSignMessage(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: {
          signature: response.result.getSignature()
        },
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_COSMOS) {
    const response = walletApi.cosmosSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_FILECOIN) {
    const response = walletApi.filecoinSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_POLKADOT) {
    const response = walletApi.dotSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_KUSAMA) {
    const response = walletApi.ksmSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_TRON) {
    const response = walletApi.tronSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNMSG_TRON) {
    const response = walletApi.tronSignMessage(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_XTZ) {
    const response = walletApi.xtzSignTransaction(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_BTC_XPUB) {
    const response = walletApi.getBTCXpubApi(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: {
          xpub: response.result
        },
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_BTC) {
    const response = walletApi.getBTCAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_BTC_SEGWIT) {
    const response = walletApi.getBTCSegWitAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_BTC) {
    const response = walletApi.registerBTCAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_BTC_SEGWIT) {
    const response = walletApi.registerBTCSegWitAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_BCH) {
    const response = walletApi.getBCHAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_BCH) {
    const response = walletApi.registerBCHAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_LTC) {
    const response = walletApi.getLTCAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_LTC) {
    const response = walletApi.registerLTCAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_LTC_SEGWIT) {
    const response = walletApi.getLTCSegWitAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_LTC_SEGWIT) {
    const response = walletApi.registerLTCSegWitAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_ETH) {
    const response = walletApi.getETHAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_ETH) {
    const response = walletApi.registerETHAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_PUBKEY_EOS) {
    const response = walletApi.getEOSPubKey(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_PUBKEY_EOS) {
    const response = walletApi.registerEOSPubKey(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_COSMOS) {
    const response = walletApi.getCOSMOSAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_COSMOS) {
    const response = walletApi.registerCOSMOSAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_FILECOIN) {
    const response = walletApi.getFILECOINAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_FILECOIN) {
    const response = walletApi.registerFILECOINAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_POLKADOT) {
    const response = walletApi.getDOTAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_POLKADOT) {
    const response = walletApi.registerDOTAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_KUSAMA) {
    const response = walletApi.getKSMAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_KUSAMA) {
    const response = walletApi.registerKSMAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_TRON) {
    const response = walletApi.getTRONAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_TRON) {
    const response = walletApi.registerTRONAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_GET_ADDRESS_XTZ) {
    const response = walletApi.getXTZAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else if (method === constants.API_NAME_REGISTER_ADDRESS_XTZ) {
    const response = walletApi.registerXTZAddress(params)
    if (!response.isSuccess) {
      result = {
        'jsonrpc:': jsonrpc,
        error: {
          code: -32604,
          message: response.result
        },
        'id:': id
      }
    } else {
      result = {
        'jsonrpc:': jsonrpc,
        result: response.result,
        'id:': id
      }
    }
    return result
  } else {
    result = {
      'jsonrpc:': jsonrpc,
      error: {
        code: -32605,
        message: 'Invalid API key'
      },
      'id:': id
    }
    return result
  }
}
