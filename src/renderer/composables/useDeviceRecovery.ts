import { getCurrentInstance, onUnmounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useDeviceStore } from '../store'
import { useTranslation } from './useTranslation'
import { operationError } from './operationError'
import type { DeviceOperation } from './useDeviceOperation'

let promptOwner: symbol | undefined

export function useDeviceRecovery(operation?: Pick<DeviceOperation, 'active'>) {
  const router = useRouter()
  const device = useDeviceStore()
  const { t, te } = useTranslation()
  const owner = Symbol('device-recovery')
  let mounted = true
  const active = () => mounted && (operation?.active() ?? true)

  async function returnToConnection(): Promise<void> {
    if (!active()) return
    device.$reset()
    await router.push('/connectDevice')
  }

  function offer(
    error: unknown,
    retry: () => Promise<unknown>,
    { reconnectOnly = false }: { reconnectOnly?: boolean } = {}
  ): void {
    if (!active() || promptOwner) return
    promptOwner = owner
    const raw = typeof error === 'string' ? error : (error as { result?: string })?.result
    const messages: Record<string, string> = {
      device_session_changed: 'recovery_device_changed',
      device_session_restart_required: 'recovery_restart_required',
      device_operation_timeout: 'recovery_timeout',
      device_recovery_pending: 'recovery_pending',
      device_bind_check_failed: 'recovery_device_changed'
    }
    const key = raw && Object.hasOwn(messages, raw) ? messages[raw] : undefined
    const detail = operationError(error)
    const diagnostic = detail.match(/ \[([a-z0-9-]{1,64})\]$/)?.[0] || ''
    const cause = diagnostic ? detail.slice(0, -diagnostic.length) : detail
    const causeKey = `m.imKeyCoreErrorInfo.${cause}`
    const translated = te?.(causeKey) ? `${t(causeKey)}${diagnostic}` : detail
    const message = key
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
            reconnectOnly
              ? 'm.imKeyManager.continue_current_step'
              : 'm.imKeyManager.return_to_connection'
          ),
          customClass: 'device-recovery-dialog',
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        })
        action = reconnectOnly ? 'reconnect' : 'retry'
      } catch (reason) {
        if (reason === 'cancel' && !reconnectOnly) action = 'reconnect'
      } finally {
        if (promptOwner === owner) promptOwner = undefined
      }
      if (!action || !active()) return
      try {
        if (action === 'reconnect') await returnToConnection()
        else await retry()
      } catch (failure) {
        if (active()) offer(failure, retry, { reconnectOnly })
      }
    })()
  }

  if (getCurrentInstance())
    onUnmounted(() => {
      mounted = false
      if (promptOwner === owner) {
        promptOwner = undefined
        ElMessageBox.close()
      }
    })
  return { offer, returnToConnection }
}
