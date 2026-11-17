import type { Router } from 'vue-router'
import { useDeviceStore } from '../store/device'

export function installHomeAccessGuard(router: Router): void {
  router.beforeEach(to => {
    if (to.matched.some(record => record.name === 'home') && !useDeviceStore().canEnterHome)
      return { name: 'connectDevice', replace: true }
  })
}
