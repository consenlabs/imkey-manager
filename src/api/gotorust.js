/**
 * 通过此方法来调用connector库文件的api函数
 * @param str_
 * @returns {*}
 */

const ref = require('ref');
const ffi = require('ffi');
const path = require('path');
const library_name = path.resolve('connector');
const lib = ffi.Library(library_name, {
    // [a, [b，c....]] a是函数出参类型，[b，c]是dll函数的入参类型
    clear_err: [ref.types.void, [ref.types.void]],
    call_imkey_api: ['String', ['String']],
    get_last_err_message: ['String', [ref.types.void]],
});
export function call_imkey_api(protobuf_str) {
    console.log("protobuf_str:"+protobuf_str)
    lib.clear_err("");//清空之前的error
    const Res_Str = lib.call_imkey_api(protobuf_str);
    console.log("call_tcx_api Res_Str()"+Res_Str);
    return Res_Str;
}
export function get_last_err_message() {
    const Res_Str = lib.get_last_err_message("");//获取错误的信息
    console.log("get_last_err_message Res_Str()"+Res_Str);
    return Res_Str;
}
// module.exports = {
//     call_tcx_api,
//     get_last_err_message
// }
