import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult } from '../../src/shared/deviceContract'
import type { callDevice } from '../../src/renderer/device'
import { refreshDeviceIdentity } from '../../src/renderer/composables/deviceIdentity'
import { useDeviceStore } from '../../src/renderer/store/device'

const call = vi.fn<(method: string) => Promise<DeviceResult>>()
beforeEach(() => {
  setActivePinia(createPinia())
  call.mockReset().mockImplementation(async method => ({
    isSuccess: true,
    result:
      method === 'getSeid' ? 'SEID-A' : method === 'deviceBindCheck' ? 'bound_this' : 'success'
  }))
})

it('publishes identity and binding together only after a completed identity check', async () => {
  const device = useDeviceStore()
  let release!: (value: DeviceResult) => void
  const normal = call.getMockImplementation()!
  call.mockImplementation(method =>
    method === 'deviceBindCheck'
      ? new Promise(resolve => {
          release = resolve
        })
      : normal(method)
  )
  const pending = refreshDeviceIdentity(call as typeof callDevice, device, () => true)
  await vi.waitFor(() => expect(release).toBeTypeOf('function'))
  expect(device.connectedSeid).toBe('')
  expect(device.bindStatus).toBe('')
  expect(device.identityReady).toBe(false)
  release({ isSuccess: true, result: 'bound_this' })
  expect(await pending).toEqual({ isSuccess: true, result: 'success' })
  expect(device.connectedSeid).toBe('SEID-A')
  expect(device.bindStatus).toBe('bound_this')
  expect(device.identityReady).toBe(true)
  expect(device.identityChecking).toBe(false)
})

it.each(['getSeid', 'deviceBindCheck'])(
  'does not let an obsolete pending %s overwrite a newer session',
  async delayedMethod => {
    const device = useDeviceStore()
    let release!: (value: DeviceResult) => void
    const normal = call.getMockImplementation()!
    call.mockImplementation(method =>
      method === delayedMethod
        ? new Promise(resolve => {
            release = resolve
          })
        : normal(method)
    )
    const pending = refreshDeviceIdentity(call as typeof callDevice, device, () => true)
    await vi.waitFor(() => expect(release).toBeTypeOf('function'))
    device.invalidateDeviceData()
    device.connectedSeid = 'SEID-B'
    device.bindStatus = 'bound_other'
    device.identityReady = true
    release({ isSuccess: true, result: delayedMethod === 'getSeid' ? 'SEID-A' : 'bound_this' })
    expect(await pending).toMatchObject({ isSuccess: false, code: 'OPERATION_CANCELLED' })
    expect(device.connectedSeid).toBe('SEID-B')
    expect(device.bindStatus).toBe('bound_other')
    expect(device.identityReady).toBe(true)
    expect(device.identityChecking).toBe(false)
  }
)

it('does not publish a completed query after its page scope is disposed', async () => {
  const device = useDeviceStore()
  let active = true
  let release!: (value: DeviceResult) => void
  const normal = call.getMockImplementation()!
  call.mockImplementation(method =>
    method === 'deviceBindCheck'
      ? new Promise(resolve => {
          release = resolve
        })
      : normal(method)
  )
  const pending = refreshDeviceIdentity(call as typeof callDevice, device, () => active)
  await vi.waitFor(() => expect(release).toBeTypeOf('function'))
  active = false
  release({ isSuccess: true, result: 'bound_this' })
  expect(await pending).toMatchObject({ isSuccess: false, code: 'OPERATION_CANCELLED' })
  expect(device.connectedSeid).toBe('')
  expect(device.bindStatus).toBe('')
  expect(device.identityReady).toBe(false)
})

it('invalidates stale verification and ends identity checking when the identity request throws', async () => {
  const device = useDeviceStore()
  device.installedBleVersion = 'previous-device-ble'
  device.cosOldVersionData = 'previous-device-firmware'
  device.isCosUpdate = true
  device.identityReady = true
  device.verification = {
    status: 'success',
    activationStatus: true,
    activatedAt: '2024-01-01',
    errorInfo: ''
  }
  call.mockRejectedValueOnce(new Error('USB unavailable'))
  expect(await refreshDeviceIdentity(call as typeof callDevice, device, () => true)).toEqual({
    isSuccess: false,
    result: 'USB unavailable'
  })
  expect(device.identityReady).toBe(false)
  expect(device.identityChecking).toBe(false)
  expect(device.verification.status).toBe('idle')
  expect(device.verification.activatedAt).toBeNull()
  expect(device.installedBleVersion).toBe('')
  expect(device.cosOldVersionData).toBe('')
  expect(device.isCosUpdate).toBe(false)
})

it('keeps confirmed information visible while a business identity check is pending', async () => {
  const device = useDeviceStore()
  device.connectedSeid = 'SEID-A'
  device.identityReady = true
  let release!: (value: DeviceResult) => void
  call.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        release = resolve
      })
  )
  const pending = refreshDeviceIdentity(call as typeof callDevice, device, () => true, {
    hideCachedData: false
  })
  expect(device.identityReady).toBe(true)
  expect(device.identityChecking).toBe(false)
  release({ isSuccess: true, result: 'success' })
  expect(await pending).toEqual({ isSuccess: true, result: 'success' })
  expect(device.identityReady).toBe(true)
})

it('still invalidates confirmed data when a business identity check finds a replacement', async () => {
  const device = useDeviceStore()
  device.connectedSeid = 'SEID-B'
  device.identityReady = true
  device.verification = {
    status: 'success',
    activationStatus: true,
    activatedAt: '2024-01-01',
    errorInfo: ''
  }
  expect(
    await refreshDeviceIdentity(call as typeof callDevice, device, () => true, {
      hideCachedData: false
    })
  ).toMatchObject({ isSuccess: false, result: 'device_session_changed' })
  expect(device.identityReady).toBe(false)
  expect(device.verification.status).toBe('idle')
})
