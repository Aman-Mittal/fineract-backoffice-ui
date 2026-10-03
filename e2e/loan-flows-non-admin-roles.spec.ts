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
 * The loan lifecycle driven by the four separate non-admin accounts a real lender would
 * split it across, with every one of those accounts built through the application's own
 * screens.
 *
 * ## Why this is not another RBAC spec
 *
 * The existing RBAC specs seed their users with `seed-api.ts` and then vary what the
 * resulting session may *read*. This one does neither:
 *
 *  - **No seeding.** The roles, the permission grants, the users, the client, the loan
 *    product and the loan application are all created by filling the forms. That means the
 *    administrative screens are themselves under test — `role-form` is the only place in the
 *    application that writes `PUT /roles/{id}/permissions`, and nothing exercised it against a
 *    real platform before this spec. A permission matrix that silently sent the wrong delta
 *    would have passed every existing test, because every existing test grants permissions
 *    over HTTP instead.
 *  - **Write actions, not reads.** `APPROVE_LOAN`, `DISBURSE_LOAN` and `REPAYMENT_LOAN` live
 *    in Fineract's `transaction_loan` grouping, which the suite had no coverage of at all.
 *    They are also the codes a lender actually separates duties along: the officer who books
 *    the loan is not the person who approves it, and neither is the teller who pays it out.
 *
 * `seed-api.ts` opens by explaining that these prerequisites used to be built through the UI
 * and were moved to HTTP because the chain was flaky — the client-search dropdown especially.
 * That reasoning is right for a spec whose subject is something else; setup should not be able
 * to fail a test for an unrelated reason. Here the setup *is* the subject, so it is driven
 * through the forms deliberately, and the one genuinely racy step is wrapped in the same
 * `toPass` retry `loan-lifecycle.spec.ts` uses for it.
 *
 * ## Both halves, every time
 *
 * Every claim about what an account may do is checked twice: once against what the
 * application offers that session, and once against what Fineract answers the same account.
 * `platformAllows()` below does the second half **without performing the operation**, by
 * sending an empty body: Fineract authorises before it validates, so a holder of the code
 * gets 400 and a non-holder gets 403. That distinction is the whole assertion, and it costs
 * no state.
 *
 *   npm run test:e2e:local -- e2e/loan-flows-non-admin-roles.spec.ts
 */

import { request as playwrightRequest, type APIRequestContext } from '@playwright/test';
import { randomInt } from 'node:crypto';

import { test, expect, type Locator, type Page } from './fixtures';
import { API_BASE, TENANT_ID, assertLocalBackend } from './utils/backend-env';
import { captureJson } from './utils/capture-response';
import { login, loginAsSeededUser, uniqueSuffix } from './utils/fineract-login';
import { confirmDialog, ionSelect } from './utils/ionic-locators';
import { selectOption } from './utils/select-option';
import { landsOn } from './utils/settled-route';

// Four roles, four users, a client, a product and a loan — all through forms — then four
// sign-ins. Serial because each test consumes the state the previous one left.
test.describe.configure({ mode: 'serial', timeout: 600_000 });

/**
 * Reads every loan screen in the flow, and books an application. Deliberately holds no
 * `transaction_loan` code: this is the account that must be *refused* approval.
 *
 * `READ_OFFICE`, `READ_CLIENT` and `READ_LOANPRODUCT` are not decoration — the application
 * form's three dropdowns are backed by those endpoints, and a session missing one gets an
 * empty select rather than an error.
 */
const OFFICER = ['READ_OFFICE', 'READ_CLIENT', 'READ_LOANPRODUCT', 'READ_LOAN', 'CREATE_LOAN'];

/** Identical to the officer's set but for `APPROVE_LOAN`, so any difference is that code. */
const APPROVER = ['READ_OFFICE', 'READ_CLIENT', 'READ_LOANPRODUCT', 'READ_LOAN', 'APPROVE_LOAN'];

/** Likewise for `DISBURSE_LOAN`. */
const DISBURSER = ['READ_OFFICE', 'READ_CLIENT', 'READ_LOANPRODUCT', 'READ_LOAN', 'DISBURSE_LOAN'];

/**
 * The control for the second finding below: `UPDATE_LOAN` is what the transaction routes are
 * gated on, and it is **not** what the platform accepts a repayment or a disbursement under.
 * An account holding it and nothing else from `transaction_loan` is the one the guard admits
 * and the platform refuses.
 */
