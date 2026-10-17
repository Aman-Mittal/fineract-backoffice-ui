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

/**
 * The Working Capital loss and credit actions, driven through the UI against a real Fineract.
 *
 * `working-capital-loan-actions.spec.ts` covers the same actions with the API mocked, which is
 * fast and proves the screen posts the right command with the right body. What it cannot prove is
 * that the platform accepts any of it: the request shapes, the status gates and the order the
 * commands have to be issued in are all the backend's rules, and a mock agrees with whatever the
 * client believes.
 *
 * So this spec seeds a real Working Capital product, client and disbursed loan, drives the screen,
 * and then reads the loan back from the platform to check that what the UI claimed happened did.
 *
 * The seeding is in `seed-api.ts` and documents the parameters Fineract insists on; the short
 * version is that each command takes only its own, and the two that are not obvious from the
 * command name — `expectedDisbursementDate` on approve, `transactionAmount` on disburse — were
 * measured rather than guessed.
 */

import { test, expect } from './fixtures';
import { login } from './utils/fineract-login';
import {
  createApiContext,
  seedActiveWorkingCapitalLoan,
  seedWorkingCapitalLoanProduct,
  SeededWorkingCapitalLoan,
} from './utils/seed-api';
import type { APIRequestContext } from '@playwright/test';

// A product, and a client plus a disbursed loan per test, then a sign-in and a UI journey each.
test.describe.configure({ mode: 'serial', timeout: 240_000 });

let api: APIRequestContext;
let productId: number;

test.beforeAll(async () => {
  api = await createApiContext();
  // One product for the file: it carries no per-test state, and creating it is the slowest seed.
  productId = await seedWorkingCapitalLoanProduct(api);
});

test.afterAll(async () => {
  await api.dispose();
});

/** Reads the loan back from the platform, which is the assertion that matters here. */
async function loanFromPlatform(loanId: number): Promise<{
  status: { value?: string; active?: boolean; closedWrittenOff?: boolean };
  chargedOff?: boolean;
  summary?: { totalOutstanding?: number };
}> {
  const response = await api.get(
    `${process.env['FINERACT_SERVER_URL'] ?? '/fineract-provider/api/v1'}/working-capital-loans/${loanId}`,
  );
  expect(response.ok(), `reading loan ${loanId} answered ${response.status()}`).toBe(true);
  return response.json();
}

async function openLoan(page: import('@playwright/test').Page, loan: SeededWorkingCapitalLoan) {
  await login(page);
  await page.goto(`/working-capital/loans/view/${loan.loanId}`);
  await expect(page.getByRole('heading', { level: 2 })).toContainText('0000');
}

/** Opens the Actions menu and picks an item by its visible label. */
async function chooseAction(page: import('@playwright/test').Page, label: string) {
  await page.locator('#loanMenu-trigger').click();
  await page.locator('ion-popover:visible').getByText(label, { exact: true }).click();
}

test.describe('Working Capital loan actions, against a real Fineract', () => {
  test('charges off an active loan, and then offers only the undo', async ({ page }) => {
    const loan = await seedActiveWorkingCapitalLoan(api, productId);
    await openLoan(page, loan);

    await chooseAction(page, 'Charge Off');
    await expect(page).toHaveURL(`/working-capital/loans/${loan.loanId}/action/chargeOff`);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(`/working-capital/loans/view/${loan.loanId}`);

    // The platform's own answer, not the screen's: charged off, and still active, because the
    // charge-off is a non-monetary tag.
    const platform = await loanFromPlatform(loan.loanId);
    expect(platform.chargedOff).toBe(true);
    expect(platform.status.active).toBe(true);

    await page.reload();
    await page.locator('#loanMenu-trigger').click();
    const menu = page.locator('ion-popover:visible');
    await expect(menu.getByText('Undo Charge Off', { exact: true })).toBeVisible();
    await expect(menu.getByText('Charge Off', { exact: true })).toHaveCount(0);
  });

  test('credits the borrower with a goodwill credit, and the balance falls', async ({ page }) => {
    const loan = await seedActiveWorkingCapitalLoan(api, productId);
    const before = await loanFromPlatform(loan.loanId);
    await openLoan(page, loan);

    await chooseAction(page, 'Goodwill Credit');
    await page.locator('input[name="transactionAmount"]').fill('250');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(`/working-capital/loans/view/${loan.loanId}`);

    const after = await loanFromPlatform(loan.loanId);
    expect(after.summary?.totalOutstanding).toBeLessThan(before.summary?.totalOutstanding ?? 0);
  });

  test('writes the loan off, which closes it and opens the recovery path', async ({ page }) => {
    const loan = await seedActiveWorkingCapitalLoan(api, productId);
    await openLoan(page, loan);

    await chooseAction(page, 'Write Off');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(`/working-capital/loans/view/${loan.loanId}`);

    const platform = await loanFromPlatform(loan.loanId);
    expect(platform.status.closedWrittenOff).toBe(true);
    // The write-off zeroes the outstanding; what is still collectable moves to a recovery bucket.
    expect(platform.summary?.totalOutstanding).toBe(0);

    await page.reload();
    await page.locator('#loanMenu-trigger').click();
    const menu = page.locator('ion-popover:visible');
    await expect(menu.getByText('Record Recovery Payment', { exact: true })).toBeVisible();
    await expect(menu.getByText('Undo Write-off', { exact: true })).toBeVisible();
    // A written-off loan is locked: no repayment, and no second write-off.
    await expect(menu.getByText('Write Off', { exact: true })).toHaveCount(0);
  });
});
