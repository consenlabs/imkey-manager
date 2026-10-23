import { describe, expect, it, vi } from 'vitest'
import { initializedHandlers } from '../src/service/initializedHandlers'
import { DeviceQueue } from '../src/service/queue'
import { createDeviceHandlers, type Handler } from '../src/service/handlers'
import { deviceMethods, type DeviceMethod } from '../src/shared/deviceContract'
import { api, create, decode, invoke } from '../src/service/protobuf'

function handlers() {
  const all = Object.fromEntries(
    deviceMethods.map(method => [method, () => ({ isSuccess: true, result: 'success' })])
  ) as Record<DeviceMethod, Handler>
  const initImKeyCore = vi.fn<Handler>().mockReturnValue({ isSuccess: true, result: 'success' })
  const connectDevice = vi.fn<Handler>().mockReturnValue({ isSuccess: true, result: 'success' })
  const getUserPath = vi.fn<Handler>().mockReturnValue({ isSuccess: true, result: '/user/' })
  return { ...all, initImKeyCore, connectDevice, getUserPath }
}

describe('native initialization in each utility process', () => {
  it('initializes before the first business request and reuses successful initialization', async () => {
    const native = handlers()
    const queue = new DeviceQueue(initializedHandlers(native))
    const requests = await Promise.all([
      queue.dispatch({ id: 1, method: 'connectDevice' }),
      queue.dispatch({ id: 2, method: 'connectDevice' }),
      queue.dispatch({ id: 3, method: 'initImKeyCore' })
    ])
    expect(requests.every(reply => reply.result.isSuccess)).toBe(true)
    expect(native.initImKeyCore).toHaveBeenCalledOnce()
    expect(native.connectDevice).toHaveBeenCalledTimes(2)
    expect(native.initImKeyCore.mock.invocationCallOrder[0]).toBeLessThan(
      native.connectDevice.mock.invocationCallOrder[0]
    )
  })

  it('returns initialization failure without executing business work and retries on the next request', async () => {
    const native = handlers()
    const failure = { isSuccess: false as const, result: 'initialization_failed' }
    native.initImKeyCore.mockReturnValueOnce(failure)
    const queue = new DeviceQueue(initializedHandlers(native))
    expect(await queue.dispatch({ id: 1, method: 'connectDevice' })).toEqual({
      id: 1,
      result: failure
    })
    expect(native.connectDevice).not.toHaveBeenCalled()
    expect(await queue.dispatch({ id: 2, method: 'connectDevice' })).toEqual({
      id: 2,
      result: { isSuccess: true, result: 'success' }
    })
    expect(native.initImKeyCore).toHaveBeenCalledTimes(2)
    expect(native.connectDevice).toHaveBeenCalledOnce()
  })

  it('does not cache a thrown initialization error', async () => {
    const native = handlers()
    native.initImKeyCore.mockImplementationOnce(() => {
      throw new Error('initialization_threw')
    })
    const queue = new DeviceQueue(initializedHandlers(native))
    expect((await queue.dispatch({ id: 1, method: 'connectDevice' })).result).toEqual({
      isSuccess: false,
      result: 'initialization_threw'
    })
    expect(native.connectDevice).not.toHaveBeenCalled()
    expect((await queue.dispatch({ id: 2, method: 'connectDevice' })).result.isSuccess).toBe(true)
    expect(native.initImKeyCore).toHaveBeenCalledTimes(2)
  })

  it('initializes a replacement process even when its caller only reconnects', async () => {
    const first = handlers()
    const replacement = handlers()
    await initializedHandlers(first).connectDevice()
    await initializedHandlers(replacement).connectDevice()
    expect(first.initImKeyCore).toHaveBeenCalledOnce()
    expect(replacement.initImKeyCore).toHaveBeenCalledOnce()
  })

  it('passes the configured native file directory and service parameters before connecting', async () => {
    const methods: string[] = []
    let directory = ''
    const native = createDeviceHandlers(
      {
        callImKeyApi(hex) {
          const action = decode(api, 'ImkeyAction', hex)
          const method = invoke<string>(action, 'getMethod')
          methods.push(method)
          if (method === 'init_imkey_core_x') {
            const any = invoke<{ getValue_asU8(): Uint8Array }>(action, 'getParam')
            const init = api.InitImKeyCoreXParam.deserializeBinary(any.getValue_asU8())
            directory = invoke<string>(init, 'getFiledir')
          }
          return Buffer.from(
            create(api, 'CommonResponse', { setResult: 'success' }).serializeBinary()
          ).toString('hex')
        },
        getLastErrorMessage: () => ''
      },
      '/replacement/userData'
    )
    expect(await initializedHandlers(native).connectDevice()).toEqual({
      isSuccess: true,
      result: 'success'
    })
    expect(directory).toBe('/replacement/userData/')
    expect(methods).toEqual(['init_imkey_core_x', 'device_connect'])
  })
})
