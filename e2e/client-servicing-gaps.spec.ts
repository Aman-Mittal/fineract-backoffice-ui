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
 * The client servicing commands added for #272, #273 and #274, against mocks.
 *
 * Mocked because the assertions are about the **request body**, which is precisely what a live
 * platform cannot show a test. Every command here refuses a parameter that its neighbours
 * require — `acceptTransfer` rejects `locale`, `dateFormat` and `transferDate`;
 * `proposeAndAcceptTransfer` rejects `transferDate` while `proposeTransfer` demands it;
 * `unassignStaff` demands the `staffId` it is removing. Sending the wrong shape produces a 400
 * with no symptom until somebody actually runs the command, so the bodies are pinned here.
 *
 * The live round trip — propose, accept, and the office actually changing — is covered by
 * `client-transfer.spec.ts` against a real backend.
 */

import { test, expect, Page } from './fixtures';

const TENANT = 'default';
const USER = 'mifos';
const PASSWORD = 'password';
const HEAD_OFFICE = 'Head Office';
const BRANCH_OFFICE = 'Demo Branch';
const CLIENT_ID = 123;
const MENU_TRIGGER = '#clientActionsMenu-trigger';
const NOTE_SELECTOR = 'ion-textarea[data-testid="client-transfer-response-note"] textarea';
const MOVING_BRANCH = 'member moved house';

const ACTIVE = { id: 300, code: 'clientStatusType.active', value: 'Active' };
const TRANSFER_IN_PROGRESS = {
  id: 303,
  code: 'clientStatusType.transfer.in.progress',
  value: 'Transfer in progress',
};
const TRANSFER_ON_HOLD = {
  id: 304,
  code: 'clientStatusType.transfer.on.hold',
  value: 'Transfer on hold',
};
const REJECTED = { id: 500, code: 'clientStatusType.rejected', value: 'Rejected' };

interface ClientOverrides {
  status?: Record<string, unknown>;
  staffId?: number;
  staffName?: string;
  savingsAccountId?: number;
}

function client(overrides: ClientOverrides) {
  return {
    id: CLIENT_ID,
    accountNo: 'CL00123',
    displayName: 'Jane Smith',
    firstname: 'Jane',
    lastname: 'Smith',
    officeId: 1,
    officeName: HEAD_OFFICE,
    status: ACTIVE,
    activationDate: [2026, 1, 15],
    timeline: { submittedOnDate: [2026, 1, 10] },
    ...overrides,
  };
}

/** Records what the page sent, so the assertions are about requests rather than appearances. */
interface Probe {
  commands: { command: string | null; body: Record<string, unknown> }[];
}

async function loginWithClient(page: Page, overrides: ClientOverrides): Promise<Probe> {
  const probe: Probe = { commands: [] };

  await page.route('**/config.json*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fineractApiUrl: '/api/v1', defaultTenant: TENANT }),
    });
  });

  await page.route('**/api/v1/authentication**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        username: USER,
        userId: 1,
        base64EncodedAuthenticationKey: 'YmFzZTY0',
        authenticated: true,
        officeId: 1,
        officeName: HEAD_OFFICE,
        roles: [{ id: 1, name: 'Super User', description: 'Super user' }],
        permissions: ['ALL_FUNCTIONS'],
      }),
    });
  });

  await page.route(/\/api\/v1\/clients\/template/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        officeId: 1,
        officeOptions: [
          { id: 1, name: HEAD_OFFICE },
          { id: 2, name: BRANCH_OFFICE },
        ],
        staffOptions: [
          { id: 4, displayName: 'Officer, Probe', officeId: 1 },
          { id: 5, displayName: 'Cashier, Probe', officeId: 1 },
        ],
      }),
    });
  });

  await page.route(/\/api\/v1\/clients\/\d+\/accounts/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        loanAccounts: [],
        savingsAccounts: [
          {
            id: 8,
            accountNo: 'SA000008',
            productName: 'Demo Savings',
            status: { value: 'Active' },
          },
        ],
      }),
    });
  });

  await page.route(new RegExp(`/api/v1/clients/${CLIENT_ID}(\\?|$)`), async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      probe.commands.push({
        command: new URL(request.url()).searchParams.get('command'),
        body: request.postDataJSON() as Record<string, unknown>,
      });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ clientId: CLIENT_ID, resourceId: CLIENT_ID }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(client(overrides)),
    });
  });

  // Everything the detail tabs fetch on the way in. Left as empty collections so the page
  // renders without each tab having to be mocked by name.
  await page.route(
    /\/api\/v1\/(datatables|clients\/\d+\/(addresses|documents|identifiers|familymembers)|.*\/notes)/,
    async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    },
  );

  await page.goto('/login');
  await page.locator('#tenantId').fill(TENANT);
  await page.locator('#username').fill(USER);
  await page.locator('#password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');

  return probe;
}

