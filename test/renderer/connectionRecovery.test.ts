import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useConnection } from '../../src/renderer/composables/useConnection'
import { useDeviceStore } from '../../src/renderer/store'

const mocks = vi.hoisted(() => ({ call: vi.fn(), push: vi.fn(), offer: vi.fn() }))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: mocks.offer })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: vi.fn(),
  onUnmounted: vi.fn()
}))
function response(method: string): DeviceResult {
  if (method === 'getFirmwareRecovery') return { isSuccess: true, result: null }
  const values: Record<string, unknown> = {
    connectDevice: 'success',
    isBLStatus: false,
    getSeid: 'original-device',
    checkUpdate: { status: 'latest', list: [] },
    cosCheckUpdate: { isUpdateSuccess: true },
    deviceBindCheck: 'bound_this',
    exportBindCode: 'A2345678',
    getBTCXpub: 'xpub-ready'
  }
  return { isSuccess: true, result: values[method] ?? 'success' }
}
beforeEach(() => {
  setActivePinia(createPinia())
  mocks.call.mockReset().mockImplementation(async (method: string) => response(method))
  mocks.push.mockReset().mockResolvedValue(undefined)
  mocks.offer.mockReset()
})
it.each([
  'device_not_connected',
  'imkey_pin_not_verified',
  'Invalid connector response for btc_get_xpub'
])('%s during wallet readiness remains retryable in the connection flow', async error => {
  mocks.call.mockImplementation(async (method: string) =>
    method === 'getBTCXpub' ? { isSuccess: false, result: error } : response(method)
  )
  const connection = useConnection()
  await connection.check()
  expect(connection.status.value).toBe(4)
  expect(mocks.push).not.toHaveBeenCalled()
  mocks.call.mockImplementation(async (method: string) => response(method))
  connection.changeState(1)
  await connection.check()
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/home/welcomeHome')
})
it('only the explicit wallet-not-created error enters wallet setup', async () => {
  mocks.call.mockImplementation(async (method: string) =>
    method === 'getBTCXpub'
      ? { isSuccess: false, result: 'imkey_wallet_not_created' }
      : response(method)
  )
  await useConnection().check()
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('imKeySetting')
})
it('invalid successful wallet data is an error rather than a request to create a wallet', async () => {
  mocks.call.mockImplementation(async (method: string) =>
    method === 'getBTCXpub' ? { isSuccess: true, result: 'invalid' } : response(method)
  )
  const connection = useConnection()
  await connection.check()
  expect(connection.status.value).toBe(4)
  expect(mocks.push).not.toHaveBeenCalled()
})
it('unreadable local binding data allows code entry instead of repeatedly entering home', async () => {
  mocks.call.mockImplementation(async (method: string) =>
    method === 'exportBindCode'
      ? { isSuccess: false, result: 'Invalid binding code file' }
      : response(method)
  )
  const connection = useConnection()
  await connection.check()
  expect(connection.status.value).toBe(7)
  expect(connection.errorInfo.value).toBe('Invalid binding code file')
  expect(mocks.call).not.toHaveBeenCalledWith('getBTCXpub', expect.anything(), expect.anything())
  expect(mocks.push).not.toHaveBeenCalled()
})
it('a missing binding file prompts for a code without a separate existence request', async () => {
  mocks.call.mockImplementation(async (method: string) =>
    method === 'exportBindCode'
      ? { isSuccess: false, result: 'binding_code_file_missing' }
      : response(method)
  )
  const connection = useConnection()
  await connection.check()
  expect(connection.status.value).toBe(7)
  expect(connection.errorInfo.value).toBe('')
  const methods = mocks.call.mock.calls.map(([method]) => method)
  expect(methods.filter(method => method === 'exportBindCode')).toHaveLength(1)
  expect(methods).not.toContain('isExistBindCodeFile')
  expect(methods).not.toContain('getBTCXpub')
})
it('a readable binding file enters home with one trusted read and no existence probe', async () => {
  await useConnection().check()
  const methods = mocks.call.mock.calls.map(([method]) => method)
  expect(methods.filter(method => method === 'exportBindCode')).toHaveLength(1)
  expect(methods).not.toContain('isExistBindCodeFile')
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/home/welcomeHome')
})
it('device identity failures while reading a binding file remain connection errors', async () => {
  mocks.call.mockImplementation(async (method: string) =>
    method === 'exportBindCode'
      ? {
          isSuccess: false,
          result: 'device_not_connected',
          code: 'BINDING_DEVICE_UNAVAILABLE'
        }
      : response(method)
  )
  const connection = useConnection()
  await connection.check()
  expect(connection.status.value).toBe(4)
  expect(connection.errorInfo.value).toBe('device_not_connected')
  expect(mocks.push).not.toHaveBeenCalled()
})
it('a native timeout offers an explicit retry without replaying the connection automatically', async () => {
  mocks.call.mockResolvedValue({ isSuccess: false, result: 'device_operation_timeout' })
  await useConnection().check()
  expect(mocks.call).toHaveBeenCalledOnce()
  expect(mocks.offer).toHaveBeenCalledOnce()
  expect(mocks.push).not.toHaveBeenCalled()
})

