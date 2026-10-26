import type { callDevice } from '../device'
import type { useDeviceStore } from '../store/device'
import type { DeviceResult } from '../../shared/deviceContract'
import { connectDeviceSession } from './deviceSession'
import { operationError } from './operationError'

export async function refreshDeviceIdentity(
  call: typeof callDevice,
  device: ReturnType<typeof useDeviceStore>,
  active: () => boolean
): Promise<DeviceResult<string>> {
  const sessionId = device.sessionId
  device.prepareIdentityCheck()
  const session = { connectedSeid: device.connectedSeid, bindStatus: device.bindStatus }
  let result: DeviceResult<string>
  try {
    result = await connectDeviceSession(call, session)
  } catch (error) {
    result = { isSuccess: false, result: operationError(error) }
  }
  if (!active() || device.sessionId !== sessionId)
    return { isSuccess: false, result: 'Device operation cancelled', code: 'OPERATION_CANCELLED' }
  if (!result.isSuccess) {
    device.invalidateDeviceData()
    return result
  }
  device.connectedSeid = session.connectedSeid
  device.bindStatus = session.bindStatus
  device.identityChecking = false
  device.identityReady = true
  return result
}
