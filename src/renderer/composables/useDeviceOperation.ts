import { getCurrentInstance, onUnmounted } from 'vue'
import { callDevice } from '../device'
import type {
  DeviceMethod,
  DeviceParams,
  DeviceResult,
  DeviceValues,
  DeviceOperationAction,
  DeviceOperationTrace
} from '../../shared/deviceContract'

export interface DeviceOperation {
  call: typeof callDevice
  run<T>(
    task: () => Promise<T>,
    key?: string,
    action?: DeviceOperationAction
  ): Promise<T | undefined>
  feedback?(action?: DeviceOperationAction): void
  active(): boolean
}

// Queue whole user operations, not just their individual native requests.
let operationCount = 0
let tail: Promise<void> = Promise.resolve()
function traceOperation(event: DeviceOperationTrace): void | Promise<void> {
  if (typeof window !== 'undefined') return window.imkey?.device?.trace?.(event)
}
interface OperationRecord {
  operationId: string
  action: DeviceOperationAction
  enqueuedAt: number
  feedbackSent: boolean
}
export function createDeviceOperation(
  invoke: typeof callDevice = callDevice,
  trace: (event: DeviceOperationTrace) => void | Promise<void> = traceOperation
): DeviceOperation & { dispose(): void } {
  let active = true
  const records = new Map<string, OperationRecord>()
  let current: OperationRecord | undefined
  function emit(
    record: OperationRecord,
    phase: DeviceOperationTrace['phase'],
    timing: Pick<DeviceOperationTrace, 'queueMs' | 'durationMs'> = {}
  ) {
    try {
      void Promise.resolve(
        trace({ operationId: record.operationId, action: record.action, phase, ...timing })
      ).catch(() => {})
    } catch {
      // Missing bridges or failed diagnostics cannot delay or fail the workflow.
    }
  }
  return {
    active: () => active,
    dispose() {
      active = false
    },
    feedback(action?: DeviceOperationAction) {
      if (!active) return
      const record = action
        ? [...records.values()].reverse().find(item => item.action === action)
        : current || [...records.values()].at(-1)
      if (!record || record.feedbackSent) return
      record.feedbackSent = true
      emit(record, 'feedback', { durationMs: Math.max(0, Date.now() - record.enqueuedAt) })
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
        current ? { operationId: current.operationId, stage: method } : undefined
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
    async run<T>(
      task: () => Promise<T>,
      key = 'action',
      action: DeviceOperationAction = key === 'initialize' ? 'initialize' : 'action'
    ): Promise<T | undefined> {
      if (!active || records.has(key)) return undefined
      const record: OperationRecord = {
        operationId: `${Date.now().toString(36)}-${++operationCount}`,
        action,
        enqueuedAt: Date.now(),
        feedbackSent: false
      }
      records.set(key, record)
      emit(record, 'enqueued')
      const previous = tail
      let release!: () => void
      tail = new Promise<void>(resolve => {
        release = resolve
      })
      try {
        await previous
        if (!active) return undefined
        current = record
        emit(record, 'started', { queueMs: Math.max(0, Date.now() - record.enqueuedAt) })
        return await task()
      } finally {
        emit(record, 'finished', { durationMs: Math.max(0, Date.now() - record.enqueuedAt) })
        records.delete(key)
        if (current === record) current = undefined
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
