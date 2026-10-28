import { reactive, watch } from 'vue'
import constants from '../../common/constants'
import { useDeviceOperation, type DeviceOperation } from './useDeviceOperation'
import { useAppStore } from '../store/app'
import { useDeviceStore } from '../store/device'
import { operationError } from './operationError'
import type { WalletChain } from '../../shared/deviceContract'
import { refreshDeviceIdentity } from './deviceIdentity'
import { useDeviceRecovery } from './useDeviceRecovery'

export function useFirmwareUpgrade(kind: 'manager' | 'setting', scope?: DeviceOperation) {
  const operation = scope || useDeviceOperation()
  const callDevice = operation.call
  const device = useDeviceStore()
  const app = useAppStore()
  const recovery = useDeviceRecovery(operation)
  const state = reactive({
    supportCode: 0,
    errorInfo: '',
    errorStage: '',
    busy: false,
    bindCode: '',
    cosOldVersionData: '',
    cosNewVersionData: '',
    bleOldVersionData: '',
    bleNewVersionData: '',
    isCosUpdate: false,
    cosUpdateStatus: '0'
  })
  // Keep the recovery inputs private while an interrupted upgrade is retried.
  // The device may be in bootloader mode or waiting to be rebound at this point.
  let upgradeAttempt: { seid: string; data: ReturnType<typeof upgradeData> } | undefined
  function upgradeData() {
    const { bindCode, cosOldVersionData, cosNewVersionData, bleOldVersionData, bleNewVersionData } =
      state
    return { bindCode, cosOldVersionData, cosNewVersionData, bleOldVersionData, bleNewVersionData }
  }
  watch(
    () => device.sessionId,
    () => {
      Object.assign(state, {
        bindCode: '',
        cosOldVersionData: '',
        cosNewVersionData: '',
        bleOldVersionData: '',
        bleNewVersionData: '',
        isCosUpdate: false,
        cosUpdateStatus: '0',
        supportCode: 0
      })
      upgradeAttempt = undefined
    },
    { flush: 'sync' }
  )
  function changeCode(code: number) {
    state.supportCode = code
  }
  function fail(error: unknown, stage: string) {
    if (!operation.active() || (error as { code?: string })?.code === 'OPERATION_CANCELLED') return
    const result = typeof error === 'string' ? error : (error as { result?: unknown })?.result
    if (result === 'device_session_changed' || result === 'device_bind_check_failed') {
      upgradeAttempt = undefined
      device.invalidateDeviceData()
      state.errorInfo = operationError(error)
      state.errorStage = stage
      recovery.offer(error, updateFirmware, { reconnectOnly: true })
      return
    }
    state.errorInfo = operationError(error)
    state.errorStage = stage
    state.isCosUpdate = true
    device.isCosUpdate = true
    state.cosUpdateStatus = '1'
    changeCode(3)
  }
  async function checkFirmwareVersion(
    onVersion?: () => void,
    isCurrent: () => boolean = operation.active
  ) {
    state.errorInfo = ''
    const version = await callDevice('getFirmwareVersion')
    if (!operation.active() || !isCurrent()) return
    if (!version.isSuccess) {
      state.isCosUpdate = false
      state.cosUpdateStatus = '2'
      state.errorInfo = operationError(version)
      state.errorStage = 'check'
      changeCode(5)
      return
    }
    state.cosOldVersionData = version.result
    device.cosOldVersionData = version.result
    onVersion?.()
    const update = await callDevice('cosCheckUpdate')
    if (!operation.active() || !isCurrent()) return
    if (!update.isSuccess) {
      state.isCosUpdate = false
      state.cosUpdateStatus = '2'
      state.errorInfo = operationError(update)
      state.errorStage = 'check'
      changeCode(5)
      return
    }
    state.cosNewVersionData = update.result.latestCosVersion
    state.bleNewVersionData = update.result.latestBleVersion
    const cosChanged =
      Boolean(state.cosNewVersionData) && state.cosOldVersionData !== state.cosNewVersionData
    if (kind === 'manager') {
      state.isCosUpdate = cosChanged
    } else {
      const empty = !state.cosNewVersionData && !state.bleNewVersionData
      state.isCosUpdate =
        !empty &&
        (state.cosOldVersionData !== state.cosNewVersionData ||
          state.bleOldVersionData !== state.bleNewVersionData)
    }
    state.cosUpdateStatus = state.isCosUpdate ? '1' : '0'
    if (state.isCosUpdate) {
      device.isCosUpdate = true
      device.cosNewVersionData = state.cosNewVersionData
      if (kind === 'setting')
        device.bleNewVersionData = device.installedBleVersion || state.bleNewVersionData
    }
  }
  async function cosUpdateWalletAddress(current: () => boolean = operation.active) {
    const installed = await callDevice('getInstalledApplets')
    if (!current()) return
    if (!installed.isSuccess) return fail(installed, 'restore')
    const result = await callDevice('writeWalletAddress', {
      name: installed.result.list.map(item => item.name) as WalletChain[],
      filePath: app.userPath
    })
    if (!current()) return
    if (!result.isSuccess) return fail(result, 'restore')
    state.isCosUpdate = false
    state.cosUpdateStatus = '0'
    state.cosOldVersionData = state.cosNewVersionData
    device.isCosUpdate = false
    device.cosOldVersionData = state.cosNewVersionData
    device.cosNewVersionData = state.cosNewVersionData
    if (kind === 'setting') {
      state.bleOldVersionData = state.bleNewVersionData
      device.bleOldVersionData = state.bleNewVersionData
      device.bleNewVersionData = state.bleNewVersionData
    }
    changeCode(2)
    device.deviceInfo = null
    upgradeAttempt = undefined
  }
  async function updateFirmwareWithinOperation() {
    if (state.busy || !operation.active()) return
    state.busy = true
    state.errorInfo = ''
    state.errorStage = ''
    let sessionId = device.sessionId
    const current = () => operation.active() && device.sessionId === sessionId
    try {
      if (
        upgradeAttempt &&
        upgradeAttempt.seid.toUpperCase() !== device.connectedSeid.toUpperCase()
      )
        return fail('device_session_changed', 'connect')
      const data = upgradeAttempt?.data || upgradeData()
      const connected = await refreshDeviceIdentity(callDevice, device, operation.active, {
        hideCachedData: false,
        firmwareRecovery: Boolean(upgradeAttempt),
        preserveOnTransportError: true
      })
      if (!connected.isSuccess) {
        if (connected.code === 'OPERATION_CANCELLED') return
        if (
          connected.result === 'device_session_changed' ||
          connected.result === 'device_bind_check_failed'
        ) {
          upgradeAttempt = undefined
          state.errorInfo = operationError(connected)
          state.errorStage = 'connect'
          recovery.offer(connected, updateFirmware, { reconnectOnly: true })
          return
        }
        // A transport error can be retried without discarding the upgrade inputs.
        Object.assign(state, data)
        return fail(connected, 'connect')
      }
      sessionId = device.sessionId
      const needsBinding = kind === 'manager' || data.cosOldVersionData !== data.cosNewVersionData
      if (needsBinding && !data.bindCode && !upgradeAttempt) {
        const binding = await callDevice('exportBindCode')
        if (!current()) return
        if (!binding.isSuccess) return fail(binding, 'store')
        const confirmed = await refreshDeviceIdentity(callDevice, device, operation.active, {
          hideCachedData: false,
          preserveOnTransportError: true
        })
        if (!confirmed.isSuccess) {
          if (confirmed.code === 'OPERATION_CANCELLED') return
          if (
            confirmed.result === 'device_session_changed' ||
            confirmed.result === 'device_bind_check_failed'
          ) {
            state.errorInfo = operationError(confirmed)
            state.errorStage = 'connect'
            recovery.offer(confirmed, updateFirmware, { reconnectOnly: true })
            return
          }
          return fail(confirmed, 'connect')
        }
        if (!current()) return
        data.bindCode = binding.result
      }
      Object.assign(state, data)
      upgradeAttempt = { seid: device.connectedSeid, data }
      changeCode(1)
      const updated = await callDevice('cosUpdate')
      if (!current()) return
      if (!updated.isSuccess || updated.result !== constants.RESULT_STATUS_SUCCESS)
        return fail(updated, 'update')
      if (kind === 'manager' || state.cosOldVersionData !== state.cosNewVersionData) {
        const bound = await callDevice('deviceBindAcquire', state.bindCode)
        if (!current()) return
        if (!bound.isSuccess || bound.result !== constants.RESULT_STATUS_SUCCESS)
          return fail(bound, 'bind')
        const stored = await callDevice('importBindCode', state.bindCode)
        if (!current()) return
        if (!stored.isSuccess) return fail(stored, 'store')
        await cosUpdateWalletAddress(current)
      } else if (state.bleOldVersionData !== state.bleNewVersionData) {
        state.isCosUpdate = false
        state.bleOldVersionData = state.bleNewVersionData
        device.isCosUpdate = false
        device.installedBleVersion = state.bleNewVersionData
        changeCode(2)
        device.deviceInfo = null
        upgradeAttempt = undefined
      }
    } catch (error) {
      if (current()) fail(error, state.errorStage || 'update')
    } finally {
      state.busy = false
    }
  }
  function updateFirmware() {
    return operation.run(updateFirmwareWithinOperation)
  }
  function isShowalert() {
    if (state.bleOldVersionData !== state.bleNewVersionData) changeCode(6)
    else void updateFirmware()
  }
  return {
    state,
    changeCode,
    checkFirmwareVersion,
    cosUpdateWalletAddress,
    updateFirmware,
    updateFirmwareWithinOperation,
    isShowalert
  }
}
