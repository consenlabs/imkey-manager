import type { DeviceResult } from '../../shared/deviceContract'
import type { callDevice } from '../device'
import constants from '../../common/constants'

interface Session {
  connectedSeid: string
  bindStatus: string
}
export function isSessionRecoveryError(error: unknown): boolean {
  const message = typeof error === 'string' ? error : (error as { result?: unknown })?.result
  return (
    typeof message === 'string' &&
    ([
      'device_session_changed',
      'device_operation_timeout',
      'device_recovery_pending',
      'device_bind_check_failed'
    ].includes(message) ||
      /^Device service exited \(/.test(message))
  )
}

// Called only as part of an explicit user operation, never as a connection poll.
export async function connectDeviceSession(
  call: typeof callDevice,
  device: Session,
  {
    requireBinding = true,
    firmwareRecovery = false
  }: { requireBinding?: boolean; firmwareRecovery?: boolean } = {}
): Promise<DeviceResult<string>> {
  if (firmwareRecovery && !device.connectedSeid)
    return { isSuccess: false, result: 'device_session_changed' }
  const connected = await call('connectDevice')
  if (!connected.isSuccess) return connected
  if (connected.result !== constants.RESULT_STATUS_SUCCESS)
    return { isSuccess: false, result: connected.result || 'device_not_connected' }
  const identity = await call(firmwareRecovery ? 'getUpgradeSeid' : 'getSeid')
  if (!identity.isSuccess) return identity
  if (!identity.result) return { isSuccess: false, result: 'get_seid_error' }
  if (device.connectedSeid && device.connectedSeid.toUpperCase() !== identity.result.toUpperCase())
    return { isSuccess: false, result: 'device_session_changed' }
  if (requireBinding) {
    const binding = await call('deviceBindCheck')
    if (!binding.isSuccess) return binding
    if (binding.result !== constants.BIND_STATUS_STRING_BOUND_THIS)
      return { isSuccess: false, result: 'device_session_changed' }
    device.bindStatus = binding.result
  }
  device.connectedSeid = identity.result
  return { isSuccess: true, result: constants.RESULT_STATUS_SUCCESS }
}
