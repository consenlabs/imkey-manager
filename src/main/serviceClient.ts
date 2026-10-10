import { failureCode } from '../shared/deviceErrors'
import { noDiagnostics, nativeOutputMetadata, type DiagnosticLog } from './diagnostics'
import type {
  DeviceCallContext,
  DeviceMethod,
  DeviceResult,
  ServiceConfiguration as SharedServiceConfiguration
} from '../shared/deviceContract'
export interface ServiceTransport {
  postMessage(message: unknown): void
  on(event: 'message', listener: (message: unknown) => void): unknown
  on(event: 'exit', listener: (code: number) => void): unknown
  stdout?: { on(event: 'data', listener: (chunk: Buffer) => void): unknown } | null
  stderr?: { on(event: 'data', listener: (chunk: Buffer) => void): unknown } | null
  kill(): boolean
}
export type ServiceConfiguration = Omit<SharedServiceConfiguration, 'type'>
interface PendingRequest {
  method: DeviceMethod
  params: unknown
  context?: DeviceCallContext
  sent: boolean
  startedAt: number
  resolve: (result: DeviceResult) => void
  reject: (error: Error) => void
}
export class ServiceClient {
  private process: ServiceTransport | null = null
  private ready = false
  private nextId = 0
  private pending = new Map<number, PendingRequest>()
  private stopped = false
  private restartAttempts = 0
  private activeRequest?: {
    requestId: number
    method: string
    operationId?: string
    stage?: string
  }
  private startError?: Error
  private restartTimer?: ReturnType<typeof setTimeout>
  constructor(
    private readonly fork: () => ServiceTransport,
    private readonly configuration: ServiceConfiguration,
    private readonly onLoadError: (error: {
      message: string
      libraryPath: string
    }) => void = () => {},
    private readonly log: DiagnosticLog = noDiagnostics
  ) {}
  private scheduleRestart(): void {
    if (!this.stopped) {
      clearTimeout(this.restartTimer)
      const delayMs = Math.min(250 * 2 ** Math.min(this.restartAttempts++, 7), 30000)
      this.log('warn', 'service.restart-scheduled', { delayMs })
      this.restartTimer = setTimeout(() => this.start(), delayMs)
    }
  }
  private failPending(error: Error): void {
    for (const [requestId, request] of this.pending) {
      this.log('error', 'device.call-aborted', {
        requestId,
        method: request.method,
        operationId: request.context?.operationId,
        stage: request.context?.stage || request.method,
        durationMs: Date.now() - request.startedAt,
        code: 'SERVICE_UNAVAILABLE'
      })
      request.reject(error)
    }
    this.pending.clear()
  }
  private send(id: number, request: PendingRequest): void {
    if (!this.ready || !this.process || request.sent) return
    request.sent = true
    try {
      this.process.postMessage({
        id,
        method: request.method,
        params: request.params,
        ...(request.context ? { context: request.context } : {})
      })
    } catch (error) {
      this.pending.delete(id)
      this.log('error', 'device.send-failed', {
        requestId: id,
        method: request.method,
        code: 'SERVICE_UNAVAILABLE'
      })
      request.reject(error instanceof Error ? error : new Error(String(error)))
    }
  }
  start(): void {
    if (this.process || this.stopped) return
    let child: ServiceTransport | null = null
    try {
      child = this.fork()
      this.process = child
      this.ready = false
      this.startError = undefined
      const current = child
      this.log('info', 'service.started')
      for (const stream of ['stdout', 'stderr'] as const) {
        child[stream]?.on('data', chunk => {
          this.log(stream === 'stderr' ? 'warn' : 'info', 'service.native-output', {
            ...this.activeRequest,
            stream,
            ...nativeOutputMetadata(String(chunk).slice(0, 16384))
          })
        })
      }
      child.on('message', message => {
        if (this.process !== current || !message || typeof message !== 'object') return
        const reply = message as {
          id?: number
          result?: DeviceResult
          type?: string
          message?: string
          libraryPath?: string
          phase?: string
          method?: string
          durationMs?: number
          operationId?: string
          stage?: string
        }
        if (reply.type === 'trace') {
          if (reply.phase === 'start' && typeof reply.id === 'number' && reply.method) {
            this.activeRequest = {
              requestId: reply.id,
              method: reply.method,
              operationId: this.pending.get(reply.id)?.context?.operationId,
              stage: this.pending.get(reply.id)?.context?.stage || reply.method
            }
            this.log('info', 'device.execution-started', this.activeRequest)
          } else if (reply.phase === 'end') {
            this.log('info', 'device.execution-finished', {
              requestId: reply.id,
              method: reply.method,
              durationMs: reply.durationMs,
              operationId:
                typeof reply.id === 'number'
                  ? this.pending.get(reply.id)?.context?.operationId
                  : undefined,
              stage:
                typeof reply.id === 'number'
                  ? this.pending.get(reply.id)?.context?.stage || reply.method
                  : undefined
            })
            this.activeRequest = undefined
          }
        } else if (reply.type === 'ready') {
          this.log('info', 'service.ready')
          this.ready = true
          for (const [id, request] of this.pending) this.send(id, request)
        } else if (reply.type === 'connector-load-failed') {
          this.log('error', 'connector.load-failed', {
            libraryPath: this.configuration.libraryPath
          })
          this.onLoadError({
            message: String(reply.message),
            libraryPath: String(reply.libraryPath)
          })
        } else if (typeof reply.id === 'number' && reply.result) {
          const request = this.pending.get(reply.id)
          if (request) {
            this.restartAttempts = 0
            const failure = !reply.result.isSuccess ? reply.result : undefined
            this.log(reply.result.isSuccess ? 'info' : 'warn', 'device.call-finished', {
              requestId: reply.id,
              method: request.method,
              durationMs: Date.now() - request.startedAt,
              success: reply.result.isSuccess,
              code: failure ? failureCode(failure) : undefined,
              stage: failure?.stage || request.context?.stage || request.method,
              operationId: request.context?.operationId
            })
          }
          request?.resolve(
            !reply.result.isSuccess && request.context
              ? {
                  ...reply.result,
                  code: failureCode(reply.result),
                  requestId: reply.id,
                  method: request.method,
                  stage: request.context.stage || request.method,
                  operationId: request.context.operationId
                }
              : reply.result
          )
          this.pending.delete(reply.id)
        }
      })
      child.on('exit', code => {
        if (this.process !== current) return
        this.log('error', 'service.exited', { exitCode: code })
        this.activeRequest = undefined
        this.process = null
        this.ready = false
        this.failPending(new Error(`Device service exited (${code})`))
        this.scheduleRestart()
      })
      child.postMessage({ type: 'init', ...this.configuration })
    } catch (error) {
      this.process = null
      this.ready = false
      this.log('error', 'service.start-failed', { code: 'SERVICE_UNAVAILABLE' })
      this.startError = error instanceof Error ? error : new Error(String(error))
      child?.kill()
      this.failPending(this.startError)
      this.onLoadError({
        message: this.startError.message,
        libraryPath: this.configuration.libraryPath
      })
      this.scheduleRestart()
    }
  }
  call(method: DeviceMethod, params?: unknown, context?: DeviceCallContext): Promise<DeviceResult> {
    if (this.stopped) return Promise.reject(new Error('Device service stopped'))
    this.start()
    if (!this.process)
      return Promise.reject(this.startError || new Error('Device service unavailable'))
    const id = ++this.nextId
    return new Promise((resolve, reject) => {
      const request: PendingRequest = {
        method,
        params,
        context,
        sent: false,
        startedAt: Date.now(),
        resolve,
        reject
      }
      this.log('info', 'device.call-queued', {
        requestId: id,
        method,
        operationId: context?.operationId,
        stage: context?.stage || method
      })
      this.pending.set(id, request)
      this.send(id, request)
    })
  }
  stop(): void {
    this.log('info', 'service.stopped')
    this.stopped = true
    clearTimeout(this.restartTimer)
    this.failPending(new Error('Device service stopped'))
    this.process?.kill()
    this.process = null
    this.ready = false
  }
}
