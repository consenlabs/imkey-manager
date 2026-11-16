import { describe, expect, it, vi } from 'vitest'
import type { callDevice } from '../../src/renderer/device'
import { checkWalletReadiness } from '../../src/renderer/composables/walletReadiness'

describe('device wallet lifecycle readiness', () => {
  it('accepts only the ready lifecycle without reading an xpub', async () => {
    const call = vi.fn().mockResolvedValue({ isSuccess: true, result: 'life_time_wallet_ready' })
    expect(await checkWalletReadiness(call as typeof callDevice)).toEqual({
      isSuccess: true,
      result: 'life_time_wallet_ready'
    })
    expect(call).toHaveBeenCalledExactlyOnceWith('getLifeTime')
  })

  it.each([
    'life_time_device_inited',
    'life_time_device_activated',
    'life_time_unset_pin',
    'life_time_wallet_unready',
    'life_time_wallet_creatting',
    'life_time_wallet_recovering'
  ])('blocks and preserves the known non-ready state %s', async status => {
    const call = vi.fn().mockResolvedValue({ isSuccess: true, result: status })
    expect(await checkWalletReadiness(call as typeof callDevice)).toEqual({
      isSuccess: false,
      result: status
    })
  })

  it.each(['life_time_unknown', '', 'unexpected', null])(
    'blocks unknown lifecycle %s without exposing arbitrary response text',
    async status => {
      const call = vi.fn().mockResolvedValue({ isSuccess: true, result: status })
      expect(await checkWalletReadiness(call as typeof callDevice)).toEqual({
        isSuccess: false,
        result: 'wallet_status_unknown'
      })
    }
  )

  it('preserves a device error without treating it as an empty wallet', async () => {
    const failure = { isSuccess: false, result: 'get_life_time_error' }
    const call = vi.fn().mockResolvedValue(failure)
    expect(await checkWalletReadiness(call as typeof callDevice)).toEqual(failure)
  })
})
