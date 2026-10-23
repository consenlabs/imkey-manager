import { reactive } from 'vue'
import constants from '../../common/constants'
import { operationError } from './operationError'
import { useDeviceOperation } from './useDeviceOperation'
import { useDeviceStore } from '../store'
import { connectDeviceSession, isSessionRecoveryError } from './deviceSession'
import { useDeviceRecovery } from './useDeviceRecovery'

export function useSecureCheck() {
  const scope = useDeviceOperation()
  const call = scope.call
  const device = useDeviceStore()
  const recovery = useDeviceRecovery(scope)
  const state = reactive({
    status: 'idle' as 'idle' | 'checking' | 'success' | 'failed',
    errorInfo: ''
  })

  function fail(error: unknown) {
    if (!scope.active()) return
    state.errorInfo = operationError(error)
    state.status = 'failed'
    if (isSessionRecoveryError(error)) {
      const result = typeof error === 'string' ? error : (error as { result?: unknown })?.result
      recovery.offer(error, async () => check(), {
        reconnectOnly: result === 'device_session_changed' || result === 'device_bind_check_failed'
      })
    }
  }

  function check() {
    if (!scope.active() || state.status === 'checking') return
    state.status = 'checking'
    state.errorInfo = ''
    return scope.run(async () => {
      try {
        const connected = await connectDeviceSession(call, device)
        if (!connected.isSuccess || connected.result !== constants.RESULT_STATUS_SUCCESS)
          return fail(connected)
        const checked = await call('checkDevice')
        if (!checked.isSuccess || checked.result !== constants.RESULT_STATUS_SUCCESS)
          return fail(checked)
        if (scope.active()) state.status = 'success'
      } catch (error) {
        fail(error)
      }
    }, 'secureCheck')
  }

  return { state, check }
}
