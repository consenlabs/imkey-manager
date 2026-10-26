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
import { connectDeviceSession, isSessionRecoveryError } from './deviceSession'
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
    if (!scope.active()) return
    state.errorInfo = operationError(error)
    state.errorStage = stage
    if (binding || isSessionRecoveryError(error)) {
      recovery.offer(error, retry, {
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
  async function getAppsList() {
    const connected = await call('connectDevice')
    if (!connected.isSuccess) return fail(connected, 'connect')
    const response = await call('checkUpdate')
    if (!response.isSuccess) return fail(response, 'app')
    device.apps = toDeviceApplets(response.result.list)
    await firmware.checkFirmwareVersion()
  }
  async function initWithinOperation() {
    try {
      const connected = await connectDeviceSession(call, device)
      if (!connected.isSuccess) return fail(connected, 'connect')
      if (connected.result !== constants.RESULT_STATUS_SUCCESS) return fail(connected, 'connect')
      const binding = await call('exportBindCode')
      if (!binding.isSuccess) return fail(binding, 'bind', true)
      firmware.state.bindCode = binding.result
      if (device.isFirstGoToManagerPage || device.apps.length === 0) {
        await getAppsList()
        if (scope.active()) device.isFirstGoToManagerPage = false
      } else await firmware.checkFirmwareVersion()
    } catch (error) {
      fail(error, 'connect')
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
    const retry = () => changeApp(item, operation)
    try {
      if (firmware.state.cosUpdateStatus === '1') {
        await firmware.updateFirmwareWithinOperation()
        return
      }
      const connected = await connectDeviceSession(call, device)
      if (!connected.isSuccess) return fail(connected, 'connect', false, retry)
      const response = await call(
        operation === 'install' ? 'downloadApplet' : 'updateApplet',
        target.name
      )
      if (!response.isSuccess) return fail(response, 'app', false, retry)
      const registered = await call('writeWalletAddress', {
        name: response.result,
        filePath: app.userPath
      })
      if (!registered.isSuccess) return fail(registered, 'restore', false, retry)
      if (scope.active()) target.installedVersion = target.latestVersion
    } catch (error) {
      fail(error, 'app', false, retry)
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
    const retry = () => scope.run(() => deleteWithinOperation(item))
    try {
      if (firmware.state.cosUpdateStatus === '1') {
        await firmware.updateFirmwareWithinOperation()
        return
      }
      const connected = await connectDeviceSession(call, device)
      if (!connected.isSuccess) return fail(connected, 'connect', false, retry)
      operations[target.id] = 'delete'
      const result = await call('deleteApplet', target.name)
      if (!result.isSuccess || result.result !== constants.RESULT_STATUS_SUCCESS)
        return fail(result, 'app', false, retry)
      if (scope.active()) target.installedVersion = null
    } catch (error) {
      fail(error, 'app', false, retry)
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
