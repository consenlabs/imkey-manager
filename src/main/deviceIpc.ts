import { failureCode } from '../shared/deviceErrors'
import { noDiagnostics, type DiagnosticLog } from './diagnostics'
import { ipcMain, type BrowserWindow } from 'electron'
import { isDeviceMethod, type DeviceResult } from '../shared/deviceContract'
import { assertTrustedSender, validateDeviceCall, validateDeviceContext } from './ipcPolicy'
import type { ServiceClient } from './serviceClient'
import type { BindCodeStore } from './BindCodeStore'
export function registerDeviceIpc(
  getWindow: () => BrowserWindow | null,
  service: ServiceClient,
  store: BindCodeStore,
  log: DiagnosticLog = noDiagnostics
): void {
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
        if (method === 'importBindCode') result = await store.importBindCode(params as string)
        else if (method === 'exportBindCode') result = await store.exportBindCode()
        else if (method === 'isExistBindCodeFile') result = await store.isExistBindCodeFile()
        else
          return await (context
            ? service.call(method, params, context)
            : service.call(method, params))
        log(result.isSuccess ? 'info' : 'warn', 'binding.storage-finished', {
          method,
          operationId: context?.operationId,
          stage: context?.stage || method,
          success: result.isSuccess,
          durationMs: Date.now() - startedAt,
          code: result.isSuccess ? undefined : failureCode(result)
        })
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
