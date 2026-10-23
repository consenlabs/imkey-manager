import type { DeviceMethod, DeviceResult } from '../shared/deviceContract'
import type { Connector } from './connector/ConnectorClient'
import { DeviceApi } from './deviceApi'
export type Handler = (params?: unknown) => DeviceResult | Promise<DeviceResult>
const chains: Record<string, { chain: string; path: string; network?: string }> = {
  Bitcoin: { chain: 'BITCOIN', path: "m/44'/0'/0'", network: 'MAINNET' },
  Ethereum: { chain: 'ETHEREUM', path: "m/44'/60'/0'/0/0" },
  EOS: { chain: 'EOS', path: "m/44'/194'/0'/0/0" },
  Cosmos: { chain: 'COSMOS', path: "m/44'/118'/0'/0/0" },
  Filecoin: { chain: 'FILECOIN', path: "m/44'/461'/0'/0/0" },
  Polkadot: { chain: 'POLKADOT', path: "m/44'/354'/0'/0'/0'" },
  Kusama: { chain: 'KUSAMA', path: "m/44'/434'/0'/0'/0'" },
  TRON: { chain: 'TRON', path: "m/44'/195'/0'/0/0" }
}
export function createDeviceHandlers(
  connector: Connector,
  userData: string
): Record<DeviceMethod, Handler> {
  const api = new DeviceApi(connector, userData)
  const manage =
    (method: string): Handler =>
    () =>
      api.deviceMethod(method)
  const storage: Handler = () => ({
    isSuccess: false,
    result: 'Bind code storage belongs to main process'
  })
  return {
    initImKeyCore: () => api.initImKeyCore(),
    connectDevice: () => api.connect(),
    getSeid: manage('get_seid'),
    getSn: manage('get_sn'),
    getRamSize: () => api.getRamSize(),
    getFirmwareVersion: manage('get_firmware_version'),
    getBleVersion: manage('get_ble_version'),
    getSdkInfo: manage('get_sdk_info'),
    activeDevice: manage('device_activate'),
    cosUpdate: manage('cos_update'),
    cosCheckUpdate: manage('cos_check_update'),
    isBLStatus: manage('is_bl_status'),
    checkDevice: manage('device_secure_check'),
    checkUpdate: () => api.applets(false),
    getInstalledApplets: () => api.applets(true),
    downloadApplet: p => api.applet('app_download', p as string),
    updateApplet: p => api.applet('app_update', p as string),
    deleteApplet: p => api.applet('app_delete', p as string),
    deviceBindCheck: manage('bind_check'),
    deviceBindAcquire: p => api.bindAcquire(p as string),
    deviceBindDisplay: manage('bind_display_code'),
    getBTCXpub: () => {
      const binding = api.deviceMethod('bind_check')
      if (!binding.isSuccess) return binding
      if (binding.result !== 'bound_this')
        return { isSuccess: false, result: 'device_bind_check_failed' }
      return api.getBTCXpub()
    },
    getUserPath: () => api.getUserPath(),
    importBindCode: storage,
    exportBindCode: storage,
    isExistBindCodeFile: storage,
    writeWalletAddress: p => {
      const binding = api.deviceMethod('bind_check')
      if (!binding.isSuccess) return binding
      const failed: string[] = []
      let firstError = ''
      for (const name of (p as { name: string[] }).name) {
        const chain = chains[name]
        if (!chain) continue // Legacy dormant registrations remain dormant.
        let response: DeviceResult
        try {
          response =
            name === 'EOS'
              ? api.registerEOSPubKey(chain.path)
              : api.address(chain.chain, chain.path, true, chain.network)
        } catch (error) {
          response = {
            isSuccess: false,
            result: error instanceof Error ? error.message : String(error)
          }
        }
        if (!response.isSuccess) {
          failed.push(name)
          if (!firstError) firstError = response.result
        }
      }
      return failed.length
        ? { isSuccess: false, result: firstError, failed }
        : { isSuccess: true, result: 'success' }
    }
  }
}
