import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useSecureCheck } from '../../src/renderer/composables/useSecureCheck'
import { createDeviceOperation } from '../../src/renderer/composables/useDeviceOperation'
import { useDeviceStore } from '../../src/renderer/store/device'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string) => Promise<DeviceResult>>(),
  offer: vi.fn(),
  mounted: [] as (() => unknown)[],
  unmounted: [] as (() => void)[]
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: mocks.offer, returnToConnection: vi.fn() })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  getCurrentInstance: () => ({}),
  onMounted: (callback: () => unknown) => mocks.mounted.push(callback),
  onUnmounted: (callback: () => void) => mocks.unmounted.push(callback)
}))
let seid: string
let metadata: DeviceResult
function methods() {
  return mocks.call.mock.calls.map(([method]) => method)
}
function createCheck() {
  return useSecureCheck()
}
beforeEach(() => {
  setActivePinia(createPinia())
  seid = 'SEID-A'
  metadata = {
    isSuccess: true,
    result: { snCheckResult: true, isActivate: true, activateTime: '2024-02-29' }
  }
  mocks.call.mockReset().mockImplementation(async method => {
    if (method === 'getSeid') return { isSuccess: true, result: seid }
    if (method === 'deviceBindCheck') return { isSuccess: true, result: 'bound_this' }
    if (method === 'deviceSnCheck') return metadata
    return { isSuccess: true, result: 'success' }
  })
  mocks.offer.mockReset()
  mocks.mounted.length = mocks.unmounted.length = 0
})

it('enters unverified without mounting any automatic device work', async () => {
  const check = useSecureCheck()
  expect(check.state.status).toBe('idle')
  expect(check.state.identityChecking).toBe(false)
  expect(mocks.call).not.toHaveBeenCalled()
  for (const mounted of mocks.mounted) await mounted()
  expect(methods()).toEqual([])
  expect(check.state.status).toBe('idle')
  expect(check.state.identityChecking).toBe(false)
})

it('verifies authenticity and SN metadata, then confirms identity before publishing', async () => {
  const check = createCheck()
  await check.check()
  expect(methods()).toEqual([
    'connectDevice',
    'getSeid',
    'deviceBindCheck',
    'checkDevice',
    'deviceSnCheck',
    'connectDevice',
    'getSeid',
    'deviceBindCheck'
  ])
  expect(check.state).toMatchObject({
    status: 'success',
    activationStatus: true,
    activatedAt: '2024-02-29',
    errorInfo: ''
  })
})

it('shares the last verified result between page consumers without new mount queries', async () => {
  const home = createCheck()
  await home.check()
  const details = createCheck()
  expect(details.state.status).toBe('success')
  useDeviceStore().prepareIdentityCheck()
  expect(home.state.status).toBe('success')
  expect(details.state.activatedAt).toBe('2024-02-29')
  for (const mounted of mocks.mounted) await mounted()
  expect(details.state.status).toBe('success')
  expect(home.state.activatedAt).toBe('2024-02-29')
  expect(methods().filter(method => method === 'checkDevice')).toHaveLength(1)
})

it.each([
  { isSuccess: false as const, result: 'device_not_connected' },
  { isSuccess: true as const, result: 'device_not_connected' }
])('does not verify following an unsuccessful connection: %j', async response => {
  mocks.call.mockResolvedValueOnce(response)
  const check = createCheck()
  await check.check()
  expect(check.state.status).toBe('idle')
  expect(check.state.errorInfo).toBe('device_not_connected')
  expect(mocks.call).toHaveBeenCalledTimes(1)
  expect(mocks.offer).toHaveBeenCalledOnce()
})

it('clears an earlier pass when rechecking fails and allows an explicit retry', async () => {
  const check = createCheck()
  await check.check()
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(async method =>
    method === 'checkDevice'
      ? { isSuccess: false, result: 'imkey_tsm_device_illegal' }
      : normal(method)
  )
  await check.check()
  expect(check.state).toMatchObject({
    status: 'idle',
    activationStatus: null,
    activatedAt: null,
    errorInfo: 'imkey_tsm_device_illegal'
  })
  expect(mocks.offer).toHaveBeenLastCalledWith(
    expect.objectContaining({ result: 'imkey_tsm_device_illegal' }),
    expect.any(Function),
    { reconnectOnly: false }
  )
  mocks.call.mockImplementation(normal)
  await check.check()
  expect(check.state.status).toBe('success')
  expect(check.state.errorInfo).toBe('')
})

