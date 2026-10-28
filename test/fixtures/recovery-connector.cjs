const fs = require('node:fs')
const api = require('../../src/proto/api_pb.js')
const device = require('../../src/proto/device_pb.js')
const base = require('./e2e-connector.cjs')
let error = ''
let initialized = false
let acquired = false
let generation = 0
let displayedGeneration = -1

function record(value) {
  fs.appendFileSync(process.env.IMKEY_E2E_LOG, value + '\n')
}
function response(schema, name, setter, value) {
  const message = new schema[name]()
  message[setter](value)
  return Buffer.from(message.serializeBinary()).toString('hex')
}
function fail(method, cause) {
  record(method)
  error = response(api, 'ErrorResponse', 'setError', cause)
  return ''
}
function consume(id) {
  try {
    fs.writeFileSync(process.env.IMKEY_E2E_CONTROL + '.' + id, '', { flag: 'wx' })
    return true
  } catch (cause) {
    if (cause.code !== 'EEXIST') throw cause
    return false
  }
}

module.exports = {
  callImKeyApi(request) {
    error = ''
    const action = api.ImkeyAction.deserializeBinary(Buffer.from(request, 'hex'))
    const method = action.getMethod()
    const control = JSON.parse(fs.readFileSync(process.env.IMKEY_E2E_CONTROL, 'utf8'))
    if (generation !== (control.generation || 0)) {
      generation = control.generation || 0
      acquired = false
    }
    if (method !== 'init_imkey_core_x' && !initialized)
      return fail(method, 'imkey_core_not_initialized')
    const fault = control.fault
    if (fault?.method === method && consume(fault.id)) {
      record('fault:' + fault.kind + ':' + method)
      if (fault.kind === 'crash') {
        record(method)
        process.exit(73)
      }
      if (fault.kind === 'hang') {
        record(method)
        // The main process must kill the hung service; the mock never completes this call.
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 120000)
        return fail(method, 'mock_hang_was_not_cancelled')
      }
      return fail(method, fault.error || 'device_not_connected')
    }
    if (method === 'get_seid' || method === 'get_upgrade_seid' || method === 'get_sn') {
      record(method)
      return method !== 'get_sn'
        ? response(device, 'GetSeidRes', 'setSeid', control.seid || 'E2ESEID')
        : response(device, 'GetSnRes', 'setSn', control.sn || 'SN123')
    }
    if (method === 'bind_check') {
      record(method)
      return response(
        device,
        'BindCheckRes',
        'setBindStatus',
        acquired ? 'bound_this' : control.binding || 'bound_this'
      )
    }
    if (
      method === 'bind_acquire' &&
      control.binding === 'unbound' &&
      displayedGeneration !== generation
    )
      return fail(method, 'imkey_authcode_error')
    const result = base.callImKeyApi(request)
    if (method === 'init_imkey_core_x' && !base.getLastErrorMessage()) initialized = true
    if (method === 'bind_display_code' && !base.getLastErrorMessage())
      displayedGeneration = generation
    if (method === 'bind_acquire' && !base.getLastErrorMessage()) acquired = true
    return result
  },
  getLastErrorMessage() {
    return error || base.getLastErrorMessage()
  }
}
