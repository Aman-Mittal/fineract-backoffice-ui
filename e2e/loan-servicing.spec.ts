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
 * Exercises the loan-account servicing features added in this session: the
 * Notes tab (audit-trail add/delete) and the Transactions tab's detail
 * dialog with transaction adjustment (correcting a mis-entered repayment).
 * Each test configures its own Office/Client/Loan Product/Loan so it runs
 * independently of other specs and demo data on the shared sandbox.
 *
 *   npx playwright test e2e/loan-servicing.spec.ts --workers=1
 */

import { test, expect } from '@playwright/test';
import { login } from './utils/fineract-login';
import { createActiveLoan } from './utils/create-active-loan';

test.describe('Loan servicing: notes and transaction adjustment', () => {
  test('notes can be added and removed, with a Material confirm dialog on delete', async ({
    page,
  }) => {
    test.setTimeout(120000);
    await login(page);
    const { loanId } = await createActiveLoan(page, 'NotesDemo');

    await page.goto(`/loans/view/${loanId}`);
    await page.getByRole('tab', { name: 'Notes' }).click();
    await expect(page.getByText('No notes recorded for this loan yet.')).toBeVisible();

    const noteText = `E2E note ${Date.now()}`;
    await page.locator('textarea[name="newNote"]').fill(noteText);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText(noteText)).toBeVisible({ timeout: 10000 });

    // Deleting must go through the Material confirm dialog, not a native confirm().
    await page.locator('button:has(mat-icon:text("delete"))').first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/delete this note/i)).toBeVisible();

    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(noteText)).toBeVisible();

    await page.locator('button:has(mat-icon:text("delete"))').first().click();
    await page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByText(noteText)).toHaveCount(0);
    await expect(page.getByText('No notes recorded for this loan yet.')).toBeVisible();
  });

  test('a repayment transaction can be viewed and adjusted with a corrected amount', async ({
    page,
  }) => {
    test.setTimeout(120000);
    await login(page);
    const { loanId } = await createActiveLoan(page, 'AdjustDemo');

    // Record a repayment (today's date, not the template's future default).
    await page.goto(`/loans/${loanId}/transactions/repayment`);
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    await page.locator('input[name="transactionDate"]').fill(todayStr);
    await page.locator('input[name="transactionAmount"]').fill('100');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/loans$/, { timeout: 15000 });

    await page.goto(`/loans/view/${loanId}`);
    await page.getByRole('tab', { name: 'Transactions' }).click();
    const repaymentRow = page.getByRole('row', { name: /Repayment/ }).first();
    await expect(repaymentRow).toBeVisible({ timeout: 10000 });

    // View: shows a full breakdown, not just the raw enum code.
    await repaymentRow.locator('mat-icon:text("visibility")').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Repayment', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(dialog.getByText('$100.00')).toBeVisible();

    // Adjust: correct the amount, which reverses the original and posts a
    // new transaction — a common real-world "fix the mis-entered receipt"
    // workflow that previously had no in-app path at all.
    await dialog.getByRole('button', { name: 'Adjust Transaction' }).click();
    await dialog.locator('input[name="adjustAmount"]').fill('75');
    await dialog
      .locator('textarea[name="adjustNote"]')
      .fill('E2E: corrected mis-entered repayment amount');
    await dialog.getByRole('button', { name: 'Adjust Transaction' }).click();

    const confirmDialog = page.getByRole('dialog').last();
    await expect(confirmDialog.getByText(/reverse the original transaction/i)).toBeVisible();

    const [adjustResponse] = await Promise.all([
      page.waitForResponse(
        (res) => /\/transactions\/\d+$/.test(res.url()) && res.request().method() === 'POST',
      ),
      confirmDialog.getByRole('button', { name: 'Confirm' }).click(),
    ]);
    expect(adjustResponse.ok()).toBeTruthy();

    await page.goto(`/loans/view/${loanId}`);
    await page.getByRole('tab', { name: 'Transactions' }).click();
    await expect(page.getByText('+ $75.00')).toBeVisible({ timeout: 10000 });
  });
});
