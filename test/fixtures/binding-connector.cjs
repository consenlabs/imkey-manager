const fs = require('node:fs')
const api = require('../../src/proto/api_pb.js')
const base = require('./e2e-connector.cjs')
let error = ''
let failed = false
function record(method) {
  if (process.env.IMKEY_E2E_LOG) fs.appendFileSync(process.env.IMKEY_E2E_LOG, method + '\n')
}
module.exports = {
  callImKeyApi(request) {
    error = ''
    const method = api.ImkeyAction.deserializeBinary(Buffer.from(request, 'hex')).getMethod()
    if (method === 'bind_acquire') {
      const gate = process.env.IMKEY_E2E_GATE + '-' + method
      if (fs.existsSync(gate)) {
        record('bind_acquire:waiting')
        const deadline = Date.now() + 20000
        while (fs.existsSync(gate) && Date.now() < deadline)
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10)
        if (fs.existsSync(gate)) {
          error = 'E2E binding gate timed out'
          return ''
        }
        record('bind_acquire:released')
      }
      if (process.env.IMKEY_E2E_BIND_ERROR === 'hid-once' && !failed) {
        failed = true
        record(method)
        error = 'hidapi error: hid_error is not implemented yet'
        return ''
      }
    }
    return base.callImKeyApi(request)
  },
  getLastErrorMessage() {
    return error || base.getLastErrorMessage()
  }
}
