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

/**
 * Cover for the four Working Capital gaps that had backend endpoints but no UI: delinquency
 * actions, breach actions, near-breach actions, and per-loan loan-originator attach/detach.
 * Mocked throughout — these endpoints are Fineract 1.15.0-only and unreachable on the public
 * community sandbox.
 */

import { test, expect, Page } from './fixtures';
import { selectTab } from './utils/ionic-locators';
import { selectOption } from './utils/select-option';

const TENANT = 'default';
const USER = 'mifos';
const PASSWORD = 'password';
const LOAN_ID = 1;

async function mockLoanView(page: Page) {
  await page.route(/\/api\/v1\//, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.route('**/config.json*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fineractApiUrl: '/api/v1', defaultTenant: TENANT }),
    });
  });
  await page.route('**/api/v1/authentication**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        username: USER,
        userId: 1,
        base64EncodedAuthenticationKey: 'YmFzZTY0',
        authenticated: true,
        officeId: 1,
        officeName: 'Head Office',
        roles: [{ id: 1, name: 'Role', description: 'Role' }],
        permissions: ['ALL_FUNCTIONS'],
      }),
    });
  });
  await page.route(/\/api\/v1\/businessdate/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ type: 'BUSINESS_DATE', date: [2026, 8, 16] }]),
    });
  });

  await page.route(`**/api/v1/working-capital-loans/${LOAN_ID}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: LOAN_ID,
        accountNo: '000001',
        client: { id: 7, displayName: 'Acme Ltd' },
        product: { name: 'WC Revolver' },
        currency: { displaySymbol: '$' },
        proposedPrincipal: 10_000,
        status: { value: 'Active', active: true },
      }),
    });
  });
  for (const resource of [
    'charges',
    'transactions',
    'delinquency-range-schedule',
    'breach-schedule',
  ]) {
    await page.route(`**/api/v1/working-capital-loans/${LOAN_ID}/${resource}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: resource === 'transactions' ? JSON.stringify({ content: [] }) : JSON.stringify([]),
      });
    });
  }

  await page.route(
    `**/api/v1/working-capital-loans/${LOAN_ID}/delinquency-actions`,
    async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, action: 'PAUSE', startDate: '01 January 2026', endDate: '01 February 2026' },
          ]),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ resourceId: 4 }),
      });
    },
  );

  await page.route(`**/api/v1/working-capital-loans/${LOAN_ID}/breach-actions`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, action: 'PAUSE', startDate: '01 January 2026', endDate: '01 February 2026' },
        ]),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ resourceId: 2 }),
    });
  });

  await page.route(
    `**/api/v1/working-capital-loans/${LOAN_ID}/near-breach-actions`,
    async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 1,
              action: 'RESCHEDULE',
              frequency: 2,
              frequencyType: 'WEEKS',
              threshold: 80,
              createdDate: '01 January 2026',
            },
          ]),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ resourceId: 3 }),
      });
    },
  );

  await page.route(`**/api/v1/working-capital-loans/${LOAN_ID}/originators`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ originators: [{ id: 5, name: 'Acme Originator' }] }),
    });
  });
  await page.route(`**/api/v1/working-capital-loans/${LOAN_ID}/originators/*`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.route('**/api/v1/loan-originators', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 5, name: 'Acme Originator' },
        { id: 6, name: 'Other Originator' },
      ]),
    });
  });
}

