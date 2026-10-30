import { expect, it } from 'vitest'
import {
  firmwareDiagnosticCodes,
  firmwareDiagnosticStages,
  firmwareFailureCode,
  isFirmwareDiagnosticCode,
  isFirmwareDiagnosticStage
} from '../../src/shared/firmwareDiagnostics'
import { validateDeviceTrace } from '../../src/main/ipcPolicy'

it.each([
  ['device_session_changed', 'DEVICE_SESSION_CHANGED'],
  ['device_bind_check_failed', 'DEVICE_BIND_CHECK_FAILED'],
  ['firmware_recovery_version_mismatch', 'FIRMWARE_RECOVERY_VERSION_MISMATCH'],
  ['firmware_recovery_not_ready', 'FIRMWARE_RECOVERY_NOT_READY'],
  ['invalid_wallet_response', 'INVALID_WALLET_RESPONSE'],
  ['binding_code_file_missing', 'BINDING_CODE_FILE_MISSING'],
  ['binding_code_file_unreadable', 'BINDING_CODE_FILE_UNREADABLE'],
  ['firmware_recovery_unreadable', 'FIRMWARE_RECOVERY_UNREADABLE'],
  ['firmware_recovery_write_failed', 'FIRMWARE_RECOVERY_WRITE_FAILED']
])('maps only the exact known failure %s to %s', (result, code) => {
  expect(firmwareFailureCode(result)).toBe(code)
  expect(firmwareFailureCode({ result, code: 'DEVICE_OPERATION_FAILED' })).toBe(code)
  expect(firmwareFailureCode(new Error(result))).toBe(code)
})

it.each([
  'A2345678',
  'SEID_PRIVATE_DEVICE',
  'xpub-private-wallet',
  '1.9.11',
  'FIRMWARE_RECOVERY_PRIVATE_SECRET',
  'device_session_changed [private-operation]',
  'device_session_changed\nA2345678',
  'constructor',
  '__proto__',
  'toString',
  undefined,
  null,
  5,
  [],
  { code: 'FIRMWARE_RECOVERY_PRIVATE_SECRET', result: 'A2345678' },
  { code: 'A2345678', message: 'device_session_changed', seid: 'PRIVATE' },
  new Error('wallet private-address device_session_changed')
])('redacts unknown or decorated failure data %j', error => {
  expect(firmwareFailureCode(error)).toBe('DEVICE_OPERATION_FAILED')
})

it('retains only exact approved structured codes and ignores sensitive extra properties', () => {
  for (const code of firmwareDiagnosticCodes)
    expect(
      firmwareFailureCode({ code, result: 'private-native-output', bindCode: 'A2345678' })
    ).toBe(code)
  expect(
    firmwareFailureCode(
      Object.defineProperty({}, 'result', {
        get() {
          throw new Error('private-value')
        }
      })
    )
  ).toBe('DEVICE_OPERATION_FAILED')
})

it('shares the same closed stage and code lists with the IPC validator', () => {
  for (const stage of firmwareDiagnosticStages) {
    expect(isFirmwareDiagnosticStage(stage)).toBe(true)
    expect(() =>
      validateDeviceTrace({
        operationId: 'operation-1',
        action: 'firmware-upgrade',
        phase: 'failed',
        stage,
        code: 'DEVICE_OPERATION_FAILED'
      })
    ).not.toThrow()
  }
  for (const code of firmwareDiagnosticCodes) {
    expect(isFirmwareDiagnosticCode(code)).toBe(true)
    expect(() =>
      validateDeviceTrace({
        operationId: 'operation-1',
        action: 'firmware-upgrade',
        phase: 'failed',
        stage: 'verify',
        code
      })
    ).not.toThrow()
  }
  for (const value of [
    'A2345678',
    'firmware_recovery_version_mismatch',
    'VERIFY',
    '',
    undefined,
    {}
  ]) {
    expect(isFirmwareDiagnosticStage(value)).toBe(false)
    expect(isFirmwareDiagnosticCode(value)).toBe(false)
  }
})
