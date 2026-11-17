import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useAppManagement } from '../../src/renderer/composables/useAppManagement'
import { appletView, filterApplets, toDeviceApplets } from '../../src/renderer/models/applets'
import { useDeviceStore } from '../../src/renderer/store/device'

const call = vi.hoisted(() => vi.fn<(method: string, params?: unknown) => Promise<DeviceResult>>())
const recoverBeforeAppOperation = vi.hoisted(() =>
  vi.fn<() => Promise<'ready' | 'recovered' | 'failed'>>()
)
const pendingRecoveryOptions = vi.hoisted(() => vi.fn<() => object | undefined>())
const locale = vi.hoisted(() => ({ imkey: 'imKey 软件' }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: vi.fn(), returnToConnection: vi.fn() })
}))
vi.mock('../../src/renderer/composables/deviceSession', async original => ({
  ...(await original<typeof import('../../src/renderer/composables/deviceSession')>()),
  connectDeviceSession: (invoke: typeof call) => invoke('connectDevice')
}))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: () => locale.imkey })
}))
vi.mock('../../src/renderer/composables/useDeviceOperation', () => ({
  useDeviceOperation: () => ({
    call,
    active: () => true,
    run: (task: () => Promise<unknown>) => task()
  })
}))
vi.mock('../../src/renderer/composables/useFirmwareUpgrade', () => ({
  useFirmwareUpgrade: () => ({
    state: { cosUpdateStatus: '0', bindCode: '' },
    checkFirmwareVersion: vi.fn(),
    ensureFirmwareVersion: vi.fn(),
    updateFirmwareWithinOperation: vi.fn(),
    restoreCachedCheck: vi.fn(),
    recoverBeforeAppOperation,
    pendingRecoveryOptions
  })
}))
vi.mock('vue', async importOriginal => ({
  ...(await importOriginal<typeof import('vue')>()),
  onMounted: vi.fn()
}))

beforeEach(() => {
  setActivePinia(createPinia())
  useDeviceStore().connectedSeid = 'success'
  recoverBeforeAppOperation.mockReset().mockResolvedValue('ready')
  pendingRecoveryOptions.mockReset().mockReturnValue(undefined)
  call.mockReset()
  call.mockImplementation(async method => ({
    isSuccess: true,
    result:
      method === 'downloadApplet' || method === 'updateApplet'
        ? []
        : method === 'getBTCXpub'
          ? 'xpub-ready'
          : 'success'
  }))
})
function catalog(name: string, current: string | null = null) {
  return { id: name, name, installedVersion: current, latestVersion: '1.0', icon: '' }
}
describe('canonical app identity and presentation state', () => {
  it('adds stable identity to domain values without UI flags', () => {
    const [entry] = toDeviceApplets([
      { name: 'IMK', installedVersion: '0.9', latestVersion: '1.0', icon: 'logo' }
    ])
    expect(entry).toEqual({
      id: 'IMK',
      name: 'IMK',
      installedVersion: '0.9',
      latestVersion: '1.0',
      icon: 'logo'
    })
    expect(appletView(entry, 'imKey Software').displayName).toBe('imKey Software')
    expect(entry.name).toBe('IMK')
  })
  it('treats brackets, parentheses, plus and slash as literal search text', () => {
    const entries = ['Alpha', 'Beta[+](x)/', 'Gamma'].map(name =>
      appletView(catalog(name), 'imKey Software')
    )
    for (const query of ['[', '(', '+', '/', 'beta[+](X)']) {
      expect(filterApplets(entries, query).map(entry => entry.id)).toEqual(['Beta[+](x)/'])
    }
  })
  it('displays and searches Vaulta while retaining the EOS applet identity', () => {
    const entry = appletView(catalog('EOS', '1.0'), 'imKey Software')
    expect(entry).toMatchObject({
      id: 'EOS',
      name: 'EOS',
      displayName: 'A (Vaulta)',
      desc: 'version 1.0'
    })
    for (const query of ['EOS', 'vaulta', 'A (Vaulta)']) {
      expect(filterApplets([entry], query)).toEqual([entry])
    }
  })
  it.each(['install', 'update'] as const)(
    'uses the EOS identity for Vaulta %s and address registration',
    async operation => {
      const device = useDeviceStore()
      device.apps = [catalog('EOS', operation === 'update' ? '0.9' : null)]
      call.mockImplementation(async method => ({
        isSuccess: true,
        result:
          method === 'downloadApplet' || method === 'updateApplet'
            ? ['EOS']
            : method === 'getBTCXpub'
              ? 'xpub-ready'
              : 'success'
      }))
      const manager = useAppManagement()
      if (operation === 'install') await manager.installApp(manager.apps.value[0])
      else await manager.updateApp(manager.apps.value[0])
      expect(call).toHaveBeenCalledWith(
        operation === 'install' ? 'downloadApplet' : 'updateApplet',
        'EOS'
      )
      expect(call).toHaveBeenCalledWith('writeWalletAddress', { name: ['EOS'], filePath: '' })
    }
  )
  it('filtered index zero installs the selected stable identity, not the first app', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Alpha'), catalog('Beta')]
    const manager = useAppManagement()
    manager.state.appName = 'Beta'
    await manager.installApp(manager.getApps.value[0])
    expect(call).toHaveBeenCalledWith('downloadApplet', 'Beta')
    expect(device.apps[0].installedVersion).toBeNull()
    expect(device.apps[1].installedVersion).toBe('1.0')
    expect(Object.keys(device.apps[1])).not.toContain('installLoading')
  })
  it('a deletion failure restores the confirmed installed state and permits retry', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Beta', '1.0')]
    call.mockImplementation(async method =>
      method === 'deleteApplet'
        ? { isSuccess: false, result: 'device_not_connected' }
        : {
            isSuccess: true,
            result: method === 'getBTCXpub' ? 'xpub-ready' : 'success'
          }
    )
    const manager = useAppManagement()
    await manager.deleteApp(manager.apps.value[0])
    expect(device.apps[0].installedVersion).toBe('1.0')
    expect(manager.apps.value[0]).toMatchObject({
      installed: true,
      deleteDis: false,
      deleteLoading: false
    })
    expect(manager.state).toMatchObject({
      tip: true,
      errorInfo: 'device_not_connected',
      errorStage: 'app'
    })
  })
  it('installation finishes after registering the requested addresses without prefetching other chains', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Kusama')]
    call.mockImplementation(async method => ({
      isSuccess: true,
      result:
        method === 'downloadApplet'
          ? ['Kusama']
          : method === 'getBTCXpub'
            ? 'xpub-ready'
            : 'success'
    }))
    const manager = useAppManagement()
    await manager.installApp(manager.apps.value[0])
    expect(call.mock.calls.map(([method]) => method)).toEqual([
      'connectDevice',
      'getBTCXpub',
      'getSeid',
      'downloadApplet',
      'getBTCXpub',
      'getSeid',
      'writeWalletAddress'
    ])
    expect(call).toHaveBeenCalledWith('writeWalletAddress', { name: ['Kusama'], filePath: '' })
    expect(device.apps[0].installedVersion).toBe('1.0')
  })
  it('reopening with another locale derives the display name without changing connector identity', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('IMK', '1.0')]
    device.isFirstGoToManagerPage = false
    locale.imkey = 'imKey 软件'
    const first = useAppManagement()
    expect(first.apps.value[0].displayName).toBe('imKey 软件')
    locale.imkey = 'imKey Software'
    const second = useAppManagement()
    await second.init()
    expect(second.state.errorInfo).toBe('')
    expect(second.apps.value[0].displayName).toBe('imKey Software')
    expect(device.apps[0].name).toBe('IMK')
    await second.updateApp(second.apps.value[0])
    expect(call).toHaveBeenCalledWith('updateApplet', 'IMK')
  })
})

