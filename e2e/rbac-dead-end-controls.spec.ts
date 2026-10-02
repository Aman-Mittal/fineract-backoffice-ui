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
 * Controls offered to a user whose only destination is Access Denied.
 *
 * The existing RBAC specs prove the guard refuses a route the user cannot open. That leaves the
 * other half untested: whether the application offers the control at all. A button that leads
 * only to `/forbidden` is not a security problem — Fineract refuses the operation either way —
 * but it is a false promise, and the one class of RBAC defect that no amount of route coverage
 * finds.
 *
 * Both cases here were found by driving a real instance as seeded users and watching where the
 * clicks went, then confirmed against the platform:
 *
 *  - A client's accounts come back with READ_CLIENT alone, but each account screen carries its
 *    own code. A reader without READ_LOAN was shown the loan's account number as a link, and
 *    clicking it landed on `/forbidden`.
 *  - The office transactions list builds its own header rather than using `app-data-table`, so
 *    it never got the `createPermission` gate every other list has, and offered Create to a
 *    reader.
 *
 * Each assertion is paired with a user who *does* hold the code, because "the control is absent"
 * passes just as well against a screen that renders nothing at all.
 */

import { test, expect } from './fixtures';
import { login, loginAsSeededUser } from './utils/fineract-login';
import { selectTab } from './utils/ionic-locators';
import {
  createApiContext,
  seedActiveLoan,
  seedClient,
  seedGroup,
  seedRestrictedUser,
  statusAs,
} from './utils/seed-api';

// Seeds a loan and two users, then signs in as each.
test.describe.configure({ mode: 'serial', timeout: 180_000 });

