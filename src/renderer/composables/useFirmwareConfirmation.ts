import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { isValidFirmwareRecoverySeid, type DeviceResult } from '../../shared/deviceContract'

// This marker is an informational reminder only: it must never authorize
// skipping the device, server, or durable recovery checks.
const prefix = 'imkey.firmware-confirmation.v1.'
const revision = ref(0)
type ConfirmationStatus = 'none' | 'pending' | 'unavailable'

function keyFor(seid: string): string | undefined {
  return isValidFirmwareRecoverySeid(seid) ? prefix + seid.toUpperCase() : undefined
}

function readStatus(seid: string): ConfirmationStatus {
  if (!seid) return 'none'
  const key = keyFor(seid)
  if (!key) return 'unavailable'
  try {
    const value = localStorage.getItem(key)
    if (value === null) return 'none'
    const parsed: unknown = JSON.parse(value)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed) ||
      Object.keys(parsed).sort().join(',') !== 'seid,version' ||
      !('version' in parsed) ||
      parsed.version !== 1 ||
      !('seid' in parsed) ||
      parsed.seid !== seid.toUpperCase()
    )
      return 'unavailable'
    return 'pending'
  } catch {
    return 'unavailable'
  }
}

export function recordFirmwareConfirmation(seid: string): DeviceResult<undefined> {
  const key = keyFor(seid)
  if (!key) return { isSuccess: false, result: 'firmware_confirmation_storage_failed' }
  const status = readStatus(seid)
  if (status === 'unavailable')
    return { isSuccess: false, result: 'firmware_confirmation_storage_failed' }
  if (status === 'pending') return { isSuccess: true, result: undefined }
  try {
    localStorage.setItem(key, JSON.stringify({ version: 1, seid: seid.toUpperCase() }))
    if (readStatus(seid) !== 'pending') throw new Error('Confirmation was not stored')
    revision.value++
    return { isSuccess: true, result: undefined }
  } catch {
    return { isSuccess: false, result: 'firmware_confirmation_storage_failed' }
  }
}

export function useFirmwareConfirmation(seid: MaybeRefOrGetter<string>) {
  const status = computed(() => {
    void revision.value
    return readStatus(toValue(seid))
  })
  function confirm(): DeviceResult<undefined> {
    const device = toValue(seid)
    const key = keyFor(device)
    if (!key || readStatus(device) === 'unavailable')
      return { isSuccess: false, result: 'firmware_confirmation_storage_failed' }
    try {
      localStorage.removeItem(key)
      if (localStorage.getItem(key) !== null) throw new Error('Confirmation was not removed')
      revision.value++
      return { isSuccess: true, result: undefined }
    } catch {
      return { isSuccess: false, result: 'firmware_confirmation_storage_failed' }
    }
  }
  return { status, confirm }
}
