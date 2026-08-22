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
 * GLIM (Group Loan In individual Monitoring) and GSIM (Group Savings In individual Monitoring)
 * account creation, ported from web-app's `create-glim-account.component.ts` /
 * `create-gsim-account.component.ts`. Mocked throughout — see `report-parameter-backend.spec.ts`
 * for this codebase's convention of pairing a mocked spec with a `backend` one; no `backend`
 * companion exists yet for this feature.
 */

import { Page, Request } from '@playwright/test';
import { test, expect } from './fixtures';
import { ionSelect } from './utils/ionic-locators';

async function pickOption(page: Page, label: string, optionName: string): Promise<void> {
  await ionSelect(page, label).click();
  await page
    .locator('ion-alert, ion-popover, ion-action-sheet')
    .getByRole('radio', { name: optionName, exact: true })
    .click();
}

const HEAD_OFFICE = 'Head Office';
const GROUP_ID = 7;

function json(body: unknown) {
  return { status: 200, contentType: 'application/json', body: JSON.stringify(body) };
}

const GROUP = {
  id: GROUP_ID,
  name: 'Kibera Womens Group',
  activeClientMembers: [
    { id: 11, displayName: 'Amina Yusuf' },
    { id: 12, displayName: 'Beatrice Wanjiru' },
  ],
  clientMembers: [
    { id: 11, displayName: 'Amina Yusuf' },
    { id: 12, displayName: 'Beatrice Wanjiru' },
  ],
};

async function setup(page: Page) {
  const batchRequests: Record<string, unknown>[] = [];
  let gsimRequestBody: { clientArray: Record<string, unknown>[] } | null = null;

  await page.route('**/config.json*', (route) =>
    route.fulfill(json({ fineractApiUrl: '/api/v1', defaultTenant: 'default' })),
  );
  await page.route('**/api/v1/authentication**', (route) =>
    route.fulfill(
      json({
        username: 'mifos',
        userId: 1,
        base64EncodedAuthenticationKey: 'YmFzZTY0',
        authenticated: true,
        officeId: 1,
        officeName: HEAD_OFFICE,
        roles: [{ id: 1, name: 'Super User', description: 'Super user' }],
        permissions: ['ALL_FUNCTIONS'],
      }),
    ),
  );
  await page.route(/\/api\/v1\/businessdate/, (route) =>
    route.fulfill(json([{ type: 'BUSINESS_DATE', date: [2026, 8, 16] }])),
  );

  await page.route('**/api/v1/groups/7/notes**', (route) => route.fulfill(json([])));
  await page.route('**/api/v1/groups/7/accounts**', (route) =>
    route.fulfill(json({ loanAccounts: [], savingsAccounts: [] })),
  );
  await page.route(
    (url) => url.pathname === '/api/v1/groups/7',
    (route) => route.fulfill(json(GROUP)),
  );

  await page.route('**/api/v1/loanproducts**', (route) =>
    route.fulfill(json([{ id: 1, name: 'Group Loan Product' }])),
  );
  await page.route('**/api/v1/savingsproducts**', (route) =>
    route.fulfill(json([{ id: 3, name: 'Group Savings Product' }])),
  );

  await page.route('**/api/v1/batches**', async (route, request: Request) => {
    const body = JSON.parse(request.postData() || '[]') as Record<string, unknown>[];
    batchRequests.push(...body);
    await route.fulfill(
      json(
        body.map((_, index) => ({
          requestId: index,
          statusCode: 200,
          body: JSON.stringify({ glimId: 500, loanId: 900 + index }),
        })),
      ),
    );
  });

  await page.route('**/api/v1/savingsaccounts/gsim**', async (route, request: Request) => {
    gsimRequestBody = JSON.parse(request.postData() || '{}');
    await route.fulfill(json({ resourceId: 600 }));
  });

  await page.route('**/api/v1/groups/7/glimaccounts**', (route) =>
    route.fulfill(
      json([
        {
          childLoanId: 901,
          clientId: 11,
          clientName: 'Amina Yusuf',
          childLoanAccountNo: '000000901',
          childPrincipalAmount: 500,
          parentPrincipalAmount: 1200,
          status: { code: 'loanStatusType.active', value: 'Active' },
        },
      ]),
    ),
  );
  await page.route('**/api/v1/loans/glimAccount/**', (route) =>
    route.fulfill(
      json([
        {
          childLoanId: 901,
          clientId: 11,
          clientName: 'Amina Yusuf',
          childLoanAccountNo: '000000901',
          childPrincipalAmount: 500,
          parentPrincipalAmount: 1200,
          status: { code: 'loanStatusType.active', value: 'Active' },
        },
      ]),
    ),
  );
  await page.route('**/api/v1/groups/7/gsimaccounts**', (route) =>
    route.fulfill(
      json([
        {
          id: 600,
          accountNo: '000000600',
          productName: 'Group Savings Product',
          status: { code: 'savingsAccountStatusType.active', value: 'Active' },
          childGSIMAccounts: [
            {
              id: 601,
              displayName: 'Amina Yusuf',
              accountNo: '000000601',
              productName: 'Group Savings Product',
              clientId: 11,
              status: { code: 'savingsAccountStatusType.active', value: 'Active' },
            },
          ],
        },
      ]),
    ),
  );

  await page.goto('/login');
  await page.locator('#tenantId').fill('default');
  await page.locator('#username').fill('mifos');
  await page.locator('#password').fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');

  return {
    batchRequests,
    gsimRequestBody: () => gsimRequestBody,
  };
}

