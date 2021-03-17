// sdk version
const version = '1.2.00'

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
// apiName
const API_NAME_TRANSACTION_BTC = 'btc.signTransaction'
const API_NAME_TRANSACTION_BTC_SEGWIT = 'btc.signSegWitTransaction'
const API_NAME_TRANSACTION_BTC_USDT = 'btc.signUsdtTransaction'
const API_NAME_TRANSACTION_BTC_USDT_SEGWIT = 'btc.signUsdtSegWitTransaction'
const API_NAME_TRANSACTION_BCH = 'bch.signTransaction'
const API_NAME_TRANSACTION_LTC = 'ltc.signTransaction'
const API_NAME_TRANSACTION_SIGNTX_ETH = 'eth.signTransaction'
const API_NAME_TRANSACTION_SIGNMSG_ETH = 'eth.signMessage'
const API_NAME_TRANSACTION_SIGNTX_EOS = 'eos.signTransaction'
const API_NAME_TRANSACTION_SIGNMSG_EOS = 'eos.signMessage'
const API_NAME_TRANSACTION_SIGNTX_COSMOS = 'cosmos.signTransaction'
const API_NAME_TRANSACTION_SIGNTX_FILECOIN = 'filecoin.signTransaction'
const API_NAME_TRANSACTION_SIGNTX_POLKADOT = 'dot.signTransaction'
const API_NAME_TRANSACTION_SIGNTX_KUSAMA = 'ksm.signTransaction'
const API_NAME_TRANSACTION_SIGNTX_TRON = 'tron.signTransaction'
const API_NAME_TRANSACTION_SIGNMSG_TRON = 'tron.signMessage'
const API_NAME_TRANSACTION_SIGNTX_XTZ = 'xtz.signTransaction'
const API_NAME_GET_BTC_XPUB = 'btc.getXpub'
const API_NAME_GET_ADDRESS_BTC = 'btc.getAddress'
const API_NAME_GET_ADDRESS_BTC_SEGWIT = 'btc.getSegWitAddress'
const API_NAME_REGISTER_ADDRESS_BTC = 'btc.registerAddress'
const API_NAME_REGISTER_ADDRESS_BTC_SEGWIT = 'btc.registerSegWitAddress'
const API_NAME_GET_ADDRESS_BCH = 'bch.getAddress'
const API_NAME_REGISTER_ADDRESS_BCH = 'bch.registerAddress'
const API_NAME_GET_ADDRESS_LTC = 'ltc.getAddress'
const API_NAME_REGISTER_ADDRESS_LTC = 'ltc.registerAddress'
const API_NAME_GET_ADDRESS_LTC_SEGWIT = 'ltc.getSegWitAddress'
const API_NAME_REGISTER_ADDRESS_LTC_SEGWIT = 'ltc.registerSegWitAddress'
const API_NAME_GET_ADDRESS_ETH = 'eth.getAddress'
const API_NAME_REGISTER_ADDRESS_ETH = 'eth.registerAddress'
const API_NAME_GET_PUBKEY_EOS = 'eos.getPubKey'
const API_NAME_REGISTER_PUBKEY_EOS = 'eos.registerPubKey'
const API_NAME_GET_ADDRESS_COSMOS = 'cosmos.getAddress'
const API_NAME_REGISTER_ADDRESS_COSMOS = 'cosmos.registerAddress'
const API_NAME_GET_ADDRESS_FILECOIN = 'filecoin.getAddress'
const API_NAME_REGISTER_ADDRESS_FILECOIN = 'filecoin.registerAddress'
const API_NAME_GET_ADDRESS_POLKADOT = 'dot.getAddress'
const API_NAME_REGISTER_ADDRESS_POLKADOT = 'dot.registerAddress'
const API_NAME_GET_ADDRESS_KUSAMA = 'ksm.getAddress'
const API_NAME_REGISTER_ADDRESS_KUSAMA = 'ksm.registerAddress'
const API_NAME_GET_ADDRESS_TRON = 'tron.getAddress'
const API_NAME_REGISTER_ADDRESS_TRON = 'tron.registerAddress'
const API_NAME_GET_ADDRESS_XTZ = 'tezos.getAddress'
const API_NAME_REGISTER_ADDRESS_XTZ = 'tezos.registerAddress'
const XPubCommonKey128 = 'B888D25EC8C12BD5043777B1AC49F872'
const XPubCommonIv = '9C0C30889CBCC5E01AB5B2BB88715799'

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
  BIND_STATUS_STRING_UNBOUND,
  BIND_STATUS_STRING_BOUND_THIS,
  BIND_STATUS_STRING_BOUND_OTHER,
  MAINNET,
  TESTNET,
  DEVICE_NAME_IMKEY_PRO,
  RESULT_STATUS_SUCCESS,
  API_NAME_TRANSACTION_BTC,
  API_NAME_TRANSACTION_BTC_SEGWIT,
  API_NAME_TRANSACTION_BTC_USDT,
  API_NAME_TRANSACTION_BTC_USDT_SEGWIT,
  API_NAME_TRANSACTION_BCH,
  API_NAME_TRANSACTION_LTC,
  API_NAME_TRANSACTION_SIGNTX_ETH,
  API_NAME_TRANSACTION_SIGNMSG_ETH,
  API_NAME_TRANSACTION_SIGNTX_EOS,
  API_NAME_TRANSACTION_SIGNMSG_EOS,
  API_NAME_TRANSACTION_SIGNTX_COSMOS,
  API_NAME_TRANSACTION_SIGNTX_FILECOIN,
  API_NAME_TRANSACTION_SIGNTX_POLKADOT,
  API_NAME_TRANSACTION_SIGNTX_KUSAMA,
  API_NAME_TRANSACTION_SIGNTX_TRON,
  API_NAME_TRANSACTION_SIGNMSG_TRON,
  API_NAME_TRANSACTION_SIGNTX_XTZ,
  API_NAME_GET_BTC_XPUB,
  API_NAME_GET_ADDRESS_BTC,
  API_NAME_GET_ADDRESS_BTC_SEGWIT,
  API_NAME_REGISTER_ADDRESS_BTC,
  API_NAME_REGISTER_ADDRESS_BTC_SEGWIT,
  API_NAME_GET_ADDRESS_BCH,
  API_NAME_REGISTER_ADDRESS_BCH,
  API_NAME_GET_ADDRESS_LTC,
  API_NAME_REGISTER_ADDRESS_LTC,
  API_NAME_GET_ADDRESS_LTC_SEGWIT,
  API_NAME_REGISTER_ADDRESS_LTC_SEGWIT,
  API_NAME_GET_ADDRESS_ETH,
  API_NAME_REGISTER_ADDRESS_ETH,
  API_NAME_GET_PUBKEY_EOS,
  API_NAME_REGISTER_PUBKEY_EOS,
  API_NAME_GET_ADDRESS_COSMOS,
  API_NAME_REGISTER_ADDRESS_COSMOS,
  API_NAME_GET_ADDRESS_FILECOIN,
  API_NAME_REGISTER_ADDRESS_FILECOIN,
  API_NAME_GET_ADDRESS_POLKADOT,
  API_NAME_REGISTER_ADDRESS_POLKADOT,
  API_NAME_GET_ADDRESS_KUSAMA,
  API_NAME_REGISTER_ADDRESS_KUSAMA,
  API_NAME_GET_ADDRESS_TRON,
  API_NAME_REGISTER_ADDRESS_TRON,
  API_NAME_GET_ADDRESS_XTZ,
  API_NAME_REGISTER_ADDRESS_XTZ,
  XPubCommonKey128,
  XPubCommonIv
}
