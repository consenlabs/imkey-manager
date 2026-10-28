import { beforeEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore, useDeviceStore } from '../../src/renderer/store'
import { useDeviceRecovery } from '../../src/renderer/composables/useDeviceRecovery'

const mocks = vi.hoisted(() => ({
  confirm: vi.fn(),
  alert: vi.fn(),
  close: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  unmounted: [] as (() => void)[]
}))
vi.mock('element-plus', () => ({
  ElMessageBox: { confirm: mocks.confirm, alert: mocks.alert, close: mocks.close }
}))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mocks.push, replace: mocks.replace }) }))
vi.mock('../../src/renderer/composables/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  getCurrentInstance: () => ({}),
  onUnmounted: (callback: () => void) => mocks.unmounted.push(callback)
}))
let acknowledge!: () => void
beforeEach(() => {
  setActivePinia(createPinia())
  mocks.confirm.mockReset()
  mocks.alert.mockReset().mockImplementation(
    () =>
      new Promise<void>(resolve => {
        acknowledge = resolve
      })
  )
  mocks.close.mockReset()
  mocks.push.mockReset().mockResolvedValue(undefined)
  mocks.replace.mockReset().mockResolvedValue(undefined)
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
it.each(['device_session_changed', 'device_bind_check_failed'])(
  'immediately clears old data for %s and returns to connection only after confirmation',
  async error => {
    const retry = vi.fn()
    Object.assign(useDeviceStore(), {
      connectedSeid: 'previous-device',
      bindStatus: 'bound_this',
      isCosUpdate: true,
      verification: {
        status: 'success',
        activationStatus: true,
        activatedAt: '2024-01-01',
        errorInfo: ''
      }
    })
    useDeviceRecovery().offer(error, retry)
    expect(mocks.replace).not.toHaveBeenCalled()
    expect(useDeviceStore()).toMatchObject({
      connectedSeid: 'previous-device',
      isCosUpdate: false,
      verification: { status: 'idle', activatedAt: null }
    })
    expect(useAppStore().deviceChanged).toBe(true)
    expect(mocks.confirm).not.toHaveBeenCalled()
    expect(mocks.alert.mock.calls[0][2]).toMatchObject({
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false
    })
    expect(retry).not.toHaveBeenCalled()
    acknowledge()
    await settled()
    expect(mocks.replace).toHaveBeenCalledExactlyOnceWith('/connectDevice')
    expect(useDeviceStore()).toMatchObject({ connectedSeid: '', bindStatus: '' })
    expect(useAppStore().deviceChanged).toBe(false)
  }
)
it('reconnect-only confirmation returns to connection rather than replaying a stale action', async () => {
  mocks.confirm.mockResolvedValue(undefined)
  const retry = vi.fn(async () => {})
  useDeviceRecovery().offer('device_session_restart_required', retry, { reconnectOnly: true })
  await settled()
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/connectDevice')
  expect(retry).not.toHaveBeenCalled()
  expect(mocks.confirm.mock.calls[0][2]).toMatchObject({
    showCancelButton: false,
    showClose: false
  })
})
it('device changes override an existing recovery prompt and deduplicate navigation', async () => {
  let cancel!: (reason: string) => void
  mocks.confirm.mockImplementation(
    () =>
      new Promise((_resolve, reject) => {
        cancel = reject
      })
  )
  mocks.close.mockImplementation(() => cancel('close'))
  const recovery = useDeviceRecovery()
  const retry = vi.fn()
  recovery.offer('device_operation_timeout', retry)
  recovery.offer('device_session_changed', retry)
  recovery.offer('device_session_changed', retry)
  recovery.offer('device_operation_timeout', retry)
  await settled()
  expect(mocks.close).toHaveBeenCalledOnce()
  expect(mocks.replace).not.toHaveBeenCalled()
  expect(mocks.confirm).toHaveBeenCalledOnce()
  expect(mocks.alert).toHaveBeenCalledOnce()
  expect(retry).not.toHaveBeenCalled()
  acknowledge()
  await settled()
  expect(mocks.replace).toHaveBeenCalledExactlyOnceWith('/connectDevice')
})
it('does not navigate on a late device-change confirmation after page disposal', async () => {
  useDeviceRecovery().offer('device_session_changed', vi.fn())
  mocks.unmounted.forEach(callback => callback())
  acknowledge()
  await settled()
  expect(mocks.close).toHaveBeenCalledOnce()
  expect(mocks.replace).not.toHaveBeenCalled()
  expect(useAppStore().deviceChanged).toBe(false)
})
it('ignores device changes from a disposed page', () => {
  const recovery = useDeviceRecovery({ active: () => false })
  recovery.offer('device_session_changed', vi.fn())
  expect(mocks.replace).not.toHaveBeenCalled()
  expect(useAppStore().deviceChanged).toBe(false)
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
