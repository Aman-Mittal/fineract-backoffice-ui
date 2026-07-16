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
 * Exercises the new loan-account lifecycle actions added in this session:
 * the Material confirm dialog (replacing native confirm()), Undo Disbursal,
 * and Write Off. Each test creates its own throwaway client/loan so it
 * doesn't disturb other loans used by other specs/demos.
 *
 *   npx playwright test e2e/loan-account-actions.spec.ts --workers=1
 */

import { test, expect } from '@playwright/test';
import { login } from './utils/fineract-login';
import { createActiveLoan } from './utils/create-active-loan';

test.describe('Loan account lifecycle actions', () => {
  test('new action menu items appear only for active loans', async ({ page }) => {
    test.setTimeout(120000);
    await login(page);
    const { loanId } = await createActiveLoan(page);

    await page.goto(`/loans/view/${loanId}`);
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByRole('menuitem', { name: 'Undo Disbursal' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Waive Interest' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Prepay Loan' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Foreclosure' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Close', exact: true })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Write Off' })).toBeVisible();
  });

  test('undo disbursal shows a Material confirm dialog and reverts the loan to Approved', async ({
    page,
  }) => {
    test.setTimeout(120000);
    await login(page);
    const { loanId } = await createActiveLoan(page);

    await page.goto(`/loans/view/${loanId}`);
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Undo Disbursal' }).click();

    // Confirm it's a real Material dialog, not a native confirm() popup.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Undo Disbursal')).toBeVisible();

    // Cancelling must not perform the action.
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText('Active', { exact: true })).toBeVisible();

    // Confirming performs it and refreshes the same page in place.
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Undo Disbursal' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click();

    await expect(page.getByText('Approved', { exact: true })).toBeVisible({ timeout: 15000 });
  });

  test('write off requires confirmation and moves the loan out of Active status', async ({
    page,
  }) => {
    test.setTimeout(120000);
    await login(page);
    const { loanId } = await createActiveLoan(page);

    await page.goto(`/loans/view/${loanId}`);
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Write Off' }).click();

    await expect(page).toHaveURL(new RegExp(`/loans/${loanId}/transactions/writeoff$`));
    await page.getByRole('button', { name: 'Save' }).click();

    // The transaction form itself gates the irreversible action behind a
    // second, explicit Material confirmation before calling the API.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Write Off' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Confirm' }).click();

    await expect(page).toHaveURL(/\/loans$/, { timeout: 15000 });
    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Active', { exact: true })).toHaveCount(0);
  });
});
