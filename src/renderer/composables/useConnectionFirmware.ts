import { callDevice as defaultCall } from '../device'
import { ref } from 'vue'
import type { DeviceOperation } from './useDeviceOperation'
import { useAppStore, useDeviceStore } from '../store'
import type { DeviceResult } from '../../shared/deviceContract'
import { firmwareOperationError, operationError } from './operationError'
import { isFirmwareDiagnosticStage } from '../../shared/firmwareDiagnostics'
import { reconcileUpdateCheckpoint } from './firmwareResumeState'
import {
  runFirmwareRecovery,
  loadFirmwareRecovery,
  validateFirmwareResume,
  firmwareRecoveryRequiresBinding,
  saveManualBindingCheckpoint,
  type FirmwareFailure,
  type FirmwareRecovery
} from './firmwareRecovery'

export function useConnectionFirmware(
  changeState: (status: number) => void,
  fail: (message: string, status: number, stage?: FirmwareFailure['stage']) => void,
  check: () => Promise<void>,
  operation?: DeviceOperation
) {
  const callDevice = operation?.call || defaultCall
  const app = useAppStore()
  const device = useDeviceStore()
  const active = () => operation?.active() ?? true
  let recovery: FirmwareRecovery | undefined
  let busy = false
  const recoveryBindingHint = ref<'new' | 'existing' | ''>('')
  const hasPendingRecovery = () => Boolean(recovery)
  async function loadPendingRecovery(seid: string): Promise<DeviceResult<boolean>> {
    recoveryBindingHint.value = ''
    const saved = await loadFirmwareRecovery(callDevice, seid)
    if (!active())
      return { isSuccess: false, result: 'Device operation cancelled', code: 'OPERATION_CANCELLED' }
    if (!saved.isSuccess) return saved
    // Keep a successfully completed in-memory step when its following checkpoint
    // write failed; a fresh process instead resumes the last durable checkpoint.
    if (!recovery || recovery.seid.toUpperCase() !== seid.toUpperCase())
      recovery = saved.result || undefined
    return { isSuccess: true, result: Boolean(recovery) }
  }
  function report(
    error: DeviceResult,
    stage: FirmwareFailure['stage'],
    diagnosticStage: string = stage
  ) {
    if (!active() || (!error.isSuccess && error.code === 'OPERATION_CANCELLED')) return
    operation?.failure?.(
      isFirmwareDiagnosticStage(diagnosticStage) ? diagnosticStage : stage,
      error
    )
    device.isCosUpdate = true
    const missingCode =
      !error.isSuccess &&
      (error.result === 'binding_code_file_missing' ||
        error.code === 'BINDING_CODE_FILE_UNREADABLE')
    fail(
      stage === 'update' ? firmwareOperationError(error) : operationError(error),
      missingCode ? 7 : stage === 'connect' ? 4 : 5,
      stage
    )
  }
  async function checkRecoveryBindingIdentity(
    attempt: FirmwareRecovery,
    current: () => boolean
  ): Promise<DeviceResult<string>> {
    const identity = await callDevice('getUpgradeSeid')
    if (!current())
      return { isSuccess: false, result: 'Device operation cancelled', code: 'OPERATION_CANCELLED' }
    if (!identity.isSuccess) return identity
    if (identity.result.toUpperCase() !== attempt.seid.toUpperCase())
      return { isSuccess: false, result: 'device_session_changed' }
    const binding = await callDevice('deviceBindCheck', app.userPath)
    if (!current())
      return { isSuccess: false, result: 'Device operation cancelled', code: 'OPERATION_CANCELLED' }
    if (!binding.isSuccess) return binding
    if (!['unbound', 'bound_other', 'bound_this'].includes(binding.result))
      return { isSuccess: false, result: 'device_bind_check_failed' }
    const confirmed = await callDevice('getUpgradeSeid')
    if (!current())
      return { isSuccess: false, result: 'Device operation cancelled', code: 'OPERATION_CANCELLED' }
    if (!confirmed.isSuccess) return confirmed
    if (confirmed.result.toUpperCase() !== attempt.seid.toUpperCase())
      return { isSuccess: false, result: 'device_session_changed' }
    return binding
  }
  async function promptRecoveryBinding(attempt: FirmwareRecovery, current: () => boolean) {
    const binding = await checkRecoveryBindingIdentity(attempt, current)
    if (!binding.isSuccess)
      return report(binding, binding.result === 'device_session_changed' ? 'connect' : 'bind')
    const saved = await saveManualBindingCheckpoint(attempt, callDevice)
    if (!current()) return
    if (!saved.isSuccess) return report(saved, 'store')
    if (binding.result === 'unbound') {
      const display = await callDevice('deviceBindDisplay')
      if (!current()) return
      if (!display.isSuccess) return report(display, 'bind')
      const identity = await callDevice('getUpgradeSeid')
      if (!current()) return
      if (!identity.isSuccess) return report(identity, 'connect')
      if (identity.result.toUpperCase() !== attempt.seid.toUpperCase())
        return report({ isSuccess: false, result: 'device_session_changed' }, 'connect')
    }
    attempt.bindCode = ''
    recoveryBindingHint.value = binding.result === 'unbound' ? 'new' : 'existing'
    changeState(7)
  }
  async function verifyRecoveryBinding(): Promise<DeviceResult<string>> {
    const attempt = recovery
    if (!attempt) return { isSuccess: false, result: 'firmware_recovery_not_ready' }
    return checkRecoveryBindingIdentity(attempt, () => active() && recovery === attempt)
  }
  function acceptRecoveryBinding(code: string): void {
    if (!recovery) return
    recovery.needsBinding = true
    recovery.bindCode = code
    recovery.phase = 'store'
    delete recovery.pendingAddresses
    recoveryBindingHint.value = ''
  }
  async function toCosUpdate(nativeIncomplete = false): Promise<void> {
    if (busy || !active()) return
    busy = true
    device.revokeHomeAccess()
    changeState(6)
    let stage: FirmwareFailure['stage'] = 'connect'
    let completed = false
    try {
      const identity = await callDevice('getUpgradeSeid')
      if (!active()) return
      if (!identity.isSuccess) return report(identity, 'connect')
      const seid = identity.result.toUpperCase()
      if (
        !seid ||
        (recovery && recovery.seid.toUpperCase() !== seid) ||
        (device.connectedSeid && device.connectedSeid.toUpperCase() !== seid)
      )
        return report({ isSuccess: false, result: 'device_session_changed' }, 'connect')
      device.connectedSeid = identity.result
      recovery ||= {
        seid,
        phase: 'update',
        bindCode: '',
        needsBinding: true,
        expectedCos: '',
        expectedBle: ''
      }
      const attempt = recovery
      const current = () => active() && recovery === attempt
      if (nativeIncomplete && attempt.phase !== 'update') {
        // Server-side native recovery remains authoritative when a native call
        // has not completed its application/BLE work.
        attempt.phase = 'update'
        attempt.expectedCos = ''
        attempt.expectedBle = ''
      }
      if (attempt.phase === 'update') {
        const reconciled = await reconcileUpdateCheckpoint(attempt, callDevice, current)
        if (reconciled.failure) return report(reconciled.failure.error, reconciled.failure.stage)
        if (!current()) return
      }
      if (attempt.phase !== 'update') {
        stage = 'check'
        const validation = await validateFirmwareResume(attempt, callDevice, current)
        if (validation) return report(validation.error, validation.stage)
        // A durable bind checkpoint contains no code and may represent a rejected
        // old code. Never retry that code automatically after a restart.
        if (attempt.phase === 'bind' && !attempt.bindCode)
          return await promptRecoveryBinding(attempt, current)
        // A completed rebind must still belong to this computer before storage or
        // address restoration resumes. Earlier phases explicitly allow unbound.
        if (firmwareRecoveryRequiresBinding(attempt.phase, attempt.needsBinding)) {
          const binding = await callDevice('deviceBindCheck', app.userPath)
          if (!current()) return
          if (!binding.isSuccess) return report(binding, 'bind')
          if (binding.result === 'unbound') {
            // Reset can remove the binding after the checkpoint advanced. Return
            // to binding on this same verified device and rebuild all addresses.
            attempt.needsBinding = true
            attempt.phase = 'load-code'
            attempt.bindCode = ''
            delete attempt.pendingAddresses
          } else if (binding.result === 'bound_other') {
            attempt.phase = 'bind'
            attempt.bindCode = ''
            return await promptRecoveryBinding(attempt, current)
          } else if (binding.result !== 'bound_this')
            return report({ isSuccess: false, result: 'device_bind_check_failed' }, 'bind')
        }
      }
      const failure = await runFirmwareRecovery(attempt, {
        call: callDevice,
        current,
        userPath: app.userPath,
        onPhase(phase) {
          stage =
            phase === 'capture-versions'
              ? 'check'
              : phase === 'load-code' || phase === 'store'
                ? 'store'
                : phase === 'apps' || phase === 'restore'
                  ? 'restore'
                  : phase === 'verify' || phase === 'complete'
                    ? 'check'
                    : phase === 'bind'
                      ? 'bind'
                      : 'update'
        }
      })
      if (failure) {
        if (
          failure.stage === 'store' &&
          attempt.phase === 'load-code' &&
          !failure.error.isSuccess &&
          (failure.error.result === 'binding_code_file_missing' ||
            failure.error.code === 'BINDING_CODE_FILE_UNREADABLE')
        ) {
          operation?.failure?.(
            isFirmwareDiagnosticStage(attempt.phase) ? attempt.phase : 'store',
            failure.error
          )
          return await promptRecoveryBinding(attempt, current)
        }
        if (
          failure.stage === 'bind' &&
          attempt.phase === 'bind' &&
          typeof failure.error.result === 'string' &&
          ['imkey_authcode_error', 'binding_code_error', 'error'].includes(failure.error.result)
        ) {
          attempt.bindCode = ''
          return await promptRecoveryBinding(attempt, current)
        }
        return report(failure.error, failure.stage, attempt.phase)
      }
      if (!current()) return
      recovery = undefined
      device.isCosUpdate = false
      completed = true
    } catch (error) {
      report({ isSuccess: false, result: operationError(error) }, stage)
    } finally {
      busy = false
    }
    if (completed && active()) await check()
  }
  return {
    hasPendingRecovery,
    loadPendingRecovery,
    toCosUpdate,
    recoveryBindingHint,
    verifyRecoveryBinding,
    acceptRecoveryBinding
  }
}
