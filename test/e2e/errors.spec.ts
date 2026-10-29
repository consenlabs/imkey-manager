import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page
} from '@playwright/test'
import { mkdtemp, rm, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
let application: ElectronApplication
let page: Page
let directory: string
async function launch(scenario = 'ready') {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-error-'))
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  Object.assign(env, {
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/e2e-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_E2E_SCENARIO: scenario
  })
  application = await electron.launch({ args: [path.resolve('.'), '--lang=en-US'], env })
  page = await application.firstWindow()
  await expect(page.locator('.appStart')).toBeVisible()
}
async function connect() {
  await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
  await page.locator('.appStart button').click()
  await page.locator('.connectDevice button').first().click()
}
async function settings() {
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.locator('.equipmentBox')).toContainText('SN123')
}
async function checkUpdate(method = 'checkSoftUpdate') {
  await page.evaluate(name => {
    type Node = {
      component?: { exposed?: Record<string, () => void>; subTree: Node }
      children?: Node[]
    }
    const root = (document.querySelector('#app') as unknown as { _vnode: Node })._vnode
    function invoke(node: Node): boolean {
      if (node.component?.exposed?.[name]) {
        node.component.exposed[name]()
        return true
      }
      if (node.component && invoke(node.component.subTree)) return true
      return Array.isArray(node.children) && node.children.some(invoke)
    }
    if (!invoke(root)) throw new Error(`Component method ${name} is not exposed`)
  }, method)
}
test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})
test('macOS plain native errors reach the connection dialog', async () => {
  await launch('disconnected-plain')
  await connect()
  await expect(page.locator('.tip1')).toContainText(/get seid error|get_seid_error/)
  const message = await page.locator('.tip1').innerText()
  const operationId = message.match(/\[([a-z0-9-]{1,64})\]/)?.[1]
  expect(operationId).toBeTruthy()
  await expect
    .poll(async () => {
      const lines = await readFile(path.join(directory, 'logs/manager.jsonl'), 'utf8')
      expect(lines).not.toContain('A2345678')
      return lines
        .trim()
        .split('\n')
        .map(line => JSON.parse(line) as { event: string; code?: string; operationId?: string })
        .some(
          entry =>
            entry.event === 'device.call-finished' &&
            entry.code === 'GET_SEID_ERROR' &&
            entry.operationId === operationId
        )
    })
    .toBe(true)
  await page.screenshot({ path: 'test-results/error-native-connection.png', fullPage: true })
})
test('address restoration displays its stage and plain native cause', async () => {
  await launch('cos-address-plain')
  await connect()
  await settings()
  await page.getByTestId('firmware-check-button').click()
  await expect(page.getByTestId('firmware-upgrade-button')).toBeVisible()
  await page.getByTestId('firmware-upgrade-button').click()
  await expect(page.locator('.alert3 .operation-error')).toContainText('Restore addresses')
  await expect(page.locator('.alert3 .operation-error')).toContainText(
    /get seid error|get_seid_error/
  )
  await page.screenshot({ path: 'test-results/error-native-restoration.png', fullPage: true })
})
test('visiting the device page does not create an update notification without update data', async () => {
  await launch()
  await connect()
  await expect(page.locator('.homeBox')).toBeVisible()
  await expect(page.locator('.tip6')).toHaveCount(0)
  for (let visit = 0; visit < 2; visit++) {
    await settings()
    await page.locator('.routerBar li').first().click()
    await expect(page.locator('.manager-home')).toBeVisible()
    await expect(page.locator('.tip6')).toHaveCount(0)
    await expect(page.locator('.status4AlertBox')).toHaveCount(0)
  }
  await application.evaluate(({ app }) => {
    const require = process
      .getBuiltinModule('module')
      .createRequire(app.getAppPath() + '/package.json')
    const updater = require('electron-updater').autoUpdater
    updater.emit('update-available', { version: '  ', releaseNotes: '' })
  })
  await expect(page.locator('.tip6')).toHaveCount(0)
  await expect(page.locator('.status4AlertBox')).toHaveCount(0)
})

