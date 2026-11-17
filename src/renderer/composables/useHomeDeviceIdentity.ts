import { computed, onMounted, ref } from 'vue'
import { useDeviceStore } from '../store'
import { refreshDeviceIdentity } from './deviceIdentity'
import { useDeviceOperation } from './useDeviceOperation'
import { useDeviceRecovery } from './useDeviceRecovery'

// A cached verification belongs to the previously observed device, not whatever
// is currently connected. Do not display it until this page confirms identity.
export function useHomeDeviceIdentity() {
  const scope = useDeviceOperation()
  const device = useDeviceStore()
  const recovery = useDeviceRecovery(scope)
  const confirmed = ref(false)
  const ready = computed(() => confirmed.value && device.identityReady && !device.identityChecking)
  const checking = ref(true)
  let pending = false

  async function confirm(): Promise<void> {
    if (!scope.active() || pending) return
    pending = true
    checking.value = true
    confirmed.value = false
    try {
      await scope.run(async () => {
        const result = await refreshDeviceIdentity(scope.call, device, scope.active, {
          hideCachedData: false
        })
        if (!scope.active()) return
        if (!result.isSuccess) {
          if (result.code !== 'OPERATION_CANCELLED') recovery.offer(result, confirm)
          return
        }
        confirmed.value = true
      }, 'homeIdentity')
    } finally {
      pending = false
      if (scope.active()) checking.value = false
    }
  }

  onMounted(() => void confirm())
  return { ready, checking, confirm }
}
