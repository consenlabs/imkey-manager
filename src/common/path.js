const BTC_PATH_PREFIX = "m/44'/0'/0'"
const BITCOIN_TESTNET_PATH = "m/44'/1'/0'"
const BTC_SEGWIT_PATH_PREFIX = "m/49'/0'/0'/"
const BITCOIN_SEGWIT_TESTNET_PATH = "m/49'/1'/0'/"
const ETH_LEDGER = "m/44'/60'/0'/0/0"
const EOS_LEDGER = "m/44'/194'/0'/0/0"
const COSMOS_LEDGER = "m/44'/118'/0'/0/0"
//
// function checkPath (path) {
//   // 深度大于1，小于10，目前规范是5
//   if (path.split('/').length < 2 || path.split('/').length > 10) {
//     throw new ImkeyException(Messages.IMKEY_PATH_ILLEGAL)
//   }
//
//   // 长度不超过100个字符
//   if (path.length() > 100) {
//     throw new ImkeyException(Messages.IMKEY_PATH_ILLEGAL)
//   }
//
//   // 以m/开头
//   const regEx = "^m/[0-9'/]+$"
//   if (!Pattern.matches(regEx, path)) {
//     throw new ImkeyException(Messages.IMKEY_PATH_ILLEGAL)
//   }
// }

module.exports = {
  BTC_PATH_PREFIX,
  BITCOIN_TESTNET_PATH,
  BTC_SEGWIT_PATH_PREFIX,
  BITCOIN_SEGWIT_TESTNET_PATH,
  ETH_LEDGER,
  EOS_LEDGER,
  COSMOS_LEDGER
}
