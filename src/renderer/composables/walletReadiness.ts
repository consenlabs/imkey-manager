import type { callDevice } from '../device'
import type { DeviceResult } from '../../shared/deviceContract'

// Wallet readiness on the Manager's HID connection is established using the
// existing BTC xpub read, which checks the device binding before deriving it.
export async function checkWalletReadiness(
  call: typeof callDevice,
  userPath: string
): Promise<DeviceResult<string>> {
  const result = await call('getBTCXpub', userPath)
  if (!result.isSuccess) return result
  if (typeof result.result !== 'string' || !result.result.startsWith('xpub'))
    return { isSuccess: false, result: 'invalid_wallet_response' }
  return result
}