async function login(page: Page) {
  await page.goto('/login');
  await page.locator('#tenantId').fill(TENANT);
  await page.locator('#username').fill(USER);
  await page.locator('#password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
}

test.describe('Working Capital loan delinquency, breach and near-breach actions, and originators', () => {
  test.beforeEach(async ({ page }) => {
    await mockLoanView(page);
    await login(page);
    await page.goto(`/working-capital/loans/view/${LOAN_ID}`);
    await expect(page.locator('h2')).toContainText('000001');
  });

  test('shows delinquency action history and submits a new one', async ({ page }) => {
    await selectTab(page, /^Delinquency Actions$/);
    await expect(page.getByRole('cell', { name: 'PAUSE' })).toBeVisible();

    await page.getByRole('button', { name: 'New Action' }).click();
    await expect(page).toHaveURL(`/working-capital/loans/${LOAN_ID}/delinquency-action`);

    await selectOption(page, 'Action', 'RESET');
    const checkbox = page.locator('ion-checkbox[name="startNewPeriod"]');
    await checkbox.click();

    const postRequest = page.waitForRequest(
      (req) =>
        req.url().includes(`/working-capital-loans/${LOAN_ID}/delinquency-actions`) &&
        req.method() === 'POST',
    );
    await page.getByRole('button', { name: 'Submit' }).click();
    const request = await postRequest;
    expect(request.postDataJSON()).toMatchObject({
      action: 'RESET',
      startNewPeriod: true,
    });

    await expect(page).toHaveURL(`/working-capital/loans/view/${LOAN_ID}?tab=delinquencyActions`);
  });

  test('shows breach action history and submits a new one', async ({ page }) => {
    // Anchored: an unanchored 'Breach Actions' also substring-matches the "Near-Breach
    // Actions" tab.
    await selectTab(page, /^Breach Actions$/);
    await expect(page.getByRole('cell', { name: 'PAUSE' })).toBeVisible();

    await page.getByRole('button', { name: 'New Action' }).click();
    await expect(page).toHaveURL(`/working-capital/loans/${LOAN_ID}/breach-action`);

    // RESCHEDULE needs no date picker, unlike PAUSE/RESUME/DISABLE/ENABLE — kept simple to
    // fill deterministically, consistent with how this suite avoids ion-datetime interaction
    // where a test's assertion does not actually depend on the date.
    await selectOption(page, 'Action', 'RESCHEDULE');
    await page.locator('input[name="frequency"]').fill('2');
    await selectOption(page, 'Frequency Type', 'WEEKS');

    const postRequest = page.waitForRequest(
      (req) =>
        req.url().includes(`/working-capital-loans/${LOAN_ID}/breach-actions`) &&
        req.method() === 'POST',
    );
    await page.getByRole('button', { name: 'Submit' }).click();
    const request = await postRequest;
    expect(request.postDataJSON()).toMatchObject({
      action: 'RESCHEDULE',
      frequency: 2,
      frequencyType: 'WEEKS',
    });

    await expect(page).toHaveURL(`/working-capital/loans/view/${LOAN_ID}?tab=breachActions`);
  });

  test('shows near-breach action history and submits a new one', async ({ page }) => {
    await selectTab(page, 'Near-Breach Actions');
    await expect(page.getByRole('cell', { name: '80%' })).toBeVisible();

    await page.getByRole('button', { name: 'New Action' }).click();
    await expect(page).toHaveURL(`/working-capital/loans/${LOAN_ID}/near-breach-action`);

    await page.locator('input[name="nearBreachFrequency"]').fill('4');
    await selectOption(page, 'Frequency Type', 'DAYS');
    await page.locator('input[name="nearBreachThreshold"]').fill('90');

    const postRequest = page.waitForRequest(
      (req) =>
        req.url().includes(`/working-capital-loans/${LOAN_ID}/near-breach-actions`) &&
        req.method() === 'POST',
    );
    await page.getByRole('button', { name: 'Submit' }).click();
    const request = await postRequest;
    expect(request.postDataJSON()).toMatchObject({
      action: 'RESCHEDULE',
      nearBreachFrequency: 4,
      nearBreachFrequencyType: 'DAYS',
      nearBreachThreshold: 90,
    });

    await expect(page).toHaveURL(`/working-capital/loans/view/${LOAN_ID}?tab=nearBreachActions`);
  });

  test('attaches and detaches a loan originator', async ({ page }) => {
    await selectTab(page, 'Originators');
    await expect(page.getByRole('cell', { name: 'Acme Originator' })).toBeVisible();
    // The already-attached originator must not be offered again.
    await expect(page.getByRole('cell', { name: 'Other Originator' })).not.toBeVisible();

    // Not the shared selectOption() helper: it synchronises by asserting no ion-alert/
    // popover/action-sheet is on screen, but this page's header Actions menu is its own
    // ion-popover that stays mounted (hidden, not removed) for the page's whole lifetime, so
    // that assertion can never see a count of 0 here.
    const originatorSelect = page
      .locator('ion-item')
      .filter({ has: page.getByText('Select Originator', { exact: true }) })
      .locator('ion-select');
    await originatorSelect.click();
    const openPopover = page.locator('ion-popover:visible');
    await openPopover.getByRole('radio', { name: 'Other Originator', exact: true }).click();

    const attachRequest = page.waitForRequest(
      (req) =>
        req.url().includes(`/working-capital-loans/${LOAN_ID}/originators/6`) &&
        req.method() === 'POST',
    );
    await page.getByRole('button', { name: 'Attach Originator' }).click();
    await attachRequest;

    page.on('dialog', (dialog) => dialog.accept());
    const detachRequest = page.waitForRequest(
      (req) =>
        req.url().includes(`/working-capital-loans/${LOAN_ID}/originators/5`) &&
        req.method() === 'DELETE',
    );
    await page
      .getByRole('row', { name: /Acme Originator/ })
      .getByRole('button', { name: 'Detach' })
      .click();
    await detachRequest;
  });
});
