import { randomBytes } from 'node:crypto'
import { mkdir, open, rename, unlink } from 'node:fs/promises'
import path from 'node:path'
import {
  isFirmwareRecoveryCheckpoint,
  isValidDeviceParams,
  isValidFirmwareRecoverySeid,
  type DeviceCallContext,
  type DeviceResult,
  type FirmwareRecoveryCheckpoint
} from '../shared/deviceContract'

const maximumBytes = 4096
interface FirmwareRecoveryStoreOptions {
  userData: string
  getSeid: (context?: DeviceCallContext) => Promise<DeviceResult>
  writeAtomic?: (file: string, data: string) => Promise<void>
}

async function atomicWrite(file: string, data: string): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 })
  const temporary = `${file}.${randomBytes(16).toString('hex')}.tmp`
  try {
    const handle = await open(temporary, 'wx', 0o600)
    try {
      await handle.writeFile(data, 'utf8')
      await handle.sync()
    } finally {
      await handle.close()
    }
    await rename(temporary, file)
  } finally {
    await unlink(temporary).catch(() => undefined)
  }
}

function failure(code: string): DeviceResult<never> {
  // Never surface file contents, device identity, paths, or OS exception messages.
  return { isSuccess: false, result: code.toLowerCase(), code }
}

export class FirmwareRecoveryStore {
  private readonly writeAtomic: (file: string, data: string) => Promise<void>
  private pending: Promise<unknown> = Promise.resolve()

  constructor(private readonly options: FirmwareRecoveryStoreOptions) {
    this.writeAtomic = options.writeAtomic ?? atomicWrite
  }

  private serialize<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.pending.then(operation)
    this.pending = result.catch(() => undefined)
    return result
  }

  private async identity(context?: DeviceCallContext): Promise<string | null> {
    try {
      const response = await this.options.getSeid(context)
      return response.isSuccess && isValidFirmwareRecoverySeid(response.result)
        ? response.result.toUpperCase()
        : null
    } catch {
      return null
    }
  }

  private file(seid: string): string {
    return path.join(this.options.userData, 'firmware-recovery', `${seid}.json`)
  }

  getFirmwareRecovery(
    context?: DeviceCallContext
  ): Promise<DeviceResult<FirmwareRecoveryCheckpoint | null>> {
    return this.serialize(async () => {
      const seid = await this.identity(context)
      if (!seid) return failure('FIRMWARE_RECOVERY_DEVICE_UNAVAILABLE')
      try {
        const handle = await open(this.file(seid), 'r')
        let contents: string
        try {
          if (!(await handle.stat()).isFile()) throw new Error('Invalid recovery file')
          const buffer = Buffer.alloc(maximumBytes + 1)
          let size = 0
          while (size < buffer.length) {
            const { bytesRead } = await handle.read(buffer, size, buffer.length - size, null)
            if (!bytesRead) break
            size += bytesRead
          }
          if (size > maximumBytes) throw new Error('Recovery file exceeds limit')
          contents = buffer.subarray(0, size).toString('utf8')
        } finally {
          await handle.close()
        }
        const checkpoint: unknown = JSON.parse(contents)
        if (!isFirmwareRecoveryCheckpoint(checkpoint) || checkpoint.seid.toUpperCase() !== seid)
          return failure('FIRMWARE_RECOVERY_UNREADABLE')
        return { isSuccess: true, result: { ...checkpoint, seid } }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT')
          return { isSuccess: true, result: null }
        return failure('FIRMWARE_RECOVERY_UNREADABLE')
      }
    })
  }

  saveFirmwareRecovery(
    checkpoint: FirmwareRecoveryCheckpoint,
    context?: DeviceCallContext
  ): Promise<DeviceResult<undefined>> {
    // Validate and snapshot before queuing, so later caller mutations cannot persist extra data.
    if (!isFirmwareRecoveryCheckpoint(checkpoint))
      return Promise.resolve(failure('FIRMWARE_RECOVERY_INVALID'))
    const data = JSON.stringify({
      version: checkpoint.version,
      seid: checkpoint.seid.toUpperCase(),
      phase: checkpoint.phase,
      needsBinding: checkpoint.needsBinding,
      expectedCos: checkpoint.expectedCos,
      expectedBle: checkpoint.expectedBle,
      ...(checkpoint.pendingAddresses === undefined
        ? {}
        : { pendingAddresses: [...checkpoint.pendingAddresses] })
    })
    if (Buffer.byteLength(data, 'utf8') > maximumBytes)
      return Promise.resolve(failure('FIRMWARE_RECOVERY_INVALID'))
    const expectedSeid = checkpoint.seid.toUpperCase()
    return this.serialize(async () => {
      const seid = await this.identity(context)
      if (!seid) return failure('FIRMWARE_RECOVERY_DEVICE_UNAVAILABLE')
      if (seid !== expectedSeid) return failure('FIRMWARE_RECOVERY_DEVICE_MISMATCH')
      try {
        await this.writeAtomic(this.file(seid), data)
        return { isSuccess: true, result: undefined }
      } catch {
        return failure('FIRMWARE_RECOVERY_WRITE_FAILED')
      }
    })
  }

  clearFirmwareRecovery(
    params: { seid: string },
    context?: DeviceCallContext
  ): Promise<DeviceResult<undefined>> {
    if (!isValidDeviceParams('clearFirmwareRecovery', params))
      return Promise.resolve(failure('FIRMWARE_RECOVERY_INVALID'))
    const expectedSeid = params.seid.toUpperCase()
    return this.serialize(async () => {
      const seid = await this.identity(context)
      if (!seid) return failure('FIRMWARE_RECOVERY_DEVICE_UNAVAILABLE')
      if (seid !== expectedSeid) return failure('FIRMWARE_RECOVERY_DEVICE_MISMATCH')
      try {
        await unlink(this.file(seid))
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT')
          return failure('FIRMWARE_RECOVERY_WRITE_FAILED')
      }
      return { isSuccess: true, result: undefined }
    })
  }
}
