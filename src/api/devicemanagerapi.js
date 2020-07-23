const apiPb = require('../proto/api_pb')
const devicePb = require('../proto/device_pb')
const callImKeyCore = require('./callimkeycore')
const constants = require('../common/constants')
const _ = require('lodash')
const crypto = require('./crypto')
const fs = require('fs')
const writeFileAtomic = require("write-file-atomic");

export function connect(deviceModelName) {
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
        return {
            isSuccess: true,
            result: response.getResult()
        }
    } else {
        const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
        return {
            isSuccess: false,
            result: errorResponse.getError()
        }
    }
}

function getDeviceManageFunction(method_) {
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
        return {
            isSuccess: true,
            result: result
        }
    } else {
        const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
        return {
            isSuccess: false,
            result: errorResponse.getError()
        }
    }
}

function appletManage(method_, appName) {
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
        return {
            isSuccess: true,
            result: response.getResult()
        }
    } else {
        const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
        return {
            isSuccess: false,
            result: errorResponse.getError()
        }
    }
}

function bindCheck(filePath) {
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
        return {
            isSuccess: true,
            result: response.getBindStatus()
        }
    } else {
        const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
        return {
            isSuccess: false,
            result: errorResponse.getError()
        }
    }
}

function bindAcquire(bindCode) {
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
        return {
            isSuccess: true,
            result: response.getBindResult()
        }
    } else {
        const errorResponse = new apiPb.ErrorResponse.deserializeBinary(hexStr2Bytes(error))
        return {
            isSuccess: false,
            result: errorResponse.getError()
        }
    }
}

export function checkUpdateAppList() {
    try {
        const response = getDeviceManageFunction('check_update')
        const collections = response.result.availableAppListList
        const list = []
        let installLoading
        let installDis
        let deleteDis
        let deleteLoading
        let buttonTexts
        let version
        let installed
        let updateLoading
        let updateDis
        for (let i = 0; i < collections.length; i++) {
            if (collections[i].installedVersion === 'none' || collections[i].installedVersion === null) {
                installLoading = false
                installDis = false
                installed = false
                deleteDis = true
                deleteLoading = false
                updateLoading = false
                updateDis = true
            } else {
                installLoading = false
                installDis = true
                installed = true
                deleteDis = false
                deleteLoading = false
                updateLoading = false
                updateDis = true
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
                    updateLoading = false
                    updateDis = false
                    installLoading = false
                    installDis = true
                    deleteDis = true
                    deleteLoading = false
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
                installed:installed,
                updateLoading: updateLoading,
                updateDis: updateDis,
                deleteDis: deleteDis,
                deleteLoading: deleteLoading,
                icon: collections[i].appLogo,
                buttonTexts: buttonTexts
            }
            list.push(collection)
        }
        const total = list.length
        const status = response.result.status
        return {
            isSuccess: true,
            result: _.cloneDeep({status: status, total: total, list: list})
        }
    } catch (err) {
        return {
            isSuccess: false,
            result: err
        }
    }
}

export function getSeid() {
    return getDeviceManageFunction('get_seid')
}

export function getSn() {
    return getDeviceManageFunction('get_sn')
}

export function getRamSize() {
    const response = getDeviceManageFunction('get_ram_size')
    if (response.isSuccess) {
        return {
            isSuccess: true,
            result: parseInt(response.result.substring(4, 8), 16)
        }
    } else {
        return {
            isSuccess: false,
            result: response.result
        }
    }
}

export function getFirmwareVersion() {
    const response = getDeviceManageFunction('get_firmware_version')
    if (response.isSuccess) {
        return {
            isSuccess: true,
            result: response.result.substring(0, 1) + '.' + response.result.substring(1, 2) + '.' + response.result.substring(2)
        }
    } else {
        return {
            isSuccess: false,
            result: response.result
        }
    }
}

export function getSdkInfo() {
    return getDeviceManageFunction('get_sdk_info')
}

export function activeDevice() {
    return getDeviceManageFunction('device_activate')
}

export function cosUpdate() {
    return getDeviceManageFunction('cos_update')
}

export function cosCheckUpdate() {
    return getDeviceManageFunction('cos_check_update')
}

export function isBLStatus() {
    return getDeviceManageFunction('is_bl_status')
}

export function checkDevice() {
    return getDeviceManageFunction('device_secure_check')
}

export function checkUpdate() {
    return getDeviceManageFunction('check_update')
}

export function downloadApplet(AppName) {
    return appletManage('app_download', AppName)
}

export function updateApplet(AppName) {
    return appletManage('app_update', AppName)
}

export function deleteApplet(AppName) {
    return appletManage('app_delete', AppName)
}

export function deviceBindCheck(filePath) {
    return bindCheck(filePath)
}

export function deviceBindAcquire(bindCode) {
    return bindAcquire(bindCode)
}

export function deviceBindDisplay() {
    return getDeviceManageFunction('bind_display_code')
}

export function getUserPath() {
    const electron = require('electron')
    const dataPath = (electron.app || electron.remote.app).getPath('userData') + '/'
    return {
        isSuccess: true,
        result: dataPath
    }
}

export function importBindCode(bindCode) {
    const response = getUserPath();
    if (response.isSuccess) {
        //存储路径
        const bindCodePath = response.result + "bindCode.json"
        //加密绑定码
        const enBindCode ={
            bindCode:crypto.encryptData(bindCode.toUpperCase(), process.env.bindCode_encryptionKey)
        }
        // fs.writeFile  写入文件（会覆盖之前的内容）（文件不存在就创建）  utf8参数可以省略
        try {
            writeFileAtomic(bindCodePath, JSON.stringify(enBindCode))
                return {
                    isSuccess: true,
                }
        } catch (error) {
            console.log(error)
            return {
                isSuccess: false,
                result: error
            }
        }
    }
}

export function exportBindCode() {
    const response = getUserPath();
    if (response.isSuccess) {
        //存储路径
        const bindCodePath = response.result + "bindCode.json"
        try {
            const data = fs.readFileSync(bindCodePath, 'utf-8')
            const dataString = data.toString()// 将二进制的数据转换为字符串
            const jsonObj = JSON.parse(dataString)// 将字符串转换为json对象
            return {
                isSuccess: true,
                //解密绑定码
                result: crypto.decryptData(jsonObj.bindCode, process.env.bindCode_encryptionKey)
            }
        } catch (error) {
            console.log(error)
            return {
                isSuccess: false,
                result: error
            }
        }
    }

}
// module.exports = {
//     connect,
//     getSeid,
//     getSn,
//     getRamSize,
//     getFirmwareVersion,
//     getSdkInfo,
//     activeDevice,
//     cosUpdate,
//     isBLStatus,
//     checkDevice,
//     checkUpdate,
//     downloadApplet,
//     updateApplet,
//     deleteApplet,
//     deviceBindCheck,
//     deviceBindAcquire,
//     deviceBindDisplay,
//     checkUpdateAppList
// }

/**
 * @desc 二进制数组转十六进制字符串
 * @param arr
 * @returns {string}
 */
function bytes2HexStr(arr) {
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
function hexStr2Bytes(str) {
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
