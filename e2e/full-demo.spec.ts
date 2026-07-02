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
 * One continuous, video-recorded walkthrough of every area covered by this
 * session's testing: Loan Schedule Type (Cumulative/Progressive), Payment
 * Allocation reordering, the Loan Product view/edit round-trip, the full
 * loan lifecycle (client -> product -> loan -> approve -> disburse), the
 * loan-account schedule-type chip, Custom Fields (datatable Add Entry
 * dialog), Collateral Management, the Disbursement Details tab, the Notes
 * tab, a repayment followed by viewing/adjusting that transaction, and the
 * full set of new loan lifecycle actions in the Actions menu.
 *
 * This is a demo/recording aid, not a strict assertion suite — run it with
 * `--workers=1` against the shared public sandbox (see loan-schedule-type.spec.ts
 * for why) and find the recording under test-results/*\/video.webm afterwards.
 *
 *   npx playwright test e2e/full-demo.spec.ts --workers=1
 */

import { test, expect } from '@playwright/test';
import { login, uniqueSuffix } from './utils/fineract-login';
import { selectMatOption } from './utils/select-mat-option';

test.use({ video: 'on', trace: 'on', launchOptions: { slowMo: 350 } });

const LOAN_SCHEDULE_TYPE_LABEL = 'Loan Schedule Type';
const INTEREST_RATE_LABEL = 'Interest Rate';
const NUMBER_OF_REPAYMENTS_LABEL = 'Number of Repayments';
const REPAYMENT_EVERY_LABEL = 'Repayment Every';

