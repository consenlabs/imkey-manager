import { beforeEach, expect, it, vi } from 'vitest'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useSecureCheck } from '../../src/renderer/composables/useSecureCheck'
import { createDeviceOperation } from '../../src/renderer/composables/useDeviceOperation'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string) => Promise<DeviceResult>>(),
  unmounted: [] as (() => void)[]
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  getCurrentInstance: () => ({}),
  onUnmounted: (callback: () => void) => mocks.unmounted.push(callback)
}))
beforeEach(() => {
  mocks.call.mockReset().mockResolvedValue({ isSuccess: true, result: 'success' })
  mocks.unmounted.length = 0
})

it('starts idle and checks only after a successful connection', async () => {
  const check = useSecureCheck()
  expect(check.state).toEqual({ status: 'idle', errorInfo: '' })
  await check.check()
  expect(mocks.call.mock.calls.map(([method]) => method)).toEqual(['connectDevice', 'checkDevice'])
  expect(check.state).toEqual({ status: 'success', errorInfo: '' })
})

it.each([
  { isSuccess: false as const, result: 'device_not_connected' },
  { isSuccess: true as const, result: 'device_not_connected' }
])('does not check after an unsuccessful connection result: %j', async response => {
  mocks.call.mockResolvedValueOnce(response)
  const check = useSecureCheck()
  await check.check()
  expect(check.state).toEqual({ status: 'failed', errorInfo: 'device_not_connected' })
  expect(mocks.call).toHaveBeenCalledTimes(1)
})

it('preserves an illegal device error and allows retry', async () => {
  mocks.call.mockResolvedValueOnce({ isSuccess: true, result: 'success' })
  mocks.call.mockResolvedValueOnce({ isSuccess: false, result: 'imkey_tsm_device_illegal' })
  const check = useSecureCheck()
  await check.check()
  expect(check.state).toEqual({ status: 'failed', errorInfo: 'imkey_tsm_device_illegal' })
  await check.check()
  expect(check.state).toEqual({ status: 'success', errorInfo: '' })
})

it('disables repeated triggers while queued and while checking', async () => {
  const other = createDeviceOperation()
  let release!: () => void
  const queued = other.run(
    () =>
      new Promise<void>(resolve => {
        release = resolve
      })
  )
  await Promise.resolve()
  const check = useSecureCheck()
  const first = check.check()
  expect(check.state.status).toBe('checking')
  await check.check()
  expect(mocks.call).not.toHaveBeenCalled()
  let finish!: (value: DeviceResult) => void
  mocks.call.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve
      })
  )
  release()
  await queued
  await vi.waitFor(() => expect(mocks.call).toHaveBeenCalledOnce())
  await check.check()
  expect(mocks.call).toHaveBeenCalledOnce()
  finish({ isSuccess: true, result: 'success' })
  await first
  expect(mocks.call).toHaveBeenCalledTimes(2)
  expect(check.state.status).toBe('success')
})

it('does not start secure checking after unmount during connection', async () => {
  let finish!: (value: DeviceResult) => void
  mocks.call.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve
      })
  )
  const check = useSecureCheck()
  const pending = check.check()
  await Promise.resolve()
  mocks.unmounted.forEach(callback => callback())
  finish({ isSuccess: true, result: 'success' })
  await pending
  expect(mocks.call).toHaveBeenCalledOnce()
  expect(check.state.status).toBe('checking')
})

it('shows thrown errors without leaving checking active', async () => {
  mocks.call.mockRejectedValueOnce(new Error('network unavailable'))
  const check = useSecureCheck()
  await check.check()
  expect(check.state).toEqual({ status: 'failed', errorInfo: 'network unavailable' })
})
