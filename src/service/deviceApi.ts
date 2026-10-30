import type { Connector } from './connector/ConnectorClient'
import {
  api,
  btc,
  device,
  create,
  decode,
  encode,
  invoke,
  nativeErrorMessage,
  type Message
} from './protobuf'
import type { DeviceResult } from '../shared/deviceContract'
import constants from '../common/constants'
const deviceResponses: Record<string, [string, string | null]> = {
  get_seid: ['GetSeidRes', 'getSeid'],
  get_upgrade_seid: ['GetSeidRes', 'getSeid'],
  get_sn: ['GetSnRes', 'getSn'],
  get_ram_size: ['GetRamSizeRes', 'getRamSize'],
  get_firmware_version: ['GetFirmwareVersionRes', 'getFirmwareVersion'],
  get_ble_version: ['GetBleVersionRes', 'getBleVersion'],
  get_sdk_info: ['GetSdkInfoRes', 'getSdkVersion'],
  check_update: ['CheckUpdateRes', null],
  cos_check_update: ['CosCheckUpdateRes', null],
  is_bl_status: ['IsBlStatusRes', 'getCheckResult'],
  bind_check: ['BindCheckRes', 'getBindStatus'],
  device_sn_check: ['DeviceSnCheckRes', null]
}
export class DeviceApi {
  constructor(
    private connector: Connector,
    private userData: string
  ) {}
  getUserPath(): DeviceResult {
    return { isSuccess: true, result: this.userData.replace(/\/$/, '') + '/' }
  }
  private request(
    method: string,
    param?: Message,
    schema = api,
    response = 'CommonResponse',
    getter: string | null = 'getResult'
  ): DeviceResult {
    const hex = this.connector.callImKeyApi(encode(method, param))
    const error = this.connector.getLastErrorMessage()
    if (error !== '' && error !== null)
      return {
        isSuccess: false,
        result: nativeErrorMessage(error)
      }
    if (
      typeof hex !== 'string' ||
      (hex && (hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex))) ||
      (!hex &&
        [
          'GetSeidRes',
          'GetSnRes',
          'GetFirmwareVersionRes',
          'GetBleVersionRes',
          'DeviceSnCheckRes',
          'BtcXpubRes'
        ].includes(response))
    )
      return {
        isSuccess: false,
        result: `Invalid connector response for ${method}`,
        code: 'INVALID_RESPONSE'
      }
    try {
      const message = decode(schema, response, hex)
      return {
        isSuccess: true,
        result: getter ? invoke<unknown>(message, getter) : message.toObject()
      }
    } catch {
      return {
        isSuccess: false,
        result: `Invalid connector response for ${method}`,
        code: 'INVALID_RESPONSE'
      }
    }
  }
  initImKeyCore(): DeviceResult {
    return this.request(
      'init_imkey_core_x',
      create(api, 'InitImKeyCoreXParam', {
        setFiledir: this.getUserPath().result,
        setXpubcommonkey: constants.XPubCommonKey128,
        setXpubcommoniv: constants.XPubCommonIv,
        setIsdebug: false,
        setTerminaltype: constants.terminalType,
        setSdkversion: constants.sdkVersion,
        setServerurl: constants.serverUrl
      })
    )
  }
  connect(): DeviceResult {
    return this.request(
      'device_connect',
      create(device, 'DeviceConnectReq', { setDeviceModelName: undefined })
    )
  }
  deviceMethod(method: string): DeviceResult {
    const descriptor = deviceResponses[method]
    return descriptor
      ? this.request(method, undefined, device, ...descriptor)
      : this.request(method)
  }
  getRamSize(): DeviceResult {
    const response = this.deviceMethod('get_ram_size')
    return response.isSuccess
      ? { isSuccess: true, result: parseInt(String(response.result).substring(4, 8), 16) }
      : response
  }
  applet(method: 'app_download' | 'app_update' | 'app_delete', name: string): DeviceResult {
    const classes = {
      app_download: 'AppDownload',
      app_update: 'AppUpdate',
      app_delete: 'AppDelete'
    }
    const prefix = classes[method]
    return this.request(
      method,
      create(device, prefix + 'Req', { setAppName: name }),
      method === 'app_delete' ? api : device,
      method === 'app_delete' ? 'CommonResponse' : prefix + 'Res',
      method === 'app_delete' ? 'getResult' : 'getAddressRegisterListList'
    )
  }
  bindAcquire(code: string): DeviceResult {
    return this.request(
      'bind_acquire',
      create(device, 'BindAcquireReq', { setBindCode: code }),
      device,
      'BindAcquireRes',
      'getBindResult'
    )
  }
  applets(installedOnly: boolean): DeviceResult {
    const response = this.deviceMethod('check_update')
    if (!response.isSuccess) return response
    try {
      const data = response.result as {
        availableAppListList: {
          appName: string
          installedVersion: string | null
          latestVersion: string
          appLogo: string
        }[]
        status: string
      }
      const list: Record<string, unknown>[] = []
      for (let id = 0; id < data.availableAppListList.length; id++) {
        const entry = data.availableAppListList[id]
        if (installedOnly) {
          if (
            entry.installedVersion !== 'none' &&
            entry.installedVersion !== null &&
            entry.appName !== 'IMK'
          )
            list.push({ name: entry.appName })
          continue
        }
        list.push({
          name: entry.appName,
          installedVersion: entry.installedVersion === 'none' ? null : entry.installedVersion,
          latestVersion: entry.latestVersion,
          icon: entry.appLogo
        })
      }
      return { isSuccess: true, result: { status: data.status, total: list.length, list } }
    } catch (error) {
      return { isSuccess: false, result: error instanceof Error ? error.message : String(error) }
    }
  }
  getBTCXpub(): DeviceResult {
    return this.request(
      'btc_get_xpub',
      create(btc, 'BtcXpubReq', { setPath: "m/44'/0'/0'/0/0", setNetwork: 'MAINNET' }),
      btc,
      'BtcXpubRes',
      'getXpub'
    )
  }
  registerAddress(chain: string, path: string, network = ''): DeviceResult {
    return this.request(
      'register_address',
      create(api, 'AddressParam', {
        setChaintype: chain,
        setPath: path,
        setNetwork: network,
        setIssegwit: false
      }),
      api,
      'AddressResult',
      null
    )
  }
  registerEOSPubKey(path: string): DeviceResult {
    return this.request(
      'register_pub_key',
      create(api, 'PubKeyParam', {
        setChaintype: 'EOS',
        setPath: path,
        setNetwork: '',
        setIssegwit: false
      }),
      api,
      'EosWallet',
      null
    )
  }
}
