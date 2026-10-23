import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDeviceStore } from '../../src/renderer/store'
import { useDeviceRecovery } from '../../src/renderer/composables/useDeviceRecovery'

const mocks = vi.hoisted(() => ({
  confirm: vi.fn(),
  close: vi.fn(),
  push: vi.fn(),
  unmounted: [] as (() => void)[]
}))
vi.mock('element-plus', () => ({ ElMessageBox: { confirm: mocks.confirm, close: mocks.close } }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  getCurrentInstance: () => ({}),
  onUnmounted: (callback: () => void) => mocks.unmounted.push(callback)
}))
beforeEach(() => {
  setActivePinia(createPinia())
  mocks.confirm.mockReset()
  mocks.close.mockReset()
  mocks.push.mockReset().mockResolvedValue(undefined)
  mocks.unmounted.length = 0
})
async function settled() {
  for (let i = 0; i < 8; i++) await Promise.resolve()
}
it('retries only after confirmation, preserving session data', async () => {
  let confirm!: () => void
  mocks.confirm.mockImplementation(
    () =>
      new Promise<void>(resolve => {
        confirm = resolve
      })
  )
  const retry = vi.fn(async () => {})
  const session = useDeviceStore()
  session.connectedSeid = 'original-device'
  useDeviceRecovery().offer('device_operation_timeout', retry)
  expect(retry).not.toHaveBeenCalled()
  confirm()
  await settled()
  expect(retry).toHaveBeenCalledOnce()
  expect(session.connectedSeid).toBe('original-device')
  expect(mocks.push).not.toHaveBeenCalled()
})
it('returns to connection only on the explicit secondary action and clears the session', async () => {
  mocks.confirm.mockRejectedValue('cancel')
  const retry = vi.fn(async () => {})
  Object.assign(useDeviceStore(), {
    connectedSeid: 'original-device',
    bindStatus: 'bound_this',
    installedBleVersion: '1.0',
    isFirstGoToManagerPage: false
  })
  useDeviceRecovery().offer('failure', retry)
  await settled()
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/connectDevice')
  expect(useDeviceStore()).toMatchObject({
    connectedSeid: '',
    bindStatus: '',
    installedBleVersion: '',
    isFirstGoToManagerPage: true
  })
  expect(retry).not.toHaveBeenCalled()
})
it.each(['cancel', 'close'])(
  'keeps a reconnect-only dialog on the current page when %s',
  async action => {
    mocks.confirm.mockRejectedValue(action)
    useDeviceRecovery().offer('device_session_changed', async () => {}, { reconnectOnly: true })
    await settled()
    expect(mocks.push).not.toHaveBeenCalled()
  }
)
it('reconnect-only confirmation returns to connection rather than replaying a stale action', async () => {
  mocks.confirm.mockResolvedValue(undefined)
  const retry = vi.fn(async () => {})
  useDeviceRecovery().offer('device_session_changed', retry, { reconnectOnly: true })
  await settled()
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/connectDevice')
  expect(retry).not.toHaveBeenCalled()
})
it('closes on unmount and ignores a late confirmation', async () => {
  let confirm!: () => void
  mocks.confirm.mockImplementation(
    () =>
      new Promise<void>(resolve => {
        confirm = resolve
      })
  )
  const retry = vi.fn(async () => {})
  useDeviceRecovery().offer('failure', retry)
  mocks.unmounted.forEach(callback => callback())
  confirm()
  await settled()
  expect(mocks.close).toHaveBeenCalledOnce()
  expect(retry).not.toHaveBeenCalled()
  expect(mocks.push).not.toHaveBeenCalled()
})
it('does not stack recovery dialogs for concurrent errors', async () => {
  let close!: (value: string) => void
  mocks.confirm.mockImplementation(
    () =>
      new Promise((_resolve, reject) => {
        close = reject
      })
  )
  const recovery = useDeviceRecovery()
  recovery.offer('first', async () => {})
  recovery.offer('second', async () => {})
  expect(mocks.confirm).toHaveBeenCalledOnce()
  close('close')
  await settled()
})