/** Opens the client and its actions menu. */
async function openActions(page: Page): Promise<void> {
  await page.goto(`/clients/view/${CLIENT_ID}`);
  await page.locator(MENU_TRIGGER).click();
}

test.describe('Client transfers', () => {
  test('proposing a transfer sends the destination, the date and the format that parses it', async ({
    page,
  }) => {
    const probe = await loginWithClient(page, {});

    await openActions(page);
    await page.getByTestId('client-propose-transfer-action').click();
    await page.getByTestId('client-transfer-office').click();
    await page.getByRole('radio', { name: BRANCH_OFFICE, exact: true }).click();
    await page
      .locator('ion-textarea[data-testid="client-transfer-note"] textarea')
      .fill(MOVING_BRANCH);
    await page.getByTestId('client-transfer-confirm').click();

    await expect.poll(() => probe.commands.length).toBe(1);
    expect(probe.commands[0].command).toBe('proposeTransfer');
    expect(probe.commands[0].body).toEqual({
      destinationOfficeId: 2,
      // The dialog defaults to today, so the value is asserted by shape. The shape is the point:
      // `dd MMMM yyyy` is what `dateFormat` promises, and a mismatch is a 400.
      transferDate: expect.stringMatching(/^\d{2} [A-Z][a-z]+ \d{4}$/),
      locale: 'en',
      dateFormat: 'dd MMMM yyyy',
      note: MOVING_BRANCH,
    });
  });

  test('a one-step transfer omits the date the platform refuses', async ({ page }) => {
    const probe = await loginWithClient(page, {});

    await openActions(page);
    await page.getByTestId('client-propose-and-accept-transfer-action').click();
    await page.getByTestId('client-transfer-office').click();
    await page.getByRole('radio', { name: BRANCH_OFFICE, exact: true }).click();
    await page.getByTestId('client-transfer-confirm').click();

    await expect.poll(() => probe.commands.length).toBe(1);
    expect(probe.commands[0].command).toBe('proposeAndAcceptTransfer');
    // No date, and therefore no locale or format either. Each would be its own 400.
    expect(probe.commands[0].body).toEqual({ destinationOfficeId: 2 });
  });

  test('the client’s own office is not offered as a destination', async ({ page }) => {
    await loginWithClient(page, {});

    await openActions(page);
    await page.getByTestId('client-propose-transfer-action').click();
    await page.getByTestId('client-transfer-office').click();

    // Transferring to the current office is accepted by the platform and leaves the client
    // stuck in "Transfer in progress" against the branch they are already at.
    await expect(page.getByRole('radio', { name: BRANCH_OFFICE, exact: true })).toBeVisible();
    await expect(page.getByRole('radio', { name: HEAD_OFFICE, exact: true })).toHaveCount(0);
  });

  test('accepting a transfer sends a note and nothing else', async ({ page }) => {
    const probe = await loginWithClient(page, { status: TRANSFER_IN_PROGRESS });

    await openActions(page);
    await page.getByTestId('client-accept-transfer-action').click();
    await page.locator(NOTE_SELECTOR).fill('welcome');
    await page.getByTestId('client-transfer-response-confirm').click();

    await expect.poll(() => probe.commands.length).toBe(1);
    expect(probe.commands[0].command).toBe('acceptTransfer');
    expect(probe.commands[0].body).toEqual({ note: 'welcome' });
  });

  test('accepting with no note sends an empty body', async ({ page }) => {
    const probe = await loginWithClient(page, { status: TRANSFER_IN_PROGRESS });

    await openActions(page);
    await page.getByTestId('client-accept-transfer-action').click();
    await page.getByTestId('client-transfer-response-confirm').click();

    await expect.poll(() => probe.commands.length).toBe(1);
    expect(probe.commands[0].body).toEqual({});
  });

  test('rejecting a transfer is offered while one is pending', async ({ page }) => {
    const probe = await loginWithClient(page, { status: TRANSFER_IN_PROGRESS });

    await openActions(page);
    await page.getByTestId('client-reject-transfer-action').click();
    await page.getByTestId('client-transfer-response-confirm').click();

    await expect.poll(() => probe.commands.length).toBe(1);
    expect(probe.commands[0].command).toBe('rejectTransfer');
  });

  test('withdrawing is offered from on hold, which is the only way back', async ({ page }) => {
    const probe = await loginWithClient(page, { status: TRANSFER_ON_HOLD });

    await openActions(page);
    // Accept and reject no longer apply — the destination has already refused.
    await expect(page.getByTestId('client-accept-transfer-action')).toHaveCount(0);
    await expect(page.getByTestId('client-reject-transfer-action')).toHaveCount(0);

    await page.getByTestId('client-withdraw-transfer-action').click();
    await page.getByTestId('client-transfer-response-confirm').click();

    await expect.poll(() => probe.commands.length).toBe(1);
    expect(probe.commands[0].command).toBe('withdrawTransfer');
  });

  test('answers to a transfer are not offered when none is pending', async ({ page }) => {
    await loginWithClient(page, {});

    await openActions(page);
    // Anchored on an item that is present, so these are negatives against a rendered menu.
    await expect(page.getByTestId('client-propose-transfer-action')).toBeVisible();
    await expect(page.getByTestId('client-accept-transfer-action')).toHaveCount(0);
    await expect(page.getByTestId('client-reject-transfer-action')).toHaveCount(0);
    await expect(page.getByTestId('client-withdraw-transfer-action')).toHaveCount(0);
  });
});

