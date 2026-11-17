import { nextTick, reactive, watch } from 'vue'
import { useDeviceOperation, type DeviceOperation } from './useDeviceOperation'
import { useAppStore } from '../store/app'
import { useDeviceStore } from '../store/device'
import { firmwareOperationError, operationError } from './operationError'
import { refreshDeviceIdentity } from './deviceIdentity'
import { useDeviceRecovery } from './useDeviceRecovery'
import { checkWalletReadiness } from './walletReadiness'
import { reconcileUpdateCheckpoint } from './firmwareResumeState'
import {
  cachedFirmware,
  firmwareAvailable,
  invalidateFirmware,
  publishFirmware
} from './firmwareCache'
import {
  runFirmwareRecovery,
  loadFirmwareRecovery,
  validateFirmwareResume,
  firmwareRecoveryRequiresBinding,
  type FirmwareRecovery
} from './firmwareRecovery'
import type { FirmwareCheckCache } from '../models/deviceState'
import type { DeviceResult } from '../../shared/deviceContract'
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
  reconciled?: boolean
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
    reconciled: false,
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
    state.reconciled = Boolean(saved.reconciled)
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
        recovering: false,
        reconciled: false
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
    state.errorInfo = stage === 'update' ? firmwareOperationError(error) : operationError(error)
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
    isCurrent: () => boolean = operation.active,
    knownFirmwareVersion?: string
  ) {
    state.errorInfo = ''
    const version = knownFirmwareVersion
      ? { isSuccess: true as const, result: knownFirmwareVersion }
      : await callDevice('getFirmwareVersion')
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
      const connected = await refreshDeviceIdentity(callDevice, device, operation.active, {
        hideCachedData: false,
        firmwareRecovery: Boolean(attempt),
        // A resumed post-update checkpoint may have lost its binding after a
        // device reset. Verify identity first, then recover that binding below.
        requireBinding: !attempt,
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
      if (!attempt) {
        // A new upgrade must not start when its post-upgrade address work cannot
        // derive a wallet. An existing recovery must continue even in bootloader.
        const wallet = await checkWalletReadiness(callDevice, app.userPath)
        if (!current()) return
        if (!wallet.isSuccess) return fail(wallet, 'wallet')
        // Do not trust a wallet read from a device that was replaced during it.
        const identity = await callDevice('getSeid')
        if (!current()) return
        if (!identity.isSuccess) return fail(identity, 'connect')
        if (identity.result.toUpperCase() !== device.connectedSeid.toUpperCase())
          return fail('device_session_changed', 'connect')
      }
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
        const reconciled = await reconcileUpdateCheckpoint(attempt.recovery, callDevice, current)
        if (!current()) return
        if (reconciled.failure) return fail(reconciled.failure.error, reconciled.failure.stage)
        if (reconciled.promoted) attempt.reconciled = state.reconciled = true
        const failure = await validateFirmwareResume(attempt.recovery, callDevice, current)
        if (!current()) return
        if (failure) return fail(failure.error, failure.stage)
        if (
          firmwareRecoveryRequiresBinding(attempt.recovery.phase, attempt.recovery.needsBinding)
        ) {
          const binding = await callDevice('deviceBindCheck')
          if (!current()) return
          if (!binding.isSuccess) return fail(binding, 'bind')
          if (binding.result === 'unbound') {
            attempt.recovery.needsBinding = true
            attempt.recovery.phase = 'load-code'
            attempt.recovery.bindCode = ''
            delete attempt.recovery.pendingAddresses
          } else if (binding.result !== 'bound_this') {
            return fail('device_bind_check_failed', 'bind')
          }
        }
      } else {
        state.reconciled = false
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
      const proof: { wallet?: DeviceResult<string> } = {}
      const failure = await runFirmwareRecovery(attempt.recovery, {
        call: callDevice,
        current,
        userPath: app.userPath,
        onWalletVerified(wallet) {
          proof.wallet = wallet
        },
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
      // Recovery verifies binding, wallet and identity before clearing its record.
      // Use that same proof so a second read cannot fail after the record is gone.
      if (!proof.wallet) return fail('invalid_wallet_response', 'wallet')
      device.identityReady = true
      if (!device.authorizeHome(sessionId, attempt.recovery.seid, proof.wallet))
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
  // App operations may resume an interrupted upgrade, but must never start one
  // solely because a newer release is available.
  async function recoverBeforeAppOperation(
    onConnectionFailure?: (error: unknown) => void
  ): Promise<'ready' | 'recovered' | 'failed'> {
    if (state.busy || !operation.active()) return 'failed'
    const sessionId = device.sessionId
    const current = () => operation.active() && device.sessionId === sessionId
    try {
      const connected = await refreshDeviceIdentity(callDevice, device, operation.active, {
        hideCachedData: false,
        firmwareRecovery: true,
        requireBinding: false
      })
      if (!connected.isSuccess) {
        if (connected.code === 'OPERATION_CANCELLED' || !operation.active()) return 'failed'
        if (onConnectionFailure) {
          onConnectionFailure(connected)
          return 'failed'
        }
        throw connected
      }
      if (!current()) return 'failed'
      const bootloader = await callDevice('isBLStatus')
      if (!current()) return 'failed'
      if (!bootloader.isSuccess) {
        throw bootloader
      }
      const saved = await loadFirmwareRecovery(callDevice, device.connectedSeid)
      if (!current()) return 'failed'
      if (!saved.isSuccess) {
        throw saved
      }
      let nativeIncomplete = bootloader.result
      if (!nativeIncomplete) {
        const status = await callDevice('cosCheckUpdate')
        if (!current()) return 'failed'
        if (!status.isSuccess) {
          throw status
        }
        if (typeof status.result.isUpdateSuccess !== 'boolean') {
          throw 'invalid_firmware_response'
        }
        nativeIncomplete = !status.result.isUpdateSuccess
      }
      let attempt = savedAttempt()
      if (!nativeIncomplete && !saved.result && !attempt) return 'ready'
      if (!attempt) {
        attempt = {
          sessionId,
          data: upgradeData(),
          recovery: saved.result || {
            seid: device.connectedSeid,
            phase: 'update',
            bindCode: '',
            needsBinding: true,
            expectedCos: '',
            expectedBle: ''
          }
        }
        attempts.set(device, attempt)
      }
      if (nativeIncomplete && attempt.recovery.phase !== 'update') {
        attempt.recovery.phase = 'update'
        attempt.recovery.expectedCos = ''
        attempt.recovery.expectedBle = ''
      }
      if (nativeIncomplete && !bootloader.result && !attempt.recovery.bindCode) {
        // If the device is still bound, secure the local recovery code before
        // a native call can change that binding. Bootloader recovery cannot
        // necessarily read the normal binding state and retains its old path.
        const binding = await callDevice('deviceBindCheck')
        if (!current()) return 'failed'
        if (!binding.isSuccess) throw binding
        if (binding.result === 'bound_this') {
          const code = await callDevice('exportBindCode')
          if (!current()) return 'failed'
          if (!code.isSuccess) throw code
          const confirmed = await refreshDeviceIdentity(callDevice, device, operation.active, {
            hideCachedData: false,
            firmwareRecovery: true,
            requireBinding: true
          })
          if (!confirmed.isSuccess) {
            if (confirmed.code === 'OPERATION_CANCELLED' || !operation.active()) return 'failed'
            if (onConnectionFailure) {
              onConnectionFailure(confirmed)
              return 'failed'
            }
            throw confirmed
          }
          if (!current()) return 'failed'
          attempt.recovery.bindCode = code.result
          attempt.data.bindCode = code.result
        } else if (binding.result !== 'unbound') {
          throw 'device_bind_check_failed'
        }
      }
      await updateFirmwareWithinOperation()
      if (!current() || state.supportCode !== 2) return 'failed'
      state.supportCode = 0
      return 'recovered'
    } catch (error) {
      if (current()) throw error
      return 'failed'
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
    recoverBeforeAppOperation,
    updateFirmware,
    updateFirmwareWithinOperation,
    isShowalert
  }
}
