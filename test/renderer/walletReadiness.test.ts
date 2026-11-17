import { describe, expect, it, vi } from 'vitest'
import type { callDevice } from '../../src/renderer/device'
import { checkWalletReadiness } from '../../src/renderer/composables/walletReadiness'

describe('device wallet readiness over HID', () => {
  it('uses a valid BTC public key as the wallet proof', async () => {
    const result = { isSuccess: true, result: 'xpub-ready' }
    const call = vi.fn().mockResolvedValue(result)
    expect(await checkWalletReadiness(call as typeof callDevice, '/user')).toEqual(result)
    expect(call).toHaveBeenCalledExactlyOnceWith('getBTCXpub', '/user')
  })

  it.each(['', 'unexpected', null])('rejects an invalid public key response %s', async result => {
    const call = vi.fn().mockResolvedValue({ isSuccess: true, result })
    expect(await checkWalletReadiness(call as typeof callDevice, '/user')).toEqual({
      isSuccess: false,
      result: 'invalid_wallet_response'
    })
    expect(call).toHaveBeenCalledExactlyOnceWith('getBTCXpub', '/user')
  })

  it.each([
    'imkey_wallet_not_created',
    'imkey_applet_not_exist',
    'imkey_command_data_error',
    'device_not_connected',
    'device_bind_check_failed'
  ])('preserves the actual wallet read failure %s', async result => {
    const failure = { isSuccess: false, result, operationId: 'op-123' }
    const call = vi.fn().mockResolvedValue(failure)
    expect(await checkWalletReadiness(call as typeof callDevice, '/user')).toEqual(failure)
    expect(call).toHaveBeenCalledExactlyOnceWith('getBTCXpub', '/user')
  })
})
