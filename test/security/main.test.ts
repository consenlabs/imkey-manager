import { describe, it, expect, vi, afterEach } from 'vitest'
import { EventEmitter } from 'node:events'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { ServiceClient, type ServiceTransport } from '../../src/main/serviceClient'
import {
  isTrustedSender,
  validateDeviceCall,
  isAllowedDeviceMessage,
  isHttpsUrl
} from '../../src/main/ipcPolicy'
import { connectorPath, keyEnvPath } from '../../src/main/paths'

class Transport extends EventEmitter implements ServiceTransport {
  messages: unknown[] = []
  postMessage(message: unknown): void {
    this.messages.push(message)
  }
  kill(): boolean {
    this.emit('exit', 0)
    return true
  }
}
const configuration = {
  userDataPath: '/user',
  libraryPath: '/connector.dylib',
  platform: 'darwin' as const,
  isPackaged: false
}
afterEach(() => vi.useRealTimers())
describe('main window IPC policy', () => {
  const webContents = {}
  const window = { isDestroyed: () => false, webContents }
  it('accepts only the live main window webContents', () => {
    expect(isTrustedSender({ sender: webContents }, window)).toBe(true)
    expect(isTrustedSender({ sender: {} }, window)).toBe(false)
    expect(isTrustedSender({ sender: webContents }, null)).toBe(false)
    expect(isTrustedSender({ sender: webContents }, { ...window, isDestroyed: () => true })).toBe(
      false
    )
    expect(isAllowedDeviceMessage({ sender: webContents }, window, { type: 'cosUpdate' })).toBe(
      true
    )
    expect(isAllowedDeviceMessage({ sender: {} }, window, { type: 'cosUpdate' })).toBe(false)
  })
  it('rejects unknown, signing, and malformed requests', () => {
    for (const method of [
      'api',
      'ethSign',
      'signTransaction',
      'getBTCAddress',
      'genWalletAddress',
      null
    ])
      expect(() => validateDeviceCall(method, undefined)).toThrow()
    expect(() => validateDeviceCall('downloadApplet', {})).toThrow()
    expect(() => validateDeviceCall('genWalletAddress', { filePath: '/user' })).toThrow()
    expect(() => validateDeviceCall('getSeid', undefined)).not.toThrow()
  })
  it('allows only HTTPS external links', () => {
    expect(isHttpsUrl('https://imkey.im')).toBe(true)
    for (const url of ['http://imkey.im', 'file:///etc/passwd', 'javascript:alert(1)', 'bad', {}])
      expect(isHttpsUrl(url)).toBe(false)
  })
})
describe('utility service request correlation and lifecycle', () => {
  it('matches ten concurrent requests to their own response ids', async () => {
    const transport = new Transport()
    const client = new ServiceClient(() => transport, configuration)
    const requests = Array.from({ length: 10 }, () => client.call('getSeid'))
    expect(transport.messages).toHaveLength(1)
    transport.emit('message', { type: 'ready' })
    const messages = transport.messages.slice(1) as { id: number }[]
    for (const message of [...messages].reverse())
      transport.emit('message', { id: message.id, result: { isSuccess: true, result: message.id } })
    expect((await Promise.all(requests)).map(result => result.result)).toEqual(
      messages.map(message => message.id)
    )
    client.stop()
  })
  it('fails all pending requests on exit and automatically starts a new process', async () => {
    vi.useFakeTimers()
    const transports: Transport[] = []
    const client = new ServiceClient(() => {
      const process = new Transport()
      transports.push(process)
      return process
    }, configuration)
    const pending = client.call('cosUpdate')
    const rejected = expect(pending).rejects.toThrow('Device service exited (1)')
    transports[0].emit('exit', 1)
    await rejected
    await vi.advanceTimersByTimeAsync(250)
    expect(transports).toHaveLength(2)
    expect(transports[1].messages[0]).toEqual({ type: 'init', ...configuration })
    client.stop()
  })
  it('returns a rejected promise when fork throws and retries without an uncaught exception', async () => {
    vi.useFakeTimers()
    const transport = new Transport()
    const fork = vi
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('fork failed')
      })
      .mockReturnValue(transport)
    const client = new ServiceClient(fork, configuration)
    let request: Promise<unknown> | undefined
    expect(() => {
      request = client.call('getSeid')
    }).not.toThrow()
    await expect(request).rejects.toThrow('fork failed')
    await vi.advanceTimersByTimeAsync(250)
    expect(fork).toHaveBeenCalledTimes(2)
    client.stop()
  })
  it('forwards connector load error details', () => {
    const transport = new Transport()
    const callback = vi.fn()
    const client = new ServiceClient(() => transport, configuration, callback)
    client.start()
    transport.emit('message', {
      type: 'connector-load-failed',
      message: 'missing',
      libraryPath: '/connector.dylib'
    })
    expect(callback).toHaveBeenCalledWith({ message: 'missing', libraryPath: '/connector.dylib' })
    client.stop()
  })
})
it('keeps connector and key.env installation paths', () => {
  expect(connectorPath(false, 'darwin', '/resources', '/root')).toBe('/root/connector.dylib')
  expect(connectorPath(true, 'darwin', '/resources', '/root')).toBe('/resources/connector.dylib')
  expect(connectorPath(true, 'win32', '/app/resources', '/root')).toBe('/app/connector.dll')
  expect(keyEnvPath(true, 'win32', '/app/resources', '/root')).toBe('/app/key.env')
})
it('contains no HTTP bridge, DApp dispatcher, or signing entry points', () => {
  const directories = ['src/main', 'src/preload', 'src/service', 'src/shared']
  const readSources = (directory: string): string =>
    readdirSync(directory, { withFileTypes: true })
      .map(entry =>
        entry.isDirectory()
          ? readSources(path.join(directory, entry.name))
          : /\.ts$/.test(entry.name)
            ? readFileSync(path.join(directory, entry.name), 'utf8')
            : ''
      )
      .join('\n')
  const source = directories.map(readSources).join('\n')
  expect(source).not.toMatch(/8081|start-http-server|message-from-main-api|openBrowserView/)
  expect(source).not.toMatch(/export function \w*(?:Sign|sign)\w*\s*\(/)
  for (const file of [
    'src/api/apirouter.js',
    'src/renderer/store/dapps.js',
    'src/renderer/store/url.js',
    'src/api/ethereumdapp.js',
    'src/api/ethereumdapp_imkey_web3.js',
    'src/api/imkey_web3_provider.js',
    'src/api/polkadotdapp.js'
  ])
    expect(existsSync(file)).toBe(false)
})
it('uses a sandboxed isolated preload and denies new windows', () => {
  const window = readFileSync('src/main/window.ts', 'utf8')
  expect(window).toContain('contextIsolation: true')
  expect(window).toContain('nodeIntegration: false')
  expect(window).toContain('sandbox: true')
  expect(window).toContain("setWindowOpenHandler(() => ({ action: 'deny' }))")
  const preload = readFileSync('src/preload/index.ts', 'utf8')
  expect(preload).toContain("exposeInMainWorld('imkey', api)")
  expect(preload).not.toMatch(/exposeInMainWorld\([^\n]*ipcRenderer/)
})