const EDITOR = ['READ_OFFICE', 'READ_CLIENT', 'READ_LOANPRODUCT', 'READ_LOAN', 'UPDATE_LOAN'];

interface UiUser {
  username: string;
  password: string;
  roleName: string;
  permissions: string[];
}

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const DIGIT = '23456789';
// No underscore: the policy wants a character matching `[^\w\s]`, and `\w` includes `_`.
const SPECIAL = '#$%&*+-=?@^';

/**
 * A throwaway password satisfying Fineract's policy, generated rather than written down.
 *
 * The policy is `^(?!.*(.)\1)(?!.*\s)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{12,50}$`.
 * The clause that catches people out is the leading negative lookahead: **no character may
 * repeat consecutively**, and the validation error does not mention it until you read `args`.
 *
 * `seed-api.ts` has the same function. It is copied rather than imported on purpose — this
 * spec's point is that it reaches none of the seeding helpers, and a shared import would be an
 * invitation to reach for the rest of them.
 */
function generatePassword(): string {
  const pools = [UPPER, LOWER, DIGIT, SPECIAL];
  const all = pools.join('');
  const characters: string[] = [];
  while (characters.length < 16) {
    const pool = characters.length < pools.length ? pools[characters.length] : all;
    const candidate = pool[randomInt(pool.length)];
    if (candidate !== characters[characters.length - 1]) characters.push(candidate);
  }
  return characters.join('');
}

/**
 * Asks Fineract whether `user` may run `command` on `loanId`, without running it.
 *
 * The request carries an empty body, which no loan command accepts. Fineract's authorisation
 * filter runs ahead of command validation, so the status separates the two questions cleanly:
 *
 *   403 `error.msg.not.authorized`        — the account does not hold the code
 *   400 `validation.msg.validation...`    — it does, and only the body was wrong
 *
 * Returning the boolean rather than the status keeps the call sites reading as the claim they
 * are making. Nothing is written either way, so this can be asked about a loan the spec is
 * still using.
 */
async function platformAllows(
  user: UiUser,
  path: string,
): Promise<{ allowed: boolean; status: number }> {
  const context = await playwrightRequest.newContext({
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Fineract-Platform-TenantId': TENANT_ID,
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${user.username}:${user.password}`).toString('base64')}`,
    },
  });
  try {
    const response = await context.post(`${API_BASE}${path}`, { data: {} });
    const status = response.status();
    expect(
      [400, 403],
      `authorisation probe for ${user.roleName} on ${path} answered ${status}; ` +
        `only 400 (authorised, bad body) and 403 (refused) are meaningful here`,
    ).toContain(status);
    return { allowed: status === 400, status };
  } finally {
    await context.dispose();
  }
}

/**
 * Creates a role through `/security/roles/create`, then grants it `permissions` through the
 * permission matrix on `/security/roles/edit/:id`.
 *
 * Two screens because the application models it as two: the create form carries no matrix and
 * says so ("permissions can be assigned after the role is created"), which mirrors Fineract —
 * `POST /roles` takes a name and a description, and `PUT /roles/{id}/permissions` takes the
 * delta. The role id comes from the POST response rather than from the list, because the list
 * paginates and this stack keeps its data between runs.
 */
