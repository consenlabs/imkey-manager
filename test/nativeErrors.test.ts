import { expect, it } from 'vitest'
import { createDeviceHandlers } from '../src/service/handlers'
import { DeviceApi } from '../src/service/deviceApi'
import { nativeErrorMessage } from '../src/service/protobuf'

it.each(['get_seid_error', 'device_not_connected', 'deadbeef', 'Assertion failed'])(
  'preserves native plain text %s',
  error => {
    const api = new DeviceApi({ callImKeyApi: () => '', getLastErrorMessage: () => error }, '/user')
    expect(api.deviceMethod('get_seid')).toEqual({ isSuccess: false, result: error })
  }
)
it('decodes Windows ErrorResponse and preserves malformed or empty-message payloads', () => {
  expect(nativeErrorMessage('120e6765745f736569645f6572726f72')).toBe('get_seid_error')
  expect(nativeErrorMessage('ffff')).toBe('ffff')
  expect(nativeErrorMessage('0800')).toBe('0800')
  expect(nativeErrorMessage(' ')).toBeTruthy()
})
it('preserves check_update native failure rather than replacing it with a JS TypeError', () => {
  const api = new DeviceApi(
    { callImKeyApi: () => '', getLastErrorMessage: () => 'server_unavailable' },
    '/user'
  )
  expect(api.applets(false)).toEqual({ isSuccess: false, result: 'server_unavailable' })
})
it.each(['', '0', 'not-hex', 'ff'])(
  'rejects malformed nonempty-schema responses (%s)',
  response => {
    const api = new DeviceApi(
      { callImKeyApi: () => response, getLastErrorMessage: () => '' },
      '/user'
    )
    expect(api.deviceMethod('get_seid')).toMatchObject({
      isSuccess: false,
      code: 'INVALID_RESPONSE'
    })
  }
)

it('does not report empty wallet addresses as successful when a chain fails', () => {
  let count = 0
  const handlers = createDeviceHandlers(
    {
      callImKeyApi: () => {
        count++
        return count === 1 ? '0a0a626f756e645f74686973' : ''
      },
      getLastErrorMessage: () => (count === 1 ? '' : 'device_not_connected')
    },
    '/user'
  )
  expect(handlers.genWalletAddress()).toEqual({
    isSuccess: false,
    result: 'device_not_connected',
    failed: ['Ethereum']
  })
  expect(count).toBe(2)
})
