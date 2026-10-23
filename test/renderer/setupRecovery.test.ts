import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useDeviceSetup } from '../../src/renderer/composables/useDeviceSetup'
import { createDeviceOperation } from '../../src/renderer/composables/useDeviceOperation'
import { useDeviceStore } from '../../src/renderer/store'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string, params?: unknown) => Promise<DeviceResult>>(),
  offer: vi.fn(),
  openExternal: vi.fn(),
  push: vi.fn(),
  mounted: [] as (() => unknown)[],
  unmounted: [] as (() => unknown)[],
  listeners: new Map<string, (event: KeyboardEvent) => void>()
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: mocks.offer, returnToConnection: vi.fn() })
}))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  getCurrentInstance: () => ({}),
  onMounted: (callback: () => unknown) => mocks.mounted.push(callback),
  onUnmounted: (callback: () => unknown) => mocks.unmounted.push(callback)
}))

let bindStatus: string
let seid: string
let localCode: DeviceResult
beforeEach(() => {
  setActivePinia(createPinia())
  useDeviceStore().activeStatus = 'latest'
  mocks.call.mockReset()
  mocks.offer.mockReset()
  mocks.openExternal.mockReset().mockResolvedValue(undefined)
  mocks.push.mockReset()
  mocks.mounted.length = mocks.unmounted.length = 0
  mocks.listeners.clear()
  bindStatus = 'unbound'
  seid = 'SEID-A'
  localCode = { isSuccess: false, result: 'Binding code file missing' }
  mocks.call.mockImplementation(async method => {
    if (method === 'deviceBindCheck') return { isSuccess: true, result: bindStatus }
    if (method === 'getSeid') return { isSuccess: true, result: seid }
    if (method === 'exportBindCode') return localCode
    if (method === 'getBTCXpub') return { isSuccess: true, result: 'xpub-ready' }
    if (method === 'deviceBindAcquire') bindStatus = 'bound_this'
    return { isSuccess: true, result: 'success' }
  })
  vi.stubGlobal('document', {
    addEventListener: (name: string, listener: (event: KeyboardEvent) => void) =>
      mocks.listeners.set(name, listener),
    removeEventListener: (name: string) => mocks.listeners.delete(name)
  })
  vi.stubGlobal('window', { imkey: { app: { openExternal: mocks.openExternal } } })
})
async function settled() {
  await createDeviceOperation().run(async () => {})
}
async function mount() {
  const setup = useDeviceSetup()
  for (const callback of mocks.mounted) await callback()
  await settled()
  return setup
}
function submit(setup: ReturnType<typeof useDeviceSetup>, code = 'A2345678') {
  Object.assign(setup.state, Object.fromEntries([...code].map((char, i) => [`code${i + 1}`, char])))
  setup.inpCode(8, {
    key: code[7],
    target: { value: code[7], nextElementSibling: null }
  } as unknown as KeyboardEvent)
}
function escape(defaultPrevented = false) {
  const event = { key: 'Escape', defaultPrevented, preventDefault: vi.fn() }
  mocks.listeners.get('keydown')?.(event as unknown as KeyboardEvent)
  return event
}
async function inputPage(setup: ReturnType<typeof useDeviceSetup>) {
  await setup.send({ page: 2, active: 0, isNext: true })
  expect(setup.page.value).toBe(2)
}

it('keeps the generation step until binding-code display succeeds and retries initialization', async () => {
  const normal = mocks.call.getMockImplementation()!
  let failDisplay = true
  mocks.call.mockImplementation(async (method, params) =>
    method === 'deviceBindDisplay' && failDisplay
      ? { isSuccess: false, result: 'device_not_connected' }
      : normal(method, params)
  )
  const setup = await mount()
  expect(setup.bindViewFinish.value).toBe(false)
  expect(setup.errorInfo.value).toBe('device_not_connected')
  await setup.send({ page: 2, active: 0, isNext: true })
  expect(setup.page.value).toBe(1)
  expect(setup.errorInfo.value).toBe('device_not_connected')
  failDisplay = false
  await mocks.offer.mock.calls[0][1]()
  expect(setup.bindViewFinish.value).toBe(true)
  expect(mocks.call.mock.calls.filter(([method]) => method === 'deviceBindDisplay')).toHaveLength(2)
  await inputPage(setup)
})

