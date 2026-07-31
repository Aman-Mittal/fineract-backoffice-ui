import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // The app is served by `ng serve`, which compiles lazy route chunks on demand,
  // so a first paint can exceed Playwright's 5s default. Assertions that use
  // .fill()/.click() already wait ~30s via actionability; this brings plain
  // expect() into the same range instead of failing on a slow-but-correct page.
  expect: { timeout: 15000 },
  use: {
    baseURL: 'https://localhost:4200',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    video: process.env.CI ? 'on' : 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm start',
    url: 'https://localhost:4200',
    reuseExistingServer: true,
    ignoreHTTPSErrors: true,
    timeout: 300000,
  },
});
