/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
  'center-servicing.spec.ts',
  'client-transfer.spec.ts',
  'deposit-account-servicing.spec.ts',
  'deposit-product-configuration.spec.ts',
  'full-demo.spec.ts',
  'group-membership.spec.ts',
  'loan-account-actions.spec.ts',
  'loan-charge-off.spec.ts',
  'loan-lifecycle.spec.ts',
  'loan-product-accounting.spec.ts',
  'loan-schedule-type.spec.ts',
  'loan-servicing.spec.ts',
  'share-account-servicing.spec.ts',
  'login.spec.ts',
  'report-parameter-backend.spec.ts',
  'savings-transaction-correction.spec.ts',
  'share-product-accounting.spec.ts',
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
  // Recording paces every action, so a flow that fits comfortably at test speed needs a larger
  // budget while it is being filmed.
  timeout: process.env.DEMO_RECORD === '1' ? 900000 : 30000,
  use: {
    baseURL: 'https://localhost:4200',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    // `DEMO_RECORD=1` records every spec, not just the ones that fail — the suites *are* the
    // flows, so recording them is what produces a demo of the application rather than a separate
    // script that could drift from what the app actually does. See DOCS/DEMO.md.
    video: process.env.DEMO_RECORD === '1' || process.env.CI ? 'on' : 'retain-on-failure',
    // A recording of a test suite is unwatchable at test speed: every click, fill and navigation
    // lands instantly, so a viewer sees the result of an action without ever seeing the action.
    // `slowMo` pauses before each Playwright operation, which puts a beat on the action itself
    // rather than uniformly slowing the footage in post — the difference between following what
    // is happening and watching a fast-forward. Recording only; the suite runs at full speed
    // otherwise, so this costs CI nothing.
    launchOptions: {
      slowMo: process.env.DEMO_RECORD === '1' ? Number(process.env.DEMO_SLOW_MO ?? 450) : 0,
    },
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
      //
      // This project setting overrides the root one, so it is what governs a recording run —
      // where every action carries a deliberate pause and the same flow takes far longer.
      timeout: process.env.DEMO_RECORD === '1' ? 900000 : 120000,
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
