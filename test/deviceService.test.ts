import { describe, expect, it } from 'vitest'
import { resolve } from 'node:path'
import fixtures from './fixtures/golden-api.json'
import { DeviceApi } from '../src/service/deviceApi'
import { createDeviceHandlers } from '../src/service/handlers'
import { DeviceQueue } from '../src/service/queue'
import { ConnectorClient, allowedMockPath } from '../src/service/connector/ConnectorClient'
import type { DeviceMethod } from '../src/shared/deviceContract'
import type { Handler } from '../src/service/handlers'
import { api, btc, create, decode, device, invoke } from '../src/service/protobuf'
const direct: Record<string, string> = {
  getSeid: 'get_seid',
  getSn: 'get_sn',
  getFirmwareVersion: 'get_firmware_version',
  getBleVersion: 'get_ble_version',
  getSdkInfo: 'get_sdk_info',
  activeDevice: 'device_activate',
  cosUpdate: 'cos_update',
  cosCheckUpdate: 'cos_check_update',
  isBLStatus: 'is_bl_status',
  checkDevice: 'device_secure_check',
  deviceBindCheck: 'bind_check',
  deviceBindDisplay: 'bind_display_code'
}
function execute(api: DeviceApi, method: string, args: unknown[]): unknown {
  if (direct[method]) return api.deviceMethod(direct[method])
  if (method === 'initImKeyCore') return api.initImKeyCore()
  if (method === 'connect') return api.connect()
  if (method === 'getRamSize') return api.getRamSize()
  if (method === 'getUserPath') return api.getUserPath()
  if (method === 'getBTCXpub') return api.getBTCXpub()
  if (method === 'deviceBindAcquire') return api.bindAcquire(args[0] as string)
  if (method === 'checkUpdateAppList' || method === 'getInstalledAppletList')
    return api.applets(method === 'getInstalledAppletList')
  const applets: Record<string, 'app_download' | 'app_update' | 'app_delete'> = {
    downloadApplet: 'app_download',
    updateApplet: 'app_update',
    deleteApplet: 'app_delete'
  }
  if (applets[method]) return api.applet(applets[method], args[0] as string)
  const chains: Record<string, string> = {
    BTC: 'BITCOIN',
    ETH: 'ETHEREUM',
    COSMOS: 'COSMOS',
    FILECOIN: 'FILECOIN',
    DOT: 'POLKADOT',
    KSM: 'KUSAMA',
    TRON: 'TRON'
  }
  const options = args[0] as { path: string; network?: string }
  if (method === 'registerEOSPubKey') return api.registerEOSPubKey(options.path)
  const symbol = method.replace(/^(get|register)/, '').replace('Address', '')
  return api.address(chains[symbol], options.path, method.startsWith('register'), options.network)
}
describe('legacy protobuf golden fixtures', () => {
  for (const fixture of fixtures.filter(
    item => !['importBindCode', 'exportBindCode', 'isExistBindCodeFile'].includes(item.method)
  )) {
    it(`${fixture.module}.${fixture.method} ${fixture.errorHex ? 'error' : 'success'}`, () => {
      const requests: string[] = []
      const api = new DeviceApi(
        {
          callImKeyApi(hex) {
            requests.push(hex)
            return fixture.responseHex
          },
          getLastErrorMessage() {
            return fixture.errorHex
          }
        },
        '/fixture/userData'
      )
      const result = execute(api, fixture.method, fixture.args)
      expect(requests).toEqual(fixture.requests)
      const old = structuredClone(fixture.result) as { isSuccess: boolean; result?: unknown }
      if (!fixture.errorHex && fixture.method === 'checkUpdateAppList') {
        const value = old.result as {
          status: string
          total: number
          list: {
            name: string
            desc: string
            lastVersion: string
            icon: string
            installDis: boolean
          }[]
        }
        old.result = {
          ...value,
          list: value.list.map(entry => ({
            name: entry.name,
            installedVersion: entry.installDis ? entry.desc.replace(/^version /, '') : null,
            latestVersion: entry.lastVersion.replace(/^version /, ''),
            icon: entry.icon
          }))
        }
      }
      const legacyError = old.result as { legacyError?: string } | undefined
      // Error preservation deliberately fixes the legacy applet-list TypeError.
      const preservedAppletError =
        fixture.errorHex &&
        ['checkUpdateAppList', 'getInstalledAppletList'].includes(fixture.method)
      expect(result).toEqual(
        preservedAppletError
          ? { isSuccess: false, result: 'device_not_connected' }
          : legacyError?.legacyError
            ? { isSuccess: false, result: legacyError.legacyError }
            : old
      )
    })
  }
})
it('ignores connector mock in packaged applications', () => {
  const options = {
    libraryPath: '/connector',
    platform: 'darwin' as const,
    isPackaged: true,
    mockPath: '/malicious/mock.cjs'
  }
  expect(allowedMockPath(options)).toBeUndefined()
  expect(allowedMockPath({ ...options, isPackaged: false })).toBe('/malicious/mock.cjs')
})
it('loads the mock only in development and never in packaged mode', () => {
  const options = {
    libraryPath: resolve('test/fixtures/absent-connector.dylib'),
    platform: 'darwin' as const,
    isPackaged: false,
    mockPath: resolve('test/fixtures/connector-mock.cjs')
  }
  const development = new ConnectorClient(options)
  expect(development.loadError).toBeNull()
  expect(development.callImKeyApi('request')).toBe('mock:request')
  const packaged = new ConnectorClient({ ...options, isPackaged: true })
  expect(packaged.loadError?.libraryPath).toBe(options.libraryPath)
  expect(() => packaged.callImKeyApi('request')).toThrow()
})
it('runs ten concurrent requests FIFO and preserves each response id', async () => {
  const executed: number[] = []
  let counter = 0
  const handlers = {
    getSeid: async () => {
      const i = counter++
      await Promise.resolve()
      executed.push(i)
      return { isSuccess: true as const, result: i }
    }
  } as Record<DeviceMethod, Handler>
  const queue = new DeviceQueue(handlers)
  const results = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      queue.dispatch({ id: i, method: 'getSeid', params: undefined })
    )
  )
  expect(executed).toEqual(Array.from({ length: 10 }, (_, i) => i))
  expect(results).toEqual(
    Array.from({ length: 10 }, (_, i) => ({ id: i, result: { isSuccess: true, result: i } }))
  )
})
it('binding failure immediately stops xpub retrieval', () => {
  let calls = 0
  const handlers = createDeviceHandlers(
    {
      callImKeyApi() {
        calls++
        return ''
      },
      getLastErrorMessage() {
        return '12146465766963655f6e6f745f636f6e6e6563746564'
      }
    },
    '/user'
  )
  expect(handlers.getBTCXpub('')).toEqual({ isSuccess: false, result: 'device_not_connected' })
  expect(calls).toBe(1)
})
it.each(['bound_other', 'unbound', '', 'unknown'])(
  'does not read wallet readiness when binding status is %s',
  status => {
    const requests: string[] = []
    const response = create(device, 'BindCheckRes', { setBindStatus: status })
    const handlers = createDeviceHandlers(
      {
        callImKeyApi(hex) {
          requests.push(invoke<string>(decode(api, 'ImkeyAction', hex), 'getMethod'))
          return Buffer.from(response.serializeBinary()).toString('hex')
        },
        getLastErrorMessage: () => ''
      },
      '/user'
    )
    expect(handlers.getBTCXpub()).toEqual({
      isSuccess: false,
      result: 'device_bind_check_failed'
    })
    expect(requests).toEqual(['bind_check'])
  }
)
it('reads wallet readiness only after confirming the current binding', () => {
  const requests: string[] = []
  const handlers = createDeviceHandlers(
    {
      callImKeyApi(hex) {
        const method = invoke<string>(decode(api, 'ImkeyAction', hex), 'getMethod')
        requests.push(method)
        const response =
          method === 'bind_check'
            ? create(device, 'BindCheckRes', { setBindStatus: 'bound_this' })
            : create(btc, 'BtcXpubRes', { setXpub: 'xpub-ready' })
        return Buffer.from(response.serializeBinary()).toString('hex')
      },
      getLastErrorMessage: () => ''
    },
    '/user'
  )
  expect(handlers.getBTCXpub()).toEqual({ isSuccess: true, result: 'xpub-ready' })
  expect(requests).toEqual(['bind_check', 'btc_get_xpub'])
})
it('preserves wallet readiness errors after confirming the current binding', () => {
  const requests: string[] = []
  const handlers = createDeviceHandlers(
    {
      callImKeyApi(hex) {
        const method = invoke<string>(decode(api, 'ImkeyAction', hex), 'getMethod')
        requests.push(method)
        return method === 'bind_check'
          ? Buffer.from(
              create(device, 'BindCheckRes', { setBindStatus: 'bound_this' }).serializeBinary()
            ).toString('hex')
          : ''
      },
      getLastErrorMessage: () =>
        requests.at(-1) === 'btc_get_xpub' ? 'imkey_wallet_not_created' : ''
    },
    '/user'
  )
  expect(handlers.getBTCXpub()).toEqual({
    isSuccess: false,
    result: 'imkey_wallet_not_created'
  })
  expect(requests).toEqual(['bind_check', 'btc_get_xpub'])
})
it('wallet registration collects failures and never reports false success', () => {
  let calls = 0
  const handlers = createDeviceHandlers(
    {
      callImKeyApi() {
        calls++
        return calls === 1 ? '0a023535' : ''
      },
      getLastErrorMessage() {
        return calls === 1 ? '' : '12146465766963655f6e6f745f636f6e6e6563746564'
      }
    },
    '/user'
  )
  expect(handlers.writeWalletAddress({ name: ['Bitcoin', 'Ethereum'], filePath: '' })).toEqual({
    isSuccess: false,
    result: 'device_not_connected',
    failed: ['Bitcoin', 'Ethereum']
  })
  expect(calls).toBe(3)
})
