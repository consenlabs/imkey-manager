import type { useDeviceStore } from '../store/device'
import type { FirmwareCheckCache } from '../models/deviceState'

type Device = ReturnType<typeof useDeviceStore>
const maxAgeMs = 5 * 60 * 1000

export function cachedFirmware(device: Device): FirmwareCheckCache | undefined {
  const cached = device.firmwareInfo
  if (
    !cached ||
    !device.identityReady ||
    cached.seid.toUpperCase() !== device.connectedSeid.toUpperCase() ||
    Date.now() - cached.checkedAt >= maxAgeMs ||
    (device.cosOldVersionData && device.cosOldVersionData !== cached.firmwareVersion) ||
    (device.bleOldVersionData && device.bleOldVersionData !== cached.bleVersion)
  )
    return undefined
  return cached
}

export function firmwareAvailable(
  cached: FirmwareCheckCache,
  kind: 'manager' | 'setting' = 'setting'
): boolean {
  return (
    cached.latestFirmwareVersion !== cached.firmwareVersion ||
    (kind === 'setting' && cached.latestBleVersion !== cached.bleVersion)
  )
}

export function publishFirmware(device: Device, result: FirmwareCheckCache): void {
  device.firmwareInfo = result
  device.cosOldVersionData = result.firmwareVersion
  device.bleOldVersionData = result.bleVersion
  device.cosNewVersionData = result.latestFirmwareVersion
  device.bleNewVersionData = result.latestBleVersion
  device.isCosUpdate = firmwareAvailable(result)
  // Device metadata keeps a display snapshot; the shared check is authoritative.
  // Update the snapshot in the same turn so no page can restore an older result.
  if (device.deviceInfo?.seid.toUpperCase() === result.seid.toUpperCase()) {
    device.deviceInfo = {
      ...device.deviceInfo,
      firmwareVersion: result.firmwareVersion,
      bleVersion: result.bleVersion,
      firmwareChecked: true,
      latestFirmwareVersion: result.latestFirmwareVersion,
      latestBleVersion: result.latestBleVersion,
      updateAvailable: firmwareAvailable(result)
    }
  }
}

export function invalidateFirmware(device: Device): void {
  device.firmwareInfo = null
  device.isCosUpdate = false
  device.cosNewVersionData = ''
  device.bleNewVersionData = ''
  if (device.deviceInfo) {
    device.deviceInfo = {
      ...device.deviceInfo,
      firmwareChecked: false,
      latestFirmwareVersion: '',
      latestBleVersion: '',
      updateAvailable: false
    }
  }
}
