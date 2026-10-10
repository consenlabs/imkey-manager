const api = require('../../src/proto/api_pb.js')
const device = require('../../src/proto/device_pb.js')
const btc = require('../../src/proto/btc_pb.js')
const fs = require('node:fs')
let error = ''
let acquired = false
let installed = false
let upgraded = false
let checks = 0
let registrations = 0
function hex(value) {
  return Buffer.from(value.serializeBinary()).toString('hex')
}
function response(schema, name, setter, value) {
  const message = new schema[name]()
  if (setter) message[setter](value)
  return hex(message)
}
module.exports = {
  callImKeyApi(request) {
    error = ''
    const action = api.ImkeyAction.deserializeBinary(Buffer.from(request, 'hex'))
    const method = action.getMethod()
    const scenario = process.env.IMKEY_E2E_SCENARIO || 'ready'
    if (process.env.IMKEY_E2E_LOG) fs.appendFileSync(process.env.IMKEY_E2E_LOG, method + '\n')
    if (scenario === 'slow-init' && method === 'init_imkey_core_x')
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300)
    if (method === 'bind_acquire') {
      const params = device.BindAcquireReq.deserializeBinary(action.getParam().getValue_asU8())
      if (params.getBindCode() === 'B2345678')
        return response(device, 'BindAcquireRes', 'setBindResult', 'error')
      acquired = true
    }
    if (method === 'cos_update') upgraded = true
    if (method === 'app_download') installed = true
    if (method === 'app_delete') installed = false
    if (method === 'register_address') registrations++
    if (
      (scenario.startsWith('disconnected') && method === 'device_connect') ||
      ((scenario === 'register-failure' || scenario.startsWith('cos-address')) &&
        method === 'register_address' &&
        (scenario !== 'register-failure' || registrations === 1))
    ) {
      error = scenario.endsWith('-plain')
        ? 'get_seid_error'
        : response(api, 'ErrorResponse', 'setError', 'device_not_connected')
      return ''
    }
    const descriptors = {
      get_seid: ['GetSeidRes', 'setSeid', 'E2ESEID'],
      get_sn: ['GetSnRes', 'setSn', 'SN123'],
      get_ram_size: ['GetRamSizeRes', 'setRamSize', '00000080'],
      get_firmware_version: [
        'GetFirmwareVersionRes',
        'setFirmwareVersion',
        upgraded && scenario.startsWith('cos-') ? '2.0.0' : '1.0.0'
      ],
      get_ble_version: ['GetBleVersionRes', 'setBleVersion', '1.0.0'],
      get_sdk_info: ['GetSdkInfoRes', 'setSdkVersion', '2.10.3'],
      bind_check: [
        'BindCheckRes',
        'setBindStatus',
        scenario === 'unbound'
          ? 'unbound'
          : scenario === 'bound-other' && !acquired
            ? 'bound_other'
            : 'bound_this'
      ],
      bind_acquire: ['BindAcquireRes', 'setBindResult', 'success'],
      is_bl_status: ['IsBlStatusRes', 'setCheckResult', false]
    }
    if (descriptors[method]) return response(device, ...descriptors[method])
    if (method === 'check_update') {
      const result = new device.CheckUpdateRes()
      result.setStatus(scenario === 'inactive' ? 'inactive' : 'latest')
      const entry = new device.AvailableAppBean()
      entry.setAppName('Ethereum')
      entry.setInstalledVersion(
        upgraded ? '1.0' : installed || scenario === 'app-update' ? '0.9' : 'none'
      )
      entry.setLatestVersion('1.0')
      entry.setAppLogo('')
      result.setAvailableAppListList([entry])
      return hex(result)
    }
    if (method === 'cos_check_update') {
      const result = new device.CosCheckUpdateRes()
      checks++
      const offer =
        (checks > 1 && scenario.startsWith('cos-')) || (checks > 1 && scenario === 'ble-only')
      result.setIsLatest(!offer || upgraded)
      result.setIsUpdateSuccess(true)
      result.setLatestCosVersion(offer && scenario !== 'ble-only' ? '2.0.0' : '1.0.0')
      result.setLatestBleVersion(offer && scenario === 'ble-only' ? '2.0.0' : '1.0.0')
      return hex(result)
    }
    if (method === 'btc_get_xpub')
      return response(
        btc,
        'BtcXpubRes',
        'setXpub',
        scenario === 'wallet-not-ready' ? '' : 'xpub-e2e'
      )
    if (method === 'get_address' || method === 'register_address')
      return response(api, 'AddressResult', 'setAddress', '0xe2e-address')
    if (method === 'register_pub_key') return response(api, 'EosWallet', 'setAddress', 'eos-e2e')
    if (method === 'app_download' || method === 'app_update')
      return response(
        device,
        method === 'app_download' ? 'AppDownloadRes' : 'AppUpdateRes',
        'setAddressRegisterListList',
        ['Ethereum']
      )
    return response(api, 'CommonResponse', 'setResult', 'success')
  },
  getLastErrorMessage() {
    return error
  }
}
