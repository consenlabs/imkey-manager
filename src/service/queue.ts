import type {
  DeviceMethod,
  DeviceResult,
  DeviceRequest,
  DeviceResponse
} from '../shared/deviceContract'
import type { Handler } from './handlers'
export class DeviceQueue {
  private tail: Promise<void> = Promise.resolve()
  constructor(
    private handlers: Record<DeviceMethod, Handler>,
    private loadError?: string,
    private readonly trace: (event: {
      type: 'trace'
      phase: 'start' | 'end'
      id: number
      method: DeviceMethod
      durationMs?: number
      operationId?: string
      stage?: string
    }) => void = () => {}
  ) {}
  private emitTrace(event: Parameters<DeviceQueue['trace']>[0]): void {
    try {
      this.trace(event)
    } catch {
      /* Diagnostics do not affect device results. */
    }
  }
  dispatch(request: DeviceRequest): Promise<DeviceResponse> {
    const pending = this.tail.then(async () => {
      const startedAt = Date.now()
      this.emitTrace({
        type: 'trace',
        phase: 'start',
        id: request.id,
        method: request.method,
        ...request.context
      })
      let result: DeviceResult
      try {
        result = this.loadError
          ? { isSuccess: false, result: this.loadError }
          : await this.handlers[request.method](request.params)
      } catch (error) {
        result = {
          isSuccess: false,
          result: error instanceof Error ? error.message : String(error)
        }
      }
      this.emitTrace({
        type: 'trace',
        phase: 'end',
        id: request.id,
        method: request.method,
        durationMs: Date.now() - startedAt,
        ...request.context
      })
      return { id: request.id, result }
    })
    this.tail = pending.then(
      () => {},
      () => {}
    )
    return pending
  }
}