test.describe('Full feature demo recording', () => {
  test('walk through loan schedule type, lifecycle, custom fields, collateral, and disbursement', async ({
    page,
  }) => {
    test.setTimeout(180000);

    await login(page);

    // 1. Loan Products list: schedule type chips
    await page.goto('/products/loan');
    await expect(page.getByRole('columnheader', { name: LOAN_SCHEDULE_TYPE_LABEL })).toBeVisible();
    await page.waitForTimeout(3000);

    // 2. Create a Progressive loan product with payment allocation reorder
    await page.goto('/products/loan/create');
    await expect(
      page.getByText('Penalties, Fees, Interest, Principal order', { exact: true }),
    ).toBeVisible({ timeout: 15000 });

    const progSuffix = uniqueSuffix();
    const progressiveProductName = `Demo Progressive ${progSuffix}`;
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill(progressiveProductName);
    await page
      .getByRole('textbox', { name: 'Short Name' })
      .fill(progSuffix.slice(-4).toUpperCase());
    await page.getByRole('spinbutton', { name: 'Principal' }).fill('5000');
    await page.getByRole('spinbutton', { name: INTEREST_RATE_LABEL }).fill('12');
    await page.getByRole('spinbutton', { name: NUMBER_OF_REPAYMENTS_LABEL }).fill('6');
    await page.getByRole('spinbutton', { name: REPAYMENT_EVERY_LABEL }).fill('1');

    await selectMatOption(page, LOAN_SCHEDULE_TYPE_LABEL, 'Progressive');
    await expect(page.getByRole('combobox', { name: 'Repayment Strategy' })).toBeDisabled();
    await expect(
      page.getByRole('combobox', { name: 'Loan Schedule Processing Type' }),
    ).toBeVisible();

    const firstOrderItem = page.locator('.allocation-order-list mat-list-item').first();
    await firstOrderItem.getByRole('button').nth(1).click(); // reorder
    await page.waitForTimeout(1600);

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/products\/loan$/, { timeout: 15000 });

    // 3. View and edit the new Progressive product
    await page.getByPlaceholder('Type to search...').fill(progressiveProductName);
    const progressiveRow = page.getByRole('row', { name: new RegExp(progressiveProductName) });
    await expect(progressiveRow).toBeVisible({ timeout: 15000 });
    await expect(progressiveRow.locator('mat-chip')).toHaveText('Progressive');

    await progressiveRow.getByRole('button', { name: 'View' }).click();
    await expect(page).toHaveURL(/\/products\/loan\/view\/\d+$/);
    await expect(page.getByText('Advanced payment allocation strategy').first()).toBeVisible();
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/products\/loan\/edit\/\d+$/);
    await expect(page.getByRole('combobox', { name: LOAN_SCHEDULE_TYPE_LABEL })).toHaveText(
      /Progressive/,
    );
    await page.waitForTimeout(2000);

    // 4. Create a Cumulative loan product for the lifecycle walkthrough
    await page.goto('/products/loan/create');
    await expect(
      page.getByText('Penalties, Fees, Interest, Principal order', { exact: true }),
    ).toBeVisible({ timeout: 15000 });

    const cumSuffix = uniqueSuffix();
    const cumulativeProductName = `Demo Cumulative ${cumSuffix}`;
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill(cumulativeProductName);
    await page.getByRole('textbox', { name: 'Short Name' }).fill(cumSuffix.slice(-4).toUpperCase());
    await page.getByRole('spinbutton', { name: 'Principal' }).fill('1000');
    await page.getByRole('spinbutton', { name: INTEREST_RATE_LABEL }).fill('10');
    await page.getByRole('spinbutton', { name: NUMBER_OF_REPAYMENTS_LABEL }).fill('3');
    await page.getByRole('spinbutton', { name: REPAYMENT_EVERY_LABEL }).fill('1');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/products\/loan$/, { timeout: 15000 });

    // 5. Create a client
    await page.goto('/clients/create', { waitUntil: 'networkidle' });
    await page.getByRole('combobox', { name: 'Office' }).click({ force: true });
    await expect(page.getByRole('listbox').getByRole('option').first()).toBeVisible({
      timeout: 15000,
    });
    await page.getByRole('listbox').getByRole('option').first().click();
    const clientSuffix = uniqueSuffix();
    const firstName = `DemoClient${clientSuffix}`;
    await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Tester');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/clients$/, { timeout: 15000 });

    // 6. Create the loan application
    await page.goto('/loans/create', { waitUntil: 'networkidle' });
    await page.getByRole('combobox', { name: 'Client ID' }).fill(firstName);
    await page.getByRole('option', { name: new RegExp(firstName) }).click();
    await selectMatOption(page, 'Loan Product', cumulativeProductName);
    await expect(page.getByText(/Loan Schedule Type:\s*Cumulative/)).toBeVisible({
      timeout: 15000,
    });
    await page.waitForTimeout(1500);
    await page.getByRole('spinbutton', { name: 'Principal', exact: true }).fill('1000');
    await page.getByRole('spinbutton', { name: 'Term Frequency' }).fill('3');
    await selectMatOption(page, 'Term Type', 'Months');
    await page.getByRole('spinbutton', { name: NUMBER_OF_REPAYMENTS_LABEL }).fill('3');
    await page.getByRole('spinbutton', { name: REPAYMENT_EVERY_LABEL }).fill('1');
    await selectMatOption(page, 'Frequency', 'Months');
    await page.getByRole('spinbutton', { name: INTEREST_RATE_LABEL }).fill('10');
    await selectMatOption(page, 'Interest Type', 'Declining Balance');
    await selectMatOption(page, 'Amortization Type', 'Equal Installments');
    await selectMatOption(page, 'Interest Calculation Period Type', 'Same as repayment period');

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes('/loans') && res.request().method() === 'POST',
      ),
      page.getByRole('button', { name: 'Save' }).click(),
    ]);
    const loanId = (await response.json()).loanId as number;

    // 7. Approve and disburse
    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Submitted and pending approval')).toBeVisible({
      timeout: 15000,
    });
    await page.getByRole('button', { name: 'Approve' }).click();
    await expect(page).toHaveURL(/\/products\/loan\/\d+\/action\/approve$/);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(new RegExp(`/loans/view/${loanId}$`), { timeout: 15000 });
    await expect(page.getByText('Approved', { exact: true })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Disburse' }).click();
    await expect(page).toHaveURL(new RegExp(`/loans/${loanId}/transactions/disburse$`));
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/loans$/, { timeout: 15000 });

    // 8. Loan view: schedule type chip on the account itself
    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Active', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Loan Schedule Type:\s*Cumulative/)).toBeVisible();
    await page.waitForTimeout(2000);

    // 9. Custom Fields tab: add an entry via the dialog
    await page.getByRole('tab', { name: /Custom Fields/i }).click();
    await page.waitForTimeout(2000);
    const addEntryButton = page.getByRole('button', { name: /Add Entry/i });
    if (await addEntryButton.count()) {
      await addEntryButton.click();
      await page.waitForTimeout(1600);
      const notesInput = page.locator('input[name="notes"]');
      if (await notesInput.count()) {
        await notesInput.fill('Recorded via full demo walkthrough');
        await page.getByRole('button', { name: 'Save' }).click();
        await page.waitForTimeout(3000);
      } else {
        await page.getByRole('button', { name: 'Cancel' }).click();
      }
    }

    // 10. Collateral: view list and open the Add Collateral form
    await page.goto(`/loans/${loanId}/collateral`);
    await page.waitForTimeout(2000);
    await page
      .getByRole('button', { name: /Create|Add/i })
      .first()
      .click();
    await page.waitForTimeout(3000);

    // 11. Disbursement Details tab
    await page.goto(`/loans/view/${loanId}`);
    await page.getByRole('tab', { name: /Disbursement Details/i }).click();
    await page.waitForTimeout(3000);

    // 12. Notes tab: add a note (an append-only audit trail entry)
    await page.getByRole('tab', { name: 'Notes' }).click();
    await page.waitForTimeout(1500);
    await page.locator('textarea[name="newNote"]').fill('Recorded via full demo walkthrough');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(2500);

    // 13. Record a repayment, then view and adjust that transaction
    await page.getByRole('button', { name: 'Repayment' }).click();
    await expect(page).toHaveURL(new RegExp(`/loans/${loanId}/transactions/repayment$`));
    await page.waitForTimeout(1500);
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    await page.locator('input[name="transactionDate"]').fill(todayStr);
    await page.locator('input[name="transactionAmount"]').fill('100');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/loans$/, { timeout: 15000 });

    await page.goto(`/loans/view/${loanId}`);
    await page.getByRole('tab', { name: 'Transactions' }).click();
    await page.waitForTimeout(1500);
    const repaymentRow = page.getByRole('row', { name: /Repayment/ }).first();
    await expect(repaymentRow).toBeVisible({ timeout: 10000 });
    await repaymentRow.locator('mat-icon:text("visibility")').click();
    const txDialog = page.getByRole('dialog');
    await expect(txDialog).toBeVisible();
    await page.waitForTimeout(2000);

    await txDialog.getByRole('button', { name: 'Adjust Transaction' }).click();
    await page.waitForTimeout(1000);
    await txDialog.locator('input[name="adjustAmount"]').fill('75');
    await txDialog
      .locator('textarea[name="adjustNote"]')
      .fill('Corrected mis-entered repayment amount');
    await page.waitForTimeout(1000);
    await txDialog.getByRole('button', { name: 'Adjust Transaction' }).click();
    const confirmDialog = page.getByRole('dialog').last();
    await expect(confirmDialog.getByText(/reverse the original transaction/i)).toBeVisible();
    await page.waitForTimeout(1500);
    await confirmDialog.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(2000);

    // 14. Actions menu: show the full set of new loan lifecycle actions
    await page.goto(`/loans/view/${loanId}`);
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByRole('menuitem', { name: 'Undo Disbursal' })).toBeVisible();
    await page.waitForTimeout(3000);
    await page.keyboard.press('Escape');
  });
});
