import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  app: { isPackaged: false, quit: vi.fn() },
  loadURL: vi.fn(),
  on: vi.fn(),
  once: vi.fn(),
  webContents: {
    on: vi.fn(),
    setWindowOpenHandler: vi.fn()
  }
}))
vi.mock('electron', () => ({
  app: mocks.app,
  BrowserWindow: class {
    webContents = mocks.webContents
    loadURL = mocks.loadURL
    on = mocks.on
    once = mocks.once
  },
  Menu: { buildFromTemplate: vi.fn(), setApplicationMenu: vi.fn() }
}))
import { createMainWindow } from '../../src/main/window'

beforeEach(() => {
  vi.clearAllMocks()
})
afterEach(() => {
  vi.unstubAllEnvs()
})

describe('main window renderer selection', () => {
  it('ignores a remote renderer URL in packaged builds', () => {
    mocks.app.isPackaged = true
    vi.stubEnv('ELECTRON_RENDERER_URL', 'https://attacker.example/renderer')
    createMainWindow(() => false)
    const loaded = mocks.loadURL.mock.calls[0][0] as string
    expect(loaded).toMatch(/^file:/)
    expect(new URL(loaded).pathname).toMatch(/\/renderer\/index\.html$/)
    expect(loaded).not.toContain('attacker.example')
  })

  it('loads the development renderer in unpackaged builds', () => {
    mocks.app.isPackaged = false
    vi.stubEnv('ELECTRON_RENDERER_URL', 'http://localhost:5173/')
    createMainWindow(() => false)
    expect(mocks.loadURL).toHaveBeenCalledWith('http://localhost:5173/')
  })

  it('loads the local renderer when no development URL is configured', () => {
    mocks.app.isPackaged = false
    vi.stubEnv('ELECTRON_RENDERER_URL', '')
    createMainWindow(() => false)
    const loaded = mocks.loadURL.mock.calls[0][0] as string
    expect(loaded).toMatch(/^file:/)
    expect(new URL(loaded).pathname).toMatch(/\/renderer\/index\.html$/)
  })
})
