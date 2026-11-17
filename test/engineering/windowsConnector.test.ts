import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { expect, it } from 'vitest'

const binary = readFileSync('connector.dll')
const manifest = JSON.parse(readFileSync('connector.lock.json', 'utf8')).files['connector.dll']
const header = binary.readUInt32LE(0x3c)
const optional = header + 24
const sectionCount = binary.readUInt16LE(header + 6)
const sectionTable = optional + binary.readUInt16LE(header + 20)
const sections = Array.from({ length: sectionCount }, (_, index) => {
  const section = sectionTable + index * 40
  return {
    virtual: binary.readUInt32LE(section + 12),
    size: binary.readUInt32LE(section + 16),
    raw: binary.readUInt32LE(section + 20)
  }
})
function offset(rva: number): number {
  const section = sections.find(item => rva >= item.virtual && rva < item.virtual + item.size)
  if (!section) throw new Error(`No file-backed PE section for RVA ${rva}`)
  return rva - section.virtual + section.raw
}
function stringAt(rva: number): string {
  const start = offset(rva)
  const end = binary.indexOf(0, start)
  if (end < start) throw new Error('Unterminated PE name')
  return binary.toString('ascii', start, end)
}
function exportNames(): string[] {
  const directory = offset(binary.readUInt32LE(optional + 96))
  const count = binary.readUInt32LE(directory + 24)
  const names = offset(binary.readUInt32LE(directory + 32))
  return Array.from({ length: count }, (_, index) =>
    stringAt(binary.readUInt32LE(names + index * 4))
  )
}
function importNames(): string[] {
  const names: string[] = []
  let entry = offset(binary.readUInt32LE(optional + 104))
  while (binary.readUInt32LE(entry + 12)) {
    names.push(stringAt(binary.readUInt32LE(entry + 12)).toLowerCase())
    entry += 20
  }
  return names
}

it('ships an i386 PE32 DLL matching the existing Windows ia32 Manager', () => {
  expect(binary.toString('ascii', 0, 2)).toBe('MZ')
  expect(binary.toString('ascii', header, header + 4)).toBe('PE\0\0')
  expect(binary.readUInt16LE(header + 4)).toBe(0x14c)
  expect(binary.readUInt16LE(optional)).toBe(0x10b)
  expect(binary.readUInt16LE(header + 22) & 0x2000).toBe(0x2000)
  expect(manifest.architectures).toEqual(['i386'])
})

it('exports the undecorated cdecl functions used by the Windows connector adapter', () => {
  expect(exportNames()).toEqual(
    expect.arrayContaining([
      'call_imkey_api',
      'imkey_clear_err_win',
      'imkey_get_last_err_message_win',
      'imkey_free_const_string'
    ])
  )
})

it('needs only Windows system/UCRT libraries, without shipping MinGW runtime DLLs', () => {
  const systemLibraries = new Set([
    'advapi32.dll',
    'bcrypt.dll',
    'crypt32.dll',
    'kernel32.dll',
    'ncrypt.dll',
    'ntdll.dll',
    'secur32.dll',
    'setupapi.dll',
    'userenv.dll',
    'ws2_32.dll'
  ])
  const imports = importNames()
  expect(imports).toEqual(expect.arrayContaining(['setupapi.dll', 'secur32.dll', 'ws2_32.dll']))
  for (const name of imports)
    expect(systemLibraries.has(name) || /^api-ms-win-crt-[a-z0-9-]+\.dll$/.test(name), name).toBe(
      true
    )
})

it('ships the same reviewed core source patch as macOS and pins the Windows build record', () => {
  const mac = JSON.parse(readFileSync('connector.lock.json', 'utf8')).files['connector.dylib']
  const provenance = JSON.parse(readFileSync(manifest.buildProvenance, 'utf8'))
  expect(manifest.imkeyCoreCommit).toBe(mac.imkeyCoreCommit)
  expect(manifest.sourcePatchSha256).toBe(mac.sourcePatchSha256)
  expect(provenance.target).toBe('i686-pc-windows-gnu')
  expect(provenance.sourcePatchSha256).toBe(mac.sourcePatchSha256)
  expect(provenance.artifactSha256).toBe(createHash('sha256').update(binary).digest('hex'))
})
