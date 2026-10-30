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
import { cachedFirmware, invalidateFirmware } from './firmwareCache'

export function useSettings() {
  const device = useDeviceStore()
  const operation = useDeviceOperation()
  const callDevice = operation.call
  const recovery = useDeviceRecovery(operation)
  const firmware = useFirmwareUpgrade('setting', operation)
  const secureCheck = useSecureCheck({ scope: operation })
  const state = reactive({
    status: 1,
    initializing: true,
    SN: '',
    copyTooltipDisabled: false,
    checkingUpdate: false,
    firmwareChecked: false,
    errorInfo: '',
    errorStage: ''
  })
  let active = true
  let loading = false
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
    const sessionId = device.sessionId
    const connected = await refreshDeviceIdentity(callDevice, device, operation.active, {
      hideCachedData: false
    })
    if (!connected.isSuccess) {
      if (connected.code === 'OPERATION_CANCELLED') return
      failed(connected, 'connect')
      if (!isSessionRecoveryError(connected)) recovery.offer(connected, init)
      return
    }
    const result = await callDevice('exportBindCode')
    if (!active || !operation.active() || device.sessionId !== sessionId) return
    if (result.isSuccess) {
      const confirmed = await refreshDeviceIdentity(callDevice, device, operation.active, {
        hideCachedData: false
      })
      if (!confirmed.isSuccess) {
        if (confirmed.code !== 'OPERATION_CANCELLED') failed(confirmed, 'connect')
        return
      }
      firmware.state.bindCode = result.result
      firmware.changeCode(4)
    } else {
      failed(result, 'store', true)
    }
  }
  function restoreCachedInfo(info: DeviceInfoCache) {
    state.SN = info.sn
    state.firmwareChecked = false
    Object.assign(firmware.state, {
      cosOldVersionData: info.firmwareVersion,
      bleOldVersionData: info.bleVersion,
      cosNewVersionData: '',
      bleNewVersionData: '',
      isCosUpdate: false,
      cosUpdateStatus: '0'
    })
    state.firmwareChecked = firmware.restoreCachedCheck()
  }
  function usableCachedInfo() {
    const cached = device.deviceInfo
    const knownBleVersion = device.installedBleVersion || device.bleOldVersionData
    if (
      !device.identityReady ||
      !cached ||
      cached.seid !== device.connectedSeid ||
      (device.cosOldVersionData && device.cosOldVersionData !== cached.firmwareVersion) ||
      (knownBleVersion && knownBleVersion !== cached.bleVersion)
    )
      return undefined
    return cached
  }
  function clearCachedUpdateResult() {
    invalidateFirmware(device)
    const cached = device.deviceInfo
    if (!cached || !device.identityReady || cached.seid !== device.connectedSeid) return
    device.deviceInfo = {
      ...cached,
      firmwareVersion: firmware.state.cosOldVersionData || cached.firmwareVersion,
      bleVersion: firmware.state.bleOldVersionData || cached.bleVersion,
      firmwareChecked: false,
      latestFirmwareVersion: '',
      latestBleVersion: '',
      updateAvailable: false
    }
  }
  const initialCache = usableCachedInfo()
  if (initialCache) {
    restoreCachedInfo(initialCache)
    state.initializing = false
  } else device.prepareIdentityCheck()

  async function initialize(force = false) {
    const sessionId = device.sessionId
    const current = () => active && operation.active() && device.sessionId === sessionId
    const keepPage = force && (state.status === 1 || state.status === 6)
    const fail = (error: unknown, stage: string, bindingFile = false) => {
      if (!active || !operation.active()) return
      if (!device.identityReady || bindingFile || isSessionRecoveryError(error)) {
        if (!device.identityReady) state.SN = ''
        failed(error, stage, bindingFile)
        return
      }
      if (force) {
        state.firmwareChecked = true
        firmware.state.cosUpdateStatus = '2'
        clearCachedUpdateResult()
      }
      state.errorInfo = operationError(error)
      state.errorStage = stage
      recovery.offer(error, force ? async () => checkUpdate() : init)
    }
    state.errorInfo = ''
    if (!keepPage) {
      state.SN = ''
      state.firmwareChecked = false
    }
    try {
      const connected = await refreshDeviceIdentity(callDevice, device, operation.active, {
        hideCachedData: !keepPage,
        requireBinding: !force,
        ...firmware.pendingRecoveryOptions()
      })
      if (!connected.isSuccess) {
        if (connected.code === 'OPERATION_CANCELLED') return
        fail(connected, 'connect')
        if (!isSessionRecoveryError(connected)) recovery.offer(connected, init)
        return
      }
      if (!current()) return
      if (firmware.pendingRecoveryOptions()) {
        // An interrupted upgrade can leave normal firmware metadata unavailable.
        // Keep its explicit recovery entry reachable; the retry validates its stage.
        firmware.restoreCachedCheck()
        state.firmwareChecked = true
        return
      }
      const cached = device.deviceInfo
      const sameDevice = cached?.seid === device.connectedSeid
      if (!force) device.deviceInfo = null
      if (force) {
        const online = await window.imkey.app.isOnline()
        if (!current()) return
        if (!online) {
          fail('network_unavailable', 'check')
          return
        }
      }
      const ble = await callDevice('getBleVersion')
      if (!current()) return
      if (!ble.isSuccess) {
        fail(ble, 'check')
        return
      }
      firmware.state.bleOldVersionData = ble.result
      device.bleOldVersionData = firmware.state.bleOldVersionData
      device.installedBleVersion = ble.result
      if (cached && sameDevice) state.SN = cached.sn
      else {
        const serial = await callDevice('getSn')
        if (!current()) return
        if (!serial.isSuccess) {
          fail(serial, 'check')
          return
        }
        state.SN = serial.result
      }
      if (firmware.state.supportCode === 5) firmware.changeCode(0)
      if (force) {
        await firmware.checkFirmwareVersion(undefined, current)
      } else {
        const version = await callDevice('getFirmwareVersion')
        if (!current()) return
        if (!version.isSuccess) {
          fail(version, 'check')
          return
        }
        firmware.state.cosOldVersionData = version.result
        device.cosOldVersionData = version.result
        firmware.state.cosNewVersionData = ''
        firmware.state.bleNewVersionData = ''
        firmware.state.isCosUpdate = false
        firmware.state.cosUpdateStatus = '0'
        firmware.restoreCachedCheck()
      }
      if (!current()) return
      const confirmed = await refreshDeviceIdentity(callDevice, device, operation.active, {
        hideCachedData: false,
        requireBinding: !force,
        ...firmware.pendingRecoveryOptions()
      })
      if (!confirmed.isSuccess) {
        state.SN = ''
        if (confirmed.code !== 'OPERATION_CANCELLED') fail(confirmed, 'connect')
        return
      }
      if (!current()) return
      state.firmwareChecked = force || Boolean(cachedFirmware(device)) || firmware.state.recovering
      if (force && firmware.state.supportCode === 5) clearCachedUpdateResult()
      if (active && operation.active() && firmware.state.supportCode !== 5) {
        device.deviceInfo = {
          seid: device.connectedSeid,
          sn: state.SN,
          firmwareVersion: firmware.state.cosOldVersionData,
          bleVersion: firmware.state.bleOldVersionData,
          firmwareChecked: state.firmwareChecked,
          latestFirmwareVersion: firmware.state.cosNewVersionData,
          latestBleVersion: firmware.state.bleNewVersionData,
          updateAvailable: firmware.state.isCosUpdate
        }
      }
    } catch (error) {
      if (!current()) return
      fail(error, 'check')
    }
  }
  function runInitialization(force: boolean) {
    if (!active || !operation.active() || loading || firmware.state.busy) return
    const cached = !force && usableCachedInfo()
    if (cached) {
      restoreCachedInfo(cached)
      state.initializing = false
      return
    }
    loading = true
    if (!force) state.initializing = true
    if (state.status === 2) {
      state.initializing = true
      state.status = 1
    }
    state.checkingUpdate = force
    return operation
      .run(() => initialize(force), 'initialize')
      .finally(() => {
        loading = false
        state.checkingUpdate = false
        state.initializing = false
      })
  }
  async function init() {
    await runInitialization(false)
  }
  function checkUpdate() {
    return runInitialization(true)
  }
  function exportBindCode() {
    if (state.initializing) return
    return operation.run(exportBindCodeWithinOperation)
  }
  onMounted(() => {
    void init()
  })
  watch(
    () => device.sessionId,
    () => {
      if (!active || !operation.active()) return
      state.SN = ''
      state.firmwareChecked = false
      if (state.status === 1 || state.status === 6) state.status = 2
    }
  )
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
