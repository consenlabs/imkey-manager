import { nextTick, reactive, watch } from 'vue'
import { useDeviceOperation, type DeviceOperation } from './useDeviceOperation'
import { useAppStore } from '../store/app'
import { useDeviceStore } from '../store/device'
import { operationError } from './operationError'
import { refreshDeviceIdentity } from './deviceIdentity'
import { useDeviceRecovery } from './useDeviceRecovery'
import {
  cachedFirmware,
  firmwareAvailable,
  invalidateFirmware,
  publishFirmware
} from './firmwareCache'
import {
  runFirmwareRecovery,
  validateFirmwareResume,
  firmwareRecoveryRequiresBinding,
  type FirmwareRecovery
} from './firmwareRecovery'
import type { FirmwareCheckCache } from '../models/deviceState'
import { isFirmwareDiagnosticStage } from '../../shared/firmwareDiagnostics'

type UpgradeData = {
  bindCode: string
  cosOldVersionData: string
  cosNewVersionData: string
  bleOldVersionData: string
  bleNewVersionData: string
}
interface UpgradeAttempt {
  sessionId: number
  data: UpgradeData
  recovery: FirmwareRecovery
}
export type FirmwareUpgradePhase =
  | 'idle'
  | 'preparing'
  | 'update'
  | 'reading'
  | 'bind'
  | 'store'
  | 'restore'
  | 'verifying'
  | 'complete'
// Retain only in-memory recovery inputs for this device session, including page reentry.
// They are never serialized into the store or diagnostics.
const attempts = new WeakMap<ReturnType<typeof useDeviceStore>, UpgradeAttempt>()

