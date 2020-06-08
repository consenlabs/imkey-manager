//sdk version
let version = "1.2.00";

// Battery is charging sign
let BATTERY_CHARGING_SIGN = "FF";

// 设备初始化 80
let LIFE_TIME_DEVICE_INITED = "life_time_device_inited";
// 已激活 89
let LIFE_TIME_DEVICE_ACTIVATED = "life_time_device_activated";
// pin未设置 81
let LIFE_TIME_UNSET_PIN = "life_time_unset_pin";
// 钱包unready 83
let LIFE_TIME_WALLET_UNREADY = "life_time_wallet_unready";
// 钱包创建中 84
let LIFE_TIME_WALLET_CREATTING = "life_time_wallet_creatting";
// 钱包恢复中 85
let LIFE_TIME_WALLET_RECOVERING = "life_time_wallet_recovering";
// 钱包创建完成 86
let LIFE_TIME_WALLET_READY = "life_time_wallet_ready";
// 未知
let LIFE_TIME_UNKNOWN = "life_time_unknown";

//设备绑定状态
let BIND_STATUS_UNBOUND = "00";
let BIND_STATUS_BOUND_THIS = "55";
let BIND_STATUS_BOUND_OTHER = "AA";
//  network
let MAINNET = "MAINNET";
let TESTNET = "TESTNET";
//imKey device name
let DEVICE_NAME_IMKEY_PRO = "imKey Pro";
//成功状态
let RESULT_STATUS_SUCCESS = "success"
module.exports = {
    version,
    BATTERY_CHARGING_SIGN,
    LIFE_TIME_DEVICE_INITED,
    LIFE_TIME_DEVICE_ACTIVATED,
    LIFE_TIME_UNSET_PIN,
    LIFE_TIME_WALLET_UNREADY,
    LIFE_TIME_WALLET_CREATTING,
    LIFE_TIME_WALLET_RECOVERING,
    LIFE_TIME_WALLET_READY,
    LIFE_TIME_UNKNOWN,
    BIND_STATUS_UNBOUND,
    BIND_STATUS_BOUND_THIS,
    BIND_STATUS_BOUND_OTHER,
    MAINNET,
    TESTNET,
    DEVICE_NAME_IMKEY_PRO,
    RESULT_STATUS_SUCCESS,
}
