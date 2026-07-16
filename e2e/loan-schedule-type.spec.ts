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
 * Real-backend end-to-end coverage for the Cumulative/Progressive Loan Schedule
 * Type feature (loan product creation, payment/credit allocation editor, the
 * loan product view page, and the loan creation schedule-type badge).
 *
 * Unlike the other specs in this directory, these tests do NOT mock the
 * Fineract API via page.route() — they exercise a real backend end to end,
 * because this feature's whole point is validating real backend contract
 * requirements (e.g. the payment allocation payload Fineract requires for
 * advanced-payment-allocation-strategy products).
 *
 * Run against the public Mifos community sandbox (default, no setup needed):
 *   npx playwright test e2e/loan-schedule-type.spec.ts --workers=1
 *
 * Run against a fresh local Fineract instance instead:
 *   FINERACT_SERVER_URL="https://localhost:8443/fineract-provider/api/v1" \
 *   FINERACT_TENANT_ID=default FINERACT_USERNAME=mifos FINERACT_PASSWORD=password \
 *   npx playwright test e2e/loan-schedule-type.spec.ts --workers=1
 *
 * `--workers=1` is recommended (required against the shared public sandbox):
 * this file uses `mode: 'serial'` to stay ordered internally, but Playwright
 * still runs different spec files in separate workers concurrently by
 * default, and the shared sandbox has been observed to intermittently lose
 * writes under that concurrent load. A dedicated local instance should be
 * fine with default parallelism.
 *
 * Videos/traces for every run are written under test-results/ (see
 * `test.use({ video: 'on', trace: 'on' })` below) so failures can be replayed.
 */

import { test, expect } from '@playwright/test';
import { login, uniqueSuffix } from './utils/fineract-login';

test.use({ video: 'on', trace: 'on' });

const LOAN_SCHEDULE_TYPE_LABEL = 'Loan Schedule Type';
const ALLOCATION_ORDER_ITEM_SELECTOR = '.allocation-order-list mat-list-item';

