const fs = require('node:fs')
const api = require('../../src/proto/api_pb.js')
const device = require('../../src/proto/device_pb.js')
const btc = require('../../src/proto/btc_pb.js')
const base = require('./e2e-connector.cjs')
let error = ''
let acquired = false
let xpubs = 0
let failed = false
function record(method) {
  if (process.env.IMKEY_E2E_LOG) fs.appendFileSync(process.env.IMKEY_E2E_LOG, method + '\n')
}
function response(schema, name, setter, value) {
  const message = new schema[name]()
  message[setter](value)
  return Buffer.from(message.serializeBinary()).toString('hex')
}
function failure(method, cause) {
  record(method)
  error = response(api, 'ErrorResponse', 'setError', cause)
  return ''
}
module.exports = {
  callImKeyApi(request) {
    error = ''
    const method = api.ImkeyAction.deserializeBinary(Buffer.from(request, 'hex')).getMethod()
    const scenario = process.env.IMKEY_E2E_WALLET_FAILURE
    const controlFile = process.env.IMKEY_E2E_SETUP_CONTROL_FILE
    const control =
      controlFile && fs.existsSync(controlFile)
        ? JSON.parse(fs.readFileSync(controlFile, 'utf8'))
        : {}
    if (control.delayMethod === method && control.delayMs > 0)
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, control.delayMs)
    if (control.failMethod === method) return failure(method, 'device_not_connected')
    if (method === 'get_seid' && control.seid) {
      record(method)
      return response(device, 'GetSeidRes', 'setSeid', control.seid)
    }
    if (method === 'bind_check' && control.bindStatus) {
      record(method)
      return response(device, 'BindCheckRes', 'setBindStatus', control.bindStatus)
    }
    const setupFailure = process.env.IMKEY_E2E_SETUP_FAILURE_FILE
    if (setupFailure && fs.existsSync(setupFailure)) {
      if (fs.readFileSync(setupFailure, 'utf8') === method)
        return failure(method, 'device_not_connected')
    }
    // Address prefetch is forbidden regardless of which applets the device has installed.
    if (method === 'get_address') return failure(method, 'imkey_command_format_error')
    // The first xpub read advances from wallet instructions to the completion page.
    // Fail the final completion check once, allowing the actual retry UI to recover.
    if (!failed && xpubs > 0) {
      if (
        (scenario === 'disconnected' && method === 'device_connect') ||
        (scenario === 'binding-failure' && method === 'bind_check')
      ) {
        failed = true
        record('wallet:' + scenario)
        return failure(
          method,
          scenario === 'disconnected' ? 'device_not_connected' : 'device_bind_check_failed'
        )
      }
      if (scenario === 'not-ready' && method === 'btc_get_xpub') {
        failed = true
        xpubs++
        record('wallet:' + scenario)
        record(method)
        return response(btc, 'BtcXpubRes', 'setXpub', '')
      }
    }
    if (method === 'btc_get_xpub') xpubs++
    if (method === 'bind_check' && acquired) {
      record(method)
      return response(device, 'BindCheckRes', 'setBindStatus', 'bound_this')
    }
    const result = base.callImKeyApi(request)
    if (method === 'bind_acquire' && !base.getLastErrorMessage()) acquired = true
    return result
  },
  getLastErrorMessage() {
    return error || base.getLastErrorMessage()
  }
}
