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

import { test, expect, Page } from './fixtures';

const TENANT = 'default';
const USER = 'mifos';
const PASSWORD = 'password';

async function setupBaseMockRoutes(page: Page): Promise<void> {
  await page.route('**/config.json*', (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fineractApiUrl: '/api/v1', defaultTenant: TENANT }),
    }),
  );

  await page.route('**/api/v1/authentication**', (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        username: USER,
        userId: 1,
        base64EncodedAuthenticationKey: 'YmFzZTY0',
        authenticated: true,
        officeId: 1,
        officeName: 'Head Office',
        roles: [{ id: 1, name: 'Super User', description: 'Super user' }],
        permissions: ['ALL_FUNCTIONS'],
      }),
    }),
  );

  await page.route('**/api/v1/offices*', (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Head Office', externalId: '1', openingDate: [2009, 1, 1], hierarchy: '.' },
      ]),
    }),
  );

  await page.route(/\/api\/v1\/clients(\?|$)/, (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalFilteredRecords: 0, pageItems: [] }),
    }),
  );
}

async function loginAndGoToLoanCreate(page: Page): Promise<void> {
  await setupBaseMockRoutes(page);
  await page.goto('/login');
  await page.locator('#tenantId').fill(TENANT);
  await page.locator('#username').fill(USER);
  await page.locator('#password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
}

test.describe('Loan Product Quick Create Modal', () => {
  test('happy path: quick-creates loan product, sends fixed defaults, closes modal, and auto-selects in dropdown', async ({
    page,
  }) => {
    const createdProducts: Array<{ id: number; name: string; shortName: string }> = [];
    let capturedPayload: Record<string, unknown> | null = null;

    await page.route('**/api/v1/loanproducts**', async (route) => {
      if (route.request().method() === 'POST') {
        capturedPayload = JSON.parse(route.request().postData() || '{}');
        const newProduct = {
          id: 99,
          name: (capturedPayload?.name as string) || 'Quick Loan Product',
          shortName: (capturedPayload?.shortName as string) || 'QLP',
        };
        createdProducts.push(newProduct);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 99, resourceId: 99 }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createdProducts),
        });
      }
    });

    await loginAndGoToLoanCreate(page);
    await page.goto('/loans/create', { waitUntil: 'networkidle' });

    const triggerButton = page.getByTestId('loan-create-product-trigger');
    const productSelect = page.getByTestId('loan-product-select');

    await expect(triggerButton).toBeVisible();
    await expect(productSelect).toBeVisible();

    // Open quick-create modal
    await triggerButton.click();

    const dialog = page.locator('ion-modal:not(.ion-datetime-button-overlay)');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Create Loan Product');

    // Fill form fields
    await page.getByTestId('quick-product-name').locator('input').fill('Quick Loan Product');
    await page.getByTestId('quick-product-short-name').locator('input').fill('QLP');
    await page.getByTestId('quick-product-principal').locator('input').fill('10000');
    await page.getByTestId('quick-product-interest-rate').locator('input').fill('5');
    await page.getByTestId('quick-product-repayments-count').locator('input').fill('12');
    await page.getByTestId('quick-product-repayment-every').locator('input').fill('1');

    // Submit form
    await page.getByTestId('quick-product-submit').click();

    // Assert POST payload details
    await expect.poll(() => capturedPayload).not.toBeNull();
    expect(capturedPayload).toMatchObject({
      name: 'Quick Loan Product',
      shortName: 'QLP',
      principal: 10000,
      interestRatePerPeriod: 5,
      numberOfRepayments: 12,
      repaymentEvery: 1,
      currencyCode: 'USD',
      digitsAfterDecimal: 2,
      inMultiplesOf: 0,
      repaymentFrequencyType: 2,
      interestRateFrequencyType: 3,
      amortizationType: 1,
      interestType: 0,
      interestCalculationPeriodType: 1,
      loanScheduleType: 'CUMULATIVE',
      transactionProcessingStrategyCode: 'mifos-standard-strategy',
      accountingRule: 1,
      daysInYearType: 1,
      daysInMonthType: 1,
      isInterestRecalculationEnabled: false,
      locale: 'en',
    });

    // Assert modal closes
    await expect(dialog).toBeHidden();

    // Assert product select auto-selects newly created product
    await expect(productSelect).toContainText('Quick Loan Product');
  });

  test('cancel flow: closes modal without sending POST request', async ({ page }) => {
    let postAttempted = false;

    await page.route('**/api/v1/loanproducts**', async (route) => {
      if (route.request().method() === 'POST') {
        postAttempted = true;
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await loginAndGoToLoanCreate(page);
    await page.goto('/loans/create', { waitUntil: 'networkidle' });

    const triggerButton = page.getByTestId('loan-create-product-trigger');
    await triggerButton.click();

    const dialog = page.locator('ion-modal:not(.ion-datetime-button-overlay)');
    await expect(dialog).toBeVisible();

    await page.getByTestId('quick-product-name').locator('input').fill('Canceled Product');

    await page.getByTestId('quick-product-cancel').click();

    await expect(dialog).toBeHidden();
    expect(postAttempted).toBe(false);
  });

  test('error path: displays toast, keeps modal open, and preserves entered values when POST fails', async ({
    page,
  }) => {
    await page.route('**/api/v1/loanproducts**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await loginAndGoToLoanCreate(page);
    await page.goto('/loans/create', { waitUntil: 'networkidle' });

    const triggerButton = page.getByTestId('loan-create-product-trigger');
    await triggerButton.click();

    const dialog = page.locator('ion-modal:not(.ion-datetime-button-overlay)');
    await expect(dialog).toBeVisible();

    await page.getByTestId('quick-product-name').locator('input').fill('Failed Product');
    await page.getByTestId('quick-product-short-name').locator('input').fill('FP');
    await page.getByTestId('quick-product-principal').locator('input').fill('5000');
    await page.getByTestId('quick-product-interest-rate').locator('input').fill('10');
    await page.getByTestId('quick-product-repayments-count').locator('input').fill('6');
    await page.getByTestId('quick-product-repayment-every').locator('input').fill('1');

    await page.getByTestId('quick-product-submit').click();

    // Assert error notification toast is shown
    const toast = page.locator('ion-toast.error-toast').last();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Operation failed. Please try again.');

    // Assert modal remains open
    await expect(dialog).toBeVisible();

    // Assert form values are preserved
    await expect(page.getByTestId('quick-product-name').locator('input')).toHaveValue(
      'Failed Product',
    );
    await expect(page.getByTestId('quick-product-short-name').locator('input')).toHaveValue('FP');
    await expect(page.getByTestId('quick-product-principal').locator('input')).toHaveValue('5000');
    await expect(page.getByTestId('quick-product-interest-rate').locator('input')).toHaveValue(
      '10',
    );
    await expect(page.getByTestId('quick-product-repayments-count').locator('input')).toHaveValue(
      '6',
    );
    await expect(page.getByTestId('quick-product-repayment-every').locator('input')).toHaveValue(
      '1',
    );
  });
});
