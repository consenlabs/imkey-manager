const apiPb = require('../proto/api_pb')
const btcPb = require('../proto/btc_pb')
const ethPb = require('../proto/eth_pb')
const eosPb = require('../proto/eos_pb')
const cosmosPb = require('../proto/cosmos_pb')
const callImKeyCore = require('./callimkeycore')
const constants = require('../common/constants')
const path = require('../common/path')

function btcSignTransactionCallImKeyApi (json, method_) {
  let utxos = []
  utxos = json.utxo
  const btcTxReq = new btcPb.BtcTxReq()
  for (let i = 0; i < utxos.length; i++) {
    const utxo = new btcPb.Utxo()
    const utxoObj = utxos[i]
    utxo.setTxHash(utxoObj.txHash)
    utxo.setVout(utxoObj.vout)
    utxo.setAmount(utxoObj.amount)
    utxo.setAddress(utxoObj.address)
    utxo.setScriptPubkey(utxoObj.scriptPubkey)
    utxo.setDerivedPath(utxoObj.derivedPath)
    utxo.setSequence(utxoObj.sequence)
    btcTxReq.addUnspents(utxo)
  }
  btcTxReq.setTo(json.to)
  btcTxReq.setAmount(json.amount)
  btcTxReq.setFee(json.fee)
  if (typeof (json.changeAddressIndex) === 'undefined') {
  } else {
    if (json.changeAddressIndex !== '' || json.changeAddressIndex !== null) {
      btcTxReq.setChangeAddressIndex(json.changeAddressIndex)
    }
  }
  if (typeof (json.extraData) === 'undefined') {

  } else {
    if (json.extraData !== '' || json.extraData !== null) {
      btcTxReq.setExtraData(Buffer.from(json.extraData, 'hex'))
    }
  }
  if (typeof (json.propertyId) === 'undefined') {

  } else {
    if (json.propertyId !== '' || json.propertyId !== null) {
      btcTxReq.setPropertyId(json.propertyId)
    }
  }
  btcTxReq.setNetwork(json.network)
  btcTxReq.setPathPrefix(json.pathPrefix)
  const btcTxReqBytes = btcTxReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(btcTxReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new btcPb.BtcTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function btcSegWitSignTransactionCallImKeyApi (json, method_) {
  let utxos = []
  utxos = json.utxo
  const btcSegwitTxReq = new btcPb.BtcSegwitTxReq()
  for (let i = 0; i < utxos.length; i++) {
    const utxo = new btcPb.Utxo()
    const utxoObj = utxos[i]
    utxo.setTxHash(utxoObj.txHash)
    utxo.setVout(utxoObj.vout)
    utxo.setAmount(utxoObj.amount)
    utxo.setAddress(utxoObj.address)
    utxo.setScriptPubkey(utxoObj.scriptPubkey)
    utxo.setDerivedPath(utxoObj.derivedPath)
    utxo.setSequence(utxoObj.sequence)
    btcSegwitTxReq.addUnspents(utxo)
  }
  btcSegwitTxReq.setTo(json.to)
  btcSegwitTxReq.setAmount(json.amount)
  btcSegwitTxReq.setFee(json.fee)
  if (typeof (json.changeAddressIndex) === 'undefined') {

  } else {
    if (json.changeAddressIndex !== '' || json.changeAddressIndex !== null) {
      btcSegwitTxReq.setChangeAddressIndex(json.changeAddressIndex)
    }
  }
  if (typeof (json.extraData) === 'undefined') {

  } else {
    if (json.extraData !== '' || json.extraData !== null) {
      btcSegwitTxReq.setExtraData(Buffer.from(json.extraData, 'hex'))
    }
  }
  if (typeof (json.propertyId) === 'undefined') {

  } else {
    if (json.propertyId !== '' || json.propertyId !== null) {
      btcSegwitTxReq.setPropertyId(json.propertyId)
    }
  }
  btcSegwitTxReq.setNetwork(json.network)
  btcSegwitTxReq.setPathPrefix(json.pathPrefix)
  const btcSegwitTxReqBytes = btcSegwitTxReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(btcSegwitTxReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new btcPb.BtcSegwitTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function ethSignTransactionCallImKeyApi (json) {
  const transaction = json.transaction
  const preview = json.preview
  const ethTxReq = new ethPb.EthTxReq()
  ethTxReq.setNonce(transaction.nonce.toString())
  ethTxReq.setGasPrice(transaction.gasPrice.toString())
  ethTxReq.setGasLimit(transaction.gasLimit.toString())
  ethTxReq.setTo(transaction.to)
  ethTxReq.setValue(transaction.value.toString())
  ethTxReq.setData(transaction.data)
  ethTxReq.setChainId(transaction.chainId.toString())
  ethTxReq.setPayment(preview.payment)
  ethTxReq.setReceiver(preview.receiver)
  ethTxReq.setSender(preview.sender)
  ethTxReq.setFee(preview.fee)
  ethTxReq.setPath(path.ETH_LEDGER)
  const ethTxReqBytes = ethTxReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(ethTxReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('eth_tx_sign')
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new ethPb.EthTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function ethSignMessageCallImKeyApi (json) {
  const ethMessageSignReq = new ethPb.EthMessageSignReq()
  ethMessageSignReq.setPath(json.path)
  ethMessageSignReq.setMessage(json.data)
  ethMessageSignReq.setSender(json.sender)
  const ethMessageSignReqBytes = ethMessageSignReq.serializeBinary()

  const any = new proto.google.protobuf.Any()
  any.setValue(ethMessageSignReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('eth_message_sign')
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new ethPb.EthMessageSignRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function eosSignMessageCallImKeyApi (json) {
  const eosMessageSignReq = new eosPb.EosMessageSignReq()
  eosMessageSignReq.setPath(json.path)
  eosMessageSignReq.setData(json.data)
  eosMessageSignReq.setIsHex(json.isHex)
  eosMessageSignReq.setPubkey(json.publicKey)
  const eosMessageSignReqBytes = eosMessageSignReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(eosMessageSignReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('eos_message_sign')
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new eosPb.EosMessageSignRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function eosSignTransactionCallImKeyApi (json) {
  const publicKeys = json.publicKeys
  const chainId = json.chainId
  const txData = json.txData
  const preview = json.preview
  const eosSignData = new eosPb.EosSignData()
  for (let i = 0; i < publicKeys.length; i++) {
    eosSignData.addPubKeys(publicKeys[i].publicKey)
  }
  eosSignData.setTxData(txData)
  eosSignData.setChainId(chainId)
  eosSignData.setTo(preview.to)
  eosSignData.setFrom(preview.from)
  eosSignData.setPayment(preview.payment)
  const eosTxReq = new eosPb.EosTxReq()
  eosTxReq.setPath(json.path)
  eosTxReq.addSignDatas(eosSignData)
  const eosTxReqbytes = eosTxReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(eosTxReqbytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('eos_tx_sign')
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new eosPb.EosTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    const list = response.getTransMultiSignsList()
    const resultList = []
    for (let i = 0; i < list.length; i++) {
      resultList.push(list[i])
    }
    return {
      isSuccess: true,
      result: resultList
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function cosmosSignTransactionCallImKeyApi (json) {
  const stdFee = new cosmosPb.StdFee()
  const signData = new cosmosPb.SignData()
  const amountList = json.fee.amount
  for (let i = 0; i < amountList.length; i++) {
    const coin = new cosmosPb.Coin()
    coin.setAmount(amountList[i].amount)
    coin.setDenom(amountList[i].denom)
    stdFee.addAmount(coin)
  }
  stdFee.setGas(json.fee.gas)
  signData.setMsgs(JSON.stringify(json.msg))
  signData.setFee(stdFee)
  signData.setAccountNumber(json.accountNumber)
  signData.setChainId(json.chainId)
  signData.setMemo(json.memo)
  signData.setSequence(json.sequence)
  const cosmosTxReq = new cosmosPb.CosmosTxReq()
  cosmosTxReq.setPath(json.path)
  cosmosTxReq.setSigndata(signData)
  cosmosTxReq.setPaymentDis(json.preview.paymentDis)
  cosmosTxReq.setToDis(json.preview.toDis)
  cosmosTxReq.setFromDis(json.preview.fromDis)
  cosmosTxReq.setFeeDis(json.preview.feeDis)
  const cosmosTxReqBytes = cosmosTxReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(cosmosTxReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('cosmos_tx_sign')
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new cosmosPb.CosmosTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

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

function btcAddress (path, netWork, method_) {
  const btcAddressReq = new btcPb.BtcAddressReq()
  btcAddressReq.setPath(path)
  btcAddressReq.setNetwork(netWork)
  const btcAddressReqBytes = btcAddressReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(btcAddressReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new btcPb.BtcAddressRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response.getAddress()
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function ethAddress (path, method_) {
  const ethAddressReq = new ethPb.EthAddressReq()
  ethAddressReq.setPath(path)
  const ethAddressReqBytes = ethAddressReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(ethAddressReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new ethPb.EthAddressRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response.getAddress()
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function eosPubkey (path, method_) {
  const eosPubkeyReq = new eosPb.EosPubkeyReq()
  eosPubkeyReq.setPath(path)
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
    const response = new eosPb.EosPubkeyRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response.getPubkey()
    }
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return {
      isSuccess: false,
      result: errorResponse.getError()
    }
  }
}

function cosmosAddress (path, method_) {
  const cosmosAddressReq = new cosmosPb.CosmosAddressReq()
  cosmosAddressReq.setPath(path)
  const cosmosAddressReqBytes = cosmosAddressReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(cosmosAddressReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new cosmosPb.CosmosAddressRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return {
      isSuccess: true,
      result: response.getAddress()
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
  return btcAddress(json.path, json.network, 'btc_get_address')
}

export function registerBTCAddress (json) {
  return btcAddress(json.path, json.network, 'btc_register_address')
}

export function getBTCSegWitAddress (json) {
  return btcAddress(json.path, json.network, 'btc_get_setwit_address')
}

export function registerBTCSegWitAddress (json) {
  return btcAddress(json.path, json.network, 'btc_register_segwit_address')
}

export function getCOSMOSAddress (json) {
  return cosmosAddress(json.path, 'cosmos_get_address')
}

export function registerCOSMOSAddress (json) {
  return cosmosAddress(json.path, 'cosmos_register_address')
}

export function getEOSPubKey (json) {
  return eosPubkey(json.path, 'eos_get_pubkey')
}

export function registerEOSPubKey (json) {
  return eosPubkey(json.path, 'eos_register_pubkey')
}

export function getETHAddress (json) {
  return ethAddress(json.path, 'eth_get_address')
}

export function registerETHAddress (json) {
  return ethAddress(json.path, 'eth_register_address')
}

export function btcSignTransaction (json) {
  return btcSignTransactionCallImKeyApi(json, 'btc_tx_sign')
}

export function btcSegWitSignTransaction (json) {
  return btcSegWitSignTransactionCallImKeyApi(json, 'btc_segwit_tx_sign')
}

export function btcUsdtSignTransaction (json) {
  return btcSignTransactionCallImKeyApi(json, 'btc_usdt_tx_sign')
}

export function btcUsdtSegWitSignTransaction (json) {
  return btcSegWitSignTransactionCallImKeyApi(json, 'btc_usdt_segwit_tx_sign')
}

export function ethSignTransaction (json) {
  return ethSignTransactionCallImKeyApi(json)
}

export function ethSignMessage (json) {
  return ethSignMessageCallImKeyApi(json)
}

export function eosSignTransaction (json) {
  return eosSignTransactionCallImKeyApi(json)
}

export function eosSignMessage (json) {
  return eosSignMessageCallImKeyApi(json)
}

export function cosmosSignTransaction (json) {
  return cosmosSignTransactionCallImKeyApi(json)
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
