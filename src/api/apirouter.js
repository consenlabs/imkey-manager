let walletApi = require('./walletapi');
let DeviceManger = require('./devicemanagerapi');
// let FilePath = require("path").resolve('./')
const electron = require('electron');
const FilePath = (electron.app || electron.remote.app).getPath('userData')+"/";

export function api(api_name, json) {
    let result;
    let connectRes = DeviceManger.connect("imKey Pro");
    console.log("connectRes:"+connectRes)
    if(connectRes!="true"){
        result = {
            error: connectRes,
        };
        return result;
    }else{
        //检查是否绑定
        let bindCheckRes = DeviceManger.deviceBindCheck(FilePath);
        if(bindCheckRes != "bound_this") {
            result = {
                error: bindCheckRes,
            };
            return result;
        }
    }

    if (api_name == null) {
        return "input api fuction is null"
    }
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
    else if (api_name == "transactionBTC") {
        let response = walletApi.BitcoinTransaction_BTC(json)

        if(response.getTxHash()=="" ||response.getTxHash()==null || response.getTxHash().isUndefined){
             result = {
                error: response,
            };
        }else {
             result = {
                txHash: response.getTxHash(),
                txData: response.getTxData(),
            };
        }
        return result;
    } else if (api_name == "transactionBTCSEGWIT") {
        let response = walletApi.BitcoinTransaction_BTC_SEGWIT(json)
        if(response.getTxHash()=="" ||response.getTxHash()==null || response.getTxHash().isUndefined){
             result = {
                error: response,
            };
        }else {
            result = {
                txHash: response.getTxHash(),
                witnessTxData: response.getWitnessTxData(),
                wtxHash: response.getWtxHash()
            };
        }
        return result;
    } else if (api_name == "transactionBTCUSDT") {
        let response = walletApi.BitcoinTransaction_BTC_USDT(json)
        if(response.getTxHash()=="" ||response.getTxHash()==null || response.getTxHash().isUndefined){
            result = {
                error: response,
            };
        }else {
            result = {
                txHash: response.getTxHash(),
                txData: response.getTxData(),
            };
        }
        return result;
    } else if (api_name == "transactionBTCUSDTSEGWIT") {
        let response = walletApi.BitcoinTransaction_BTC_USDT_SEGWIT(json)
        if(response.getTxHash()=="" ||response.getTxHash()==null || response.getTxHash().isUndefined){
            result = {
                error: response,
            };
        }else {
            result = {
                txHash: response.getTxHash(),
                witnessTxData: response.getWitnessTxData(),
                wtxHash: response.getWtxHash()
            };
        }
        return result;
    } else if (api_name == "transactionETHSIGNTX") {
        let response = walletApi.ETHTransaction_sign_TX(json)
        if(response.getTxHash()=="" ||response.getTxHash()==null || response.getTxHash().isUndefined){
            result = {
                error: response,
            };
        }else {
            result = {
                txHash: response.getTxHash(),
                txData: response.getTxData(),
            };
        }
        return result;
    } else if (api_name == "transactionETHSIGNMSG") {
        let response = walletApi.ETHTransaction_sign_MSG(json)
        if(response.getSignature()=="" ||response.getSignature()==null || response.getSignature().isUndefined){
            result = {
                error: response,
            };
        }else {
            result = {
                signature: response.getSignature(),
            };
        }
        return result;
    } else if (api_name == "transactionEOSSIGNTX") {
        let response = walletApi.EOSTransaction_sign_TX(json)
        if (response.getHash() == "" || response.getHash() == null || response.getHash().isUndefined) {
            result = {
                error: response,
            };
            return result;
        } else {
        let list = [];
        for (let i = 0; i < response.length; i++) {
            let tx_hash = response[i].getHash();
            let signs = response[i].getSignsList();
            result = {
                tx_hash: tx_hash,
                signs: signs
            };
            list.push(result);
        }
        return list;
    }
    } else if (api_name == "transactionEOSSIGNMSG") {
        let response = walletApi.EOSTransaction_sign_MSG(json)
        if(response.getSignature()=="" ||response.getSignature()==null || response.getSignature().isUndefined){
            result = {
                error: response,
            };
        }else{
        result = {
            signature: response.getSignature(),
        };
        }
        return result;
    } else if (api_name == "transactionCOSMOSSIGNTX") {
        let response = walletApi.COSMOSTransaction_sign_TX(json)
        if(response.getTxHash()=="" ||response.getTxHash()==null || response.getTxHash().isUndefined){
            result = {
                error: response,
            };
        }else{
            result = {
                txHash: response.getTxHash(),
                signature: response.getTxData(),
            };
        }
       
        return result;
    } else {
        return "not found api function！ "
    }
}

// module.exports = {
//     api
// }