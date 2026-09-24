const assert = require('assert')
const Module = require('module')

process.env.BABEL_ENV = 'main'
process.env.BABEL_DISABLE_CACHE = '1'
require('@babel/register')({ extensions: ['.js'], ignore: [/node_modules/] })

const apiPb = require('../../src/proto/api_pb')
const btcPb = require('../../src/proto/btc_pb')
const originalLoad = Module._load
let lastMethod

Module._load = function (request, parent, isMain) {
  if (request === './callimkeycore' && parent.filename.endsWith('/src/api/walletapi.js')) {
    return {
      callImKeyApi (requestHex) {
        const action = apiPb.ImkeyAction.deserializeBinary(Buffer.from(requestHex, 'hex'))
        lastMethod = action.getMethod()
        if (lastMethod === 'btc_get_xpub') {
          const response = new btcPb.BtcXpubRes()
          response.setXpub('xpub-test')
          return Buffer.from(response.serializeBinary()).toString('hex')
        }
        if (lastMethod === 'get_pub_key' || lastMethod === 'register_pub_key') {
          const response = new apiPb.EosWallet()
          response.setAddress('eos-test')
          return Buffer.from(response.serializeBinary()).toString('hex')
        }
        const addressRequest = apiPb.AddressParam.deserializeBinary(action.getParam().getValue())
        if (lastMethod === 'get_address' && addressRequest.getChaintype() === 'BITCOIN') {
          const response = new apiPb.BitcoinWallet()
          response.setAddress('btc-test')
          return Buffer.from(response.serializeBinary()).toString('hex')
        }
        const response = new apiPb.AddressResult()
        response.setAddress('address-test')
        return Buffer.from(response.serializeBinary()).toString('hex')
      },
      getLastErrorMessage () { return '' }
    }
  }
  return originalLoad.apply(this, arguments)
}

let walletApi
try {
  walletApi = require('../../src/api/walletapi')
} finally {
  Module._load = originalLoad
}

assert.strictEqual(walletApi.getBTCXpub().result, 'xpub-test')
assert.strictEqual(lastMethod, 'btc_get_xpub')
assert.strictEqual(walletApi.getBTCAddress({ path: "m/44'/0'/0'/0/0", network: 'MAINNET' }).result.address, 'btc-test')
assert.strictEqual(walletApi.getETHAddress({ path: "m/44'/60'/0'/0/0" }).result.address, 'address-test')
assert.strictEqual(lastMethod, 'get_address')
assert.strictEqual(walletApi.registerETHAddress({ path: "m/44'/60'/0'/0/0" }).result.address, 'address-test')
assert.strictEqual(lastMethod, 'register_address')
assert.strictEqual(walletApi.registerEOSPubKey({ path: "m/44'/194'/0'/0/0" }).result.address, 'eos-test')
assert.strictEqual(lastMethod, 'register_pub_key')

console.log('Wallet address API checks passed')
