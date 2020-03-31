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

function  IBitcoinTransaction_BTC(utxoArray,userData) {
    console.log("utxoArray:"+utxoArray)
    console.log("userData:"+JSON.stringify(userData))
    let BtcTxInput =new  btc_pb.BtcTxInput();



    for (let i = 0;i<utxoArray.length;i++){
        //Utxo
        let Utxo =new  btc_pb.Utxo();
        let utxoObj = utxoArray[i];
        Utxo.setTxhash(utxoObj.txHash)
        console.log("utxoObj.txHash:"+utxoObj.txHash)
        Utxo.setVout(utxoObj.vout)
        console.log("utxoObj.vout:"+utxoObj.vout)
        Utxo.setAmount(utxoObj.amount)
        console.log("utxoObj.amount:"+utxoObj.amount)
        Utxo.setAddress(utxoObj.address)
        console.log("utxoObj.address:"+utxoObj.address)
        Utxo.setScriptpubkey(utxoObj.scriptPubkey)
        console.log("utxoObj.scriptPubKey:"+utxoObj.scriptPubkey)
        Utxo.setDerivedpath(utxoObj.derivedPath)
        console.log("utxoObj.derivedPath:"+utxoObj.derivedPath)
        Utxo.setSequence(utxoObj.sequence)
        console.log("utxoObj.sequence:"+utxoObj.sequence)
        BtcTxInput.addUnspents(Utxo)
    }


    BtcTxInput.setTo(userData.to)
    console.log("userData.to:"+userData.to)
    BtcTxInput.setChangeaddressindex(userData.changeIdx)
    console.log("userData.changeIdx:"+userData.changeIdx)
    BtcTxInput.setAmount(userData.amount)
    console.log("userData.amount:"+userData.amount)
    BtcTxInput.setFee(userData.fee)
    console.log("userData.fee:"+userData.fee)
    BtcTxInput.setExtraData(Buffer.from(userData.extraData,'hex'))
    console.log("userData.extraData:"+userData.extraData)
    BtcTxInput.setPayment(userData.payment)
    console.log("userData.payment:"+userData.payment)
    BtcTxInput.setToDis(userData.toDis)
    console.log("userData.toDis:"+userData.toDis)
    BtcTxInput.setFrom(userData.from)
    console.log("userData.from:"+userData.from)
    BtcTxInput.setFeeDis(userData.feeDis)
    console.log("userData.feeDis:"+userData.feeDis)
    BtcTxInput.setNetwork(Constants.TESTNET)
    console.log("Constants.TESTNET:"+Constants.TESTNET)
    BtcTxInput.setPathPrefix(Path.BITCOIN_TESTNET_PATH)
    console.log("Path.BITCOIN_TESTNET_PATH:"+Path.BITCOIN_TESTNET_PATH)
    let BtcTxInputbytes = BtcTxInput.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(BtcTxInputbytes);
    //SignParam
    let SignParam =new  api_pb.SignParam();
    SignParam.setChaintype("BTC");
    SignParam.setInput(any1);
    let SignParambytes = SignParam.serializeBinary();
    //any2
    let any2 =new  proto.google.protobuf.Any();
    any2.setValue(SignParambytes);
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("sign_tx");
    TcxAction.setParam(any2);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
            //rust库返回的数据解析
            let BtcTxOutputResponse = new btc_pb.BtcTxOutput.deserializeBinary(HexStr2Bytes(ResBuffer));

            return BtcTxOutputResponse;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IBitcoinTransaction_BTC_SEGWIT(utxoArray,userData) {
    console.log("utxoArray:"+utxoArray)
    console.log("userData:"+JSON.stringify(userData))
    let BtcTxInput =new  btc_pb.BtcTxInput();

    for (let i = 0;i<utxoArray.length;i++){
        //Utxo
        let Utxo =new  btc_pb.Utxo();
        let utxoObj = utxoArray[i];
        Utxo.setTxhash(utxoObj.txHash)
        console.log("utxoObj.txHash:"+utxoObj.txHash)
        Utxo.setVout(utxoObj.vout)
        console.log("utxoObj.vout:"+utxoObj.vout)
        Utxo.setAmount(utxoObj.amount)
        console.log("utxoObj.amount:"+utxoObj.amount)
        Utxo.setAddress(utxoObj.address)
        console.log("utxoObj.address:"+utxoObj.address)
        Utxo.setScriptpubkey(utxoObj.scriptPubkey)
        console.log("utxoObj.scriptPubKey:"+utxoObj.scriptPubkey)
        Utxo.setDerivedpath(utxoObj.derivedPath)
        console.log("utxoObj.derivedPath:"+utxoObj.derivedPath)
        Utxo.setSequence(utxoObj.sequence)
        console.log("utxoObj.sequence:"+utxoObj.sequence)
        BtcTxInput.addUnspents(Utxo)
    }


    BtcTxInput.setTo(userData.to)
    console.log("userData.to:"+userData.to)
    BtcTxInput.setChangeaddressindex(userData.changeIdx)
    console.log("userData.changeIdx:"+userData.changeIdx)
    BtcTxInput.setAmount(userData.amount)
    console.log("userData.amount:"+userData.amount)
    BtcTxInput.setFee(userData.fee)
    console.log("userData.fee:"+userData.fee)
    BtcTxInput.setExtraData(Buffer.from(userData.extraData,'hex'))
    console.log("userData.extraData:"+userData.extraData)
    BtcTxInput.setPayment(userData.payment)
    console.log("userData.payment:"+userData.payment)
    BtcTxInput.setToDis(userData.toDis)
    console.log("userData.toDis:"+userData.toDis)
    BtcTxInput.setFrom(userData.from)
    console.log("userData.from:"+userData.from)
    BtcTxInput.setFeeDis(userData.feeDis)
    console.log("userData.feeDis:"+userData.feeDis)
    BtcTxInput.setNetwork(Constants.TESTNET)
    console.log("Constants.TESTNET:"+Constants.TESTNET)
    BtcTxInput.setPathPrefix(Path.BITCOIN_SEGWIT_TESTNET_PATH)
    console.log("Path.BITCOIN_TESTNET_PATH:"+Path.BITCOIN_SEGWIT_TESTNET_PATH)
    let BtcTxInputbytes = BtcTxInput.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(BtcTxInputbytes);
    //SignParam
    let SignParam =new  api_pb.SignParam();
    SignParam.setChaintype("BTC_SEGWIT");
    SignParam.setInput(any1);
    let SignParambytes = SignParam.serializeBinary();
    //any2
    let any2 =new  proto.google.protobuf.Any();
    any2.setValue(SignParambytes);
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("sign_tx");
    TcxAction.setParam(any2);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let BtcTxOutputResponse = new btc_pb.BtcTxOutput.deserializeBinary(HexStr2Bytes(ResBuffer));

        return BtcTxOutputResponse;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IBitcoinTransaction_BTC_USDT(utxoArray,userData) {
    console.log("utxoArray:"+utxoArray)
    console.log("userData:"+JSON.stringify(userData))
    let BtcTxInput =new  btc_pb.BtcTxInput();

    for (let i = 0;i<utxoArray.length;i++){
        //Utxo
        let Utxo =new  btc_pb.Utxo();
        let utxoObj = utxoArray[i];
        Utxo.setTxhash(utxoObj.txHash)
        console.log("utxoObj.txHash:"+utxoObj.txHash)
        Utxo.setVout(utxoObj.vout)
        console.log("utxoObj.vout:"+utxoObj.vout)
        Utxo.setAmount(utxoObj.amount)
        console.log("utxoObj.amount:"+utxoObj.amount)
        Utxo.setAddress(utxoObj.address)
        console.log("utxoObj.address:"+utxoObj.address)
        Utxo.setScriptpubkey(utxoObj.scriptPubkey)
        console.log("utxoObj.scriptPubKey:"+utxoObj.scriptPubkey)
        Utxo.setDerivedpath(utxoObj.derivedPath)
        console.log("utxoObj.derivedPath:"+utxoObj.derivedPath)
        Utxo.setSequence(utxoObj.sequence)
        console.log("utxoObj.sequence:"+utxoObj.sequence)
        BtcTxInput.addUnspents(Utxo)
    }


    BtcTxInput.setTo(userData.to)
    console.log("userData.to:"+userData.to)
    BtcTxInput.setAmount(userData.amount)
    console.log("userData.amount:"+userData.amount)
    BtcTxInput.setFee(userData.fee)
    console.log("userData.fee:"+userData.fee)
    BtcTxInput.setPayment(userData.payment)
    console.log("userData.payment:"+userData.payment)
    BtcTxInput.setToDis(userData.toDis)
    console.log("userData.toDis:"+userData.toDis)
    BtcTxInput.setFrom(userData.from)
    console.log("userData.from:"+userData.from)
    BtcTxInput.setFeeDis(userData.feeDis)
    console.log("userData.feeDis:"+userData.feeDis)
    BtcTxInput.setNetwork(Constants.TESTNET)
    console.log("Constants.TESTNET:"+Constants.TESTNET)
    BtcTxInput.setPathPrefix(Path.BITCOIN_TESTNET_PATH)
    console.log("Path.BITCOIN_TESTNET_PATH:"+Path.BITCOIN_TESTNET_PATH)
    BtcTxInput.setPropertyId(userData.propertyId)
    console.log("userData.propertyId:"+userData.propertyId)
    let BtcTxInputbytes = BtcTxInput.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(BtcTxInputbytes);
    //SignParam
    let SignParam =new  api_pb.SignParam();
    SignParam.setChaintype("OMINI");
    SignParam.setInput(any1);
    let SignParambytes = SignParam.serializeBinary();
    //any2
    let any2 =new  proto.google.protobuf.Any();
    any2.setValue(SignParambytes);
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("sign_tx");
    TcxAction.setParam(any2);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let BtcTxOutputResponse = new btc_pb.BtcTxOutput.deserializeBinary(HexStr2Bytes(ResBuffer));

        return BtcTxOutputResponse;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IBitcoinTransaction_BTC_USDT_SEGWIT(utxoArray,userData) {
    console.log("utxoArray:"+utxoArray)
    console.log("userData:"+JSON.stringify(userData))
    let BtcTxInput =new  btc_pb.BtcTxInput();

    for (let i = 0;i<utxoArray.length;i++){
        //Utxo
        let Utxo =new  btc_pb.Utxo();
        let utxoObj = utxoArray[i];
        Utxo.setTxhash(utxoObj.txHash)
        console.log("utxoObj.txHash:"+utxoObj.txHash)
        Utxo.setVout(utxoObj.vout)
        console.log("utxoObj.vout:"+utxoObj.vout)
        Utxo.setAmount(utxoObj.amount)
        console.log("utxoObj.amount:"+utxoObj.amount)
        Utxo.setAddress(utxoObj.address)
        console.log("utxoObj.address:"+utxoObj.address)
        Utxo.setScriptpubkey(utxoObj.scriptPubkey)
        console.log("utxoObj.scriptPubKey:"+utxoObj.scriptPubkey)
        Utxo.setDerivedpath(utxoObj.derivedPath)
        console.log("utxoObj.derivedPath:"+utxoObj.derivedPath)
        Utxo.setSequence(utxoObj.sequence)
        console.log("utxoObj.sequence:"+utxoObj.sequence)
        BtcTxInput.addUnspents(Utxo)
    }


    BtcTxInput.setTo(userData.to)
    console.log("userData.to:"+userData.to)
    BtcTxInput.setAmount(userData.amount)
    console.log("userData.amount:"+userData.amount)
    BtcTxInput.setFee(userData.fee)
    console.log("userData.fee:"+userData.fee)
    BtcTxInput.setPayment(userData.payment)
    console.log("userData.payment:"+userData.payment)
    BtcTxInput.setToDis(userData.toDis)
    console.log("userData.toDis:"+userData.toDis)
    BtcTxInput.setFrom(userData.from)
    console.log("userData.from:"+userData.from)
    BtcTxInput.setFeeDis(userData.feeDis)
    console.log("userData.feeDis:"+userData.feeDis)
    BtcTxInput.setNetwork(Constants.TESTNET)
    console.log("Constants.TESTNET:"+Constants.TESTNET)
    BtcTxInput.setPathPrefix(Path.BITCOIN_SEGWIT_TESTNET_PATH)
    console.log("Path.BITCOIN_TESTNET_PATH:"+Path.BITCOIN_SEGWIT_TESTNET_PATH)
    BtcTxInput.setPropertyId(userData.propertyId)
    console.log("userData.propertyId:"+userData.propertyId)
    let BtcTxInputbytes = BtcTxInput.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(BtcTxInputbytes);
    //SignParam
    let SignParam =new  api_pb.SignParam();
    SignParam.setChaintype("OMINI_SEGWIT");
    SignParam.setInput(any1);
    let SignParambytes = SignParam.serializeBinary();
    //any2
    let any2 =new  proto.google.protobuf.Any();
    any2.setValue(SignParambytes);
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("sign_tx");
    TcxAction.setParam(any2);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let BtcTxOutputResponse = new btc_pb.BtcTxOutput.deserializeBinary(HexStr2Bytes(ResBuffer));

        return BtcTxOutputResponse;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IETHTransaction_sign_TX(transaction,preview) {

    let EthTxInput =new  eth_pb.EthTxInput();

    EthTxInput.setNonce(transaction.nonce.toString())
    console.log("transaction.nonce:"+transaction.nonce.toString())
    EthTxInput.setGasPrice(transaction.gasPrice.toString())
    console.log("transaction.gasPrice:"+transaction.gasPrice.toString())
    EthTxInput.setGasLimit(transaction.gasLimit.toString())
    console.log("transaction.gasLimit:"+transaction.gasLimit.toString())
    EthTxInput.setTo(transaction.to)
    console.log("transaction.to:"+transaction.to)
    EthTxInput.setValue(transaction.value.toString())
    console.log("transaction.value:"+transaction.value.toString())
    EthTxInput.setData(transaction.data)
    console.log("transaction.data:"+transaction.data)
    EthTxInput.setChainId(transaction.v.toString())
    console.log("transaction.v:"+transaction.v.toString())

    EthTxInput.setPayment(preview.payment)
    console.log("preview.payment:"+preview.payment)
    EthTxInput.setReceiver(preview.receiver)
    console.log("preview.receiver:"+preview.receiver)
    EthTxInput.setSender(preview.sender)
    console.log("preview.sender:"+preview.sender)
    EthTxInput.setFee(preview.fee)
    console.log("preview.fee:"+preview.fee)
    EthTxInput.setPath(Path.ETH_LEDGER);
    console.log("Path.ETH_LEDGER:"+Path.ETH_LEDGER)
    let EthTxInputbytes = EthTxInput.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(EthTxInputbytes);
    //SignParam
    let SignParam =new  api_pb.SignParam();
    SignParam.setChaintype("ETH");
    SignParam.setInput(any1);
    let SignParambytes = SignParam.serializeBinary();
    //any2
    let any2 =new  proto.google.protobuf.Any();
    any2.setValue(SignParambytes);
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("sign_tx");
    TcxAction.setParam(any2);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let EthTxOutputResponse = new eth_pb.EthTxOutput.deserializeBinary(HexStr2Bytes(ResBuffer));

        return EthTxOutputResponse;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IETHTransaction_sign_MSG(data,sender) {

    let EthPersonalSignInput =new  eth_pb.EthPersonalSignInput();
    EthPersonalSignInput.setPath(Path.ETH_LEDGER);
    EthPersonalSignInput.setMessage(data)
    console.log("data:"+data)
    EthPersonalSignInput.setSender(sender)
    console.log("sender:"+sender)

    let EthPersonalSignInputbytes = EthPersonalSignInput.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(EthPersonalSignInputbytes);
    //SignParam
    let SignParam =new  api_pb.SignParam();
    SignParam.setChaintype("ETH");
    SignParam.setInput(any1);
    let SignParambytes = SignParam.serializeBinary();
    //any2
    let any2 =new  proto.google.protobuf.Any();
    any2.setValue(SignParambytes);
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("sign_msg");
    TcxAction.setParam(any2);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let EthPersonalSignOutputResponse = new eth_pb.EthPersonalSignOutput.deserializeBinary(HexStr2Bytes(ResBuffer));

        return EthPersonalSignOutputResponse;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IEOSTransaction_sign_MSG(data,publicKey) {

    let EosMessageInput =new  eos_pb.EosMessageInput();
    EosMessageInput.setPath(Path.EOS_LEDGER);
    console.log("Path.EOS_LEDGER:"+Path.EOS_LEDGER)
    EosMessageInput.setData(data)
    console.log("data:"+data)
    // EosMessageInput.isHex(false)
    EosMessageInput.setPubkey(publicKey)
    console.log("publicKey:"+publicKey)

    let EosMessageInputbytes = EosMessageInput.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(EosMessageInputbytes);
    //SignParam
    let SignParam =new  api_pb.SignParam();
    SignParam.setChaintype("EOS");
    SignParam.setInput(any1);
    let SignParambytes = SignParam.serializeBinary();
    //any2
    let any2 =new  proto.google.protobuf.Any();
    any2.setValue(SignParambytes);
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("sign_msg");
    TcxAction.setParam(any2);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let EosMessageOutputResponse = new eos_pb.EosMessageOutput.deserializeBinary(HexStr2Bytes(ResBuffer));

        return EosMessageOutputResponse;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  IEOSTransaction_sign_TX(publicKeys,chainId,txHex,preview) {

    let EosSignData =new  eos_pb.EosSignData();

    for (let i = 0; i < publicKeys.length; i++) {
        EosSignData.addPubKeys(publicKeys[i].publicKey);
        console.log("publicKeys[i].publicKey:"+publicKeys[i].publicKey)
    }
    EosSignData.setTxData(txHex)
    console.log("txHex:"+txHex)
    EosSignData.setChainId(chainId);
    console.log("chainId:"+chainId)
    EosSignData.setTo(preview.to)
    console.log("preview.to:"+preview.to)
    EosSignData.setFrom(preview.from)
    console.log("preview.from:"+preview.from)
    EosSignData.setPayment(preview.payment)
    console.log("preview.payment:"+preview.payment)

    let EosTxInput =new  eos_pb.EosTxInput();
    EosTxInput.setPath(Path.EOS_LEDGER)
    EosTxInput.addSignDatas(EosSignData)
    let EosTxInputbytes = EosTxInput.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(EosTxInputbytes);
    //SignParam
    let SignParam =new  api_pb.SignParam();
    SignParam.setChaintype("EOS");
    SignParam.setInput(any1);
    let SignParambytes = SignParam.serializeBinary();
    //any2
    let any2 =new  proto.google.protobuf.Any();
    any2.setValue(SignParambytes);
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("sign_tx");
    TcxAction.setParam(any2);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let EosTxOutputResponse = new eos_pb.EosTxOutput.deserializeBinary(HexStr2Bytes(ResBuffer));

        return EosTxOutputResponse;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}

function  BTC(path,netWork,chainType,method) {

    let AddressParam =new  api_pb.AddressParam();

    AddressParam.setChaintype(chainType)
    AddressParam.setPath(path)
    AddressParam.setNetwork(netWork)
    let AddressParamBytes = AddressParam.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(AddressParamBytes);

    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod(method);
    TcxAction.setParam(any1);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let BtcAddressResponse = new btc_pb.BtcAddressResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
        let  Address = BtcAddressResponse.getAddress()
        return Address;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
function  coinAddress(path,chainType,method) {

    let AddressParam =new  api_pb.AddressParam();

    AddressParam.setChaintype(chainType)
    AddressParam.setPath(path)
    let AddressParamBytes = AddressParam.serializeBinary();
    //any1
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(AddressParamBytes);

    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod(method);
    TcxAction.setParam(any1);

    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        //rust库返回的数据解析
        let BtcAddressResponse = new btc_pb.BtcAddressResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
        let  xpub = BtcAddressResponse.getAddress();
        return xpub;
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError():"+ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}
export function getBTC_Xpub() {
    return BTC(Path.BTC_PATH_PREFIX,Constants.MAINNET,"BTC_XPUB","get_address");
}
export function getBTC_Address() {
    return BTC(Path.BTC_PATH_PREFIX,Constants.MAINNET,"BTC","get_address");
}
export function getBTC_displayAddress() {
    return BTC(Path.BTC_PATH_PREFIX,Constants.MAINNET,"BTC","register_coin");
}
export function getBTC_SegWitAddress() {
    return BTC(Path.BTC_SEGWIT_PATH_PREFIX,Constants.MAINNET,"BTC_SEGWIT","get_address");
}
export function getBTC_displaySegWitAddress() {
    return BTC(Path.BTC_SEGWIT_PATH_PREFIX,Constants.MAINNET,"BTC_SEGWIT","register_coin");
}

export function getCOSMOS_Address(path) {
    return coinAddress(Path.COSMOS_LEDGER,"COSMOS","get_address");
}
export function getCOSMOS_displayAddress(path) {
    return coinAddress(Path.COSMOS_LEDGER,"COSMOS","register_coin");
}

export function getEOS_Address() {
    return coinAddress(Path.EOS_LEDGER,"EOS","get_address");
}
export function getEOS_displayAddress() {
    return coinAddress(Path.EOS_LEDGER,"EOS","register_coin");
}

export function getETH_Address() {
    return coinAddress(Path.ETH_LEDGER,"ETH","get_address");
}
export function getETH_displayAddress() {
    return coinAddress(Path.ETH_LEDGER,"ETH","register_coin");
}

export function BitcoinTransaction_BTC(utxoArray,userData) {
    console.log(utxoArray)
    console.log(userData)
    return IBitcoinTransaction_BTC(utxoArray,userData);
}
export function BitcoinTransaction_BTC_SEGWIT(utxoArray,userData) {
    return IBitcoinTransaction_BTC_SEGWIT(utxoArray,userData);
}
export function BitcoinTransaction_BTC_USDT(utxoArray,userData) {
    return IBitcoinTransaction_BTC_USDT(utxoArray,userData);
}
export function BitcoinTransaction_BTC_USDT_SEGWIT(utxoArray,userData) {
    return IBitcoinTransaction_BTC_USDT_SEGWIT(utxoArray,userData);
}
export function ETHTransaction_sign_TX(transaction,preview) {
    return IETHTransaction_sign_TX(transaction,preview);
}
export function ETHTransaction_sign_MSG(data,sender) {
    return IETHTransaction_sign_MSG(data,sender);
}
export function EOSTransaction_sign_TX(publicKeys,chainId,txHex,preview) {
    return IEOSTransaction_sign_TX(publicKeys,chainId,txHex,preview);
}
export function EOSTransaction_sign_MSG(data,publicKey) {
    return IEOSTransaction_sign_MSG(data,publicKey);
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
