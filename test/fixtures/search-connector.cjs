const original = require('./e2e-connector.cjs')
const api = require('../../src/proto/api_pb.js')
const device = require('../../src/proto/device_pb.js')
const fs = require('node:fs')
const versions = new Map([
  ['Ethereum', '1.0'],
  ['Polkadot', 'none'],
  ['Beta[+](x)/', 'none'],
  ['IMK', '1.0']
])
let error = ''
let deletionFailed = false
function hex(value) {
  return Buffer.from(value.serializeBinary()).toString('hex')
}
module.exports = {
  callImKeyApi(request) {
    error = ''
    const action = api.ImkeyAction.deserializeBinary(Buffer.from(request, 'hex'))
    const method = action.getMethod()
    if (method === 'check_update') {
      const result = new device.CheckUpdateRes()
      result.setStatus('latest')
      result.setAvailableAppListList(
        [...versions].map(([name, current]) => {
          const entry = new device.AvailableAppBean()
          entry.setAppName(name)
          entry.setInstalledVersion(current)
          entry.setLatestVersion('1.0')
          entry.setAppLogo('')
          return entry
        })
      )
      return hex(result)
    }
    if (['app_download', 'app_update', 'app_delete'].includes(method)) {
      const type =
        method === 'app_download'
          ? 'AppDownloadReq'
          : method === 'app_update'
            ? 'AppUpdateReq'
            : 'AppDeleteReq'
      const name = device[type].deserializeBinary(action.getParam().getValue_asU8()).getAppName()
      if (process.env.IMKEY_SEARCH_LOG)
        fs.appendFileSync(process.env.IMKEY_SEARCH_LOG, JSON.stringify({ method, name }) + '\n')
      if (method === 'app_delete' && !deletionFailed) {
        deletionFailed = true
        const response = new api.ErrorResponse()
        response.setError('device_not_connected')
        error = hex(response)
        return ''
      }
      versions.set(name, method === 'app_delete' ? 'none' : '1.0')
    }
    return original.callImKeyApi(request)
  },
  getLastErrorMessage() {
    return error || original.getLastErrorMessage()
  }
}
