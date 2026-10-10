import { callDevice as defaultCall } from '../device'
import type { DeviceOperation } from './useDeviceOperation'
import { useAppStore, useDeviceStore } from '../store'
import type { WalletChain } from '../../shared/deviceContract'
import constants from '../../common/constants'
import { operationError } from './operationError'

export function useConnectionFirmware(
  changeState: (status: number) => void,
  fail: (message: string, status: number) => void,
  check: () => Promise<void>,
  operation?: DeviceOperation
) {
  const callDevice = operation?.call || defaultCall
  const app = useAppStore()
  const device = useDeviceStore()
  async function cosUpdateWalletAddress(): Promise<void> {
    const installed = await callDevice('getInstalledApplets')
    if (!installed.isSuccess) {
      device.isCosUpdate = true
      fail(operationError(installed), 5)
      return
    }
    const restored = await callDevice('writeWalletAddress', {
      name: installed.result.list.map(entry => entry.name) as WalletChain[],
      filePath: app.userPath
    })
    if (restored.isSuccess) await check()
    else {
      device.isCosUpdate = true
      fail(operationError(restored), 5)
    }
  }
  async function toCosUpdate(): Promise<void> {
    changeState(6)
    const update = await callDevice('cosUpdate')
    if (!update.isSuccess || update.result !== constants.RESULT_STATUS_SUCCESS) {
      fail(operationError(update), 5)
      return
    }
    const binding = await callDevice('deviceBindCheck', app.userPath)
    if (!binding.isSuccess) {
      fail(operationError(binding), 4)
      return
    }
    const code = await callDevice('exportBindCode')
    if (!code.isSuccess) {
      fail(operationError(code), 5)
      return
    }
    const acquired = await callDevice('deviceBindAcquire', code.result)
    if (!acquired.isSuccess || acquired.result !== constants.RESULT_STATUS_SUCCESS) {
      fail(operationError(acquired), 5)
      return
    }
    const imported = await callDevice('importBindCode', code.result)
    if (!imported.isSuccess) {
      fail(operationError(imported), 5)
      return
    }
    await cosUpdateWalletAddress()
  }
  return { cosUpdateWalletAddress, toCosUpdate }
}
