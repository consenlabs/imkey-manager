import { getCurrentInstance, onUnmounted } from 'vue'
import { callDevice } from '../device'
import type {
  DeviceMethod,
  DeviceParams,
  DeviceResult,
  DeviceValues
} from '../../shared/deviceContract'

export interface DeviceOperation {
  call: typeof callDevice
  run<T>(task: () => Promise<T>, key?: string): Promise<T | undefined>
  active(): boolean
}

// Queue whole user operations, not just their individual native requests.
let operationCount = 0
let tail: Promise<void> = Promise.resolve()
export function createDeviceOperation(
  invoke: typeof callDevice = callDevice
): DeviceOperation & { dispose(): void } {
  let active = true
  const busy = new Set<string>()
  let operationId: string | undefined
  return {
    active: () => active,
    dispose() {
      active = false
    },
    async call<M extends DeviceMethod>(
      method: M,
      params?: DeviceParams[M]
    ): Promise<DeviceResult<DeviceValues[M]>> {
      if (!active)
        return {
          isSuccess: false,
          result: 'Device operation cancelled',
          code: 'OPERATION_CANCELLED',
          method
        }
      const result = await invoke(
        method,
        params,
        operationId ? { operationId, stage: method } : undefined
      )
      // A running native firmware call is allowed to finish; no new step follows disposal.
      if (!active)
        return {
          isSuccess: false,
          result: 'Device operation cancelled',
          code: 'OPERATION_CANCELLED',
          method
        }
      return result
    },
    async run<T>(task: () => Promise<T>, key = 'action'): Promise<T | undefined> {
      if (!active || busy.has(key)) return undefined
      busy.add(key)
      const previous = tail
      let release!: () => void
      tail = new Promise<void>(resolve => {
        release = resolve
      })
      try {
        await previous
        if (!active) return undefined
        operationId = `${Date.now().toString(36)}-${++operationCount}`
        return await task()
      } finally {
        busy.delete(key)
        operationId = undefined
        release()
      }
    }
  }
}
export function useDeviceOperation(): DeviceOperation {
  const operation = createDeviceOperation()
  if (getCurrentInstance()) onUnmounted(() => operation.dispose())
  return operation
}
