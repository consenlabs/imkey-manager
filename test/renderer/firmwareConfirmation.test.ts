import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { callDevice } from '../../src/renderer/device'
import type { DeviceResult } from '../../src/shared/deviceContract'
import { reconcileUpdateCheckpoint } from '../../src/renderer/composables/firmwareResumeState'
import type { FirmwareRecovery } from '../../src/renderer/composables/firmwareRecovery'
import {
  recordFirmwareConfirmation,
  useFirmwareConfirmation
} from '../../src/renderer/composables/useFirmwareConfirmation'

function storageMock() {
  const entries = new Map<string, string>()
  return {
    entries,
    getItem: vi.fn((key: string) => entries.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => entries.set(key, value)),
    removeItem: vi.fn((key: string) => entries.delete(key))
  }
}
let storage: ReturnType<typeof storageMock>
beforeEach(() => {
  storage = storageMock()
  vi.stubGlobal('localStorage', storage)
})
afterEach(() => vi.unstubAllGlobals())

describe('firmware confirmation reminder', () => {
  it('is persistent, reactive, device-specific and cleared only on explicit confirmation', () => {
    const seid = ref('SEID-A')
    const reminder = useFirmwareConfirmation(seid)
    expect(reminder.status.value).toBe('none')
    expect(recordFirmwareConfirmation('seid-a').isSuccess).toBe(true)
    expect(reminder.status.value).toBe('pending')
    expect([...storage.entries.values()]).toEqual(['{"version":1,"seid":"SEID-A"}'])
    expect(recordFirmwareConfirmation('SEID-B').isSuccess).toBe(true)
    seid.value = 'SEID-B'
    expect(reminder.status.value).toBe('pending')
    expect(reminder.confirm().isSuccess).toBe(true)
    expect(reminder.status.value).toBe('none')
    seid.value = 'SEID-A'
    expect(reminder.status.value).toBe('pending')
    expect(useFirmwareConfirmation('SEID-A').status.value).toBe('pending')
    expect(reminder.confirm().isSuccess).toBe(true)
    expect(reminder.status.value).toBe('none')
  })

  it('does not overwrite an existing reminder or discard unreadable state', () => {
    expect(recordFirmwareConfirmation('SEID-A').isSuccess).toBe(true)
    expect(recordFirmwareConfirmation('SEID-A').isSuccess).toBe(true)
    expect(storage.setItem).toHaveBeenCalledOnce()
    storage.entries.set('imkey.firmware-confirmation.v1.SEID-B', 'broken-json')
    const broken = useFirmwareConfirmation('SEID-B')
    expect(broken.status.value).toBe('unavailable')
    expect(recordFirmwareConfirmation('SEID-B').isSuccess).toBe(false)
    expect(broken.confirm().isSuccess).toBe(false)
    expect(storage.entries.get('imkey.firmware-confirmation.v1.SEID-B')).toBe('broken-json')
  })

  it('keeps a reminder when user confirmation cannot be persisted', () => {
    expect(recordFirmwareConfirmation('SEID-A').isSuccess).toBe(true)
    storage.removeItem.mockImplementation(() => {
      throw new Error('storage denied')
    })
    const reminder = useFirmwareConfirmation('SEID-A')
    expect(reminder.confirm().isSuccess).toBe(false)
    expect(reminder.status.value).toBe('pending')
  })
})

describe('ambiguous update checkpoint', () => {
  const makeRecovery = (): FirmwareRecovery => ({
    seid: 'SEID-A',
    phase: 'update',
    bindCode: 'secret-binding-code',
    needsBinding: true,
    expectedCos: '',
    expectedBle: ''
  })
  function mockCall(bootloader = false, completed = true, identity = 'SEID-A') {
    return vi.fn(async (method: string): Promise<DeviceResult> => {
      if (method === 'isBLStatus') return { isSuccess: true, result: bootloader }
      if (method === 'cosCheckUpdate')
        return { isSuccess: true, result: { isUpdateSuccess: completed } }
      if (method === 'getUpgradeSeid') return { isSuccess: true, result: identity }
      throw new Error(`Unexpected method ${method}`)
    })
  }

  it('persists a non-secret reminder before advancing the ambiguous checkpoint', async () => {
    const recovery = makeRecovery()
    const call = mockCall()
    const result = await reconcileUpdateCheckpoint(recovery, call as typeof callDevice, () => true)
    expect(result).toEqual({ promoted: true })
    expect(recovery.phase).toBe('capture-versions')
    expect([...storage.entries.values()]).toEqual(['{"version":1,"seid":"SEID-A"}'])
    expect(JSON.stringify([...storage.entries])).not.toContain('secret-binding-code')
    expect(call.mock.calls.map(([method]) => method)).toEqual([
      'isBLStatus',
      'cosCheckUpdate',
      'getUpgradeSeid'
    ])
  })

  it.each(['getItem', 'setItem'] as const)(
    'preserves the original checkpoint when %s is unavailable',
    async method => {
      storage[method].mockImplementation(() => {
        throw new Error('storage unavailable')
      })
      const recovery = makeRecovery()
      const original = { ...recovery }
      const call = mockCall()
      const result = await reconcileUpdateCheckpoint(
        recovery,
        call as typeof callDevice,
        () => true
      )
      expect(result).toMatchObject({
        promoted: false,
        failure: { stage: 'store', error: { result: 'firmware_confirmation_storage_failed' } }
      })
      expect(recovery).toEqual(original)
    }
  )

  it.each([
    { bootloader: true, completed: true, identity: 'SEID-A' },
    { bootloader: false, completed: false, identity: 'SEID-A' },
    { bootloader: false, completed: true, identity: 'SEID-B' }
  ])('does not promote or create a marker without completed same-device evidence: %j', async x => {
    const recovery = makeRecovery()
    const call = mockCall(x.bootloader, x.completed, x.identity)
    const result = await reconcileUpdateCheckpoint(recovery, call as typeof callDevice, () => true)
    expect(result.promoted).toBe(false)
    expect(recovery.phase).toBe('update')
    expect(storage.setItem).not.toHaveBeenCalled()
  })
})
