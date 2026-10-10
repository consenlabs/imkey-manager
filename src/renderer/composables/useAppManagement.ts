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

export function useAppManagement() {
  const device = useDeviceStore()
  const app = useAppStore()
  const { t } = useTranslation()
  const scope = useDeviceOperation()
  const call = scope.call
  const firmware = useFirmwareUpgrade('manager', scope)
  const state = reactive({ tip: false, tip1: false, appName: '', errorInfo: '', errorStage: '' })
  const operations = reactive<Record<string, AppOperation | undefined>>({})
  const apps = computed(() =>
    device.apps.map(entry =>
      appletView(entry, t('m.imKeyManager.imKey_soft'), operations[entry.id])
    )
  )
  const getApps = computed(() => filterApplets(apps.value, state.appName))
  function fail(error: unknown, stage: string, binding = false) {
    if (!scope.active()) return
    state.errorInfo = operationError(error)
    state.errorStage = stage
    if (binding) state.tip1 = true
    else state.tip = true
  }
  function ok() {
    state.tip = false
    state.tip1 = false
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
      const connected = await call('connectDevice')
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
  async function changeApp(item: AppletView, operation: 'install' | 'update') {
    const target = device.apps.find(entry => entry.id === item.id)
    if (!target) return
    try {
      if (firmware.state.cosUpdateStatus === '1') {
        await firmware.updateFirmwareWithinOperation()
        return
      }
      const connected = await call('connectDevice')
      if (!connected.isSuccess) return fail(connected, 'connect')
      operations[target.id] = operation
      const response = await call(
        operation === 'install' ? 'downloadApplet' : 'updateApplet',
        target.name
      )
      if (!response.isSuccess) return fail(response, 'app')
      const registered = await call('writeWalletAddress', {
        name: response.result,
        filePath: app.userPath
      })
      if (!registered.isSuccess) return fail(registered, 'restore')
      if (['Polkadot', 'Kusama', 'Ethereum'].includes(target.name)) {
        const addresses = await call('genWalletAddress', { filePath: app.userPath })
        if (!addresses.isSuccess) return fail(addresses, 'restore')
        app.walletAddresses = addresses.result
      }
      if (scope.active()) target.installedVersion = target.latestVersion
    } catch (error) {
      fail(error, 'app')
    } finally {
      delete operations[target.id]
    }
  }
  function installApp(item: AppletView) {
    return scope.run(() => changeApp(item, 'install'))
  }
  function updateApp(item: AppletView) {
    return scope.run(() => changeApp(item, 'update'))
  }
  async function deleteWithinOperation(item: AppletView) {
    const target = device.apps.find(entry => entry.id === item.id)
    if (!target) return
    try {
      if (firmware.state.cosUpdateStatus === '1') {
        await firmware.updateFirmwareWithinOperation()
        return
      }
      const connected = await call('connectDevice')
      if (!connected.isSuccess) return fail(connected, 'connect')
      operations[target.id] = 'delete'
      const result = await call('deleteApplet', target.name)
      if (!result.isSuccess || result.result !== constants.RESULT_STATUS_SUCCESS)
        return fail(result, 'app')
      if (scope.active()) target.installedVersion = null
    } catch (error) {
      fail(error, 'app')
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
