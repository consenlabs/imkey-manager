import type { FirmwareDiagnosticCode, FirmwareDiagnosticStage } from './firmwareDiagnostics'

export const deviceMethods = [
  'initImKeyCore',
  'connectDevice',
  'getSeid',
  'getUpgradeSeid',
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
  'getFirmwareRecovery',
  'saveFirmwareRecovery',
  'clearFirmwareRecovery',
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
export const firmwareRecoveryPhases = [
  'update',
  'capture-versions',
  'load-code',
  'bind',
  'store',
  'apps',
  'restore',
  'verify'
] as const
export interface FirmwareRecoveryCheckpoint {
  version: 1
  seid: string
  phase: (typeof firmwareRecoveryPhases)[number]
  needsBinding: boolean
  // Actual installed versions confirmed after native completion. Early phases
  // have no baseline; legacy v1 files may still contain advertised targets there.
  expectedCos: string
  expectedBle: string
  // Optional for older v1 records. Actual COS observed before the native update.
  previousCos?: string
  pendingAddresses?: WalletChain[]
}
export type FirmwareRecoveryMethod =
  'getFirmwareRecovery' | 'saveFirmwareRecovery' | 'clearFirmwareRecovery'
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
                : M extends 'getFirmwareRecovery'
                  ? FirmwareRecoveryCheckpoint | null
                  : M extends 'importBindCode' | 'saveFirmwareRecovery' | 'clearFirmwareRecovery'
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
        : M extends 'saveFirmwareRecovery'
          ? FirmwareRecoveryCheckpoint
          : M extends 'clearFirmwareRecovery'
            ? { seid: string }
            : undefined
}
export interface DeviceCallContext {
  operationId: string
  stage?: DeviceMethod
}
export const deviceOperationActions = ['action', 'initialize', 'firmware-upgrade'] as const
export type DeviceOperationAction = (typeof deviceOperationActions)[number]
export const deviceOperationPhases = [
  'enqueued',
  'started',
  'feedback',
  'finished',
  'failed'
] as const
interface DeviceOperationTraceIdentity {
  operationId: string
  action: DeviceOperationAction
}
export type DeviceOperationTrace = DeviceOperationTraceIdentity &
  (
    | {
        phase: Exclude<(typeof deviceOperationPhases)[number], 'failed'>
        queueMs?: number
        durationMs?: number
        stage?: never
        code?: never
      }
    | {
        phase: 'failed'
        stage: FirmwareDiagnosticStage
        code: FirmwareDiagnosticCode
        queueMs?: never
        durationMs?: never
      }
  )
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
export function isValidFirmwareRecoverySeid(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(value)
}
export function isFirmwareRecoveryCheckpoint(value: unknown): value is FirmwareRecoveryCheckpoint {
  if (!object(value)) return false
  return (
    keys(value, [
      'version',
      'seid',
      'phase',
      'needsBinding',
      'expectedCos',
      'expectedBle',
      'previousCos',
      'pendingAddresses'
    ]) &&
    value.version === 1 &&
    isValidFirmwareRecoverySeid(value.seid) &&
    (firmwareRecoveryPhases as readonly unknown[]).includes(value.phase) &&
    typeof value.needsBinding === 'boolean' &&
    [value.expectedCos, value.expectedBle].every(
      version => typeof version === 'string' && /^[a-zA-Z0-9._-]{0,64}$/.test(version)
    ) &&
    (value.previousCos === undefined ||
      (typeof value.previousCos === 'string' &&
        /^[a-zA-Z0-9._-]{1,64}$/.test(value.previousCos))) &&
    (value.pendingAddresses === undefined ||
      (Array.isArray(value.pendingAddresses) &&
        value.pendingAddresses.length <= walletChains.length &&
        new Set(value.pendingAddresses).size === value.pendingAddresses.length &&
        value.pendingAddresses.every(chain =>
          (walletChains as readonly unknown[]).includes(chain)
        )))
  )
}
export function isValidDeviceParams(method: DeviceMethod, params: unknown): boolean {
  switch (method) {
    case 'saveFirmwareRecovery':
      return isFirmwareRecoveryCheckpoint(params)
    case 'clearFirmwareRecovery':
      return object(params) && keys(params, ['seid']) && isValidFirmwareRecoverySeid(params.seid)
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