test.describe('Client staff and default savings account', () => {
  test('assigning a member of staff sends the staff id', async ({ page }) => {
    const probe = await loginWithClient(page, {});

    await openActions(page);
    await page.getByTestId('client-assign-staff-action').click();
    await page.getByTestId('client-staff-select').click();
    await page.getByRole('radio', { name: 'Officer, Probe', exact: true }).click();
    await page.getByTestId('client-staff-confirm').click();

    await expect.poll(() => probe.commands.length).toBe(1);
    expect(probe.commands[0].command).toBe('assignStaff');
    expect(probe.commands[0].body).toEqual({ staffId: 4 });
  });

  test('unassigning echoes the current holder back, which the platform requires', async ({
    page,
  }) => {
    const probe = await loginWithClient(page, { staffId: 4, staffName: 'Officer, Probe' });

    await openActions(page);
    await page.getByTestId('client-unassign-staff-action').click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect.poll(() => probe.commands.length).toBe(1);
    expect(probe.commands[0].command).toBe('unassignStaff');
    // An empty body answers "The parameter `staffId` is mandatory."
    expect(probe.commands[0].body).toEqual({ staffId: 4 });
  });

  test('unassigning is not offered when nobody is assigned', async ({ page }) => {
    await loginWithClient(page, {});

    await openActions(page);
    await expect(page.getByTestId('client-assign-staff-action')).toBeVisible();
    await expect(page.getByTestId('client-unassign-staff-action')).toHaveCount(0);
  });

  test('the assigned officer is shown on the header', async ({ page }) => {
    await loginWithClient(page, { staffId: 4, staffName: 'Officer, Probe' });

    await page.goto(`/clients/view/${CLIENT_ID}`);

    // `staffName` is one of the fields the generated model does not declare, so this also
    // guards the cast in client-servicing.model.ts.
    await expect(page.getByTestId('client-staff-name')).toHaveText('Officer, Probe');
  });

  test('setting the default savings account sends the account id', async ({ page }) => {
    const probe = await loginWithClient(page, {});

    await openActions(page);
    await page.getByTestId('client-update-savings-account-action').click();
    await page.getByTestId('client-savings-account-select').click();
    await page.getByRole('radio', { name: /SA000008/ }).click();
    await page.getByTestId('client-savings-account-confirm').click();

    await expect.poll(() => probe.commands.length).toBe(1);
    expect(probe.commands[0].command).toBe('updateSavingsAccount');
    expect(probe.commands[0].body).toEqual({ savingsAccountId: 8 });
  });
});

test.describe('Undoing a rejection', () => {
  test('posts the command name the platform recognises, not the menu identifier', async ({
    page,
  }) => {
    const probe = await loginWithClient(page, { status: REJECTED });

    await openActions(page);
    await page.getByRole('button', { name: /undo/i }).first().click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect.poll(() => probe.commands.length).toBe(1);
    // `undoReject` is answered with 400 "unsupported value", so the menu item was dead. #273.
    expect(probe.commands[0].command).toBe('UndoRejection');
  });
});
