import { callDevice as defaultCall } from '../device'
import type { DeviceOperation } from './useDeviceOperation'
import { useAppStore, useDeviceStore } from '../store'
import type { DeviceResult } from '../../shared/deviceContract'
import { operationError } from './operationError'
import {
  runFirmwareRecovery,
  loadFirmwareRecovery,
  validateFirmwareResume,
  firmwareRecoveryRequiresBinding,
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
  const hasPendingRecovery = () => Boolean(recovery)
  async function loadPendingRecovery(seid: string): Promise<DeviceResult<boolean>> {
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
  function report(error: DeviceResult, stage: FirmwareFailure['stage']) {
    if (!active() || (!error.isSuccess && error.code === 'OPERATION_CANCELLED')) return
    device.isCosUpdate = true
    const missingCode =
      !error.isSuccess &&
      (error.result === 'binding_code_file_missing' ||
        error.code === 'BINDING_CODE_FILE_UNREADABLE')
    fail(operationError(error), missingCode ? 7 : stage === 'connect' ? 4 : 5, stage)
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
      if (attempt.phase !== 'update') {
        stage = 'check'
        const validation = await validateFirmwareResume(attempt, callDevice, current)
        if (validation) return report(validation.error, validation.stage)
        // A completed rebind must still belong to this computer before storage or
        // address restoration resumes. Earlier phases explicitly allow unbound.
        if (firmwareRecoveryRequiresBinding(attempt.phase)) {
          const binding = await callDevice('deviceBindCheck', app.userPath)
          if (!current()) return
          if (!binding.isSuccess) return report(binding, 'bind')
          if (binding.result !== 'bound_this')
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
      if (failure) return report(failure.error, failure.stage)
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
  return { hasPendingRecovery, loadPendingRecovery, toCosUpdate }
}
