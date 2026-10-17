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
 * Charge servicing through the UI, against a running Fineract (issue #754).
 *
 * The acceptance criterion names two flows — a loan charge waived and a savings charge paid —
 * and they are here for the same reason the Working Capital servicing spec exists: the unit
 * tests assert what the component *sends*, which cannot tell whether the platform accepts it.
 * Three of these commands take three different bodies on what looks like one endpoint, and the
 * spellings are the platform's rather than anything derivable (`pay` for a loan charge,
 * `paycharge` for a savings one), so a mocked test agreeing with itself proves little.
 *
 * Each test reads the result back through the API rather than off the screen. What matters is
 * that the charge was actually waived or paid in the ledger, not that a toast appeared.
 */

import { test, expect } from './fixtures';
import type { APIRequestContext, Page } from '@playwright/test';
import { login } from './utils/fineract-login';
import {
  API_BASE,
  attachLoanCharge,
  attachSavingsCharge,
  createApiContext,
  loanCharges,
  loanTransactions,
  savingsCharges,
  seedActiveLoan,
  seedLoanCharge,
  seedSavingsAccountWithTransactions,
  seedRecurringSavingsCharge,
  seedSavingsCharge,
} from './utils/seed-api';

test.describe.configure({ mode: 'serial', timeout: 240_000 });

/** Confirms whatever dialog is open, filling nothing. */
async function confirmDialog(page: Page): Promise<void> {
  await page.locator('[data-testid="confirm-dialog-confirm"]').click();
}

/**
 * Fills one field of the prompt dialog.
 *
 * The inner `input` rather than the `ion-input`: Ionic's web component is a wrapper, and
 * `fill` on the host does not reach the value the form binding reads.
 */
async function fillDialogField(page: Page, name: string, value: string): Promise<void> {
  await page.locator(`[data-testid="dialog-field-${name}"] input`).fill(value);
}

