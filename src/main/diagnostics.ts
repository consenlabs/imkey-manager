import { failureCode } from '../shared/deviceErrors'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export interface DiagnosticFields {
  requestId?: number
  operationId?: string
  method?: string
  durationMs?: number
  success?: boolean
  code?: string
  stage?: string
  exitCode?: number
  delayMs?: number
  appVersion?: string
  electronVersion?: string
  platform?: string
  arch?: string
  packaged?: boolean
  libraryPath?: string
  librarySha256?: string
  reason?: string
  source?: string
  line?: number
  stream?: string
}
export type DiagnosticLog = (
  level: 'info' | 'warn' | 'error',
  event: string,
  fields?: DiagnosticFields
) => void
export const noDiagnostics: DiagnosticLog = () => {}

// Only explicitly selected metadata reaches disk or the terminal. Never pass request params,
// native output, exception messages, result payloads or environment variables to this logger.
function safeFields(fields: DiagnosticFields): DiagnosticFields {
  const safe: DiagnosticFields = {}
  const numbers = ['requestId', 'durationMs', 'exitCode', 'delayMs', 'line'] as const
  for (const key of numbers)
    if (typeof fields[key] === 'number' && Number.isFinite(fields[key])) safe[key] = fields[key]
  for (const key of ['success', 'packaged'] as const)
    if (typeof fields[key] === 'boolean') safe[key] = fields[key]
  for (const key of [
    'method',
    'code',
    'stage',
    'appVersion',
    'electronVersion',
    'platform',
    'arch',
    'reason',
    'source',
    'stream'
  ] as const) {
    const value = fields[key]
    if (typeof value === 'string' && /^[a-zA-Z0-9_.:-]{1,80}$/.test(value)) safe[key] = value
  }
  if (typeof fields.operationId === 'string' && /^[a-z0-9-]{1,64}$/.test(fields.operationId))
    safe.operationId = fields.operationId
  if (typeof fields.libraryPath === 'string') safe.libraryPath = fields.libraryPath.slice(0, 1024)
  if (/^[a-f0-9]{64}$/.test(fields.librarySha256 || '')) safe.librarySha256 = fields.librarySha256
  return safe
}
export class DiagnosticLogger {
  private tail: Promise<void> = Promise.resolve()
  private warned = false
  readonly log: DiagnosticLog
  constructor(
    private readonly directory: string,
    private readonly maxBytes = 1024 * 1024,
    private readonly backups = 3,
    private readonly terminal: (line: string) => void = line => console.info(line)
  ) {
    this.log = (level, event, fields = {}) => {
      if (!/^[a-z][a-z0-9.-]{0,79}$/.test(event)) return
      const line = JSON.stringify({
        time: new Date().toISOString(),
        level,
        event,
        ...safeFields(fields)
      })
      try {
        this.terminal(line)
      } catch {
        // Diagnostics must never fail a device operation.
      }
      this.tail = this.tail
        .then(() => this.write(line))
        .catch(() => {
          if (this.warned) return
          this.warned = true
          try {
            this.terminal(JSON.stringify({ level: 'warn', event: 'diagnostics.write-failed' }))
          } catch {
            // A closed terminal or disk error must not affect the application.
          }
        })
    }
  }
  private async write(line: string): Promise<void> {
    await fs.mkdir(this.directory, { recursive: true, mode: 0o700 })
    const filename = path.join(this.directory, 'manager.jsonl')
    const size = await fs
      .stat(filename)
      .then(stat => stat.size)
      .catch(() => 0)
    if (size && size + Buffer.byteLength(line) + 1 > this.maxBytes) {
      for (let i = this.backups; i >= 1; i--) {
        const source = i === 1 ? filename : `${filename}.${i - 1}`
        const destination = `${filename}.${i}`
        await fs.rm(destination, { force: true })
        await fs.rename(source, destination).catch(error => {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
        })
      }
    }
    await fs.appendFile(filename, `${line}\n`, { mode: 0o600 })
  }
  async flush(): Promise<void> {
    await this.tail
  }
}

// Native logs may contain binding codes, addresses or APDU bytes. Preserve classification
// and source coordinates only; unknown text is intentionally never copied to logs.
export function nativeOutputMetadata(output: string): DiagnosticFields {
  const reason = /panicked at/.test(output)
    ? 'native-panic'
    : /backtrace/i.test(output)
      ? 'native-backtrace'
      : 'native-output-redacted'
  const knownCodes = [
    'get_seid_error',
    'device_not_connected',
    'device_not_found',
    'user_not_confirmed'
  ]
  const code = knownCodes.find(code => output.includes(code))
  const location = output.match(/(?:^|[ /])([a-zA-Z0-9_-]+\.rs):(\d+)(?::\d+)?/)
  return {
    reason,
    ...(code ? { code: failureCode(code) } : {}),
    ...(location ? { source: location[1], line: Number(location[2]) } : {})
  }
}
