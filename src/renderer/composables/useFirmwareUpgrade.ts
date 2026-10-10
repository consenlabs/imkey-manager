import { reactive } from 'vue'
import constants from '../../common/constants'
import { useDeviceOperation, type DeviceOperation } from './useDeviceOperation'
import { useAppStore } from '../store/app'
import { useDeviceStore } from '../store/device'
import { operationError } from './operationError'
import type { WalletChain } from '../../shared/deviceContract'

export function useFirmwareUpgrade(kind: 'manager' | 'setting', scope?: DeviceOperation) {
  const operation = scope || useDeviceOperation()
  const callDevice = operation.call
  const device = useDeviceStore()
  const app = useAppStore()
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
  function changeCode(code: number) {
    state.supportCode = code
  }
  function fail(error: unknown, stage: string) {
    if (!operation.active()) return
    state.errorInfo = operationError(error)
    state.errorStage = stage
    state.isCosUpdate = true
    device.isCosUpdate = true
    state.cosUpdateStatus = '1'
    changeCode(3)
  }
  async function checkFirmwareVersion(onVersion?: () => void) {
    state.errorInfo = ''
    const version = await callDevice('getFirmwareVersion')
    if (!operation.active()) return
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
    if (!operation.active()) return
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
  async function cosUpdateWalletAddress() {
    const installed = await callDevice('getInstalledApplets')
    if (!installed.isSuccess) return fail(installed, 'restore')
    const result = await callDevice('writeWalletAddress', {
      name: installed.result.list.map(item => item.name) as WalletChain[],
      filePath: app.userPath
    })
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
  }
  async function updateFirmwareWithinOperation() {
    if (state.busy || !operation.active()) return
    state.busy = true
    state.errorInfo = ''
    state.errorStage = ''
    try {
      changeCode(1)
      const connected = await callDevice('connectDevice')
      if (!connected.isSuccess) return fail(connected, 'connect')
      const updated = await callDevice('cosUpdate')
      if (!updated.isSuccess || updated.result !== constants.RESULT_STATUS_SUCCESS)
        return fail(updated, 'update')
      if (kind === 'manager' || state.cosOldVersionData !== state.cosNewVersionData) {
        const bound = await callDevice('deviceBindAcquire', state.bindCode)
        if (!bound.isSuccess || bound.result !== constants.RESULT_STATUS_SUCCESS)
          return fail(bound, 'bind')
        const stored = await callDevice('importBindCode', state.bindCode)
        if (!stored.isSuccess) return fail(stored, 'store')
        await cosUpdateWalletAddress()
      } else if (state.bleOldVersionData !== state.bleNewVersionData) {
        state.isCosUpdate = false
        state.bleOldVersionData = state.bleNewVersionData
        device.isCosUpdate = false
        device.installedBleVersion = state.bleNewVersionData
        changeCode(2)
      }
    } catch (error) {
      fail(error, state.errorStage || 'update')
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
