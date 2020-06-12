let walletApi = require('./walletapi');
let constants = require('../common/constants');
let deviceManger = require('./devicemanagerapi');
const electron = require('electron');
const filePath = (electron.app || electron.remote.app).getPath('userData') + "/";

export function api(reqJson) {
    let jsonrpc = reqJson.jsonrpc;
    let id = reqJson.id;
    let method = reqJson.method;
    let params = reqJson.params;
    if (params === null || params === "" || params === undefined) {
        result = {
            "jsonrpc:": jsonrpc,
            error: {
                code: -32600,
                message: "params is null"
            },
            "id:": id
        };
        return result;
    }
    if (method === null || method === "" || method === undefined) {
        result = {
            "jsonrpc:": jsonrpc,
            error: {
                code: -32601,
                message: "method is null"
            },
            "id:": id
        };
        return result;
    }
    let result;
    let connectRes = deviceManger.connect(constants.DEVICE_NAME_IMKEY_PRO);
    if (connectRes != constants.RESULT_STATUS_SUCCESS) {
        result = {
            "jsonrpc:": jsonrpc,
            error: {
                code: -32602,
                message: connectRes
            },
            "id:": id
        };
        return result;
    } else {
        //检查是否绑定
        let bindCheckRes = deviceManger.deviceBindCheck(filePath);
        if (bindCheckRes !== constants.BIND_STATUS_STRING_BOUND_THIS) {
            if (bindCheckRes === constants.BIND_STATUS_STRING_BOUND_OTHER || bindCheckRes === constants.BIND_STATUS_STRING_UNBOUND){
                result = {
                    "jsonrpc:": jsonrpc,
                    error: {
                        code: -32603,
                        message: "your imKey bind status is " + bindCheckRes + " ,please bind your imKey."
                    },
                    "id:": id
                };
            }else{
                result = {
                    "jsonrpc:": jsonrpc,
                    error: {
                        code: -32603,
                        message: bindCheckRes
                    },
                    "id:": id
                };
            }
                
            return result;
        }
    }


    // else if(method ==="getSeid"){return deviceManger.getSeid()}
    // else if(method ==="getSn"){ return deviceManger.getSn()}
    // else if(method ==="getRamSize"){ return deviceManger.getRamSize()}
    // else if(method ==="getFirmwareVersion"){ return deviceManger.getFirmwareVersion()}
    // else if(method ==="getBatteryPower"){ return deviceManger.getBatteryPower()}
    // else if(method ==="getLifeTime"){ return deviceManger.getLifeTime()}
    // else if(method ==="getBleName"){ return deviceManger.getBleName()}
    // else if(method ==="setBleName"){ return deviceManger.setBleName()}
    // else if(method ==="getBleVersion"){ return deviceManger.getBleVersion()}
    // else if(method ==="activeDevice"){ return deviceManger.activeDevice()}
    // else if(method ==="checkDevice"){ return deviceManger.checkDevice()}
    // else if(method ==="checkUpdate"){ return deviceManger.checkUpdate()}
    // else if(method ==="downloadApplet"){ return deviceManger.downloadApplet()}
    // else if(method ==="updateApplet"){ return deviceManger.updateApplet()}
    // else if(method ==="deleteApplet"){ return deviceManger.deleteApplet()}
    // else if(method ==="deviceBindCheck"){return deviceManger.deviceBindCheck()}
    if (method === constants.API_NAME_TRANSACTION_BTC) {
        let response = walletApi.BitcoinTransaction_BTC(params)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash() === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    txHash: response.getTxHash(),
                    txData: response.getTxData(),
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_TRANSACTION_BTC_SEGWIT) {
        let response = walletApi.BitcoinTransaction_BTC_SEGWIT(params)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash() === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    txHash: response.getTxHash(),
                    witnessTxData: response.getWitnessTxData(),
                    wtxHash: response.getWtxHash()
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_TRANSACTION_BTC_USDT) {
        let response = walletApi.BitcoinTransaction_BTC_USDT(params)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash() === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    txHash: response.getTxHash(),
                    txData: response.getTxData(),
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_TRANSACTION_BTC_USDT_SEGWIT) {
        let response = walletApi.BitcoinTransaction_BTC_USDT_SEGWIT(params)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash() === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    txHash: response.getTxHash(),
                    witnessTxData: response.getWitnessTxData(),
                    wtxHash: response.getWtxHash()
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_ETH) {
        let response = walletApi.ETHTransaction_sign_TX(params)
        if (response.getTxHash() === "" || response.getTxHash() === null || response.getTxHash() === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    txHash: response.getTxHash(),
                    txData: response.getTxData(),
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_TRANSACTION_SIGNMSG_ETH) {
        let response = walletApi.ETHTransaction_sign_MSG(params)
        if (response.getSignature() === "" || response.getSignature() === null || response.getSignature() === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    signature: response.getSignature(),
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_EOS) {
        let response = walletApi.EOSTransaction_sign_TX(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
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
            return {"jsonrpc:": jsonrpc, result: {list}, "id:": id};
        }
    } else if (method === constants.API_NAME_TRANSACTION_SIGNMSG_EOS) {
        let response = walletApi.EOSTransaction_sign_MSG(params)
        if (response.getSignature() === "" || response.getSignature() === null || response.getSignature() === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    signature: response.getSignature(),
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_TRANSACTION_SIGNTX_COSMOS) {
        let response = walletApi.COSMOSTransaction_sign_TX(params)
        if (response.getTxData() === "" || response.getTxData() === null || response.getTxData() === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    txHash: response.getTxHash(),
                    txData: response.getTxData(),
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_GET_BTC_XPUB) {
        let response = walletApi.getBTC_Xpub(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    xpub: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_GET_ADDRESS_BTC) {
        let response = walletApi.getBTC_Address(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    address: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_GET_ADDRESS_BTC_SEGWIT) {
        let response = walletApi.getBTC_SegWitAddress(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    address: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_REGISTER_ADDRESS_BTC) {
        let response = walletApi.getBTC_RegisterAddress(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    address: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_REGISTER_ADDRESS_BTC_SEGWIT) {
        let response = walletApi.getBTC_RegisterSegWitAddress(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    address: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_GET_ADDRESS_ETH) {
        let response = walletApi.getETH_Address(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    address: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_REGISTER_ADDRESS_ETH) {
        let response = walletApi.getETH_RegisterAddress(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    address: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_GET_PUBKEY_EOS) {
        let response = walletApi.getEOS_PubKey(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    pubkey: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_REGISTER_PUBKEY_EOS) {
        let response = walletApi.getEOS_RegisterPubKey(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    pubkey: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_GET_ADDRESS_COSMOS) {
        let response = walletApi.getCOSMOS_Address(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    address: response,
                },
                "id:": id
            };
        }
        return result;
    } else if (method === constants.API_NAME_REGISTER_ADDRESS_COSMOS) {
        let response = walletApi.getCOSMOS_RegisterAddress(params)
        if (response === "" || response === null || response === undefined) {
            result = {
                "jsonrpc:": jsonrpc,
                error: {
                    code: -32604,
                    message: response
                },
                "id:": id
            };
        } else {
            result = {
                "jsonrpc:": jsonrpc,
                result: {
                    address: response,
                },
                "id:": id
            };
        }
        return result;
    } else {
        result = {
            "jsonrpc:": jsonrpc,
            error: {
                code: -32605,
                message: "Invalid API key",
            },
            "id:": id
        };
        return result;
    }
}