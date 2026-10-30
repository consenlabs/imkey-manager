import { createCipheriv, createDecipheriv, createHash, pbkdf2Sync, randomBytes } from 'node:crypto'
import { access, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { DeviceCallContext, DeviceResult } from '../shared/deviceContract'

export interface SafeStorageApi {
  isEncryptionAvailable(): boolean
  encryptString(value: string): Buffer
  decryptString(value: Buffer): string
}

interface BindCodeStoreOptions {
  userData: string
  getSeid: (context?: DeviceCallContext) => Promise<DeviceResult>
  safeStorage: SafeStorageApi
  encryptionKey?: string
  writeAtomic?: (file: string, data: string) => Promise<void>
}

function legacyKey(password: string, iv: Buffer): Buffer {
  // Preserve the original UTF-8 interpretation of the IV used as PBKDF2 salt.
  return pbkdf2Sync(password, iv.toString(), 10000, 32, 'sha512')
}

export function encryptLegacyBindCode(value: string, password: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-cbc', legacyKey(password, iv), iv)
  return Buffer.concat([
    iv,
    Buffer.from(':'),
    cipher.update(value, 'utf8'),
    cipher.final()
  ]).toString('base64')
}

export function decryptLegacyBindCode(value: string, password: string): string {
  const data = Buffer.from(value, 'base64')
  let key: Buffer
  let iv: Buffer
  let encrypted: Buffer
  if (data.subarray(16, 17).toString() === ':') {
    iv = data.subarray(0, 16)
    key = legacyKey(password, iv)
    encrypted = data.subarray(17)
  } else {
    // OpenSSL EVP_BytesToKey: MD5, no salt, one iteration (old createDecipher).
    let previous: Buffer = Buffer.alloc(0)
    const blocks: Buffer[] = []
    for (let length = 0; length < 48; length += 16) {
      previous = createHash('md5').update(previous).update(Buffer.from(password, 'utf8')).digest()
      blocks.push(previous)
    }
    const material = Buffer.concat(blocks)
    key = material.subarray(0, 32)
    iv = material.subarray(32, 48)
    encrypted = data
  }
  const decipher = createDecipheriv('aes-256-cbc', key, iv)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}

async function atomicWrite(file: string, data: string): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.${randomBytes(8).toString('hex')}.tmp`
  try {
    await writeFile(temporary, data, { encoding: 'utf8', mode: 0o600, flag: 'wx' })
    await rename(temporary, file)
  } finally {
    await unlink(temporary).catch(() => undefined)
  }
}

function failure(error: unknown): DeviceResult {
  return { isSuccess: false, result: error instanceof Error ? error.message : String(error) }
}

export class BindCodeStore {
  private readonly writeAtomic: (file: string, data: string) => Promise<void>

  constructor(private readonly options: BindCodeStoreOptions) {
    this.writeAtomic = options.writeAtomic ?? atomicWrite
  }

  private async filePath(context?: DeviceCallContext): Promise<string> {
    const response = await this.options.getSeid(context)
    if (!response.isSuccess) throw new Error(response.result)
    const seid = response.result
    if (typeof seid !== 'string' || !seid || /[/\\]/.test(seid))
      throw new Error('Invalid device SEID')
    return path.join(this.options.userData, `${seid}bindCode.json`)
  }

  private password(): string {
    if (this.options.encryptionKey === undefined)
      throw new Error('Binding code encryption key is unavailable')
    return this.options.encryptionKey
  }

  private async write(file: string, bindCode: string): Promise<void> {
    const data = this.options.safeStorage.isEncryptionAvailable()
      ? {
          version: 2,
          bindCode: this.options.safeStorage.encryptString(bindCode).toString('base64')
        }
      : { bindCode: encryptLegacyBindCode(bindCode, this.password()) }
    await this.writeAtomic(file, JSON.stringify(data))
  }

  async importBindCode(bindCode: string, context?: DeviceCallContext): Promise<DeviceResult> {
    try {
      await this.write(await this.filePath(context), bindCode.toUpperCase())
      return { isSuccess: true, result: undefined }
    } catch (error) {
      return failure(error)
    }
  }

  async exportBindCode(context?: DeviceCallContext): Promise<DeviceResult> {
    let identityResolved = false
    try {
      const file = await this.filePath(context)
      identityResolved = true
      let contents: string
      try {
        contents = await readFile(file, 'utf8')
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT')
          return {
            isSuccess: false,
            result: 'binding_code_file_missing',
            code: 'BINDING_CODE_FILE_MISSING'
          }
        throw error
      }
      const parsed: unknown = JSON.parse(contents)
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        !('bindCode' in parsed) ||
        typeof parsed.bindCode !== 'string'
      ) {
        throw new Error('Invalid binding code file')
      }
      const version = 'version' in parsed ? parsed.version : undefined
      if (version !== undefined && version !== 2)
        throw new Error('Unsupported binding code file version')
      const bindCode =
        version === 2
          ? this.options.safeStorage.decryptString(Buffer.from(parsed.bindCode, 'base64'))
          : decryptLegacyBindCode(parsed.bindCode, this.password())
      if (version !== 2 && this.options.safeStorage.isEncryptionAvailable())
        await this.write(file, bindCode)
      return { isSuccess: true, result: bindCode }
    } catch (error) {
      return {
        isSuccess: false,
        result: error instanceof Error ? error.message : String(error),
        code: identityResolved ? 'BINDING_CODE_FILE_UNREADABLE' : 'BINDING_DEVICE_UNAVAILABLE'
      }
    }
  }

  async isExistBindCodeFile(context?: DeviceCallContext): Promise<DeviceResult> {
    try {
      const file = await this.filePath(context)
      try {
        await access(file)
        return { isSuccess: true, result: true }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT')
          return { isSuccess: true, result: false }
        throw error
      }
    } catch (error) {
      return failure(error)
    }
  }
}
