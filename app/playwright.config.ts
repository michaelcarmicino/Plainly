import { defineConfig, devices } from '@playwright/test';

/** Serve solo a catturare gli screenshot per le slide (`npm run capture`).
 *  Non fa parte del prodotto e non gira in CI. */
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:5173',
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
  },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
