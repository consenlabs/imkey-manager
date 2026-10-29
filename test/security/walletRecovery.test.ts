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
  deviceMock.mockImplementation(method => {
    if (method === 'getFirmwareRecovery') return Promise.resolve({ isSuccess: true, result: null })
    if (method === 'saveFirmwareRecovery' || method === 'clearFirmwareRecovery')
      return Promise.resolve({ isSuccess: true, result: undefined })
    return new Promise(resolve => pending.push({ method, resolve }))
  })
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
      firmware.state.bindCode = 'A2345678'
      const recovery = firmware.updateFirmware()
      await reply('connectDevice', { isSuccess: true, result: 'success' })
      await reply('getSeid', { isSuccess: true, result: 'test-device' })
      await reply('deviceBindCheck', { isSuccess: true, result: 'bound_this' })
      await reply('cosUpdate', { isSuccess: true, result: 'success' })
      await reply('isBLStatus', { isSuccess: true, result: false })
      await reply('getFirmwareVersion', { isSuccess: true, result: 'new' })
      await reply('getBleVersion', { isSuccess: true, result: 'ble-new' })
      await reply('cosCheckUpdate', { isSuccess: true, result: { isUpdateSuccess: true } })
      await reply('getUpgradeSeid', { isSuccess: true, result: 'test-device' })
      await reply('deviceBindAcquire', { isSuccess: true, result: 'success' })
      await reply('deviceBindCheck', { isSuccess: true, result: 'bound_this' })
      await reply('importBindCode', { isSuccess: true, result: undefined })
      await reply('getInstalledApplets', {
        isSuccess: true,
        result: { list: [{ name: 'Ethereum' }] }
      })
      await vi.waitFor(() =>
        expect(deviceMock.mock.calls.at(-1)?.slice(0, 2)).toEqual([
          'writeWalletAddress',
          {
            name: ['Ethereum'],
            filePath: '/test/'
          }
        ])
      )
      await reply('writeWalletAddress', { isSuccess: false, result: 'registration failed' })
      await recovery
      expect(device.isCosUpdate).toBe(true)
      expect(device.cosOldVersionData).toBe('old')
      expect(firmware.state.cosOldVersionData).toBe('old')
      expect(firmware.state.supportCode).toBe(3)
      expect(firmware.state.recovering).toBe(true)
      expect(firmware.state.errorStage).toBe('restore')
    })
    it(`${kind} does not report success when installed applications cannot be read after upgrading`, async () => {
      deviceMock.mockImplementation(async method => {
        if (method === 'getInstalledApplets')
          return { isSuccess: false, result: 'installed_apps_unavailable' }
        if (method === 'isBLStatus') return { isSuccess: true, result: false }
        if (method === 'cosCheckUpdate')
          return { isSuccess: true, result: { isUpdateSuccess: true } }
        return {
          isSuccess: true,
          result:
            method === 'getSeid' || method === 'getUpgradeSeid'
              ? 'test-device'
              : method === 'getFirmwareVersion'
                ? 'new'
                : method === 'getBleVersion'
                  ? 'ble-new'
                  : method === 'deviceBindCheck'
                    ? 'bound_this'
                    : method === 'importBindCode'
                      ? undefined
                      : 'success'
        }
      })
      const firmware = useFirmwareUpgrade(kind)
      Object.assign(firmware.state, {
        cosOldVersionData: 'old',
        cosNewVersionData: 'new',
        bindCode: 'A2345678'
      })
      await firmware.updateFirmware()
      expect(firmware.state.supportCode).toBe(3)
      expect(firmware.state.recovering).toBe(true)
      expect(firmware.state.errorStage).toBe('restore')
      expect(firmware.state.cosOldVersionData).toBe('old')
      expect(deviceMock.mock.calls.filter(([method]) => method === 'cosUpdate')).toHaveLength(1)
      expect(deviceMock.mock.calls.some(([method]) => method === 'writeWalletAddress')).toBe(false)
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
    await reply('isBLStatus', { isSuccess: true, result: false })
    await reply('getFirmwareVersion', { isSuccess: true, result: 'new' })
    await reply('getBleVersion', { isSuccess: true, result: 'new' })
    await reply('cosCheckUpdate', { isSuccess: true, result: { isUpdateSuccess: true } })
    await reply('getUpgradeSeid', { isSuccess: true, result: 'test-device' })
    await reply('deviceBindAcquire', { isSuccess: true, result: 'success' })
    await reply('deviceBindCheck', { isSuccess: true, result: 'bound_this' })
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
    const results: Record<string, unknown> = {
      deviceBindCheck: 'bound_this',
      getSeid: 'test-device',
      getUpgradeSeid: 'test-device',
      getFirmwareVersion: 'same',
      getBleVersion: 'new',
      isBLStatus: false,
      cosCheckUpdate: { isUpdateSuccess: true },
      getBTCXpub: 'xpub-ready',
      saveFirmwareRecovery: undefined,
      clearFirmwareRecovery: undefined
    }
    deviceMock.mockImplementation(async method => ({
      isSuccess: true,
      result: method in results ? results[method] : 'success'
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
      'saveFirmwareRecovery',
      'cosUpdate',
      'saveFirmwareRecovery',
      'isBLStatus',
      'getFirmwareVersion',
      'getBleVersion',
      'cosCheckUpdate',
      'deviceBindCheck',
      'getUpgradeSeid',
      'saveFirmwareRecovery',
      'deviceBindCheck',
      'isBLStatus',
      'getFirmwareVersion',
      'getBleVersion',
      'getUpgradeSeid',
      'cosCheckUpdate',
      'clearFirmwareRecovery',
      'getBTCXpub',
      'getUpgradeSeid'
    ])
    expect(firmware.state.supportCode).toBe(2)
    expect(useDeviceStore().installedBleVersion).toBe('new')
    expect(useDeviceStore().homeAuthorization).not.toBeNull()
  })
})

