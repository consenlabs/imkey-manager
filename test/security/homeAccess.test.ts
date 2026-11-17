import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useDeviceStore } from '../../src/renderer/store/device'
import { installHomeAccessGuard } from '../../src/renderer/router/homeAccess'

const wallet = { isSuccess: true, result: 'xpub-wallet' } as const

function routerWithGuard() {
  const component = { template: '<div />' }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component },
      { path: '/connectDevice', name: 'connectDevice', component },
      { path: '/imKeySetting', name: 'imKeySetting', component },
      {
        path: '/home',
        name: 'home',
        component,
        children: ['welcomeHome', 'manager', 'setting'].map(name => ({
          path: name,
          name,
          component
        }))
      }
    ]
  })
  installHomeAccessGuard(router)
  return router
}

beforeEach(() => {
  setActivePinia(createPinia())
  const device = useDeviceStore()
  device.connectedSeid = 'SEID-A'
  device.identityReady = true
})

describe('home entry authorization', () => {
  it.each(['/home', '/home/welcomeHome', '/home/manager', '/home/setting'])(
    'rejects direct entry to %s without a verified wallet',
    async path => {
      const device = useDeviceStore()
      device.connectedSeid = 'SEID-A'
      device.bindStatus = 'bound_this'
      const router = routerWithGuard()
      await router.push(path)
      expect(router.currentRoute.value.name).toBe('connectDevice')
    }
  )

  it('allows all home pages only after the service has verified binding and wallet readiness', async () => {
    const device = useDeviceStore()
    device.connectedSeid = 'SEID-A'
    expect(device.authorizeHome(device.sessionId, 'seid-a', wallet)).toBe(true)
    expect(device.bindStatus).toBe('bound_this')
    const router = routerWithGuard()
    for (const name of ['home', 'welcomeHome', 'manager', 'setting']) {
      await router.push({ name })
      expect(router.currentRoute.value.name).toBe(name)
    }
  })

  it.each(['', 'unknown', 'unbound', 'bound_other'])(
    'rejects a subsequent navigation after binding becomes %s',
    async status => {
      const device = useDeviceStore()
      device.connectedSeid = 'SEID-A'
      device.authorizeHome(device.sessionId, 'SEID-A', wallet)
      const router = routerWithGuard()
      await router.push('/home/welcomeHome')
      device.bindStatus = status
      await router.push('/home/manager')
      expect(router.currentRoute.value.name).toBe('connectDevice')
    }
  )

  it.each([
    { isSuccess: false, result: 'device_bind_check_failed' },
    { isSuccess: false, result: 'imkey_wallet_not_created' },
    { isSuccess: true, result: '' },
    { isSuccess: true, result: 'success' }
  ] as const)('never grants access for $result', result => {
    const device = useDeviceStore()
    device.connectedSeid = 'SEID-A'
    device.authorizeHome(device.sessionId, 'SEID-A', wallet)
    expect(device.authorizeHome(device.sessionId, 'SEID-A', result)).toBe(false)
    expect(device.canEnterHome).toBe(false)
  })

  it('rejects stale wallet responses and changed device identity', () => {
    const device = useDeviceStore()
    device.connectedSeid = 'SEID-A'
    const originalSession = device.sessionId
    device.invalidateDeviceData()
    expect(device.authorizeHome(originalSession, 'SEID-A', wallet)).toBe(false)
    device.identityReady = true
    expect(device.authorizeHome(device.sessionId, 'SEID-B', wallet)).toBe(false)
    expect(device.authorizeHome(device.sessionId, 'SEID-A', wallet)).toBe(true)
    device.connectedSeid = 'SEID-B'
    expect(device.canEnterHome).toBe(false)
  })

  it('requires confirmed identity before authorization and on later navigation', async () => {
    const device = useDeviceStore()
    device.identityReady = false
    expect(device.authorizeHome(device.sessionId, 'SEID-A', wallet)).toBe(false)
    device.identityReady = true
    expect(device.authorizeHome(device.sessionId, 'SEID-A', wallet)).toBe(true)
    device.identityReady = false
    const router = routerWithGuard()
    await router.push('/home/welcomeHome')
    expect(router.currentRoute.value.name).toBe('connectDevice')
  })

  it('blocks browser history from reentering home after authorization is revoked', async () => {
    const device = useDeviceStore()
    device.authorizeHome(device.sessionId, 'SEID-A', wallet)
    const router = routerWithGuard()
    await router.push('/home/welcomeHome')
    await router.push('/imKeySetting')
    device.revokeHomeAccess()
    const redirected = new Promise<void>(resolve => {
      const remove = router.afterEach(to => {
        if (to.name !== 'connectDevice') return
        remove()
        resolve()
      })
    })
    router.back()
    await redirected
    expect(router.currentRoute.value.name).toBe('connectDevice')
  })

  it.each(['invalidateDeviceData', '$reset', 'revokeHomeAccess'] as const)(
    '%s clears the previous authorization',
    method => {
      const device = useDeviceStore()
      device.connectedSeid = 'SEID-A'
      device.authorizeHome(device.sessionId, 'SEID-A', wallet)
      device[method]()
      expect(device.homeAuthorization).toBeNull()
      expect(device.canEnterHome).toBe(false)
    }
  )

  it('leaves connection and setup accessible during unbound firmware recovery', async () => {
    const device = useDeviceStore()
    device.bindStatus = 'unbound'
    device.isCosUpdate = true
    const router = routerWithGuard()
    for (const name of ['connectDevice', 'imKeySetting']) {
      await router.push({ name })
      expect(router.currentRoute.value.name).toBe(name)
    }
    await router.push('/home')
    expect(router.currentRoute.value.name).toBe('connectDevice')
  })
})
