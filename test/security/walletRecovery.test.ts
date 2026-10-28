import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useAppManagement } from '../../src/renderer/composables/useAppManagement'
import { useFirmwareUpgrade } from '../../src/renderer/composables/useFirmwareUpgrade'
import { useAppStore } from '../../src/renderer/store/app'
import { useDeviceStore } from '../../src/renderer/store/device'
import { toDeviceApplets } from '../../src/renderer/models/applets'

const deviceMock = vi.hoisted(() =>
  vi.fn<(method: string, params?: unknown) => Promise<DeviceResult>>()
)
vi.mock('../../src/renderer/device', () => ({ callDevice: deviceMock }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: vi.fn() })
}))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: () => 'imKey' })
}))
vi.mock('vue', async importOriginal => ({
  ...(await importOriginal<typeof import('vue')>()),
  onMounted: vi.fn()
}))

beforeEach(() => {
  setActivePinia(createPinia())
  useAppStore().userPath = '/test/'
  deviceMock.mockReset()
})
function pendingCalls() {
  const pending: { method: string; resolve: (value: DeviceResult) => void }[] = []
  deviceMock.mockImplementation(method => new Promise(resolve => pending.push({ method, resolve })))
  async function reply(method: string, result: DeviceResult) {
    await vi.waitFor(() =>
      expect(
        pending.some(request => request.method === method),
        `pending ${method}`
      ).toBe(true)
    )
    const index = pending.findIndex(request => request.method === method)
    pending.splice(index, 1)[0].resolve(result)
    await Promise.resolve()
    await Promise.resolve()
  }
  return { reply }
}
describe('firmware address recovery preserves failure state', () => {
  for (const kind of ['setting', 'manager'] as const) {
    it(`${kind} reports failure and retains the previous COS version`, async () => {
      const { reply } = pendingCalls()
      const firmware = useFirmwareUpgrade(kind)
      const device = useDeviceStore()
      device.isCosUpdate = true
      device.cosOldVersionData = 'old'
      firmware.state.cosOldVersionData = 'old'
      firmware.state.cosNewVersionData = 'new'
      const recovery = firmware.cosUpdateWalletAddress()
      await reply('getInstalledApplets', {
        isSuccess: true,
        result: { list: [{ name: 'Ethereum' }] }
      })
      expect(deviceMock.mock.calls.at(-1)?.slice(0, 2)).toEqual([
        'writeWalletAddress',
        {
          name: ['Ethereum'],
          filePath: '/test/'
        }
      ])
      await reply('writeWalletAddress', { isSuccess: false, result: 'registration failed' })
      await recovery
      expect(device.isCosUpdate).toBe(true)
      expect(device.cosOldVersionData).toBe('old')
      expect(firmware.state.cosOldVersionData).toBe('old')
      expect(firmware.state.supportCode).toBe(3)
    })
  }
  it('COS and BLE updates wait for address registration before completion', async () => {
    const { reply } = pendingCalls()
    const firmware = useFirmwareUpgrade('setting')
    Object.assign(firmware.state, {
      cosOldVersionData: 'old',
      cosNewVersionData: 'new',
      bleOldVersionData: 'old',
      bleNewVersionData: 'new',
      bindCode: 'A2345678'
    })
    const upgrade = firmware.updateFirmware()
    await reply('connectDevice', { isSuccess: true, result: 'success' })
    await reply('getSeid', { isSuccess: true, result: 'test-device' })
    await reply('deviceBindCheck', { isSuccess: true, result: 'bound_this' })
    await reply('cosUpdate', { isSuccess: true, result: 'success' })
    await reply('deviceBindAcquire', { isSuccess: true, result: 'success' })
    await reply('importBindCode', { isSuccess: true, result: undefined })
    await reply('getInstalledApplets', {
      isSuccess: true,
      result: { list: [{ name: 'Ethereum' }] }
    })
    expect(firmware.state.supportCode).toBe(1)
    await reply('writeWalletAddress', { isSuccess: false, result: 'registration failed' })
    await upgrade
    expect(firmware.state.supportCode).toBe(3)
  })
  it('BLE-only updates do not bind or register addresses', async () => {
    deviceMock.mockImplementation(async method => ({
      isSuccess: true,
      result:
        method === 'deviceBindCheck'
          ? 'bound_this'
          : method === 'getSeid'
            ? 'test-device'
            : 'success'
    }))
    const firmware = useFirmwareUpgrade('setting')
    Object.assign(firmware.state, {
      cosOldVersionData: 'same',
      cosNewVersionData: 'same',
      bleOldVersionData: 'old',
      bleNewVersionData: 'new'
    })
    await firmware.updateFirmware()
    expect(deviceMock.mock.calls.map(([method]) => method)).toEqual([
      'connectDevice',
      'getSeid',
      'deviceBindCheck',
      'cosUpdate'
    ])
    expect(firmware.state.supportCode).toBe(2)
    expect(useDeviceStore().installedBleVersion).toBe('new')
  })
})
it('manager stops update spinner and enables retry after address registration failure', async () => {
  const { reply } = pendingCalls()
  const manager = useAppManagement()
  const app = {
    name: 'Ethereum',
    desc: '',
    lastVersion: 'new',
    id: 0,
    icon: '',
    updateLoading: false,
    installLoading: false,
    updateDis: false,
    installDis: true,
    installed: false,
    deleteDis: true,
    deleteLoading: false
  }
  useDeviceStore().apps = toDeviceApplets([
    { name: app.name, installedVersion: 'old', latestVersion: app.lastVersion, icon: app.icon }
  ])
  const update = manager.updateApp(manager.apps.value[0])
  await reply('connectDevice', { isSuccess: true, result: 'success' })
  await reply('getSeid', { isSuccess: true, result: 'test-device' })
  await reply('deviceBindCheck', { isSuccess: true, result: 'bound_this' })
  expect(manager.apps.value[0].updateLoading).toBe(true)
  await reply('updateApplet', { isSuccess: true, result: ['Ethereum'] })
  await reply('writeWalletAddress', { isSuccess: false, result: 'registration failed' })
  await update
  expect(manager.apps.value[0].updateLoading).toBe(false)
  expect(manager.apps.value[0].updateDis).toBe(false)
  expect(manager.apps.value[0].installed).toBe(false)
  expect(manager.state.tip).toBe(true)
})

it('settings becomes ready before the update check and keeps its loading-error dialog', async () => {
  const { reply } = pendingCalls()
  const firmware = useFirmwareUpgrade('setting')
  const ready = vi.fn()
  const checking = firmware.checkFirmwareVersion(ready)
  await reply('getFirmwareVersion', { isSuccess: true, result: '1.0.0' })
  expect(ready).toHaveBeenCalledOnce()
  await reply('cosCheckUpdate', { isSuccess: false, result: 'device_not_connected' })
  await checking
  expect(firmware.state.supportCode).toBe(5)
})

it('empty latest COS version leaves manager app operations enabled', async () => {
  deviceMock.mockImplementation(async method =>
    method === 'getFirmwareVersion'
      ? { isSuccess: true, result: '1.0.0' }
      : {
          isSuccess: true,
          result: {
            latestCosVersion: '',
            latestBleVersion: '',
            isLatest: true,
            isUpdateSuccess: false,
            updateType: '',
            description: ''
          }
        }
  )
  const firmware = useFirmwareUpgrade('manager')
  await firmware.checkFirmwareVersion()
  expect(firmware.state.isCosUpdate).toBe(false)
  expect(firmware.state.cosUpdateStatus).toBe('0')
})