async function openAccountsTab(page: Page): Promise<void> {
  await page.goto(`/groups/view/${GROUP_ID}`);
  await expect(page.getByTestId('group-name')).toHaveText(GROUP.name);
  await page.getByTestId('group-tab-accounts').click();
}

test.describe('GLIM account creation', () => {
  test('bundles every selected member into one batch request, sharing the terms and totalLoan', async ({
    page,
  }) => {
    const { batchRequests } = await setup(page);
    await openAccountsTab(page);

    await page.getByRole('button', { name: 'Create GLIM Loan' }).click();
    await expect(page).toHaveURL(`/groups/${GROUP_ID}/glim/create`);

    await pickOption(page, 'Loan Product', 'Group Loan Product');
    await page.getByRole('spinbutton', { name: 'Term Frequency' }).fill('12');
    await pickOption(page, 'Term Type', 'Months');
    await page.getByRole('spinbutton', { name: 'Number of Repayments' }).fill('12');
    await page.getByRole('spinbutton', { name: 'Repayment Every' }).fill('1');
    await pickOption(page, 'Frequency', 'Months');
    await page.getByRole('spinbutton', { name: 'Interest Rate' }).fill('10');
    await pickOption(page, 'Interest Type', 'Declining Balance');
    await pickOption(page, 'Amortization Type', 'Equal Installments');
    await pickOption(page, 'Interest Calculation Period Type', 'Daily');

    await page.locator('ion-checkbox[aria-label="Amina Yusuf"]').click();
    await page.getByRole('spinbutton', { name: /Principal - Amina Yusuf/ }).fill('500');
    await page.locator('ion-checkbox[aria-label="Beatrice Wanjiru"]').click();
    await page.getByRole('spinbutton', { name: /Principal - Beatrice Wanjiru/ }).fill('700');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(`/groups/${GROUP_ID}/glim/view/500`);
    await expect(page.getByRole('cell', { name: 'Amina Yusuf' })).toBeVisible();

    expect(batchRequests).toHaveLength(2);
    expect(batchRequests.every((request) => request['relativeUrl'] === 'loans')).toBe(true);
  });
});

test.describe('GSIM account creation', () => {
  test('marks only the first selected member as the GSIM parent', async ({ page }) => {
    const { gsimRequestBody } = await setup(page);
    await openAccountsTab(page);

    await page.getByRole('button', { name: 'Create GSIM Savings' }).click();
    await expect(page).toHaveURL(`/groups/${GROUP_ID}/gsim/create`);

    await pickOption(page, 'Product', 'Group Savings Product');
    await page.locator('ion-checkbox[aria-label="Amina Yusuf"]').click();
    await page.locator('ion-checkbox[aria-label="Beatrice Wanjiru"]').click();

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(`/groups/${GROUP_ID}/gsim/view`);
    await expect(page.getByRole('cell', { name: 'Amina Yusuf' })).toBeVisible();

    const body = gsimRequestBody();
    expect(body?.clientArray).toHaveLength(2);
    expect(body?.clientArray[0]).toMatchObject({ clientId: 11, isParentAccount: true });
    expect(body?.clientArray[1]).toMatchObject({ clientId: 12, isParentAccount: false });
  });
});
