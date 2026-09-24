// sdk version
const sdkVersion = '2.10.3'
// serverurl
// const serverUrl = 'https://imkeyserver.com:10444/imkey'
const serverUrl = 'https://imkey.online:1000/imkey'
// Terminaltype
const terminalType = 'PC'
// Battery is charging sign
const BATTERY_CHARGING_SIGN = 'FF'

// 设备初始化 80
const LIFE_TIME_DEVICE_INITED = 'life_time_device_inited'
// 已激活 89
const LIFE_TIME_DEVICE_ACTIVATED = 'life_time_device_activated'
// pin未设置 81
const LIFE_TIME_UNSET_PIN = 'life_time_unset_pin'
// 钱包unready 83
const LIFE_TIME_WALLET_UNREADY = 'life_time_wallet_unready'
// 钱包创建中 84
const LIFE_TIME_WALLET_CREATTING = 'life_time_wallet_creatting'
// 钱包恢复中 85
const LIFE_TIME_WALLET_RECOVERING = 'life_time_wallet_recovering'
// 钱包创建完成 86
const LIFE_TIME_WALLET_READY = 'life_time_wallet_ready'
// 未知
const LIFE_TIME_UNKNOWN = 'life_time_unknown'

// 设备绑定状态
const BIND_STATUS_UNBOUND = '00'
const BIND_STATUS_BOUND_THIS = '55'
const BIND_STATUS_BOUND_OTHER = 'AA'
const BIND_STATUS_STRING_UNBOUND = 'unbound'
const BIND_STATUS_STRING_BOUND_THIS = 'bound_this'
const BIND_STATUS_STRING_BOUND_OTHER = 'bound_other'
//  network
const MAINNET = 'MAINNET'
const TESTNET = 'TESTNET'
// imKey device name
const DEVICE_NAME_IMKEY_PRO = 'imKey Pro'
// 成功状态
const RESULT_STATUS_SUCCESS = 'success'
const XPubCommonKey128 = 'B888D25EC8C12BD5043777B1AC49F872'
const XPubCommonIv = '9C0C30889CBCC5E01AB5B2BB88715799'

module.exports = {
  sdkVersion,
  serverUrl,
  terminalType,
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
  BIND_STATUS_STRING_UNBOUND,
  BIND_STATUS_STRING_BOUND_THIS,
  BIND_STATUS_STRING_BOUND_OTHER,
  MAINNET,
  TESTNET,
  DEVICE_NAME_IMKEY_PRO,
  RESULT_STATUS_SUCCESS,
  XPubCommonKey128,
  XPubCommonIv
}