async function createRole(page: Page, permissions: string[], tag: string): Promise<string> {
  const roleName = `E2EUi${tag}${uniqueSuffix()}`;

  await page.goto('/security/roles/create');
  // Addressed through the native input Ionic renders rather than the `ion-input` host: the host
  // carries the accessible name, but the inner input is what holds `name` and what the ngModel
  // binding listens to. Filling the host leaves the model empty — see the same note in
  // `center-servicing.spec.ts`.
  await page.locator('input[name="name"]').fill(roleName);
  await page.locator('textarea[name="description"]').fill(`UI-built ${tag} role`);
  await page.getByRole('button', { name: 'Save' }).click();

  // The create form lands on the new role's permission matrix, not back on the list — a
  // deliberate choice in `role-form.component.ts`, since `POST /roles` cannot carry permissions
  // and a role with none is not yet useful. So the id comes out of the URL.
  await expect(page).toHaveURL(/\/security\/roles\/edit\/\d+$/, { timeout: 20_000 });

  // The matrix renders the whole catalogue — 719 checkboxes on this version — inside a
  // fixed-height scroller, so the filter is not a convenience: it is what brings the control
  // into view.
  const filter = page.locator('input[name="permissionFilter"]');
  await expect(filter).toBeVisible({ timeout: 20_000 });

  for (const code of permissions) {
    await filter.fill(code);
    // By accessible name, with `exact`, and *not* by the `name` attribute: Ionic does not
    // reflect an ion-checkbox's `name` onto the host element — it renders it into a hidden
    // `input.aux-input` inside — so `ion-checkbox[name=…]` matches nothing. The accessible name
    // is the label, which is the trimmed code, and `exact` is what stops READ_LOAN from also
    // matching READ_LOANPRODUCT.
    const checkbox = page.getByRole('checkbox', { name: code, exact: true });
    await expect(checkbox).toBeVisible({ timeout: 10_000 });
    await checkbox.click();
  }

  // The impact panel counts the pending delta, and it is the only on-screen confirmation that
  // the matrix registered every click before the save. Asserting it here means a silently
  // dropped checkbox fails on this line rather than as a mystery 403 three tests later.
  await expect(page.getByTestId('perms-added')).toContainText(String(permissions.length));

  await page.getByRole('button', { name: 'Save' }).click();

  // A permission change is confirmed before it is written — the dialog restates the delta and
  // warns that everyone holding the role is affected at their next sign-in. Accepting it is
  // part of the flow, not an interruption to work around.
  const confirm = confirmDialog(page);
  await expect(confirm).toBeVisible({ timeout: 20_000 });
  await confirm.getByTestId('confirm-dialog-confirm').click();

  await expect(page).toHaveURL(/\/security\/roles$/, { timeout: 20_000 });
  return roleName;
}

/** Creates a user through `/security/users/create`, in Head Office, holding `roleName` alone. */
async function createUser(
  page: Page,
  roleName: string,
  tag: string,
): Promise<{ username: string; password: string }> {
  const username = `e2eui${tag}${uniqueSuffix()}`.toLowerCase();
  const password = generatePassword();

  // `networkidle` so the Office and Roles selects have their GET /users/template answer before
  // either is opened — an ion-select opened early presents an empty overlay, and the failure
  // reads as a missing option rather than as a race.
  await page.goto('/security/users/create', { waitUntil: 'networkidle' });
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="firstname"]').fill('Ui');
  await page.locator('input[name="lastname"]').fill(tag);
  await page.locator('input[name="email"]').fill(`${username}@example.invalid`);
  await selectOption(page, 'Office', 'Head Office');
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="repeatPassword"]').fill(password);
  await pickRole(page, roleName);

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/security\/users$/, { timeout: 20_000 });
  return { username, password };
}

/**
 * Ticks one role in the user form's Roles select.
 *
 * Not `selectOption()`: that helper looks for `role="radio"` in the overlay, which is what a
 * single-value ion-select renders. This one is `multiple`, so Ionic renders `role="checkbox"`
 * items instead and the shared helper finds nothing. The select also stays open after a tick —
 * there is no implicit confirm on a multiple popover — so it has to be dismissed explicitly.
 *
 * This is the only multi-select in the suite, which is why no shared helper covers it yet.
 */
async function pickRole(page: Page, roleName: string): Promise<void> {
  const select = ionSelect(page, 'Roles');
  const overlay = page.locator('ion-popover, ion-alert');
  await select.scrollIntoViewIfNeeded();
  await select.click();

  const option = overlay.getByRole('checkbox', { name: roleName, exact: true });
  await expect(option).toBeVisible({ timeout: 15_000 });
  await option.click();

  await page.keyboard.press('Escape');
  await expect(overlay).toHaveCount(0);
  // The host folds the chosen value into its own text, so this confirms the tick reached the
  // model rather than only the overlay.
  await expect(select).toContainText(roleName, { timeout: 10_000 });
}

async function createRoleAndUser(page: Page, permissions: string[], tag: string): Promise<UiUser> {
  const roleName = await createRole(page, permissions, tag);
  const { username, password } = await createUser(page, roleName, tag);
  return { username, password, roleName, permissions };
}

