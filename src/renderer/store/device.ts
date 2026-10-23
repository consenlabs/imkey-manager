import { defineStore } from 'pinia'
import type { DeviceApplet } from '../models/applets'
export const useDeviceStore = defineStore('device', {
  state: () => ({
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
  })
})