describe('firmware completion does not grant home access prematurely', () => {
  const successfulResults: Record<string, unknown> = {
    getSeid: 'test-device',
    getUpgradeSeid: 'test-device',
    deviceBindCheck: 'bound_this',
    getFirmwareVersion: 'new',
    getBleVersion: 'ble-new',
    getBTCXpub: 'xpub-ready',
    isBLStatus: false,
    cosCheckUpdate: { isLatest: true, isUpdateSuccess: true },
    getInstalledApplets: { list: [{ name: 'Ethereum' }] },
    saveFirmwareRecovery: undefined,
    clearFirmwareRecovery: undefined,
    importBindCode: undefined
  }

  it.each(['unbound', 'bound_other'])(
    'resumes a failed capture on the same %s device without requiring an already completed rebind',
    async bindingStatus => {
      let nativeDone = false
      let rebound = false
      let failCapture = true
      deviceMock.mockImplementation(async method => {
        if (method === 'cosUpdate') nativeDone = true
        if (method === 'deviceBindAcquire') rebound = true
        if (method === 'deviceBindCheck' && nativeDone && !rebound)
          return { isSuccess: true, result: bindingStatus }
        if (method === 'getFirmwareVersion') {
          if (failCapture) {
            failCapture = false
            return { isSuccess: false, result: 'firmware_read_unavailable' }
          }
          return { isSuccess: true, result: '1.9.11' }
        }
        if (method === 'cosCheckUpdate')
          return {
            isSuccess: true,
            result: { latestCosVersion: '1.9.12', isLatest: false, isUpdateSuccess: true }
          }
        return {
          isSuccess: true,
          result: method in successfulResults ? successfulResults[method] : 'success'
        }
      })
      const firmware = useFirmwareUpgrade('setting')
      const device = useDeviceStore()
      Object.assign(firmware.state, {
        cosOldVersionData: '1.9.10',
        cosNewVersionData: '1.9.12',
        bindCode: 'A2345678'
      })
      await firmware.updateFirmware()
      const session = device.sessionId
      expect(firmware.state.supportCode).toBe(3)
      expect(firmware.state.errorStage).toBe('check')
      expect(firmware.pendingRecoveryOptions()).toMatchObject({ requireBinding: false })
      expect(device.homeAuthorization).toBeNull()
      expect(deviceMock.mock.calls.some(([method]) => method === 'deviceBindAcquire')).toBe(false)
      await firmware.updateFirmware()
      expect(device.sessionId).toBe(session)
      expect(firmware.state.supportCode).toBe(2)
      expect(firmware.state.cosOldVersionData).toBe('1.9.11')
      expect(device.cosOldVersionData).toBe('1.9.11')
      expect(firmware.state.isCosUpdate).toBe(true)
      expect(device.homeAuthorization).not.toBeNull()
      expect(deviceMock.mock.calls.filter(([method]) => method === 'cosUpdate')).toHaveLength(1)
      expect(
        deviceMock.mock.calls.filter(([method]) => method === 'deviceBindAcquire')
      ).toHaveLength(1)
    }
  )

  it('rejects an observed unknown post-acquire binding state after retrying capture', async () => {
    let nativeDone = false
    let failCapture = true
    let acquired = false
    let unknownChecks = 0
    deviceMock.mockImplementation(async method => {
      if (method === 'cosUpdate') nativeDone = true
      if (method === 'deviceBindAcquire') acquired = true
      if (method === 'deviceBindCheck' && acquired) {
        unknownChecks += 1
        return { isSuccess: true, result: 'unknown' }
      }
      if (method === 'deviceBindCheck' && nativeDone) return { isSuccess: true, result: 'unbound' }
      if (method === 'getFirmwareVersion' && failCapture) {
        failCapture = false
        return { isSuccess: false, result: 'firmware_read_unavailable' }
      }
      return {
        isSuccess: true,
        result: method in successfulResults ? successfulResults[method] : 'success'
      }
    })
    const firmware = useFirmwareUpgrade('setting')
    Object.assign(firmware.state, {
      cosOldVersionData: 'old',
      cosNewVersionData: 'new',
      bindCode: 'A2345678'
    })
    await firmware.updateFirmware()
    expect(firmware.state.errorStage).toBe('check')
    expect(unknownChecks).toBe(0)
    await firmware.updateFirmware()
    expect(unknownChecks).toBe(1)
    expect(deviceMock.mock.calls.filter(([method]) => method === 'deviceBindAcquire')).toHaveLength(
      1
    )
    expect(deviceMock.mock.calls.filter(([method]) => method === 'cosUpdate')).toHaveLength(1)
    expect(firmware.state.supportCode).not.toBe(2)
    expect(useDeviceStore().homeAuthorization).toBeNull()
    for (const blocked of [
      'importBindCode',
      'writeWalletAddress',
      'clearFirmwareRecovery',
      'getBTCXpub'
    ])
      expect(deviceMock.mock.calls.some(([method]) => method === blocked)).toBe(false)
  })

  it.each([
    {
      method: 'saveFirmwareRecovery',
      result: { isSuccess: false, result: 'firmware_recovery_write_failed' },
      stage: 'store',
      blocked: 'cosUpdate'
    },
    {
      method: 'clearFirmwareRecovery',
      result: { isSuccess: false, result: 'firmware_recovery_write_failed' },
      stage: 'store',
      blocked: 'getBTCXpub'
    },
    {
      method: 'cosCheckUpdate',
      result: { isSuccess: false, result: 'remote_unavailable' },
      stage: 'check',
      blocked: 'clearFirmwareRecovery'
    },
    {
      method: 'cosCheckUpdate',
      result: { isSuccess: true, result: { isLatest: true, isUpdateSuccess: false } },
      stage: 'check',
      blocked: 'clearFirmwareRecovery'
    },
    {
      method: 'getBTCXpub',
      result: { isSuccess: false, result: 'wallet_unavailable' },
      stage: 'wallet',
      blocked: undefined
    }
  ])('blocks home when $method does not complete', async ({ method, result, stage, blocked }) => {
    deviceMock.mockImplementation(async called =>
      called === method
        ? (result as DeviceResult)
        : {
            isSuccess: true,
            result: called in successfulResults ? successfulResults[called] : 'success'
          }
    )
    const device = useDeviceStore()
    const firmware = useFirmwareUpgrade('setting')
    Object.assign(firmware.state, {
      cosOldVersionData: 'old',
      cosNewVersionData: 'new',
      bindCode: 'A2345678'
    })
    await firmware.updateFirmware()
    expect(firmware.state.supportCode).toBe(3)
    expect(firmware.state.errorStage).toBe(stage)
    expect(firmware.state.cosOldVersionData).toBe('old')
    expect(device.homeAuthorization).toBeNull()
    if (blocked) expect(deviceMock.mock.calls.some(([called]) => called === blocked)).toBe(false)
    for (const [called, params] of deviceMock.mock.calls)
      if (called === 'saveFirmwareRecovery')
        expect(JSON.stringify(params)).not.toContain('A2345678')
  })

  it.each(['unbound', 'bound_other'])(
    'does not grant home after acquire when binding becomes %s',
    async status => {
      let acquired = false
      deviceMock.mockImplementation(async method => {
        if (method === 'deviceBindAcquire') acquired = true
        if (method === 'deviceBindCheck' && acquired) return { isSuccess: true, result: status }
        return {
          isSuccess: true,
          result: method in successfulResults ? successfulResults[method] : 'success'
        }
      })
      const firmware = useFirmwareUpgrade('setting')
      Object.assign(firmware.state, {
        cosOldVersionData: 'old',
        cosNewVersionData: 'new',
        bindCode: 'A2345678'
      })
      await firmware.updateFirmware()
      expect(firmware.state.supportCode).not.toBe(2)
      expect(useDeviceStore().homeAuthorization).toBeNull()
      for (const blocked of [
        'importBindCode',
        'writeWalletAddress',
        'clearFirmwareRecovery',
        'getBTCXpub'
      ])
        expect(deviceMock.mock.calls.some(([method]) => method === blocked)).toBe(false)
    }
  )
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
  await reply('getBleVersion', { isSuccess: true, result: '2.0.0' })
  await reply('cosCheckUpdate', { isSuccess: false, result: 'device_not_connected' })
  await checking
  expect(firmware.state.supportCode).toBe(5)
})

it('empty latest COS version leaves manager app operations enabled', async () => {
  deviceMock.mockImplementation(async method =>
    method === 'getFirmwareVersion' || method === 'getBleVersion'
      ? { isSuccess: true, result: method === 'getFirmwareVersion' ? '1.0.0' : '2.0.0' }
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
