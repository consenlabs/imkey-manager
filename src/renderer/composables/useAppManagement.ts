import { computed, onMounted, reactive, watch } from 'vue'
import constants from '../../common/constants'
import { useAppStore } from '../store/app'
import { useDeviceStore } from '../store/device'
import {
  appletView,
  filterApplets,
  toDeviceApplets,
  type AppletView,
  type AppOperation
} from '../models/applets'
import { useDeviceOperation } from './useDeviceOperation'
import { useFirmwareUpgrade } from './useFirmwareUpgrade'
import { useTranslation } from './useTranslation'
import { operationError } from './operationError'
import { isSessionRecoveryError } from './deviceSession'
import { refreshDeviceIdentity } from './deviceIdentity'
import { useDeviceRecovery } from './useDeviceRecovery'
import { checkWalletReadiness } from './walletReadiness'
import type { WalletChain } from '../../shared/deviceContract'

interface PendingAddressRestore {
  sessionId: number
  seid: string
  version: string
  previousVersion: string | null
  addresses: WalletChain[]
}
// Keep completed downloads across page visits, but never reuse them for another device.
const addressRestores = new WeakMap<object, Map<string, PendingAddressRestore>>()
// A completed firmware recovery may have reinstalled applications. Keep this
// marker until the refreshed catalog succeeds, even across page visits.
const recoveryCatalogRefresh = new WeakMap<object, number>()

