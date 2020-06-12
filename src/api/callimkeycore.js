/**
 * 通过此方法来调用connector库文件的api函数
 * @param protobufStr
 * @returns {*}
 */

const ref = require('ref');
const ffi = require('ffi');
const path = require('path');

let libraryName;

if (process.platform === 'win32') {
    if (process.env.NODE_ENV === 'development') {
        libraryName = path.resolve('connector');
    } else {
        libraryName = path.resolve(__dirname, 'connector').replace('\\resources\\app.asar\\dist\\electron', '');
    }
} else if (process.platform === 'darwin') {
    if (process.env.NODE_ENV === 'development') {
        libraryName = path.resolve('connector');
    } else {
        libraryName = path.resolve(__dirname, 'connector').replace('/Resources/app.asar/dist/electron', '');
    }
} else {
    console.log("不支持此平台")
}
const lib = ffi.Library(libraryName, {
    // [a, [b，c....]] a是函数出参类型，[b，c]是dll函数的入参类型
    clear_err: [ref.types.void, [ref.types.void]],
    call_imkey_api: ['String', ['String']],
    get_last_err_message: ['String', [ref.types.void]],
});

export function call_imkey_api(protobufStr) {
    lib.clear_err("");//清空之前的error
    return lib.call_imkey_api(protobufStr);

}

export function get_last_err_message() {
    return lib.get_last_err_message("");//获取错误的信息

}

