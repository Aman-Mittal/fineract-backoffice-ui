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
 * Real-backend end-to-end coverage for the full loan lifecycle: client
 * creation, loan product creation, loan application creation, approval, and
 * disbursement — run once for a Cumulative product and once for a
 * Progressive product, since the schedule-generation code path differs
 * between the two once a loan is actually disbursed.
 *
 * Each test is fully self-contained (creates its own client and product) so
 * it can run against any backend with no pre-seeded data required — the
 * public Mifos community sandbox (default) or a fresh local Fineract
 * instance:
 *
 *   npx playwright test e2e/loan-lifecycle.spec.ts --workers=1
 *
 *   FINERACT_SERVER_URL="https://localhost:8443/fineract-provider/api/v1" \
 *   FINERACT_TENANT_ID=default FINERACT_USERNAME=mifos FINERACT_PASSWORD=password \
 *   npx playwright test e2e/loan-lifecycle.spec.ts --workers=1
 *
 * `--workers=1` is recommended against the shared public sandbox — see the
 * matching note in loan-schedule-type.spec.ts.
 *
 * Videos/traces for every run are written under test-results/.
 */

import { test, expect, Page } from '@playwright/test';
import { login, uniqueSuffix } from './utils/fineract-login';

test.use({ video: 'on', trace: 'on' });

/**
 * Select an option from a Material `mat-select` by its field label and the
 * option's visible text. Waits for the overlay backdrop to fully detach
 * afterwards — consecutive mat-select interactions otherwise race the
 * closing animation of the previous overlay and the next click gets
 * intercepted by its lingering backdrop.
 */
async function selectMatOption(page: Page, comboboxName: string, optionName: string) {
  const combobox = page.getByRole('combobox', { name: comboboxName });
  const option = page.getByRole('option', { name: optionName, exact: true });

  // Occasionally the click opens and the overlay closes again before the
  // option renders (a leftover event from the previous overlay's closing
  // animation, or real network latency for an in-flight product-details
  // call), so retry opening a few times rather than failing on the first miss.
  const attempts = 5;
  for (let attempt = 0; attempt < attempts; attempt++) {
    // force: true — the mat-form-field's own floating label sometimes
    // overlaps the select trigger's hit area for empty required fields,
    // which otherwise makes Playwright's actionability check spin forever on
    // "element intercepts pointer events" even though a real click lands fine.
    await combobox.click({ force: true });
    try {
      await expect(option).toBeVisible({ timeout: 8000 });
      break;
    } catch (err) {
      if (attempt === attempts - 1) throw err;
    }
  }

  await option.click();
  await expect(page.locator('.cdk-overlay-backdrop')).toHaveCount(0);
}

async function createClient(page: Page): Promise<string> {
  const suffix = uniqueSuffix();
  const firstName = `E2ELife${suffix}`;
  const lastName = 'Tester';

  // Wait for network idle so the async GET /offices call backing the Office
  // dropdown has resolved before opening it — otherwise it opens empty.
  await page.goto('/clients/create', { waitUntil: 'networkidle' });
  await page.getByRole('combobox', { name: 'Office' }).click({ force: true });
  await expect(page.getByRole('listbox').getByRole('option').first()).toBeVisible({
    timeout: 15000,
  });
  await page.getByRole('listbox').getByRole('option').first().click();
  await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/clients$/, { timeout: 15000 });

  return `${firstName} ${lastName}`;
}

