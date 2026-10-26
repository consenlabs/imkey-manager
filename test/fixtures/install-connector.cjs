const original = require('./e2e-connector.cjs')
const api = require('../../src/proto/api_pb.js')
const device = require('../../src/proto/device_pb.js')
const fs = require('node:fs')
const installed = new Set()
let error = ''

function control() {
  return JSON.parse(fs.readFileSync(process.env.IMKEY_INSTALL_CONTROL, 'utf8'))
}
function hex(message) {
  return Buffer.from(message.serializeBinary()).toString('hex')
}
function log(entry) {
  fs.appendFileSync(process.env.IMKEY_INSTALL_LOG, JSON.stringify(entry) + '\n')
}

module.exports = {
  callImKeyApi(request) {
    error = ''
    const action = api.ImkeyAction.deserializeBinary(Buffer.from(request, 'hex'))
    const method = action.getMethod()
    let options = control()
    const entry = { method }
    if (method === 'app_download' || method === 'app_update') {
      const type = method === 'app_download' ? 'AppDownloadReq' : 'AppUpdateReq'
      entry.name = device[type].deserializeBinary(action.getParam().getValue_asU8()).getAppName()
    }
    if (method === 'register_address') {
      const params = api.AddressParam.deserializeBinary(action.getParam().getValue_asU8())
      entry.chain = params.getChaintype()
      entry.path = params.getPath()
      entry.network = params.getNetwork()
    }
    log(entry)
    if (method === 'device_connect' && options.gate) {
      const deadline = Date.now() + 15000
      while (options.gate && Date.now() < deadline) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20)
        options = control()
      }
      if (options.gate || options.failConnect) {
        const failure = new api.ErrorResponse()
        failure.setError('device_not_connected')
        error = hex(failure)
        return ''
      }
    }
    if (method === 'check_update') {
      const result = new device.CheckUpdateRes()
      result.setStatus('latest')
      result.setAvailableAppListList(
        ['Nervos', 'Tezos', 'Bitcoin Cash', 'IMK', 'Ethereum'].map(name => {
          const applet = new device.AvailableAppBean()
          applet.setAppName(name)
          applet.setInstalledVersion(installed.has(name) ? '1.0' : 'none')
          applet.setLatestVersion('1.0')
          applet.setAppLogo('')
          return applet
        })
      )
      return hex(result)
    }
    if (method === 'app_download' || method === 'app_update') {
      installed.add(entry.name)
      const result = new device[method === 'app_download' ? 'AppDownloadRes' : 'AppUpdateRes']()
      result.setAddressRegisterListList(options.addresses || [entry.name])
      return hex(result)
    }
    return original.callImKeyApi(request)
  },
  getLastErrorMessage() {
    return error || original.getLastErrorMessage()
  }
}