export function useFirmwareUpgrade(kind: 'manager' | 'setting', scope?: DeviceOperation) {
  const operation = scope || useDeviceOperation()
  const callDevice = operation.call
  const device = useDeviceStore()
  const app = useAppStore()
  const recovery = useDeviceRecovery(operation)
  const state = reactive({
    supportCode: 0,
    errorInfo: '',
    errorStage: '',
    busy: false,
    phase: 'idle' as FirmwareUpgradePhase,
    recovering: false,
    bindCode: '',
    cosOldVersionData: '',
    cosNewVersionData: '',
    bleOldVersionData: '',
    bleNewVersionData: '',
    isCosUpdate: false,
    cosUpdateStatus: '0'
  })
  function savedAttempt() {
    const saved = attempts.get(device)
    if (saved && saved.sessionId === device.sessionId) return saved
    attempts.delete(device)
  }
  function pendingRecoveryOptions() {
    const saved = savedAttempt()
    if (!saved) return undefined
    return {
      firmwareRecovery: true,
      requireBinding: firmwareRecoveryRequiresBinding(
        saved.recovery.phase,
        saved.recovery.needsBinding
      ),
      preserveOnTransportError: true
    }
  }
  function restoreAttempt() {
    const saved = savedAttempt()
    if (!saved) return false
    Object.assign(state, saved.data)
    state.isCosUpdate = true
    state.cosUpdateStatus = '1'
    state.recovering = saved.recovery.phase !== 'update'
    return true
  }
  function upgradeData(): UpgradeData {
    const { bindCode, cosOldVersionData, cosNewVersionData, bleOldVersionData, bleNewVersionData } =
      state
    return { bindCode, cosOldVersionData, cosNewVersionData, bleOldVersionData, bleNewVersionData }
  }
  watch(
    () => device.sessionId,
    () => {
      attempts.delete(device)
      Object.assign(state, {
        bindCode: '',
        cosOldVersionData: '',
        cosNewVersionData: '',
        bleOldVersionData: '',
        bleNewVersionData: '',
        isCosUpdate: false,
        cosUpdateStatus: '0',
        supportCode: 0,
        phase: 'idle',
        recovering: false
      })
    },
    { flush: 'sync' }
  )
  function changeCode(code: number) {
    if (state.busy && code !== 1) return
    state.supportCode = code
  }
  function fail(error: unknown, stage: string, diagnosticStage = stage) {
    if (!operation.active() || (error as { code?: string })?.code === 'OPERATION_CANCELLED') return
    operation.failure?.(
      isFirmwareDiagnosticStage(diagnosticStage)
        ? diagnosticStage
        : isFirmwareDiagnosticStage(stage)
          ? stage
          : 'check',
      error
    )
    const result = typeof error === 'string' ? error : (error as { result?: unknown })?.result
    if (result === 'device_session_changed' || result === 'device_bind_check_failed') {
      attempts.delete(device)
      device.invalidateDeviceData()
      state.errorInfo = operationError(error)
      state.errorStage = stage
      recovery.offer(error, updateFirmware, { reconnectOnly: true })
      return
    }
    state.errorInfo = operationError(error)
    state.errorStage = stage
    state.isCosUpdate = true
    device.isCosUpdate = true
    state.cosUpdateStatus = '1'
    state.supportCode = 3
    state.recovering = Boolean(savedAttempt() && savedAttempt()!.recovery.phase !== 'update')
  }
  function applyCheck(result: FirmwareCheckCache) {
    state.cosOldVersionData = result.firmwareVersion
    state.bleOldVersionData = result.bleVersion
    state.cosNewVersionData = result.latestFirmwareVersion
    state.bleNewVersionData = result.latestBleVersion
    state.isCosUpdate = firmwareAvailable(result, kind)
    state.cosUpdateStatus = state.isCosUpdate ? '1' : '0'
    state.errorInfo = ''
    state.errorStage = ''
    if (state.supportCode === 5) state.supportCode = 0
    restoreAttempt()
  }
  function restoreCachedCheck(): boolean {
    if (restoreAttempt()) return true
    const cached = cachedFirmware(device)
    if (!cached) return false
    applyCheck(cached)
    return true
  }
  function failedCheck(error: unknown) {
    invalidateFirmware(device)
    state.isCosUpdate = false
    state.cosUpdateStatus = '2'
    state.errorInfo = operationError(error)
    state.errorStage = 'check'
    state.supportCode = 5
  }
  async function checkFirmwareVersion(
    onVersion?: () => void,
    isCurrent: () => boolean = operation.active
  ) {
    state.errorInfo = ''
    const version = await callDevice('getFirmwareVersion')
    if (!operation.active() || !isCurrent()) return
    if (!version.isSuccess) return failedCheck(version)
    state.cosOldVersionData = version.result
    device.cosOldVersionData = version.result
    onVersion?.()
    const knownBle = state.bleOldVersionData || device.bleOldVersionData
    if (!knownBle) {
      const ble = await callDevice('getBleVersion')
      if (!operation.active() || !isCurrent()) return
      if (!ble.isSuccess) return failedCheck(ble)
      state.bleOldVersionData = ble.result
      device.bleOldVersionData = ble.result
    } else state.bleOldVersionData = knownBle
    const update = await callDevice('cosCheckUpdate')
    if (!operation.active() || !isCurrent()) return
    if (!update.isSuccess) return failedCheck(update)
    if (kind === 'manager' && device.connectedSeid) {
      // The application page also publishes this result for the device page.
      // Verify the device after the remote query before associating its result.
      const identity = await callDevice('getSeid')
      if (!operation.active() || !isCurrent()) return
      if (!identity.isSuccess) return failedCheck(identity)
      if (identity.result.toUpperCase() !== device.connectedSeid.toUpperCase())
        return fail('device_session_changed', 'check')
    }
    const result: FirmwareCheckCache = {
      seid: device.connectedSeid,
      firmwareVersion: version.result,
      bleVersion: state.bleOldVersionData,
      latestFirmwareVersion: update.result.latestCosVersion || version.result,
      latestBleVersion: update.result.latestBleVersion || state.bleOldVersionData,
      checkedAt: Date.now()
    }
    publishFirmware(device, result)
    applyCheck(result)
  }
  async function ensureFirmwareVersion(isCurrent: () => boolean = operation.active) {
    if (!isCurrent()) return
    if (!restoreCachedCheck()) await checkFirmwareVersion(undefined, isCurrent)
  }
  function completed(attempt: UpgradeAttempt) {
    const data = attempt.data
    state.cosOldVersionData = attempt.recovery.expectedCos
    state.bleOldVersionData = attempt.recovery.expectedBle
    state.isCosUpdate = Boolean(
      (data.cosNewVersionData && data.cosNewVersionData !== state.cosOldVersionData) ||
      (kind === 'setting' &&
        data.bleNewVersionData &&
        data.bleNewVersionData !== state.bleOldVersionData)
    )
    state.cosUpdateStatus = state.isCosUpdate ? '1' : '0'
    invalidateFirmware(device)
    device.cosOldVersionData = state.cosOldVersionData
    device.bleOldVersionData = state.bleOldVersionData
    device.installedBleVersion = state.bleOldVersionData
    device.isCosUpdate = state.isCosUpdate
    device.deviceInfo = null
    if (attempt.recovery.needsBinding) {
      device.isFirstGoToManagerPage = true
    }
    state.phase = 'complete'
    state.recovering = false
    state.supportCode = 2
    attempts.delete(device)
  }
  function beginFeedback() {
    device.revokeHomeAccess()
    state.busy = true
    state.phase = 'preparing'
    state.supportCode = 1
    state.errorInfo = ''
    state.errorStage = ''
    void nextTick(() => operation.feedback?.())
  }
  async function executeUpgrade() {
    const sessionId = device.sessionId
    const current = () => operation.active() && device.sessionId === sessionId
    try {
      let attempt = savedAttempt()
      if (attempt && attempt.recovery.seid.toUpperCase() !== device.connectedSeid.toUpperCase())
        return fail('device_session_changed', 'connect')
      const data = attempt?.data || upgradeData()
      const phase = attempt?.recovery.phase
      const connected = await refreshDeviceIdentity(callDevice, device, operation.active, {
        hideCachedData: false,
        firmwareRecovery: Boolean(attempt),
        requireBinding:
          !attempt || firmwareRecoveryRequiresBinding(phase!, attempt.recovery.needsBinding),
        preserveOnTransportError: true
      })
      if (!connected.isSuccess) {
        if (
          connected.result !== 'device_session_changed' &&
          connected.result !== 'device_bind_check_failed'
        )
          Object.assign(state, data)
        return fail(connected, 'connect')
      }
      if (!current()) return
      const needsBinding = kind === 'manager' || data.cosOldVersionData !== data.cosNewVersionData
      if (!attempt && needsBinding && !data.bindCode) {
        const binding = await callDevice('exportBindCode')
        if (!current()) return
        if (!binding.isSuccess) return fail(binding, 'store')
        // The file read itself obtains a device SEID. Confirm identity and binding
        // again before using its code; page caches cannot authorize this operation.
        const confirmed = await refreshDeviceIdentity(callDevice, device, operation.active, {
          hideCachedData: false,
          preserveOnTransportError: true
        })
        if (!confirmed.isSuccess) return fail(confirmed, 'connect')
        if (!current()) return
        data.bindCode = binding.result
      }
      if (attempt) {
        const failure = await validateFirmwareResume(attempt.recovery, callDevice, current)
        if (!current()) return
        if (failure) return fail(failure.error, failure.stage)
      } else {
        attempt = {
          sessionId,
          data,
          recovery: {
            seid: device.connectedSeid,
            phase: 'update',
            bindCode: data.bindCode,
            needsBinding,
            expectedCos: '',
            expectedBle: '',
            ...(data.cosOldVersionData ? { previousCos: data.cosOldVersionData } : {})
          }
        }
        attempts.set(device, attempt)
      }
      Object.assign(state, data)
      const failure = await runFirmwareRecovery(attempt.recovery, {
        call: callDevice,
        current,
        userPath: app.userPath,
        onPhase(phase) {
          state.phase =
            phase === 'capture-versions'
              ? 'reading'
              : phase === 'verify' || phase === 'complete'
                ? 'verifying'
                : phase === 'load-code'
                  ? 'bind'
                  : phase === 'apps'
                    ? 'restore'
                    : phase
          state.errorStage = phase === 'load-code' ? 'store' : phase === 'apps' ? 'restore' : phase
          state.recovering = phase !== 'update' && phase !== 'complete'
          if (phase !== 'update') invalidateFirmware(device)
        }
      })
      if (!current()) return
      if (failure) return fail(failure.error, failure.stage, attempt.recovery.phase)
      // Returning to an already open home shell requires fresh binding+wallet
      // proof as well. getBTCXpub enforces bound_this in the device service.
      const wallet = await callDevice('getBTCXpub', app.userPath)
      if (!current()) return
      if (!wallet.isSuccess) return fail(wallet, 'wallet')
      const confirmed = await callDevice('getUpgradeSeid')
      if (!current()) return
      if (!confirmed.isSuccess) return fail(confirmed, 'connect')
      if (confirmed.result.toUpperCase() !== attempt.recovery.seid.toUpperCase())
        return fail('device_session_changed', 'connect')
      device.identityReady = true
      if (!device.authorizeHome(sessionId, attempt.recovery.seid, wallet))
        return fail('invalid_wallet_response', 'wallet')
      completed(attempt)
    } catch (error) {
      if (current()) fail(error, state.errorStage || 'update')
    }
  }
  async function updateFirmwareWithinOperation() {
    if (state.busy || !operation.active()) return
    beginFeedback()
    try {
      await executeUpgrade()
    } finally {
      state.busy = false
    }
  }
  async function updateFirmware() {
    if (state.busy || !operation.active()) return
    beginFeedback()
    try {
      await operation.run(executeUpgrade, 'action', 'firmware-upgrade')
    } finally {
      state.busy = false
    }
  }
  function isShowalert() {
    if (state.busy) return
    if (!savedAttempt() && state.bleOldVersionData !== state.bleNewVersionData) changeCode(6)
    else void updateFirmware()
  }
  restoreCachedCheck()
  return {
    state,
    pendingRecoveryOptions,
    changeCode,
    checkFirmwareVersion,
    ensureFirmwareVersion,
    restoreCachedCheck,
    updateFirmware,
    updateFirmwareWithinOperation,
    isShowalert
  }
}
