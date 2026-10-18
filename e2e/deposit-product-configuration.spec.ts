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
 * Creating and editing deposit products against a real Fineract.
 *
 * Both families were unusable in ways only a real platform shows. A fixed deposit product could
 * not be edited at all: the form invented an interest chart on every save, and an update carrying
 * a chart with no ids answers `500 Internal Server Error`. A recurring deposit product could not
 * be created *or* edited: the form deleted the recurrence it had just collected, and the 400 that
 * came back named `recurringDepositFrequency`, which is the entity's field rather than the
 * parameter the API accepts.
 *
 * Neither is visible to a mock, and neither is visible to a unit spec that asserts on the body it
 * built. Only the platform's answer settles them.
 *
 * Both forms also require an interest rate chart now. They always sent one — a hidden slab at 5%
 * for 1–60 months that the user never saw, which is issue #765 — and the rate is the product, so
 * it has to be entered rather than invented. That is why these tests fill the chart: a product
 * with no stated rate is deliberately unsaveable.
 *
 *   npx playwright test e2e/deposit-product-configuration.spec.ts --project=backend --workers=1
 */

import { test, expect, Page, recordingTimeout } from './fixtures';
import { login, uniqueSuffix } from './utils/fineract-login';
import { ionSelect } from './utils/ionic-locators';
import { selectOption } from './utils/select-option';

/**
 * Fills the interest rate chart, which both deposit product forms require.
 *
 * Native inputs, not Ionic ones: the chart editor is a shared component built on the
 * `.form-field` house style, because ADR 0005 puts Ionic out of bounds for new files and
 * `src/app/ui` has no input primitive yet.
 */
async function fillChart(page: Page, rate: string, from = '1', to = '60'): Promise<void> {
  await expect(page.locator('[data-testid="chart-slab-0"]')).toBeVisible({ timeout: 20000 });
  await page.locator('[data-testid="slab-from-0"]').fill(from);
  await page.locator('[data-testid="slab-to-0"]').fill(to);
  await page.locator('[data-testid="slab-rate-0"]').fill(rate);
}

/** Fills the fields both deposit product forms share. */
async function fillCommon(page: Page, name: string, shortName: string): Promise<void> {
  // Addressed by control name rather than by role: the accessible name sits on the ion-input
  // host, and the inner <input> that `getByRole('textbox')` resolves to carries none — the same
  // labelling gap #287 is about.
  await page.locator('input[name="name"]').fill(name);
  await page.locator('input[name="shortName"]').fill(shortName);
  // Mandatory on the platform for both deposit families, which the forms now reflect.
  await page.locator('textarea[name="description"]').fill('Created by the e2e suite');
}

test.describe('Deposit product configuration', () => {
  test.describe.configure({ mode: 'serial' });

  test('a fixed deposit product survives being edited', async ({ page }) => {
    test.setTimeout(recordingTimeout(240000));
    await login(page);

    const suffix = uniqueSuffix();
    const name = `E2E FD ${suffix}`;

    await page.goto('/products/fixed/create');
    await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 20000 });
    await fillCommon(page, name, suffix.slice(-4).toUpperCase());

    // Refused until the chart states a rate: a deposit product with no rate must not be
    // saveable, which is what the old hidden 5% default concealed.
    await expect(page.getByTestId('product-submit')).toHaveJSProperty('disabled', true);

    await fillChart(page, '6.5');
    await page.getByRole('button', { name: /^save$/i }).click();
    await expect(page).toHaveURL(/\/products\/fixed$/, { timeout: 20000 });

    // Reopen and save with one field changed. Before, this answered 500 and the user simply
    // stayed on the form with a toast.
    await page.locator('ion-searchbar input').first().fill(name);
    const row = page.getByRole('row', { name: new RegExp(name) }).first();
    await expect(row).toBeVisible({ timeout: 20000 });

    // The list states the figures the endpoint answers. It used to carry an interest rate
    // column instead, which read `0.00 %` against every deposit product on the screen —
    // `GET /fixeddepositproducts` sends `nominalAnnualInterestRate: 0` for all of them and no
    // chart to read the real rate from, so the column could never have shown this product's
    // 6.5%.
    await expect(row).toContainText('1,000.00');
    await expect(row).toContainText(/1\s+Months/);
    await expect(row).not.toContainText('0.00 %');
    // By its icon: the action buttons on the list screens are icon-only and carry no accessible
    // name, which is #233 and not this change's to fix.
    await row
      .locator('ion-button', { has: page.locator('ion-icon[name="create-outline"]') })
      .click();
    await expect(page).toHaveURL(/\/products\/fixed\/edit\/\d+$/, { timeout: 20000 });

    const nameField = page.locator('input[name="name"]');
    await expect(nameField).toHaveValue(new RegExp(name), { timeout: 20000 });

    // The product's own rate comes back into the editor, which is both halves of #765: the chart
    // is visible, and the update resends *this* product's chart with its ids rather than a newly
    // invented one — which is what used to answer 500.
    await expect(page.locator('[data-testid="slab-rate-0"]')).toHaveValue('6.5', {
      timeout: 20000,
    });

    await nameField.fill(`${name} v2`);
    await page.getByRole('button', { name: /^save$/i }).click();
    await expect(page).toHaveURL(/\/products\/fixed$/, { timeout: 20000 });
  });

  test('a recurring deposit product can be created at all', async ({ page }) => {
    test.setTimeout(recordingTimeout(240000));
    await login(page);

    const suffix = uniqueSuffix();
    const name = `E2E RD ${suffix}`;

    await page.goto('/products/recurring/create');
    await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 20000 });
    await fillCommon(page, name, suffix.slice(-4).toUpperCase());

    await fillChart(page, '5.25');

    // The recurrence the form collects has to reach the platform — it used to be deleted on the
    // way out, so nothing carried it and every save was refused.
    await page.getByRole('button', { name: /^save$/i }).click();
    await expect(page).toHaveURL(/\/products\/recurring$/, { timeout: 20000 });
  });

  test('a savings product carries its accounting configuration', async ({ page }) => {
    test.setTimeout(recordingTimeout(240000));
    await login(page);

    const suffix = uniqueSuffix();
    const name = `E2E Sav ${suffix}`;

    await page.goto('/products/savings/create');
    await expect(
      ionSelect(page, 'Accounting rule').locator('ion-select-option').first(),
    ).toBeAttached({ timeout: 20000 });

    await fillCommon(page, name, suffix.slice(-4).toUpperCase());

    // Nothing accounting-related shows until a rule is chosen.
    await expect(page.getByTestId('accounting-savingsControlAccountId')).toHaveCount(0);
    await selectOption(page, 'Accounting rule', 'CASH BASED');
    await expect(page.getByTestId('accounting-savingsControlAccountId')).toBeVisible({
      timeout: 20000,
    });
    // Interest paid to a depositor is an expense, so that slot is grouped with the expenses.
    await expect(page.getByTestId('accounting-group-expense')).toBeVisible();
    // Receivables belong to accrual only.
    await expect(page.getByTestId('accounting-feesReceivableAccountId')).toHaveCount(0);
  });
});
