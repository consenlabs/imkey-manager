import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page,
  type Locator
} from '@playwright/test'
import { mkdtemp, rm, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
let application: ElectronApplication
let page: Page
let directory: string
async function launch(scenario = 'ready', language = 'en-US') {
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
  application = await electron.launch({ args: [path.resolve('.'), `--lang=${language}`], env })
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
async function expectButtonsInside(box: Locator) {
  await expect(box).toBeVisible()
  const buttons = box.locator('button')
  expect(await buttons.count()).toBeGreaterThan(0)
  for (const button of await buttons.all()) {
    await button.scrollIntoViewIfNeeded()
    const bounds = await button.evaluate(element => {
      const buttonRect = element.getBoundingClientRect()
      const boxRect = element
        .parentElement!.closest('.box, .alertBox, .tipBox, .tipBox3, .status4AlertBox')!
        .getBoundingClientRect()
      return {
        inside:
          buttonRect.top >= boxRect.top &&
          buttonRect.bottom <= boxRect.bottom &&
          buttonRect.left >= boxRect.left &&
          buttonRect.right <= boxRect.right,
        inViewport:
          buttonRect.top >= 0 &&
          buttonRect.left >= 0 &&
          buttonRect.bottom <= window.innerHeight &&
          buttonRect.right <= window.innerWidth
      }
    })
    expect(bounds).toEqual({ inside: true, inViewport: true })
  }
}
test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})
test('macOS plain native errors reach the connection dialog', async () => {
  await launch('disconnected-plain')
  await connect()
  await expect(page.locator('.tip1')).toContainText(/get seid error|get_seid_error/)
  await expectButtonsInside(page.locator('.tip1 .tipBox'))
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
  await expect(page.getByTestId('firmware-upgrade-button')).toBeVisible()
  await page.getByTestId('firmware-upgrade-button').click()
  await expect(page.locator('.alert3 .operation-error')).toContainText('Restore addresses')
  await expect(page.locator('.alert3 .operation-error')).toContainText(
    /get seid error|get_seid_error/
  )
  await expectButtonsInside(page.locator('.alert3'))
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
  await expectButtonsInside(page.locator('.status4AlertBox'))
  await expect(page.locator('.release-notes-empty')).toContainText(
    'Release notes are not available.'
  )
  await page.locator('.updateNow').click()
  await expect(page.locator('.status4AlertBox .operation-error')).toContainText(
    'E2E download unavailable'
  )
  await expect(page.locator('.updateNow')).toBeVisible()
  await expectButtonsInside(page.locator('.status4AlertBox'))
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
  await expectButtonsInside(page.locator('.status4AlertBox'))
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
  await expectButtonsInside(page.locator('.status4AlertBox'))
  await expect(page.locator('.update-info-scroller')).toContainText('E2E release note')
  await expect(page.locator('.status4AlertBox')).not.toContainText('新增暗黑模式')
  await page.screenshot({ path: 'test-results/error-home-updater-owner.png', fullPage: true })
})

for (const language of ['en-US', 'zh-CN']) {
  test(`${language} application failure and binding code dialogs keep buttons inside the card at the minimum window size`, async () => {
    await launch('register-failure', language)
    await application.evaluate(({ BrowserWindow }) =>
      BrowserWindow.getAllWindows()[0].setContentSize(900, 600)
    )
    await connect()
    await expect(page.locator('.homeBox')).toBeVisible()
    await page.locator('.routerBar li').nth(1).click()
    await page.locator('.appItem a').last().click()
    await expectButtonsInside(page.locator('.dioBox .box'))
    await page.locator('.dioBox button').click()
    await settings()
    await page.locator('.exportBindCode').click()
    await expect(page.locator('.alert4 .codeBox')).toBeVisible()
    await expectButtonsInside(page.locator('.alert4'))
  })

  test(`${language} Bluetooth update prompt keeps its confirmation inside the card`, async () => {
    await launch('ble-only', language)
    await application.evaluate(({ BrowserWindow }) =>
      BrowserWindow.getAllWindows()[0].setContentSize(900, 600)
    )
    await connect()
    await settings()
    await page.getByTestId('firmware-upgrade-button').click()
    await expect(page.locator('.alert2 button')).toBeVisible()
    await expectButtonsInside(page.locator('.alert2'))
  })
}
