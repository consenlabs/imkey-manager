const api = require('../../src/proto/api_pb.js')
const device = require('../../src/proto/device_pb.js')
const btc = require('../../src/proto/btc_pb.js')
const fs = require('node:fs')
let error = ''
function hex(message) {
  return Buffer.from(message.serializeBinary()).toString('hex')
}
function response(schema, name, setter, value) {
  const message = new schema[name]()
  if (setter) message[setter](value)
  return hex(message)
}
function read(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (failure) {
    if (failure.code === 'ENOENT') return fallback
    throw failure
  }
}
module.exports = {
  callImKeyApi(request) {
    error = ''
    const action = api.ImkeyAction.deserializeBinary(Buffer.from(request, 'hex'))
    const method = action.getMethod()
    const control = read(process.env.IMKEY_E2E_CONTROL, {})
    const seid = control.seid || 'RESUMEDEVICEA'
    const states = read(process.env.IMKEY_E2E_STATE, {})
    const state = (states[seid] ||= {
      cosWritten: false,
      physicalWrites: 0,
      appsInstalled: control.mode === 'normal',
      serverComplete: control.mode === 'normal',
      bleDone: false,
      binding: 'bound_this',
      addressAttempts: 0,
      addressWrites: 0,
      bindingAttempts: 0,
      captureReadFailures: 0,
      firmwareVersion: control.initialCos || '2.0.0'
    })
    // Apply test-controlled transaction changes in the serialized connector
    // process. External writes to device-state.json can race a native call's
    // read/save cycle and be silently overwritten by its older snapshot.
    if (control.injectNativeIncomplete && !state.injectNativeIncompleteApplied) {
      state.injectNativeIncompleteApplied = true
      state.cosWritten = true
      state.serverComplete = false
    }
    if (control.resetBindingOnce && !state.resetBindingOnceApplied) {
      state.resetBindingOnceApplied = true
      state.binding = control.resetBindingStatus || 'unbound'
    }
    const save = () => {
      fs.writeFileSync(process.env.IMKEY_E2E_STATE + '.tmp', JSON.stringify(states))
      fs.renameSync(process.env.IMKEY_E2E_STATE + '.tmp', process.env.IMKEY_E2E_STATE)
    }
    save()
    fs.appendFileSync(process.env.IMKEY_E2E_LOG, JSON.stringify({ seid, method }) + '\n')
    const fail = message => {
      error = response(api, 'ErrorResponse', 'setError', message)
      return ''
    }
    if (method === 'cos_update') {
      if (control.delayNativeMs)
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, control.delayNativeMs)
      if (control.failIncompleteResponse)
        return fail('missing field `_ReturnData` at line 1 column 100')
      if (!state.cosWritten || (state.serverComplete && state.binding === 'bound_this')) {
        state.cosWritten = true
        state.physicalWrites++
        state.firmwareVersion = control.installedCos || '1.0.0'
        state.appsInstalled = false
        state.serverComplete = false
        state.binding = control.postUpdateBinding || 'unbound'
        save()
      }
      if (control.failNativeApps) return fail('imkey_tsm_app_download_fail')
      state.appsInstalled = true
      state.serverComplete = true
      state.bleDone = true
      save()
      // Simulate losing the native result after the server and hardware finished.
      if (control.failAfterNativeSuccess)
        return fail('missing field `_ReturnData` at line 1 column 100')
    }
    if (method === 'bind_acquire') {
      state.bindingAttempts++
      save()
      if (control.failBinding) return fail('imkey_tsm_bind_acquire_fail')
      if (control.validBindingCode) {
        const code = device.BindAcquireReq.deserializeBinary(action.getParam().getValue_asU8())
          .getBindCode()
          .toUpperCase()
        if (code !== control.validBindingCode.toUpperCase()) return fail('imkey_authcode_error')
      }
      state.binding = 'bound_this'
      save()
    }
    if (method === 'register_address') {
      if (control.delayAddressMs)
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, control.delayAddressMs)
      state.addressAttempts++
      save()
      if (control.failAddress) return fail('imkey_address_registration_fail')
      state.addressWrites++
      save()
    }
    if (method === 'bind_check' && control.failBindingCheck)
      return fail('imkey_tsm_bind_check_fail')
    if (method === 'get_life_time') {
      if (control.failLifeTime) return fail('get_life_time_error')
      if (control.walletDataError) return fail('imkey_command_data_error')
      if (control.failWallet) return fail('imkey_wallet_read_failed')
      return response(
        device,
        'GetLifeTimeRes',
        'setLifeTime',
        control.walletState ||
          (control.walletMissing ? 'life_time_wallet_unready' : 'life_time_wallet_ready')
      )
    }
    if (
      method === 'get_firmware_version' &&
      state.cosWritten &&
      state.binding === 'unbound' &&
      (control.failCaptureRead === 'persistent' ||
        (control.failCaptureRead === 'once' && state.captureReadFailures === 0))
    ) {
      state.captureReadFailures++
      save()
      return fail('get_firmware_version_error')
    }
    const descriptors = {
      get_seid: ['GetSeidRes', 'setSeid', seid],
      get_upgrade_seid: ['GetSeidRes', 'setSeid', seid],
      get_sn: ['GetSnRes', 'setSn', 'SN-RESUME'],
      get_ram_size: ['GetRamSizeRes', 'setRamSize', '00000080'],
      get_firmware_version: ['GetFirmwareVersionRes', 'setFirmwareVersion', state.firmwareVersion],
      get_ble_version: ['GetBleVersionRes', 'setBleVersion', state.bleDone ? '1.1.0' : '1.0.0'],
      get_sdk_info: ['GetSdkInfoRes', 'setSdkVersion', '2.10.3'],
      bind_check: ['BindCheckRes', 'setBindStatus', control.binding || state.binding],
      bind_acquire: ['BindAcquireRes', 'setBindResult', 'success'],
      is_bl_status: [
        'IsBlStatusRes',
        'setCheckResult',
        control.mode !== 'normal' && !state.cosWritten
      ]
    }
    if (descriptors[method]) return response(device, ...descriptors[method])
    if (method === 'check_update') {
      if (!state.appsInstalled) return fail('imkey_tsm_device_update_check_fail')
      const result = new device.CheckUpdateRes()
      result.setStatus('latest')
      const entry = new device.AvailableAppBean()
      entry.setAppName('Ethereum')
      entry.setInstalledVersion('1.0')
      entry.setLatestVersion('1.0')
      entry.setAppLogo('')
      const entries = [entry]
      if (control.extraApplet) {
        const extra = new device.AvailableAppBean()
        extra.setAppName('Polkadot')
        extra.setInstalledVersion(
          state.polkadotInstalled
            ? control.extraAppletUpdate
              ? '2.0'
              : '1.0'
            : control.extraAppletUpdate
              ? '1.0'
              : 'none'
        )
        extra.setLatestVersion(control.extraAppletUpdate ? '2.0' : '1.0')
        extra.setAppLogo('')
        entries.push(extra)
      }
      result.setAvailableAppListList(entries)
      return hex(result)
    }
    if (method === 'cos_check_update') {
      if (control.failCosCheck) return fail('firmware_check_unavailable')
      const result = new device.CosCheckUpdateRes()
      const pending = state.cosWritten && !state.serverComplete
      const offered = control.offer || control.mode !== 'normal' || state.cosWritten
      const latestCos = offered ? control.latestCos || '1.0.0' : control.initialCos || '2.0.0'
      result.setIsLatest(
        !offered || (state.serverComplete && state.bleDone && state.firmwareVersion === latestCos)
      )
      result.setIsUpdateSuccess(!pending)
      result.setLatestCosVersion(latestCos)
      result.setLatestBleVersion(offered ? '1.1.0' : '1.0.0')
      return hex(result)
    }
    if (method === 'app_download') {
      state.polkadotInstalled = true
      save()
      const result = new device.AppDownloadRes()
      result.setAddressRegisterListList(['Polkadot'])
      return hex(result)
    }
    if (method === 'app_update') {
      state.polkadotInstalled = true
      save()
      const result = new device.AppUpdateRes()
      result.setAddressRegisterListList(['Polkadot'])
      return hex(result)
    }
    if (method === 'btc_get_xpub') {
      if (control.failBtcRead) return fail('imkey_applet_not_exist')
      if (control.walletMissing) return fail('imkey_wallet_not_created')
      if (control.walletDataError) return fail('imkey_command_data_error')
      if (control.failWallet) return fail('imkey_wallet_read_failed')
      if (!state.appsInstalled || (control.binding || state.binding) !== 'bound_this')
        return fail('imkey_wallet_not_created')
      return response(btc, 'BtcXpubRes', 'setXpub', 'xpub-resumed-wallet')
    }
    if (method === 'device_sn_check') {
      const result = new device.DeviceSnCheckRes()
      result.setSnCheckResult(true)
      result.setIsActivate(true)
      result.setActivateTime('2026-10-18')
      return hex(result)
    }
    if (method === 'get_address' || method === 'register_address')
      return response(api, 'AddressResult', 'setAddress', '0x-resumed-address')
    return response(api, 'CommonResponse', 'setResult', 'success')
  },
  getLastErrorMessage() {
    return error
  }
}
