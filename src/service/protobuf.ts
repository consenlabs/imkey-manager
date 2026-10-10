import apiModule from '../proto/api_pb.js'
import deviceModule from '../proto/device_pb.js'
import btcModule from '../proto/btc_pb.js'
import anyModule from 'google-protobuf/google/protobuf/any_pb.js'

export interface Message {
  serializeBinary(): Uint8Array
  toObject(): Record<string, unknown>
  [method: string]: unknown
}
export interface MessageConstructor {
  new (): Message
  deserializeBinary(bytes: Uint8Array): Message
}
export type Schema = Record<string, MessageConstructor>
export const api = apiModule as unknown as Schema
export const device = deviceModule as unknown as Schema
export const btc = btcModule as unknown as Schema
const anySchema = anyModule as unknown as Schema
export function invoke<T>(message: Message, method: string, ...args: unknown[]): T {
  const fn = message[method]
  if (typeof fn !== 'function') throw new Error(`Unknown protobuf accessor ${method}`)
  return fn.apply(message, args) as T
}
export function create(
  schema: Schema,
  name: string,
  fields: Record<string, unknown> = {}
): Message {
  const message = new schema[name]()
  for (const [setter, value] of Object.entries(fields)) invoke(message, setter, value)
  return message
}
export function encode(method: string, param?: Message): string {
  const action = create(api, 'ImkeyAction', { setMethod: method })
  if (param)
    invoke(action, 'setParam', create(anySchema, 'Any', { setValue: param.serializeBinary() }))
  return Buffer.from(action.serializeBinary()).toString('hex')
}
export function decode(schema: Schema, name: string, hex: string): Message {
  return schema[name].deserializeBinary(Buffer.from(hex, 'hex'))
}

// macOS exports plain text; Windows exports a protobuf ErrorResponse as hex.
// Accept both for older connector builds and mocks, without losing unknown errors.
export function nativeErrorMessage(raw: string): string {
  if (raw.length % 2 === 0 && /^[0-9a-f]+$/i.test(raw)) {
    try {
      const message = invoke<string>(decode(api, 'ErrorResponse', raw), 'getError')
      if (message.trim()) return message
    } catch {
      // Preserve the native error if it does not match the protobuf schema.
    }
  }
  return raw.trim() || 'Connector returned an unspecified error'
}
