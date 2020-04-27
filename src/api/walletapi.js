// https://blog.csdn.net/spiritring/article/details/61975299
// function getseid() {
//
//     let basepb = require('../proto/base_pb');
//     // console.log(basepb);
//
//     let message = new basepb.SearchRequest();
//     console.log(message);
//
//     message.setName("TS");
//     message.setPassword("123456");
//
//     let bytes = message.serializeBinary();
//     console.log(bytes);
//
//     let message2 = basepb.SearchRequest.deserializeBinary(bytes);
//     console.log(message2);

let api_pb = require('../proto/api_pb');
let btc_pb = require('../proto/btc_pb');
let eth_pb = require('../proto/eth_pb');
let eos_pb = require('../proto/eos_pb');
let cosmos_pb = require('../proto/cosmos_pb');
let GoToRust = require('./gotorust');
let Constants = require('../common/Constants');
let Path = require('../common/Path');

function  IBitcoinTransaction_BTC(json,method_) {
    let utxos = json.utxo;
    console.log("utxos:"+utxos)
    let BtcTxReq =new  btc_pb.BtcTxReq();
    for (let i = 0;i<utxos.length;i++){
        //Utxo
        let Utxo =new  btc_pb.Utxo();
        let utxoObj = utxos[i];
        Utxo.setTxHash(utxoObj.txHash)
        Utxo.setVout(utxoObj.vout)
        Utxo.setAmount(utxoObj.amount)
        Utxo.setAddress(utxoObj.address)
        Utxo.setScriptPubkey(utxoObj.scriptPubkey)
        Utxo.setDerivedPath(utxoObj.derivedPath)
        Utxo.setSequence(utxoObj.sequence)
        BtcTxReq.addUnspents(Utxo)
    }


    BtcTxReq.setTo(json.to)
    BtcTxReq.setAmount(json.amount)
    BtcTxReq.setFee(json.fee)
    BtcTxReq.setChangeAddressIndex(json.changeIdx)
    if(json.extraData !=null || json.extraData!=null) {
        BtcTxReq.setExtraData(new Buffer(json.extraData, 'hex'))
    }
    if(json.propertyId !=null || json.propertyId!=null) {
        BtcTxReq.setPropertyId(json.propertyId)
    }
    BtcTxReq.setNetwork(Constants.TESTNET)
    BtcTxReq.setPathPrefix(Path.BITCOIN_TESTNET_PATH)
    let BtcTxReqbytes = BtcTxReq.serializeBinary();
    //any1
    let any =new  proto.google.protobuf.Any();
    any.setValue(BtcTxReqbytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
            //rust库返回的数据解析
            let Response = new btc_pb.BtcTxRes.deserializeBinary(HexStr2Bytes(ResBuffer));

            return Response;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IBitcoinTransaction_BTC_SEGWIT(json,method_) {
    let utxos = json.utxo;
    console.log("utxos:"+utxos)
    let BtcSegwitTxReq =new  btc_pb.BtcSegwitTxReq();
    for (let i = 0;i<utxos.length;i++){
        //Utxo
        let Utxo =new  btc_pb.Utxo();
        let utxoObj = utxos[i];
        Utxo.setTxHash(utxoObj.txHash)
        Utxo.setVout(utxoObj.vout)
        Utxo.setAmount(utxoObj.amount)
        Utxo.setAddress(utxoObj.address)
        Utxo.setScriptPubkey(utxoObj.scriptPubkey)
        Utxo.setDerivedPath(utxoObj.derivedPath)
        Utxo.setSequence(utxoObj.sequence)
        BtcSegwitTxReq.addUnspents(Utxo)
    }


    BtcSegwitTxReq.setTo(json.to)
    BtcSegwitTxReq.setAmount(json.amount)
    BtcSegwitTxReq.setFee(json.fee)
    BtcSegwitTxReq.setChangeAddressIndex(json.changeIdx)
    if(json.extraData !=null || json.extraData!=null) {
        BtcSegwitTxReq.setExtraData(new Buffer(json.extraData, 'hex'))
    }
    if(json.propertyId !=null || json.propertyId!=null) {
        BtcSegwitTxReq.setPropertyId(json.propertyId)
    }
    BtcSegwitTxReq.setNetwork(Constants.TESTNET)
    BtcSegwitTxReq.setPathPrefix(Path.BITCOIN_SEGWIT_TESTNET_PATH)
    let BtcSegwitTxReqbytes = BtcSegwitTxReq.serializeBinary();
    //any1
    let any =new  proto.google.protobuf.Any();
    any.setValue(BtcSegwitTxReqbytes);
    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new btc_pb.BtcSegwitTxRes.deserializeBinary(HexStr2Bytes(ResBuffer));

        return Response;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}

function  IETHTransaction_sign_TX(json) {
    let transaction = json.transaction;
    let preview = json.preview;
    let EthTxReq =new  eth_pb.EthTxReq();

    EthTxReq.setNonce(transaction.nonce.toString())
    EthTxReq.setGasPrice(transaction.gasPrice.toString())
    EthTxReq.setGasLimit(transaction.gasLimit.toString())
    EthTxReq.setTo(transaction.to)
    EthTxReq.setValue(transaction.value.toString())
    EthTxReq.setData(transaction.data)
    EthTxReq.setChainId(transaction.v.toString())

    EthTxReq.setPayment(preview.payment)
    EthTxReq.setReceiver(preview.receiver)
    EthTxReq.setSender(preview.sender)
    EthTxReq.setFee(preview.fee)
    EthTxReq.setPath(Path.ETH_LEDGER);
    let EthTxReqbytes = EthTxReq.serializeBinary();
    //any1
    let any =new  proto.google.protobuf.Any();
    any.setValue(EthTxReqbytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod("eth_tx_sign");
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new eth_pb.EthTxRes.deserializeBinary(HexStr2Bytes(ResBuffer));

        return Response;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IETHTransaction_sign_MSG(json) {

    let EthMessageSignReq =new  eth_pb.EthMessageSignReq();
    EthMessageSignReq.setPath(Path.ETH_LEDGER);
    EthMessageSignReq.setMessage(json.data)
    EthMessageSignReq.setSender(json.sender)

    let EthMessageSignReqbytes = EthMessageSignReq.serializeBinary();
    //any1
    let any =new  proto.google.protobuf.Any();
    any.setValue(EthMessageSignReqbytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod("eth_message_sign");
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new eth_pb.EthMessageSignRes.deserializeBinary(HexStr2Bytes(ResBuffer));

        return Response;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IEOSTransaction_sign_MSG(json) {
    let data=json.data;
    let publicKey=json.publicKey;
    let EosMessageSignReq =new  eos_pb.EosMessageSignReq();
    EosMessageSignReq.setPath(Path.EOS_LEDGER);
    EosMessageSignReq.setData(data)
    // EosMessageSignReq.isHex(false)
    EosMessageSignReq.setPubkey(publicKey)

    let EosMessageSignReqbytes = EosMessageSignReq.serializeBinary();
    //any1
    let any =new  proto.google.protobuf.Any();
    any.setValue(EosMessageSignReqbytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod("eos_message_sign");
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new eos_pb.EosMessageSignRes.deserializeBinary(HexStr2Bytes(ResBuffer));

        return Response;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IEOSTransaction_sign_TX(json) {
    let publicKeys=json.publicKeys;
    let chainId=json.chainId;
    let txHex=json.txHex;
    let preview=json.preview;
    let EosSignData =new  eos_pb.EosSignData();

    for (let i = 0; i < publicKeys.length; i++) {
        EosSignData.addPubKeys(publicKeys[i].publicKey);
    }
    EosSignData.setTxData(txHex)
    EosSignData.setChainId(chainId);
    EosSignData.setTo(preview.to)
    EosSignData.setFrom(preview.from)
    EosSignData.setPayment(preview.payment)

    let EosTxReq =new  eos_pb.EosTxReq();
    EosTxReq.setPath(Path.EOS_LEDGER)
    EosTxReq.addSignDatas(EosSignData)
    let EosTxReqbytes = EosTxReq.serializeBinary();
    //any1
    let any =new  proto.google.protobuf.Any();
    any.setValue(EosTxReqbytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod("eos_tx_sign");
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new eos_pb.EosTxRes.deserializeBinary(HexStr2Bytes(ResBuffer));

        let list = Response.getTransMultiSignsList();
        let resultList=[];
        for (let i = 0; i < list.length; i++) {
            resultList.push(list[i]);
        }
        return resultList;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  ICOSMOSTransaction_sign_TX(json) {
    let StdFee= new  cosmos_pb.StdFee()
    let SignData= new  cosmos_pb.SignData()
    let amountList=json.fee.amount;
    for (let i = 0; i < amountList.length; i++) {
        let Coin =new  cosmos_pb.Coin()
        Coin.setAmount(amountList[i].amount)
        Coin.setDenom(amountList[i].denom)
        StdFee.addAmount(Coin)
    }
    StdFee.setGas(json.fee.gas)

    let msgList=json.msg
    for (let i = 0; i < msgList.length; i++) {
        let Msg =new  cosmos_pb.Msg()
        Msg.setType(msgList[i].type)
        let MsgValue =new  cosmos_pb.MsgValue()
        let amountArray=msgList[i].value.amount;
        for (let i = 0; i < amountArray.length; i++) {
            let Coin =new  cosmos_pb.Coin()
            Coin.setAmount(amountArray[i].amount)
            Coin.setDenom(amountArray[i].denom)
            MsgValue.addAmount(Coin)
        }
        if(msgList[i].value.hasOwnProperty("to_address")){
            MsgValue.getAddressesMap().set("to_address",msgList[i].value.to_address)
            MsgValue.getAddressesMap().set("from_address",msgList[i].value.from_address)

        }else if(msgList[i].value.hasOwnProperty("delegator_address")) {

            MsgValue.getAddressesMap.set("delegator_address",msgList[i].value.delegator_address)
            MsgValue.getAddressesMap.setset("validator_address",msgList[i].value.validator_address)
            MsgValue.addressesMap=adderssMap
        }
        Msg.setValue(MsgValue)
        SignData.addMsgs(Msg)
    }
    SignData.setFee(StdFee)
    SignData.setAccountNumber(json.accountNumber)
    SignData.setChainId(json.chainId)
    SignData.setMemo(json.memo)
    SignData.setSequence(json.sequence)
    let CosmosTxReq =new  cosmos_pb.CosmosTxReq();
    CosmosTxReq.setPath(Path.COSMOS_LEDGER)
    CosmosTxReq.setSigndata(SignData)
    CosmosTxReq.setPaymentDis(json.preview.payment)
    CosmosTxReq.setToDis(json.preview.receiver)
    CosmosTxReq.setFromDis(json.preview.sender)
    CosmosTxReq.setFeeDis(json.preview.fee)
    let CosmosTxReqbytes = CosmosTxReq.serializeBinary();
    //any1
    let any =new  proto.google.protobuf.Any();
    any.setValue(CosmosTxReqbytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod("cosmos_tx_sign");
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response =new cosmos_pb.CosmosTxRes.deserializeBinary(HexStr2Bytes(ResBuffer));

        return Response;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}

function  BtcXpub(path,netWork) {
    let BtcXpubReq =new  btc_pb.BtcXpubReq();
    BtcXpubReq.setPath(path)
    BtcXpubReq.setNetwork(netWork)
    let BtcXpubReqBytes = BtcXpubReq.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(BtcXpubReqBytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod("btc_get_xpub");
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new btc_pb.BtcXpubRes.deserializeBinary(HexStr2Bytes(ResBuffer));
        let  xpub = Response.getXpub()
        return xpub;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  BtcAddress(path,netWork,method_) {
    let BtcAddressReq =new  btc_pb.BtcAddressReq();
    BtcAddressReq.setPath(path)
    BtcAddressReq.setNetwork(netWork)
    let BtcAddressReqBytes = BtcAddressReq.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(BtcAddressReqBytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new btc_pb.BtcAddressRes.deserializeBinary(HexStr2Bytes(ResBuffer));
        let  address = Response.getAddress()
        return address;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  ethAddress(path) {
    let EthAddressReq =new  eth_pb.EthAddressReq();
    EthAddressReq.setPath(path)
    let EthAddressReqBytes = EthAddressReq.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(EthAddressReqBytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new eth_pb.EthAddressRes.deserializeBinary(HexStr2Bytes(ResBuffer));
        let  address = Response.getAddress()
        return address;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  eosPubkey(path,method_) {
    let EosPubkeyReq =new  eos_pb.EosPubkeyReq();
    EosPubkeyReq.setPath(path)
    let EosPubkeyReqBytes = EosPubkeyReq.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(EosPubkeyReqBytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new eos_pb.EosPubkeyRes.deserializeBinary(HexStr2Bytes(ResBuffer));
        let  address = Response.getPubkey()
        return address;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  cosmosAddress(path,method_) {
    let CosmosAddressReq =new  cosmos_pb.CosmosAddressReq();
    CosmosAddressReq.setPath(path)
    let CosmosAddressReqBytes = CosmosAddressReq.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(CosmosAddressReqBytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    ImkeyAction.setParam(any);

    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let Response = new cosmos_pb.CosmosAddressRes.deserializeBinary(HexStr2Bytes(ResBuffer));
        let  address = Response.getAddress()
        return address;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
export function getBTC_Xpub_() {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: BtcXpub("m/44'/0'/0'/0/0",Constants.MAINNET)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}
export function getBTC_Xpub() {
    return BtcXpub("m/44'/0'/0'/0/0",Constants.MAINNET);
}
export function getBTC_Address() {
    return BtcAddress("m/44'/0'/0'/0/0",Constants.MAINNET,"btc_get_address");
}
export function getBTC_displayAddress() {
    return BtcAddress("m/44'/0'/0'/0/0",Constants.MAINNET,"btc_register_address");
}
export function getBTC_SegWitAddress() {
    return BtcAddress("m/49'/0'/0'/0/22",Constants.MAINNET,"btc_get_setwit_address");
}
export function getBTC_displaySegWitAddress() {
    return BtcAddress("m/49'/0'/0'/0/0",Constants.MAINNET,"btc_register_segwit_address");
}

export function getCOSMOS_Address(path) {
    return cosmosAddress(Path.COSMOS_LEDGER,"cosmos_get_address");
}
export function getCOSMOS_displayAddress(path) {
    return cosmosAddress(Path.COSMOS_LEDGER,"cosmos_register_address");
}

export function getEOS_Address() {
    return eosPubkey(Path.EOS_LEDGER,"eos_get_pubkey");
}
export function getEOS_displayAddress() {
    return eosPubkey(Path.EOS_LEDGER,"eos_register_pubkey");
}

export function getETH_Address() {
    return ethAddress(Path.ETH_LEDGER);
}
export function getETH_displayAddress() {
    return ethAddress(Path.ETH_LEDGER);
}

export function BitcoinTransaction_BTC(json) {
    return IBitcoinTransaction_BTC(json,"btc_tx_sign");
}
export function BitcoinTransaction_BTC_SEGWIT(json) {
    return IBitcoinTransaction_BTC_SEGWIT(json,"btc_segwit_tx_sign");
}
export function BitcoinTransaction_BTC_USDT(json) {
    return IBitcoinTransaction_BTC(json,"btc_usdt_tx_sign");
}
export function BitcoinTransaction_BTC_USDT_SEGWIT(json) {
    return IBitcoinTransaction_BTC_SEGWIT(json,"btc_usdt_segwit_tx_sign");
}
export function ETHTransaction_sign_TX(json) {
    return IETHTransaction_sign_TX(json);
}
export function ETHTransaction_sign_MSG(json) {
    return IETHTransaction_sign_MSG(json);
}
export function EOSTransaction_sign_TX(json) {
    return IEOSTransaction_sign_TX(json);
}
export function EOSTransaction_sign_MSG(json) {
    return IEOSTransaction_sign_MSG(json);
}
export function COSMOSTransaction_sign_TX(json) {
    return ICOSMOSTransaction_sign_TX(json);
}
// module.exports = {
//     BitcoinTransaction_BTC,
//     BitcoinTransaction_BTC_SEGWIT,
//     BitcoinTransaction_BTC_USDT,
//     BitcoinTransaction_BTC_USDT_SEGWIT,
//     ETHTransaction_sign_TX,
//     ETHTransaction_sign_MSG,
//     EOSTransaction_sign_MSG,
//     EOSTransaction_sign_TX,
//     COSMOSTransaction_sign_TX,
//     getBTC_Xpub,
//     getBTC_Address,
//     getBTC_displayAddress,
//     getBTC_SegWitAddress,
//     getBTC_displaySegWitAddress,
//     getCOSMOS_Address,
//     getCOSMOS_displayAddress,
//     getEOS_Address,
//     getEOS_displayAddress,
//     getETH_Address,
//     getETH_displayAddress
// }
/**
 * @desc 二进制数组转字符串
 */
function Bytes2Str(arr){
    let str = "";
    for (let i = 0; i < arr.length; i++){
        let tmp =String.fromCharCode(arr[i]);
        // if (tmp.length === 1){
        //     tmp = "0" + tmp;
        // }
        str += tmp;
    }
    return str;
}
/**
 * @desc 二进制数组转十六进制字符串
 */
function Bytes2HexStr(arr){
    let str = "";
    for (let i = 0; i < arr.length; i++){
        let tmp = arr[i].toString(16);
        if (tmp.length === 1){
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
}
/*
* @desc 十六进制字符串转二进制数组
*/
function HexStr2Bytes(str){
    let pos = 0;
    let len = str.length;
    if (len % 2 != 0){
        return null;
    }
    len /= 2;
    let hexA = new Array();
    for (let i = 0; i < len; i++){
        let s = str.substr(pos, 2);
        let v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}
