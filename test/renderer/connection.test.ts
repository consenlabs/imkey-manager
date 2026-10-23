import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useConnection } from '../../src/renderer/composables/useConnection'
import { failureCode } from '../../src/shared/deviceErrors'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string) => Promise<DeviceResult>>(),
  push: vi.fn()
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: vi.fn(),
  onUnmounted: vi.fn()
}))
beforeEach(() => {
  setActivePinia(createPinia())
  mocks.call.mockReset()
  mocks.push.mockReset()
})
function pendingCalls() {
  const pending: { method: string; resolve: (result: DeviceResult) => void }[] = []
  mocks.call.mockImplementation(method => new Promise(resolve => pending.push({ method, resolve })))
  async function reply(method: string, result: DeviceResult) {
    await vi.waitFor(() => expect(pending[0]?.method).toBe(method))
    pending.shift()!.resolve(result)
    await Promise.resolve()
    await Promise.resolve()
  }
  return { reply }
}
it('waits for connection and all version checks before marking firmware complete', async () => {
  const { reply } = pendingCalls()
  const flow = useConnection()
  const checking = flow.check()
  await vi.waitFor(() => expect(flow.status.value).toBe(8))
  expect(flow.checkFirmwareUpgrade.value).toBe(1)
  expect(mocks.call.mock.calls.map(([method]) => method)).toEqual(['connectDevice'])
  await reply('connectDevice', { isSuccess: true, result: 'success' })
  await reply('isBLStatus', { isSuccess: true, result: false })
  expect(flow.checkFirmwareUpgrade.value).toBe(2)
  expect(flow.checkDeviceBindingCode.value).toBe(1)
  await reply('checkUpdate', { isSuccess: true, result: { status: 'latest', list: [] } })
  expect(flow.checkFirmwareUpgrade.value).toBe(2)
  expect(flow.checkDeviceBindingCode.value).toBe(1)
  // A repeated click must not reset the running progress.
  flow.check()
  expect(flow.checkFirmwareUpgrade.value).toBe(2)
  await reply('cosCheckUpdate', { isSuccess: true, result: { isUpdateSuccess: true } })
  expect(flow.checkFirmwareUpgrade.value).toBe(3)
  expect(flow.checkDeviceBindingCode.value).toBe(2)
  expect(flow.checkPinAndWallet.value).toBe(1)
  await reply('deviceBindCheck', { isSuccess: false, result: 'device_not_connected' })
  await checking
  await vi.waitFor(() => expect(flow.status.value).toBe(4))
  expect(flow.errorStage.value).toBe('bind')
})
it('stops on a TSM version-query rejection before binding or wallet calls, then permits retry', async () => {
  const { reply } = pendingCalls()
  const flow = useConnection()
  const checking = flow.check()
  await reply('connectDevice', { isSuccess: true, result: 'success' })
  await reply('isBLStatus', { isSuccess: true, result: false })
  await reply('checkUpdate', {
    isSuccess: false,
    result: 'imkey_tsm_device_illegal',
    operationId: 'test-query'
  })
  await checking
  await vi.waitFor(() => expect(flow.status.value).toBe(4))
  expect(flow.errorStage.value).toBe('check')
  expect(flow.errorInfo.value).toBe('imkey_tsm_device_illegal [test-query]')
  expect(flow.checkFirmwareUpgrade.value).toBe(2)
  expect(flow.checkDeviceBindingCode.value).toBe(1)
  expect(flow.checkPinAndWallet.value).toBe(1)
  expect(mocks.call.mock.calls.map(([method]) => method)).toEqual([
    'connectDevice',
    'isBLStatus',
    'checkUpdate'
  ])
  flow.changeState(1)
  const retry = flow.check()
  await reply('connectDevice', { isSuccess: false, result: 'device_not_connected' })
  await retry
  await vi.waitFor(() => expect(flow.errorInfo.value).toBe('device_not_connected'))
  expect(flow.errorStage.value).toBe('connect')
  expect(flow.checkFirmwareUpgrade.value).toBe(1)
})
it('gives the exact TSM rejection a safe diagnostic code', () => {
  expect(failureCode('imkey_tsm_device_illegal')).toBe('TSM_DEVICE_ILLEGAL')
  expect(failureCode('imkey_tsm_device_illegal private-data')).toBe('DEVICE_OPERATION_FAILED')
})
