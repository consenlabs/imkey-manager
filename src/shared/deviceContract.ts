export const deviceMethods = [
  'initImKeyCore',
  'connectDevice',
  'getSeid',
  'getSn',
  'getRamSize',
  'getFirmwareVersion',
  'getBleVersion',
  'getSdkInfo',
  'activeDevice',
  'cosUpdate',
  'cosCheckUpdate',
  'isBLStatus',
  'checkDevice',
  'deviceSnCheck',
  'checkUpdate',
  'getInstalledApplets',
  'downloadApplet',
  'updateApplet',
  'deleteApplet',
  'deviceBindCheck',
  'deviceBindAcquire',
  'deviceBindDisplay',
  'getBTCXpub',
  'getUserPath',
  'importBindCode',
  'exportBindCode',
  'isExistBindCodeFile',
  'writeWalletAddress'
] as const
export type DeviceMethod = (typeof deviceMethods)[number]
// Device data only. Labels, buttons and loading states belong to the renderer.
export interface Applet {
  name: string
  installedVersion: string | null
  latestVersion: string
  icon: string
}
export interface AppletList {
  status: string
  total: number
  list: Applet[]
}
export interface InstalledAppletList {
  status: string
  total: number
  list: { name: string }[]
}
export interface FirmwareUpdate {
  latestCosVersion: string
  latestBleVersion: string
  isLatest: boolean
  isUpdateSuccess: boolean
  updateType: string
  description: string
}
export interface DeviceSnCheck {
  snCheckResult: boolean
  isActivate: boolean
  activateTime: string
}
export type DeviceValues = {
  [M in DeviceMethod]: M extends 'checkUpdate'
    ? AppletList
    : M extends 'deviceSnCheck'
      ? DeviceSnCheck
      : M extends 'getInstalledApplets'
        ? InstalledAppletList
        : M extends 'cosCheckUpdate'
          ? FirmwareUpdate
          : M extends 'downloadApplet' | 'updateApplet'
            ? WalletChain[]
            : M extends 'isBLStatus' | 'isExistBindCodeFile'
              ? boolean
              : M extends 'getRamSize'
                ? number
                : M extends 'importBindCode'
                  ? undefined
                  : string
}
export type DeviceResult<T = unknown> =
  | { isSuccess: true; result: T }
  | {
      isSuccess: false
      result: string
      code?: string
      method?: DeviceMethod
      stage?: string
      requestId?: number
      operationId?: string
      failed?: string[]
    }
// Exact names in the connector's address_register_list; registration support is separate.
export const walletChains = [
  'Bitcoin',
  'Ethereum',
  'EOS',
  'Cosmos',
  'Filecoin',
  'Polkadot',
  'Kusama',
  'TRON',
  'Tezos',
  'Nervos',
  'Bitcoin Cash',
  'Litecoin',
  'IMK'
] as const
export type WalletChain = (typeof walletChains)[number]
type StringMethod =
  'downloadApplet' | 'updateApplet' | 'deleteApplet' | 'deviceBindAcquire' | 'importBindCode'
type BindingMethod = 'deviceBindCheck' | 'getBTCXpub'
export type DeviceParams = {
  [M in DeviceMethod]: M extends StringMethod
    ? string
    : M extends BindingMethod
      ? string | undefined
      : M extends 'writeWalletAddress'
        ? { filePath: string; name: WalletChain[] }
        : undefined
}
export interface DeviceCallContext {
  operationId: string
  stage?: DeviceMethod
}
export interface DeviceRequest {
  id: number
  method: DeviceMethod
  context?: DeviceCallContext
  params?: DeviceParams[DeviceMethod]
}
export interface DeviceResponse {
  id: number
  result: DeviceResult
}
export interface ConnectorLoadError {
  message: string
  libraryPath: string
}
export interface ServiceConfiguration {
  type: 'init'
  userDataPath: string
  libraryPath: string
  platform: NodeJS.Platform
  isPackaged: boolean
  mockPath?: string
}
const allowed = new Set<string>(deviceMethods)
export function isDeviceMethod(value: unknown): value is DeviceMethod {
  return typeof value === 'string' && allowed.has(value)
}
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function keys(value: Record<string, unknown>, expected: string[]): boolean {
  return Object.keys(value).every(key => expected.includes(key))
}
export function isValidDeviceParams(method: DeviceMethod, params: unknown): boolean {
  switch (method) {
    case 'downloadApplet':
    case 'updateApplet':
    case 'deleteApplet':
    case 'deviceBindAcquire':
    case 'importBindCode':
      return typeof params === 'string' && params.length > 0
    case 'deviceBindCheck':
    case 'getBTCXpub':
      return params === undefined || typeof params === 'string'
    case 'writeWalletAddress':
      return (
        object(params) &&
        keys(params, ['filePath', 'name']) &&
        typeof params.filePath === 'string' &&
        Array.isArray(params.name) &&
        params.name.every(
          chain => typeof chain === 'string' && (walletChains as readonly string[]).includes(chain)
        )
      )
    default:
      return params === undefined
  }
}
