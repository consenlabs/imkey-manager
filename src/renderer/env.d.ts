import type { ImkeyApi } from '../preload'
declare global {
  interface Window {
    imkey: ImkeyApi
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    noScroll(): void
    canScroll(): void
  }
}
export {}