describe('application operations and firmware recovery', () => {
  it('continues the selected installation after completing firmware recovery', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Polkadot')]
    recoverBeforeAppOperation.mockResolvedValue('recovered')
    call.mockImplementation(async method => ({
      isSuccess: true,
      result:
        method === 'checkUpdate'
          ? { list: [{ name: 'Polkadot', installedVersion: null, latestVersion: '2.0', icon: '' }] }
          : method === 'downloadApplet'
            ? ['Polkadot']
            : method === 'getBTCXpub'
              ? 'xpub-ready'
              : 'success'
    }))
    const manager = useAppManagement()
    await manager.installApp(manager.apps.value[0])
    expect(call.mock.calls.map(([method]) => method)).toEqual([
      'checkUpdate',
      'connectDevice',
      'getBTCXpub',
      'getSeid',
      'downloadApplet',
      'getBTCXpub',
      'getSeid',
      'writeWalletAddress'
    ])
    expect(call).toHaveBeenCalledWith('downloadApplet', 'Polkadot')
    expect(device.apps[0].installedVersion).toBe('2.0')
  })

  it('continues the original installation after recovery fails and the user retries', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Polkadot')]
    pendingRecoveryOptions.mockReturnValue({})
    recoverBeforeAppOperation.mockResolvedValueOnce('failed').mockResolvedValueOnce('recovered')
    call.mockImplementation(async method => ({
      isSuccess: true,
      result:
        method === 'checkUpdate'
          ? { list: [{ name: 'Polkadot', installedVersion: null, latestVersion: '2.0', icon: '' }] }
          : method === 'downloadApplet'
            ? ['Polkadot']
            : method === 'getBTCXpub'
              ? 'xpub-ready'
              : 'success'
    }))
    const manager = useAppManagement()
    await manager.installApp(manager.apps.value[0])
    expect(call).not.toHaveBeenCalledWith('downloadApplet', 'Polkadot')
    await manager.retryFirmwareRecovery()
    expect(call).toHaveBeenCalledWith('downloadApplet', 'Polkadot')
    expect(device.apps[0].installedVersion).toBe('2.0')
  })

  it('refreshes the app catalog after recovery when there is no pending app action', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Polkadot', '0.9')]
    recoverBeforeAppOperation.mockResolvedValue('recovered')
    call.mockImplementation(async method => ({
      isSuccess: true,
      result:
        method === 'checkUpdate'
          ? {
              list: [{ name: 'Polkadot', installedVersion: '1.0', latestVersion: '1.0', icon: '' }]
            }
          : method === 'getBTCXpub'
            ? 'xpub-ready'
            : 'success'
    }))
    const manager = useAppManagement()
    await manager.retryFirmwareRecovery()
    expect(device.apps[0].installedVersion).toBe('1.0')
    expect(call.mock.calls.map(([method]) => method)).toEqual(['checkUpdate'])
  })
  it('continues the installation after a recovery preflight error is retried', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Polkadot')]
    pendingRecoveryOptions.mockReturnValue({})
    recoverBeforeAppOperation
      .mockRejectedValueOnce({ isSuccess: false, result: 'binding_code_file_missing' })
      .mockResolvedValueOnce('recovered')
    call.mockImplementation(async method => ({
      isSuccess: true,
      result:
        method === 'checkUpdate'
          ? { list: [{ name: 'Polkadot', installedVersion: null, latestVersion: '2.0', icon: '' }] }
          : method === 'downloadApplet'
            ? ['Polkadot']
            : method === 'getBTCXpub'
              ? 'xpub-ready'
              : 'success'
    }))
    const manager = useAppManagement()
    await manager.installApp(manager.apps.value[0])
    expect(manager.state.errorInfo).toBe('binding_code_file_missing')
    manager.ok()
    await manager.retryFirmwareRecovery()
    expect(call).toHaveBeenCalledWith('downloadApplet', 'Polkadot')
    expect(device.apps[0].installedVersion).toBe('2.0')
  })

  it('retries the catalog before installing when the first post-recovery refresh failed', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Polkadot')]
    recoverBeforeAppOperation.mockResolvedValueOnce('recovered').mockResolvedValueOnce('ready')
    let catalogCalls = 0
    call.mockImplementation(async method => {
      if (method === 'checkUpdate') {
        if (++catalogCalls === 1) return { isSuccess: false, result: 'catalog_unavailable' }
        return {
          isSuccess: true,
          result: {
            list: [{ name: 'Polkadot', installedVersion: null, latestVersion: '2.0', icon: '' }]
          }
        }
      }
      return {
        isSuccess: true,
        result:
          method === 'downloadApplet'
            ? ['Polkadot']
            : method === 'getBTCXpub'
              ? 'xpub-ready'
              : 'success'
      }
    })
    const manager = useAppManagement()
    await manager.installApp(manager.apps.value[0])
    expect(manager.state.errorInfo).toBe('catalog_unavailable')
    expect(call).not.toHaveBeenCalledWith('downloadApplet', 'Polkadot')
    manager.ok()
    await manager.installApp(manager.apps.value[0])
    expect(catalogCalls).toBe(2)
    expect(call).toHaveBeenCalledWith('downloadApplet', 'Polkadot')
    expect(device.apps[0].installedVersion).toBe('2.0')
  })

  it('refreshes the catalog on page reentry if the post-recovery refresh failed', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Polkadot')]
    device.isFirstGoToManagerPage = false
    recoverBeforeAppOperation.mockResolvedValue('recovered')
    let catalogCalls = 0
    call.mockImplementation(async method => {
      if (method === 'checkUpdate') {
        if (++catalogCalls === 1) return { isSuccess: false, result: 'catalog_unavailable' }
        return {
          isSuccess: true,
          result: {
            list: [{ name: 'Polkadot', installedVersion: '1.0', latestVersion: '2.0', icon: '' }]
          }
        }
      }
      return {
        isSuccess: true,
        result: method === 'getBTCXpub' ? 'xpub-ready' : 'success'
      }
    })
    const first = useAppManagement()
    await first.installApp(first.apps.value[0])
    expect(first.state.errorInfo).toBe('catalog_unavailable')
    const reopened = useAppManagement()
    await reopened.init()
    expect(catalogCalls).toBe(2)
    expect(device.apps[0].installedVersion).toBe('1.0')
    expect(call).not.toHaveBeenCalledWith('downloadApplet', 'Polkadot')
  })

  it('does not install an app when firmware recovery fails', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Polkadot')]
    recoverBeforeAppOperation.mockResolvedValue('failed')
    const manager = useAppManagement()
    await manager.installApp(manager.apps.value[0])
    expect(call).not.toHaveBeenCalledWith('downloadApplet', 'Polkadot')
    expect(device.apps[0].installedVersion).toBeNull()
  })

  it('surfaces a failed recovery check without starting an app operation', async () => {
    const device = useDeviceStore()
    device.apps = [catalog('Polkadot')]
    recoverBeforeAppOperation.mockRejectedValue({ isSuccess: false, result: 'check_failed' })
    const manager = useAppManagement()
    await manager.installApp(manager.apps.value[0])
    expect(manager.state).toMatchObject({ tip: true, errorInfo: 'check_failed' })
    expect(call).not.toHaveBeenCalledWith('downloadApplet', 'Polkadot')
  })
})
