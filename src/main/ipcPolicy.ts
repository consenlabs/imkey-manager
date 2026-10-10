import {
  isDeviceMethod,
  isValidDeviceParams,
  type DeviceCallContext
} from '../shared/deviceContract'
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
