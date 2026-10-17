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
 * Working Capital servicing against a real Fineract: transaction corrections, charge
 * adjustments, and the custom datatables an institution attaches to these loans.
 *
 * `working-capital-loan-actions-backend.spec.ts` covers the loss and credit actions on the loan
 * itself. This one covers what issues #773, #774 and #776 added, and the reason it is a backend
 * spec rather than a mocked one is the same: the commands' preconditions are the platform's, and
 * a mock agrees with whatever the client believes. Specifically, the three facts this screen
 * encodes about the platform are all checked here against the platform —
 *
 *  - undo and adjust are refused by *transaction type*, and the screen only offers them on the
 *    types the module accepts;
 *  - an adjustment books a replacement transaction and reverses the original, so the list and the
 *    balance both move;
 *  - a charge adjustment takes an amount and nothing else, and books a Charge Adjustment
 *    transaction of its own.
 */

import { test, expect } from './fixtures';
import type { APIRequestContext, Page } from '@playwright/test';
import { login } from './utils/fineract-login';
import { selectOption } from './utils/select-option';
import {
  attachWorkingCapitalCharge,
  createApiContext,
  postWorkingCapitalRepayment,
  removeEntityDatatableCheck,
  seedActiveWorkingCapitalLoan,
  seedWorkingCapitalCharge,
  seedWorkingCapitalCreateCheck,
  seedWorkingCapitalLoanDatatable,
  seedWorkingCapitalLoanProduct,
  workingCapitalProductName,
  workingCapitalTransactions,
  SeededWorkingCapitalLoan,
} from './utils/seed-api';

// A client and a disbursed loan per test, then a sign-in and a UI journey each.
test.describe.configure({ mode: 'serial', timeout: 240_000 });

let api: APIRequestContext;
let productId: number;
let productName: string;

test.beforeAll(async () => {
  api = await createApiContext();
  productId = await seedWorkingCapitalLoanProduct(api, 'E2EWcSrv');
  // The form's select offers names; the seeder's carries a suffix, so it is read back rather
  // than reconstructed.
  productName = await workingCapitalProductName(api, productId);
});

test.afterAll(async () => {
  await api.dispose();
});

async function openTab(page: Page, loan: SeededWorkingCapitalLoan, tab: string) {
  await login(page);
  await page.goto(`/working-capital/loans/view/${loan.loanId}?tab=${tab}`);
  // The first level-2 heading is the loan's own: the data table on the custom fields tab
  // renders an ion-card-title, which Ionic also exposes as one.
  await expect(page.getByRole('heading', { level: 2 }).first()).toContainText('0000');
}

/**
 * Sets a date field to today.
 *
 * `ion-datetime` renders its calendar in a shadow root, which Playwright's CSS locators pierce.
 * Today is the day carrying `calendar-day-today`, and that class is what to match on: the
 * calendar renders the month *before* the current one first, so a positional locator lands in
 * the wrong month, and today's accessible name is "Today, Saturday, October 17" rather than the
 * "Saturday, October 17" every other day gets — a prefix no date formatter will reproduce.
 */
async function pickToday(page: Page, pickerId: string): Promise<void> {
  await page.locator(`ion-datetime-button[datetime="${pickerId}"]`).click();
  await page.locator(`#${pickerId} button.calendar-day-today`).click();
  await page.keyboard.press('Escape');
}

/** Opens the detail panel of the row whose View button is the nth on the tab. */
async function openRow(page: Page, testId: string, index = 0) {
  await page.locator(`[data-testid="${testId}"]`).nth(index).click();
}

test.describe('transaction corrections', () => {
  test('undoes a repayment, and the platform marks it reversed', async ({ page }) => {
    const loan = await seedActiveWorkingCapitalLoan(api, productId, 'E2EWcSrv');
    const transactionId = await postWorkingCapitalRepayment(api, loan.loanId, 300);
    await openTab(page, loan, 'transactions');

    // The repayment is the second row; the disbursement is the first and offers no correction.
    await openRow(page, 'wc-transaction-view', 1);
    await expect(page.getByTestId('wc-transaction-detail')).toBeVisible();
    await page.getByTestId('wc-transaction-undo').click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect
      .poll(async () => {
        const transactions = await workingCapitalTransactions(api, loan.loanId);
        return transactions.find((transaction) => transaction.id === transactionId)?.reversed;
      })
      .toBe(true);
  });

  test('offers no correction on the disbursement, which the platform refuses by type', async ({
    page,
  }) => {
    const loan = await seedActiveWorkingCapitalLoan(api, productId, 'E2EWcSrv');
    await openTab(page, loan, 'transactions');

    await openRow(page, 'wc-transaction-view', 0);
    await expect(page.getByTestId('wc-transaction-detail')).toBeVisible();
    await expect(page.getByTestId('wc-transaction-undo')).toHaveCount(0);
    await expect(page.getByTestId('wc-transaction-adjust')).toHaveCount(0);
  });

  test('adjusts a repayment, which reverses it and books the new amount', async ({ page }) => {
    const loan = await seedActiveWorkingCapitalLoan(api, productId, 'E2EWcSrv');
    const transactionId = await postWorkingCapitalRepayment(api, loan.loanId, 300);
    await openTab(page, loan, 'transactions');

    await openRow(page, 'wc-transaction-view', 1);
    await page.getByTestId('wc-transaction-adjust').click();
    await page.locator('input[name="correctionAmount"]').fill('120');
    await page.getByTestId('wc-transaction-correction-submit').click();

    await expect
      .poll(async () => {
        const transactions = await workingCapitalTransactions(api, loan.loanId);
        const original = transactions.find((transaction) => transaction.id === transactionId);
        const replacement = transactions.find(
          (transaction) => !transaction.reversed && transaction.transactionAmount === 120,
        );
        return { reversed: original?.reversed, replaced: replacement !== undefined };
      })
      .toEqual({ reversed: true, replaced: true });
  });
});

