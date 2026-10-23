import { test, expect, _electron as electron, type ElectronApplication } from '@playwright/test'
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

let application: ElectronApplication
let directory: string
test.afterEach(async () => {
  // Release a paused service even if an assertion fails.
  if (directory) {
    await rm(path.join(directory, 'gate-device_connect'), { force: true })
    await rm(path.join(directory, 'gate-check_update'), { force: true })
  }
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})
for (const locale of ['zh-CN', 'en-US']) {
  test(`${locale} connection progress waits for real checks and identifies TSM rejection`, async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-connection-'))
    const gate = path.join(directory, 'gate')
    await writeFile(gate + '-device_connect', '')
    await writeFile(gate + '-check_update', '')
    const env = Object.fromEntries(
      Object.entries(process.env).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string'
      )
    )
    delete env.ELECTRON_RUN_AS_NODE
    Object.assign(env, {
      IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/connection-connector.cjs'),
      IMKEY_TEST_USER_DATA: directory,
      IMKEY_E2E_GATE: gate
    })
    application = await electron.launch({ args: [path.resolve('.'), `--lang=${locale}`], env })
    const page = await application.firstWindow()
    await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
    await page.locator('.appStart button').click()
    await page.locator('.connectDevice button').first().click()
    await expect(page.locator('.tip6')).toBeVisible()
    await expect(page.locator('.tip2')).toHaveCount(0)
    await rm(gate + '-device_connect')
    await expect(page.locator('.tip2')).toBeVisible()
    await expect(page.locator('.tip2 .fa-spin')).toHaveCount(1)
    await expect(page.locator('.tip2 .el-icon-success')).toHaveCount(0)
    await expect(page.locator('.tip2 .connection-step-pending')).toHaveCount(2)
    await page.screenshot({ path: `test-results/connection-${locale}-pending.png` })
    await rm(gate + '-check_update')
    const dialog = page.locator('.tip1')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText(locale === 'zh-CN' ? '版本检查' : 'Version check')
    await expect(dialog).toContainText('imkey_tsm_device_illegal')
    await expect(dialog).not.toContainText(
      locale === 'zh-CN' ? 'USB 连接异常' : 'usb connection error'
    )
    await expect(dialog).not.toContainText(locale === 'zh-CN' ? 'USB 接口' : 'USB interface')
    const operationId = (await dialog.innerText()).match(/\[([a-z0-9-]+)\]/)?.[1]
    expect(operationId).toBeTruthy()
    await expect
      .poll(async () =>
        (await readFile(path.join(directory, 'logs/manager.jsonl'), 'utf8'))
          .split('\n')
          .filter(Boolean)
          .map(line => JSON.parse(line) as { code?: string; operationId?: string })
          .some(entry => entry.operationId === operationId && entry.code === 'TSM_DEVICE_ILLEGAL')
      )
      .toBe(true)
    await page.screenshot({ path: `test-results/connection-${locale}-rejected.png` })
    await dialog.locator('button').click()
    await page.locator('.connectDevice button').first().click()
    await expect(page.locator('.homeBox')).toBeVisible()
  })
}
