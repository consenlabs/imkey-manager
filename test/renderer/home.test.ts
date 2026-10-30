import { ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSoftwareUpdate } from '../../src/renderer/composables/useSoftwareUpdate'
const lifecycle = vi.hoisted(() => ({ unmounted: [] as (() => void)[] }))
vi.mock('vue', async original => ({
  ...(await original<typeof import('vue')>()),
  onMounted: vi.fn(),
  onUnmounted: (callback: () => void) => lifecycle.unmounted.push(callback)
}))
function createHome() {
  const updater = {
    onMessage: vi.fn<(callback: (message: unknown) => void) => () => void>(() => vi.fn()),
    onProgress: vi.fn<(callback: (progress: { percent: number }) => void) => () => void>(() =>
      vi.fn()
    ),
    check: vi.fn().mockResolvedValue(undefined),
    download: vi.fn().mockResolvedValue(undefined),
    quitAndInstall: vi.fn().mockResolvedValue(undefined)
  }
  vi.stubGlobal('window', { imkey: { updater, app: { getVersion: async () => '2.2.0' } } })
  const status = ref(1)
  const home = useSoftwareUpdate(status, { installDelayMs: 5000 })
  return {
    home,
    status,
    updater,
    unmount: () => lifecycle.unmounted.forEach(callback => callback())
  }
}
async function createAvailableHome() {
  const context = createHome()
  await context.home.checkSoftUpdate()
  context.updater.onMessage.mock.calls[0][0]({
    action: 'updateAva',
    updateInfo: { version: '2.2.1', releaseNotes: '[{info:"Release note"}]' }
  })
  return context
}
beforeEach(() => {
  lifecycle.unmounted.length = 0
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
describe('home updater lifecycle', () => {
  it('does not invent an update when navigation dismisses an updater with no result', async () => {
    const { home, status, updater } = createHome()
    await home.checkSoftUpdate()
    home.later()
    expect(status.value).toBe(1)
    home.updateNowTip()
    expect(status.value).toBe(1)
    await home.updateNow()
    expect(updater.download).not.toHaveBeenCalled()
    expect(updater.quitAndInstall).not.toHaveBeenCalled()
  })
  it('preserves an actual update when dismissed and clears it after a no-update response', async () => {
    const { home, status, updater } = await createAvailableHome()
    home.updateNowTip()
    expect(status.value).toBe(4)
    home.later()
    expect(status.value).toBe(6)
    expect(home.state.softNewVersionData).toBe('2.2.1')
    expect(home.state.softUpdateInfo).toEqual([{ id: 0, info: 'Release note' }])
    updater.onMessage.mock.calls[0][0]({ action: 'updateNotAva' })
    expect(home.state.softNewVersionData).toBe('')
    expect(home.state.softUpdateInfo).toEqual([])
    home.later()
    home.updateNowTip()
    await home.updateNow()
    expect(status.value).toBe(1)
    expect(updater.download).not.toHaveBeenCalled()
  })
  it.each([undefined, {}, { version: '' }, { version: '  ' }, { version: 2 }])(
    'does not offer or download an update without a target version: %j',
    async updateInfo => {
      const { home, status, updater } = await createAvailableHome()
      updater.onMessage.mock.calls[0][0]({ action: 'updateAva', updateInfo })
      home.updateNowTip()
      await home.updateNow()
      expect(status.value).toBe(1)
      expect(home.state.softNewVersionData).toBe('')
      expect(home.state.softUpdateInfo).toEqual([])
      expect(updater.download).not.toHaveBeenCalled()
    }
  )
  it('parses legacy object-literal release notes as data without running expressions', async () => {
    const { home, updater } = createHome()
    await home.checkSoftUpdate()
    const callback = updater.onMessage.mock.calls[0][0]
    callback({
      action: 'updateAva',
      updateInfo: { version: '3.0', releaseNotes: '[{id:1,info:"已有升级说明"}]' }
    })
    expect(home.state.softUpdateInfo).toEqual([{ id: 1, info: '已有升级说明' }])
    vi.stubGlobal('executed', false)
    const expression = '[{id:1,info:(globalThis.executed = true)}]'
    callback({ action: 'updateAva', updateInfo: { version: '3.0', releaseNotes: expression } })
    expect(home.state.softUpdateInfo).toEqual([{ id: 0, info: expression }])
    expect((globalThis as unknown as { executed: boolean }).executed).toBe(false)
  })
  it('subscribes before checking and removes each subscription on unmount', async () => {
    const { home, updater, unmount } = await createAvailableHome()
    await home.updateNow()
    expect(updater.onMessage.mock.invocationCallOrder[0]).toBeLessThan(
      updater.check.mock.invocationCallOrder[0]
    )
    expect(updater.onProgress.mock.invocationCallOrder[0]).toBeLessThan(
      updater.download.mock.invocationCallOrder[0]
    )
    const removeMessage = updater.onMessage.mock.results[0].value
    const removeProgress = updater.onProgress.mock.results[0].value
    unmount()
    expect(removeMessage).toHaveBeenCalledOnce()
    expect(removeProgress).toHaveBeenCalledOnce()
  })
  it('waits for the download promise before scheduling installation despite 100 percent progress', async () => {
    vi.useFakeTimers()
    const { home, updater } = await createAvailableHome()
    let finishDownload!: () => void
    updater.download.mockImplementationOnce(
      () =>
        new Promise<void>(resolve => {
          finishDownload = resolve
        })
    )
    const downloading = home.updateNow()
    const callback = updater.onProgress.mock.calls[0][0]
    callback({ percent: 45.5 })
    expect(home.state.progress).toBe(46)
    callback({ percent: 100 })
    callback({ percent: 100 })
    await vi.advanceTimersByTimeAsync(10000)
    expect(updater.quitAndInstall).not.toHaveBeenCalled()
    finishDownload()
    await downloading
    await vi.advanceTimersByTimeAsync(4999)
    expect(updater.quitAndInstall).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(updater.quitAndInstall).toHaveBeenCalledOnce()
  })
  it('cancels a pending install on unmount', async () => {
    vi.useFakeTimers()
    const { home, updater, unmount } = await createAvailableHome()
    await home.updateNow()
    unmount()
    await vi.advanceTimersByTimeAsync(5000)
    expect(updater.quitAndInstall).not.toHaveBeenCalled()
  })
  it('does not schedule installation if unmounted while download is pending', async () => {
    vi.useFakeTimers()
    const { home, updater, unmount } = await createAvailableHome()
    let finishDownload!: () => void
    updater.download.mockImplementationOnce(
      () =>
        new Promise<void>(resolve => {
          finishDownload = resolve
        })
    )
    const downloading = home.updateNow()
    unmount()
    finishDownload()
    await downloading
    await vi.advanceTimersByTimeAsync(5000)
    expect(updater.quitAndInstall).not.toHaveBeenCalled()
  })
  it('handles rejected updater calls without leaving a downloading screen', async () => {
    const { home, status, updater } = await createAvailableHome()
    updater.download.mockRejectedValueOnce(new Error('download unavailable'))
    await home.updateNow()
    expect(home.state.errorInfo).toBe('download unavailable')
    expect(status.value).toBe(4)
  })
})
