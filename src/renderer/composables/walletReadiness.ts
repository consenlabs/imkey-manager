import type { callDevice } from '../device'
import type { DeviceResult } from '../../shared/deviceContract'

// Device lifecycle is independent of a particular coin app or wallet address.
export async function checkWalletReadiness(call: typeof callDevice): Promise<DeviceResult<string>> {
  const result = await call('getLifeTime')
  if (!result.isSuccess) return result
  if (result.result === 'life_time_wallet_ready') return result
  const knownNotReady = [
    'life_time_device_inited',
    'life_time_device_activated',
    'life_time_unset_pin',
    'life_time_wallet_unready',
    'life_time_wallet_creatting',
    'life_time_wallet_recovering'
  ]
  return {
    isSuccess: false,
    result: knownNotReady.includes(result.result) ? result.result : 'wallet_status_unknown'
  }
}
