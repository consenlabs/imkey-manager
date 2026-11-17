import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './test/e2e', timeout: 60000, workers: 1, fullyParallel: false,
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  reporter: [['list']], outputDir: 'test-results'
})
