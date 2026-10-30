import { getCurrentInstance, onUnmounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAppStore, useDeviceStore } from '../store'
import { useTranslation } from './useTranslation'
import { operationError } from './operationError'
import type { DeviceOperation } from './useDeviceOperation'

let promptOwner: symbol | undefined

export function useDeviceRecovery(operation?: Pick<DeviceOperation, 'active'>) {
  const router = useRouter()
  const device = useDeviceStore()
  const app = useAppStore()
  const { t, te } = useTranslation()
  const owner = Symbol('device-recovery')
  let mounted = true
  let changedNoticeOpen = false
  const active = () => mounted && (operation?.active() ?? true)

  async function returnToConnection(): Promise<void> {
    if (!active()) return
    device.$reset()
    await router.push('/connectDevice')
  }

  function offer(
    error: unknown,
    retry: () => Promise<unknown>,
    {
      reconnectOnly = false,
      stayOnCancel = false,
      message: customMessage
    }: { reconnectOnly?: boolean; stayOnCancel?: boolean; message?: string } = {}
  ): void {
    if (!active()) return
    const raw = typeof error === 'string' ? error : (error as { result?: string })?.result
    if (raw === 'device_session_changed' || raw === 'device_bind_check_failed') {
      if (app.deviceChanged) return
      app.deviceChanged = true
      if (promptOwner) {
        promptOwner = undefined
        ElMessageBox.close()
      }
      device.invalidateDeviceData()
      changedNoticeOpen = true
      void (async () => {
        try {
          await ElMessageBox.alert(
            t('m.imKeyManager.recovery_device_changed'),
            t('m.imKeyManager.device_changed_title'),
            {
              confirmButtonText: t('m.imKeyManager.ok'),
              customClass: 'device-recovery-dialog device-changed-dialog',
              modalClass: 'device-changed-overlay',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false
            }
          )
          if (!active()) return
          device.$reset()
          await router.replace('/connectDevice')
        } catch {
          // Programmatic closure on disposal must not replay a stale navigation.
        } finally {
          changedNoticeOpen = false
          app.deviceChanged = false
        }
      })()
      return
    }
    if (promptOwner || app.deviceChanged) return
    promptOwner = owner
    const messages: Record<string, string> = {
      device_session_restart_required: 'recovery_restart_required',
      device_operation_timeout: 'recovery_timeout',
      device_recovery_pending: 'recovery_pending'
    }
    const key = raw && Object.hasOwn(messages, raw) ? messages[raw] : undefined
    const detail = operationError(error)
    const diagnostic = detail.match(/ \[([a-z0-9-]{1,64})\]$/)?.[0] || ''
    const cause = diagnostic ? detail.slice(0, -diagnostic.length) : detail
    const causeKey = `m.imKeyCoreErrorInfo.${cause}`
    const translated = te?.(causeKey) ? `${t(causeKey)}${diagnostic}` : detail
    const message = customMessage
      ? `${customMessage}\n\n${translated}`
      : key
        ? t(`m.imKeyManager.${key}`)
        : `${t('m.imKeyManager.recovery_message')}\n\n${translated}`
    void (async () => {
      let action: 'retry' | 'reconnect' | undefined
      try {
        await ElMessageBox.confirm(message, t('m.imKeyManager.recovery_title'), {
          confirmButtonText: t(
            reconnectOnly ? 'm.imKeyManager.return_to_connection' : 'm.imKeyManager.retry'
          ),
          cancelButtonText: t(
            stayOnCancel ? 'm.imKeyManager.cancel' : 'm.imKeyManager.return_to_connection'
          ),
          showCancelButton: !reconnectOnly,
          showClose: !reconnectOnly,
          customClass: 'device-recovery-dialog',
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        })
        action = reconnectOnly ? 'reconnect' : 'retry'
      } catch (reason) {
        if (reason === 'cancel' && !reconnectOnly && !stayOnCancel) action = 'reconnect'
      } finally {
        if (promptOwner === owner) promptOwner = undefined
      }
      if (!action || !active()) return
      try {
        if (action === 'reconnect') await returnToConnection()
        else await retry()
      } catch (failure) {
        if (active()) offer(failure, retry, { reconnectOnly, stayOnCancel, message: customMessage })
      }
    })()
  }

  if (getCurrentInstance())
    onUnmounted(() => {
      mounted = false
      if (changedNoticeOpen) ElMessageBox.close()
      if (promptOwner === owner) {
        promptOwner = undefined
        ElMessageBox.close()
      }
    })
  return { offer, returnToConnection }
}
