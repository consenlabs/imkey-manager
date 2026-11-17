import type { DeviceMethod, DeviceResult } from '../shared/deviceContract'
import type { Handler } from './handlers'

// Each utility process has fresh native globals. A renderer may reconnect to a
// replacement process without sending its original initialization request again.
export function initializedHandlers(
  handlers: Record<DeviceMethod, Handler>
): Record<DeviceMethod, Handler> {
  let initialized: DeviceResult | undefined
  return Object.fromEntries(
    Object.entries(handlers).map(([method, handler]) => [
      method,
      async (params?: unknown): Promise<DeviceResult> => {
        if (!initialized) {
          const result = await handlers.initImKeyCore()
          if (!result.isSuccess) return result
          initialized = result
        }
        return method === 'initImKeyCore' ? initialized : handler(params)
      }
    ])
  ) as Record<DeviceMethod, Handler>
}
