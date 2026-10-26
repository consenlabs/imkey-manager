import { describe, expect, it } from 'vitest'
import { createDeviceHandlers } from '../src/service/handlers'
import { DeviceApi } from '../src/service/deviceApi'
import { api, create, decode, device, invoke } from '../src/service/protobuf'
import { isValidDeviceParams } from '../src/shared/deviceContract'

describe('device SN metadata contract', () => {
  it.each([
    [true, '2024-02-29'],
    [true, ''],
    [false, '']
  ] as const)('decodes activation=%s and date=%s without changing the date', (activated, date) => {
    const requests: string[] = []
    const handlers = createDeviceHandlers(
      {
        callImKeyApi(hex) {
          const action = decode(api, 'ImkeyAction', hex)
          requests.push(invoke<string>(action, 'getMethod'))
          expect(invoke(action, 'hasParam')).toBe(false)
          return Buffer.from(
            create(device, 'DeviceSnCheckRes', {
              setSnCheckResult: true,
              setIsActivate: activated,
              setActivateTime: date
            }).serializeBinary()
          ).toString('hex')
        },
        getLastErrorMessage: () => ''
      },
      '/fixture/user'
    )
    expect(handlers.deviceSnCheck()).toEqual({
      isSuccess: true,
      result: { snCheckResult: true, isActivate: activated, activateTime: date }
    })
    expect(requests).toEqual(['device_sn_check'])
  })

  it('retains the same protobuf wire tags as core', () => {
    const value = create(device, 'DeviceSnCheckRes', {
      setSnCheckResult: true,
      setIsActivate: true,
      setActivateTime: '2024-02-29'
    })
    expect(Buffer.from(value.serializeBinary()).toString('hex')).toBe(
      '080110011a0a323032342d30322d3239'
    )
  })

  it.each(['', '0', 'not-hex', 'ff'])('rejects an invalid SN connector response %j', hex => {
    const native = new DeviceApi(
      { callImKeyApi: () => hex, getLastErrorMessage: () => '' },
      '/fixture/user'
    )
    expect(native.deviceMethod('device_sn_check')).toMatchObject({
      isSuccess: false,
      code: 'INVALID_RESPONSE'
    })
  })

  it('preserves the SN server business error', () => {
    const native = new DeviceApi(
      { callImKeyApi: () => '', getLastErrorMessage: () => 'imkey_tsm_device_sn_check_fail' },
      '/fixture/user'
    )
    expect(native.deviceMethod('device_sn_check')).toEqual({
      isSuccess: false,
      result: 'imkey_tsm_device_sn_check_fail'
    })
  })

  it('only accepts an empty parameter rather than a caller-provided serial number', () => {
    expect(isValidDeviceParams('deviceSnCheck', undefined)).toBe(true)
    expect(isValidDeviceParams('deviceSnCheck', 'arbitrary-sn')).toBe(false)
    expect(isValidDeviceParams('deviceSnCheck', { sn: 'arbitrary-sn' })).toBe(false)
  })
})
