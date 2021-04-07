import {api} from "./apirouter";

const apiPb = require('../proto/api_pb')
const commonPb = require('../proto/common_pb')
const btcPb = require('../proto/btc_pb')
const btcforkPb = require('../proto/btcfork_pb')
const ethPb = require('../proto/eth_pb')
const eosPb = require('../proto/eos_pb')
const cosmosPb = require('../proto/cosmos_pb')
const filecoinPb = require('../proto/filecoin_pb')
const tronPb = require('../proto/tron_pb')
const substratePb = require('../proto/substrate_pb')
const callImKeyCore = require('./callimkeycore')
const constants = require('../config/constants')

function btcSignTransactionCallImKeyApi (json) {
  let utxos = []
  utxos = json.utxo
  const btcTxInput = new btcPb.BtcTxInput()
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
    btcTxInput.addUnspents(utxo)
  }
  const btcTxExtra = new btcPb.BtcTxExtra()
  if (typeof (json.extra) === 'undefined') {
  }else{
    btcTxExtra.setOpreturn(json.extra.opreturn)
    btcTxExtra.setPropertyid(json.extra.propertyId)
    btcTxExtra.setFeemode(json.extra.feeMode)
    btcTxInput.setExtra(btcTxExtra)
  }
  btcTxInput.setTo(json.to)
  btcTxInput.setAmount(json.amount)
  btcTxInput.setFee(json.fee)
  if (typeof (json.protocol) === 'undefined') {
  } else {
    if (json.protocol !== '' || json.protocol !== null) {
      btcTxInput.setProtocol(json.protocol)
    }
  }
  if (typeof (json.segWit) === 'undefined') {
  } else {
    if (json.segWit !== '' || json.segWit !== null) {
      btcTxInput.setSegwit(json.segWit)
    }
  }

  if (typeof (json.changeAddressIndex) === 'undefined') {
  } else {
    if (json.changeAddressIndex !== '' || json.changeAddressIndex !== null) {
      btcTxInput.setChangeAddressIndex(json.changeAddressIndex)
    }
  }
  const btcTxReqBytes = btcTxInput.serializeBinary()
  const inputAny = new proto.google.protobuf.Any()
  inputAny.setValue(btcTxReqBytes)
  const signParam = new commonPb.SignParam()
  signParam.setChaintype('BITCOIN')
  signParam.setPath(json.path)
  signParam.setNetwork(json.network)
  signParam.setInput(inputAny)
  if (typeof (json.preview) === 'undefined') {

  }else{
    signParam.setPayment(json.preview.payment)
    signParam.setReceiver(json.preview.receiver)
    signParam.setSender(json.preview.sender)
    signParam.setFee(json.preview.fee)
  }
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_tx')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new btcPb.BtcTxOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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
function btcForkSignTransactionCallImKeyApi (json,chainType) {
  let utxos = []
  utxos = json.utxo
  const btcForkTxInput = new btcforkPb.BtcForkTxInput()
  for (let i = 0; i < utxos.length; i++) {
    const utxo = new btcforkPb.Utxo()
    const utxoObj = utxos[i]
    utxo.setTxhash(utxoObj.txHash)
    utxo.setVout(utxoObj.vout)
    utxo.setAmount(utxoObj.amount)
    utxo.setAddress(utxoObj.address)
    utxo.setScriptpubkey(utxoObj.scriptPubkey)
    utxo.setDerivedpath(utxoObj.derivedPath)
    utxo.setSequence(utxoObj.sequence)
    btcForkTxInput.addUnspents(utxo)
  }
  btcForkTxInput.setTo(json.to)
  btcForkTxInput.setAmount(json.amount)
  btcForkTxInput.setFee(json.fee)

  if (typeof (json.segWit) === 'undefined') {
  } else {
    if (json.segWit !== '' || json.segWit !== null) {
      btcForkTxInput.setSegwit(json.segWit)
    }
  }

  if (typeof (json.changeAddressIndex) === 'undefined') {
  } else {
    if (json.changeAddressIndex !== '' || json.changeAddressIndex !== null) {
      btcForkTxInput.setChangeaddressindex(json.changeAddressIndex)
    }
  }
  if (typeof (json.changeAddress) === 'undefined') {
  } else {
    if (json.changeAddress !== '' || json.changeAddress !== null) {
      btcForkTxInput.setChangeaddress(json.changeAddress)
    }
  }
  const btcForkReqBytes = btcForkTxInput.serializeBinary()
  const inputAny = new proto.google.protobuf.Any()
  inputAny.setValue(btcForkReqBytes)
  const signParam = new commonPb.SignParam()
  signParam.setChaintype(chainType)
  signParam.setPath(json.path)
  signParam.setNetwork(json.network)
  signParam.setInput(inputAny)
  if (typeof (json.preview) === 'undefined') {

  }else{
    signParam.setPayment(json.preview.payment)
    signParam.setReceiver(json.preview.receiver)
    signParam.setSender(json.preview.sender)
    signParam.setFee(json.preview.fee)
  }
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_tx')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new btcforkPb.BtcForkTxOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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
function ethSignTransactionCallImKeyApi (json) {
  const transaction = json.transaction
  const preview = json.preview
  const ethTxInput = new ethPb.EthTxInput()
  ethTxInput.setNonce(transaction.nonce.toString())
  ethTxInput.setGasPrice(transaction.gasPrice.toString())
  ethTxInput.setGasLimit(transaction.gasLimit.toString())
  ethTxInput.setTo(transaction.to)
  ethTxInput.setValue(transaction.value.toString())
  ethTxInput.setData(transaction.data)
  ethTxInput.setChainId(transaction.chainId.toString())
  const ethTxInputBytes = ethTxInput.serializeBinary()
  const ethTxInputAny = new proto.google.protobuf.Any()
  ethTxInputAny.setValue(ethTxInputBytes)

  const signParam = new commonPb.SignParam()
  signParam.setChaintype('ETHEREUM')
  signParam.setPath(transaction.path)
  signParam.setInput(ethTxInputAny)
  signParam.setPayment(preview.payment)
  signParam.setReceiver(preview.receiver)
  signParam.setSender(preview.sender)
  signParam.setFee(preview.fee)
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)

  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_tx')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new ethPb.EthTxOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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

function ethSignMessageCallImKeyApi (json) {
  const ethMessageInput = new ethPb.EthMessageInput()
  ethMessageInput.setMessage(json.data)
  ethMessageInput.setIspersonalsign(json.isPersonalSign)
  const ethMessageInputBytes = ethMessageInput.serializeBinary()

  const ethMessageInputAny = new proto.google.protobuf.Any()
  ethMessageInputAny.setValue(ethMessageInputBytes)

  const signParam = new commonPb.SignParam()
  signParam.setChaintype('ETHEREUM')
  signParam.setPath(json.path)
  signParam.setInput(ethMessageInputAny)
  signParam.setSender(json.sender)
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)

  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_message')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new ethPb.EthMessageOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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
  const eosMessageInput = new eosPb.EosMessageInput()
  eosMessageInput.setData(json.data)
  eosMessageInput.setIshex(json.isHex)
  eosMessageInput.setPubkey(json.publicKey)
  const eosMessageInputBytes = eosMessageInput.serializeBinary()
  const eosMessageInputAny = new proto.google.protobuf.Any()
  eosMessageInputAny.setValue(eosMessageInputBytes)

  const signParam = new commonPb.SignParam()
  signParam.setChaintype('EOS')
  signParam.setPath(json.path)
  signParam.setInput(eosMessageInputAny)
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)

  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_message')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new eosPb.EosMessageOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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
    eosSignData.addPublickeys(publicKeys[i].publicKey)
  }
  eosSignData.setTxhex(txData)
  eosSignData.setChainid(chainId)
  eosSignData.setReceiver(preview.receiver)
  eosSignData.setSender(preview.sender)
  eosSignData.setPayment(preview.payment)
  const eosTxInput = new eosPb.EosTxInput()
  eosTxInput.addTransactions(eosSignData)


  const eosTxInputBytes = eosTxInput.serializeBinary()
  const eosTxInputAny = new proto.google.protobuf.Any()
  eosTxInputAny.setValue(eosTxInputBytes)
  const signParam = new commonPb.SignParam()
  signParam.setChaintype('EOS')
  signParam.setPath(json.path)
  signParam.setInput(eosTxInputAny)
  signParam.setPayment(preview.payment)
  signParam.setReceiver(preview.receiver)
  signParam.setSender(preview.sender)
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_tx')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new eosPb.EosTxOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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
  const amountList = json.fee.amount
  for (let i = 0; i < amountList.length; i++) {
    const coin = new cosmosPb.Coin()
    coin.setAmount(amountList[i].amount)
    coin.setDenom(amountList[i].denom)
    stdFee.addAmount(coin)
  }
  stdFee.setGas(json.fee.gas)
  const cosmosTxInput = new cosmosPb.CosmosTxInput()
  cosmosTxInput.setMsgs(JSON.stringify(json.msg))
  cosmosTxInput.setFee(stdFee)
  cosmosTxInput.setAccountNumber(json.accountNumber)
  cosmosTxInput.setChainId(json.chainId)
  cosmosTxInput.setMemo(json.memo)
  cosmosTxInput.setSequence(json.sequence)
  const cosmosTxInputBytes = cosmosTxInput.serializeBinary()
  const cosmosTxInputAny = new proto.google.protobuf.Any()
  cosmosTxInputAny.setValue(cosmosTxInputBytes)


  const signParam = new commonPb.SignParam()
  signParam.setChaintype('COSMOS')
  signParam.setPath(json.path)
  signParam.setInput(cosmosTxInputAny)
  signParam.setPayment(json.preview.payment)
  signParam.setReceiver(json.preview.receiver)
  signParam.setSender(json.preview.sender)
  signParam.setFee(json.preview.fee)
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)

  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_tx')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new cosmosPb.CosmosTxOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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

