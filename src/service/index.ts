import { ConnectorClient, type ConnectorOptions } from './connector/ConnectorClient'
import { createDeviceHandlers } from './handlers'
import { initializedHandlers } from './initializedHandlers'
import { DeviceQueue } from './queue'
import type { DeviceMethod, DeviceRequest } from '../shared/deviceContract'
interface ParentPort {
  on(event: 'message', listener: (event: { data: unknown }) => void): void
  postMessage(message: unknown): void
}
const port = (process as NodeJS.Process & { parentPort?: ParentPort }).parentPort
if (!port) throw new Error('Device service requires utilityProcess parentPort')
let queue: DeviceQueue | undefined
port.on('message', event => {
  const data = event.data as { type?: string; userDataPath: string } & ConnectorOptions & {
      id: number
      method: DeviceMethod
      params?: unknown
    }
  if (data.type === 'init' && !queue) {
    const connector = new ConnectorClient(data)
    queue = new DeviceQueue(
      initializedHandlers(createDeviceHandlers(connector, data.userDataPath)),
      connector.loadError?.message,
      event => port.postMessage(event)
    )
    if (connector.loadError)
      port.postMessage({ type: 'connector-load-failed', ...connector.loadError })
    port.postMessage({ type: 'ready' })
    return
  }
  if (queue && typeof data.id === 'number')
    void queue.dispatch(data as DeviceRequest).then(response => port.postMessage(response))
})
