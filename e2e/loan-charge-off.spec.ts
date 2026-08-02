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
 * Loan servicing commands against a real Fineract. See issue #194.
 *
 * A backend spec on purpose. These commands have contracts the generated client does not
 * describe — `charge-off` takes a date, `undo-charge-off` takes an empty body and rejects the
 * `locale` and `dateFormat` that every other command wants — and a mocked spec can only assert
 * what the UI sends, never that Fineract accepts it. The product-configuration work in #193
 * shipped a control the server rejected precisely because nothing exercised the real endpoint.
 */

import { test, expect } from './fixtures';
import { login } from './utils/fineract-login';
import { createActiveLoan } from './utils/create-active-loan';

const CHARGED_OFF_CHIP = 'loan-charged-off-chip';
const ACTIONS_BUTTON = 'Actions';

test.describe('Loan servicing commands', () => {
  test('charges a loan off through the UI and reverses it', async ({ page }) => {
    test.slow();
    await login(page);
    const { loanId } = await createActiveLoan(page, 'ChargeOff');

    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Active', { exact: true })).toBeVisible({ timeout: 15000 });

    // Not charged off yet: no marker, and the action is on offer.
    await expect(page.getByTestId(CHARGED_OFF_CHIP)).toHaveCount(0);
    await page.getByRole('button', { name: ACTIONS_BUTTON }).click();
    await expect(page.getByTestId('loan-charge-off-action')).toBeVisible();
    await page.getByTestId('loan-charge-off-action').click();

    await expect(page).toHaveURL(new RegExp(`/loans/${loanId}/transactions/charge-off$`));
    await page.getByRole('button', { name: 'Save' }).click();
    // Destructive commands ask before submitting.
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Fineract keeps the loan Active and flags it separately, so the marker is the only thing
    // that distinguishes a charged-off loan from a healthy one.
    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByTestId(CHARGED_OFF_CHIP)).toBeVisible({ timeout: 15000 });

    // The action swaps for its reversal rather than both being offered.
    await page.getByRole('button', { name: ACTIONS_BUTTON }).click();
    await expect(page.getByTestId('loan-charge-off-action')).toHaveCount(0);
    await page.getByTestId('loan-undo-charge-off-action').click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(page.getByTestId(CHARGED_OFF_CHIP)).toHaveCount(0, { timeout: 15000 });
    await expect(page.getByText('Active', { exact: true })).toBeVisible();
  });

  /**
   * The refund-style commands all take a date, an amount and a payment type, and all go through
   * the shared transaction form. Exercising one end to end proves the payload the form builds is
   * one Fineract accepts — which is the thing a mocked spec cannot tell us, and the thing that
   * went wrong in #193.
   */
  test('records a goodwill credit through the shared transaction form', async ({ page }) => {
    test.slow();
    await login(page);
    const { loanId } = await createActiveLoan(page, 'Goodwill');

    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Active', { exact: true })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: ACTIONS_BUTTON }).click();
    await page.getByTestId('loan-goodwill-credit-action').click();
    await expect(page).toHaveURL(new RegExp(`/loans/${loanId}/transactions/goodwillCredit$`));

    // The template prefills the outstanding amount; a smaller credit keeps the loan active.
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('10');
    await page.getByRole('button', { name: 'Save' }).click();

    // Landing back on the list is the form's success path; a rejected payload keeps it put.
    await expect(page).toHaveURL(/\/loans$/, { timeout: 15000 });

    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Active', { exact: true })).toBeVisible({ timeout: 15000 });
  });
});
