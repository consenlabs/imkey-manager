import { defineStore } from 'pinia'
export const useAppStore = defineStore('app', {
  state: () => ({ userPath: '', deviceChanged: false })
})
