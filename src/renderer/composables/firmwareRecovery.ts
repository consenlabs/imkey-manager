import type { callDevice } from '../device'
import {
  isFirmwareRecoveryCheckpoint,
  type DeviceResult,
  type FirmwareRecoveryCheckpoint,
  type WalletChain
} from '../../shared/deviceContract'

export type FirmwarePhase =
  | 'update'
  | 'capture-versions'
  | 'load-code'
  | 'bind'
  | 'store'
  | 'apps'
  | 'restore'
  | 'verify'
  | 'complete'
export interface FirmwareRecovery {
  seid: string
  phase: FirmwarePhase
  bindCode: string
  needsBinding: boolean
  expectedCos: string
  expectedBle: string
  captureVersionsAfterUpdate?: boolean
  pendingAddresses?: WalletChain[]
}
export interface FirmwareFailure {
  stage: 'connect' | 'check' | 'update' | 'bind' | 'store' | 'restore'
  error: DeviceResult
}
const cancelled = (): FirmwareFailure => ({
  stage: 'connect',
  error: { isSuccess: false, result: 'Device operation cancelled', code: 'OPERATION_CANCELLED' }
})
function unsuccessful(result: DeviceResult): DeviceResult {
  return result.isSuccess
    ? { isSuccess: false, result: String(result.result || 'device_operation_failed') }
    : result
}

export function restoreFirmwareRecovery(checkpoint: FirmwareRecoveryCheckpoint): FirmwareRecovery {
  return {
    ...checkpoint,
    bindCode: '',
    captureVersionsAfterUpdate: true,
    pendingAddresses: checkpoint.pendingAddresses ? [...checkpoint.pendingAddresses] : undefined
  }
}

export async function loadFirmwareRecovery(
  call: typeof callDevice,
  seid: string
): Promise<DeviceResult<FirmwareRecovery | null>> {
  const saved = await call('getFirmwareRecovery')
  if (!saved.isSuccess) return saved
  if (saved.result === null) return { isSuccess: true, result: null }
  if (!isFirmwareRecoveryCheckpoint(saved.result))
    return { isSuccess: false, result: 'firmware_recovery_unreadable' }
  if (saved.result.seid.toUpperCase() !== seid.toUpperCase())
    return { isSuccess: false, result: 'device_session_changed' }
  return { isSuccess: true, result: restoreFirmwareRecovery(saved.result) }
}

async function saveRecovery(recovery: FirmwareRecovery, call: typeof callDevice) {
  if (recovery.phase === 'complete') return call('clearFirmwareRecovery', { seid: recovery.seid })
  // Only explicit, non-secret fields cross IPC. The binding code stays in memory.
  return call('saveFirmwareRecovery', {
    version: 1,
    seid: recovery.seid,
    phase: recovery.phase,
    needsBinding: recovery.needsBinding,
    expectedCos: recovery.expectedCos,
    expectedBle: recovery.expectedBle,
    ...(recovery.pendingAddresses ? { pendingAddresses: [...recovery.pendingAddresses] } : {})
  })
}

async function readRecoveryCode(
  recovery: FirmwareRecovery,
  call: typeof callDevice,
  current: () => boolean,
  requireBound: boolean
): Promise<FirmwareFailure | undefined> {
  const before = await call('getUpgradeSeid')
  if (!current()) return cancelled()
  if (!before.isSuccess) return { stage: 'connect', error: before }
  if (before.result.toUpperCase() !== recovery.seid.toUpperCase())
    return { stage: 'connect', error: { isSuccess: false, result: 'device_session_changed' } }
  const binding = await call('deviceBindCheck')
  if (!current()) return cancelled()
  if (!binding.isSuccess) return { stage: 'bind', error: binding }
  if (
    !['bound_this', 'bound_other', 'unbound'].includes(binding.result) ||
    (requireBound && binding.result !== 'bound_this')
  )
    return { stage: 'bind', error: { isSuccess: false, result: 'device_bind_check_failed' } }
  const code = await call('exportBindCode')
  if (!current()) return cancelled()
  if (!code.isSuccess) return { stage: 'store', error: code }
  const identity = await call('getUpgradeSeid')
  if (!current()) return cancelled()
  if (!identity.isSuccess) return { stage: 'connect', error: identity }
  if (identity.result.toUpperCase() !== recovery.seid.toUpperCase())
    return { stage: 'connect', error: { isSuccess: false, result: 'device_session_changed' } }
  recovery.bindCode = code.result
}

