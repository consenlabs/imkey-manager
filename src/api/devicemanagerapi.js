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
let device_pb = require('../proto/device_pb');
let GoToRust = require('./gotorust');
let Constants = require('../common/Constants');
let path = require('path');
function getDevice_manage_fuc(method_) {

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    let ImkeyActionBytes = ImkeyAction.serializeBinary();

    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
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
        }else if (method_ === "get_sdk_info") {
            let Response = new device_pb.GetSdkInfoRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.getSdkVersion();
            return Result;
        }else if (method_ === "check_update") {
            let Response = new device_pb.CheckUpdateRes.deserializeBinary(HexStr2Bytes(ResBuffer));
            //获取解析后的值
            let Result = Response.toObject();
            return Result;
        }else {//method_ === "device_activate"||"device_secure_check"||"bind_display_code"
            //rust库返回的数据解析
            let Response = new api_pb.Response.deserializeBinary(HexStr2Bytes(ResBuffer));
            let Result = Response.getError();
            //获取解析后的值
            if(Result==null || Result==''||Result==""){
                Result= 'true';
            }else{
                Result= 'false';
            }
            return Result;
        }
    }else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}
function  AppletManage(method_,appName) {
    let Req;
    if(method_=="app_download") {
        Req = new device_pb.AppDownloadReq();
        Req.setAppName(appName);
    }
    if(method_=="app_update") {
        Req = new device_pb.AppUpdateReq();
        Req.setAppName(appName);
    }
    if(method_=="app_delete") {
        Req = new device_pb.AppDeleteReq();
        Req.setAppName(appName);
    }
    let ReqBytes = Req.serializeBinary();
    //any
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(ReqBytes);
    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod(method_);
    ImkeyAction.setParam(any1);
    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {

        //rust库返回的数据解析
        let Response = new api_pb.Response.deserializeBinary(HexStr2Bytes(ResBuffer));
        let Result = Response.getError();
        //获取解析后的值
        if(Result==null || Result==''||Result==""){
            Result= 'true';
        }else{
            Result= 'false';
        }
        return Result;

    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }

}

function bindCheck(FilePath) {
    console.log("=================FilePath=============:"+FilePath)
    //BindCheckReq
    let BindCheckReq =new  device_pb.BindCheckReq();
    BindCheckReq.setFilePath(FilePath);
    let BindCheckReqBytes = BindCheckReq.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(BindCheckReqBytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod("bind_check");
    ImkeyAction.setParam(any);
    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        let Response = new device_pb.BindCheckRes.deserializeBinary(HexStr2Bytes(ResBuffer));
        // console.log(" Response.getBindStatus():" + Response.getBindStatus())
        return Response.getBindStatus();
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}
function bindAcquire(bindCode) {
    //BindAcquireReq
    let BindAcquireReq =new  device_pb.BindAcquireReq();
    BindAcquireReq.setBindCode(bindCode);
    let BindCheckReqBytes = BindAcquireReq.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(BindCheckReqBytes);

    //ImkeyAction
    let ImkeyAction =new  api_pb.ImkeyAction();
    ImkeyAction.setMethod("bind_acquire");
    ImkeyAction.setParam(any);
    let ImkeyActionBytes = ImkeyAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_imkey_api(Bytes2HexStr(ImkeyActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        let Response = new device_pb.BindAcquireRes.deserializeBinary(HexStr2Bytes(ResBuffer));
        // console.log(" Response.getBindResult():" + Response.getBindResult())
        if(Response.getBindResult()=="success"){
            return "true"
        }else{
            return  Response.getBindResult();
        }

    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}


function getSeid() {
    return getDevice_manage_fuc("get_seid");
}
function getSn() {
    return getDevice_manage_fuc("get_sn");
}
function getRamSize() {
    return parseInt(getDevice_manage_fuc("get_ram_size").substring(4,8),16);
}
function getFirmwareVersion() {
    let FirmwareVersion = getDevice_manage_fuc("get_firmware_version");
    return FirmwareVersion.substring(0,1)+"."+FirmwareVersion.substring(1,2)+"."+FirmwareVersion.substring(2);
}
function getBatteryPower() {

    let batteryPower  =getDevice_manage_fuc("get_battery_power");
    if (batteryPower!=Constants.BATTERY_CHARGING_SIGN) {
        batteryPower = parseInt(batteryPower, 16).toString();
    }
    return batteryPower;
}
function getLifeTime() {
    let res = getDevice_manage_fuc("get_life_time");
    switch (res) {
        case "80":
            return Constants.LIFE_TIME_DEVICE_INITED;
        case "89":
            return Constants.LIFE_TIME_DEVICE_ACTIVATED;
        case "81":
            return Constants.LIFE_TIME_UNSET_PIN;
        case "83":
            return Constants.LIFE_TIME_WALLET_UNREADY;
        case "84":
            return Constants.LIFE_TIME_WALLET_CREATTING;
        case "85":
            return Constants.LIFE_TIME_WALLET_RECOVERING;
        case "86":
            return Constants.LIFE_TIME_WALLET_READY;
        default:
            return Constants.LIFE_TIME_UNKNOWN;
    }
}
function getBleName() {
    return getDevice_manage_fuc("get_ble_name");
}

function setBleName(bleName) {
    // let regEx = "^[a-zA-Z0-9\\-]{1,12}$";
    // if(!matches(regEx, bleName)) {
    //     throw new ImkeyException(Messages.IMKEY_SDK_ILLEGAL_ARGUMENT);
    // }
    return Bytes2Str(getDevice_manage_fuc("set_ble_name"));
}

function getBleVersion() {
    let bleVersion = getDevice_manage_fuc("get_ble_version").substring(0,4);
    return bleVersion.substring(0,1)+"."+bleVersion.substring(1,2)+"."+bleVersion.substring(2);
    return Bytes2Str(HexStr2Bytes(getDevice_manage_fuc("get_ble_version")));
}

function getSdkInfo() {
    return getDevice_manage_fuc("get_sdk_info");
}

function activeDevice() {
    return getDevice_manage_fuc("device_activate");
}
function cosUpdate() {
    return getDevice_manage_fuc("cos_update");
}
function checkDevice() {
    return getDevice_manage_fuc("device_secure_check");
}

function checkUpdate() {
    return getDevice_manage_fuc("check_update");
}

function downloadApplet(AppName) {
    return AppletManage("app_download",AppName);
}

function updateApplet(AppName) {
    return AppletManage("app_update",AppName);
}

function deleteApplet(AppName) {
    return AppletManage("app_delete",AppName);
}
function deviceBindCheck(FilePath) {
    return bindCheck(FilePath);
}
function deviceBindAcquire(bindCode) {
    return bindAcquire(bindCode);
}
function deviceBindDisplay() {
    return getDevice_manage_fuc("bind_display_code");
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

module.exports = {
    getSeid,
    getSn,
    getRamSize,
    getFirmwareVersion,
    getBatteryPower,
    getLifeTime,
    getBleName,
    setBleName,
    getBleVersion,
    getSdkInfo,
    activeDevice,
    cosUpdate,
    checkDevice,
    checkUpdate,
    downloadApplet,
    updateApplet,
    deleteApplet,
    deviceBindCheck,
    deviceBindAcquire,
    deviceBindDisplay
}
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