it('offers returning to connection when Next is requested before binding', async () => {
  const setup = await mount()
  await inputPage(setup)
  mocks.call.mockClear()
  await setup.send({ page: 3, active: 1, isNext: true })
  expect(setup.page.value).toBe(2)
  expect(mocks.offer).toHaveBeenCalledWith(
    'device_session_restart_required',
    expect.any(Function),
    { reconnectOnly: true }
  )
  expect(mocks.call).not.toHaveBeenCalled()
})

it('Escape offers a return while idle and removes its handler on unmount', async () => {
  await mount()
  expect(escape().preventDefault).toHaveBeenCalledOnce()
  expect(mocks.offer).toHaveBeenCalledOnce()
  escape(true)
  expect(mocks.offer).toHaveBeenCalledOnce()
  mocks.unmounted.forEach(callback => callback())
  expect(mocks.listeners.has('keydown')).toBe(false)
})

it('blocks Escape, navigation and repeated input while binding verification is pending', async () => {
  const setup = await mount()
  await inputPage(setup)
  const normal = mocks.call.getMockImplementation()!
  let finish!: (result: DeviceResult) => void
  mocks.call.mockImplementation((method, params) =>
    method === 'deviceBindAcquire'
      ? new Promise(resolve => {
          finish = resolve
        })
      : normal(method, params)
  )
  submit(setup)
  await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
  escape()
  await setup.send({ page: 3, active: 1, isNext: true })
  submit(setup)
  expect(mocks.offer).not.toHaveBeenCalled()
  expect(setup.page.value).toBe(2)
  expect(mocks.call.mock.calls.filter(([method]) => method === 'deviceBindAcquire')).toHaveLength(1)
  bindStatus = 'bound_this'
  finish({ isSuccess: true, result: 'success' })
  await settled()
  expect(setup.bindingStatus.value).toBe(2)
  expect(setup.busy.value).toBe(false)
})

it.each(['unbound', 'bound_other'])(
  'detects a reset or rebound device (%s) before advancing',
  async changed => {
    const setup = await mount()
    await inputPage(setup)
    submit(setup)
    await settled()
    expect(setup.bindFinish.value).toBe(true)
    bindStatus = changed
    mocks.call.mockClear()
    await setup.send({ page: 3, active: 1, isNext: true })
    expect(setup.page.value).toBe(2)
    expect(setup.bindFinish.value).toBe(false)
    expect(setup.bindingStatus.value).toBe(0)
    expect(setup.code1.value).toBe('')
    expect(mocks.offer).toHaveBeenLastCalledWith('device_session_changed', expect.any(Function), {
      reconnectOnly: true
    })
    expect(mocks.call.mock.calls.map(([method]) => method)).toEqual([
      'connectDevice',
      'getSeid',
      'deviceBindCheck'
    ])
  }
)

it('detects another SEID before binding and does not send the old code to the replacement device', async () => {
  const setup = await mount()
  await inputPage(setup)
  seid = 'SEID-B'
  submit(setup)
  await settled()
  expect(setup.errorInfo.value).toBe('device_session_changed')
  expect(setup.bindingStatus.value).toBe(0)
  expect(mocks.call.mock.calls.map(([method]) => method)).not.toContain('deviceBindAcquire')
  expect(mocks.call.mock.calls.map(([method]) => method)).not.toContain('importBindCode')
  expect(mocks.push).not.toHaveBeenCalled()
  expect(mocks.offer).toHaveBeenLastCalledWith(
    expect.objectContaining({ result: 'device_session_changed' }),
    expect.any(Function),
    { reconnectOnly: true }
  )
})

