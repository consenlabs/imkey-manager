import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { useConnection } from '../../src/renderer/composables/useConnection'
import { createDeviceOperation } from '../../src/renderer/composables/useDeviceOperation'
import { useDeviceStore } from '../../src/renderer/store'

const mocks = vi.hoisted(() => ({
  call: vi.fn<(method: string) => Promise<DeviceResult>>(),
  push: vi.fn()
}))
vi.mock('../../src/renderer/device', () => ({ callDevice: mocks.call }))
vi.mock('../../src/renderer/composables/useDeviceRecovery', () => ({
  useDeviceRecovery: () => ({ offer: vi.fn(), returnToConnection: vi.fn() })
}))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: vi.fn(),
  onUnmounted: vi.fn()
}))
beforeEach(() => {
  setActivePinia(createPinia())
  mocks.call.mockReset()
  mocks.push.mockReset()
})
function submit(flow: ReturnType<typeof useConnection>, code = 'A2345678') {
  Object.assign(flow.state, Object.fromEntries([...code].map((char, i) => [`code${i + 1}`, char])))
  flow.inpCode(8, {
    target: { value: code[7], nextElementSibling: null },
    key: code[7]
  } as unknown as KeyboardEvent)
}
function pendingCalls() {
  const requests: { method: string; resolve: (result: DeviceResult) => void }[] = []
  mocks.call.mockImplementation(
    method => new Promise(resolve => requests.push({ method, resolve }))
  )
  async function reply(method: string, result: DeviceResult) {
    await vi.waitFor(() => expect(requests[0]?.method).toBe(method))
    requests.shift()!.resolve(result)
  }
  return { reply }
}
async function settled() {
  await createDeviceOperation().run(async () => {})
}
it('cancel clears binding input, errors and device state without issuing a native call', () => {
  const flow = useConnection()
  flow.changeState(7)
  flow.code1.value = 'A'
  flow.errorInfo.value = 'old failure'
  flow.codeIsTrue.value = false
  useDeviceStore().activeStatus = 'latest'
  useDeviceStore().bindStatus = 'bound_other'
  flow.cancelBinding()
  expect(flow.status.value).toBe(1)
  expect(flow.state).toMatchObject({ code1: '', code8: '', codeIsTrue: true, bindingStatus: 0 })
  expect(flow.errorInfo.value).toBe('')
  expect(useDeviceStore().activeStatus).toBe('')
  expect(useDeviceStore().bindStatus).toBe('')
  expect(mocks.call).not.toHaveBeenCalled()
})
it.each([
  { isSuccess: true as const, result: 'error' },
  { isSuccess: false as const, result: 'imkey_authcode_error' }
])('only a code rejection marks the binding code incorrect: %j', async result => {
  mocks.call.mockResolvedValue(result)
  const flow = useConnection()
  flow.changeState(7)
  submit(flow)
  await settled()
  expect(flow.status.value).toBe(7)
  expect(flow.codeIsTrue.value).toBe(false)
  expect(flow.bindingStatus.value).toBe(0)
  expect(mocks.call.mock.calls.map(([method]) => method)).toEqual(['deviceBindAcquire'])
})
it('HID errors leave the binding dialog without claiming the code is wrong', async () => {
  mocks.call.mockResolvedValue({
    isSuccess: false,
    result: 'hidapi error: hid_error is not implemented yet'
  })
  const flow = useConnection()
  flow.changeState(7)
  submit(flow)
  await settled()
  expect(flow.status.value).toBe(4)
  expect(flow.codeIsTrue.value).toBe(true)
  expect(flow.bindingStatus.value).toBe(0)
  expect(flow.errorStage.value).toBe('bind')
  expect(flow.errorInfo.value).toContain('hidapi error')
})
it('cannot dismiss during verification, then allows dismissal after a rejected code', async () => {
  const { reply } = pendingCalls()
  const flow = useConnection()
  flow.changeState(7)
  submit(flow)
  await vi.waitFor(() => expect(mocks.call).toHaveBeenCalledOnce())
  flow.cancelBinding()
  expect(flow.status.value).toBe(7)
  expect(flow.bindingStatus.value).toBe(1)
  expect(flow.code1.value).toBe('A')
  await reply('deviceBindAcquire', { isSuccess: false, result: 'imkey_authcode_error' })
  await settled()
  expect(flow.bindingStatus.value).toBe(0)
  flow.cancelBinding()
  expect(flow.status.value).toBe(1)
  expect(flow.code1.value).toBe('')
  expect(mocks.push).not.toHaveBeenCalled()
})
it('cancel cannot close a firmware update dialog', () => {
  const flow = useConnection()
  flow.changeState(6)
  flow.cancelBinding()
  expect(flow.status.value).toBe(6)
})