test.describe('loan charge servicing', () => {
  let api: APIRequestContext;

  test.beforeAll(async () => {
    api = await createApiContext();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('waives a loan charge, and the platform records the waiver', async ({ page }) => {
    const loan = await seedActiveLoan(api, 'E2EChargeWaive');
    const charge = await seedLoanCharge(api, 'E2EChargeWaive', 30);
    await attachLoanCharge(api, loan.loanId, charge.chargeId, 30);

    await login(page);
    await page.goto(`/loans/${loan.loanId}/charges`);

    await page.locator('[data-testid="loan-charge-waive"]').first().click();
    await confirmDialog(page);

    // Read back rather than trusting the screen: a waiver that only produced a toast is the
    // failure this spec exists to catch.
    await expect
      .poll(async () => {
        const [row] = await loanCharges(api, loan.loanId);
        return row?.amountWaived ?? 0;
      })
      .toBe(30);

    const [row] = await loanCharges(api, loan.loanId);
    expect(row.amountOutstanding ?? 0).toBe(0);
  });

  /**
   * Reversing a waiver, which the platform cannot do.
   *
   * Issue #754 asks for it, and `PUT /loans/{loanId}/transactions/{transactionId}` is the
   * endpoint for it — the API document titles that operation "Undo a Waive Charge Transaction".
   * It answers 500 on every call. Measured with an empty body, with the ids in the body, with a
   * transaction date and amount, and with each of `?command=undo`, `?command=waive` and
   * `?command=undoWaiveCharge`; the platform log shows
   * `java.util.NoSuchElementException: No value present`, an `Optional.get()` on an empty
   * optional, so nothing reaches a business rule.
   *
   * So this asserts the defect rather than the feature. The UI keeps the adapter method, the
   * dialog control and the gate on `UNDO_WAIVECHARGE`, and hides the button behind
   * `UNDO_WAIVE_CHARGE_AVAILABLE` in `loan-view.component.ts`. When this test starts failing,
   * the platform has been fixed and that constant is the one line to flip.
   */
  test('cannot reverse a waiver: the platform answers 500, not a business rule', async () => {
    const loan = await seedActiveLoan(api, 'E2EChargeUndo');
    const charge = await seedLoanCharge(api, 'E2EChargeUndo', 40);
    const loanChargeId = await attachLoanCharge(api, loan.loanId, charge.chargeId, 40);

    await api.post(`${API_BASE}/loans/${loan.loanId}/charges/${loanChargeId}?command=waive`, {
      data: {},
    });

    const waiver = (await loanTransactions(api, loan.loanId)).find(
      (tx) => (tx.type as { waiveCharges?: boolean } | undefined)?.waiveCharges === true,
    );
    expect(waiver, 'the waiver produced a waiveCharges transaction').toBeDefined();

    const response = await api.put(`${API_BASE}/loans/${loan.loanId}/transactions/${waiver!.id}`, {
      data: {},
    });

    expect(response.status(), 'undo waive charge').toBe(500);

    // And the waiver still stands, which is why the control is not offered: a user who clicked
    // it would get an error toast and an unchanged charge every time.
    const [row] = await loanCharges(api, loan.loanId);
    expect(row.amountWaived).toBe(40);
    expect(row.amountOutstanding).toBe(0);
  });

  /**
   * Paying a loan charge, which the platform allows only in one payment mode.
   *
   * `POST /loans/{id}/charges/{chargeId}?command=pay` answers 403
   * `validation.msg.domain.rule.violation` — "This loan charge cannot be paid as the charge
   * payment mode is not account transfer" — for a charge in the regular mode, which is the
   * default and so most charges. The charge payload carries the platform's own answer as
   * `chargePayable`, a field the generated response type does not declare (#653).
   *
   * So the screen gates Pay on that flag rather than on the outstanding amount, and this test
   * pins both halves: the platform's refusal, and the absence of a button that would only reach
   * it. Waive and Adjustment are not narrowed this way and stay on the same row.
   */
  test('offers no Pay on a charge the platform will not let be paid', async ({ page }) => {
    const loan = await seedActiveLoan(api, 'E2EChargePay');
    const charge = await seedLoanCharge(api, 'E2EChargePay', 20);
    const loanChargeId = await attachLoanCharge(api, loan.loanId, charge.chargeId, 20);

    const [row] = await loanCharges(api, loan.loanId);
    expect(
      (row as { chargePayable?: boolean }).chargePayable,
      'a regular-mode charge is not payable',
    ).toBe(false);

    const refused = await api.post(
      `${API_BASE}/loans/${loan.loanId}/charges/${loanChargeId}?command=pay`,
      { data: { transactionDate: '2026-10-17', dateFormat: 'yyyy-MM-dd', locale: 'en' } },
    );
    expect(refused.status(), 'pay on a regular-mode charge').toBe(403);

    await login(page);
    await page.goto(`/loans/${loan.loanId}/charges`);

    // Waive is present, so the row rendered and the negative assertion below means something.
    await expect(page.locator('[data-testid="loan-charge-waive"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="loan-charge-pay"]')).toHaveCount(0);
  });

  test('adjusts a loan charge to a smaller amount', async ({ page }) => {
    const loan = await seedActiveLoan(api, 'E2EChargeAdjust');
    const charge = await seedLoanCharge(api, 'E2EChargeAdjust', 50);
    await attachLoanCharge(api, loan.loanId, charge.chargeId, 50);

    await login(page);
    await page.goto(`/loans/${loan.loanId}/charges`);

    await page.locator('[data-testid="loan-charge-adjust"]').first().click();
    await fillDialogField(page, 'amount', '15');
    await confirmDialog(page);

    // An adjustment posts a charge-adjustment transaction against the loan; the charge itself
    // keeps its amount. The transaction is what to read.
    await expect
      .poll(async () => {
        const transactions = await loanTransactions(api, loan.loanId);
        return transactions.some(
          (tx) => (tx.type as { chargeAdjustment?: boolean } | undefined)?.chargeAdjustment,
        );
      })
      .toBe(true);
  });
});

test.describe('savings charge servicing', () => {
  let api: APIRequestContext;

  test.beforeAll(async () => {
    api = await createApiContext();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('pays a savings charge with the amount and due date the platform demands', async ({
    page,
  }) => {
    const account = await seedSavingsAccountWithTransactions(api, 'E2ESavingsChargePay');
    const charge = await seedSavingsCharge(api, 'E2ESavingsChargePay', 20);
    await attachSavingsCharge(api, account.savingsId, charge.chargeId, 20);

    await login(page);
    await page.goto(`/products/savings-accounts/${account.savingsId}/charges`);

    await page.locator('[data-testid="savings-charge-pay"]').first().click();
    await confirmDialog(page);

    await expect
      .poll(async () => {
        const rows = await savingsCharges(api, account.savingsId);
        return (rows[0]?.['amountPaid'] as number | undefined) ?? 0;
      })
      .toBe(20);
  });

  /**
   * The active flag the charge payload carries, and the Inactivate action that reads it.
   *
   * `GetSavingsAccountsSavingsAccountIdChargesResponse` does not declare `isActive`, and the
   * payload sends it — issue #653. That matters because Inactivate is the one action here with
   * no amount to check: without the flag the row cannot tell an active charge from one already
   * inactivated, and the component would have to offer the action on every row and let the
   * platform refuse half of them.
   *
   * Pinned on the wire rather than taken on trust, because the component's gate depends on it.
   */
  test('carries an active flag, which is what gates Inactivate', async ({ page }) => {
    // A recurring charge, because inactivation is refused for anything else with
    // `charge.inactivation.allowed.only.for.recurring.charges` — the second half of the gate.
    const account = await seedSavingsAccountWithTransactions(api, 'E2ESavingsChargeShape');
    const charge = await seedRecurringSavingsCharge(api, 'E2ESavingsChargeShape', 12);
    await attachSavingsCharge(api, account.savingsId, charge.chargeId, 12);

    const [row] = await savingsCharges(api, account.savingsId);
    expect(row, 'the attached charge is listed').toBeDefined();
    expect(row['isActive'], 'a newly attached charge is active').toBe(true);

    await login(page);
    await page.goto(`/products/savings-accounts/${account.savingsId}/charges`);

    await page.locator('[data-testid="savings-charge-inactivate"]').first().click();
    await confirmDialog(page);

    await expect
      .poll(async () => {
        const rows = await savingsCharges(api, account.savingsId);
        return rows[0]?.['isActive'];
      })
      .toBe(false);

    // And the action withdraws itself, rather than staying on a row that can only be refused.
    await page.reload();
    await expect(page.locator('[data-testid="savings-charge-inactivate"]')).toHaveCount(0);
  });
});
