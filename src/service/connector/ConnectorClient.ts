import koffi from 'koffi'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
export interface Connector {
  callImKeyApi(request: string): string
  getLastErrorMessage(): string | null
}
export interface ConnectorOptions {
  libraryPath: string
  platform: NodeJS.Platform
  isPackaged: boolean
  mockPath?: string
}
export function allowedMockPath(options: ConnectorOptions): string | undefined {
  return !options.isPackaged ? options.mockPath : undefined
}
export class ConnectorClient implements Connector {
  readonly loadError: { message: string; libraryPath: string } | null = null
  private call?: (request: string) => string
  private clear?: () => void
  private lastError?: () => string | null
  constructor(options: ConnectorOptions) {
    try {
      const mockPath = allowedMockPath(options)
      if (mockPath) {
        const mock = createRequire(resolve('package.json'))(resolve(mockPath)) as Connector
        this.call = mock.callImKeyApi.bind(mock)
        this.clear = () => {}
        this.lastError = mock.getLastErrorMessage.bind(mock)
        return
      }
      const library = koffi.load(options.libraryPath)
      this.call = library.func('const char *call_imkey_api(const char *request)') as (
        request: string
      ) => string
      if (options.platform === 'win32') {
        const clear = library.func('void imkey_clear_err_win(const char *unused)') as (
          unused: string
        ) => void
        const lastError = library.func(
          'const char *imkey_get_last_err_message_win(const char *unused)'
        ) as (unused: string) => string
        this.clear = () => clear('')
        this.lastError = () => lastError('')
      } else {
        this.clear = library.func('void imkey_clear_err()') as () => void
        this.lastError = library.func('const char *imkey_get_last_err_message()') as () => string
      }
    } catch (error) {
      this.loadError = {
        message: error instanceof Error ? error.message : String(error),
        libraryPath: options.libraryPath
      }
    }
  }
  callImKeyApi(request: string): string {
    if (!this.call || !this.clear)
      throw new Error(this.loadError?.message ?? 'Connector unavailable')
    this.clear()
    return this.call(request)
  }
  getLastErrorMessage(): string | null {
    return this.lastError?.() ?? this.loadError?.message ?? null
  }
}
