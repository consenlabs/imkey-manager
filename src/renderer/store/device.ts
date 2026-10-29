import { defineStore } from 'pinia'
import type { DeviceApplet } from '../models/applets'
import type { DeviceResult } from '../../shared/deviceContract'
import {
  emptyVerification,
  type DeviceInfoCache,
  type FirmwareCheckCache
} from '../models/deviceState'
let sessionSequence = 0
let verificationSequence = 0
export const useDeviceStore = defineStore('device', {
  state: () => ({
    sessionId: ++sessionSequence,
    verificationRevision: ++verificationSequence,
    identityReady: false,
    identityChecking: false,
    deviceInfo: null as DeviceInfoCache | null,
    firmwareInfo: null as FirmwareCheckCache | null,
    verification: emptyVerification(),
    connectedSeid: '',
    activeStatus: '',
    bindStatus: '',
    homeAuthorization: null as { sessionId: number; seid: string } | null,
    apps: [] as DeviceApplet[],
    isCosUpdate: false,
    cosOldVersionData: '',
    cosNewVersionData: '',
    bleOldVersionData: '',
    bleNewVersionData: '',
    isFirstGoToManagerPage: true,
    installedBleVersion: ''
  }),
  getters: {
    canEnterHome: state =>
      Boolean(
        state.homeAuthorization &&
        state.homeAuthorization.sessionId === state.sessionId &&
        state.identityReady &&
        state.connectedSeid &&
        state.homeAuthorization.seid === state.connectedSeid.toUpperCase() &&
        state.bindStatus === 'bound_this'
      )
  },
  actions: {
    revokeHomeAccess() {
      this.homeAuthorization = null
    },
    // getBTCXpub checks bound_this in the service immediately before reading the wallet.
    // An acquire response, cached binding status, or firmware recovery cannot grant access.
    authorizeHome(sessionId: number, seid: string, wallet: DeviceResult<string>): boolean {
      this.revokeHomeAccess()
      if (
        sessionId !== this.sessionId ||
        !this.identityReady ||
        !seid ||
        seid.toUpperCase() !== this.connectedSeid.toUpperCase() ||
        !wallet.isSuccess ||
        typeof wallet.result !== 'string' ||
        !wallet.result.startsWith('xpub')
      )
        return false
      this.bindStatus = 'bound_this'
      this.homeAuthorization = { sessionId, seid: seid.toUpperCase() }
      return true
    },
    clearVerification() {
      this.verificationRevision = ++verificationSequence
      this.verification = emptyVerification()
    },
    invalidateDeviceData() {
      this.revokeHomeAccess()
      this.sessionId = ++sessionSequence
      this.deviceInfo = null
      this.firmwareInfo = null
      this.apps = []
      this.isCosUpdate = false
      this.cosOldVersionData = ''
      this.cosNewVersionData = ''
      this.bleOldVersionData = ''
      this.bleNewVersionData = ''
      this.installedBleVersion = ''
      this.isFirstGoToManagerPage = true
      this.identityReady = false
      this.identityChecking = false
      this.clearVerification()
    },
    prepareIdentityCheck() {
      // Hide cached device details until this page confirms the same physical device.
      this.identityReady = false
      this.identityChecking = true
    }
  }
})