function filecoinSignTransactionCallImKeyApi (json) {
  const filecoinTxInput = new filecoinPb.FilecoinTxInput()
  filecoinTxInput.setTo(json.to)
  filecoinTxInput.setFrom(json.from)
  filecoinTxInput.setNonce(json.nonce)
  filecoinTxInput.setValue(json.value)
  filecoinTxInput.setGaslimit(json.gasLimit)
  filecoinTxInput.setGasfeecap(json.gasFeeCap)
  filecoinTxInput.setGaspremium(json.gasPremium)
  filecoinTxInput.setMethod(json.method)
  filecoinTxInput.setParams(json.params)
  const filecoinTxInputBytes = filecoinTxInput.serializeBinary()
  const filecoinTxInputAny = new proto.google.protobuf.Any()
  filecoinTxInputAny.setValue(filecoinTxInputBytes)
  const signParam = new commonPb.SignParam()
  signParam.setChaintype('FILECOIN')
  signParam.setPath(json.path)
  signParam.setInput(filecoinTxInputAny)
  signParam.setPayment(json.preview.payment)
  signParam.setReceiver(json.preview.receiver)
  signParam.setSender(json.preview.sender)
  signParam.setFee(json.preview.fee)
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_tx')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new filecoinPb.FilecoinTxOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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
function substrateSignTransactionCallImKeyApi (json,chainType) {
  const substrateRawTxIn = new substratePb.SubstrateRawTxIn()
  console.log(json)
  console.log("json.rawdata:"+json.rawdata)
  substrateRawTxIn.setRawdata(json.rawdata)
  const substrateRawTxInBytes = substrateRawTxIn.serializeBinary()
  const substrateRawTxInAny = new proto.google.protobuf.Any()
  substrateRawTxInAny.setValue(substrateRawTxInBytes)
  const signParam = new commonPb.SignParam()
  signParam.setChaintype(chainType)
  signParam.setPath(json.path)
  signParam.setInput(substrateRawTxInAny)
  if(json.preview!==null && (typeof json.preview !=='undefined')){
    signParam.setPayment(json.preview.payment)
    signParam.setReceiver(json.preview.receiver)
    signParam.setSender(json.preview.sender)
    signParam.setFee(json.preview.fee)
  }
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_tx')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new substratePb.SubstrateTxOut.deserializeBinary(hexStr2Bytes(resBuffer))
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
function tronSignTransactionCallImKeyApi (json) {
  const tronTxInput = new tronPb.TronTxInput()
  tronTxInput.setRawData(json.rawdata)
  const tronTxInputBytes = tronTxInput.serializeBinary()
  const tronTxInputAny = new proto.google.protobuf.Any()
  tronTxInputAny.setValue(tronTxInputBytes)
  const signParam = new commonPb.SignParam()
  signParam.setChaintype('TRON')
  signParam.setPath(json.path)
  signParam.setInput(tronTxInputAny)
  signParam.setPayment(json.preview.payment)
  signParam.setReceiver(json.preview.receiver)
  signParam.setSender(json.preview.sender)
  signParam.setFee(json.preview.fee)
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_tx')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new tronPb.TronTxOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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
function tronSignMessageCallImKeyApi (json) {
  const tronMessageInput = new tronPb.TronMessageInput()
  tronMessageInput.setMessage(json.message)
  tronMessageInput.setIsHex(json.isHex)
  tronMessageInput.setIsTronHeader(json.isTronHeader)
  const tronMessageInputBytes = tronMessageInput.serializeBinary()
  const tronMessageInputAny = new proto.google.protobuf.Any()
  tronMessageInputAny.setValue(tronMessageInputBytes)
  const signParam = new commonPb.SignParam()
  signParam.setChaintype('TRON')
  signParam.setPath(json.path)
  signParam.setSender(json.sender)
  signParam.setInput(tronMessageInputAny)
  const signParamBytes = signParam.serializeBinary()
  const signParamAny = new proto.google.protobuf.Any()
  signParamAny.setValue(signParamBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('sign_message')
  imKeyAction.setParam(signParamAny)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new tronPb.TronMessageOutput.deserializeBinary(hexStr2Bytes(resBuffer))
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
export function btcSignTransaction (json) {
  return btcSignTransactionCallImKeyApi(json)
}

export function btcSegWitSignTransaction (json) {
  return btcSignTransactionCallImKeyApi(json)
}

export function btcUsdtSignTransaction (json) {
  return btcSignTransactionCallImKeyApi(json)
}

export function btcUsdtSegWitSignTransaction (json) {
  return btcSignTransactionCallImKeyApi(json )
}
export function bchSignTransaction (json) {
  return btcForkSignTransactionCallImKeyApi(json,'BITCOINCASH')
}
export function ltcSignTransaction (json) {
  return btcForkSignTransactionCallImKeyApi(json,'LITECOIN')
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
export function filecoinSignTransaction (json) {
  return filecoinSignTransactionCallImKeyApi(json)
}
export function dotSignTransaction (json) {
  return substrateSignTransactionCallImKeyApi(json,'POLKADOT')
}
export function ksmSignTransaction (json) {
  return substrateSignTransactionCallImKeyApi(json,'KUSAMA')
}
export function tronSignTransaction (json) {
  return tronSignTransactionCallImKeyApi(json)
}
export function tronSignMessage (json) {
  return tronSignMessageCallImKeyApi(json)
}
export function xtzSignTransaction (json) {
  return filecoinSignTransactionCallImKeyApi(json)
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
