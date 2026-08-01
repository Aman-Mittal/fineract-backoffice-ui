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
 * Run against the local docker stack (what CI does — see DOCS/E2E_TESTING.md):
 *   npm run test:e2e:local -- e2e/loan-schedule-type.spec.ts
 *
 * The `setup` project seeds the reference data these tests need, so no manual
 * preparation is required.
 *
 * Videos/traces for every run are written under test-results/ (see
 * `test.use({ video: 'on', trace: 'on' })` below) so failures can be replayed.
 */

import { test, expect } from './fixtures';
import { login, uniqueSuffix } from './utils/fineract-login';
import { ionSelect } from './utils/ionic-locators';
import { selectOption } from './utils/select-option';
import { createApiContext, seedLoanProduct } from './utils/seed-api';

test.use({ video: 'on', trace: 'on' });

const LOAN_SCHEDULE_TYPE_LABEL = 'Loan Schedule Type';
const ALLOCATION_ORDER_ITEM_SELECTOR = '.allocation-order-list ion-item';

test.describe('Loan Schedule Type (Cumulative vs Progressive)', () => {
  // Seeded over the API so the read-only tests below do not depend on the
  // creation test having run first. They used to, via `mode: 'serial'`, which
  // made "does the list render a badge" fail for reasons that had nothing to
  // do with badges. Serial mode is gone with the dependency.
  let seededProgressiveName: string;

  test.beforeAll(async () => {
    const api = await createApiContext();
    try {
      await seedLoanProduct(api, 'ScheduleTypeSeed');
      seededProgressiveName = (await seedLoanProduct(api, 'ScheduleTypeSeed', true)).productName;
    } finally {
      await api.dispose();
    }
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('loan products list shows a schedule type chip per product', async ({ page }) => {
    await page.goto('/products/loan');
    await expect(page.getByRole('columnheader', { name: LOAN_SCHEDULE_TYPE_LABEL })).toBeVisible();
    // At least one chip (Cumulative or Progressive) should render in the table.
    await expect(page.locator('ion-badge').first()).toBeVisible();
  });

  test('create a Progressive loan product end-to-end and verify it round-trips', async ({
    page,
  }) => {
    const suffix = uniqueSuffix();
    const productName = `E2E Progressive ${suffix}`;
    const shortName = suffix.slice(-4).toUpperCase();

    await page.goto('/products/loan/create');

    // The Loan Schedule Type / Repayment Strategy options come from an async
    // GET /loanproducts/template call. Wait for the strategy select to carry a
    // value before touching either one, otherwise the dropdown opens with zero
    // options and the subsequent click hangs until timeout. Asserting on the
    // select having *a* value rather than one specific strategy name keeps this
    // independent of how the instance orders its options.
    await expect(
      ionSelect(page, 'Repayment Strategy').locator('ion-select-option').first(),
    ).toBeAttached({ timeout: 15000 });

    await page.getByTestId('loan-product-name').locator('input').fill(productName);
    await page.getByTestId('loan-product-short-name').locator('input').fill(shortName);
    await page.getByTestId('loan-product-principal').locator('input').fill('5000');
    await page.getByTestId('loan-product-interest-rate').locator('input').fill('10');
    await page.getByTestId('loan-product-repayments-count').locator('input').fill('6');
    await page.getByTestId('loan-product-repayment-every').locator('input').fill('1');

    // Switch to Progressive and verify the reactive strategy lock + processing
    // type field appear immediately (no page reload needed).
    await page.getByTestId('loan-product-schedule-type').click();
    await page
      .locator('ion-alert, ion-popover')
      .getByRole('radio', { name: 'Progressive' })
      .click();

    const strategySelect = ionSelect(page, 'Repayment Strategy');
    // ion-select reflects `disabled` only as a JS property and an internal class —
    // there is no disabled/aria-disabled attribute on the host for toBeDisabled() to read.
    await expect(strategySelect).toHaveJSProperty('disabled', true);
    await expect(strategySelect).toHaveText(/Advanced payment allocation strategy/);
    await expect(ionSelect(page, 'Loan Schedule Processing Type')).toBeVisible();

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

    await page.getByTestId('loan-product-submit-btn').click();

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
    await expect(productRow.locator('ion-badge')).toHaveText('Progressive');

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
    await expect(ionSelect(page, LOAN_SCHEDULE_TYPE_LABEL)).toHaveText(/Progressive/);
    await expect(ionSelect(page, 'Repayment Strategy')).toHaveJSProperty('disabled', true);
    const reloadedFirstRuleText = await page
      .locator(ALLOCATION_ORDER_ITEM_SELECTOR)
      .first()
      .textContent();
    expect(reloadedFirstRuleText).toEqual(firstRuleTextAfter);
  });

  test('loan creation shows the schedule type badge for a Progressive product', async ({
    page,
  }) => {
    // Uses the product seeded in beforeAll by its exact name. Searching for
    // /Progressive/ and taking the first row would silently pick up whatever
    // another spec happened to leave behind, which is how this test came to
    // depend on the creation test running before it.
    const productName = seededProgressiveName;

    // Wait for network idle so the async getLoanproducts() call backing the
    // Product dropdown has resolved before opening it — otherwise the
    // dropdown can open empty under real network latency and the option
    // click hangs until timeout.
    await page.goto('/loans/create', { waitUntil: 'networkidle' });
    await selectOption(page, 'Loan Product', productName);

    await expect(page.getByText(/Loan Schedule Type:\s*Progressive/)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText('Is interest recognition on disbursement date?')).toBeVisible();
  });
});
