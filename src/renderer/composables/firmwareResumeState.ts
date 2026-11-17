import type { callDevice } from '../device'
import type { FirmwareFailure, FirmwareRecovery } from './firmwareRecovery'
import { recordFirmwareConfirmation } from './useFirmwareConfirmation'

// An update checkpoint is written before the native call. When the device is
// out of bootloader and the server has no pending transaction, never replay
// that call: resume the post-update checks without claiming it was executed.
export async function reconcileUpdateCheckpoint(
  recovery: FirmwareRecovery,
  call: typeof callDevice,
  current: () => boolean
): Promise<{ promoted: boolean; failure?: FirmwareFailure }> {
  if (recovery.phase !== 'update') return { promoted: false }
  const cancelled = (): FirmwareFailure => ({
    stage: 'connect',
    error: { isSuccess: false, result: 'Device operation cancelled', code: 'OPERATION_CANCELLED' }
  })
  const bootloader = await call('isBLStatus')
  if (!current()) return { promoted: false, failure: cancelled() }
  if (!bootloader.isSuccess)
    return { promoted: false, failure: { stage: 'check', error: bootloader } }
  if (typeof bootloader.result !== 'boolean')
    return {
      promoted: false,
      failure: { stage: 'check', error: { isSuccess: false, result: 'invalid_firmware_response' } }
    }
  if (bootloader.result) return { promoted: false }
  const status = await call('cosCheckUpdate')
  if (!current()) return { promoted: false, failure: cancelled() }
  if (!status.isSuccess) return { promoted: false, failure: { stage: 'check', error: status } }
  if (!status.result || typeof status.result.isUpdateSuccess !== 'boolean')
    return {
      promoted: false,
      failure: { stage: 'check', error: { isSuccess: false, result: 'invalid_firmware_response' } }
    }
  if (!status.result.isUpdateSuccess) return { promoted: false }
  const identity = await call('getUpgradeSeid')
  if (!current()) return { promoted: false, failure: cancelled() }
  if (!identity.isSuccess)
    return { promoted: false, failure: { stage: 'connect', error: identity } }
  if (!identity.result || identity.result.toUpperCase() !== recovery.seid.toUpperCase())
    return {
      promoted: false,
      failure: { stage: 'connect', error: { isSuccess: false, result: 'device_session_changed' } }
    }
  // Keep an independent reminder before overwriting the ambiguous update
  // checkpoint. It is never evidence that firmware was actually installed.
  const recorded = recordFirmwareConfirmation(recovery.seid)
  if (!recorded.isSuccess) return { promoted: false, failure: { stage: 'store', error: recorded } }
  recovery.phase = 'capture-versions'
  // Without knowing whether the native call ran, even a BLE-only plan cannot
  // rule out same-version COS writes or app reinstallation. Rebuild addresses.
  recovery.needsBinding = true
  recovery.expectedCos = ''
  recovery.expectedBle = ''
  delete recovery.pendingAddresses
  return { promoted: true }
}
