import { defineConfig, devices } from '@playwright/test';

const clientAstroConfig = '../../adapters/docsearch-starlight/e2e/client-navigation/astro.config.mjs';

export default defineConfig({
  testDir: './adapters/docsearch-starlight/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4322',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'bun run playground-starlight:test',
      reuseExistingServer: false,
      url: 'http://127.0.0.1:4322',
    },
    {
      command: `bun run --cwd examples/demo-starlight astro build --config "${clientAstroConfig}" && bun run --cwd examples/demo-starlight astro preview --config "${clientAstroConfig}" --host 127.0.0.1 --port 4323 --ignore-lock`,
      reuseExistingServer: false,
      url: 'http://127.0.0.1:4323',
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }, */
  ],
});