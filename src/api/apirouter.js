let walletApi = require('./walletapi');
let constants = require('../common/constants');
let deviceManger = require('./devicemanagerapi');
const electron = require('electron');
const filePath = (electron.app || electron.remote.app).getPath('userData') + "/";

export function api(apiName, json) {
    let result;
    let connectRes = deviceManger.connect("imKey Pro");
    if (connectRes != constants.RESULT_STATUS_SUCCESS) {
        result = {
            error: connectRes,
        };
        return result;
    } else {
        //检查是否绑定
        let bindCheckRes = deviceManger.deviceBindCheck(filePath);
        if (bindCheckRes != "bound_this") {
            result = {
                error: bindCheckRes,
            };
            return result;
        }
    }

    if (apiName == null || apiName == "" || apiName.isUndefined) {
        result = {
            error: "input api function is null",
        };
        return result;
    }
        // else if(apiName =="getSeid"){return deviceManger.getSeid()}
        // else if(apiName =="getSn"){ return deviceManger.getSn()}
        // else if(apiName =="getRamSize"){ return deviceManger.getRamSize()}
        // else if(apiName =="getFirmwareVersion"){ return deviceManger.getFirmwareVersion()}
        // else if(apiName =="getBatteryPower"){ return deviceManger.getBatteryPower()}
        // else if(apiName =="getLifeTime"){ return deviceManger.getLifeTime()}
        // else if(apiName =="getBleName"){ return deviceManger.getBleName()}
        // else if(apiName =="setBleName"){ return deviceManger.setBleName()}
        // else if(apiName =="getBleVersion"){ return deviceManger.getBleVersion()}
        // else if(apiName =="activeDevice"){ return deviceManger.activeDevice()}
        // else if(apiName =="checkDevice"){ return deviceManger.checkDevice()}
        // else if(apiName =="checkUpdate"){ return deviceManger.checkUpdate()}
        // else if(apiName =="downloadApplet"){ return deviceManger.downloadApplet()}
        // else if(apiName =="updateApplet"){ return deviceManger.updateApplet()}
        // else if(apiName =="deleteApplet"){ return deviceManger.deleteApplet()}
    // else if(apiName =="deviceBindCheck"){return deviceManger.deviceBindCheck()}
    else if (apiName == "transactionBTC") {
        let response = walletApi.BitcoinTransaction_BTC(json)
        if (response.getTxHash() == "" || response.getTxHash() == null || response.getTxHash().isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                txHash: response.getTxHash(),
                txData: response.getTxData(),
            };
        }
        return result;
    } else if (apiName == "transactionBTCSEGWIT") {
        let response = walletApi.BitcoinTransaction_BTC_SEGWIT(json)
        if (response.getTxHash() == "" || response.getTxHash() == null || response.getTxHash().isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                txHash: response.getTxHash(),
                witnessTxData: response.getWitnessTxData(),
                wtxHash: response.getWtxHash()
            };
        }
        return result;
    } else if (apiName == "transactionBTCUSDT") {
        let response = walletApi.BitcoinTransaction_BTC_USDT(json)
        if (response.getTxHash() == "" || response.getTxHash() == null || response.getTxHash().isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                txHash: response.getTxHash(),
                txData: response.getTxData(),
            };
        }
        return result;
    } else if (apiName == "transactionBTCUSDTSEGWIT") {
        let response = walletApi.BitcoinTransaction_BTC_USDT_SEGWIT(json)
        if (response.getTxHash() == "" || response.getTxHash() == null || response.getTxHash().isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                txHash: response.getTxHash(),
                witnessTxData: response.getWitnessTxData(),
                wtxHash: response.getWtxHash()
            };
        }
        return result;
    } else if (apiName == "transactionETHSIGNTX") {
        let response = walletApi.ETHTransaction_sign_TX(json)
        if (response.getTxHash() == "" || response.getTxHash() == null || response.getTxHash().isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                txHash: response.getTxHash(),
                txData: response.getTxData(),
            };
        }
        return result;
    } else if (apiName == "transactionETHSIGNMSG") {
        let response = walletApi.ETHTransaction_sign_MSG(json)
        if (response.getSignature() == "" || response.getSignature() == null || response.getSignature().isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                signature: response.getSignature(),
            };
        }
        return result;
    } else if (apiName == "transactionEOSSIGNTX") {
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
    } else if (apiName == "transactionEOSSIGNMSG") {
        let response = walletApi.EOSTransaction_sign_MSG(json)
        if (response.getSignature() == "" || response.getSignature() == null || response.getSignature().isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                signature: response.getSignature(),
            };
        }
        return result;
    } else if (apiName == "transactionCOSMOSSIGNTX") {
        let response = walletApi.COSMOSTransaction_sign_TX(json)
        if (response.getTxHash() == "" || response.getTxHash() == null || response.getTxHash().isUndefined) {
            result = {
                error: response,
            };
        } else {
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