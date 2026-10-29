// Business diagnostics must never carry connector output or device data, even
// when that data looks like an error identifier. Both boundaries use these lists.
export const firmwareDiagnosticStages = [
  'connect',
  'check',
  'update',
  'capture-versions',
  'load-code',
  'bind',
  'store',
  'apps',
  'restore',
  'verify',
  'wallet'
] as const
export type FirmwareDiagnosticStage = (typeof firmwareDiagnosticStages)[number]

export const firmwareDiagnosticCodes = [
  'DEVICE_OPERATION_FAILED',
  'DEVICE_SESSION_CHANGED',
  'DEVICE_BIND_CHECK_FAILED',
  'FIRMWARE_RECOVERY_VERSION_MISMATCH',
  'FIRMWARE_RECOVERY_NOT_READY',
  'INVALID_WALLET_RESPONSE',
  'INVALID_FIRMWARE_RESPONSE',
  'FIRMWARE_RECOVERY_UNREADABLE',
  'FIRMWARE_RECOVERY_WRITE_FAILED',
  'FIRMWARE_RECOVERY_INVALID',
  'FIRMWARE_RECOVERY_DEVICE_UNAVAILABLE',
  'FIRMWARE_RECOVERY_DEVICE_MISMATCH',
  'FIRMWARE_RECOVERY_UNAVAILABLE',
  'BINDING_CODE_FILE_UNREADABLE',
  'BINDING_CODE_FILE_MISSING',
  'BINDING_DEVICE_UNAVAILABLE',
  'BINDING_CODE_ERROR',
  'GET_SEID_ERROR',
  'GET_FIRMWARE_VERSION_ERROR',
  'GET_BLE_VERSION_ERROR',
  'DEVICE_NOT_CONNECTED',
  'DEVICE_NOT_FOUND',
  'DEVICE_OPERATION_TIMEOUT',
  'DEVICE_OPERATION_BUSY',
  'DEVICE_RECOVERY_PENDING',
  'INVALID_RESPONSE',
  'SERVICE_UNAVAILABLE',
  'WALLET_NOT_CREATED'
] as const
export type FirmwareDiagnosticCode = (typeof firmwareDiagnosticCodes)[number]

export function isFirmwareDiagnosticStage(value: unknown): value is FirmwareDiagnosticStage {
  return (firmwareDiagnosticStages as readonly unknown[]).includes(value)
}
export function isFirmwareDiagnosticCode(value: unknown): value is FirmwareDiagnosticCode {
  return (firmwareDiagnosticCodes as readonly unknown[]).includes(value)
}

const knownResults: Readonly<Record<string, FirmwareDiagnosticCode>> = {
  device_session_changed: 'DEVICE_SESSION_CHANGED',
  device_bind_check_failed: 'DEVICE_BIND_CHECK_FAILED',
  firmware_recovery_version_mismatch: 'FIRMWARE_RECOVERY_VERSION_MISMATCH',
  firmware_recovery_not_ready: 'FIRMWARE_RECOVERY_NOT_READY',
  invalid_wallet_response: 'INVALID_WALLET_RESPONSE',
  invalid_firmware_response: 'INVALID_FIRMWARE_RESPONSE',
  firmware_recovery_unreadable: 'FIRMWARE_RECOVERY_UNREADABLE',
  firmware_recovery_write_failed: 'FIRMWARE_RECOVERY_WRITE_FAILED',
  firmware_recovery_invalid: 'FIRMWARE_RECOVERY_INVALID',
  firmware_recovery_device_unavailable: 'FIRMWARE_RECOVERY_DEVICE_UNAVAILABLE',
  firmware_recovery_device_mismatch: 'FIRMWARE_RECOVERY_DEVICE_MISMATCH',
  firmware_recovery_unavailable: 'FIRMWARE_RECOVERY_UNAVAILABLE',
  binding_code_file_unreadable: 'BINDING_CODE_FILE_UNREADABLE',
  binding_code_file_missing: 'BINDING_CODE_FILE_MISSING',
  binding_device_unavailable: 'BINDING_DEVICE_UNAVAILABLE',
  binding_code_error: 'BINDING_CODE_ERROR',
  imkey_authcode_error: 'BINDING_CODE_ERROR',
  get_seid_error: 'GET_SEID_ERROR',
  get_firmware_version_error: 'GET_FIRMWARE_VERSION_ERROR',
  get_ble_version_error: 'GET_BLE_VERSION_ERROR',
  device_not_connected: 'DEVICE_NOT_CONNECTED',
  device_not_found: 'DEVICE_NOT_FOUND',
  device_operation_timeout: 'DEVICE_OPERATION_TIMEOUT',
  device_recovery_pending: 'DEVICE_RECOVERY_PENDING',
  imkey_wallet_not_created: 'WALLET_NOT_CREATED'
}

function knownCode(value: unknown): FirmwareDiagnosticCode | undefined {
  if (isFirmwareDiagnosticCode(value)) return value
  return typeof value === 'string' && Object.hasOwn(knownResults, value)
    ? knownResults[value]
    : undefined
}

export function firmwareFailureCode(error: unknown): FirmwareDiagnosticCode {
  try {
    if (typeof error === 'string') return knownCode(error) || 'DEVICE_OPERATION_FAILED'
    if (!error || typeof error !== 'object') return 'DEVICE_OPERATION_FAILED'
    const failure = error as { result?: unknown; code?: unknown; message?: unknown }
    // A service's generic code must not hide a recognized business failure.
    return (
      knownCode(failure.result) ||
      knownCode(failure.code) ||
      (error instanceof Error ? knownCode(failure.message) : undefined) ||
      'DEVICE_OPERATION_FAILED'
    )
  } catch {
    // Diagnostics must remain harmless even for malformed objects with getters.
    return 'DEVICE_OPERATION_FAILED'
  }
}
