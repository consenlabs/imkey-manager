import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page
} from '@playwright/test'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

let application: ElectronApplication
let page: Page
let directory: string
let gate: string

async function launch(options: { hidFailure?: boolean; delayed?: boolean } = {}): Promise<void> {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-binding-'))
  gate = path.join(directory, 'gate')
  if (options.delayed) await writeFile(gate + '-bind_acquire', '')
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  Object.assign(env, {
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/binding-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_E2E_SCENARIO: 'bound-other',
    IMKEY_E2E_LOG: path.join(directory, 'calls.log'),
    IMKEY_E2E_GATE: gate,
    IMKEY_E2E_BIND_ERROR: options.hidFailure ? 'hid-once' : ''
  })
  application = await electron.launch({ args: [path.resolve('.'), '--lang=en-US'], env })
  page = await application.firstWindow()
  await page.locator('.appStart button').click()
  await reconnect()
}

async function reconnect(): Promise<void> {
  await page.locator('.connectDevice button').first().click()
  await expect(page.locator('.tip5 input')).toHaveCount(8)
}

async function enterCode(code: string): Promise<void> {
  for (const [index, character] of [...code].entries()) {
    await page.locator('.tip5 input').nth(index).fill('')
    await page.locator('.tip5 input').nth(index).press(character)
  }
}

async function calls(): Promise<string[]> {
  return (await readFile(path.join(directory, 'calls.log'), 'utf8')).trim().split('\n')
}

async function expectNoBindingStored(): Promise<void> {
  const entries = (await readFile(path.join(directory, 'logs/manager.jsonl'), 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line) as { method?: string })
  expect(entries.some(entry => entry.method === 'importBindCode')).toBe(false)
  expect(await page.evaluate(() => window.imkey.device.call('isExistBindCodeFile'))).toEqual({
    isSuccess: true,
    result: false
  })
}

async function expectConnectionPage(): Promise<void> {
  await expect(page.locator('.tip5')).toHaveCount(0)
  await expect(page.locator('.tip1')).toHaveCount(0)
  await expect(page.locator('.connectDevice button').first()).toBeVisible()
  await expect(page.locator('.homeBox')).toHaveCount(0)
}

async function dismiss(action: 'backdrop' | 'Escape'): Promise<void> {
  if (action === 'backdrop') await page.locator('.tip5').click({ position: { x: 10, y: 10 } })
  else await page.keyboard.press('Escape')
}

test.afterEach(async () => {
  if (gate) await rm(gate + '-bind_acquire', { force: true })
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})

for (const action of ['backdrop', 'Escape'] as const) {
  test(`binding ${action} returns to connection and clears partial input before reconnecting`, async () => {
    await launch()
    await enterCode('A23')
    if (action === 'backdrop') await page.screenshot({ path: 'test-results/binding-dialog.png' })
    await dismiss(action)
    await expectConnectionPage()
    expect(await calls()).not.toContain('bind_acquire')
    await expectNoBindingStored()
    await reconnect()
    for (const input of await page.locator('.tip5 input').all()) await expect(input).toHaveValue('')
    await expect(page.locator('.bindTip p')).toHaveCount(0)
    await enterCode('A2345678')
    await expect(page.locator('.homeBox')).toBeVisible()
  })
}

test('binding dialog has no action buttons or forgotten-code entry and stays open on inner clicks', async () => {
  await launch()
  await expect(page.locator('.tip5 button')).toHaveCount(0)
  await expect(page.locator('.tip5')).not.toContainText(/forgot|忘记/i)
  await page.locator('.tip5 h3').click()
  await expect(page.locator('.tip5')).toBeVisible()
  await page.locator('.tip5 input').first().click()
  await expect(page.locator('.tip5')).toBeVisible()
  await page.screenshot({ path: 'test-results/binding-dialog.png' })
  await dismiss('backdrop')
  await expectConnectionPage()
  expect(await calls()).not.toContain('bind_acquire')
  await expectNoBindingStored()
  await reconnect()
  for (const input of await page.locator('.tip5 input').all()) await expect(input).toHaveValue('')
})

test('HID failure uses the connection error dialog and permits a fresh binding attempt', async () => {
  await launch({ hidFailure: true })
  await enterCode('A2345678')
  await expect(page.locator('.tip1')).toBeVisible()
  await expect(page.locator('.tip1')).toContainText('hidapi error')
  await expect(page.locator('.tip1')).not.toContainText('Binding code error')
  await expect(page.locator('.tip5')).toHaveCount(0)
  await page.screenshot({ path: 'test-results/binding-hid-error.png' })
  await expectNoBindingStored()
  await page.locator('.tip1 button').click()
  await reconnect()
  for (const input of await page.locator('.tip5 input').all()) await expect(input).toHaveValue('')
  await enterCode('A2345678')
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await calls()).filter(method => method === 'bind_acquire')).toHaveLength(2)
})

test('an actual wrong code keeps the binding dialog open and allows correction', async () => {
  await launch()
  await enterCode('B2345678')
  await expect(page.locator('.tip5 .bindTip p')).toBeVisible()
  await expect(page.locator('.tip1')).toHaveCount(0)
  await expectNoBindingStored()
  await enterCode('A2345678')
  await expect(page.locator('.homeBox')).toBeVisible()
})

for (const action of ['backdrop', 'Escape'] as const) {
  test(`binding ${action} cannot dismiss verification and success completes normally`, async () => {
    await launch({ delayed: true })
    await enterCode('A2345678')
    await expect.poll(calls).toContain('bind_acquire:waiting')
    await expect(page.locator('.tip5 .verification-pending')).toBeVisible()
    for (const input of await page.locator('.tip5 input').all()) await expect(input).toBeDisabled()
    await dismiss(action)
    await expect(page.locator('.tip5 .verification-pending')).toBeVisible()
    await expect(page.locator('.homeBox')).toHaveCount(0)
    await rm(gate + '-bind_acquire')
    await expect.poll(calls).toContain('bind_acquire:released')
    await expect(page.locator('.homeBox')).toBeVisible()
    expect(await calls()).toContain('btc_get_xpub')
    expect(await calls()).not.toContain('get_address')
  })
}

test('Escape can dismiss binding after a wrong-code verification finishes', async () => {
  await launch()
  await enterCode('B2345678')
  await expect(page.locator('.tip5 .bindTip p')).toBeVisible()
  for (const input of await page.locator('.tip5 input').all()) await expect(input).toBeEnabled()
  await dismiss('Escape')
  await expectConnectionPage()
  await expectNoBindingStored()
  expect(await calls()).not.toContain('btc_get_xpub')
  await reconnect()
  for (const input of await page.locator('.tip5 input').all()) await expect(input).toHaveValue('')
  await enterCode('A2345678')
  await expect(page.locator('.homeBox')).toBeVisible()
})
