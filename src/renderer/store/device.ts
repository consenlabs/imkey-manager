import { defineStore } from 'pinia'
import type { DeviceApplet } from '../models/applets'
import { emptyVerification, type DeviceInfoCache } from '../models/deviceState'
let sessionSequence = 0
let verificationSequence = 0
export const useDeviceStore = defineStore('device', {
  state: () => ({
    sessionId: ++sessionSequence,
    verificationRevision: ++verificationSequence,
    identityReady: false,
    identityChecking: false,
    deviceInfo: null as DeviceInfoCache | null,
    verification: emptyVerification(),
    connectedSeid: '',
    activeStatus: '',
    bindStatus: '',
    apps: [] as DeviceApplet[],
    isCosUpdate: false,
    cosOldVersionData: '',
    cosNewVersionData: '',
    bleOldVersionData: '',
    bleNewVersionData: '',
    isFirstGoToManagerPage: true,
    installedBleVersion: ''
  }),
  actions: {
    clearVerification() {
      this.verificationRevision = ++verificationSequence
      this.verification = emptyVerification()
    },
    invalidateDeviceData() {
      this.sessionId = ++sessionSequence
      this.deviceInfo = null
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
