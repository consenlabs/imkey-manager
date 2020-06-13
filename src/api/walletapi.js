let api_pb = require('../proto/api_pb')
let btc_pb = require('../proto/btc_pb')
let eth_pb = require('../proto/eth_pb')
let eos_pb = require('../proto/eos_pb')
let cosmos_pb = require('../proto/cosmos_pb')
let callImKeyCore = require('./callimkeycore')
let constants = require('../common/constants')
let path = require('../common/path')

function IBitcoinTransaction_BTC (json, method_) {
  let utxos = json.utxo
  let btcTxReq = new btc_pb.BtcTxReq()
  for (let i = 0; i < utxos.length; i++) {
    let utxo = new btc_pb.Utxo()
    let utxoObj = utxos[i]
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
  btcTxReq.setChangeAddressIndex(json.changeAddressIndex)
  if (json.extraData != null || json.extraData != null) {
    btcTxReq.setExtraData(new Buffer(json.extraData, 'hex'))
  }
  if (json.propertyId != null || json.propertyId != null) {
    btcTxReq.setPropertyId(json.propertyId)
  }
  btcTxReq.setNetwork(json.network)
  btcTxReq.setPathPrefix(json.pathPrefix)
  let btcTxReqBytes = btcTxReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(btcTxReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new btc_pb.BtcTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return response
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function IBitcoinTransaction_BTC_SEGWIT (json, method_) {
  let utxos = json.utxo
  let btcSegwitTxReq = new btc_pb.BtcSegwitTxReq()
  for (let i = 0; i < utxos.length; i++) {
    let utxo = new btc_pb.Utxo()
    let utxoObj = utxos[i]
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
  btcSegwitTxReq.setChangeAddressIndex(json.changeAddressIndex)
  if (json.extraData != null || json.extraData != null) {
    btcSegwitTxReq.setExtraData(new Buffer(json.extraData, 'hex'))
  }
  if (json.propertyId != null || json.propertyId != null) {
    btcSegwitTxReq.setPropertyId(json.propertyId)
  }
  btcSegwitTxReq.setNetwork(json.network)
  btcSegwitTxReq.setPathPrefix(json.pathPrefix)
  let btcSegwitTxReqBytes = btcSegwitTxReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(btcSegwitTxReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new btc_pb.BtcSegwitTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return response
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function IETHTransaction_sign_TX (json) {
  let transaction = json.transaction
  let preview = json.preview
  let ethTxReq = new eth_pb.EthTxReq()
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
  let ethTxReqBytes = ethTxReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(ethTxReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod('eth_tx_sign')
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new eth_pb.EthTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return response
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function IETHTransaction_sign_MSG (json) {
  let ethMessageSignReq = new eth_pb.EthMessageSignReq()
  ethMessageSignReq.setPath(json.path)
  ethMessageSignReq.setMessage(json.data)
  ethMessageSignReq.setSender(json.sender)
  let ethMessageSignReqBytes = ethMessageSignReq.serializeBinary()

  let any = new proto.google.protobuf.Any()
  any.setValue(ethMessageSignReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod('eth_message_sign')
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new eth_pb.EthMessageSignRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return response
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function IEOSTransaction_sign_MSG (json) {
  let eosMessageSignReq = new eos_pb.EosMessageSignReq()
  eosMessageSignReq.setPath(json.path)
  eosMessageSignReq.setData(json.data)
  eosMessageSignReq.setIsHex(json.isHex)
  eosMessageSignReq.setPubkey(json.publicKey)
  let eosMessageSignReqBytes = eosMessageSignReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(eosMessageSignReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod('eos_message_sign')
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new eos_pb.EosMessageSignRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return response
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function IEOSTransaction_sign_TX (json) {
  let publicKeys = json.publicKeys
  let chainId = json.chainId
  let txData = json.txData
  let preview = json.preview
  let eosSignData = new eos_pb.EosSignData()
  for (let i = 0; i < publicKeys.length; i++) {
    eosSignData.addPubKeys(publicKeys[i].publicKey)
  }
  eosSignData.setTxData(txData)
  eosSignData.setChainId(chainId)
  eosSignData.setTo(preview.to)
  eosSignData.setFrom(preview.from)
  eosSignData.setPayment(preview.payment)
  let eosTxReq = new eos_pb.EosTxReq()
  eosTxReq.setPath(json.path)
  eosTxReq.addSignDatas(eosSignData)
  let eosTxReqbytes = eosTxReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(eosTxReqbytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod('eos_tx_sign')
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new eos_pb.EosTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    let list = response.getTransMultiSignsList()
    let resultList = []
    for (let i = 0; i < list.length; i++) {
      resultList.push(list[i])
    }
    return resultList
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function ICOSMOSTransaction_sign_TX (json) {
  let stdFee = new cosmos_pb.StdFee()
  let signData = new cosmos_pb.SignData()
  let amountList = json.fee.amount
  for (let i = 0; i < amountList.length; i++) {
    let coin = new cosmos_pb.Coin()
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
  let cosmosTxReq = new cosmos_pb.CosmosTxReq()
  cosmosTxReq.setPath(json.path)
  cosmosTxReq.setSigndata(signData)
  cosmosTxReq.setPaymentDis(json.preview.paymentDis)
  cosmosTxReq.setToDis(json.preview.toDis)
  cosmosTxReq.setFromDis(json.preview.fromDis)
  cosmosTxReq.setFeeDis(json.preview.feeDis)
  let cosmosTxReqBytes = cosmosTxReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(cosmosTxReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod('cosmos_tx_sign')
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new cosmos_pb.CosmosTxRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return response
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function btcXpub (path, netWork) {
  let btcXpubReq = new btc_pb.BtcXpubReq()
  btcXpubReq.setPath(path)
  btcXpubReq.setNetwork(netWork)
  let btcXpubReqBytes = btcXpubReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(btcXpubReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod('btc_get_xpub')
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new btc_pb.BtcXpubRes.deserializeBinary(hexStr2Bytes(resBuffer))
    let xpub = response.getXpub()
    return xpub
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function BtcAddress (path, netWork, method_) {
  let btcAddressReq = new btc_pb.BtcAddressReq()
  btcAddressReq.setPath(path)
  btcAddressReq.setNetwork(netWork)
  let btcAddressReqBytes = btcAddressReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(btcAddressReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new btc_pb.BtcAddressRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return response.getAddress()
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function ethAddress (path, method_) {
  let ethAddressReq = new eth_pb.EthAddressReq()
  ethAddressReq.setPath(path)
  let ethAddressReqBytes = ethAddressReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(ethAddressReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new eth_pb.EthAddressRes.deserializeBinary(hexStr2Bytes(resBuffer))
    let address = response.getAddress()
    return address
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function eosPubkey (path, method_) {
  let eosPubkeyReq = new eos_pb.EosPubkeyReq()
  eosPubkeyReq.setPath(path)
  let eosPubkeyReqBytes = eosPubkeyReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(eosPubkeyReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new eos_pb.EosPubkeyRes.deserializeBinary(hexStr2Bytes(resBuffer))
    let address = response.getPubkey()
    return address
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function cosmosAddress (path, method_) {
  let cosmosAddressReq = new cosmos_pb.CosmosAddressReq()
  cosmosAddressReq.setPath(path)
  let cosmosAddressReqBytes = cosmosAddressReq.serializeBinary()
  let any = new proto.google.protobuf.Any()
  any.setValue(cosmosAddressReqBytes)
  let imKeyAction = new api_pb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  let imKeyActionBytes = imKeyAction.serializeBinary()
  let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes))
  let error = callImKeyCore.get_last_err_message()
  if (error === '' || error === null) {
    let response = new cosmos_pb.CosmosAddressRes.deserializeBinary(hexStr2Bytes(resBuffer))
    let address = response.getAddress()
    return address
  } else {
    let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

export function getBTCXpub () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: btcXpub("m/44'/0'/0'/0/0", constants.MAINNET)
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function getBTC_Xpub (json) {
  return btcXpub(json.path, json.network)
}

export function getBTC_Address (json) {
  return BtcAddress(json.path, json.network, 'btc_get_address')
}

export function getBTC_RegisterAddress (json) {
  return BtcAddress(json.path, json.network, 'btc_register_address')
}

export function getBTC_SegWitAddress (json) {
  return BtcAddress(json.path, json.network, 'btc_get_setwit_address')
}

export function getBTC_RegisterSegWitAddress (json) {
  return BtcAddress(json.path, json.network, 'btc_register_segwit_address')
}

export function getCOSMOS_Address (json) {
  return cosmosAddress(json.path, 'cosmos_get_address')
}

export function getCOSMOS_RegisterAddress (json) {
  return cosmosAddress(json.path, 'cosmos_register_address')
}

export function getEOS_PubKey (json) {
  return eosPubkey(json.path, 'eos_get_pubkey')
}

export function getEOS_RegisterPubKey (json) {
  return eosPubkey(json.path, 'eos_register_pubkey')
}

export function getETH_Address (json) {
  return ethAddress(json.path, 'eth_get_address')
}

export function getETH_RegisterAddress (json) {
  return ethAddress(json.path, 'eth_register_address')
}

export function BitcoinTransaction_BTC (json) {
  return IBitcoinTransaction_BTC(json, 'btc_tx_sign')
}

export function BitcoinTransaction_BTC_SEGWIT (json) {
  return IBitcoinTransaction_BTC_SEGWIT(json, 'btc_segwit_tx_sign')
}

export function BitcoinTransaction_BTC_USDT (json) {
  return IBitcoinTransaction_BTC(json, 'btc_usdt_tx_sign')
}

export function BitcoinTransaction_BTC_USDT_SEGWIT (json) {
  return IBitcoinTransaction_BTC_SEGWIT(json, 'btc_usdt_segwit_tx_sign')
}

export function ETHTransaction_sign_TX (json) {
  return IETHTransaction_sign_TX(json)
}

export function ETHTransaction_sign_MSG (json) {
  return IETHTransaction_sign_MSG(json)
}

export function EOSTransaction_sign_TX (json) {
  return IEOSTransaction_sign_TX(json)
}

export function EOSTransaction_sign_MSG (json) {
  return IEOSTransaction_sign_MSG(json)
}

export function COSMOSTransaction_sign_TX (json) {
  return ICOSMOSTransaction_sign_TX(json)
}

/**
 *  @desc 二进制数组转字符串
 * @param arr
 * @returns {string}
 */
function bytes2Str (arr) {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    let tmp = String.fromCharCode(arr[i])
    // if (tmp.length === 1){
    //     tmp = "0" + tmp;
    // }
    str += tmp
  }
  return str
}

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
  if (len % 2 != 0) {
    return null
  }
  len /= 2
  let hexA = new Array()
  for (let i = 0; i < len; i++) {
    let s = str.substr(pos, 2)
    let v = parseInt(s, 16)
    hexA.push(v)
    pos += 2
  }
  return hexA
}