it.each(['openUrl', 'openUrlReset'] as const)(
  '%s failure retries only the external link',
  async method => {
    const setup = await mount()
    mocks.call.mockClear()
    mocks.openExternal.mockRejectedValueOnce(new Error('Cannot open link'))
    setup[method]()
    await vi.waitFor(() => expect(mocks.offer).toHaveBeenCalledOnce())
    expect(setup.errorStage.value).toBe('link')
    await mocks.offer.mock.lastCall![1]()
    expect(mocks.openExternal).toHaveBeenCalledTimes(2)
    expect(setup.errorInfo.value).toBe('')
    expect(mocks.call).not.toHaveBeenCalled()
  }
)

it.each(['openUrl', 'openUrlReset'] as const)(
  '%s ignores clicks while a device action or binding verification is active',
  async method => {
    const setup = await mount()
    setup.busy.value = true
    setup[method]()
    setup.busy.value = false
    setup.bindingStatus.value = 1
    setup[method]()
    expect(mocks.openExternal).not.toHaveBeenCalled()
    expect(mocks.offer).not.toHaveBeenCalled()
  }
)

it('ignores an external-link failure arriving during binding verification', async () => {
  const setup = await mount()
  await inputPage(setup)
  let rejectLink!: (error: Error) => void
  mocks.openExternal.mockImplementationOnce(
    () =>
      new Promise((_, reject) => {
        rejectLink = reject
      })
  )
  setup.openUrl()
  const normal = mocks.call.getMockImplementation()!
  let finishBinding!: (result: DeviceResult) => void
  let pending = true
  mocks.call.mockImplementation((method, params) =>
    method === 'deviceBindAcquire' && pending
      ? new Promise(resolve => {
          finishBinding = resolve
        })
      : normal(method, params)
  )
  submit(setup)
  await vi.waitFor(() => expect(finishBinding).toBeTypeOf('function'))
  rejectLink(new Error('Late link failure'))
  await Promise.resolve()
  await Promise.resolve()
  expect(setup.busy.value).toBe(true)
  expect(setup.bindingStatus.value).toBe(1)
  expect(setup.errorInfo.value).toBe('')
  expect(mocks.offer).not.toHaveBeenCalled()
  pending = false
  bindStatus = 'bound_this'
  finishBinding({ isSuccess: true, result: 'success' })
  await settled()
  await setup.retry()
  expect(setup.bindFinish.value).toBe(true)
  expect(mocks.openExternal).toHaveBeenCalledOnce()
  expect(mocks.call.mock.calls.filter(([method]) => method === 'deviceBindAcquire')).toHaveLength(2)
})

it('a stale external-link rejection cannot replace a completed device failure or its retry', async () => {
  const setup = await mount()
  await inputPage(setup)
  let rejectLink!: (error: Error) => void
  mocks.openExternal.mockImplementationOnce(
    () =>
      new Promise((_, reject) => {
        rejectLink = reject
      })
  )
  setup.openUrlReset()
  const normal = mocks.call.getMockImplementation()!
  let failBinding = true
  mocks.call.mockImplementation(async (method, params) =>
    method === 'deviceBindAcquire' && failBinding
      ? { isSuccess: false, result: 'device_not_connected' }
      : normal(method, params)
  )
  submit(setup)
  await settled()
  expect(setup.busy.value).toBe(false)
  expect(setup.errorInfo.value).toBe('device_not_connected')
  expect(mocks.offer).toHaveBeenCalledOnce()
  rejectLink(new Error('Stale link failure'))
  await Promise.resolve()
  await Promise.resolve()
  expect(setup.errorInfo.value).toBe('device_not_connected')
  expect(setup.errorStage.value).toBe('bind')
  expect(mocks.offer).toHaveBeenCalledOnce()
  failBinding = false
  await setup.retry()
  expect(setup.bindFinish.value).toBe(true)
  expect(mocks.openExternal).toHaveBeenCalledOnce()
})

