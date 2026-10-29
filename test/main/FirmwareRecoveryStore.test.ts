import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FirmwareRecoveryStore } from '../../src/main/FirmwareRecoveryStore'
import type { DeviceResult, FirmwareRecoveryCheckpoint } from '../../src/shared/deviceContract'

const checkpoint: FirmwareRecoveryCheckpoint = {
  version: 1,
  seid: 'DEVICE-1234',
  phase: 'restore',
  needsBinding: true,
  expectedCos: '1.0.2',
  expectedBle: '2.0.0',
  pendingAddresses: ['Bitcoin', 'Ethereum']
}

describe('FirmwareRecoveryStore', () => {
  let directory: string
  let file: string
  const getSeid = vi.fn<() => Promise<DeviceResult>>()
  function store(
    writeAtomic?: (file: string, data: string) => Promise<void>
  ): FirmwareRecoveryStore {
    return new FirmwareRecoveryStore({ userData: directory, getSeid, writeAtomic })
  }

  beforeEach(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-recovery-test-'))
    file = path.join(directory, 'firmware-recovery', `${checkpoint.seid}.json`)
    getSeid.mockReset().mockResolvedValue({ isSuccess: true, result: checkpoint.seid })
  })
  afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
  })

  it('persists only progress across instances and atomically replaces private files', async () => {
    expect(await store().getFirmwareRecovery()).toEqual({ isSuccess: true, result: null })
    expect(await store().saveFirmwareRecovery(checkpoint)).toEqual({
      isSuccess: true,
      result: undefined
    })
    expect(await store().getFirmwareRecovery()).toEqual({ isSuccess: true, result: checkpoint })
    const next = { ...checkpoint, phase: 'verify' as const, pendingAddresses: [] }
    await store().saveFirmwareRecovery(next)
    expect(JSON.parse(await readFile(file, 'utf8'))).toEqual(next)
    if (process.platform !== 'win32') expect((await stat(file)).mode & 0o777).toBe(0o600)
    expect(await readdir(path.dirname(file))).toEqual([`${checkpoint.seid}.json`])
  })

  it('isolates devices and rejects save/clear after the device changes', async () => {
    await store().saveFirmwareRecovery(checkpoint)
    getSeid.mockResolvedValue({ isSuccess: true, result: 'replacement-device' })
    expect(await store().getFirmwareRecovery()).toEqual({ isSuccess: true, result: null })
    for (const result of [
      await store().saveFirmwareRecovery(checkpoint),
      await store().clearFirmwareRecovery({ seid: checkpoint.seid })
    ])
      expect(result).toMatchObject({ isSuccess: false, code: 'FIRMWARE_RECOVERY_DEVICE_MISMATCH' })
    expect(JSON.parse(await readFile(file, 'utf8'))).toEqual(checkpoint)
  })

  it.each(['../escape', '/tmp/escape', '..', 'a\\b', 'a'.repeat(129), ''])(
    'rejects unsafe native identity %j',
    async seid => {
      getSeid.mockResolvedValue({ isSuccess: true, result: seid })
      expect(await store().getFirmwareRecovery()).toMatchObject({
        isSuccess: false,
        code: 'FIRMWARE_RECOVERY_DEVICE_UNAVAILABLE'
      })
      expect(await readdir(directory)).toEqual([])
    }
  )

  it('keeps absent, unreadable and unavailable states distinct without leaking raw errors', async () => {
    await mkdir(path.dirname(file))
    for (const contents of [
      'not-json secret-data',
      JSON.stringify({ ...checkpoint, version: 2 }),
      JSON.stringify({ ...checkpoint, seid: 'other-device' }),
      JSON.stringify({ ...checkpoint, bindCode: 'SECRET12' }),
      ' '.repeat(4097)
    ]) {
      await writeFile(file, contents)
      expect(await store().getFirmwareRecovery()).toEqual({
        isSuccess: false,
        result: 'firmware_recovery_unreadable',
        code: 'FIRMWARE_RECOVERY_UNREADABLE'
      })
    }
    getSeid.mockRejectedValue(new Error('secret device details'))
    expect(await store().getFirmwareRecovery()).toEqual({
      isSuccess: false,
      result: 'firmware_recovery_device_unavailable',
      code: 'FIRMWARE_RECOVERY_DEVICE_UNAVAILABLE'
    })
  })

  it.each([
    { ...checkpoint, bindCode: 'SECRET12' },
    { ...checkpoint, filePath: '/tmp/escape' },
    { ...checkpoint, phase: 'arbitrary' },
    { ...checkpoint, needsBinding: 1 },
    { ...checkpoint, expectedCos: 'x'.repeat(65) },
    { ...checkpoint, pendingAddresses: ['Bitcoin', 'Bitcoin'] },
    { ...checkpoint, pendingAddresses: ['arbitrary'] },
    { ...checkpoint, expectedBle: undefined },
    { ...checkpoint, seid: '../escape' }
  ])('rejects invalid or sensitive checkpoint before touching storage: %j', async value => {
    expect(await store().saveFirmwareRecovery(value as FirmwareRecoveryCheckpoint)).toMatchObject({
      isSuccess: false,
      code: 'FIRMWARE_RECOVERY_INVALID'
    })
    expect(getSeid).not.toHaveBeenCalled()
    expect(await readdir(directory)).toEqual([])
  })

  it('uses one canonical record for mixed-case native and renderer identities', async () => {
    getSeid.mockResolvedValue({ isSuccess: true, result: 'dEvIcE-1234' })
    await store().saveFirmwareRecovery({ ...checkpoint, seid: 'device-1234' })
    expect(JSON.parse(await readFile(file, 'utf8')).seid).toBe('DEVICE-1234')
    getSeid.mockResolvedValue({ isSuccess: true, result: 'DEVICE-1234' })
    expect(await store().getFirmwareRecovery()).toEqual({ isSuccess: true, result: checkpoint })
    await store().saveFirmwareRecovery({ ...checkpoint, seid: 'DeViCe-1234', phase: 'verify' })
    expect(await readdir(path.dirname(file))).toEqual(['DEVICE-1234.json'])
    expect(await store().clearFirmwareRecovery({ seid: 'device-1234' })).toEqual({
      isSuccess: true,
      result: undefined
    })
    expect(await readdir(path.dirname(file))).toEqual([])
  })

  it('returns write errors while retaining the previous checkpoint', async () => {
    await store().saveFirmwareRecovery(checkpoint)
    const failed = store(async () => {
      throw new Error('private/path disk full')
    })
    expect(await failed.saveFirmwareRecovery({ ...checkpoint, phase: 'verify' })).toEqual({
      isSuccess: false,
      result: 'firmware_recovery_write_failed',
      code: 'FIRMWARE_RECOVERY_WRITE_FAILED'
    })
    expect(await store().getFirmwareRecovery()).toEqual({ isSuccess: true, result: checkpoint })
  })

  it('awaits persistence and orders clear after an outstanding save', async () => {
    let finish!: () => void
    const writer = vi.fn(async (target: string, data: string) => {
      await new Promise<void>(resolve => {
        finish = resolve
      })
      await mkdir(path.dirname(target), { recursive: true })
      await writeFile(target, data)
    })
    const recovery = store(writer)
    let settled = false
    const saving = recovery.saveFirmwareRecovery(checkpoint).then(value => {
      settled = true
      return value
    })
    const clearing = recovery.clearFirmwareRecovery({ seid: checkpoint.seid })
    await vi.waitFor(() => expect(writer).toHaveBeenCalledOnce())
    expect(settled).toBe(false)
    expect(getSeid).toHaveBeenCalledOnce()
    finish()
    expect(await saving).toEqual({ isSuccess: true, result: undefined })
    expect(await clearing).toEqual({ isSuccess: true, result: undefined })
    expect(await recovery.getFirmwareRecovery()).toEqual({ isSuccess: true, result: null })
  })

  it('clears only the matched device record and forwards operation context', async () => {
    const context = { operationId: 'firmware-1', stage: 'saveFirmwareRecovery' } as const
    const recovery = store()
    await recovery.saveFirmwareRecovery(checkpoint, context)
    await recovery.getFirmwareRecovery(context)
    await recovery.clearFirmwareRecovery({ seid: checkpoint.seid }, context)
    expect(getSeid.mock.calls).toEqual([[context], [context], [context]])
    expect(await recovery.getFirmwareRecovery()).toEqual({ isSuccess: true, result: null })
    expect(await recovery.clearFirmwareRecovery({ seid: checkpoint.seid })).toEqual({
      isSuccess: true,
      result: undefined
    })
  })
})
