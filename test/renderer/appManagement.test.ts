import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useAppManagement } from '../../src/renderer/composables/useAppManagement'
import { appletView, filterApplets, toDeviceApplets } from '../../src/renderer/models/applets'
import { useDeviceStore } from '../../src/renderer/store/device'

const call = vi.hoisted(() => vi.fn<(method: string, params?: unknown) => Promise<DeviceResult>>())
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
    updateFirmwareWithinOperation: vi.fn()
  })
}))
vi.mock('vue', async importOriginal => ({
  ...(await importOriginal<typeof import('vue')>()),
  onMounted: vi.fn()
}))

beforeEach(() => {
  setActivePinia(createPinia())
  call.mockReset()
  call.mockImplementation(async method => ({
    isSuccess: true,
    result: method === 'downloadApplet' || method === 'updateApplet' ? [] : 'success'
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
        : { isSuccess: true, result: 'success' }
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
      result: method === 'downloadApplet' ? ['Kusama'] : 'success'
    }))
    const manager = useAppManagement()
    await manager.installApp(manager.apps.value[0])
    expect(call.mock.calls.map(([method]) => method)).toEqual([
      'connectDevice',
      'downloadApplet',
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
