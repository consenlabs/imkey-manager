import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect, it, vi } from 'vitest'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useAppManagement } from '../../src/renderer/composables/useAppManagement'
import { useDeviceStore } from '../../src/renderer/store/device'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string, params?: unknown) => Promise<DeviceResult>>(),
  offer: vi.fn()
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: mocks.offer })
}))
vi.mock('../../src/renderer/composables/useFirmwareUpgrade', () => ({
  useFirmwareUpgrade: () => ({
    state: { cosUpdateStatus: '0' },
    checkFirmwareVersion: vi.fn(),
    ensureFirmwareVersion: vi.fn(),
    updateFirmwareWithinOperation: vi.fn()
  })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: vi.fn()
}))

let seid: string
let binding: string
let installedVersion: string | null
let registrationFailed: boolean
function catalog() {
  return { name: 'Ethereum', installedVersion, latestVersion: '1.0', icon: '' }
}
function methods() {
  return mocks.call.mock.calls.map(([method]) => method)
}
beforeEach(() => {
  setActivePinia(createPinia())
  seid = 'device-A'
  binding = 'bound_this'
  installedVersion = null
  registrationFailed = false
  const device = useDeviceStore()
  device.connectedSeid = seid
  device.identityReady = true
  device.apps = [{ id: 'Ethereum', ...catalog() }]
  mocks.offer.mockReset()
  mocks.call.mockReset().mockImplementation(async method => {
    if (method === 'getSeid') return { isSuccess: true, result: seid }
    if (method === 'deviceBindCheck') return { isSuccess: true, result: binding }
    if (method === 'downloadApplet' || method === 'updateApplet') {
      installedVersion = '1.0'
      return { isSuccess: true, result: ['Bitcoin', 'Ethereum', 'Ethereum'] }
    }
    if (method === 'checkUpdate') return { isSuccess: true, result: { list: [catalog()] } }
    if (method === 'writeWalletAddress' && !registrationFailed) {
      registrationFailed = true
      return { isSuccess: false, result: 'registration_failed', failed: ['Ethereum'] }
    }
    return { isSuccess: true, result: 'success' }
  })
})

it.each(['install', 'update'] as const)(
  '%s retries only failed addresses after checking identity and actual installed version',
  async kind => {
    if (kind === 'update') {
      installedVersion = '0.9'
      useDeviceStore().apps[0].installedVersion = installedVersion
    }
    const manager = useAppManagement()
    const action = kind === 'install' ? manager.installApp : manager.updateApp
    await action(manager.apps.value[0])
    expect(manager.state.errorStage).toBe('restore')
    expect(manager.apps.value[0].installed).toBe(false)
    expect(mocks.call).toHaveBeenCalledWith(
      'writeWalletAddress',
      { name: ['Bitcoin', 'Ethereum'], filePath: '' },
      expect.anything()
    )
    mocks.call.mockClear()
    manager.ok()
    await action(manager.apps.value[0])
    expect(methods()).toEqual([
      'connectDevice',
      'getSeid',
      'deviceBindCheck',
      'checkUpdate',
      'connectDevice',
      'getSeid',
      'deviceBindCheck',
      'writeWalletAddress'
    ])
    expect(mocks.call).toHaveBeenLastCalledWith(
      'writeWalletAddress',
      { name: ['Ethereum'], filePath: '' },
      expect.anything()
    )
    expect(manager.apps.value[0].installed).toBe(true)
  }
)

it('retains the restore stage across a page revisit even after refreshing the installed catalog', async () => {
  const first = useAppManagement()
  await first.installApp(first.apps.value[0])
  const second = useAppManagement()
  await second.init()
  expect(second.state.errorInfo).toBe('')
  expect(mocks.offer).not.toHaveBeenCalled()
  expect(useDeviceStore().apps[0].installedVersion).toBe('1.0')
  expect(second.apps.value[0].installDis).toBe(false)
  mocks.call.mockClear()
  await second.installApp(second.apps.value[0])
  expect(methods()).not.toContain('downloadApplet')
  expect(methods()).not.toContain('exportBindCode')
  expect(second.apps.value[0].installed).toBe(true)
})

