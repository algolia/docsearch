import { defineConfig, devices } from '@playwright/test';

// STARLIGHT_ROUTER=1 runs the navigation tests against a demo build with Astro's ClientRouter enabled.
const router = process.env.STARLIGHT_ROUTER === '1';
const astroConfig =
  '../../adapters/docsearch-starlight/e2e/client-navigation/astro.config.mjs';
const configFlag = router ? ` --config "${astroConfig}"` : '';

export default defineConfig({
  testDir: './adapters/docsearch-starlight/e2e',
  testMatch: router ? '**/client-navigation/*.spec.ts' : '**/astro.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4322',
    trace: 'on-first-retry',
  },
  webServer: {
    command: `bun run --cwd examples/demo-starlight astro build${configFlag} && bun run --cwd examples/demo-starlight astro preview${configFlag} --host 127.0.0.1 --port 4322`,
    reuseExistingServer: false,
    url: 'http://127.0.0.1:4322',
  },
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
