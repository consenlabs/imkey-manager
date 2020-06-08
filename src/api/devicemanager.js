let api_pb = require('../proto/api_pb');
let _ = require('lodash');
let device_pb = require('../proto/device_pb');
let callImKeyCore = require('./callimkeycore');
let constants = require('../common/constants');

function connect(deviceModelName) {

    let request = new device_pb.DeviceConnectReq();
    request.setDeviceModelName(deviceModelName);
    let requestBytes = request.serializeBinary();
    let any = new proto.google.protobuf.Any();
    any.setValue(requestBytes);
    let imKeyAction = new api_pb.ImkeyAction();
    imKeyAction.setMethod("device_connect");
    imKeyAction.setParam(any);
    let imKeyActionBytes = imKeyAction.serializeBinary();
    let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes));
    let error = callImKeyCore.get_last_err_message();
    if (error == "" || error == null) {
        let response = new api_pb.CommonResponse.deserializeBinary(hexStr2Bytes(resBuffer));
        return response.getResult();
    } else {
        let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error));
        return errorResponse.getError();
    }
}

function getDeviceManageFunction(method_) {
    let imKeyAction = new api_pb.ImkeyAction();
    imKeyAction.setMethod(method_);
    let imKeyActionBytes = imKeyAction.serializeBinary();
    let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes));
    let error = callImKeyCore.get_last_err_message();
    let result;
    if (error == "" || error == null) {
        if (method_ === "get_seid") {
            let response = new device_pb.GetSeidRes.deserializeBinary(hexStr2Bytes(resBuffer));
            result = response.getSeid();

        } else if (method_ === "get_sn") {
            let response = new device_pb.GetSnRes.deserializeBinary(hexStr2Bytes(resBuffer));
            result = response.getSn();
        } else if (method_ === "get_ram_size") {
            let response = new device_pb.GetRamSizeRes.deserializeBinary(hexStr2Bytes(resBuffer));
            result = response.getRamSize();
        } else if (method_ === "get_firmware_version") {
            let response = new device_pb.GetFirmwareVersionRes.deserializeBinary(hexStr2Bytes(resBuffer));
            result = response.getFirmwareVersion();
        }  else if (method_ === "get_sdk_info") {
            let response = new device_pb.GetSdkInfoRes.deserializeBinary(hexStr2Bytes(resBuffer));
            result = response.getSdkVersion();
        } else if (method_ === "check_update") {
            let response = new device_pb.CheckUpdateRes.deserializeBinary(hexStr2Bytes(resBuffer));
            result = response.toObject();
        } else if (method_ === "cos_check_update") {
            let response = new device_pb.CosCheckUpdateRes.deserializeBinary(hexStr2Bytes(resBuffer));
            result = response.toObject();
        } else if (method_ === "is_bl_status") {
            let response = new device_pb.IsBlStatusRes.deserializeBinary(hexStr2Bytes(resBuffer));
            result = response.getCheckResult();
        } else {//method_ === "device_activate"||"device_secure_check"||"bind_display_code"
                let response = new api_pb.CommonResponse.deserializeBinary(hexStr2Bytes(resBuffer));
                result =  response.getResult();
        }
        return result;
    } else {
        let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error));
        return errorResponse.getError();
    }
}

function AppletManage(method_, appName) {
    let request;
    if (method_ == "app_download") {
        request = new device_pb.AppDownloadReq();
        request.setAppName(appName);
    }
    if (method_ == "app_update") {
        request = new device_pb.AppUpdateReq();
        request.setAppName(appName);
    }
    if (method_ == "app_delete") {
        request = new device_pb.AppDeleteReq();
        request.setAppName(appName);
    }
    let requestBytes = request.serializeBinary();
    let any = new proto.google.protobuf.Any();
    any.setValue(requestBytes);

    let imKeyAction = new api_pb.ImkeyAction();
    imKeyAction.setMethod(method_);
    imKeyAction.setParam(any);
    let imKeyActionBytes = imKeyAction.serializeBinary();

    let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes));
    let error = callImKeyCore.get_last_err_message();
    if (error == "" || error == null) {
        let response = new api_pb.CommonResponse.deserializeBinary(hexStr2Bytes(resBuffer));
        return response.getResult();
    } else {
        let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error));
        return errorResponse.getError();
    }

}

function bindCheck(filePath) {
    let bindCheckReq = new device_pb.BindCheckReq();
    bindCheckReq.setFilePath(filePath);
    let bindCheckReqBytes = bindCheckReq.serializeBinary();

    let any = new proto.google.protobuf.Any();
    any.setValue(bindCheckReqBytes);


    let imKeyAction = new api_pb.ImkeyAction();
    imKeyAction.setMethod("bind_check");
    imKeyAction.setParam(any);
    let imKeyActionBytes = imKeyAction.serializeBinary();

    let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes));

    let error = callImKeyCore.get_last_err_message();
    if (error == "" || error == null) {
        let response = new device_pb.BindCheckRes.deserializeBinary(hexStr2Bytes(resBuffer));
        return response.getBindStatus();
    } else {
        let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error));
        return errorResponse.getError();
    }
}