async function createLoanProduct(
  page: Page,
  scheduleType: 'Cumulative' | 'Progressive',
): Promise<string> {
  const suffix = uniqueSuffix();
  const productName = `E2E ${scheduleType} Lifecycle ${suffix}`;
  const shortName = suffix.slice(-4).toUpperCase();

  await page.goto('/products/loan/create');
  // Wait for the template-driven dropdowns to populate before touching them.
  await expect(
    page.getByText('Penalties, Fees, Interest, Principal order', { exact: true }),
  ).toBeVisible({ timeout: 15000 });

  await page.getByRole('textbox', { name: 'Name', exact: true }).fill(productName);
  await page.getByRole('textbox', { name: 'Short Name' }).fill(shortName);
  await page.getByRole('spinbutton', { name: 'Principal' }).fill('1000');
  await page.getByRole('spinbutton', { name: 'Interest Rate' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Number of Repayments' }).fill('3');
  await page.getByRole('spinbutton', { name: 'Repayment Every' }).fill('1');

  if (scheduleType === 'Progressive') {
    await selectMatOption(page, 'Loan Schedule Type', 'Progressive');
  }

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/products\/loan$/, { timeout: 15000 });

  return productName;
}

async function createLoanApplication(
  page: Page,
  clientName: string,
  productName: string,
): Promise<number> {
  // Wait for network idle so the async getLoanproducts() call backing the
  // Loan Product dropdown has resolved before opening it.
  await page.goto('/loans/create', { waitUntil: 'networkidle' });

  // Client search is a debounced autocomplete backed by GET /clients — type
  // enough of the unique first name to filter server-side to just our client.
  await page.getByRole('combobox', { name: 'Client ID' }).fill(clientName.split(' ')[0]);
  await page.getByRole('option', { name: new RegExp(clientName) }).click();

  await selectMatOption(page, 'Loan Product', productName);

  await page.getByRole('spinbutton', { name: 'Principal', exact: true }).fill('1000');
  await page.getByRole('spinbutton', { name: 'Term Frequency' }).fill('3');
  await selectMatOption(page, 'Term Type', 'Months');
  await page.getByRole('spinbutton', { name: 'Number of Repayments' }).fill('3');
  await page.getByRole('spinbutton', { name: 'Repayment Every' }).fill('1');
  await selectMatOption(page, 'Frequency', 'Months');
  await page.getByRole('spinbutton', { name: 'Interest Rate' }).fill('10');
  await selectMatOption(page, 'Interest Type', 'Declining Balance');
  await selectMatOption(page, 'Amortization Type', 'Equal Installments');
  await selectMatOption(page, 'Interest Calculation Period Type', 'Same as repayment period');

  // Capture the created loan's ID directly from the POST /loans response
  // rather than looking it up afterwards in the list — the list's search box
  // only filters by account number (a real gap: it's wired to the Fineract
  // `accountNo` query param, not a general search), and pagination makes
  // locating a specific row unreliable in a shared environment that
  // accumulates loans across test runs.
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes('/loans') && res.request().method() === 'POST',
    ),
    page.getByRole('button', { name: 'Save' }).click(),
  ]);
  await expect(page).toHaveURL(/\/loans$/, { timeout: 15000 });
  const body = await response.json();
  return body.loanId as number;
}

test.describe('Loan lifecycle: creation, approval, disbursement', () => {
  // See the comment in loan-schedule-type.spec.ts — these tests exercise a
  // real shared backend and are run serially to avoid overloading it when
  // multiple product/loan-creating suites run in the same pass.
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  for (const scheduleType of ['Cumulative', 'Progressive'] as const) {
    test(`create, approve, and disburse a ${scheduleType} loan`, async ({ page }) => {
      test.setTimeout(120000);

      const clientName = await createClient(page);
      const productName = await createLoanProduct(page, scheduleType);
      const loanId = await createLoanApplication(page, clientName, productName);

      // Drive the whole lifecycle from the loan's own view page rather than
      // the list — the list's search box only filters by account number (see
      // the comment in createLoanApplication), so it can't reliably locate a
      // specific row in a shared environment with accumulated test data.
      await page.goto(`/loans/view/${loanId}`);
      await expect(page.getByText('Submitted and pending approval')).toBeVisible({
        timeout: 15000,
      });

      // Approve. Approval/expected-disbursement dates default to today, so
      // the action form needs no field interaction beyond Save.
      await page.getByRole('button', { name: 'Approve' }).click();
      await expect(page).toHaveURL(/\/products\/loan\/\d+\/action\/approve$/);
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page).toHaveURL(`/loans/view/${loanId}`, { timeout: 15000 });
      await expect(page.getByText('Approved', { exact: true })).toBeVisible({ timeout: 15000 });

      // Disburse. Transaction amount/date default from the loan template, so
      // again no field interaction is needed beyond Save. This form (unlike
      // the approve action form) redirects to the loans list rather than
      // back to the loan's view page, so navigate there explicitly after.
      await page.getByRole('button', { name: 'Disburse' }).click();
      await expect(page).toHaveURL(new RegExp(`/loans/${loanId}/transactions/disburse$`));
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page).toHaveURL(/\/loans$/, { timeout: 15000 });

      await page.goto(`/loans/view/${loanId}`);
      await expect(page.getByText('Active', { exact: true })).toBeVisible({ timeout: 15000 });
    });
  }
});