export function useAppManagement() {
  const device = useDeviceStore()
  const app = useAppStore()
  const { t } = useTranslation()
  const scope = useDeviceOperation()
  const call = scope.call
  const recovery = useDeviceRecovery(scope)
  const firmware = useFirmwareUpgrade('manager', scope)
  const state = reactive({ tip: false, appName: '', errorInfo: '', errorStage: '' })
  const operations = reactive<Record<string, AppOperation | undefined>>({})
  let pendingFirmwareAction: { sessionId: number; resume: () => Promise<unknown> } | undefined
  let pendingRestores = addressRestores.get(device)
  if (!pendingRestores) {
    pendingRestores = reactive(new Map<string, PendingAddressRestore>())
    addressRestores.set(device, pendingRestores)
  }
  const restores = pendingRestores
  for (const [id, pending] of restores)
    if (pending.sessionId !== device.sessionId) restores.delete(id)
  watch(
    () => device.sessionId,
    () => {
      restores.clear()
      pendingFirmwareAction = undefined
      recoveryCatalogRefresh.delete(device)
    },
    { flush: 'sync' }
  )
  function pendingRestore(id: string) {
    const pending = restores.get(id)
    return pending?.sessionId === device.sessionId &&
      pending.seid.toUpperCase() === device.connectedSeid.toUpperCase()
      ? pending
      : undefined
  }
  const apps = computed(() =>
    device.apps.map(entry => {
      const pending = pendingRestore(entry.id)
      return appletView(
        pending ? { ...entry, installedVersion: pending.previousVersion } : entry,
        t('m.imKeyManager.imKey_soft'),
        operations[entry.id]
      )
    })
  )
  const getApps = computed(() => filterApplets(apps.value, state.appName))
  function fail(
    error: unknown,
    stage: string,
    binding = false,
    retry: () => Promise<unknown> = init
  ) {
    if (!scope.active() || (error as { code?: string })?.code === 'OPERATION_CANCELLED') return
    if (isChanged(error)) restores.clear()
    if (
      isChanged(error) &&
      (device.identityReady || device.apps.length || device.verification.status !== 'idle')
    )
      device.invalidateDeviceData()
    state.errorInfo = operationError(error)
    state.errorStage = stage
    if (binding || isSessionRecoveryError(error) || stage === 'connect') {
      recovery.offer(error, device.identityReady ? retry : init, {
        reconnectOnly: binding || isChanged(error)
      })
      return
    }
    state.tip = true
  }
  function isChanged(error: unknown): boolean {
    const result = typeof error === 'string' ? error : (error as { result?: unknown })?.result
    return result === 'device_session_changed' || result === 'device_bind_check_failed'
  }
  function ok() {
    state.tip = false
    state.errorInfo = ''
    state.errorStage = ''
  }
  async function walletReady(
    current: () => boolean,
    retry: () => Promise<unknown>
  ): Promise<boolean> {
    const expectedSeid = device.connectedSeid
    const result = await checkWalletReadiness(call, app.userPath)
    if (!current()) return false
    if (!result.isSuccess) {
      fail(result, 'wallet', false, retry)
      return false
    }
    const identity = await call('getSeid')
    if (!current()) return false
    if (!identity.isSuccess) {
      fail(identity, 'wallet', false, retry)
      return false
    }
    if (
      !expectedSeid ||
      !identity.result ||
      identity.result.toUpperCase() !== expectedSeid.toUpperCase() ||
      device.connectedSeid.toUpperCase() !== expectedSeid.toUpperCase()
    ) {
      fail('device_session_changed', 'connect', true, retry)
      return false
    }
    return true
  }
  async function getAppsList(current: () => boolean) {
    const response = await call('checkUpdate')
    if (!current()) return false
    if (!response.isSuccess) return fail(response, 'app')
    device.apps = toDeviceApplets(response.result.list)
    recoveryCatalogRefresh.delete(device)
    await firmware.ensureFirmwareVersion(current)
    return current()
  }
  async function initWithinOperation() {
    const sessionId = device.sessionId
    const current = () => scope.active() && device.sessionId === sessionId
    try {
      const connected = await refreshDeviceIdentity(call, device, scope.active, {
        hideCachedData: false,
        ...firmware.pendingRecoveryOptions?.()
      })
      if (!connected.isSuccess) return fail(connected, 'connect')
      if (!current()) return
      if (firmware.pendingRecoveryOptions?.()) {
        firmware.restoreCachedCheck()
        return
      }
      if (
        device.isFirstGoToManagerPage ||
        device.apps.length === 0 ||
        recoveryCatalogRefresh.get(device) === sessionId
      ) {
        if (await getAppsList(current)) device.isFirstGoToManagerPage = false
      } else await firmware.ensureFirmwareVersion(current)
    } catch (error) {
      if (current()) fail(error, 'connect')
    }
  }
  function init() {
    return scope.run(initWithinOperation, 'initialize')
  }
  async function changeAppWithinOperation(
    item: AppletView,
    operation: 'install' | 'update'
  ): Promise<void> {
    let target = device.apps.find(entry => entry.id === item.id)
    if (!target) return
    const sessionId = device.sessionId
    const current = () => scope.active() && device.sessionId === sessionId
    const retry = () => changeApp(item, operation)
    try {
      const recoveryResult = await firmware.recoverBeforeAppOperation(error =>
        fail(error, 'connect', false, retry)
      )
      if (recoveryResult === 'failed') {
        if (current() && firmware.pendingRecoveryOptions?.())
          pendingFirmwareAction = { sessionId, resume: retry }
        return
      }
      if (!current()) return
      pendingFirmwareAction = undefined
      if (recoveryResult === 'recovered') recoveryCatalogRefresh.set(device, sessionId)
      if (recoveryCatalogRefresh.get(device) === sessionId) {
        const catalog = await call('checkUpdate')
        if (!current()) return
        if (!catalog.isSuccess) return fail(catalog, 'app', false, retry)
        device.apps = toDeviceApplets(catalog.result.list)
        recoveryCatalogRefresh.delete(device)
        device.isFirstGoToManagerPage = false
        target = device.apps.find(entry => entry.id === item.id)
        if (!target) return fail('imkey_app_name_not_exist', 'app', false, retry)
      }
      const connected = await refreshDeviceIdentity(call, device, scope.active, {
        hideCachedData: false
      })
      if (!connected.isSuccess) return fail(connected, 'connect', false, retry)
      if (!current()) return
      let pending = pendingRestore(item.id)
      if (!(await walletReady(current, retry))) return
      if (pending) {
        const catalog = await call('checkUpdate')
        if (!current()) return
        if (!catalog.isSuccess) return fail(catalog, 'restore', false, retry)
        const installed = catalog.result.list.find(entry => entry.name === item.name)
        if (installed?.installedVersion !== pending.version) {
          restores.delete(item.id)
          return fail('device_session_restart_required', 'restore', true)
        }
        // The catalog call may wait on the server; confirm identity again before writing.
        const confirmed = await refreshDeviceIdentity(call, device, scope.active, {
          hideCachedData: false
        })
        if (!confirmed.isSuccess) return fail(confirmed, 'connect', false, retry)
        if (!current()) return
      } else {
        const response = await call(
          operation === 'install' ? 'downloadApplet' : 'updateApplet',
          target.name
        )
        if (!current()) return
        if (!response.isSuccess) return fail(response, 'app', false, retry)
        pending = {
          sessionId,
          seid: device.connectedSeid,
          version: target.latestVersion,
          previousVersion: target.installedVersion,
          addresses: [...new Set(response.result)]
        }
        restores.set(item.id, pending)
      }
      if (!(await walletReady(current, retry))) return
      // A reset can be followed by a newly created wallet between attempts,
      // without an observable empty-wallet state. Restore every address for the
      // current wallet instead of relying on an earlier wallet's successes.
      const registered = await call('writeWalletAddress', {
        name: [...pending.addresses],
        filePath: app.userPath
      })
      if (!current()) return
      if (!registered.isSuccess) return fail(registered, 'restore', false, retry)
      target.installedVersion = pending.version
      restores.delete(item.id)
    } catch (error) {
      if (current()) {
        if (firmware.pendingRecoveryOptions?.()) {
          pendingFirmwareAction = { sessionId, resume: retry }
          firmware.restoreCachedCheck?.()
        }
        fail(error, pendingRestore(item.id) ? 'restore' : 'app', false, retry)
      }
    }
  }
  async function changeApp(item: AppletView, operation: 'install' | 'update'): Promise<void> {
    const target = device.apps.find(entry => entry.id === item.id)
    if (!target || !scope.active() || Object.keys(operations).length > 0) return
    // Show feedback before queueing or awaiting the device preflight checks.
    operations[target.id] = operation
    try {
      await scope.run(() => changeAppWithinOperation(item, operation))
    } finally {
      delete operations[target.id]
    }
  }
  function installApp(item: AppletView) {
    return changeApp(item, 'install')
  }
  function updateApp(item: AppletView) {
    return changeApp(item, 'update')
  }
  async function deleteWithinOperation(item: AppletView): Promise<void> {
    let target = device.apps.find(entry => entry.id === item.id)
    if (!target) return
    const sessionId = device.sessionId
    const current = () => scope.active() && device.sessionId === sessionId
    const retry = () => scope.run(() => deleteWithinOperation(item))
    try {
      const recoveryResult = await firmware.recoverBeforeAppOperation(error =>
        fail(error, 'connect', false, retry)
      )
      if (recoveryResult === 'failed') {
        if (current() && firmware.pendingRecoveryOptions?.())
          pendingFirmwareAction = { sessionId, resume: retry }
        return
      }
      if (!current()) return
      pendingFirmwareAction = undefined
      if (recoveryResult === 'recovered') recoveryCatalogRefresh.set(device, sessionId)
      if (recoveryCatalogRefresh.get(device) === sessionId) {
        const catalog = await call('checkUpdate')
        if (!current()) return
        if (!catalog.isSuccess) return fail(catalog, 'app', false, retry)
        device.apps = toDeviceApplets(catalog.result.list)
        recoveryCatalogRefresh.delete(device)
        device.isFirstGoToManagerPage = false
        target = device.apps.find(entry => entry.id === item.id)
        if (!target) return fail('imkey_app_name_not_exist', 'app', false, retry)
      }
      const connected = await refreshDeviceIdentity(call, device, scope.active, {
        hideCachedData: false
      })
      if (!connected.isSuccess) return fail(connected, 'connect', false, retry)
      if (!current()) return
      if (!(await walletReady(current, retry))) return
      operations[target.id] = 'delete'
      const result = await call('deleteApplet', target.name)
      if (!current()) return
      if (!result.isSuccess || result.result !== constants.RESULT_STATUS_SUCCESS)
        return fail(result, 'app', false, retry)
      if (current()) target.installedVersion = null
    } catch (error) {
      if (current()) {
        if (firmware.pendingRecoveryOptions?.()) {
          pendingFirmwareAction = { sessionId, resume: retry }
          firmware.restoreCachedCheck?.()
        }
        fail(error, 'app', false, retry)
      }
    } finally {
      delete operations[item.id]
    }
  }
  function deleteApp(item: AppletView) {
    return scope.run(() => deleteWithinOperation(item))
  }
  async function retryFirmwareRecovery(): Promise<unknown> {
    const pending = pendingFirmwareAction
    if (pending && pending.sessionId === device.sessionId) return pending.resume()
    pendingFirmwareAction = undefined
    return scope.run(async () => {
      const sessionId = device.sessionId
      const current = () => scope.active() && device.sessionId === sessionId
      try {
        const result = await firmware.recoverBeforeAppOperation(error =>
          fail(error, 'connect', false, retryFirmwareRecovery)
        )
        if (result !== 'recovered' || !current()) return
        recoveryCatalogRefresh.set(device, sessionId)
        const catalog = await call('checkUpdate')
        if (!current()) return
        if (!catalog.isSuccess) return fail(catalog, 'app', false, init)
        device.apps = toDeviceApplets(catalog.result.list)
        recoveryCatalogRefresh.delete(device)
        device.isFirstGoToManagerPage = false
      } catch (error) {
        if (current()) {
          if (firmware.pendingRecoveryOptions?.()) firmware.restoreCachedCheck?.()
          fail(error, 'app', false, retryFirmwareRecovery)
        }
      }
    }, 'firmwareRecovery')
  }
  onMounted(() => {
    void init()
  })
  return {
    state,
    apps,
    firmware,
    getApps,
    ok,
    init,
    installApp,
    updateApp,
    deleteApp,
    retryFirmwareRecovery
  }
}
