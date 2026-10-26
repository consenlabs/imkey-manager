export interface DeviceInfoCache {
  seid: string
  sn: string
  firmwareVersion: string
  bleVersion: string
  latestFirmwareVersion: string
  latestBleVersion: string
  updateAvailable: boolean
}

export interface DeviceVerificationState {
  status: 'idle' | 'checking' | 'success'
  activationStatus: boolean | null
  activatedAt: string | null
  errorInfo: string
}

export const emptyVerification = (): DeviceVerificationState => ({
  status: 'idle',
  activationStatus: null,
  activatedAt: null,
  errorInfo: ''
})
