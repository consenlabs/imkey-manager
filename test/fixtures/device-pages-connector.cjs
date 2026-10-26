const fs = require('node:fs')
const api = require('../../src/proto/api_pb.js')
const device = require('../../src/proto/device_pb.js')
const base = require('./e2e-connector.cjs')
let error = ''

function configuration() {
  return JSON.parse(fs.readFileSync(process.env.IMKEY_DEVICE_PAGES_CONTROL, 'utf8'))
}
function response(name, setters) {
  const message = new device[name]()
  for (const [setter, value] of Object.entries(setters)) message[setter](value)
  return Buffer.from(message.serializeBinary()).toString('hex')
}
function failure(cause) {
  const message = new api.ErrorResponse()
  message.setError(cause)
  error = Buffer.from(message.serializeBinary()).toString('hex')
  return ''
}
function consume(id) {
  try {
    fs.writeFileSync(process.env.IMKEY_DEVICE_PAGES_CONTROL + '.' + id, '', { flag: 'wx' })
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
    let control = configuration()
    fs.appendFileSync(process.env.IMKEY_DEVICE_PAGES_LOG, method + '\n')
    if (control.gate && control.gateMethod === method) {
      const deadline = Date.now() + 15000
      while (control.gate && Date.now() < deadline) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20)
        control = configuration()
      }
      if (control.gate) return failure('mock_device_gate_not_released')
    }
    if (control.fault?.method === method && consume(control.fault.id))
      return failure(control.fault.error || 'device_not_connected')
    if (method === 'get_seid') return response('GetSeidRes', { setSeid: control.seid || 'E2ESEID' })
    if (method === 'get_sn') return response('GetSnRes', { setSn: control.sn || 'PAGE-SN-A' })
    if (method === 'bind_check')
      return response('BindCheckRes', { setBindStatus: control.binding || 'bound_this' })
    if (method === 'get_firmware_version')
      return response('GetFirmwareVersionRes', { setFirmwareVersion: control.firmware || '1.9.05' })
    if (method === 'get_ble_version')
      return response('GetBleVersionRes', { setBleVersion: control.ble || '3.0.03' })
    if (method === 'cos_check_update')
      return response('CosCheckUpdateRes', {
        setIsLatest: !control.update,
        setIsUpdateSuccess: true,
        setLatestCosVersion: control.update ? '2.0.0' : control.firmware || '1.9.05',
        setLatestBleVersion: control.ble || '3.0.03'
      })
    if (method === 'device_sn_check')
      return response('DeviceSnCheckRes', {
        setSnCheckResult: control.snValid !== false,
        setIsActivate: control.activated !== false,
        setActivateTime: control.activatedAt === undefined ? '2026-10-18' : control.activatedAt
      })
    return base.callImKeyApi(request)
  },
  getLastErrorMessage() {
    return error || base.getLastErrorMessage()
  }
}