test.describe('charge adjustment', () => {
  test('adjusts a charge, and the outstanding amount follows', async ({ page }) => {
    const loan = await seedActiveWorkingCapitalLoan(api, productId, 'E2EWcSrv');
    const chargeId = await seedWorkingCapitalCharge(api);
    await attachWorkingCapitalCharge(api, loan.loanId, chargeId, 50);
    await openTab(page, loan, 'charges');

    await openRow(page, 'wc-charge-view');
    await expect(page.getByTestId('wc-charge-outstanding')).toContainText('50.00');

    await page.getByTestId('wc-charge-adjust').click();
    await page.locator('input[name="chargeAdjustmentAmount"]').fill('20');
    await page.getByTestId('wc-charge-adjust-submit').click();

    // The adjustment books a Charge Adjustment transaction of its own, which is the half of this
    // that a mocked spec cannot show: the charge screen posts to /charges and the transactions
    // tab is where the money appears.
    await expect
      .poll(async () => {
        const transactions = await workingCapitalTransactions(api, loan.loanId);
        return transactions.some(
          (transaction) => transaction.type.value === 'Charge Adjustment' && !transaction.reversed,
        );
      })
      .toBe(true);
  });
});

test.describe('custom datatables', () => {
  test('adds, edits and deletes a row of a multi-row table on the loan', async ({ page }) => {
    const loan = await seedActiveWorkingCapitalLoan(api, productId, 'E2EWcSrv');
    const table = await seedWorkingCapitalLoanDatatable(api, true);
    await openTab(page, loan, 'customFields');

    await expect(page.getByTestId('entity-datatables-tabs')).toContainText(table);
    // Select it explicitly: a tenant with several tables on this entity opens on the first, and
    // the add and row actions belong to whichever is selected.
    await page.getByTestId('entity-datatables-tabs').getByRole('tab', { name: table }).click();

    await page.getByTestId('entity-datatables-add').click();
    await page.locator('input[name="reference"]').fill('KYC-1');
    await page.getByTestId('datatable-entry-submit').click();
    await expect(page.getByText('KYC-1')).toBeVisible();

    await page.getByTestId('entity-datatables-edit').first().click();
    // The dialog opens on what is there, which is what makes a correction a correction.
    await expect(page.locator('input[name="reference"]')).toHaveValue('KYC-1');
    await page.locator('input[name="reference"]').fill('KYC-2');
    await page.getByTestId('datatable-entry-submit').click();
    await expect(page.getByText('KYC-2')).toBeVisible();

    await page.getByTestId('entity-datatables-delete').first().click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByText('KYC-2')).toHaveCount(0);
  });

  /**
   * The check refuses every Working Capital application that does not carry a row for the table,
   * so it is removed in a `finally` — leaving it registered would fail every other spec that
   * creates one of these loans.
   */
  test('creates a loan that a create-time check would otherwise refuse', async ({ page }) => {
    const table = await seedWorkingCapitalLoanDatatable(api, false);
    // A client to apply for it, seeded through a loan because that is the helper that makes one.
    const seeded = await seedActiveWorkingCapitalLoan(api, productId, 'E2EWcCheck');
    const checkId = await seedWorkingCapitalCreateCheck(api, table);

    try {
      await login(page);
      await page.goto('/working-capital/loans/create');

      await expect(page.getByTestId('wc-loan-required-datatables')).toContainText(table);
      // Held back until the required table has been filled in: the platform would answer 403.
      // `toBeDisabled()` does not apply to ion-button, a custom element rather than a native
      // control; the property Ionic reflects is what to assert on.
      await expect(page.getByTestId('wc-loan-submit')).toHaveJSProperty('disabled', true);

      await page.locator('input[name="clientId"]').fill(String(seeded.clientId));
      await selectOption(page, 'Product', productName);
      await page.locator('input[name="principalAmount"]').fill('1000');
      await page.locator('input[name="totalPaymentVolume"]').fill('6000');
      await page.locator('input[name="periodPaymentRate"]').fill('5');
      // The one date the platform insists on: `expectedDisbursementDate` is mandatory and
      // `submittedOnDate` is not, which was measured rather than assumed.
      await pickToday(page, 'expectedDisbursementDate-picker');

      await page.getByTestId(`wc-loan-fill-${table}`).click();
      await page.locator('input[name="reference"]').fill('KYC-CREATE');
      await page.getByTestId('datatable-entry-submit').click();
      await expect(page.getByTestId('wc-loan-submit')).toHaveJSProperty('disabled', false);

      await page.getByTestId('wc-loan-submit').click();
      // The platform accepted it, which it does only because the row went with the application.
      await expect(page).toHaveURL('/working-capital/loans');
    } finally {
      // Swallowed deliberately: on a timeout Playwright has already disposed the request context
      // by the time this runs, and a cleanup that throws here replaces the failure the test was
      // reporting with its own.
      await removeEntityDatatableCheck(api, checkId).catch(() => undefined);
    }
  });
});
