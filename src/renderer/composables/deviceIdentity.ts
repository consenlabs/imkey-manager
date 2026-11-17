import type { callDevice } from '../device'
import type { useDeviceStore } from '../store/device'
import type { DeviceResult } from '../../shared/deviceContract'
import { connectDeviceSession } from './deviceSession'
import { operationError } from './operationError'

export async function refreshDeviceIdentity(
  call: typeof callDevice,
  device: ReturnType<typeof useDeviceStore>,
  active: () => boolean,
  {
    hideCachedData = true,
    firmwareRecovery = false,
    requireBinding = !firmwareRecovery,
    preserveOnTransportError = false
  }: {
    hideCachedData?: boolean
    firmwareRecovery?: boolean
    requireBinding?: boolean
    preserveOnTransportError?: boolean
  } = {}
): Promise<DeviceResult<string>> {
  const sessionId = device.sessionId
  if (hideCachedData) device.prepareIdentityCheck()
  const session = { connectedSeid: device.connectedSeid, bindStatus: device.bindStatus }
  let result: DeviceResult<string>
  try {
    result = await connectDeviceSession(call, session, {
      requireBinding,
      firmwareRecovery
    })
  } catch (error) {
    result = { isSuccess: false, result: operationError(error) }
  }
  if (!active() || device.sessionId !== sessionId)
    return { isSuccess: false, result: 'Device operation cancelled', code: 'OPERATION_CANCELLED' }
  if (!result.isSuccess) {
    if (
      preserveOnTransportError &&
      result.result !== 'device_session_changed' &&
      result.result !== 'device_bind_check_failed'
    ) {
      // An upgrade must retain its retry screen when the same device is temporarily unavailable.
      device.identityReady = false
      device.identityChecking = false
      device.clearVerification()
    } else device.invalidateDeviceData()
    return result
  }
  device.connectedSeid = session.connectedSeid
  device.bindStatus = session.bindStatus
  device.identityChecking = false
  device.identityReady = true
  return result
}
