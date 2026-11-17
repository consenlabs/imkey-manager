import { beforeEach, expect, it, vi } from 'vitest'
import type { DeviceResult } from '../../src/shared/deviceContract'
import type { callDevice } from '../../src/renderer/device'
import { connectDeviceSession } from '../../src/renderer/composables/deviceSession'

const call = vi.fn<(method: string) => Promise<DeviceResult>>()
beforeEach(() => {
  call.mockReset().mockImplementation(async method => ({
    isSuccess: true,
    result:
      method === 'getSeid'
        ? 'original-device'
        : method === 'deviceBindCheck'
          ? 'bound_this'
          : 'success'
  }))
})
it('checks identity and current binding only during an explicit operation', async () => {
  const session = { connectedSeid: 'original-device', bindStatus: '' }
  expect(call).not.toHaveBeenCalled()
  expect(await connectDeviceSession(call as typeof callDevice, session)).toEqual({
    isSuccess: true,
    result: 'success'
  })
  expect(call.mock.calls.map(([method]) => method)).toEqual([
    'connectDevice',
    'getSeid',
    'deviceBindCheck'
  ])
  expect(session.bindStatus).toBe('bound_this')
})
it('rejects a different device before binding checks or business operations', async () => {
  const session = { connectedSeid: 'other-device', bindStatus: 'bound_this' }
  expect(await connectDeviceSession(call as typeof callDevice, session)).toEqual({
    isSuccess: false,
    result: 'device_session_changed'
  })
  expect(session.connectedSeid).toBe('other-device')
  expect(call.mock.calls.map(([method]) => method)).toEqual(['connectDevice', 'getSeid'])
})
it.each(['unbound', 'bound_other', '', 'unknown'])('rejects changed binding %s', async status => {
  call.mockImplementation(async method => ({
    isSuccess: true,
    result:
      method === 'deviceBindCheck' ? status : method === 'getSeid' ? 'original-device' : 'success'
  }))
  const session = { connectedSeid: 'original-device', bindStatus: 'bound_this' }
  expect(await connectDeviceSession(call as typeof callDevice, session)).toEqual({
    isSuccess: false,
    result: 'device_session_changed'
  })
})
it('allows setup to connect an unbound device without assuming a binding', async () => {
  const session = { connectedSeid: '', bindStatus: '' }
  await connectDeviceSession(call as typeof callDevice, session, { requireBinding: false })
  expect(session.connectedSeid).toBe('original-device')
  expect(call).not.toHaveBeenCalledWith('deviceBindCheck')
})
it.each(['connectDevice', 'getSeid', 'deviceBindCheck'])(
  'preserves %s errors and stops immediately',
  async failed => {
    call.mockImplementation(async method =>
      method === failed
        ? { isSuccess: false, result: 'device_operation_timeout' }
        : { isSuccess: true, result: method === 'getSeid' ? 'original-device' : 'success' }
    )
    expect(
      await connectDeviceSession(call as typeof callDevice, {
        connectedSeid: 'original-device',
        bindStatus: 'bound_this'
      })
    ).toEqual({ isSuccess: false, result: 'device_operation_timeout' })
    expect(call.mock.calls.at(-1)?.[0]).toBe(failed)
  }
)
