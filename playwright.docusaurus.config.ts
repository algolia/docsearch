import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './adapters/docusaurus-theme-search-algolia/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4323',
    trace: 'on-first-retry',
  },
  webServer: {
    command:
      'bun run --cwd examples/demo-docusaurus docusaurus build && bun run --cwd examples/demo-docusaurus docusaurus serve --host 127.0.0.1 --port 4323 --no-open',
    reuseExistingServer: false,
    url: 'http://127.0.0.1:4323',
    timeout: 300_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
