import type {
  DeviceMethod,
  DeviceParams,
  DeviceResult,
  DeviceValues,
  DeviceCallContext
} from '../shared/deviceContract'
import { failureCode } from '../shared/deviceErrors'
export async function callDevice<M extends DeviceMethod>(
  method: M,
  params?: DeviceParams[M],
  context?: DeviceCallContext
): Promise<DeviceResult<DeviceValues[M]>> {
  try {
    const response = (await window.imkey.device.call(method, params, context)) as DeviceResult<
      DeviceValues[M]
    >
    if (!response.isSuccess)
      return {
        ...response,
        result: response.result?.trim() || 'Device operation failed',
        method: response.method || method,
        code: failureCode(response),
        operationId: context?.operationId,
        stage: context?.stage || method
      }
    return response
  } catch (error) {
    return {
      isSuccess: false,
      result: error instanceof Error ? error.message : String(error),
      method,
      code: 'DEVICE_OPERATION_FAILED',
      operationId: context?.operationId,
      stage: context?.stage || method
    }
  }
}
