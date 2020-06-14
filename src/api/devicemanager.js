const apiPb = require('../proto/api_pb')
const _ = require('lodash')
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
    } else if (method_ === 'cos_check_update') {
      const response = new devicePb.CosCheckUpdateRes.deserializeBinary(hexStr2Bytes(resBuffer))
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

function AppletManage (method_, appName) {
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

export function checkUpdate () {
  return new Promise((resolve, reject) => {
    try {
      const response = getDeviceManageFunction('check_update')
      const collections = response.availableAppListList
      const list = []
      let installLoading
      let installDis
      let deleteDis
      let deleteLoading
      let buttonTexts
      let version
      for (let i = 0; i < collections.length; i++) {
        if (collections[i].installedVersion === 'none' || collections[i].installedVersion === null) {
          installLoading = false
          installDis = false
          deleteDis = true
          deleteLoading = false
        } else {
          installLoading = false
          installDis = true
          deleteDis = false
          deleteLoading = false
        }
        if (collections[i].latestVersion === collections[i].installedVersion) {
          buttonTexts = 'install'
          version = 'version ' + collections[i].installedVersion
        } else {
          if (collections[i].installedVersion === 'none' || collections[i].installedVersion === null) {
            buttonTexts = 'install'
            version = ''
          } else {
            buttonTexts = 'update'
            version = 'version ' + collections[i].installedVersion
          }
        }
        // 过滤imkey Applet BTC Applet 不能删除
        if (collections[i].appName === 'IMK' || collections[i].appName === 'BTC') {
          deleteDis = true
        }
        const collection = {
          name: collections[i].appName,
          desc: version,
          lastVersion: 'version ' + collections[i].latestVersion,
          id: i,
          installLoading: installLoading,
          installDis: installDis,
          deleteDis: deleteDis,
          deleteLoading: deleteLoading,
          icon: collections[i].appLogo,
          buttonTexts: buttonTexts
        }
        list.push(collection)
      }
      const total = list.length
      const status = response.status
      resolve({
        code: 200,
        data: _.cloneDeep({ status: status, total: total, list: list })
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function connectDevice () {
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

export function getSeid () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: getDeviceManageFunction('get_seid')
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function getSn () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: getDeviceManageFunction('get_sn')
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function getRamSize () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: parseInt(getDeviceManageFunction('get_ram_size').substring(4, 8), 16)
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function getFirmwareVersion () {
  return new Promise((resolve, reject) => {
    try {
      const FirmwareVersion = getDeviceManageFunction('get_firmware_version')
      resolve({
        code: 200,
        data: FirmwareVersion.substring(0, 1) + '.' + FirmwareVersion.substring(1, 2) + '.' + FirmwareVersion.substring(2)
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function isBLStatus () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: getDeviceManageFunction('is_bl_status')
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function getSdkInfo () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: getDeviceManageFunction('get_sdk_info')
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function activeDevice () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: getDeviceManageFunction('device_activate')
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function cosCheckUpdate () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: getDeviceManageFunction('cos_check_update')
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.stack
      })
    }
  })
}

export function cosUpdate () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: getDeviceManageFunction('cos_update')
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function checkDevice () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: getDeviceManageFunction('device_secure_check')
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

export function downloadApplet (AppName) {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: AppletManage('app_download', AppName)
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function updateApplet (AppName) {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: AppletManage('app_update', AppName)
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function deleteApplet (AppName) {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: AppletManage('app_delete', AppName)
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function deviceBindCheck (filePath) {
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

export function deviceBindAcquire (bindCode) {
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

export function deviceBindDisplay () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: getDeviceManageFunction('bind_display_code')
      })
    } catch (err) {
      return reject({
        code: 400,
        message: err.message
      })
    }
  })
}

export function getUserPath () {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        code: 200,
        data: require('path').resolve('./')
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
 * @desc 二进制数组转十六进制字符串
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
* @desc 十六进制字符串转二进制数组
*/
function hexStr2Bytes (str) {
  let pos = 0
  let len = str.length
  if (len % 2 !== 0) {
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
