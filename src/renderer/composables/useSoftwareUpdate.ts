import { onMounted, onUnmounted, reactive, type Ref } from 'vue'
import JSON5 from 'json5'
import { operationError } from './operationError'

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
interface UpdateOptions {
  installDelayMs?: number
  isEnabled?: () => boolean
}
function releaseNotes(value: unknown): { id: number | string; info: string }[] {
  let parsed = value
  if (typeof value === 'string') {
    try {
      parsed = JSON5.parse(value)
    } catch {
      return value.trim() ? [{ id: 0, info: value }] : []
    }
  }
  if (!Array.isArray(parsed)) return []
  return parsed.flatMap((note, id) => {
    if (!record(note)) return []
    const info = note.info ?? note.note
    const noteId = typeof note.id === 'number' || typeof note.id === 'string' ? note.id : id
    return typeof info === 'string' && info.trim() ? [{ id: noteId, info }] : []
  })
}
export function useSoftwareUpdate(status: Ref<number>, options: UpdateOptions = {}) {
  const state = reactive({
    progress: 0,
    softOldVersionData: '',
    softNewVersionData: '',
    softUpdateInfo: [] as { id: number | string; info: string }[],
    errorInfo: '',
    errorStage: '',
    busy: false
  })
  let active = true
  let unsubscribeMessage: (() => void) | undefined
  let unsubscribeProgress: (() => void) | undefined
  let retryDownload = false
  let installRequested = false
  let installTimer: ReturnType<typeof setTimeout> | undefined
  const enabled = () => active && (options.isEnabled?.() ?? true)
  const hasUpdate = () => state.softNewVersionData.length > 0
  function cancelInstall() {
    installRequested = false
    clearTimeout(installTimer)
    installTimer = undefined
  }
  function fail(error: unknown, download: boolean) {
    if (!enabled()) return
    cancelInstall()
    retryDownload = download
    state.errorInfo = operationError(error)
    state.errorStage = download ? 'download' : 'check'
    status.value = download ? 4 : 2
  }
  function later() {
    cancelInstall()
    status.value = hasUpdate() ? 6 : 1
  }
  function updateNowTip() {
    if (!enabled() || !hasUpdate()) return
    status.value = 4
    state.progress = 0
    state.errorInfo = ''
  }
  async function downloadAndUpdate() {
    if (state.busy || !enabled() || !hasUpdate()) return
    cancelInstall()
    installRequested = true
    state.busy = true
    state.errorInfo = ''
    status.value = 5
    unsubscribeProgress?.()
    unsubscribeProgress = window.imkey.updater.onProgress(value => {
      if (
        enabled() &&
        record(value) &&
        typeof value.percent === 'number' &&
        Number.isFinite(value.percent)
      )
        state.progress = Math.max(0, Math.min(100, Math.round(value.percent)))
    })
    try {
      await window.imkey.updater.download()
      if (!enabled() || state.errorInfo || !installRequested) return
      if (options.installDelayMs) {
        installTimer = setTimeout(() => {
          installTimer = undefined
          if (enabled() && installRequested && !state.errorInfo)
            void window.imkey.updater.quitAndInstall().catch(error => fail(error, true))
        }, options.installDelayMs)
      } else await window.imkey.updater.quitAndInstall()
    } catch (error) {
      fail(error, true)
    } finally {
      state.busy = false
      unsubscribeProgress?.()
      unsubscribeProgress = undefined
    }
  }
  function updateNow() {
    return downloadAndUpdate()
  }
  function clearUpdate() {
    cancelInstall()
    retryDownload = false
    state.softNewVersionData = ''
    state.softUpdateInfo = []
    state.progress = 0
    state.errorInfo = ''
    state.errorStage = ''
    status.value = 1
  }
  function subscribe() {
    unsubscribeMessage?.()
    unsubscribeMessage = window.imkey.updater.onMessage(value => {
      if (!enabled() || !record(value)) return
      if (value.action === 'error') {
        fail(value.errorInfo, status.value === 5)
      } else if (value.action === 'updateAva') {
        if (
          !record(value.updateInfo) ||
          typeof value.updateInfo.version !== 'string' ||
          !value.updateInfo.version.trim()
        ) {
          clearUpdate()
          return
        }
        state.softNewVersionData = value.updateInfo.version.trim()
        state.softUpdateInfo = releaseNotes(value.updateInfo.releaseNotes)
        state.errorInfo = ''
        state.errorStage = ''
        retryDownload = false
        status.value = 6
      } else if (value.action === 'updateNotAva') clearUpdate()
    })
  }
  async function checkSoftUpdate() {
    if (state.busy || !enabled()) return
    state.busy = true
    state.errorInfo = ''
    subscribe()
    try {
      await window.imkey.updater.check()
    } catch (error) {
      fail(error, false)
    } finally {
      state.busy = false
    }
  }
  function retry() {
    return retryDownload ? downloadAndUpdate() : checkSoftUpdate()
  }
  onMounted(() => {
    subscribe()
    void window.imkey.app
      .getVersion()
      .then(version => {
        if (active) state.softOldVersionData = version
      })
      .catch(error => fail(error, false))
  })
  onUnmounted(() => {
    active = false
    cancelInstall()
    unsubscribeMessage?.()
    unsubscribeProgress?.()
  })
  return { state, later, updateNowTip, updateNow, checkSoftUpdate, retry }
}
