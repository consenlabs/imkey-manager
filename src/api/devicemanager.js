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

function connect(deviceModelName) {

    let Req = new device_pb.DeviceConnectReq();
    Req.setDeviceModelName(deviceModelName);

    let ReqBytes = Req.serializeBinary();
    //any
    let any1 = new proto.google.protobuf.Any();
    any1.setValue(ReqBytes);
    //ImkeyAction
    let ImkeyAction = new api_pb.ImkeyAction();
    ImkeyAction.setMethod("device_connect");
    ImkeyAction.setParam(any1);
    let ImkeyActionBytes = ImkeyAction.serializeBinary();

    //调用rust库
    let ResBuffer = GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {

        //rust库返回的数据解析
        let Response = new api_pb.Response.deserializeBinary(HexStr2Bytes(ResBuffer));
        let Result = Response.getError();
        //获取解析后的值
        if (Result == null || Result == '' || Result == "") {
            Result = 'true';
        }
        return Result;

    } else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}

function getDevice_manage_fuc(method_) {

    //connect

    //ImkeyAction
    let ImkeyAction = new api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    let ImkeyActionBytes = ImkeyAction.serializeBinary();

    //调用rust库
    let ResBuffer = GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {
        if (method_ === "get_seid") {
            let Response = new device_pb.GetSeidRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getSeid();
            return Result;
        } else if (method_ === "get_sn") {
            let Response = new device_pb.GetSnRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getSn();
            return Result;
        } else if (method_ === "get_ram_size") {
            let Response = new device_pb.GetRamSizeRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getRamSize();
            return Result;
        } else if (method_ === "get_firmware_version") {
            let Response = new device_pb.GetFirmwareVersionRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getFirmwareVersion();
            return Result;
        } else if (method_ === "get_battery_power") {
            let Response = new device_pb.GetBatteryPowerRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getBatteryPower();
            return Result;
        } else if (method_ === "get_life_time") {
            let Response = new device_pb.GetLifeTimeRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getLifeTime();
            return Result;
        } else if (method_ === "get_ble_name") {
            let Response = new device_pb.GetBleNameRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getBleName();
            return Result;
        } else if (method_ === "set_ble_name") {
            let Response = new device_pb.SetBleNameReq.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getBleName();
            return Result;
        } else if (method_ === "get_ble_version") {
            let Response = new device_pb.GetBleVersionRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getBleVersion();
            return Result;
        } else if (method_ === "get_sdk_info") {
            let Response = new device_pb.GetSdkInfoRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getSdkVersion();
            return Result;
        } else if (method_ === "check_update" ) {
            let Response = new device_pb.CheckUpdateRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            console.log(Response)
            //获取解析后的值
            let Result = Response.toObject();
            return Result;
        } else if (method_ === "cos_check_update" ) {
            let Response = new device_pb.CosCheckUpdateRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            console.log(Response)
            //获取解析后的值
            let Result = Response.toObject();
            return Result;
        } else {//method_ === "device_activate"||"device_secure_check"||"bind_display_code"
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
        return ErrorResponse.getError();
    }
}

function AppletManage(method_, appName) {
    let Req;
    if (method_ == "app_download") {
        Req = new device_pb.AppDownloadReq();
        Req.setAppName(appName);
    }
    if (method_ == "app_update") {
        Req = new device_pb.AppUpdateReq();
        Req.setAppName(appName);
    }
    if (method_ == "app_delete") {
        Req = new device_pb.AppDeleteReq();
        Req.setAppName(appName);
    }
    let ReqBytes = Req.serializeBinary();
    //any
    let any1 = new proto.google.protobuf.Any();
    any1.setValue(ReqBytes);
    //ImkeyAction
    let ImkeyAction = new api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    ImkeyAction.setParam(any1);
    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer = GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
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
        return ErrorResponse.getError();
    }

}

function bindCheck(FilePath) {
    console.log("==============FilePath:" + FilePath)
    //BindCheckReq
    let BindCheckReq = new device_pb.BindCheckReq();
    BindCheckReq.setFilePath(FilePath);
    let BindCheckReqBytes = BindCheckReq.serializeBinary();
    //any
    let any = new proto.google.protobuf.Any();
    any.setValue(BindCheckReqBytes);

    //ImkeyAction
    let ImkeyAction = new api_pb.ImkeyAction();
    ImkeyAction.setMethod("bind_check");
    ImkeyAction.setParam(any);
    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer = GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {
        let Response = new device_pb.BindCheckRes.deserializeBinary(HexStr2Bytes(ResBuffer));
        // console.log(" Response.getBindStatus():" + Response.getBindStatus())
        return Response.getBindStatus();
    } else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}

function bindAcquire(bindCode) {
    //BindAcquireReq
    let BindAcquireReq = new device_pb.BindAcquireReq();
    BindAcquireReq.setBindCode(bindCode);
    let BindCheckReqBytes = BindAcquireReq.serializeBinary();
    //any
    let any = new proto.google.protobuf.Any();
    any.setValue(BindCheckReqBytes);

    //ImkeyAction
    let ImkeyAction = new api_pb.ImkeyAction();
    ImkeyAction.setMethod("bind_acquire");
    ImkeyAction.setParam(any);
    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer = GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if (Error == "" || Error == null) {
        let Response = new device_pb.BindAcquireRes.deserializeBinary(HexStr2Bytes(ResBuffer));
        // console.log(" Response.getBindResult():" + Response.getBindResult())
        if (Response.getBindResult() == "success") {
            return "true"
        } else {
            return Response.getBindResult();
        }

    } else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}

export function getAppList() {
    return new Promise((resolve, reject) => {
        try {
            // console.log("checkUpdate():"+getDevice_manage_device("check_update"))
            let collections = getDevice_manage_fuc("check_update").availableAppListList;
            let list = [];
            // console.log("collections:"+JSON.stringify(collections))
            let installLoding;
            let installDis;
            let deletDis;
            let deletLoding;
            for (let i = 0; i < collections.length; i++) {
                //过滤imkey Applet 不显示IMK applet
                if (collections[i].appName != "IMK") {
                    if (collections[i].installedVersion != "none" || collections[i].installedVersion != null) {
                        installLoding = false;
                        installDis = true;
                        deletDis = false;
                        deletLoding = false;
                    } else {
                        installLoding = false;
                        installDis = false;
                        deletDis = true;
                        deletLoding = false;
                    }
                    let collection = {
                        name: collections[i].appName,
                        desc: "version " + collections[i].latestVersion,
                        id: i,
                        installLoding: installLoding,
                        installDis: installDis,
                        deletDis: deletDis,
                        deletLoding: deletLoding,
                        icon: collections[i].appLogo,
                    };
                    list.push(collection);
                }

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

export function connect_device() {
    return new Promise((resolve, reject) => {
        try {

            resolve({
                code: 200,
                data: connect("imKey Pro")
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
                data: getDevice_manage_fuc("get_ble_name")
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
                data: getDevice_manage_fuc("device_activate")
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
                data: getDevice_manage_fuc("cos_check_update")
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
                data: getDevice_manage_fuc("cos_update")
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
                data: getDevice_manage_fuc("device_secure_check")
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
                data: getDevice_manage_fuc("check_update")
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

export function deviceBindCheck(FilePath) {
    console.log("FilePath:" + FilePath)
    return new Promise((resolve, reject) => {
        try {
            resolve({
                code: 200,
                data: bindCheck(FilePath)
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
                data: getDevice_manage_fuc("bind_display_code")
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
