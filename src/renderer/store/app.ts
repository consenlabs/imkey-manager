import { defineStore } from 'pinia'
import type { WalletAddress } from '../../shared/deviceContract'
export const useAppStore = defineStore('app', {
  state: () => ({ userPath: '', walletAddresses: [] as WalletAddress[] })
})
