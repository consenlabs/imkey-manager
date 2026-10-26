import { onMounted, onUnmounted, reactive } from 'vue'
import constants from '../../common/constants'
import { operationError } from './operationError'
import { useDeviceOperation, type DeviceOperation } from './useDeviceOperation'
import { useDeviceStore } from '../store'
import { useDeviceRecovery } from './useDeviceRecovery'
import { refreshDeviceIdentity } from './deviceIdentity'

export function useSecureCheck(
  options: { scope?: DeviceOperation; checkIdentityOnMount?: boolean } = {}
) {
  const scope = options.scope || useDeviceOperation()
  const call = scope.call
  const device = useDeviceStore()
  const recovery = useDeviceRecovery(scope)
  let ownedRevision: number | undefined
  const state = reactive({
    get status() {
      if (device.verification.status === 'checking') return 'checking' as const
      return device.identityReady ? device.verification.status : ('idle' as const)
    },
    get errorInfo() {
      return device.verification.errorInfo
    },
    get activationStatus() {
      return device.identityReady ? device.verification.activationStatus : null
    },
    get activatedAt() {
      return device.identityReady ? device.verification.activatedAt : null
    },
    get identityChecking() {
      return device.identityChecking
    }
  })

  function fail(error: unknown, retry: () => Promise<unknown> = async () => check()) {
    if (!scope.active()) return
    device.clearVerification()
    device.verification.errorInfo = operationError(error)
    const result = typeof error === 'string' ? error : (error as { result?: unknown })?.result
    recovery.offer(error, retry, {
      reconnectOnly: result === 'device_session_changed' || result === 'device_bind_check_failed'
    })
  }

  function enter() {
    device.prepareIdentityCheck()
    return scope.run(async () => {
      try {
        const result = await refreshDeviceIdentity(call, device, scope.active)
        if (!result.isSuccess && result.code !== 'OPERATION_CANCELLED') fail(result, enter)
      } catch (error) {
        if (!scope.active()) return
        device.invalidateDeviceData()
        fail(error, enter)
      }
    }, 'identity')
  }

  function check() {
    if (!scope.active() || device.verification.status === 'checking') return
    device.clearVerification()
    ownedRevision = device.verificationRevision
    const revision = ownedRevision
    const current = () => scope.active() && device.verificationRevision === revision
    device.verification.status = 'checking'
    return scope.run(async () => {
      try {
        const connected = await refreshDeviceIdentity(call, device, scope.active)
        if (!connected.isSuccess) {
          if (connected.code !== 'OPERATION_CANCELLED') fail(connected)
          return
        }
        if (!current()) return
        const checked = await call('checkDevice')
        if (!current()) return
        if (!checked.isSuccess || checked.result !== constants.RESULT_STATUS_SUCCESS)
          return fail(checked)
        const metadata = await call('deviceSnCheck')
        if (!current()) return
        if (!metadata.isSuccess) return fail(metadata)
        if (!metadata.result.snCheckResult) return fail('imkey_tsm_device_sn_check_fail')
        // Do not publish a result if the device was replaced during the server checks.
        const confirmed = await refreshDeviceIdentity(call, device, scope.active)
        if (!confirmed.isSuccess) {
          if (confirmed.code !== 'OPERATION_CANCELLED') fail(confirmed)
          return
        }
        if (!current()) return
        device.verification = {
          status: 'success',
          activationStatus: metadata.result.isActivate,
          activatedAt: metadata.result.activateTime || null,
          errorInfo: ''
        }
      } catch (error) {
        if (current()) fail(error)
      } finally {
        if (current() && device.verification.status === 'checking') device.clearVerification()
      }
    }, 'secureCheck')
  }

  if (options.checkIdentityOnMount !== false) {
    device.prepareIdentityCheck()
    onMounted(() => void enter())
  }
  onUnmounted(() => {
    if (ownedRevision === device.verificationRevision && device.verification.status === 'checking')
      device.clearVerification()
  })
  return { state, check, enter }
}
