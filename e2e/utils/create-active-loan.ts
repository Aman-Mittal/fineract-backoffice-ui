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

import { Page, expect } from '@playwright/test';
import { uniqueSuffix } from './fineract-login';
import { selectOption } from './select-option';

/* Ionic's ion-item/ion-label/ion-input pattern has no ARIA name association (the ion-label
   is a custom element, not a native <label for>), so these fields expose no accessible name
   for getByRole('textbox'/'spinbutton', {name}) to match — locate by their `name` attribute
   instead, which is stable across both the product-create and loan-create forms. */
const NUMBER_OF_REPAYMENTS_INPUT = 'input[name="numberOfRepayments"]';
const REPAYMENT_EVERY_INPUT = 'input[name="repaymentEvery"]';
const INTEREST_RATE_INPUT = 'input[name="interestRatePerPeriod"]';
const PRINCIPAL_INPUT = 'input[name="principal"]';

/**
 * Builds a throwaway client + Cumulative loan product + loan application,
 * then approves and disburses it, landing on an Active loan account —
 * the common starting point for tests that exercise loan-account servicing
 * actions (repayment, notes, adjustments, write-off, etc).
 */
export async function createActiveLoan(
  page: Page,
  namePrefix = 'E2EDemo',
): Promise<{ loanId: number; firstName: string }> {
  // Client
  await page.goto('/clients/create', { waitUntil: 'networkidle' });
  await page.locator('ion-select[name="officeId"]').click({ force: true });
  await expect(page.locator('ion-alert, ion-popover').getByRole('radio').first()).toBeVisible({
    timeout: 15000,
  });
  await page.locator('ion-alert, ion-popover').getByRole('radio').first().click();
  const clientSuffix = uniqueSuffix();
  const firstName = `${namePrefix}${clientSuffix}`;
  await page.locator('input[name="firstname"]').fill(firstName);
  await page.locator('input[name="lastname"]').fill('Tester');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/clients$/, { timeout: 15000 });

  // Product (a plain Cumulative one is enough for loan-servicing actions)
  await page.goto('/products/loan/create');
  await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 15000 });
  const prodSuffix = uniqueSuffix();
  const productName = `${namePrefix} Product ${prodSuffix}`;
  await page.locator('input[name="name"]').fill(productName);
  await page.locator('input[name="shortName"]').fill(prodSuffix.slice(-4).toUpperCase());
  await page.locator(PRINCIPAL_INPUT).fill('1000');
  await page.locator(INTEREST_RATE_INPUT).fill('10');
  await page.locator(NUMBER_OF_REPAYMENTS_INPUT).fill('3');
  await page.locator(REPAYMENT_EVERY_INPUT).fill('1');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/products\/loan$/, { timeout: 15000 });

  // Loan application
  await page.goto('/loans/create', { waitUntil: 'networkidle' });
  await page.locator('#client-search-input input').fill(firstName);
  /* app-client-search renders its own ion-list dropdown (not an ion-alert/popover) with
     ion-item[button] rows, which expose role="button", not "radio" */
  await page
    .locator('#client-search-results')
    .getByRole('button', { name: new RegExp(firstName) })
    .click();
  await selectOption(page, 'Loan Product', productName);
  await expect(page.getByText(/Loan Schedule Type:\s*Cumulative/)).toBeVisible({ timeout: 15000 });
  await page.locator(PRINCIPAL_INPUT).fill('1000');
  await page.locator('input[name="loanTermFrequency"]').fill('3');
  await selectOption(page, 'Term Type', 'Months');
  await page.locator(NUMBER_OF_REPAYMENTS_INPUT).fill('3');
  await page.locator(REPAYMENT_EVERY_INPUT).fill('1');
  await selectOption(page, 'Frequency', 'Months');
  await page.locator(INTEREST_RATE_INPUT).fill('10');
  await selectOption(page, 'Interest Type', 'Declining Balance');
  await selectOption(page, 'Amortization Type', 'Equal Installments');
  await selectOption(page, 'Interest Calculation Period Type', 'Same as repayment period');

  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes('/loans') && res.request().method() === 'POST',
    ),
    page.getByRole('button', { name: 'Save' }).click(),
  ]);
  const loanId = (await response.json()).loanId as number;

  // Approve then disburse
  await page.goto(`/loans/view/${loanId}`);
  await expect(page.getByText('Submitted and pending approval')).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: 'Approve' }).click();
  await expect(page).toHaveURL(/\/products\/loan\/\d+\/action\/approve$/);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(new RegExp(`/loans/view/${loanId}$`), { timeout: 15000 });
  await expect(page.getByText('Approved', { exact: true })).toBeVisible({ timeout: 15000 });

  await page.getByRole('button', { name: 'Disburse' }).click();
  await expect(page).toHaveURL(new RegExp(`/loans/${loanId}/transactions/disburse$`));
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/loans$/, { timeout: 15000 });

  await page.goto(`/loans/view/${loanId}`);
  await expect(page.getByText('Active', { exact: true })).toBeVisible({ timeout: 15000 });

  return { loanId, firstName };
}
