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
import { selectMatOption } from './select-mat-option';

const NUMBER_OF_REPAYMENTS_LABEL = 'Number of Repayments';
const REPAYMENT_EVERY_LABEL = 'Repayment Every';
const INTEREST_RATE_LABEL = 'Interest Rate';

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
  await page.getByRole('combobox', { name: 'Office' }).click({ force: true });
  await expect(page.getByRole('listbox').getByRole('option').first()).toBeVisible({
    timeout: 15000,
  });
  await page.getByRole('listbox').getByRole('option').first().click();
  const clientSuffix = uniqueSuffix();
  const firstName = `${namePrefix}${clientSuffix}`;
  await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Tester');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/clients$/, { timeout: 15000 });

  // Product (a plain Cumulative one is enough for loan-servicing actions)
  await page.goto('/products/loan/create');
  await expect(
    page.getByText('Penalties, Fees, Interest, Principal order', { exact: true }),
  ).toBeVisible({ timeout: 15000 });
  const prodSuffix = uniqueSuffix();
  const productName = `${namePrefix} Product ${prodSuffix}`;
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill(productName);
  await page.getByRole('textbox', { name: 'Short Name' }).fill(prodSuffix.slice(-4).toUpperCase());
  await page.getByRole('spinbutton', { name: 'Principal' }).fill('1000');
  await page.getByRole('spinbutton', { name: INTEREST_RATE_LABEL }).fill('10');
  await page.getByRole('spinbutton', { name: NUMBER_OF_REPAYMENTS_LABEL }).fill('3');
  await page.getByRole('spinbutton', { name: REPAYMENT_EVERY_LABEL }).fill('1');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/products\/loan$/, { timeout: 15000 });

  // Loan application
  await page.goto('/loans/create', { waitUntil: 'networkidle' });
  await page.getByRole('combobox', { name: 'Client ID' }).fill(firstName);
  await page.getByRole('option', { name: new RegExp(firstName) }).click();
  await selectMatOption(page, 'Loan Product', productName);
  await expect(page.getByText(/Loan Schedule Type:\s*Cumulative/)).toBeVisible({ timeout: 15000 });
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