it('reuses a valid stored code for a bound-this device and skips manual entry', async () => {
  bindStatus = 'bound_this'
  localCode = { isSuccess: true, result: 'A2345678' }
  const setup = await mount()
  expect(setup.page.value).toBe(3)
  expect(setup.bindFinish.value).toBe(true)
  expect(setup.codeIsTrue.value).toBe(true)
  expect(mocks.call.mock.calls).toContainEqual([
    'deviceBindAcquire',
    'A2345678',
    expect.any(Object)
  ])
  expect(mocks.call.mock.calls.map(([method]) => method)).not.toContain('deviceBindDisplay')
  expect(mocks.offer).not.toHaveBeenCalled()
})

it.each([
  { isSuccess: false as const, result: 'missing' },
  { isSuccess: false as const, result: 'corrupt storage' },
  { isSuccess: true as const, result: 'invalid stored code' }
])('keeps manual binding available when the local code is unavailable: %j', async local => {
  bindStatus = 'bound_this'
  localCode = local
  const setup = await mount()
  expect(setup.bindViewFinish.value).toBe(true)
  expect(setup.bindFinish.value).toBe(false)
  expect(setup.errorInfo.value).toBe('')
  expect(mocks.offer).not.toHaveBeenCalled()
  await inputPage(setup)
  submit(setup)
  await settled()
  expect(setup.bindFinish.value).toBe(true)
})

it('a genuine wrong code stays editable and success clears its warning', async () => {
  const normal = mocks.call.getMockImplementation()!
  let reject = true
  mocks.call.mockImplementation(async (method, params) =>
    method === 'deviceBindAcquire' && reject
      ? { isSuccess: true, result: 'error' }
      : normal(method, params)
  )
  const setup = await mount()
  await inputPage(setup)
  submit(setup, 'B2345678')
  await settled()
  expect(setup.codeIsTrue.value).toBe(false)
  expect(setup.bindingStatus.value).toBe(0)
  expect(mocks.offer).not.toHaveBeenCalled()
  reject = false
  await setup.retry()
  expect(setup.codeIsTrue.value).toBe(true)
  expect(setup.bindingStatus.value).toBe(2)
  expect(setup.errorInfo.value).toBe('')
})

it('a transport failure unlocks input and retries the original binding action', async () => {
  const normal = mocks.call.getMockImplementation()!
  let fail = true
  mocks.call.mockImplementation(async (method, params) =>
    method === 'deviceBindAcquire' && fail
      ? { isSuccess: false, result: 'device_not_connected' }
      : normal(method, params)
  )
  const setup = await mount()
  await inputPage(setup)
  submit(setup)
  await settled()
  expect(setup.bindingStatus.value).toBe(0)
  expect(setup.codeIsTrue.value).toBe(true)
  fail = false
  await mocks.offer.mock.lastCall![1]()
  expect(setup.bindFinish.value).toBe(true)
  expect(setup.codeIsTrue.value).toBe(true)
  expect(mocks.call.mock.calls.filter(([method]) => method === 'deviceBindDisplay')).toHaveLength(1)
})

it('a wallet failure can retry the same action or navigate back to manual binding', async () => {
  const setup = await mount()
  await inputPage(setup)
  submit(setup)
  await settled()
  await setup.send({ page: 3, active: 1, isNext: true })
  await setup.send({ page: 4, active: 2, isNext: true })
  setup.changeStep('step1')
  setup.changeStep('step2')
  setup.changeStep('step3')
  const normal = mocks.call.getMockImplementation()!
  let ready = false
  mocks.call.mockImplementation(async (method, params) =>
    method === 'getBTCXpub' && !ready ? { isSuccess: true, result: '' } : normal(method, params)
  )
  await setup.send({ page: 0, active: 0, isNext: false })
  expect(setup.page.value).toBe(4)
  expect(setup.errorInfo.value).toBe('imkey_wallet_not_created')
  ready = true
  await mocks.offer.mock.lastCall![1]()
  expect(mocks.push).toHaveBeenCalledWith('/home/welcomeHome')
  await setup.send({ page: 3, active: 1, isNext: false })
  await setup.send({ page: 2, active: 0, isNext: false })
  expect(setup.page.value).toBe(2)
  expect(setup.finish.value).toBe(false)
})
