import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page
} from '@playwright/test'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
let application: ElectronApplication
let page: Page
let directory: string
let errors: string[]
async function launch(scenario = 'ready'): Promise<void> {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-e2e-'))
  const env: Record<string, string> = {
    ...(Object.fromEntries(
      Object.entries(process.env).filter(([, value]) => typeof value === 'string')
    ) as Record<string, string>),
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/e2e-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_E2E_SCENARIO: scenario
  }
  delete env.ELECTRON_RUN_AS_NODE
  application = await electron.launch({ args: [path.resolve('.')], env })
  page = await application.firstWindow()
  errors = []
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource'))
      errors.push(message.text())
  })
  page.on('pageerror', error => errors.push(error.message))
  await expect(page.locator('.appStart')).toBeVisible()
}
async function connect(bind = true): Promise<void> {
  await page.locator('.appStart button').click()
  await expect(page.locator('.connectDevice')).toBeVisible()
  await page.locator('.connectDevice button').first().click()
  if (bind) {
    await expect(page.locator('.tip5 input')).toHaveCount(8)
    for (const [index, character] of [...'A2345678'].entries())
      await page.locator('.tip5 input').nth(index).press(character)
  }
}
test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})
test('isolated bridge, ten concurrent requests, complete connection, navigation and settings', async () => {
  await launch()
  const bridge = await page.evaluate(async () => ({
    groups: Object.keys(window.imkey),
    node: typeof (window as unknown as { require?: unknown }).require,
    responses: await Promise.all(
      Array.from({ length: 10 }, () => window.imkey.device.call('getSeid'))
    )
  }))
  expect(bridge.groups).toEqual(['device', 'app', 'updater'])
  expect(bridge.node).toBe('undefined')
  expect(bridge.responses).toEqual(
    Array.from({ length: 10 }, () => ({ isSuccess: true, result: 'E2ESEID' }))
  )
  await expect(
    page.evaluate(() => window.imkey.app.openExternal('http://imkey.im'))
  ).rejects.toThrow()
  await expect(
    page.evaluate(() => window.imkey.device.call('signTransaction' as never))
  ).rejects.toThrow()
  await connect()
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(1).click()
  await expect(page.locator('.routerView .container')).toBeVisible()
  await expect(page.locator('.appItem')).toHaveCount(1)
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.locator('.routerView .container')).toBeVisible()
  await expect(page.locator('.routerView .container')).toContainText('SN123')
  await page.screenshot({ path: 'test-results/connected-settings.png', fullPage: true })
  expect(errors).toEqual([])
})
test('disconnected device shows existing connection error instead of hanging', async () => {
  await launch('disconnected')
  await connect(false)
  await expect(page.locator('.tip1')).toContainText('device_not_connected')
  expect(errors).toEqual([])
})
test('registration failure leaves application retryable and never reports installed', async () => {
  await launch('register-failure')
  await connect()
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(1).click()
  await expect(page.locator('.appItem')).toHaveCount(1)
  await page.locator('.appItem a').last().click()
  await expect(page.locator('.appItem a')).toHaveCount(1)
  await expect(page.locator('.appItem a')).toBeVisible()
  await expect(page.locator('.routerView .container')).toContainText('imKey')
  expect(await page.locator('.appItem .col').count()).toBe(0)
  expect(errors).toEqual([])
})
