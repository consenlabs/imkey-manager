import { failureCode } from '../shared/deviceErrors'
import { noDiagnostics, type DiagnosticLog } from './diagnostics'
import { ipcMain, type BrowserWindow } from 'electron'
import {
  isDeviceMethod,
  type DeviceResult,
  type FirmwareRecoveryCheckpoint
} from '../shared/deviceContract'
import {
  assertTrustedSender,
  validateDeviceCall,
  validateDeviceContext,
  validateDeviceTrace
} from './ipcPolicy'
import type { ServiceClient } from './serviceClient'
import type { BindCodeStore } from './BindCodeStore'
import type { FirmwareRecoveryStore } from './FirmwareRecoveryStore'
export function registerDeviceIpc(
  getWindow: () => BrowserWindow | null,
  service: ServiceClient,
  store: BindCodeStore,
  log: DiagnosticLog = noDiagnostics,
  recoveryStore?: FirmwareRecoveryStore
): void {
  ipcMain.handle('device:trace', async (event, trace: unknown): Promise<void> => {
    assertTrustedSender(event, getWindow())
    validateDeviceTrace(trace)
    try {
      log(
        trace.phase === 'failed' ? 'warn' : 'info',
        trace.phase === 'failed' ? 'device.operation-failed' : 'device.operation',
        trace
      )
    } catch {
      // Diagnostic delivery must never change device work.
    }
  })
  ipcMain.handle(
    'device:call',
    async (event, method: unknown, params: unknown, context: unknown): Promise<DeviceResult> => {
      assertTrustedSender(event, getWindow())
      validateDeviceCall(method, params)
      validateDeviceContext(context)
      if (!isDeviceMethod(method)) throw new Error('Unknown device method')
      try {
        const startedAt = Date.now()
        let result: DeviceResult
        const recoveryMethod =
          method === 'getFirmwareRecovery' ||
          method === 'saveFirmwareRecovery' ||
          method === 'clearFirmwareRecovery'
        if (recoveryMethod) {
          if (!recoveryStore)
            result = {
              isSuccess: false,
              result: 'firmware_recovery_unavailable',
              code: 'FIRMWARE_RECOVERY_UNAVAILABLE'
            }
          else if (method === 'getFirmwareRecovery')
            result = await recoveryStore.getFirmwareRecovery(context)
          else if (method === 'saveFirmwareRecovery')
            result = await recoveryStore.saveFirmwareRecovery(
              params as FirmwareRecoveryCheckpoint,
              context
            )
          else
            result = await recoveryStore.clearFirmwareRecovery(params as { seid: string }, context)
        } else if (method === 'importBindCode')
          result = await (context
            ? store.importBindCode(params as string, context)
            : store.importBindCode(params as string))
        else if (method === 'exportBindCode')
          result = await (context ? store.exportBindCode(context) : store.exportBindCode())
        else if (method === 'isExistBindCodeFile')
          result = await (context
            ? store.isExistBindCodeFile(context)
            : store.isExistBindCodeFile())
        else
          return await (context
            ? service.call(method, params, context)
            : service.call(method, params))
        log(
          result.isSuccess ? 'info' : 'warn',
          recoveryMethod ? 'firmware.recovery-storage-finished' : 'binding.storage-finished',
          {
            method,
            operationId: context?.operationId,
            stage: context?.stage || method,
            success: result.isSuccess,
            durationMs: Date.now() - startedAt,
            code: result.isSuccess ? undefined : failureCode(result)
          }
        )
        return !result.isSuccess && context
          ? {
              ...result,
              code: failureCode(result),
              method,
              stage: context.stage || method,
              operationId: context.operationId
            }
          : result
      } catch (error) {
        log('error', 'device.ipc-failed', {
          method,
          operationId: context?.operationId,
          stage: context?.stage || method,
          code: 'DEVICE_OPERATION_FAILED'
        })
        return { isSuccess: false, result: error instanceof Error ? error.message : String(error) }
      }
    }
  )
}
