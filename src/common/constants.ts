// sdk version
const sdkVersion = '2.10.3'
// serverurl
const serverUrl = 'https://imkeyserver.com:10444/imkey'
// Terminaltype
const terminalType = 'PC'

// 设备绑定状态
const BIND_STATUS_STRING_UNBOUND = 'unbound'
const BIND_STATUS_STRING_BOUND_THIS = 'bound_this'
const BIND_STATUS_STRING_BOUND_OTHER = 'bound_other'
// 成功状态
const RESULT_STATUS_SUCCESS = 'success'
const XPubCommonKey128 = 'B888D25EC8C12BD5043777B1AC49F872'
const XPubCommonIv = '9C0C30889CBCC5E01AB5B2BB88715799'

export default {
  sdkVersion,
  serverUrl,
  terminalType,
  BIND_STATUS_STRING_UNBOUND,
  BIND_STATUS_STRING_BOUND_THIS,
  BIND_STATUS_STRING_BOUND_OTHER,
  RESULT_STATUS_SUCCESS,
  XPubCommonKey128,
  XPubCommonIv
}