test.describe("a client's account tables", () => {
  test('withhold the link, but not the number, from a user who cannot open the account', async ({
    page,
  }) => {
    const api = await createApiContext();
    const loan = await seedActiveLoan(api, 'E2EDeadEnd');
    const reader = await seedRestrictedUser(api, ['READ_CLIENT']);
    await api.dispose();

    // The platform's own answer, so the UI's decision can be compared against it rather than
    // against another part of the UI.
    expect(await statusAs(reader, 'GET', `/loans/${loan.loanId}`)).toBe(403);

    await loginAsSeededUser(page, reader);
    await page.goto(`/clients/view/${loan.clientId}`);
    await expect(page.getByText(loan.displayName).first()).toBeVisible({ timeout: 30_000 });
    await selectTab(page, /Loan Accounts/i);

    // The account is still listed — its existence is not the secret, and hiding the row would
    // leave the reader wondering where the client's loan went.
    const accountNumbers = page.locator('table td').first();
    await expect(accountNumbers).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('[href*="/loans/view/"]')).toHaveCount(0);
  });

  test('keep the link for a user who holds READ_LOAN', async ({ page }) => {
    const api = await createApiContext();
    const loan = await seedActiveLoan(api, 'E2EDeadEndOk');
    const reader = await seedRestrictedUser(api, ['READ_CLIENT', 'READ_LOAN']);
    await api.dispose();

    expect(await statusAs(reader, 'GET', `/loans/${loan.loanId}`)).toBe(200);

    await loginAsSeededUser(page, reader);
    await page.goto(`/clients/view/${loan.clientId}`);
    await expect(page.getByText(loan.displayName).first()).toBeVisible({ timeout: 30_000 });
    await selectTab(page, /Loan Accounts/i);

    const link = page.locator('[href*="/loans/view/"]').first();
    await expect(link).toBeVisible({ timeout: 20_000 });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/loans/view/${loan.loanId}$`), { timeout: 30_000 });
  });
});

test.describe('the office transactions list', () => {
  test('withholds Create from a reader, and the route refuses it too', async ({ page }) => {
    const api = await createApiContext();
    // READ_OFFICE as well: the platform refuses GET /officetransactions without it, so a user
    // holding only the code the route declares never gets as far as the header.
    const reader = await seedRestrictedUser(api, ['READ_OFFICETRANSACTION', 'READ_OFFICE']);
    await api.dispose();

    await loginAsSeededUser(page, reader);
    await page.goto('/organization/office-transactions');
    await expect(page.locator('ion-card-title')).toContainText('Office Transactions');
    await expect(page.getByTestId('office-transaction-create')).toHaveCount(0);

    // Belt and braces: the guard refuses the destination as well, so the removed control and the
    // route agree. A spec that checked only the button would pass against a broken boundary.
    await page.goto('/organization/office-transactions/create');
    // The screen carries the code it wanted in the query string, and renders it for the user, so
    // match the path rather than the whole URL.
    await expect(page).toHaveURL(/\/forbidden\?required=CREATE_OFFICETRANSACTION/, {
      timeout: 20_000,
    });
  });

  test('offers Create to an administrator', async ({ page }) => {
    await login(page);
    await page.goto('/organization/office-transactions');
    await expect(page.getByTestId('office-transaction-create')).toBeVisible({ timeout: 20_000 });
  });

  test('says the list was refused instead of showing an empty table', async ({ page }) => {
    const api = await createApiContext();
    // Exactly what the route declares, and not enough for the endpoint: Fineract also wants
    // READ_OFFICE. The screen is reachable and the request fails, which is the case that used to
    // leave a bare set of column headers behind once the toast faded.
    const reader = await seedRestrictedUser(api, ['READ_OFFICETRANSACTION']);
    await api.dispose();

    expect(await statusAs(reader, 'GET', '/officetransactions')).toBe(403);

    await loginAsSeededUser(page, reader);
    await page.goto('/organization/office-transactions');
    const error = page.getByTestId('office-transactions-error');
    await expect(error).toBeVisible({ timeout: 20_000 });
    await expect(error).toContainText('Your role does not cover this list');
    // The headers are what made the empty state read as "there is nothing here".
    await expect(page.locator('table[cdk-table]')).toHaveCount(0);
  });
});

test.describe("a group's member list", () => {
  test('names the member without linking when the reader cannot open clients', async ({ page }) => {
    const api = await createApiContext();
    const member = await seedClient(api, 'E2EGroupDeadEnd');
    const group = await seedGroup(api, 'E2EGroupDeadEnd', [member.clientId]);
    const reader = await seedRestrictedUser(api, ['READ_GROUP']);
    await api.dispose();

    expect(await statusAs(reader, 'GET', `/clients/${member.clientId}`)).toBe(403);

    await loginAsSeededUser(page, reader);
    await page.goto(`/groups/view/${group.groupId}`);
    await expect(page.getByText(group.groupName).first()).toBeVisible({ timeout: 30_000 });
    await page.getByTestId('group-tab-members').click();

    // The membership is what this screen is for, so the member is still named...
    await expect(page.getByText(member.displayName).first()).toBeVisible({ timeout: 20_000 });
    // ...but not offered as a door that only opens onto Access Denied.
    await expect(page.locator(`[href*="/clients/view/${member.clientId}"]`)).toHaveCount(0);
  });

  test('keeps the link for a reader who holds READ_CLIENT', async ({ page }) => {
    const api = await createApiContext();
    const member = await seedClient(api, 'E2EGroupDeadEndOk');
    const group = await seedGroup(api, 'E2EGroupDeadEndOk', [member.clientId]);
    const reader = await seedRestrictedUser(api, ['READ_GROUP', 'READ_CLIENT']);
    await api.dispose();

    expect(await statusAs(reader, 'GET', `/clients/${member.clientId}`)).toBe(200);

    await loginAsSeededUser(page, reader);
    await page.goto(`/groups/view/${group.groupId}`);
    await expect(page.getByText(group.groupName).first()).toBeVisible({ timeout: 30_000 });
    await page.getByTestId('group-tab-members').click();

    const link = page.locator(`[href*="/clients/view/${member.clientId}"]`).first();
    await expect(link).toBeVisible({ timeout: 20_000 });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/clients/view/${member.clientId}$`), {
      timeout: 30_000,
    });
  });
});
