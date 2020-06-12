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
let _ = require('lodash');
let device_pb = require('../proto/device_pb');
let GoToRust = require('./gotorust');
let Constants = require('../common/Constants');

function getDevice_manage_fuc(action_) {
    // console.log(" process.versions.node:"+process.versions.node);
    //deviceParam
    let deviceParam = new api_pb.DeviceParam();

    deviceParam.setAction(action_);
    deviceParam.setParam(null);
    let deviceParamBytes = deviceParam.serializeBinary();
    //any
    let any = new proto.google.protobuf.Any();
    any.setValue(deviceParamBytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction = new api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any);
    let TcxActionBytes = TcxAction.serializeBinary();

    //调用rust库
    let ResBuffer = GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {
        if (action_ === "get_sn") {
            let Response = new device_pb.GetSnResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getSn();
            return Result;
        } else if (action_ === "get_sdk_info") {
            let Response = new device_pb.SdkInfoResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getSdkVersion();
            return Result;
        } else {
            //rust库返回的数据解析
            let Response = new device_pb.ApduResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
            // //获取解析后的值
            let Result = Response.getResult();
            // console.log("Result:"+Result)
            return Result;
        }
    } else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log(" ErrorResponse.getError():" + ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}

function getDevice_manage_device(action_) {

    //deviceParam
    let deviceParam = new api_pb.DeviceParam();
    deviceParam.setAction(action_);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 = new proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction = new api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer = GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {
        if (action_ == "check_update") {
            //rust库返回的数据解析
            let CheckUpdateResponse = new device_pb.CheckUpdateResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
            return CheckUpdateResponse.toObject();
        } else {
            //rust库返回的数据解析
            let Response = new api_pb.Response.deserializeBinary(HexStr2Bytes(ResBuffer));
            let Result = Response.getError();
            //获取解析后的值
            if (Result == null || Result == '' || Result == "") {
                Result = 'true';
            } else {
                Result = 'false';
            }
            return Result;
        }
    } else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log(" ErrorResponse.getError():" + ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}

function getDevice_manage_Applet(action, AppName) {

    //AppAction
    let AppAction = new device_pb.AppAction();
    AppAction.setAppName(AppName);
    let AppActionBytes = AppAction.serializeBinary();
    //any
    let any = new proto.google.protobuf.Any();
    any.setValue(AppActionBytes);
    //deviceParam
    let deviceParam = new api_pb.DeviceParam();
    deviceParam.setAction(action);
    deviceParam.setParam(any);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 = new proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction = new api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer = GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    //rust库返回的数据解析
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {
        //rust库返回的数据解析
        let Response = new api_pb.Response.deserializeBinary(HexStr2Bytes(ResBuffer));
        let Result = Response.getError();
        //获取解析后的值
        if (Result == null || Result == '' || Result == "") {
            Result = 'true';
        } else {
            Result = 'false';
        }
        return Result;
    } else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log(" ErrorResponse.getError():" + ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}

function getDevice_manage_bind_check(FilePath) {
    //BindCheck
    let BindCheck = new device_pb.BindCheck();
    BindCheck.setFilePath(FilePath);
    let BindCheckBytes = BindCheck.serializeBinary();
    //any
    let any = new proto.google.protobuf.Any();
    any.setValue(BindCheckBytes);
    //deviceParam
    let deviceParam = new api_pb.DeviceParam();
    deviceParam.setAction("bind_check");
    deviceParam.setParam(any);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 = new proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction = new api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer = GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {
        let Response = new device_pb.BindCheckResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
        console.log(" Response.getBindStatus():" + Response.getBindStatus())
        return Response.getBindStatus();
    } else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log(" ErrorResponse.getError():" + ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}

function getDevice_manage_bind_acquire(bindCode) {
    console.log("bindCode:" + bindCode)
    //BindAcquire
    let BindAcquire = new device_pb.BindAcquire();
    BindAcquire.setBindCode(bindCode.toString().toLocaleUpperCase());
    let BindAcquireBytes = BindAcquire.serializeBinary();
    //any
    let any = new proto.google.protobuf.Any();
    any.setValue(BindAcquireBytes);
    //deviceParam
    let deviceParam = new api_pb.DeviceParam();
    deviceParam.setAction("bind_acquire");
    deviceParam.setParam(any);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 = new proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction = new api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer = GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {
        let Response = new device_pb.BindAcquireResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
        console.log(" Response.getBindResult():" + Response.getBindResult())
        if (Response.getBindResult().substring(0, 2) == "5A") {
            return 'true';
        } else if (Response.getBindResult().substring(0, 2) == "A5") {
            return 'false';
        } else {
            return 'false';
        }

    } else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log("ErrorResponse.getError()：" + ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}

function getDevice_manage_bind_display() {
    //
    let BindDisplay = new device_pb.BindDisplay();
    let BindDisplayBytes = BindDisplay.serializeBinary();
    //any
    let any = new proto.google.protobuf.Any();
    any.setValue(BindDisplayBytes);
    //deviceParam
    let deviceParam = new api_pb.DeviceParam();
    deviceParam.setAction("bind_display");
    deviceParam.setParam(any);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 = new proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction = new api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer = GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {
        let Response = new device_pb.BindDisplayResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
        console.log(" Response.getBindDisplayResult():" + Response.getBindDisplayResult())
        if (Response.getBindDisplayResult() == null || Response.getBindDisplayResult() == "") {
            return 'true'
        } else {
            return 'false'
        }
    } else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        console.log(" ErrorResponse.getError():" + ErrorResponse.getError())
        return ErrorResponse.getError();
    }
}

export function getAppList() {
    return new Promise((resolve, reject) => {
        try {
            // console.log("checkUpdate():"+getDevice_manage_device("check_update"))
            let collections = getDevice_manage_device("check_update").availableAppListList;
            let list = [];
            // console.log("collections:"+JSON.stringify(collections))
            for (let i = 0; i < collections.length; i++) {
                let collection = {
                    name: collections[i].appName,
                    version: collections[i].installedVersion
                };
                list.push(collection);
            }
            let total = list.length;
            console.log("result.data.list:" + list)
            console.log("total:" + total)
            // let list = collection
            //     .filter(filterFun)
            //     .orderBy(pagination.sortBy, pagination.descending ? 'desc' : 'asc')
            //     .chunk(pagination.rowsPerPage === -1 ? total : pagination.rowsPerPage)
            //     .take(pagination.page)
            //     .last() // 因为上面用了chunk，是个二维数组，所以这里取最后一个
            //     .value()
            resolve({
                code: 200,
                data: _.cloneDeep({total: total, list: list})
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
                data: getDevice_manage_fuc("get_seid")
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
                data: getDevice_manage_fuc("get_sn")
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
                data: parseInt(getDevice_manage_fuc("get_ram_size").substring(4, 8), 16)
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
            let FirmwareVersion = getDevice_manage_fuc("get_firmware_version");
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

export function getBatteryPower() {
    return new Promise((resolve, reject) => {
        try {
            let batteryPower = getDevice_manage_fuc("get_battery_power");
            if (batteryPower != Constants.BATTERY_CHARGING_SIGN) {
                batteryPower = parseInt(batteryPower, 16).toString();
            } else {
                return reject({
                    code: 400,
                    message: 'error'
                })
            }
            resolve({
                code: 200,
                data: batteryPower
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getLifeTime() {
    return new Promise((resolve, reject) => {
        try {
            let res = getDevice_manage_fuc("get_life_time");
            let res_ = "";
            switch (res) {
                case "80":
                    res_ = Constants.LIFE_TIME_DEVICE_INITED;
                case "89":
                    res_ = Constants.LIFE_TIME_DEVICE_ACTIVATED;
                case "81":
                    res_ = Constants.LIFE_TIME_UNSET_PIN;
                case "83":
                    res_ = Constants.LIFE_TIME_WALLET_UNREADY;
                case "84":
                    res_ = Constants.LIFE_TIME_WALLET_CREATTING;
                case "85":
                    res_ = Constants.LIFE_TIME_WALLET_RECOVERING;
                case "86":
                    res_ = Constants.LIFE_TIME_WALLET_READY;
                default:
                    res_ = Constants.LIFE_TIME_UNKNOWN;
            }
            resolve({
                code: 200,
                data: res_
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getBleName() {
    return new Promise((resolve, reject) => {
        try {

            resolve({
                code: 200,
                data: Bytes2Str(HexStr2Bytes(getDevice_manage_fuc("get_ble_name").substring(4)))
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function setBleName() {
    return new Promise((resolve, reject) => {
        try {

            resolve({
                code: 200,
                data: getDevice_manage_fuc("set_ble_name")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getBleVersion() {
    return new Promise((resolve, reject) => {
        try {
            let bleVersion = getDevice_manage_fuc("get_ble_version").substring(0, 4);
            resolve({
                code: 200,
                data: bleVersion.substring(0, 1) + "." + bleVersion.substring(1, 2) + "." + bleVersion.substring(2)
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
                data: getDevice_manage_fuc("get_sdk_info")
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
                data: getDevice_manage_device("se_activate")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function cosUpgrade() {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDevice_manage_device("cos_upgrade")
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
                data: getDevice_manage_device("se_secure_check")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function checkUpdate() {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDevice_manage_device("check_update")
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function downloadApplet(AppName) {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDevice_manage_Applet("app_download", AppName)
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
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDevice_manage_Applet("app_update", AppName)
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
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDevice_manage_Applet("app_delete", AppName)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function deviceBindCheck(FilePath) {
    console.log("FilePath:" + FilePath)
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: getDevice_manage_bind_check("bind_check", FilePath)
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
                data: getDevice_manage_bind_acquire(bindCode)
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
                data: getDevice_manage_bind_display()
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

// console.log( "getSeid:"+getSeid());
// console.log( "getSn:"+getSn());
// console.log( "getRamSize:"+getRamSize());
// console.log( "getFirmwareVersion:"+getFirmwareVersion());
// console.log( "getBatteryPower:"+getBatteryPower());
// console.log( "getLifeTime:"+getLifeTime());
// console.log( "getBleName:"+getBleName());
// console.log( "setBleName:"+setBleName());
// console.log( "getBleVersion:"+getBleVersion());


// console.log( "activeDevice:"+activeDevice());
// console.log( "checkDevice:"+checkDevice());
// console.log( "checkUpdate:"+checkUpdate());
// console.log( "downloadApplet:"+downloadApplet());
// console.log( "updateApplet:"+updateApplet());
// console.log( "deleteApplet:"+deleteApplet());

// module.exports = {
//     getSeid1,
//     getSeid,
//     getSn,
//     getRamSize,
//     getFirmwareVersion,
//     getBatteryPower,
//     getLifeTime,
//     getBleName,
//     setBleName,
//     getBleVersion,
//     activeDevice,
//     checkDevice,
//     checkUpdate,
//     downloadApplet,
//     updateApplet,
//     deleteApplet,
// }
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
function Bytes2HexStr(arr) {
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
function HexStr2Bytes(str) {
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
