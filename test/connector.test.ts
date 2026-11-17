import { afterEach, describe, expect, it, vi } from 'vitest'
import koffi from 'koffi'
import { ConnectorClient } from '../src/service/connector/ConnectorClient'
import { createDeviceHandlers, type Handler } from '../src/service/handlers'
import { DeviceQueue } from '../src/service/queue'
import { deviceMethods, type DeviceMethod } from '../src/shared/deviceContract'

afterEach(() => vi.restoreAllMocks())
describe('synchronous native connector declarations', () => {
  for (const platform of ['win32', 'darwin'] as const) {
    it(`${platform} uses platform exports and synchronous clear/call/error order`, () => {
      const declarations: string[] = []
      const calls: { name: string; args: unknown[] }[] = []
      vi.spyOn(koffi, 'load').mockImplementation(
        () =>
          ({
            func(declaration: string) {
              declarations.push(declaration)
              const name = declaration.match(
                /(imkey_clear_err(?:_win)?|call_imkey_api|imkey_get_last_err_message(?:_win)?)/
              )?.[1]
              if (!name) throw new Error('Unexpected native export')
              // No .async API is supplied: a connector using asynchronous native calls fails this test.
              return (...args: unknown[]) => {
                calls.push({ name, args })
                return name === 'call_imkey_api'
                  ? 'response'
                  : name.startsWith('imkey_get_last_err_message')
                    ? ''
                    : ''
              }
            }
          }) as unknown as ReturnType<typeof koffi.load>
      )
      const connector = new ConnectorClient({
        libraryPath: '/fixture/connector',
        platform,
        isPackaged: true
      })
      expect(connector.loadError).toBeNull()
      expect(connector.callImKeyApi('request')).toBe('response')
      expect(connector.getLastErrorMessage()).toBe('')
      const suffix = platform === 'win32' ? '_win' : ''
      expect(declarations).toEqual([
        'const char *call_imkey_api(const char *request)',
        `void imkey_clear_err${suffix}(${platform === 'win32' ? 'const char *unused' : ''})`,
        `const char *imkey_get_last_err_message${suffix}(${platform === 'win32' ? 'const char *unused' : ''})`
      ])
      expect(calls).toEqual([
        { name: `imkey_clear_err${suffix}`, args: platform === 'win32' ? [''] : [] },
        { name: 'call_imkey_api', args: ['request'] },
        { name: `imkey_get_last_err_message${suffix}`, args: platform === 'win32' ? [''] : [] }
      ])
    })
  }
})
it('load failure returns structured errors for every registered device method', async () => {
  vi.spyOn(koffi, 'load').mockImplementation(() => {
    throw new Error('Win32 error 126: fixture library missing')
  })
  const connector = new ConnectorClient({
    libraryPath: '/fixture/connector.dll',
    platform: 'win32',
    isPackaged: true
  })
  expect(connector.loadError).toEqual({
    message: 'Win32 error 126: fixture library missing',
    libraryPath: '/fixture/connector.dll'
  })
  const handlers = createDeviceHandlers(connector, '/fixture/userData')
  const queue = new DeviceQueue(handlers, connector.loadError?.message)
  const results = await Promise.all(
    deviceMethods.map((method, id) => queue.dispatch({ id, method }))
  )
  expect(results).toEqual(
    deviceMethods.map((_, id) => ({
      id,
      result: { isSuccess: false, result: 'Win32 error 126: fixture library missing' }
    }))
  )
  expect(results[deviceMethods.indexOf('getUserPath')].result.isSuccess).toBe(false)
})
it('queue catches handler rejection and processes subsequent requests', async () => {
  let count = 0
  const handlers = {
    getSeid: async () => {
      count++
      if (count === 1) throw new Error('First device request failed')
      return { isSuccess: true as const, result: 'SEID-next' }
    }
  } as Record<DeviceMethod, Handler>
  const queue = new DeviceQueue(handlers)
  const results = await Promise.all([
    queue.dispatch({ id: 1, method: 'getSeid' }),
    queue.dispatch({ id: 2, method: 'getSeid' })
  ])
  expect(results).toEqual([
    { id: 1, result: { isSuccess: false, result: 'First device request failed' } },
    { id: 2, result: { isSuccess: true, result: 'SEID-next' } }
  ])
})