it.each(['identity', 'binding', 'during-version-read'])(
  'blocks a pending address restore after %s changes without repeating the download',
  async changed => {
    const manager = useAppManagement()
    await manager.installApp(manager.apps.value[0])
    if (changed === 'identity') seid = 'device-B'
    if (changed === 'binding') binding = 'bound_other'
    if (changed === 'during-version-read') {
      const normal = mocks.call.getMockImplementation()!
      mocks.call.mockImplementation(async (method, params) => {
        const response = await normal(method, params)
        if (method === 'checkUpdate') seid = 'device-B'
        return response
      })
    }
    mocks.call.mockClear()
    await manager.installApp(manager.apps.value[0])
    expect(methods()).not.toContain('downloadApplet')
    expect(methods()).not.toContain('writeWalletAddress')
    expect(useDeviceStore().apps).toEqual([])
    expect(mocks.offer).toHaveBeenCalledWith(expect.anything(), expect.any(Function), {
      reconnectOnly: true
    })
  }
)

it('requires a fresh connection when the installed application no longer matches the completed download', async () => {
  const manager = useAppManagement()
  await manager.installApp(manager.apps.value[0])
  installedVersion = '0.9'
  mocks.call.mockClear()
  await manager.installApp(manager.apps.value[0])
  expect(methods()).not.toContain('downloadApplet')
  expect(methods()).not.toContain('writeWalletAddress')
  expect(mocks.offer).toHaveBeenCalledWith(
    'device_session_restart_required',
    expect.any(Function),
    { reconnectOnly: true }
  )
})

it('keeps the restore stage when checking the installed version fails', async () => {
  const manager = useAppManagement()
  await manager.installApp(manager.apps.value[0])
  const normal = mocks.call.getMockImplementation()!
  mocks.call.mockImplementation(async (method, params) =>
    method === 'checkUpdate'
      ? { isSuccess: false, result: 'catalog_unavailable' }
      : normal(method, params)
  )
  mocks.call.mockClear()
  await manager.installApp(manager.apps.value[0])
  expect(methods()).not.toContain('downloadApplet')
  expect(methods()).not.toContain('writeWalletAddress')
  mocks.call.mockImplementation(normal).mockClear()
  await manager.installApp(manager.apps.value[0])
  expect(methods()).not.toContain('downloadApplet')
  expect(methods()).toContain('writeWalletAddress')
  expect(manager.apps.value[0].installed).toBe(true)
})

it('does not read a binding code while entering the application page', async () => {
  const manager = useAppManagement()
  await manager.init()
  expect(manager.state.errorInfo).toBe('')
  expect(mocks.offer).not.toHaveBeenCalled()
  expect(methods()).not.toContain('exportBindCode')
  expect(methods()).toContain('checkUpdate')
})

it('sends cloneable plain IPC parameters on the initial operation and partial retry', async () => {
  const normal = mocks.call.getMockImplementation()!
  const addressPayloads: unknown[] = []
  mocks.call.mockImplementation(async (method, params) => {
    const cloned = structuredClone(params)
    if (method === 'writeWalletAddress') addressPayloads.push(cloned)
    return normal(method, cloned)
  })
  const manager = useAppManagement()
  await manager.installApp(manager.apps.value[0])
  expect(manager.state.errorInfo).toContain('registration_failed')
  manager.ok()
  await manager.installApp(manager.apps.value[0])
  expect(manager.state.errorInfo).toBe('')
  expect(manager.apps.value[0].installed).toBe(true)
  expect(addressPayloads).toEqual([
    { name: ['Bitcoin', 'Ethereum'], filePath: '' },
    { name: ['Ethereum'], filePath: '' }
  ])
  expect(methods().filter(method => method === 'downloadApplet')).toHaveLength(1)
})

it.each(['reset', 'invalidate'])(
  'discards a pending restore after session %s even when SEID and application version are unchanged',
  async change => {
    const first = useAppManagement()
    await first.installApp(first.apps.value[0])
    const device = useDeviceStore()
    const oldSession = device.sessionId
    if (change === 'reset') device.$reset()
    else device.invalidateDeviceData()
    expect(device.sessionId).not.toBe(oldSession)
    Object.assign(device, {
      connectedSeid: seid,
      identityReady: true,
      bindStatus: 'bound_this',
      apps: [{ id: 'Ethereum', ...catalog() }]
    })
    const second = useAppManagement()
    expect(second.apps.value[0].installed).toBe(true)
    device.apps[0].installedVersion = '0.9'
    mocks.call.mockClear()
    await second.updateApp(second.apps.value[0])
    expect(methods()).toContain('updateApplet')
    expect(methods()).not.toContain('checkUpdate')
    expect(mocks.call).toHaveBeenCalledWith(
      'writeWalletAddress',
      { name: ['Bitcoin', 'Ethereum'], filePath: '' },
      expect.anything()
    )
    expect(second.apps.value[0].installed).toBe(true)
  }
)
