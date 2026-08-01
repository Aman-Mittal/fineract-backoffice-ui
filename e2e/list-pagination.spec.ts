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
 * Regression cover for list pagination, filtering and the profile page.
 *
 * The paginator used to be pinned to page 0 in server-side mode: the range
 * label never moved, "previous" never enabled, and "next" resolved to page 1
 * every time, so page 2 was the only page reachable. Everything here runs
 * against page.route() mocks, so it needs no backend.
 */

import { test, expect, Page } from './fixtures';

const TENANT = 'default';
const USER = 'mifos';
const PASSWORD = 'password';
const TOTAL_CLIENTS = 54;
const PAGE_SIZE = 10;

/** Distinguishable client rows so a page change is visible in the table. */
function clientsPage(offset: number, limit: number, status?: string) {
  const total = status === 'closed' ? 0 : TOTAL_CLIENTS;
  const pageItems = Array.from({ length: Math.max(0, Math.min(limit, total - offset)) }, (_, i) => {
    const n = offset + i + 1;
    return {
      id: n,
      accountNo: String(n).padStart(9, '0'),
      displayName: `Client ${n}`,
      firstname: 'Client',
      lastname: String(n),
      officeId: 1,
      officeName: 'Head Office',
      status: { id: 300, code: 'clientStatusType.active', value: 'Active' },
      active: true,
    };
  });
  return { totalFilteredRecords: total, pageItems };
}

async function mockSession(page: Page) {
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
        roles: [{ id: 1, name: 'Super User', description: 'Super user' }],
        permissions: ['ALL_FUNCTIONS'],
      }),
    });
  });

  // Serve the slice the app asks for, so the rows on screen reflect the offset.
  await page.route(/\/api\/v1\/clients(\?|$)/, async (route) => {
    const url = new URL(route.request().url());
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? PAGE_SIZE);
    const status = url.searchParams.get('status') ?? undefined;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(clientsPage(offset, limit, status ?? undefined)),
    });
  });
}

async function login(page: Page) {
  await mockSession(page);
  await page.goto('/login');
  await page.locator('#tenantId').fill(TENANT);
  await page.locator('#username').fill(USER);
  await page.locator('#password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
}

const range = (page: Page) => page.getByTestId('paginator-range-label');
const firstAccountNo = (page: Page) => page.locator('table tbody tr td').first();
const pagerButton = (page: Page, index: number) =>
  page.locator('app-paginator ion-button').nth(index);
// 0 = first, 1 = previous, 2 = next, 3 = last
const NEXT = 2;
const PREV = 1;
const LAST = 3;

/**
 * ion-button is a custom element, not a native control, so toBeDisabled() does
 * not apply to it — assert on the property Ionic actually reflects.
 */
const expectPagerDisabled = (page: Page, index: number, disabled: boolean) =>
  expect(pagerButton(page, index)).toHaveJSProperty('disabled', disabled);

test.describe('List pagination', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/clients');
    await expect(range(page)).toContainText(`1 - 10 of ${TOTAL_CLIENTS}`);
  });

  test('advances through pages and back again', async ({ page }) => {
    await expect(firstAccountNo(page)).toHaveText('000000001');
    await expectPagerDisabled(page, PREV, true);

    await pagerButton(page, NEXT).click();
    await expect(range(page)).toContainText(`11 - 20 of ${TOTAL_CLIENTS}`);
    await expect(firstAccountNo(page)).toHaveText('000000011');
    await expectPagerDisabled(page, PREV, false);

    // The bug made this a no-op: "next" recomputed from a page index stuck at 0.
    await pagerButton(page, NEXT).click();
    await expect(range(page)).toContainText(`21 - 30 of ${TOTAL_CLIENTS}`);
    await expect(firstAccountNo(page)).toHaveText('000000021');

    await pagerButton(page, PREV).click();
    await expect(range(page)).toContainText(`11 - 20 of ${TOTAL_CLIENTS}`);
    await expect(firstAccountNo(page)).toHaveText('000000011');
  });

  test('jumps to the last page', async ({ page }) => {
    await pagerButton(page, LAST).click();

    await expect(range(page)).toContainText(`51 - 54 of ${TOTAL_CLIENTS}`);
    await expect(firstAccountNo(page)).toHaveText('000000051');
  });

  test('returns to the first page when a filter changes', async ({ page }) => {
    await pagerButton(page, LAST).click();
    await expect(range(page)).toContainText(`51 - 54 of ${TOTAL_CLIENTS}`);

    await page.locator('ion-select').first().click();
    await page.locator('ion-alert, ion-popover').getByRole('radio', { name: 'Active' }).click();

    // Label and rows must agree: the parent refetches from offset 0, so a
    // paginator still reading "51 - 54" would be lying about what is on screen.
    await expect(range(page)).toContainText(`1 - 10 of ${TOTAL_CLIENTS}`);
    await expect(firstAccountNo(page)).toHaveText('000000001');
  });

  test('returns to the first page when searching', async ({ page }) => {
    await pagerButton(page, NEXT).click();
    await expect(range(page)).toContainText(`11 - 20 of ${TOTAL_CLIENTS}`);

    await page.getByPlaceholder('Type to search...').fill('Client');

    await expect(range(page)).toContainText(`1 - 10 of ${TOTAL_CLIENTS}`);
  });
});

test.describe('Profile', () => {
  test('renders the signed-in user rather than hanging on a spinner', async ({ page }) => {
    await login(page);
    await page.route('**/api/v1/users/1**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          username: USER,
          firstname: 'App',
          lastname: 'Administrator',
          email: 'demomfi@mifos.org',
          officeId: 1,
          officeName: 'Head Office',
          selectedRoles: [{ id: 1, name: 'Super user' }],
        }),
      });
    });

    await page.goto('/profile');

    await expect(page.getByText('App Administrator')).toBeVisible();
    await expect(page.getByText('demomfi@mifos.org')).toBeVisible();
    await expect(page.getByText('Super user')).toBeVisible();
    await expect(page.locator('ion-spinner')).toHaveCount(0);
  });

  test('shows an error when the profile cannot be loaded', async ({ page }) => {
    await login(page);
    // The reported failure: this endpoint 404s and the page used to spin forever.
    await page.route('**/api/v1/users/1**', async (route) => {
      await route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/profile');

    await expect(page.getByTestId('profile-load-error')).toBeVisible();
    await expect(page.locator('ion-spinner')).toHaveCount(0);
  });
});

test.describe('List load failure', () => {
  test('reports the failure and reloads when the user retries', async ({ page }) => {
    await login(page);

    // Fail the first request, serve the second. The retry has to be what fixes it, or this
    // passes whether or not the button is wired to anything.
    let attempts = 0;
    await page.route(/\/api\/v1\/clients(\?|$)/, async (route) => {
      attempts += 1;
      if (attempts === 1) {
        await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
        return;
      }
      const url = new URL(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          clientsPage(Number(url.searchParams.get('offset') ?? 0), PAGE_SIZE, undefined),
        ),
      });
    });

    await page.goto('/clients');

    // Not "No records found": nobody knows whether there are records.
    await expect(page.getByTestId('data-table-error')).toBeVisible();
    await expect(page.locator('table.data-table')).toHaveCount(0);

    await page.getByTestId('data-table-retry').click();

    await expect(page.getByTestId('data-table-error')).toHaveCount(0);
    await expect(firstAccountNo(page)).toHaveText('000000001');
  });
});