it.each([
  { isSuccess: false, result: 'device_bind_check_failed' },
  { isSuccess: false, result: 'device_not_connected' },
  { isSuccess: true, result: 'unknown' },
  { isSuccess: true, result: '' }
] as const)('binding response $result never authorizes home', async binding => {
  mocks.call.mockImplementation(async (method: string) =>
    method === 'deviceBindCheck' ? binding : response(method)
  )
  await useConnection().check()
  expect(useDeviceStore().canEnterHome).toBe(false)
  expect(mocks.push).not.toHaveBeenCalled()
  expect(mocks.call.mock.calls.map(([method]) => method)).not.toContain('getBTCXpub')
})

it.each([
  { isSuccess: false, result: 'imkey_tsm_device_update_check_fail' },
  { isSuccess: true, result: { isUpdateSuccess: undefined } },
  { isSuccess: true, result: { isUpdateSuccess: 'true' } }
])('a failed or invalid firmware query cannot fall back to the ordinary home flow', async cos => {
  mocks.call.mockImplementation(async (method: string) =>
    method === 'cosCheckUpdate' ? cos : response(method)
  )
  await useConnection().check()
  expect(useDeviceStore().canEnterHome).toBe(false)
  expect(mocks.push).not.toHaveBeenCalled()
  const methods = mocks.call.mock.calls.map(([method]) => method)
  expect(methods).not.toContain('checkUpdate')
  expect(methods).not.toContain('getBTCXpub')
})

it('only the explicit unactivated-device result enters setup from the firmware query', async () => {
  mocks.call.mockImplementation(async (method: string) =>
    method === 'cosCheckUpdate'
      ? { isSuccess: false, result: 'imkey_tsm_device_not_activated' }
      : response(method)
  )
  await useConnection().check()
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('imKeySetting')
  expect(useDeviceStore().canEnterHome).toBe(false)
})

it('confirms device identity again after the wallet read before granting home access', async () => {
  let walletRead = false
  mocks.call.mockImplementation(async (method: string) => {
    if (method === 'getBTCXpub') walletRead = true
    if (method === 'getSeid' && walletRead) return { isSuccess: true, result: 'replacement-device' }
    return response(method)
  })
  const connection = useConnection()
  await connection.check()
  expect(connection.errorInfo.value).toBe('device_session_changed')
  expect(mocks.push).not.toHaveBeenCalled()
  expect(useDeviceStore().canEnterHome).toBe(false)
})

it('grants home access only after successful firmware, binding, wallet, and final identity checks', async () => {
  await useConnection().check()
  expect(useDeviceStore().canEnterHome).toBe(true)
  expect(mocks.call.mock.calls.map(([method]) => method)).toEqual([
    'connectDevice',
    'isBLStatus',
    'getSeid',
    'getFirmwareRecovery',
    'cosCheckUpdate',
    'checkUpdate',
    'deviceBindCheck',
    'exportBindCode',
    'getBTCXpub',
    'getSeid'
  ])
})
