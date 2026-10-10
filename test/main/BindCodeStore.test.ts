import { createCipheriv, pbkdf2Sync } from 'node:crypto'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  BindCodeStore,
  decryptLegacyBindCode,
  type SafeStorageApi
} from '../../src/main/BindCodeStore'

const password = 'test-password'
const plain = 'AB12CD34'
// Generated independently using openssl enc -aes-256-cbc -nosalt -md md5.
const oldestCiphertext = 'ebbp9OFXRLeQMKKt+4kw4A=='

function ivCiphertext(): string {
  const iv = Buffer.from('00112233445566778899aabbccddeeff', 'hex')
  const key = pbkdf2Sync(password, iv.toString(), 10000, 32, 'sha512')
  const cipher = createCipheriv('aes-256-cbc', key, iv)
  return Buffer.concat([iv, Buffer.from(':'), cipher.update(plain), cipher.final()]).toString(
    'base64'
  )
}

describe('BindCodeStore', () => {
  let directory: string
  let file: string
  let available: boolean
  let safeStorage: SafeStorageApi

  beforeEach(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-bind-test-'))
    file = path.join(directory, 'test-seidbindCode.json')
    available = true
    safeStorage = {
      isEncryptionAvailable: () => available,
      encryptString: vi.fn((value: string) => Buffer.from(`encrypted:${value}`)),
      decryptString: vi.fn((value: Buffer) => value.toString().replace(/^encrypted:/, ''))
    }
  })

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
  })

  function store(writeAtomic?: (file: string, data: string) => Promise<void>): BindCodeStore {
    return new BindCodeStore({
      userData: directory,
      getSeid: async () => ({ isSuccess: true, result: 'test-seid' }),
      encryptionKey: password,
      safeStorage,
      writeAtomic
    })
  }

  it('writes uppercase codes as v2 using safeStorage and reads them', async () => {
    expect(await store().importBindCode('ab12cd34')).toEqual({ isSuccess: true, result: undefined })
    expect(JSON.parse(await readFile(file, 'utf8'))).toEqual({
      version: 2,
      bindCode: Buffer.from(`encrypted:${plain}`).toString('base64')
    })
    expect(await store().exportBindCode()).toEqual({ isSuccess: true, result: plain })
    expect(safeStorage.encryptString).toHaveBeenCalledWith(plain)
  })

  it.each([
    ['legacy IV', ivCiphertext()],
    ['legacy createDecipher', oldestCiphertext]
  ])('reads %s and migrates to v2', async (_format, ciphertext) => {
    await writeFile(file, JSON.stringify({ bindCode: ciphertext }))
    expect(await store().exportBindCode()).toEqual({ isSuccess: true, result: plain })
    expect(JSON.parse(await readFile(file, 'utf8')).version).toBe(2)
    expect(await store().exportBindCode()).toEqual({ isSuccess: true, result: plain })
  })

  it.each([ivCiphertext(), oldestCiphertext])(
    'preserves legacy data if encryption is unavailable',
    async ciphertext => {
      available = false
      const original = JSON.stringify({ bindCode: ciphertext })
      await writeFile(file, original)
      expect(await store().exportBindCode()).toEqual({ isSuccess: true, result: plain })
      expect(await readFile(file, 'utf8')).toBe(original)
    }
  )

  it('writes the original IV format when safeStorage is unavailable', async () => {
    available = false
    expect((await store().importBindCode('ab12cd34')).isSuccess).toBe(true)
    const data: { bindCode: string; version?: number } = JSON.parse(await readFile(file, 'utf8'))
    expect(data.version).toBeUndefined()
    expect(decryptLegacyBindCode(data.bindCode, password)).toBe(plain)
  })

  it('awaits atomic persistence before reporting success', async () => {
    let finish!: () => void
    const writer = vi.fn(
      () =>
        new Promise<void>(resolve => {
          finish = resolve
        })
    )
    let settled = false
    const pending = store(writer)
      .importBindCode(plain)
      .then(result => {
        settled = true
        return result
      })
    await vi.waitFor(() => expect(writer).toHaveBeenCalledOnce())
    expect(settled).toBe(false)
    finish()
    expect(await pending).toEqual({ isSuccess: true, result: undefined })
  })

  it('returns async write failure and preserves the existing file', async () => {
    await writeFile(file, 'existing data')
    const writer = async (): Promise<void> => {
      throw new Error('disk full')
    }
    expect(await store(writer).importBindCode(plain)).toEqual({
      isSuccess: false,
      result: 'disk full'
    })
    expect(await readFile(file, 'utf8')).toBe('existing data')
  })

  it('reports failed legacy migration rather than swallowing persistence errors', async () => {
    await writeFile(file, JSON.stringify({ bindCode: oldestCiphertext }))
    const writer = async (): Promise<void> => {
      throw new Error('permission denied')
    }
    expect(await store(writer).exportBindCode()).toEqual({
      isSuccess: false,
      result: 'permission denied'
    })
    expect(JSON.parse(await readFile(file, 'utf8')).bindCode).toBe(oldestCiphertext)
  })

  it('checks existence and forwards SEID failures without creating a file', async () => {
    expect(await store().isExistBindCodeFile()).toEqual({ isSuccess: true, result: false })
    await store().importBindCode(plain)
    expect(await store().isExistBindCodeFile()).toEqual({ isSuccess: true, result: true })
    const failed = new BindCodeStore({
      userData: directory,
      safeStorage,
      getSeid: async () => ({ isSuccess: false, result: 'device disconnected' })
    })
    expect(await failed.importBindCode(plain)).toEqual({
      isSuccess: false,
      result: 'device disconnected'
    })
  })
})
