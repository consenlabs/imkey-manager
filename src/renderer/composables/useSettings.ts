import { onMounted, onUnmounted, reactive, watch } from 'vue'
import { useDeviceOperation } from './useDeviceOperation'
import { operationError } from './operationError'
import { useDeviceStore } from '../store/device'
import { useFirmwareUpgrade } from './useFirmwareUpgrade'
import { isSessionRecoveryError } from './deviceSession'
import { useDeviceRecovery } from './useDeviceRecovery'
import { refreshDeviceIdentity } from './deviceIdentity'
import { useSecureCheck } from './useSecureCheck'
import type { DeviceInfoCache } from '../models/deviceState'

export function useSettings() {
  const device = useDeviceStore()
  const operation = useDeviceOperation()
  const callDevice = operation.call
  const recovery = useDeviceRecovery(operation)
  const firmware = useFirmwareUpgrade('setting', operation)
  const secureCheck = useSecureCheck({ scope: operation, checkIdentityOnMount: false })
  device.prepareIdentityCheck()
  const state = reactive({
    status: 3,
    SN: '',
    copyTooltipDisabled: false,
    checkingUpdate: false,
    errorInfo: '',
    errorStage: ''
  })
  let active = true
  let copyTimer: ReturnType<typeof setTimeout> | undefined
  function failed(error: unknown, stage: string, bindingFile = false) {
    if (!active || !operation.active()) return
    state.errorInfo = operationError(error)
    state.errorStage = stage
    state.status = 2
    if (bindingFile || isSessionRecoveryError(error)) {
      const result = typeof error === 'string' ? error : (error as { result?: unknown })?.result
      recovery.offer(error, init, {
        reconnectOnly:
          bindingFile ||
          result === 'device_session_changed' ||
          result === 'device_bind_check_failed'
      })
    }
  }
  async function copyText() {
    try {
      await window.imkey.app.copyText(state.SN)
    } catch (error) {
      if (!active) return
      state.errorInfo = operationError(error)
      state.errorStage = 'copy'
      return
    }
    state.errorInfo = ''
    if (!active) return
    state.copyTooltipDisabled = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      state.copyTooltipDisabled = false
    }, 1000)
  }
  async function exportBindCodeWithinOperation() {
    const result = await callDevice('exportBindCode')
    if (result.isSuccess) {
      firmware.state.bindCode = result.result
      firmware.changeCode(4)
    } else {
      failed(result, 'store', true)
    }
  }
  function restoreCachedInfo(info: DeviceInfoCache) {
    state.SN = info.sn
    Object.assign(firmware.state, {
      cosOldVersionData: info.firmwareVersion,
      bleOldVersionData: info.bleVersion,
      cosNewVersionData: info.latestFirmwareVersion,
      bleNewVersionData: info.latestBleVersion,
      isCosUpdate: info.updateAvailable,
      cosUpdateStatus: info.updateAvailable ? '1' : '0'
    })
  }
  async function initialize(force = false) {
    const sessionId = device.sessionId
    const current = () => active && operation.active() && device.sessionId === sessionId
    state.errorInfo = ''
    state.SN = ''
    state.status = 3
    try {
      const connected = await refreshDeviceIdentity(callDevice, device, operation.active)
      if (!connected.isSuccess) {
        if (connected.code === 'OPERATION_CANCELLED') return
        failed(connected, 'connect')
        if (!isSessionRecoveryError(connected)) recovery.offer(connected, init)
        return
      }
      if (!current()) return
      const binding = await callDevice('exportBindCode')
      if (!current()) return
      if (!binding.isSuccess) {
        failed(binding, 'store', true)
        return
      }
      firmware.state.bindCode = binding.result
      const cached = device.deviceInfo
      const sameDevice = cached?.seid === device.connectedSeid
      const sameVersions =
        cached &&
        (!device.cosOldVersionData || device.cosOldVersionData === cached.firmwareVersion) &&
        (!device.installedBleVersion || device.installedBleVersion === cached.bleVersion)
      if (cached && sameDevice && sameVersions && !force) {
        restoreCachedInfo(cached)
        state.status = 1
        return
      }
      if (force) device.deviceInfo = null
      const online = await window.imkey.app.isOnline()
      if (!current()) return
      if (!online) {
        failed('network_unavailable', 'check')
        return
      }
      const ble = await callDevice('getBleVersion')
      if (!current()) return
      if (!ble.isSuccess) {
        failed(ble, 'check')
        return
      }
      firmware.state.bleOldVersionData = device.installedBleVersion || ble.result
      device.bleOldVersionData = firmware.state.bleOldVersionData
      if (cached && sameDevice) state.SN = cached.sn
      else {
        const serial = await callDevice('getSn')
        if (!current()) return
        if (!serial.isSuccess) {
          failed(serial, 'check')
          return
        }
        state.SN = serial.result
      }
      if (firmware.state.supportCode === 5) firmware.changeCode(0)
      await firmware.checkFirmwareVersion(undefined, current)
      if (!current()) return
      const confirmed = await refreshDeviceIdentity(callDevice, device, operation.active)
      if (!confirmed.isSuccess) {
        state.SN = ''
        if (confirmed.code !== 'OPERATION_CANCELLED') failed(confirmed, 'connect')
        return
      }
      if (!current()) return
      state.status = 1
      if (active && operation.active() && firmware.state.supportCode !== 5) {
        device.deviceInfo = {
          seid: device.connectedSeid,
          sn: state.SN,
          firmwareVersion: firmware.state.cosOldVersionData,
          bleVersion: firmware.state.bleOldVersionData,
          latestFirmwareVersion: firmware.state.cosNewVersionData,
          latestBleVersion: firmware.state.bleNewVersionData,
          updateAvailable: firmware.state.isCosUpdate
        }
      }
    } catch (error) {
      if (!current()) return
      failed(error, 'check')
    }
  }
  function init() {
    return operation.run(() => initialize(), 'initialize')
  }
  function checkUpdate() {
    if (state.checkingUpdate || firmware.state.busy) return
    state.checkingUpdate = true
    return operation
      .run(() => initialize(true), 'initialize')
      .finally(() => {
        state.checkingUpdate = false
      })
  }
  function exportBindCode() {
    return operation.run(exportBindCodeWithinOperation)
  }
  onMounted(() => {
    void init()
  })
  watch(
    () => firmware.state.supportCode,
    code => {
      if (code === 2) device.deviceInfo = null
    }
  )
  onUnmounted(() => {
    active = false
    clearTimeout(copyTimer)
  })
  return { state, firmware, secureCheck, copyText, exportBindCode, init, checkUpdate }
}
