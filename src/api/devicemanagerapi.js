const apiPb = require('../proto/api_pb')
const devicePb = require('../proto/device_pb')
const callImKeyCore = require('./callimkeycore')
const constants = require('../common/constants')

function connect (deviceModelName) {
  const request = new devicePb.DeviceConnectReq()
  request.setDeviceModelName(deviceModelName)
  const requestBytes = request.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(requestBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('device_connect')
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  let result
  if (error === '' || error === null) {
    const response = new apiPb.CommonResponse.deserializeBinary(hexStr2Bytes(resBuffer))
    return response.getResult()
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function getDeviceManageFunction (method_) {
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod(method_)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  let result
  if (error === '' || error === null) {
    if (method_ === 'get_seid') {
      const response = new devicePb.GetSeidRes.deserializeBinary(hexStr2Bytes(resBuffer))
      result = response.getSeid()
    } else if (method_ === 'get_sn') {
      const response = new devicePb.GetSnRes.deserializeBinary(hexStr2Bytes(resBuffer))
      result = response.getSn()
    } else if (method_ === 'get_ram_size') {
      const response = new devicePb.GetRamSizeRes.deserializeBinary(hexStr2Bytes(resBuffer))
      result = response.getRamSize()
    } else if (method_ === 'get_firmware_version') {
      const response = new devicePb.GetFirmwareVersionRes.deserializeBinary(hexStr2Bytes(resBuffer))
      result = response.getFirmwareVersion()
    } else if (method_ === 'get_sdk_info') {
      const response = new devicePb.GetSdkInfoRes.deserializeBinary(hexStr2Bytes(resBuffer))
      result = response.getSdkVersion()
    } else if (method_ === 'check_update') {
      const response = new devicePb.CheckUpdateRes.deserializeBinary(hexStr2Bytes(resBuffer))
      result = response.toObject()
    } else if (method_ === 'is_bl_status') {
      const response = new devicePb.IsBlStatusRes.deserializeBinary(hexStr2Bytes(resBuffer))
      result = response.getCheckResult()
    } else { // method_ === "device_activate"||"device_secure_check"||"bind_display_code"
      const response = new apiPb.CommonResponse.deserializeBinary(hexStr2Bytes(resBuffer))
      result = response.getResult()
    }
    return result
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function appletManage (method_, appName) {
  let request
  if (method_ === 'app_download') {
    request = new devicePb.AppDownloadReq()
    request.setAppName(appName)
  }
  if (method_ === 'app_update') {
    request = new devicePb.AppUpdateReq()
    request.setAppName(appName)
  }
  if (method_ === 'app_delete') {
    request = new devicePb.AppDeleteReq()
    request.setAppName(appName)
  }
  const requestBytes = request.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(requestBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod(method_)
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new apiPb.CommonResponse.deserializeBinary(hexStr2Bytes(resBuffer))
    return response.getResult()
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function bindCheck (filePath) {
  const bindCheckReq = new devicePb.BindCheckReq()
  bindCheckReq.setFilePath(filePath)
  const bindCheckReqBytes = bindCheckReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(bindCheckReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('bind_check')
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new devicePb.BindCheckRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return response.getBindStatus()
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function bindAcquire (bindCode) {
  const bindAcquireReq = new devicePb.BindAcquireReq()
  bindAcquireReq.setBindCode(bindCode)
  const bindAcquireReqBytes = bindAcquireReq.serializeBinary()
  const any = new proto.google.protobuf.Any()
  any.setValue(bindAcquireReqBytes)
  const imKeyAction = new apiPb.ImkeyAction()
  imKeyAction.setMethod('bind_acquire')
  imKeyAction.setParam(any)
  const imKeyActionBytes = imKeyAction.serializeBinary()
  const resBuffer = callImKeyCore.callImKeyApi(bytes2HexStr(imKeyActionBytes))
  const error = callImKeyCore.getLastErrorMessage()
  if (error === '' || error === null) {
    const response = new devicePb.BindAcquireRes.deserializeBinary(hexStr2Bytes(resBuffer))
    return response.getBindResult()
  } else {
    const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
    return errorResponse.getError()
  }
}

function getSeid () {
  return getDeviceManageFunction('get_seid')
}

function getSn () {
  return getDeviceManageFunction('get_sn')
}

function getRamSize () {
  return parseInt(getDeviceManageFunction('get_ram_size').substring(4, 8), 16)
}

function getFirmwareVersion () {
  const FirmwareVersion = getDeviceManageFunction('get_firmware_version')
  return FirmwareVersion.substring(0, 1) + '.' + FirmwareVersion.substring(1, 2) + '.' + FirmwareVersion.substring(2)
}

function getSdkInfo () {
  return getDeviceManageFunction('get_sdk_info')
}

function activeDevice () {
  return getDeviceManageFunction('device_activate')
}

function cosUpdate () {
  return getDeviceManageFunction('cos_update')
}

function isBLStatus () {
  return getDeviceManageFunction('is_bl_status')
}

function checkDevice () {
  return getDeviceManageFunction('device_secure_check')
}

function checkUpdate () {
  return getDeviceManageFunction('check_update')
}

function downloadApplet (AppName) {
  return appletManage('app_download', AppName)
}

function updateApplet (AppName) {
  return appletManage('app_update', AppName)
}

function deleteApplet (AppName) {
  return appletManage('app_delete', AppName)
}

function deviceBindCheck (filePath) {
  return bindCheck(filePath)
}

function deviceBindAcquire (bindCode) {
  return bindAcquire(bindCode)
}

function deviceBindDisplay () {
  return getDeviceManageFunction('bind_display_code')
}

module.exports = {
  connect,
  getSeid,
  getSn,
  getRamSize,
  getFirmwareVersion,
  getSdkInfo,
  activeDevice,
  cosUpdate,
  isBLStatus,
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
 * @desc 二进制数组转十六进制字符串
 * @param arr
 * @returns {string}
 */
function bytes2HexStr (arr) {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    let tmp = arr[i].toString(16)
    if (tmp.length === 1) {
      tmp = '0' + tmp
    }
    str += tmp
  }
  return str
}

/**
 *  @desc 十六进制字符串转二进制数组
 * @param str
 * @returns {any[]|null}
 */
function hexStr2Bytes (str) {
  let pos = 0
  let len = str.length
  if (len % 2 != 0) {
    return null
  }
  len /= 2
  const hexA = new Array()
  for (let i = 0; i < len; i++) {
    const s = str.substr(pos, 2)
    const v = parseInt(s, 16)
    hexA.push(v)
    pos += 2
  }
  return hexA
}
