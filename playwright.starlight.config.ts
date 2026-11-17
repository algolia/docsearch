import { defineConfig, devices } from '@playwright/test';

// STARLIGHT_SUITE picks the demo build: keyword-only (default), `router` (ClientRouter), or `askai` (the demo as-is).
const e2eDir = '../../adapters/docsearch-starlight/e2e';
const suites = {
  keyword: {
    astroConfig: `${e2eDir}/keyword/astro.config.mjs`,
    testMatch: '**/astro.spec.ts',
  },
  router: {
    astroConfig: `${e2eDir}/client-navigation/astro.config.mjs`,
    testMatch: '**/client-navigation/*.spec.ts',
  },
  askai: { astroConfig: undefined, testMatch: '**/ask-ai.spec.ts' },
};
const suite =
  suites[(process.env.STARLIGHT_SUITE ?? 'keyword') as keyof typeof suites];
if (!suite) {
  throw new Error(`Unknown STARLIGHT_SUITE: ${process.env.STARLIGHT_SUITE}`);
}
const configFlag = suite.astroConfig ? ` --config "${suite.astroConfig}"` : '';

export default defineConfig({
  testDir: './adapters/docsearch-starlight/e2e',
  testMatch: suite.testMatch,
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
