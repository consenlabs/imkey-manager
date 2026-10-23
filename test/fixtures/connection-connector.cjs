const fs = require('node:fs')
const api = require('../../src/proto/api_pb.js')
const base = require('./e2e-connector.cjs')
let error = ''
let rejected = false
module.exports = {
  callImKeyApi(request) {
    error = ''
    const method = api.ImkeyAction.deserializeBinary(Buffer.from(request, 'hex')).getMethod()
    const gate = process.env.IMKEY_E2E_GATE + '-' + method
    const deadline = Date.now() + 20000
    while (fs.existsSync(gate) && Date.now() < deadline)
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10)
    if (method === 'check_update' && !rejected) {
      rejected = true
      const failure = new api.ErrorResponse()
      failure.setError('imkey_tsm_device_illegal')
      error = Buffer.from(failure.serializeBinary()).toString('hex')
      return ''
    }
    return base.callImKeyApi(request)
  },
  getLastErrorMessage() {
    return error || base.getLastErrorMessage()
  }
}
