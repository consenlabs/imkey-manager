let walletApi = require('./walletapi');
let DeviceManger = require('./devicemanagerapi');
export  function api(api_name,json) {
    if(api_name==null){return "input api fuction is null"}
    // else if(api_name =="getSeid"){return DeviceManger.getSeid()}
    // else if(api_name =="getSn"){ return DeviceManger.getSn()}
    // else if(api_name =="getRamSize"){ return DeviceManger.getRamSize()}
    // else if(api_name =="getFirmwareVersion"){ return DeviceManger.getFirmwareVersion()}
    // else if(api_name =="getBatteryPower"){ return DeviceManger.getBatteryPower()}
    // else if(api_name =="getLifeTime"){ return DeviceManger.getLifeTime()}
    // else if(api_name =="getBleName"){ return DeviceManger.getBleName()}
    // else if(api_name =="setBleName"){ return DeviceManger.setBleName()}
    // else if(api_name =="getBleVersion"){ return DeviceManger.getBleVersion()}
    // else if(api_name =="activeDevice"){ return DeviceManger.activeDevice()}
    // else if(api_name =="checkDevice"){ return DeviceManger.checkDevice()}
    // else if(api_name =="checkUpdate"){ return DeviceManger.checkUpdate()}
    // else if(api_name =="downloadApplet"){ return DeviceManger.downloadApplet()}
    // else if(api_name =="updateApplet"){ return DeviceManger.updateApplet()}
    // else if(api_name =="deleteApplet"){ return DeviceManger.deleteApplet()}
    // else if(api_name =="deviceBindCheck"){return DeviceManger.deviceBindCheck()}
    else if(api_name =="transactionBTC"){
        DeviceManger.deviceBindCheck();
        let response = walletApi.BitcoinTransaction_BTC(json)
        let result = {
            txHash: response.getTxHash(),
            txData:response.getTxData(),
        };
       return result;
    }
    else if(api_name =="transactionBTCSEGWIT"){
        DeviceManger.deviceBindCheck();
        let response = walletApi.BitcoinTransaction_BTC_SEGWIT(json)
        let result = {
            txHash: response.getTxHash(),
            witnessTxData:response.getWitnessTxData(),
            wtxHash:response.getWtxHash()
        };
        return result;
    }
    else if(api_name =="transactionBTCUSDT"){
        DeviceManger.deviceBindCheck();
        let response = walletApi.BitcoinTransaction_BTC_USDT(json)
        let result = {
            txHash: response.getTxHash(),
            txData:response.getTxData(),
        };
        return result;
    }
    else if(api_name =="transactionBTCUSDTSEGWIT"){
        DeviceManger.deviceBindCheck();
        let response = walletApi.BitcoinTransaction_BTC_USDT_SEGWIT(json)
        let result = {
            txHash: response.getTxHash(),
            witnessTxData:response.getWitnessTxData(),
            wtxHash:response.getWtxHash()
        };
        return result;
    }
    else if(api_name =="transactionETHSIGNTX"){
        DeviceManger.deviceBindCheck();
        let response = walletApi.ETHTransaction_sign_TX(json)
        let result = {
            txHash: response.getTxHash(),
            txData:response.getTxData(),
        };
        return result;
    }
    else if(api_name =="transactionETHSIGNMSG"){
        DeviceManger.deviceBindCheck();
        let response = walletApi.ETHTransaction_sign_MSG(json)
        let result = {
            signature:response.getSignature(),
        };
        return result;
    }
    else if(api_name =="transactionEOSSIGNTX"){
        DeviceManger.deviceBindCheck();
        let response = walletApi.EOSTransaction_sign_TX(json)
        let result = {
            txHash: response.getHash(),
            signature:response.getSignsList(),
        };
        return result;
    }
    else if(api_name =="transactionEOSSIGNMSG"){
        DeviceManger.deviceBindCheck();
        let response = walletApi.EOSTransaction_sign_MSG(json)
        let result = {
            signature:response.getSignature(),
        };
        return result;
    }
    else if(api_name =="transactionCOSMOSSIGNTX"){
        DeviceManger.deviceBindCheck();
        let response = walletApi.COSMOSTransaction_sign_TX(json)
        let result = {
            txHash: response.getTxHash(),
            signature:response.getTxData(),
        };
        return result;
    }
    else{return "not found api function！ "}
}
// module.exports = {
//     api
// }