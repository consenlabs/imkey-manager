import { onMounted, onUnmounted, reactive } from 'vue'
import { useDeviceOperation } from './useDeviceOperation'
import { operationError } from './operationError'
import { useDeviceStore } from '../store/device'
import { useFirmwareUpgrade } from './useFirmwareUpgrade'

export function useSettings() {
  const device = useDeviceStore()
  const operation = useDeviceOperation()
  const callDevice = operation.call
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
      firmware.state.errorInfo = operationError(result)
      firmware.state.errorStage = 'store'
      firmware.changeCode(5)
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
      const connected = await callDevice('connectDevice')
      if (!connected.isSuccess) {
        state.errorInfo = operationError(connected)
        state.errorStage = 'connect'
        state.status = 2
        return
      }
      const binding = await callDevice('exportBindCode')
      if (!binding.isSuccess) {
        state.errorInfo = operationError(binding)
        state.errorStage = 'store'
        state.status = 2
        return
      }
      firmware.state.bindCode = binding.result
      const ble = await callDevice('getBleVersion')
      if (!ble.isSuccess) {
        state.errorInfo = operationError(ble)
        state.errorStage = 'check'
        state.status = 2
        return
      }
      firmware.state.bleOldVersionData = device.installedBleVersion || ble.result
      device.bleOldVersionData = firmware.state.bleOldVersionData
      const serial = await callDevice('getSn')
      if (!serial.isSuccess) {
        state.errorInfo = operationError(serial)
        state.errorStage = 'check'
        state.status = 2
        return
      }
      state.SN = serial.result
      await firmware.checkFirmwareVersion(() => {
        if (active) state.status = 1
      })
      if (active && firmware.state.supportCode === 5) state.status = 1
    } catch (error) {
      if (!active) return
      state.errorInfo = operationError(error)
      state.errorStage = 'check'
      state.status = 2
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
