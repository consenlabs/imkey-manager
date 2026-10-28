import { computed, onMounted, reactive } from 'vue'
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
  const apps = computed(() =>
    device.apps.map(entry =>
      appletView(entry, t('m.imKeyManager.imKey_soft'), operations[entry.id])
    )
  )
  const getApps = computed(() => filterApplets(apps.value, state.appName))
  function fail(
    error: unknown,
    stage: string,
    binding = false,
    retry: () => Promise<unknown> = init
  ) {
    if (!scope.active() || (error as { code?: string })?.code === 'OPERATION_CANCELLED') return
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
  async function getAppsList(current: () => boolean) {
    const response = await call('checkUpdate')
    if (!current()) return false
    if (!response.isSuccess) return fail(response, 'app')
    device.apps = toDeviceApplets(response.result.list)
    await firmware.checkFirmwareVersion(undefined, current)
    return current()
  }
  async function initWithinOperation() {
    const sessionId = device.sessionId
    const current = () => scope.active() && device.sessionId === sessionId
    try {
      const connected = await refreshDeviceIdentity(call, device, scope.active, {
        hideCachedData: false
      })
      if (!connected.isSuccess) return fail(connected, 'connect')
      if (!current()) return
      const binding = await call('exportBindCode')
      if (!current()) return
      if (!binding.isSuccess) return fail(binding, 'bind', true)
      firmware.state.bindCode = binding.result
      if (device.isFirstGoToManagerPage || device.apps.length === 0) {
        if (await getAppsList(current)) device.isFirstGoToManagerPage = false
      } else await firmware.checkFirmwareVersion(undefined, current)
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
    const target = device.apps.find(entry => entry.id === item.id)
    if (!target) return
    const sessionId = device.sessionId
    const current = () => scope.active() && device.sessionId === sessionId
    const retry = () => changeApp(item, operation)
    try {
      if (firmware.state.cosUpdateStatus === '1') {
        await firmware.updateFirmwareWithinOperation()
        return
      }
      const connected = await refreshDeviceIdentity(call, device, scope.active, {
        hideCachedData: false
      })
      if (!connected.isSuccess) return fail(connected, 'connect', false, retry)
      if (!current()) return
      const response = await call(
        operation === 'install' ? 'downloadApplet' : 'updateApplet',
        target.name
      )
      if (!current()) return
      if (!response.isSuccess) return fail(response, 'app', false, retry)
      const registered = await call('writeWalletAddress', {
        name: response.result,
        filePath: app.userPath
      })
      if (!current()) return
      if (!registered.isSuccess) return fail(registered, 'restore', false, retry)
      if (current()) target.installedVersion = target.latestVersion
    } catch (error) {
      if (current()) fail(error, 'app', false, retry)
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
    const target = device.apps.find(entry => entry.id === item.id)
    if (!target) return
    const sessionId = device.sessionId
    const current = () => scope.active() && device.sessionId === sessionId
    const retry = () => scope.run(() => deleteWithinOperation(item))
    try {
      if (firmware.state.cosUpdateStatus === '1') {
        await firmware.updateFirmwareWithinOperation()
        return
      }
      const connected = await refreshDeviceIdentity(call, device, scope.active, {
        hideCachedData: false
      })
      if (!connected.isSuccess) return fail(connected, 'connect', false, retry)
      if (!current()) return
      operations[target.id] = 'delete'
      const result = await call('deleteApplet', target.name)
      if (!current()) return
      if (!result.isSuccess || result.result !== constants.RESULT_STATUS_SUCCESS)
        return fail(result, 'app', false, retry)
      if (current()) target.installedVersion = null
    } catch (error) {
      if (current()) fail(error, 'app', false, retry)
    } finally {
      delete operations[target.id]
    }
  }
  function deleteApp(item: AppletView) {
    return scope.run(() => deleteWithinOperation(item))
  }
  onMounted(() => {
    void init()
  })
  return { state, apps, firmware, getApps, ok, init, installApp, updateApp, deleteApp }
}