test('updater errors are visible and retry reaches the normal update UI', async () => {
  await launch()
  await connect()
  await settings()
  await application.evaluate(({ app }) => {
    const require = process
      .getBuiltinModule('module')
      .createRequire(app.getAppPath() + '/package.json')
    const updater = require('electron-updater').autoUpdater
    let checks = 0
    updater.checkForUpdates = async () => {
      if (++checks === 1) {
        const error = new Error('E2E update server unavailable')
        updater.emit('error', error)
        throw error
      }
      updater.emit('update-available', { version: '2.2.1', releaseNotes: '' })
      return null
    }
    updater.downloadUpdate = async () => {
      throw new Error('E2E download unavailable')
    }
  })
  await checkUpdate()
  await expect(page.locator('.status2 .operation-error')).toContainText(
    'E2E update server unavailable'
  )
  await page.locator('.status2 button').click()
  await expect(page.locator('.tip6')).toHaveCount(1)
  await expect(page.locator('.tip6')).toBeVisible()
  await page.locator('.tip6 button').click()
  await expect(page.locator('.status4AlertBox')).toHaveCount(1)
  await expect(page.locator('.status4AlertBox')).toContainText('V2.2.1')
  await expect(page.locator('.release-notes-empty')).toContainText(
    'Release notes are not available.'
  )
  await page.locator('.updateNow').click()
  await expect(page.locator('.status4AlertBox .operation-error')).toContainText(
    'E2E download unavailable'
  )
  await expect(page.locator('.updateNow')).toBeVisible()
  await page.screenshot({ path: 'test-results/error-updater-retry.png', fullPage: true })
})

test('home updater errors remain visible and settings owns exactly one update UI', async () => {
  await launch()
  await connect()
  await expect(page.locator('.homeBox')).toBeVisible()
  await application.evaluate(({ app }) => {
    const require = process
      .getBuiltinModule('module')
      .createRequire(app.getAppPath() + '/package.json')
    const updater = require('electron-updater').autoUpdater
    let checks = 0
    updater.checkForUpdates = async () => {
      if (++checks === 1) {
        const error = new Error('E2E home check unavailable')
        updater.emit('error', error)
        throw error
      }
      updater.emit('update-available', {
        version: '2.2.1',
        releaseNotes: '[{info:"E2E release note"}]'
      })
      return null
    }
  })
  await checkUpdate('checkHomeUpdate')
  await expect(page.locator('.home-update-error .operation-error')).toContainText(
    'E2E home check unavailable'
  )
  await page.locator('.home-update-error button').click()
  await expect(page.locator('.tip6')).toHaveCount(1)
  await page.locator('.tip6 button').click()
  await expect(page.locator('.status4AlertBox')).toHaveCount(1)
  await expect(page.locator('.status4AlertBox')).toContainText('V2.2.1')
  await expect(page.locator('.status4AlertBox')).toContainText('V2.2.0')
  await expect(page.locator('.update-info-scroller')).toContainText('E2E release note')
  await page.locator('.later').click()
  await settings()
  await expect(page.locator('.home-update-error')).toHaveCount(0)
  await expect(page.locator('.tip6')).toHaveCount(0)
  await checkUpdate()
  await expect(page.locator('.tip6')).toHaveCount(1)
  await page.locator('.tip6 button').click()
  await expect(page.locator('.status4AlertBox')).toHaveCount(1)
  await expect(page.locator('.status4AlertBox')).toContainText('V2.2.1')
  await expect(page.locator('.update-info-scroller')).toContainText('E2E release note')
  await expect(page.locator('.status4AlertBox')).not.toContainText('新增暗黑模式')
  await page.screenshot({ path: 'test-results/error-home-updater-owner.png', fullPage: true })
})