function bindAcquire(bindCode) {
    let bindAcquireReq = new device_pb.BindAcquireReq();
    bindAcquireReq.setBindCode(bindCode);
    let bindAcquireReqBytes = bindAcquireReq.serializeBinary();

    let any = new proto.google.protobuf.Any();
    any.setValue(bindAcquireReqBytes);


    let imKeyAction = new api_pb.ImkeyAction();
    imKeyAction.setMethod("bind_acquire");
    imKeyAction.setParam(any);
    let imKeyActionBytes = imKeyAction.serializeBinary();

    let resBuffer = callImKeyCore.call_imkey_api(bytes2HexStr(imKeyActionBytes));

    let error = callImKeyCore.get_last_err_message();
    if (error == "" || error == null) {
        let response = new device_pb.BindAcquireRes.deserializeBinary(hexStr2Bytes(resBuffer));
            return response.getBindResult();
    } else {
        let errorResponse = new api_pb.ErrorResponse.deserializeBinary(hexStr2Bytes(error));
        return errorResponse.getError();
    }
}

export function checkUpdate() {
    return new Promise((resolve, reject) => {
        try {
            let response = getDeviceManageFunction("check_update");
            let collections = response.availableAppListList;
                let list = [];
            let installLoading;
            let installDis;
            let deleteDis;
            let deleteLoading;
            let buttonTexts;
            for (let i = 0; i < collections.length; i++) {
                //过滤imkey Applet 不显示IMK applet

                    if (collections[i].installedVersion != "none" || collections[i].installedVersion != null) {
                        installLoading = false;
                        installDis = true;
                        deleteDis = false;
                        deleteLoading = false;
                    } else {
                        installLoading = false;
                        installDis = false;
                        deleteDis = true;
                        deleteLoading = false;
                    }

                    if(collections[i].latestVersion == collections[i].installedVersion){
                        buttonTexts = "update";
                    }else{
                        buttonTexts = "install";
                    }
                if (collections[i].appName == "IMK" || collections[i].appName == "BTC"){
                    deleteDis = true;
                }
                    let collection = {
                        name: collections[i].appName,
                        desc: "version " + collections[i].installedVersion,
                        id: i,
                        installLoading: installLoading,
                        installDis: installDis,
                        deleteDis: deleteDis,
                        deleteLoading: deleteLoading,
                        icon: collections[i].appLogo,
                        buttonTexts:buttonTexts,
                    };
                    list.push(collection);

            }
            let total = list.length;
            let status = response.status;
            resolve({
                code: 200,
                data: _.cloneDeep({status:status,total: total, list: list})
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function connectDevice() {
    return new Promise((resolve, reject) => {
        try {

            resolve({
                code: 200,
                data: connect(constants.DEVICE_NAME_IMKEY_PRO)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getSeid() {

    return new Promise((resolve, reject) => {
        try {

            resolve({
                code: 200,
                data: getDeviceManageFunction("get_seid")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getSn() {

    return new Promise((resolve, reject) => {
        try {

            resolve({
                code: 200,
                data: getDeviceManageFunction("get_sn")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getRamSize() {

    return new Promise((resolve, reject) => {
        try {

            resolve({
                code: 200,
                data: parseInt(getDeviceManageFunction("get_ram_size").substring(4, 8), 16)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getFirmwareVersion() {

    return new Promise((resolve, reject) => {
        try {
            let FirmwareVersion = getDeviceManageFunction("get_firmware_version");
            resolve({
                code: 200,
                data: FirmwareVersion.substring(0, 1) + "." + FirmwareVersion.substring(1, 2) + "." + FirmwareVersion.substring(2)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}
export function isBLStatus() {

    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDeviceManageFunction("is_bl_status")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getSdkInfo() {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDeviceManageFunction("get_sdk_info")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function activeDevice() {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDeviceManageFunction("device_activate")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function cosCheckUpdate() {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDeviceManageFunction("cos_check_update")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function cosUpdate() {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDeviceManageFunction("cos_update")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function checkDevice() {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDeviceManageFunction("device_secure_check")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

// export function checkUpdate() {
//     return new Promise((resolve, reject) => {
//         try {
//             resolve({
//                 code: 200,
//                 data: getDeviceManageFunction("check_update")
//             })
//         } catch (err) {
//             return reject({
//                 code: 400,
//                 message: err.message
//             })
//         }
//     })
// }

export function downloadApplet(AppName) {
    console.log("AppName:" + AppName)
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: AppletManage("app_download", AppName)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function updateApplet(AppName) {
    console.log("AppName:" + AppName)
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: AppletManage("app_update", AppName)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function deleteApplet(AppName) {
    console.log("AppName:" + AppName)
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: AppletManage("app_delete", AppName)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function deviceBindCheck(filePath) {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: bindCheck(filePath)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function deviceBindAcquire(bindCode) {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: bindAcquire(bindCode.toUpperCase())
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function deviceBindDisplay() {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDeviceManageFunction("bind_display_code")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getUserPath() {

    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: require("path").resolve('./')
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

/**
 * @desc 二进制数组转字符串
 */
function Bytes2Str(arr) {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        let tmp = String.fromCharCode(arr[i]);
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
function bytes2HexStr(arr) {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        let tmp = arr[i].toString(16);
        if (tmp.length === 1) {
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
}

/*
* @desc 十六进制字符串转二进制数组
*/
function hexStr2Bytes(str) {
    let pos = 0;
    let len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    let hexA = new Array();
    for (let i = 0; i < len; i++) {
        let s = str.substr(pos, 2);
        let v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}
