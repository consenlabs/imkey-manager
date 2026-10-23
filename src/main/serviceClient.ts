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
export interface ServiceTimeouts {
  startupMs: number
  readMs: number
  connectMs: number
  writeMs: number
}
const defaultTimeouts: ServiceTimeouts = {
  startupMs: 30_000,
  readMs: 120_000,
  connectMs: 330_000,
  writeMs: 600_000
}
const writeMethods = new Set<DeviceMethod>([
  'activeDevice',
  'deviceBindAcquire',
  'deviceBindDisplay',
  'downloadApplet',
  'updateApplet',
  'deleteApplet',
  'writeWalletAddress'
])
interface PendingRequest {
  method: DeviceMethod
  params: unknown
  context?: DeviceCallContext
  sent: boolean
  startedAt: number
  resolve: (result: DeviceResult) => void
  reject: (error: Error) => void
}
function firmwareRequest(request: Pick<PendingRequest, 'method' | 'params'>): boolean {
  return (
    request.method === 'cosUpdate' ||
    (request.method === 'updateApplet' && request.params === 'IMK')
  )
}
export class ServiceClient {
  private process: ServiceTransport | null = null
  private retiringProcess: ServiceTransport | null = null
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
  private startupTimer?: ReturnType<typeof setTimeout>
  private executionTimer?: ReturnType<typeof setTimeout>
  // This also covers contextless getSeid calls made by binding-code storage.
  // Only the start of a different explicit operation ends firmware protection.
  private firmwareOperation?: { operationId?: string }
  private readonly timeouts: ServiceTimeouts
  constructor(
    private readonly fork: () => ServiceTransport,
    private readonly configuration: ServiceConfiguration,
    private readonly onLoadError: (error: {
      message: string
      libraryPath: string
    }) => void = () => {},
    private readonly log: DiagnosticLog = noDiagnostics,
    timeouts: Partial<ServiceTimeouts> = {}
  ) {
    const testTimeout =
      !configuration.isPackaged && configuration.mockPath
        ? Number(process.env.IMKEY_TEST_DEVICE_TIMEOUT_MS)
        : NaN
    this.timeouts = {
      ...defaultTimeouts,
      ...(Number.isFinite(testTimeout) && testTimeout > 0
        ? { readMs: testTimeout, connectMs: testTimeout, writeMs: testTimeout }
        : {}),
      ...timeouts
    }
  }
  private clearWatchdogs(): void {
    clearTimeout(this.startupTimer)
    clearTimeout(this.executionTimer)
    this.startupTimer = this.executionTimer = undefined
  }
  private protectStartup(): boolean {
    return Boolean(this.firmwareOperation) || [...this.pending.values()].some(firmwareRequest)
  }
  private watchStartup(current: ServiceTransport): void {
    if (this.ready || this.protectStartup() || this.startupTimer) return
    this.startupTimer = setTimeout(() => {
      if (this.process === current && !this.ready && !this.protectStartup()) this.timeout(current)
    }, this.timeouts.startupMs)
    this.startupTimer.unref?.()
  }
  private watchExecution(current: ServiceTransport, id: number, request: PendingRequest): void {
    clearTimeout(this.executionTimer)
    this.executionTimer = undefined
    if (firmwareRequest(request)) {
      this.firmwareOperation = { operationId: request.context?.operationId }
    } else if (
      this.firmwareOperation &&
      request.context?.operationId &&
      request.context.operationId !== this.firmwareOperation.operationId
    ) {
      this.firmwareOperation = undefined
    }
    if (this.firmwareOperation) return
    const duration =
      request.method === 'connectDevice'
        ? this.timeouts.connectMs
        : writeMethods.has(request.method)
          ? this.timeouts.writeMs
          : this.timeouts.readMs
    this.executionTimer = setTimeout(() => {
      if (this.process === current && this.activeRequest?.requestId === id) this.timeout(current)
    }, duration)
    this.executionTimer.unref?.()
  }
  private timeout(current: ServiceTransport): void {
    if (this.process !== current) return
    this.log('error', 'service.timed-out', {
      ...this.activeRequest,
      code: 'DEVICE_OPERATION_TIMEOUT'
    })
    this.clearWatchdogs()
    // Detach before kill(): the exit event can be synchronous, and its late
    // messages must not resolve requests in a replacement process.
    this.process = null
    this.retiringProcess = current
    this.ready = false
    this.activeRequest = undefined
    for (const [requestId, request] of this.pending) {
      request.resolve({
        isSuccess: false,
        result: 'device_operation_timeout',
        code: 'DEVICE_OPERATION_TIMEOUT',
        requestId,
        method: request.method,
        stage: request.context?.stage || request.method,
        ...(request.context ? { operationId: request.context.operationId } : {})
      })
    }
    // All requests from the interrupted generation fail; none are replayed.
    this.pending.clear()
    let terminationRequested = false
    try {
      terminationRequested = current.kill()
    } catch {
      // Keep the process isolated until its actual exit confirms it is gone.
    }
    if (this.retiringProcess !== current) return // kill() already emitted exit.
    if (terminationRequested) {
      this.retiringProcess = null
      this.scheduleRestart()
    } else this.log('error', 'service.kill-failed', { code: 'DEVICE_RECOVERY_PENDING' })
  }
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
    if (this.process || this.retiringProcess || this.stopped) return
    clearTimeout(this.restartTimer)
    this.restartTimer = undefined
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
          if (this.process !== current) return
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
          const request = typeof reply.id === 'number' ? this.pending.get(reply.id) : undefined
          if (reply.phase === 'start' && typeof reply.id === 'number' && request) {
            this.activeRequest = {
              requestId: reply.id,
              method: request.method,
              operationId: request.context?.operationId,
              stage: request.context?.stage || request.method
            }
            this.watchExecution(current, reply.id, request)
            this.log('info', 'device.execution-started', this.activeRequest)
          } else if (reply.phase === 'end' && this.activeRequest?.requestId === reply.id) {
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
            clearTimeout(this.executionTimer)
            this.executionTimer = undefined
          }
        } else if (reply.type === 'ready') {
          this.log('info', 'service.ready')
          this.ready = true
          clearTimeout(this.startupTimer)
          this.startupTimer = undefined
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
          if (this.activeRequest?.requestId === reply.id) {
            clearTimeout(this.executionTimer)
            this.executionTimer = undefined
            this.activeRequest = undefined
          }
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
        if (this.retiringProcess === current) {
          this.retiringProcess = null
          this.log('info', 'service.recovery-released', { exitCode: code })
          this.scheduleRestart()
          return
        }
        if (this.process !== current) return
        this.log('error', 'service.exited', { exitCode: code })
        this.clearWatchdogs()
        this.activeRequest = undefined
        this.process = null
        this.ready = false
        this.failPending(new Error(`Device service exited (${code})`))
        this.scheduleRestart()
      })
      this.watchStartup(current)
      child.postMessage({ type: 'init', ...this.configuration })
    } catch (error) {
      this.clearWatchdogs()
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
    if (this.retiringProcess)
      return Promise.resolve({
        isSuccess: false,
        result: 'device_recovery_pending',
        code: 'DEVICE_RECOVERY_PENDING',
        method,
        stage: context?.stage || method,
        ...(context ? { operationId: context.operationId } : {})
      })
    // A different user operation may start after a firmware worker has exited.
    // Before ready there can be no native execution, so startup may be watched
    // again without interrupting the previous firmware operation.
    if (
      !this.ready &&
      !this.activeRequest &&
      this.firmwareOperation &&
      context?.operationId &&
      context.operationId !== this.firmwareOperation.operationId
    )
      this.firmwareOperation = undefined
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
      if (this.protectStartup()) {
        clearTimeout(this.startupTimer)
        this.startupTimer = undefined
      } else if (this.process) this.watchStartup(this.process)
      this.send(id, request)
    })
  }
  stop(): void {
    this.log('info', 'service.stopped')
    this.stopped = true
    clearTimeout(this.restartTimer)
    this.clearWatchdogs()
    this.failPending(new Error('Device service stopped'))
    const current = this.process
    const retiring = this.retiringProcess
    this.process = null
    this.retiringProcess = null
    this.ready = false
    this.activeRequest = undefined
    for (const child of [current, retiring]) {
      try {
        child?.kill()
      } catch {
        // stop() must still clear state when termination is unavailable.
      }
    }
  }
}
