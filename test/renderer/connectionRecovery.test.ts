import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useConnection } from '../../src/renderer/composables/useConnection'

const mocks = vi.hoisted(() => ({ call: vi.fn(), push: vi.fn(), offer: vi.fn() }))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: mocks.offer })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: vi.fn(),
  onUnmounted: vi.fn()
}))
function response(method: string): DeviceResult {
  const values: Record<string, unknown> = {
    connectDevice: 'success',
    isBLStatus: false,
    getSeid: 'original-device',
    checkUpdate: { status: 'latest', list: [] },
    cosCheckUpdate: { isUpdateSuccess: true },
    deviceBindCheck: 'bound_this',
    isExistBindCodeFile: true,
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
  expect(mocks.call).not.toHaveBeenCalledWith('getBTCXpub', expect.anything(), expect.anything())
  expect(mocks.push).not.toHaveBeenCalled()
})
it('a native timeout offers an explicit retry without replaying the connection automatically', async () => {
  mocks.call.mockResolvedValue({ isSuccess: false, result: 'device_operation_timeout' })
  await useConnection().check()
  expect(mocks.call).toHaveBeenCalledOnce()
  expect(mocks.offer).toHaveBeenCalledOnce()
  expect(mocks.push).not.toHaveBeenCalled()
})
