import { onMounted, onUnmounted, reactive } from 'vue'
import { useDeviceOperation } from './useDeviceOperation'
import { operationError } from './operationError'
import { useDeviceStore } from '../store/device'
import { useFirmwareUpgrade } from './useFirmwareUpgrade'
import { connectDeviceSession, isSessionRecoveryError } from './deviceSession'
import { useDeviceRecovery } from './useDeviceRecovery'

export function useSettings() {
  const device = useDeviceStore()
  const operation = useDeviceOperation()
  const callDevice = operation.call
  const recovery = useDeviceRecovery(operation)
  const firmware = useFirmwareUpgrade('setting', operation)
  const state = reactive({
    status: 3,
    SN: '',
    copyTooltipDisabled: false,
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
  async function initialize() {
    state.errorInfo = ''
    state.status = 3
    try {
      const online = await window.imkey.app.isOnline()
      if (!active) return
      if (!online) {
        state.status = 2
        return
      }
      const connected = await connectDeviceSession(callDevice, device)
      if (!connected.isSuccess) {
        failed(connected, 'connect')
        return
      }
      const binding = await callDevice('exportBindCode')
      if (!binding.isSuccess) {
        failed(binding, 'store', true)
        return
      }
      firmware.state.bindCode = binding.result
      const ble = await callDevice('getBleVersion')
      if (!ble.isSuccess) {
        failed(ble, 'check')
        return
      }
      firmware.state.bleOldVersionData = device.installedBleVersion || ble.result
      device.bleOldVersionData = firmware.state.bleOldVersionData
      const serial = await callDevice('getSn')
      if (!serial.isSuccess) {
        failed(serial, 'check')
        return
      }
      state.SN = serial.result
      await firmware.checkFirmwareVersion(() => {
        if (active) state.status = 1
      })
      if (active && firmware.state.supportCode === 5) state.status = 1
    } catch (error) {
      if (!active) return
      failed(error, 'check')
    }
  }
  function init() {
    return operation.run(initialize, 'initialize')
  }
  function exportBindCode() {
    return operation.run(exportBindCodeWithinOperation)
  }
  async function openUrl(type: 'support' | 'buy' | 'getStarted') {
    const urls = {
      support: 'https://support.imkey.im/',
      buy: 'https://imkey.im/',
      getStarted: 'https://imkey.im/get-started'
    }
    try {
      await window.imkey.app.openExternal(urls[type])
    } catch (error) {
      if (!active) return
      state.errorInfo = operationError(error)
      state.errorStage = 'link'
    }
  }
  onMounted(() => {
    void init()
  })
  onUnmounted(() => {
    active = false
    clearTimeout(copyTimer)
  })
  return { state, firmware, copyText, exportBindCode, openUrl, init }
}