// Both the normal upgrade and bootloader recovery use the same post-update stages.
// A stage advances only after its device response succeeds. Codes stay in memory.
export async function runFirmwareRecovery(
  recovery: FirmwareRecovery,
  {
    call,
    current,
    userPath,
    onPhase
  }: {
    call: typeof callDevice
    current: () => boolean
    userPath: string
    onPhase: (phase: FirmwarePhase) => void
  }
): Promise<FirmwareFailure | undefined> {
  while (current()) {
    const phase = recovery.phase
    onPhase(phase)
    // Persist before executing each stage. Closing the window or losing the worker
    // cannot erase a pending native call or falsely advance it to the next stage.
    const persisted = await saveRecovery(recovery, call)
    if (!current()) return cancelled()
    if (!persisted.isSuccess) return { stage: 'store', error: persisted }
    if (phase === 'complete') return
    if (phase === 'update') {
      const response = await call('cosUpdate')
      if (!current()) return cancelled()
      if (!response.isSuccess || response.result !== 'success')
        return { stage: 'update', error: unsuccessful(response) }
      recovery.phase = recovery.captureVersionsAfterUpdate
        ? 'capture-versions'
        : recovery.needsBinding
          ? recovery.bindCode
            ? 'bind'
            : 'load-code'
          : 'verify'
    } else if (phase === 'capture-versions') {
      const versions: string[] = []
      for (const [method, expected] of [
        ['getFirmwareVersion', recovery.expectedCos],
        ['getBleVersion', recovery.expectedBle]
      ] as const) {
        const response = await call(method)
        if (!current()) return cancelled()
        if (!response.isSuccess) return { stage: 'check', error: response }
        if (!response.result || (expected && response.result !== expected))
          return {
            stage: 'check',
            error: { isSuccess: false, result: 'firmware_recovery_version_mismatch' }
          }
        versions.push(response.result)
      }
      const identity = await call('getUpgradeSeid')
      if (!current()) return cancelled()
      if (!identity.isSuccess) return { stage: 'connect', error: identity }
      if (identity.result.toUpperCase() !== recovery.seid.toUpperCase())
        return { stage: 'connect', error: { isSuccess: false, result: 'device_session_changed' } }
      ;[recovery.expectedCos, recovery.expectedBle] = versions
      recovery.phase = recovery.needsBinding ? (recovery.bindCode ? 'bind' : 'load-code') : 'verify'
    } else if (phase === 'load-code') {
      const failure = await readRecoveryCode(recovery, call, current, false)
      if (failure) return failure
      recovery.phase = 'bind'
    } else if (phase === 'bind') {
      if (!recovery.bindCode) {
        recovery.phase = 'load-code'
        continue
      }
      const response = await call('deviceBindAcquire', recovery.bindCode)
      if (!current()) return cancelled()
      if (!response.isSuccess || response.result !== 'success')
        return { stage: 'bind', error: unsuccessful(response) }
      recovery.phase = 'store'
    } else if (phase === 'store') {
      // A successful acquire response is insufficient: observe bound_this before
      // committing the code or restoring any addresses, including after restart.
      const binding = await call('deviceBindCheck')
      if (!current()) return cancelled()
      if (!binding.isSuccess) return { stage: 'bind', error: binding }
      if (binding.result !== 'bound_this')
        return { stage: 'bind', error: { isSuccess: false, result: 'device_bind_check_failed' } }
      if (!recovery.bindCode) {
        const failure = await readRecoveryCode(recovery, call, current, true)
        if (failure) return failure
      }
      const response = await call('importBindCode', recovery.bindCode)
      if (!current()) return cancelled()
      if (!response.isSuccess) return { stage: 'store', error: response }
      recovery.phase = 'apps'
    } else if (phase === 'apps') {
      const response = await call('getInstalledApplets')
      if (!current()) return cancelled()
      if (!response.isSuccess) return { stage: 'restore', error: response }
      const installed = response.result.list.map(item => item.name) as WalletChain[]
      recovery.pendingAddresses = recovery.pendingAddresses
        ? recovery.pendingAddresses.filter(name => installed.includes(name))
        : [...new Set(installed)]
      recovery.phase = 'restore'
    } else if (phase === 'restore') {
      const response = await call('writeWalletAddress', {
        name: [...(recovery.pendingAddresses || [])],
        filePath: userPath
      })
      if (!current()) return cancelled()
      if (!response.isSuccess) {
        const failed = response.failed?.filter(name =>
          recovery.pendingAddresses?.includes(name as WalletChain)
        ) as WalletChain[] | undefined
        if (failed?.length) recovery.pendingAddresses = [...new Set(failed)]
        return { stage: 'restore', error: response }
      }
      recovery.phase = 'verify'
    } else {
      const binding = await call('deviceBindCheck')
      if (!current()) return cancelled()
      if (!binding.isSuccess) return { stage: 'bind', error: binding }
      if (binding.result !== 'bound_this')
        return { stage: 'bind', error: { isSuccess: false, result: 'device_bind_check_failed' } }
      const validation = await validateFirmwareResume(recovery, call, current)
      if (validation) return validation
      const status = await call('cosCheckUpdate')
      if (!current()) return cancelled()
      if (!status.isSuccess) return { stage: 'check', error: status }
      if (status.result.isUpdateSuccess !== true)
        return {
          stage: 'check',
          error: { isSuccess: false, result: 'firmware_recovery_not_ready' }
        }
      recovery.phase = 'complete'
    }
  }
  return cancelled()
}

// A retry may skip completed writes only after observing the same firmware again.
// Identity and binding are checked by the caller before entering this function.
export async function validateFirmwareResume(
  recovery: FirmwareRecovery,
  call: typeof callDevice,
  current: () => boolean
): Promise<FirmwareFailure | undefined> {
  if (recovery.phase === 'update') return
  const bootloader = await call('isBLStatus')
  if (!current()) return cancelled()
  if (!bootloader.isSuccess) return { stage: 'check', error: bootloader }
  if (bootloader.result)
    return { stage: 'check', error: { isSuccess: false, result: 'firmware_recovery_not_ready' } }
  for (const [method, expected] of [
    ['getFirmwareVersion', recovery.expectedCos],
    ['getBleVersion', recovery.expectedBle]
  ] as const) {
    if (!expected) continue
    const response = await call(method)
    if (!current()) return cancelled()
    if (!response.isSuccess) return { stage: 'check', error: response }
    if (response.result !== expected)
      return {
        stage: 'check',
        error: { isSuccess: false, result: 'firmware_recovery_version_mismatch' }
      }
  }
  const identity = await call('getUpgradeSeid')
  if (!current()) return cancelled()
  if (!identity.isSuccess) return { stage: 'connect', error: identity }
  if (identity.result.toUpperCase() !== recovery.seid.toUpperCase())
    return { stage: 'connect', error: { isSuccess: false, result: 'device_session_changed' } }
  if (recovery.phase === 'restore') recovery.phase = 'apps'
}
