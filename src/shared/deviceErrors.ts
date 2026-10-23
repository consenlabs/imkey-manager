// Exact known error identifiers only. Arbitrary connector output can contain secrets
// and must never become a diagnostic code, even when it resembles an identifier.
const knownErrors: Record<string, string> = {
  get_seid_error: 'GET_SEID_ERROR',
  device_not_connected: 'DEVICE_NOT_CONNECTED',
  device_not_found: 'DEVICE_NOT_FOUND',
  user_not_confirmed: 'USER_NOT_CONFIRMED',
  device_bind_check_failed: 'DEVICE_BIND_CHECK_FAILED',
  imkey_tsm_device_illegal: 'TSM_DEVICE_ILLEGAL',
  binding_code_error: 'BINDING_CODE_ERROR',
  imkey_bluetooth_channel_error: 'BLUETOOTH_CHANNEL_ERROR',
  imkey_bluetooth_timeout: 'BLUETOOTH_TIMEOUT',
  imkey_command_execute_fail: 'COMMAND_EXECUTE_FAILED'
}
const safeCodes = new Set([
  ...Object.values(knownErrors),
  'DEVICE_ERROR',
  'DEVICE_OPERATION_FAILED',
  'INVALID_RESPONSE',
  'SERVICE_UNAVAILABLE',
  'DEVICE_OPERATION_BUSY',
  'UPDATE_FAILED'
])
function knownCode(value: string): string {
  return Object.hasOwn(knownErrors, value) ? knownErrors[value] : 'DEVICE_OPERATION_FAILED'
}
export function failureCode(error: unknown): string {
  if (typeof error === 'string') return knownCode(error)
  if (!error || typeof error !== 'object') return 'DEVICE_OPERATION_FAILED'
  const failure = error as { code?: unknown; result?: unknown }
  if (typeof failure.code === 'string' && safeCodes.has(failure.code)) return failure.code
  return typeof failure.result === 'string' ? knownCode(failure.result) : 'DEVICE_OPERATION_FAILED'
}
