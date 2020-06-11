let walletApi = require('./walletapi');
let constants = require('../common/constants');
let deviceManger = require('./devicemanagerapi');
const electron = require('electron');
const filePath = (electron.app || electron.remote.app).getPath('userData') + "/";

export function api(json) {

    let apiName = json.action;
    let result;
    let connectRes = deviceManger.connect(constants.DEVICE_NAME_IMKEY_PRO);
    if (connectRes != constants.RESULT_STATUS_SUCCESS) {
        result = {
            error: connectRes,
        };
        return result;
    } else {
        //检查是否绑定
        let bindCheckRes = deviceManger.deviceBindCheck(filePath);
        if (bindCheckRes != constants.BIND_STATUS_STRING_BOUND_THIS) {
            result = {
                error: "your imKey bind status is "+bindCheckRes+" ,please bind your imKey.",
            };
            return result;
        }
    }

    if (apiName === null || apiName === "" || apiName.isUndefined) {
        result = {
            error: "input api method is null",
        };
        return result;
    }
        // else if(apiName ==="getSeid"){return deviceManger.getSeid()}
        // else if(apiName ==="getSn"){ return deviceManger.getSn()}
        // else if(apiName ==="getRamSize"){ return deviceManger.getRamSize()}
        // else if(apiName ==="getFirmwareVersion"){ return deviceManger.getFirmwareVersion()}
        // else if(apiName ==="getBatteryPower"){ return deviceManger.getBatteryPower()}
        // else if(apiName ==="getLifeTime"){ return deviceManger.getLifeTime()}
        // else if(apiName ==="getBleName"){ return deviceManger.getBleName()}
        // else if(apiName ==="setBleName"){ return deviceManger.setBleName()}
        // else if(apiName ==="getBleVersion"){ return deviceManger.getBleVersion()}
        // else if(apiName ==="activeDevice"){ return deviceManger.activeDevice()}
        // else if(apiName ==="checkDevice"){ return deviceManger.checkDevice()}
        // else if(apiName ==="checkUpdate"){ return deviceManger.checkUpdate()}
        // else if(apiName ==="downloadApplet"){ return deviceManger.downloadApplet()}
        // else if(apiName ==="updateApplet"){ return deviceManger.updateApplet()}
        // else if(apiName ==="deleteApplet"){ return deviceManger.deleteApplet()}
    // else if(apiName ==="deviceBindCheck"){return deviceManger.deviceBindCheck()}
    else if (apiName === constants.API_NAME_TRANSACTION_BTC) {
        let response = walletApi.BitcoinTransaction_BTC(json)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash().isUndefined) {
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
    } else if (apiName === constants.API_NAME_TRANSACTION_BTC_SEGWIT) {
        let response = walletApi.BitcoinTransaction_BTC_SEGWIT(json)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash().isUndefined) {
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
    } else if (apiName === constants.API_NAME_TRANSACTION_BTC_USDT) {
        let response = walletApi.BitcoinTransaction_BTC_USDT(json)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash().isUndefined) {
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
    } else if (apiName === constants.API_NAME_TRANSACTION_BTC_USDT_SEGWIT) {
        let response = walletApi.BitcoinTransaction_BTC_USDT_SEGWIT(json)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash().isUndefined) {
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
    } else if (apiName === constants.API_NAME_TRANSACTION_SIGNTX_ETH) {
        let response = walletApi.ETHTransaction_sign_TX(json)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash().isUndefined) {
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
    } else if (apiName === constants.API_NAME_TRANSACTION_SIGNMSG_ETH) {
        let response = walletApi.ETHTransaction_sign_MSG(json)
        if (response.getSignature() === "" || response.getSignature() === null || response.getSignature().isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                signature: response.getSignature(),
            };
        }
        return result;
    } else if (apiName === constants.API_NAME_TRANSACTION_SIGNTX_EOS) {
        let response = walletApi.EOSTransaction_sign_TX(json)
        if (response.getHash() === "" || response.getHash() === null || response.getHash().isUndefined) {
            result = {
                error: response,
            };
            return result;
        } else {
            let list = [];
            for (let i = 0; i < response.length; i++) {
                let hash = response[i].getHash();
                let signs = response[i].getSignsList();
                result = {
                    hash: hash,
                    signs: signs
                };
                list.push(result);
            }
            return list;
        }
    } else if (apiName === constants.API_NAME_TRANSACTION_SIGNMSG_EOS) {
        let response = walletApi.EOSTransaction_sign_MSG(json)
        if (response.getSignature() === "" || response.getSignature() === null || response.getSignature().isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                signature: response.getSignature(),
            };
        }
        return result;
    } else if (apiName === constants.API_NAME_TRANSACTION_SIGNTX_COSMOS) {
        let response = walletApi.COSMOSTransaction_sign_TX(json)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash().isUndefined) {
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
    } else if (apiName === constants.API_NAME_GET_BTC_XPUB) {
        let response = walletApi.getBTC_Xpub(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                xpub: response,
            };
        }
        return result;
    } else if (apiName === constants.API_NAME_GET_ADDRESS_BTC) {
        let response = walletApi.getBTC_Address(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                address: response,
            };
        }
        return result;
    }  else if (apiName === constants.API_NAME_GET_ADDRESS_BTC_SEGWIT) {
        let response = walletApi.getBTC_SegWitAddress(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                address: response,
            };
        }
        return result;
    }  else if (apiName === constants.API_NAME_REGISTER_ADDRESS_BTC) {
        let response = walletApi.getBTC_RegisterAddress(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                address: response,
            };
        }
        return result;
    }  else if (apiName === constants.API_NAME_REGISTER_ADDRESS_BTC_SEGWIT) {
        let response = walletApi.getBTC_RegisterSegWitAddress(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                address: response,
            };
        }
        return result;
    }  else if (apiName === constants.API_NAME_GET_ADDRESS_ETH) {
        let response = walletApi.getETH_Address(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                address: response,
            };
        }
        return result;
    }  else if (apiName === constants.API_NAME_REGISTER_ADDRESS_ETH) {
        let response = walletApi.getETH_RegisterAddress(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                address: response,
            };
        }
        return result;
    }  else if (apiName === constants.API_NAME_GET_PUBKEY_EOS) {
        let response = walletApi.getEOS_PubKey(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                pubkey: response,
            };
        }
        return result;
    }  else if (apiName === constants.API_NAME_REGISTER_PUBKEY_EOS) {
        let response = walletApi.getEOS_RegisterPubKey(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                pubkey: response,
            };
        }
        return result;
    }  else if (apiName === constants.API_NAME_GET_ADDRESS_COSMOS) {
        let response = walletApi.getCOSMOS_Address(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                address: response,
            };
        }
        return result;
    }  else if (apiName === constants.API_NAME_REGISTER_ADDRESS_COSMOS) {
        let response = walletApi.getCOSMOS_RegisterAddress(json)
        if (response === "" || response === null || response.isUndefined) {
            result = {
                error: response,
            };
        } else {
            result = {
                address: response,
            };
        }
        return result;
    }  else {
        result = {
            error: "not found api method",
        };
        return result;
    }
}