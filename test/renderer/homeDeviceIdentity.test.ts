import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useHomeDeviceIdentity } from '../../src/renderer/composables/useHomeDeviceIdentity'
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
  useDeviceRecovery: () => ({ offer: mocks.offer })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  getCurrentInstance: () => ({}),
  onMounted: (callback: () => unknown) => mocks.mounted.push(callback),
  onUnmounted: (callback: () => void) => mocks.unmounted.push(callback)
}))

let seid: string
let binding: string
beforeEach(() => {
  setActivePinia(createPinia())
  const device = useDeviceStore()
  device.connectedSeid = 'SEID-A'
  device.bindStatus = 'bound_this'
  device.identityReady = true
  device.verification = {
    status: 'success',
    activationStatus: true,
    activatedAt: '2024-02-29',
    errorInfo: ''
  }
  seid = 'SEID-A'
  binding = 'bound_this'
  mocks.call.mockReset().mockImplementation(async method => {
    if (method === 'getSeid') return { isSuccess: true, result: seid }
    if (method === 'deviceBindCheck') return { isSuccess: true, result: binding }
    return { isSuccess: true, result: 'success' }
  })
  mocks.offer.mockReset()
  mocks.mounted.length = mocks.unmounted.length = 0
})

it('hides the cached result until the same connected and bound device is confirmed', async () => {
  let finish!: (value: DeviceResult) => void
  mocks.call.mockImplementationOnce(() => new Promise(resolve => (finish = resolve)))
  const identity = useHomeDeviceIdentity()
  expect(identity.ready.value).toBe(false)
  expect(identity.checking.value).toBe(true)
  mocks.mounted.forEach(callback => callback())
  await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
  expect(identity.ready.value).toBe(false)
  finish({ isSuccess: true, result: 'success' })
  await vi.waitFor(() => expect(identity.ready.value).toBe(true))
  expect(identity.checking.value).toBe(false)
  expect(mocks.call.mock.calls.map(([method]) => method)).toEqual([
    'connectDevice',
    'getSeid',
    'deviceBindCheck'
  ])
  expect(useDeviceStore().verification.status).toBe('success')
})

it.each(['different device', 'unbound', 'disconnected'])(
  'does not expose a previous pass after %s',
  async scenario => {
    if (scenario === 'different device') seid = 'SEID-B'
    if (scenario === 'unbound') binding = 'unbound'
    if (scenario === 'disconnected')
      mocks.call.mockResolvedValueOnce({ isSuccess: false, result: 'device_not_connected' })
    const identity = useHomeDeviceIdentity()
    await identity.confirm()
    expect(identity.ready.value).toBe(false)
    expect(identity.checking.value).toBe(false)
    expect(useDeviceStore().verification.status).toBe('idle')
    expect(mocks.offer).toHaveBeenCalledOnce()
    expect(mocks.call.mock.calls.map(([method]) => method)).not.toContain('checkDevice')
  }
)

it('can retry a failed identity check without automatically checking authenticity', async () => {
  mocks.call.mockResolvedValueOnce({ isSuccess: false, result: 'device_not_connected' })
  const identity = useHomeDeviceIdentity()
  await identity.confirm()
  expect(identity.ready.value).toBe(false)
  await identity.confirm()
  expect(identity.ready.value).toBe(true)
  expect(mocks.call.mock.calls.map(([method]) => method)).not.toContain('checkDevice')
})

it('does not perform a queued check or leave global checking state on unmount', async () => {
  let release!: () => void
  const operation = createDeviceOperation()
  const queued = operation.run(() => new Promise<void>(resolve => (release = resolve)))
  await Promise.resolve()
  const identity = useHomeDeviceIdentity()
  const pending = identity.confirm()
  mocks.unmounted.forEach(callback => callback())
  release()
  await queued
  await pending
  expect(mocks.call).not.toHaveBeenCalled()
  expect(useDeviceStore().identityChecking).toBe(false)
  expect(identity.ready.value).toBe(false)
})

it('ignores a late connection response after the page is unmounted', async () => {
  let finish!: (value: DeviceResult) => void
  mocks.call.mockImplementationOnce(() => new Promise(resolve => (finish = resolve)))
  const identity = useHomeDeviceIdentity()
  const pending = identity.confirm()
  await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
  mocks.unmounted.forEach(callback => callback())
  finish({ isSuccess: true, result: 'success' })
  await pending
  expect(mocks.call).toHaveBeenCalledOnce()
  expect(identity.ready.value).toBe(false)
  expect(useDeviceStore().identityChecking).toBe(false)
  expect(mocks.offer).not.toHaveBeenCalled()
})
