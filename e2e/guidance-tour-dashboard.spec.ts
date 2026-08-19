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
 * Cover for the dashboard tour's second step highlighting the wrong element.
 *
 * `targetSelector: 'ul'` on that step matched `document.querySelector('ul')`, which returns
 * the FIRST `<ul>` in the DOM — the sidebar's own `<ul class="nav-list">`, which renders before
 * the dashboard's main content. The step's copy describes the "System Overview & Status" card
 * (a `.status-list`), so the tour scrolled to and outlined the sidebar instead of the thing it
 * was actually talking about. Fixed by pointing the selector at `.status-list` directly.
 */

import { test, expect } from './fixtures';

const TENANT = 'default';
const USER = 'mifos';
const PASSWORD = 'password';

test.beforeEach(async ({ page }) => {
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

  await page.goto('/login');
  await page.locator('#tenantId').fill(TENANT);
  await page.locator('#username').fill(USER);
  await page.locator('#password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
});

test('highlights the System Status card, not the sidebar, on the dashboard tour', async ({
  page,
}) => {
  await page.locator('.tour-btn').click();
  await expect(page.locator('app-guidance-tour')).toBeVisible();

  await page.getByRole('button', { name: 'Next' }).click();
  // Scoped to the tour card specifically: the dashboard's own cards (Pending Approvals, Loan
  // Status Distribution, etc.) each have their own ion-card-title too.
  await expect(page.locator('.guidance-card ion-card-title')).toContainText(
    'System Overview & Status',
  );

  // The sidebar's own nav list must never carry the highlight — that was the bug: the bare
  // 'ul' selector matched it first because it sits earlier in the DOM than the dashboard.
  await expect(page.locator('.nav-list')).not.toHaveClass(/guidance-highlight/);

  // The dashboard's System Status card is the thing the step is actually describing, and it
  // alone should carry the highlight.
  await expect(page.locator('.status-list')).toHaveClass(/guidance-highlight/);
});
