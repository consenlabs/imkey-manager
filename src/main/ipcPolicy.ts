import {
  isDeviceMethod,
  isValidDeviceParams,
  deviceOperationActions,
  deviceOperationPhases,
  type DeviceCallContext,
  type DeviceOperationTrace
} from '../shared/deviceContract'
import { isFirmwareDiagnosticCode, isFirmwareDiagnosticStage } from '../shared/firmwareDiagnostics'
export interface SenderWindow {
  isDestroyed(): boolean
  webContents: unknown
}
export function isTrustedSender(event: { sender: unknown }, window: SenderWindow | null): boolean {
  return Boolean(window && !window.isDestroyed() && event.sender === window.webContents)
}
export function assertTrustedSender(event: { sender: unknown }, window: SenderWindow | null): void {
  if (!isTrustedSender(event, window)) throw new Error('Untrusted IPC sender')
}
export function validateDeviceCall(method: unknown, params: unknown): void {
  if (!isDeviceMethod(method)) throw new Error('Unknown device method')
  if (!isValidDeviceParams(method, params)) throw new Error('Invalid device parameters')
}
export function isAllowedDeviceMessage(
  event: { sender: unknown },
  window: SenderWindow | null,
  message: unknown
): boolean {
  if (!isTrustedSender(event, window) || !message || typeof message !== 'object') return false
  const value = message as { type?: unknown; data?: unknown }
  return isDeviceMethod(value.type) && isValidDeviceParams(value.type, value.data)
}
export function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function validateDeviceContext(
  context: unknown
): asserts context is DeviceCallContext | undefined {
  if (context === undefined) return
  if (!context || typeof context !== 'object' || Array.isArray(context))
    throw new Error('Invalid device context')
  const value = context as Record<string, unknown>
  if (
    !Object.keys(value).every(key => key === 'operationId' || key === 'stage') ||
    typeof value.operationId !== 'string' ||
    !/^[a-z0-9-]{1,64}$/.test(value.operationId) ||
    (value.stage !== undefined && !isDeviceMethod(value.stage))
  )
    throw new Error('Invalid device context')
}

export function validateDeviceTrace(trace: unknown): asserts trace is DeviceOperationTrace {
  if (!trace || typeof trace !== 'object' || Array.isArray(trace))
    throw new Error('Invalid device trace')
  const value = trace as Record<string, unknown>
  const allowedKeys =
    value.phase === 'failed'
      ? ['operationId', 'action', 'phase', 'stage', 'code']
      : ['operationId', 'action', 'phase', 'queueMs', 'durationMs']
  if (
    !Object.keys(value).every(key => allowedKeys.includes(key)) ||
    typeof value.operationId !== 'string' ||
    !/^[a-z0-9]{1,16}-[1-9][0-9]{0,12}$/.test(value.operationId) ||
    !(deviceOperationActions as readonly unknown[]).includes(value.action) ||
    !(deviceOperationPhases as readonly unknown[]).includes(value.phase) ||
    (value.phase === 'failed' &&
      (!isFirmwareDiagnosticStage(value.stage) || !isFirmwareDiagnosticCode(value.code))) ||
    ['queueMs', 'durationMs'].some(
      key =>
        value[key] !== undefined &&
        (!Number.isSafeInteger(value[key]) || (value[key] as number) < 0)
    )
  )
    throw new Error('Invalid device trace')
}
