const apiPb = require('../proto/api_pb')
const btcPb = require('../proto/btc_pb')
const callImKeyCore = require('./callimkeycore')
const constants = require('../common/constants')

function btcXpub (path, netWork) {
  const btcXpubReq = new btcPb.BtcXpubReq()
  btcXpubReq.setPath(path)
  btcXpubReq.setNetwork(netWork)
  const btcXpubReqBytes = btcXpubReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(btcXpubReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('btc_get_xpub')
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new btcPb.BtcXpubRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response.getXpub()
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}


function eosPubkey (chainType,path, network,isSegWit,method_) {
  const eosPubkeyReq = new apiPb.PubKeyParam()
  eosPubkeyReq.setChaintype(chainType)
  eosPubkeyReq.setPath(path)
  eosPubkeyReq.setNetwork(network)
  eosPubkeyReq.setIssegwit(isSegWit)
  const eosPubkeyReqBytes = eosPubkeyReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(eosPubkeyReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new apiPb.EosWallet.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response.toObject()
      }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function address (chainType,path, network,isSegWit,method_) {
  const AddressReq = new apiPb.AddressParam()
  AddressReq.setChaintype(chainType)
  AddressReq.setPath(path)
  AddressReq.setNetwork(network)
  AddressReq.setIssegwit(isSegWit)
  const AddressReqBytes = AddressReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(AddressReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    if(chainType === 'BITCOIN' && method_ === 'get_address'){
      const response = new apiPb.BitcoinWallet.deserializeBinary(hexStr2Bytes(resBuffer))
      return {
        isSuccess: true,
        result: response.toObject()
      }
    }else{
      const response = new apiPb.AddressResult.deserializeBinary(hexStr2Bytes(resBuffer))
      return {
        isSuccess: true,
        result: response.toObject()
      }
    }

  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

export function getBTCXpub () {
  return btcXpub("m/44'/0'/0'/0/0", constants.MAINNET)
}

export function getBTCXpubApi (json) {
  return btcXpub(json.path, json.network)
}

export function getBTCAddress (json) {
  return address('BITCOIN',json.path, json.network, false,'get_address')
}

export function registerBTCAddress (json) {
  return address('BITCOIN',json.path, json.network, false, 'register_address')
}

export function getBTCSegWitAddress (json) {
  return address('BITCOIN',json.path, json.network, true,'get_address')
}

export function registerBTCSegWitAddress (json) {
  return address('BITCOIN',json.path, json.network, true, 'register_address')
}
export function getBCHAddress (json) {
  return address('BITCOINCASH',json.path, json.network, false,'get_address')
}

export function registerBCHAddress (json) {
  // return address('BITCOINCASH',json.path, json.network, false, 'register_address')
  return {
    isSuccess: true,
    result: ''
  }
}

export function getBCHSegWitAddress (json) {
  return address('BITCOINCASH',json.path, json.network, true,'get_address')
}

export function registerBCHSegWitAddress (json) {
  // return address('BITCOINCASH',json.path, json.network, true, 'register_address')
  return {
    isSuccess: true,
    result: ''
  }
}
export function getLTCAddress (json) {
  return address('LITECOIN',json.path, json.network, false,'get_address')
}

export function registerLTCAddress (json) {
  // return address('LITECOIN',json.path, json.network, false, 'register_address')
  return {
    isSuccess: true,
    result: ''
  }
}

export function getLTCSegWitAddress (json) {
  return address('LITECOIN',json.path, json.network, true,'get_address')
}

export function registerLTCSegWitAddress (json) {
  // return address('LITECOIN',json.path, json.network, true, 'register_address')
  return {
    isSuccess: true,
    result: ''
  }
}
export function getCOSMOSAddress (json) {
  return address('COSMOS',json.path, '', false,'get_address')
}

export function registerCOSMOSAddress (json) {
  return address('COSMOS',json.path, '', false, 'register_address')
}

export function getEOSPubKey (json) {
  return eosPubkey('EOS',json.path, '', false,'get_pub_key')
}

export function registerEOSPubKey (json) {
  return eosPubkey('EOS',json.path, '', false,'register_pub_key')
}

export function getETHAddress (json) {
  return address('ETHEREUM',json.path, '', false,'get_address')
}

export function registerETHAddress (json) {
  return address('ETHEREUM',json.path, '', false,'register_address')
}

export function getFILECOINAddress (json) {
  return address('FILECOIN',json.path, '', false,'get_address')
}

export function registerFILECOINAddress (json) {
  return address('FILECOIN',json.path, '', false,'register_address')
}
export function getDOTAddress (json) {
  return address('POLKADOT',json.path, '', false,'get_address')
}

export function registerDOTAddress (json) {
  return address('POLKADOT',json.path, '', false,'register_address')
}
export function getKSMAddress (json) {
  return address('KUSAMA',json.path, '', false,'get_address')
}

export function registerKSMAddress (json) {
  return address('KUSAMA',json.path, '', false,'register_address')
}
export function getTRONAddress (json) {
  return address('TRON',json.path, '', false,'get_address')
}

export function registerTRONAddress (json) {
  return address('TRON',json.path, '', false,'register_address')
}
export function getXTZAddress (json) {
  return address('XTZ',json.path, '', false,'get_address')
}

export function registerXTZAddress (json) {
  return address('XTZ',json.path, '', false,'register_address')
}
// /**
//  *  @desc 二进制数组转字符串
//  * @param arr
//  * @returns {string}
//  */
// function bytes2Str (arr) {
//   let str = ''
//   for (let i = 0; i < arr.length; i++) {
//     const tmp = String.fromCharCode(arr[i])
//     // if (tmp.length === 1){
//     //     tmp = "0" + tmp;
//     // }
//     str += tmp
//   }
//   return str
// }

/**
 * @desc 二进制数组转十六进制字符串
 * @param arr
 * @returns {string}
 */
function bytes2HexStr (arr) {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    let tmp = arr[i].toString(16)
    if (tmp.length === 1) {
      tmp = '0' + tmp
    }
    str += tmp
  }
  return str
}

/**
 * @desc 十六进制字符串转二进制数组
 * @param str
 * @returns {any[]|null}
 */
function hexStr2Bytes (str) {
  let pos = 0
  let len = str.length
  if (len % 2 !== 0) {
    return null
  }
  len /= 2
  const hexA = new Array()
  for (let i = 0; i < len; i++) {
    const s = str.substr(pos, 2)
    const v = parseInt(s, 16)
    hexA.push(v)
    pos += 2
  }
  return hexA
}
