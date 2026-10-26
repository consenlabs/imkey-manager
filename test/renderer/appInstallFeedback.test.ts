import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useAppManagement } from '../../src/renderer/composables/useAppManagement'
import { createDeviceOperation } from '../../src/renderer/composables/useDeviceOperation'
import { useDeviceStore } from '../../src/renderer/store/device'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string, params?: unknown) => Promise<DeviceResult>>(),
  offer: vi.fn(),
  firmware: {
    state: { cosUpdateStatus: '0', bindCode: '' },
    checkFirmwareVersion: vi.fn(),
    updateFirmwareWithinOperation: vi.fn()
  }
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: mocks.offer })
}))
vi.mock('../../src/renderer/composables/useFirmwareUpgrade', () => ({
  useFirmwareUpgrade: () => mocks.firmware
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: vi.fn()
}))

const releases: (() => void)[] = []
function gate<T>(value: T) {
  let release!: () => void
  const promise = new Promise<T>(resolve => {
    release = () => resolve(value)
  })
  releases.push(release)
  return { promise, release }
}
function response(method: string): DeviceResult {
  const values: Record<string, unknown> = {
    getSeid: 'device-A',
    deviceBindCheck: 'bound_this',
    downloadApplet: ['Nervos'],
    updateApplet: ['Nervos']
  }
  return { isSuccess: true, result: values[method] ?? 'success' }
}
beforeEach(() => {
  setActivePinia(createPinia())
  const device = useDeviceStore()
  device.connectedSeid = 'device-A'
  device.apps = [
    { id: 'Nervos', name: 'Nervos', installedVersion: null, latestVersion: '1.0', icon: '' }
  ]
  mocks.call.mockReset().mockImplementation(async method => response(method))
  mocks.offer.mockReset()
  mocks.firmware.state.cosUpdateStatus = '0'
  mocks.firmware.updateFirmwareWithinOperation.mockReset()
})
afterEach(async () => {
  releases.splice(0).forEach(release => release())
  await createDeviceOperation().run(async () => {})
})

it.each(['install', 'update'] as const)(
  '%s shows feedback immediately while queued and suppresses repeated clicks',
  async kind => {
    if (kind === 'update') useDeviceStore().apps[0].installedVersion = '0.9'
    const blocker = gate(undefined)
    const previous = createDeviceOperation().run(() => blocker.promise)
    const manager = useAppManagement()
    const item = manager.apps.value[0]
    const action = kind === 'install' ? manager.installApp : manager.updateApp
    const pending = action(item)
    expect(manager.apps.value[0]).toMatchObject({
      installLoading: kind === 'install',
      updateLoading: kind === 'update',
      installDis: true,
      updateDis: true
    })
    expect(mocks.call).not.toHaveBeenCalled()
    await action(item)
    blocker.release()
    await Promise.all([previous, pending])
    expect(mocks.call.mock.calls.map(([method]) => method)).toEqual([
      'connectDevice',
      'getSeid',
      'deviceBindCheck',
      kind === 'install' ? 'downloadApplet' : 'updateApplet',
      'writeWalletAddress'
    ])
    expect(mocks.call.mock.calls.find(([method]) => method === 'writeWalletAddress')?.[1]).toEqual({
      name: ['Nervos'],
      filePath: ''
    })
    expect(manager.apps.value[0]).toMatchObject({
      installed: true,
      installLoading: false,
      updateLoading: false
    })
  }
)

it.each(['connectDevice', 'getSeid', 'deviceBindCheck', 'downloadApplet', 'writeWalletAddress'])(
  '%s failure releases feedback and allows another explicit attempt',
  async failedMethod => {
    const waiting = gate<DeviceResult>({ isSuccess: false, result: 'device_not_connected' })
    let failed = false
    mocks.call.mockImplementation(async method => {
      if (method === failedMethod && !failed) {
        failed = true
        return waiting.promise
      }
      return response(method)
    })
    const manager = useAppManagement()
    const pending = manager.installApp(manager.apps.value[0])
    expect(manager.apps.value[0].installLoading).toBe(true)
    await vi.waitFor(() => expect(failed).toBe(true))
    expect(manager.apps.value[0].installLoading).toBe(true)
    expect(manager.apps.value[0].installed).toBe(false)
    waiting.release()
    await pending
    expect(manager.apps.value[0]).toMatchObject({
      installLoading: false,
      installDis: false,
      installed: false
    })
    if (['connectDevice', 'getSeid', 'deviceBindCheck'].includes(failedMethod))
      expect(mocks.call.mock.calls.some(([method]) => method === 'downloadApplet')).toBe(false)
    manager.ok()
    await manager.installApp(manager.apps.value[0])
    expect(manager.apps.value[0].installed).toBe(true)
  }
)

it('keeps feedback active until address registration completes', async () => {
  const registration = gate(response('writeWalletAddress'))
  mocks.call.mockImplementation(async method =>
    method === 'writeWalletAddress' ? registration.promise : response(method)
  )
  const manager = useAppManagement()
  const pending = manager.installApp(manager.apps.value[0])
  await vi.waitFor(() =>
    expect(mocks.call.mock.calls.some(([method]) => method === 'writeWalletAddress')).toBe(true)
  )
  expect(manager.apps.value[0]).toMatchObject({ installed: false, installLoading: true })
  expect(useDeviceStore().apps[0].installedVersion).toBeNull()
  registration.release()
  await pending
  expect(manager.apps.value[0]).toMatchObject({ installed: true, installLoading: false })
})

it('preserves the firmware branch and clears feedback when it finishes', async () => {
  mocks.firmware.state.cosUpdateStatus = '1'
  const firmware = gate(undefined)
  mocks.firmware.updateFirmwareWithinOperation.mockReturnValue(firmware.promise)
  const manager = useAppManagement()
  const pending = manager.installApp(manager.apps.value[0])
  expect(manager.apps.value[0].installLoading).toBe(true)
  await vi.waitFor(() =>
    expect(mocks.firmware.updateFirmwareWithinOperation).toHaveBeenCalledOnce()
  )
  expect(mocks.call).not.toHaveBeenCalled()
  firmware.release()
  await pending
  expect(manager.apps.value[0].installLoading).toBe(false)
  expect(useDeviceStore().apps[0].installedVersion).toBeNull()
})
