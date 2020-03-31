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
function getDevice_manage_fuc(action_) {
    // console.log(" process.versions.node:"+process.versions.node);
    //deviceParam
    let deviceParam =new  api_pb.DeviceParam();

    deviceParam.setAction(action_);
    deviceParam.setParam(null);
    let deviceParamBytes = deviceParam.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(deviceParamBytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any);
    let TcxActionBytes = TcxAction.serializeBinary();

    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
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
    }else {
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}
function  getDevice_manage_device(action_) {

    //deviceParam
    let deviceParam =new  api_pb.DeviceParam();
    deviceParam.setAction(action_);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        if (action_ == "check_update") {
            //rust库返回的数据解析
            let CheckUpdateResponse = new device_pb.CheckUpdateResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
            return CheckUpdateResponse.toObject().getAvailableAppListList();
        } else {
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
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}
function getDevice_manage_Applet(action,AppName) {

    //AppAction
    let AppAction =new  device_pb.AppAction();
    AppAction.setAppName(AppName);
    let AppActionBytes = AppAction.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(AppActionBytes);
    //deviceParam
    let deviceParam =new  api_pb.DeviceParam();
    deviceParam.setAction(action);
    deviceParam.setParam(any);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    //rust库返回的数据解析
    //rust库返回的数据解析
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
function getDevice_manage_bind_check(FilePath) {
    //BindCheck
    let BindCheck =new  device_pb.BindCheck();
    BindCheck.setFilePath(FilePath);
    let BindCheckBytes = BindCheck.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(BindCheckBytes);
    //deviceParam
    let deviceParam =new  api_pb.DeviceParam();
    deviceParam.setAction("bind_check");
    deviceParam.setParam(any);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        let Response = new device_pb.BindCheckResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
        console.log(" Response.getBindStatus():" + Response.getBindStatus())
        return Response.getBindStatus();
    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}
function getDevice_manage_bind_acquire(bindCode) {
    console.log("bindCode:"+bindCode)
    //BindAcquire
    let BindAcquire =new  device_pb.BindAcquire();
    BindAcquire.setBindCode(bindCode);
    let BindAcquireBytes = BindAcquire.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(BindAcquireBytes);
    //deviceParam
    let deviceParam =new  api_pb.DeviceParam();
    deviceParam.setAction("bind_acquire");
    deviceParam.setParam(any);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        let Response = new device_pb.BindAcquireResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
        console.log(" Response.getBindResult():" + Response.getBindResult())
        if(Response.getBindResult().substring(0,2)=="5A"){
            return 'true';
        }else if(Response.getBindResult().substring(0,2)=="A5"){
            return 'false';
        }else{
            return 'false';
        }

    }else{
        let ErrorResponse = new api_pb.Response.deserializeBinary(HexStr2Bytes(Error));
        return ErrorResponse.getError();
    }
}
function getDevice_manage_bind_display() {
    //
    let BindDisplay =new  device_pb.BindDisplay();
    let BindDisplayBytes = BindDisplay.serializeBinary();
    //any
    let any =new  proto.google.protobuf.Any();
    any.setValue(BindDisplayBytes);
    //deviceParam
    let deviceParam =new  api_pb.DeviceParam();
    deviceParam.setAction("bind_display");
    deviceParam.setParam(any);
    let deviceParambytes = deviceParam.serializeBinary();
    //any
    let any1 =new  proto.google.protobuf.Any();
    any1.setValue(deviceParambytes);
    // let anyBytes = any.serializeBinary();
    //TcxAction
    let TcxAction =new  api_pb.TcxAction();
    TcxAction.setMethod("device_manage");
    TcxAction.setParam(any1);
    let TcxActionBytes = TcxAction.serializeBinary();
    //调用rust库
    let ResBuffer= GoToRust.call_tcx_api(Bytes2HexStr(TcxActionBytes));
    //rust库返回的数据解析
    let Error = GoToRust.get_last_err_message();
    if(Error ==""  || Error ==null) {
        let Response = new device_pb.BindDisplayResponse.deserializeBinary(HexStr2Bytes(ResBuffer));
        console.log(" Response.getBindDisplayResult():" + Response.getBindDisplayResult())
        if(Response.getBindDisplayResult()==null || Response.getBindDisplayResult()==""){
            return 'true'
        }else{
            return 'false'
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
    return Bytes2Str(HexStr2Bytes(getDevice_manage_fuc("get_ble_name")));
}

function setBleName(bleName) {
    // let regEx = "^[a-zA-Z0-9\\-]{1,12}$";
    // if(!matches(regEx, bleName)) {
    //     throw new ImkeyException(Messages.IMKEY_SDK_ILLEGAL_ARGUMENT);
    // }
    return Bytes2Str(HexStr2Bytes(getDevice_manage_fuc("set_ble_name")));
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
    return getDevice_manage_device("se_activate");
}
function cosUpgrade() {
    return getDevice_manage_device("cos_upgrade");
}
function checkDevice() {
    return getDevice_manage_device("se_secure_check");
}

function checkUpdate() {
    return getDevice_manage_device("check_update");
}

function downloadApplet(AppName) {
    return getDevice_manage_Applet("app_download",AppName);
}

function updateApplet(AppName) {
    return getDevice_manage_Applet("app_update",AppName);
}

function deleteApplet(AppName) {
    return getDevice_manage_Applet("app_delete",AppName);
}
function deviceBindCheck() {
    return getDevice_manage_bind_check("bind_check",path.resolve('./'));
}
function deviceBindAcquire(bindCode) {
    return getDevice_manage_bind_acquire(bindCode);
}
function deviceBindDisplay() {
    return getDevice_manage_bind_display();
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
    cosUpgrade,
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
