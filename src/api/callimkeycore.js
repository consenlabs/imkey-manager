/**
 * 通过此方法来调用connector库文件的api函数
 * @param protobufStr
 * @returns {*}
 */

const ref = require('ref-napi')
const ffi = require('ffi-napi')
const path = require('path')

let libraryName

if (process.platform === 'win32') {
  if (process.env.NODE_ENV === 'production') {
    libraryName = path.resolve(__dirname, 'connector').replace('\\resources\\app.asar\\dist\\electron', '')
  } else {
    libraryName = path.resolve('connector')
  }
} else if (process.platform === 'darwin') {
  if (process.env.NODE_ENV === 'production') {
    libraryName = path.resolve(__dirname, 'connector').replace('/app.asar/dist/electron', '')
  } else {
    libraryName = path.resolve('connector')
  }
} else {
  console.log('不支持此平台')
}
let lib
let winlib
// connector 加载失败（如 Windows 缺少 VC++ 运行库导致 Win32 error 126）时记录错误，
// 由 worker 上报主进程提示用户，而不是让模块加载直接抛出
let loadError = null
try {
  if (process.platform === 'win32') {
    winlib = ffi.Library(libraryName, {
      // [a, [b，c....]] a是函数出参类型，[b，c]是dll函数的入参类型
      imkey_clear_err_win: [ref.types.void, ['String']],
      call_imkey_api: ['String', ['String']],
      imkey_get_last_err_message_win: ['String', ['String']]
    })
  } else {
    lib = ffi.Library(libraryName, {
      // [a, [b，c....]] a是函数出参类型，[b，c]是dll函数的入参类型
      imkey_clear_err: [ref.types.void, [ref.types.void]],
      call_imkey_api: ['String', ['String']],
      imkey_get_last_err_message: ['String', [ref.types.void]]
    })
  }
} catch (e) {
  loadError = { message: e.message, libraryPath: libraryName }
  console.error('load connector failed', loadError)
}

export function getLoadError () {
  return loadError
}

export function callImKeyApi (protobufStr) {
  if (loadError) {
    throw new Error('connector not loaded: ' + loadError.message)
  }
  if (process.platform === 'win32') {
    winlib.imkey_clear_err_win('')// 清空之前的error
    return winlib.call_imkey_api(protobufStr)
  } else {
    lib.imkey_clear_err('')// 清空之前的error
    return lib.call_imkey_api(protobufStr)
  }
}

export function getLastErrorMessage () {
  if (loadError) {
    return loadError.message
  }
  if (process.platform === 'win32') {
    return winlib.imkey_get_last_err_message_win('')// 获取错误的信息
  } else {
    return lib.imkey_get_last_err_message('')// 获取错误的信息
  }
}
