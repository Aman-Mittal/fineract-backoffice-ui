import os from 'node:os';
import path from 'node:path';

import { defineConfig, devices } from '@playwright/test';

/**
 * The specs that talk to a real Fineract rather than mocking with page.route().
 *
 * They are the slow half of the suite and the only half that needs the docker
 * stack, so they are split into their own project: CI runs the mocked half
 * without bringing Fineract up at all, and the two halves run concurrently.
 *
 * A spec belongs here if it contains no page.route() mocks.
 */
const BACKEND_SPECS = [
  'client-transfer.spec.ts',
  'deposit-account-servicing.spec.ts',
  'full-demo.spec.ts',
  'group-membership.spec.ts',
  'loan-account-actions.spec.ts',
  'loan-charge-off.spec.ts',
  'loan-lifecycle.spec.ts',
  'loan-product-accounting.spec.ts',
  'loan-schedule-type.spec.ts',
  'loan-servicing.spec.ts',
  'login.spec.ts',
  'teller-cash-management.spec.ts',
];

export default defineConfig({
  testDir: './e2e',
  // Kept outside the project directory. The dev server under test watches the
  // repo, and Playwright creates and deletes .playwright-artifacts-* directories
  // inside outputDir continuously while a run is in progress. Vite's watcher
  // races those deletions and dies on an ENOENT scandir, which takes the whole
  // server down mid-suite — every test after that point fails with
  // ERR_CONNECTION_REFUSED, including retries, for reasons unrelated to the code.
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR ?? path.join(os.tmpdir(), 'fineract-e2e-output'),
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
    // Seeds the reference data the real-backend specs need — enabled currencies, a
    // datatable on m_loan, a collateral type. Running it as a dependency rather
    // than as a CI step means a local run gets the same baseline for free, which is
    // what allows those specs to run unconditionally instead of behind an env gate.
    { name: 'setup', testMatch: /backend\.setup\.ts/ },
    {
      // Everything that mocks its own backend with page.route(). Needs no Fineract
      // and no seeding, so CI can run it without the docker stack and in parallel
      // with the slower half — see .github/workflows/e2e.yml.
      name: 'mocked',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: BACKEND_SPECS,
    },
    {
      // Drives a real Fineract end to end. Slow, and the only half that needs the
      // stack up.
      name: 'backend',
      use: { ...devices['Desktop Chrome'] },
      testMatch: BACKEND_SPECS,
      dependencies: ['setup'],
      // These flows submit real forms and wait on real persistence, so they need
      // more than the 30s default. Set here rather than per test because
      // test.setTimeout() does not cover beforeEach, and logging in against a
      // cold lazy-loaded route was already exceeding the default in that hook.
      timeout: 120000,
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },
  ],
  webServer: {
    command: 'npm start',
    url: 'https://localhost:4200',
    reuseExistingServer: true,
    ignoreHTTPSErrors: true,
    timeout: 300000,
  },
});