test.describe('Loan Schedule Type (Cumulative vs Progressive)', () => {
  // These tests hit a real shared backend (the public Mifos community
  // sandbox by default). Running the product-creation tests concurrently
  // with other suites that also create Progressive products has been
  // observed to intermittently lose writes under the sandbox's load —
  // serial execution avoids overloading that shared, rate-sensitive
  // resource. Parallelism is safe again against a dedicated local instance.
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('loan products list shows a schedule type chip per product', async ({ page }) => {
    await page.goto('/products/loan');
    await expect(page.getByRole('columnheader', { name: LOAN_SCHEDULE_TYPE_LABEL })).toBeVisible();
    // At least one chip (Cumulative or Progressive) should render in the table.
    await expect(page.locator('mat-chip').first()).toBeVisible();
  });

  test('create a Progressive loan product end-to-end and verify it round-trips', async ({
    page,
  }) => {
    const suffix = uniqueSuffix();
    const productName = `E2E Progressive ${suffix}`;
    const shortName = suffix.slice(-4).toUpperCase();

    await page.goto('/products/loan/create');

    // The Loan Schedule Type / Repayment Strategy options come from an async
    // GET /loanproducts/template call. Wait for it to resolve (surfaced by the
    // default strategy name rendering) before interacting with either select,
    // otherwise the dropdown can open with zero options under real network
    // latency and the subsequent option click hangs until timeout.
    await expect(
      page.getByText('Penalties, Fees, Interest, Principal order', { exact: true }),
    ).toBeVisible({ timeout: 15000 });

    await page.getByRole('textbox', { name: 'Name', exact: true }).fill(productName);
    await page.getByRole('textbox', { name: 'Short Name' }).fill(shortName);
    await page.getByRole('spinbutton', { name: 'Principal' }).fill('5000');
    await page.getByRole('spinbutton', { name: 'Interest Rate' }).fill('10');
    await page.getByRole('spinbutton', { name: 'Number of Repayments' }).fill('6');
    await page.getByRole('spinbutton', { name: 'Repayment Every' }).fill('1');

    // Switch to Progressive and verify the reactive strategy lock + processing
    // type field appear immediately (no page reload needed).
    await page.getByRole('combobox', { name: LOAN_SCHEDULE_TYPE_LABEL }).click();
    await page.getByRole('option', { name: 'Progressive' }).click();

    const strategySelect = page.getByRole('combobox', { name: 'Repayment Strategy' });
    await expect(strategySelect).toBeDisabled();
    await expect(strategySelect).toHaveText(/Advanced payment allocation strategy/);
    await expect(
      page.getByRole('combobox', { name: 'Loan Schedule Processing Type' }),
    ).toBeVisible();

    // Payment Allocation editor should show a DEFAULT transaction-type block
    // with the backend's own suggested rule ordering already populated.
    await expect(page.getByText('Payment Allocation', { exact: true })).toBeVisible();
    await expect(page.getByText('Default', { exact: true })).toBeVisible();
    const firstOrderItem = page.locator(ALLOCATION_ORDER_ITEM_SELECTOR).first();
    await expect(firstOrderItem).toBeVisible();
    const firstRuleTextBefore = await firstOrderItem.textContent();

    // Reorder: move the first rule down one position and confirm it moved.
    await firstOrderItem.getByRole('button').nth(1).click(); // second button = down arrow
    const firstRuleTextAfter = await page
      .locator(ALLOCATION_ORDER_ITEM_SELECTOR)
      .first()
      .textContent();
    expect(firstRuleTextAfter).not.toEqual(firstRuleTextBefore);

    await page.getByRole('button', { name: 'Save' }).click();

    // Successful save navigates back to the list. The list paginates at 10
    // rows and this shared environment accumulates products across test
    // runs, so search by the unique product name before locating its row.
    // The GET /loanproducts refetch can occasionally lag the POST under
    // concurrent load, so retry the search a couple of times.
    await expect(page).toHaveURL(/\/products\/loan$/, { timeout: 15000 });
    const productRow = page.getByRole('row', { name: new RegExp(productName) });
    await expect(async () => {
      await page.reload();
      await page.getByPlaceholder('Type to search...').fill(productName);
      await expect(productRow).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 20000, intervals: [1000, 2000, 3000] });
    await expect(productRow.locator('mat-chip')).toHaveText('Progressive');

    // View page: confirm the Loan Schedule section and payment allocation
    // survive the round trip through the real backend.
    await productRow.getByRole('button', { name: 'View' }).click();
    await expect(page).toHaveURL(/\/products\/loan\/view\/\d+$/);
    await expect(page.getByText(productName)).toBeVisible();
    await expect(page.getByText('Advanced payment allocation strategy').first()).toBeVisible();
    await expect(page.getByText('DEFAULT', { exact: true }).first()).toBeVisible();

    // Edit page: confirm nothing was silently reset (schedule type, strategy,
    // and the reordered allocation rules all read back correctly).
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/products\/loan\/edit\/\d+$/);
    await expect(page.getByRole('combobox', { name: LOAN_SCHEDULE_TYPE_LABEL })).toHaveText(
      /Progressive/,
    );
    await expect(page.getByRole('combobox', { name: 'Repayment Strategy' })).toBeDisabled();
    const reloadedFirstRuleText = await page
      .locator(ALLOCATION_ORDER_ITEM_SELECTOR)
      .first()
      .textContent();
    expect(reloadedFirstRuleText).toEqual(firstRuleTextAfter);
  });

  test('loan creation shows the schedule type badge for a Progressive product', async ({
    page,
  }) => {
    await page.goto('/products/loan');
    // Reuse whichever Progressive product already exists in this environment
    // (created by the previous test, or pre-seeded) rather than creating a
    // new one, since the badge only depends on product selection. The list
    // paginates at 10 rows, so search to make sure a Progressive product is
    // actually on the visible page.
    await page.getByPlaceholder('Type to search...').fill('Progressive');
    const progressiveRow = page.getByRole('row', { name: /Progressive/ }).first();
    await expect(progressiveRow).toBeVisible({ timeout: 15000 });
    const productName = (await progressiveRow.getByRole('cell').first().textContent())?.trim();
    expect(productName).toBeTruthy();

    // Wait for network idle so the async getLoanproducts() call backing the
    // Product dropdown has resolved before opening it — otherwise the
    // dropdown can open empty under real network latency and the option
    // click hangs until timeout.
    await page.goto('/loans/create', { waitUntil: 'networkidle' });
    await page.getByRole('combobox', { name: 'Product' }).click();
    await page.getByRole('option', { name: productName!, exact: true }).click();

    await expect(page.getByText(/Loan Schedule Type:\s*Progressive/)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText('Is interest recognition on disbursement date?')).toBeVisible();
  });
});