it.each([
  { snCheckResult: true, isActivate: true, activateTime: '' },
  { snCheckResult: true, isActivate: false, activateTime: '' }
])('keeps missing activation dates empty and supports unactivated metadata: %j', async result => {
  metadata = { isSuccess: true, result }
  const check = createCheck()
  await check.check()
  expect(check.state.status).toBe('success')
  expect(check.state.activationStatus).toBe(result.isActivate)
  expect(check.state.activatedAt).toBeNull()
})

it.each([
  { isSuccess: false as const, result: 'imkey_tsm_device_sn_check_invalid_response' },
  {
    isSuccess: true as const,
    result: { snCheckResult: false, isActivate: false, activateTime: '' }
  }
])('does not publish a pass when SN metadata is rejected: %j', async result => {
  metadata = result
  const check = createCheck()
  await check.check()
  expect(check.state.status).toBe('idle')
  expect(check.state.activationStatus).toBeNull()
  expect(mocks.offer).toHaveBeenCalledOnce()
})

it('disables repeated triggers across both page consumers while queued and while checking', async () => {
  const other = createDeviceOperation()
  let release!: () => void
  const queued = other.run(
    () =>
      new Promise<void>(resolve => {
        release = resolve
      })
  )
  await Promise.resolve()
  const check = createCheck()
  const otherPage = createCheck()
  const first = check.check()
  expect(check.state.status).toBe('checking')
  await otherPage.check()
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
  await otherPage.check()
  expect(mocks.call).toHaveBeenCalledOnce()
  finish({ isSuccess: true, result: 'success' })
  await first
  expect(check.state.status).toBe('success')
  expect(methods().filter(method => method === 'checkDevice')).toHaveLength(1)
})

it('discards a pending result when a newer device session invalidates it', async () => {
  let finish!: (value: DeviceResult) => void
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(method =>
    method === 'deviceSnCheck'
      ? new Promise(resolve => {
          finish = resolve
        })
      : normal(method)
  )
  const check = createCheck()
  const pending = check.check()
  await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
  useDeviceStore().invalidateDeviceData()
  finish(metadata)
  await pending
  expect(check.state.status).toBe('idle')
  expect(check.state.activationStatus).toBeNull()
  expect(mocks.offer).not.toHaveBeenCalled()
})

it('rejects a device replaced during the server checks', async () => {
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(async method => {
    if (method === 'deviceSnCheck') seid = 'SEID-B'
    return normal(method)
  })
  const check = createCheck()
  await check.check()
  expect(check.state.status).toBe('idle')
  expect(check.state.errorInfo).toBe('device_session_changed')
  expect(mocks.offer).toHaveBeenLastCalledWith(expect.anything(), expect.any(Function), {
    reconnectOnly: true
  })
})

it('does not start secure checking after unmount during connection', async () => {
  let finish!: (value: DeviceResult) => void
  mocks.call.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve
      })
  )
  const check = createCheck()
  const pending = check.check()
  await Promise.resolve()
  mocks.unmounted.forEach(callback => callback())
  finish({ isSuccess: true, result: 'success' })
  await pending
  expect(mocks.call).toHaveBeenCalledOnce()
  expect(check.state.status).toBe('idle')
})

it('shows thrown errors without leaving checking active', async () => {
  mocks.call.mockRejectedValueOnce(new Error('network unavailable'))
  const check = createCheck()
  await check.check()
  expect(check.state.status).toBe('idle')
  expect(check.state.errorInfo).toBe('network unavailable')
})

it('clears identity and verification if an explicit verification identity query throws', async () => {
  const check = createCheck()
  await check.check()
  const device = useDeviceStore()
  expect(device.verification.status).toBe('success')
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(method =>
    method === 'getSeid' ? Promise.reject(new Error('identity unavailable')) : normal(method)
  )
  await check.check()
  expect(device.identityReady).toBe(false)
  expect(device.identityChecking).toBe(false)
  expect(check.state.status).toBe('idle')
  expect(check.state.activationStatus).toBeNull()
  expect(check.state.errorInfo).toBe('identity unavailable')
  expect(mocks.offer).toHaveBeenCalledOnce()
})