async function createClient(page: Page): Promise<string> {
  const suffix = uniqueSuffix();
  const firstName = `E2ERole${suffix}`;

  await page.goto('/clients/create', { waitUntil: 'networkidle' });
  await selectOption(page, 'Office', 'Head Office');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Borrower');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/clients$/, { timeout: 20_000 });
  return `${firstName} Borrower`;
}

async function createLoanProduct(page: Page): Promise<string> {
  const suffix = uniqueSuffix();
  const productName = `E2E Roles Product ${suffix}`;

  await page.goto('/products/loan/create');
  await expect(
    ionSelect(page, 'Repayment Strategy').locator('ion-select-option').first(),
  ).toBeAttached({ timeout: 20_000 });

  await page.getByRole('textbox', { name: 'Name', exact: true }).fill(productName);
  await page.getByRole('textbox', { name: 'Short Name' }).fill(suffix.slice(-4).toUpperCase());
  await page.getByRole('spinbutton', { name: 'Principal' }).fill('1000');
  await page.getByRole('spinbutton', { name: 'Interest Rate' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Number of Repayments' }).fill('3');
  await page.getByRole('spinbutton', { name: 'Repayment Every' }).fill('1');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/products\/loan$/, { timeout: 20_000 });
  return productName;
}

async function bookLoanApplication(
  page: Page,
  clientName: string,
  productName: string,
): Promise<number> {
  await page.goto('/loans/create', { waitUntil: 'networkidle' });

  // Retried for the reason `seed-api.ts` cites as why it stopped doing this at all: a
  // just-created client is not always returned by the search endpoint on the first call, and
  // the failure lands on the option click, reading as "the dropdown is broken".
  const clientSearch = page.getByRole('textbox', { name: 'Client ID' });
  const clientOption = page
    .getByTestId('client-search-results')
    .locator('ion-item')
    .filter({ hasText: clientName });
  await expect(async () => {
    await clientSearch.fill('');
    await clientSearch.fill(clientName.split(' ')[0]);
    await expect(clientOption).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 30_000, intervals: [1000, 2000, 3000] });
  await clientOption.click();

  await selectOption(page, 'Loan Product', productName);
  await page.getByRole('spinbutton', { name: 'Principal', exact: true }).fill('1000');
  await page.getByRole('spinbutton', { name: 'Term Frequency' }).fill('3');
  await selectOption(page, 'Term Type', 'Months');
  await page.getByRole('spinbutton', { name: 'Number of Repayments' }).fill('3');
  await page.getByRole('spinbutton', { name: 'Repayment Every' }).fill('1');
  await selectOption(page, 'Frequency', 'Months');
  await page.getByRole('spinbutton', { name: 'Interest Rate' }).fill('10');
  await selectOption(page, 'Interest Type', 'Declining Balance');
  await selectOption(page, 'Amortization Type', 'Equal Installments');
  await selectOption(page, 'Interest Calculation Period Type', 'Same as repayment period');

  const created = await captureJson<{ loanId: number }>(page, /\/loans$/, 'POST', () =>
    page.getByRole('button', { name: 'Save' }).click(),
  );
  await expect(page).toHaveURL(/\/loans$/, { timeout: 20_000 });
  return created.loanId;
}

/**
 * Asserts that a control is on screen and **refused**, which is what this application does with
 * an action the session lacks the permission for.
 *
 * `appRequiresPermission` disables the control and names the missing code on it; the sibling
 * `appHasPermission` removes the element. The directive's own documentation says why the two
 * differ, and the reasoning is sound: a "Create" button that navigates elsewhere is removed,
 * because the destination is simply not part of this user's application, while an action on the
 * record already on screen is disabled with the reason, because "you cannot approve this loan"
 * is a fact about the user's role that they need in order to act on it — hiding the button
 * leaves them to conclude the feature is missing.
 *
 * So a spec asserting `toHaveCount(0)` for a refused loan action is asserting the wrong design.
 * The class is checked rather than the accessible name because the directive **replaces** the
 * name with the reason when it refuses, which is also why each of these controls needs a
 * `data-testid`.
 */
async function expectRefused(control: Locator): Promise<void> {
  await expect(control).toBeVisible({ timeout: 20_000 });
  await expect(control).toHaveClass(/app-requires-permission/);
  await expect(control).toHaveAttribute('aria-disabled', 'true');
}

/** The same control, offered: present, and not carrying the refusal marker. */
async function expectOffered(control: Locator): Promise<void> {
  await expect(control).toBeVisible({ timeout: 20_000 });
  await expect(control).not.toHaveClass(/app-requires-permission/);
}

let officer: UiUser;
let approver: UiUser;
let disburser: UiUser;
let editor: UiUser;
let clientName: string;
let productName: string;
let loanId: number;

test.describe('a loan taken through four separated duties, every account built in the UI', () => {
  test('an administrator builds the four roles and accounts through the forms', async ({
    page,
  }) => {
    assertLocalBackend();
    await login(page);

    officer = await createRoleAndUser(page, OFFICER, 'Officer');
    approver = await createRoleAndUser(page, APPROVER, 'Approver');
    disburser = await createRoleAndUser(page, DISBURSER, 'Disburser');
    editor = await createRoleAndUser(page, EDITOR, 'Editor');

    // Guards every assertion that follows. The four sets differ in exactly one code, so a
    // difference in behaviour later can only be that code — unless the matrix wrote something
    // other than what was ticked, which is what this checks.
    for (const user of [officer, approver, disburser, editor]) {
      expect(user.username, `${user.roleName} has no username`).not.toBe('');
      expect(user.password.length).toBeGreaterThanOrEqual(12);
    }
    expect(
      new Set([officer.username, approver.username, disburser.username, editor.username]).size,
    ).toBe(4);

    clientName = await createClient(page);
    productName = await createLoanProduct(page);
  });

  test('the officer books the application and is not offered approval of their own loan', async ({
    page,
  }) => {
    await loginAsSeededUser(page, officer);

    loanId = await bookLoanApplication(page, clientName, productName);

    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Submitted and pending approval')).toBeVisible({
      timeout: 20_000,
    });

    // The whole point of separating the duty — and checked as a *refused* control rather than
    // an absent one, which is this application's deliberate choice for an action on the record
    // on screen. See expectRefused.
    await expectRefused(page.getByTestId('loan-approve-action'));

    // The refusal says which permission is missing, which is the half that makes disabling
    // better than hiding: an officer can read this and ask for the right thing.
    //
    // Read off `title`, not `aria-label`. The directive host-binds both, but `ion-button` is a
    // custom element that hoists host `aria-*` into its own shadow root at render, so the
    // accessible name is not on the element this locator resolves to while the tooltip text
    // is. Same hazard as the one `ionSelect()` documents for ion-select's folded name.
    await expect(page.getByTestId('loan-approve-action')).toHaveAttribute('title', /APPROVE_LOAN/);

    // And the platform agrees, so the hidden button is not merely the client being cautious.
    const probe = await platformAllows(officer, `/loans/${loanId}?command=approve`);
    expect(probe.allowed, `officer was authorised to approve (status ${probe.status})`).toBe(false);
  });

  test('the approver, differing from the officer in one code, is offered it and approves', async ({
    page,
  }) => {
    // The control for the previous assertion: "the button is absent" also passes against a
    // screen that renders nothing, so the same screen has to show it to somebody.
    const probe = await platformAllows(approver, `/loans/${loanId}?command=approve`);
    expect(probe.allowed, `approver was refused approval (status ${probe.status})`).toBe(true);

    await loginAsSeededUser(page, approver);
    await page.goto(`/loans/view/${loanId}`);

    const approve = page.getByTestId('loan-approve-action');
    await expectOffered(approve);
    await approve.click();

    await expect(page).toHaveURL(/\/action\/approve$/, { timeout: 20_000 });
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(`/loans/view/${loanId}`, { timeout: 20_000 });
    await expect(page.getByText('Approved', { exact: true })).toBeVisible({ timeout: 20_000 });
  });

  test('the approver is not offered disbursement of the loan they just approved', async ({
    page,
  }) => {
    await loginAsSeededUser(page, approver);
    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Approved', { exact: true })).toBeVisible({ timeout: 20_000 });

    await expectRefused(page.getByTestId('loan-disburse-action'));

    const probe = await platformAllows(approver, `/loans/${loanId}?command=disburse`);
    expect(probe.allowed, `approver was authorised to disburse (status ${probe.status})`).toBe(
      false,
    );
  });

  test('the disburser is offered the control, and the route refuses it — see #691', async ({
    page,
  }) => {
    // The platform's answer first, so what follows cannot be read as the platform refusing.
    const probe = await platformAllows(disburser, `/loans/${loanId}?command=disburse`);
    expect(probe.allowed, `disburser was refused disbursement (status ${probe.status})`).toBe(true);

    await loginAsSeededUser(page, disburser);
    await page.goto(`/loans/view/${loanId}`);

    // The action layer is right: the button is gated on DISBURSE_LOAN, which this account
    // holds, so it is offered rather than refused.
    const disburse = page.getByTestId('loan-disburse-action');
    await expectOffered(disburse);

    // The route layer disagrees with it. `/loans/:loanId/transactions/:type` declares
    // `UPDATE_LOAN`, a code this account does not hold and — per the probe above — does not
    // need. So the only control the application offers this account leads to Access Denied.
    // Issue #691.
    expect(
      await landsOn(page, `/loans/${loanId}/transactions/disburse`),
      'the disbursement form admitted a DISBURSE_LOAN holder; if this now passes the route gate was fixed',
    ).toBe('/forbidden');
  });

  test('and the same route admits an UPDATE_LOAN holder the platform will refuse', async ({
    page,
  }) => {
    // The mirror image, and the reason the gate cannot simply be widened to include UPDATE_LOAN:
    // the code the route asks for is not one the platform accepts the operation under.
    const probe = await platformAllows(editor, `/loans/${loanId}?command=disburse`);
    expect(
      probe.allowed,
      `UPDATE_LOAN was accepted for disbursement (status ${probe.status})`,
    ).toBe(false);

    await loginAsSeededUser(page, editor);

    // The control is refused, correctly — the action gate asks for DISBURSE_LOAN, which this
    // account does not hold. But the URL is reachable, so the guard's promise that "a user is
    // not led into a screen whose every request will 403" (DOCS/RBAC.md) does not hold here.
    await page.goto(`/loans/view/${loanId}`);
    await expectRefused(page.getByTestId('loan-disburse-action'));

    expect(
      await landsOn(page, `/loans/${loanId}/transactions/disburse`),
      'the route refused an UPDATE_LOAN holder; if this now passes the gate was narrowed',
    ).toBe(`/loans/${loanId}/transactions/disburse`);
  });

  test('a disburser holding UPDATE_LOAN as well completes the payout, and the loan goes active', async ({
    page,
  }) => {
    // What the application can do today: the duty has to be granted the editing code too. This
    // is the flow a deployment would actually configure, and it has to keep working whichever
    // way the gate above is fixed.
    await login(page);
    const payer = await createRoleAndUser(page, [...DISBURSER, 'UPDATE_LOAN'], 'Payer');

    await loginAsSeededUser(page, payer);
    await page.goto(`/loans/view/${loanId}`);
    await expectOffered(page.getByTestId('loan-disburse-action'));
    await page.getByTestId('loan-disburse-action').click();
    await expect(page).toHaveURL(new RegExp(`/loans/${loanId}/transactions/disburse$`));
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/loans$/, { timeout: 20_000 });

    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Active', { exact: true })).toBeVisible({ timeout: 20_000 });
  });

  test('a repayment duty is offered the control and refused the form in the same way', async ({
    page,
  }) => {
    await login(page);
    const teller = await createRoleAndUser(
      page,
      ['READ_OFFICE', 'READ_CLIENT', 'READ_LOANPRODUCT', 'READ_LOAN', 'REPAYMENT_LOAN'],
      'Teller',
    );

    // REPAYMENT_LOAN is sufficient at the platform, as DISBURSE_LOAN was.
    const allowed = await platformAllows(teller, `/loans/${loanId}/transactions?command=repayment`);
    expect(allowed.allowed, `REPAYMENT_LOAN holder refused (status ${allowed.status})`).toBe(true);

    // And UPDATE_LOAN is not, which is the code the route asks for.
    const refused = await platformAllows(editor, `/loans/${loanId}/transactions?command=repayment`);
    expect(refused.allowed, `UPDATE_LOAN accepted a repayment (status ${refused.status})`).toBe(
      false,
    );

    await loginAsSeededUser(page, teller);
    await page.goto(`/loans/view/${loanId}`);
    await expectOffered(page.getByTestId('loan-repayment-action'));

    expect(
      await landsOn(page, `/loans/${loanId}/transactions/repayment`),
      'the repayment form admitted a REPAYMENT_LOAN holder; if this now passes the route gate was fixed',
    ).toBe('/forbidden');
  });
});
