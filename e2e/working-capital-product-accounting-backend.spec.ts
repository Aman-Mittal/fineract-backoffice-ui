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
 * Working Capital product accounting, through the form and against a real Fineract.
 *
 * Issue #775: the form set `accountingRule` and no GL accounts, so a product saved with the
 * posting rule could not post anything. Three claims in that fix are only checkable against the
 * platform, and all three are checked here:
 *
 *  - the rule has to be sent as its **name** (`ACC_DEF_REV_AM`), not the dotted
 *    `wcAccountingRuleType.*` code the template also carries. The form used to send the code, and
 *    the platform answers
 *    `validation.msg.workingcapitalloanproduct.accountingRule.is.not.one.of.expected.enumerations`
 *    — so every product saved after touching that select was refused;
 *  - the twelve slots the rule demands are the twelve the form marks required, and a product
 *    carrying them is accepted;
 *  - what a configured product reads back under is *not* what it was written with — the response
 *    drops the `Id` suffix and renames both reason tables' reason key — so the prefill is the
 *    part most likely to be silently wrong, and an edit that re-saves must not blank anything.
 */

import { test, expect } from './fixtures';
import type { APIRequestContext, Page } from '@playwright/test';
import { login } from './utils/fineract-login';
import {
  createApiContext,
  seedGlAccountsForProductAccounting,
  seedLossReasonCodeValues,
  seedWorkingCapitalAccrualProduct,
  seedWorkingCapitalLoanProduct,
  workingCapitalProduct,
  SeededGlAccounts,
} from './utils/seed-api';

test.describe.configure({ mode: 'serial', timeout: 240_000 });

let api: APIRequestContext;
let accounts: SeededGlAccounts;
let reasons: { chargeOffReasonId: number; writeOffReasonId: number };

test.beforeAll(async () => {
  api = await createApiContext();
  accounts = await seedGlAccountsForProductAccounting(api);
  reasons = await seedLossReasonCodeValues(api);
});

test.afterAll(async () => {
  await api.dispose();
});

/** The twelve slots the platform demands under the posting rule, in the order it names them. */
const MANDATORY_SLOTS = [
  'fundSourceAccountId',
  'loanPortfolioAccountId',
  'transfersInSuspenseAccountId',
  'receivableFeeAccountId',
  'receivablePenaltyAccountId',
  'deferredIncomeLiabilityAccountId',
  'overpaymentLiabilityAccountId',
  'incomeFromDiscountFeeAccountId',
  'incomeFromFeeAccountId',
  'incomeFromPenaltyAccountId',
  'incomeFromRecoveryAccountId',
  'writeOffAccountId',
] as const;

/**
 * Picks the first account a slot offers.
 *
 * By test id rather than by label: the slots are keyed by their request key, which is what the
 * assertion below reads back, and two slots share a label in no family but could.
 */
async function pickFirstAccount(page: Page, slot: string): Promise<void> {
  const select = page.locator(`[data-testid="accounting-${slot}"]`);
  await select.scrollIntoViewIfNeeded();
  const overlay = page.locator('ion-popover, ion-alert');
  await page.keyboard.press('Escape');
  await expect(overlay).toHaveCount(0);
  await select.click();
  const option = overlay.getByRole('radio').first();
  await expect(option).toBeVisible();
  await option.click();
  await expect(overlay).toHaveCount(0);
}

test.describe('Working Capital product accounting, on the platform', () => {
  test('configures the accrual rule and its twelve accounts, and the platform accepts it', async ({
    page,
  }) => {
    // A product with no accounting, so every mapping below is one the form sent.
    const productId = await seedWorkingCapitalLoanProduct(api, 'E2EWcPlain');
    await login(page);
    await page.goto(`/working-capital/loan-products/edit/${productId}`);
    await expect(page.locator('[data-testid="wc-product-name"]')).toBeVisible();

    // The rule select offers the platform's own labels; this is the one that posts.
    const ruleSelect = page.locator('[data-testid="product-accounting-rule"]');
    await ruleSelect.scrollIntoViewIfNeeded();
    await ruleSelect.click();
    await page
      .locator('ion-popover, ion-alert')
      .getByRole('radio', { name: 'Accrual with deferred revenue amortization' })
      .click();

    for (const slot of MANDATORY_SLOTS) {
      await pickFirstAccount(page, slot);
    }

    await page.locator('[data-testid="wc-product-submit-btn"]').click();
    await expect(page).toHaveURL('/working-capital/loan-products');

    const product = await workingCapitalProduct(api, productId);
    expect(product.accountingRule?.id).toBe('ACC_DEF_REV_AM');
    // Each slot reads back under its key without the `Id` suffix, which is the shape the
    // prefill depends on.
    for (const slot of MANDATORY_SLOTS) {
      const responseKey = slot.replace(/Id$/, '');
      expect(
        product.accountingMappings?.[responseKey]?.id,
        `${slot} was not saved`,
      ).toBeGreaterThan(0);
    }
  });

  test('prefills a configured product and re-saves it without blanking anything', async ({
    page,
  }) => {
    const productId = await seedWorkingCapitalAccrualProduct(api, accounts, reasons);
    const before = await workingCapitalProduct(api, productId);

    await login(page);
    await page.goto(`/working-capital/loan-products/edit/${productId}`);
    await expect(page.locator('[data-testid="wc-product-name"]')).toBeVisible();

    // The fund source shows the account it was configured with, read back under a different key
    // than it was written with.
    const fundSource = page.locator('[data-testid="accounting-fundSourceAccountId"]');
    await expect(fundSource).toContainText(
      before.accountingMappings?.['fundSourceAccount']?.name ?? 'never',
    );

    // Nothing is changed but the name, so a re-save is the test: a form that read the response
    // wrongly would post the product with its accounting stripped.
    await page.locator('[data-testid="wc-product-name"] input').fill(`${before.name} edited`);
    await page.locator('[data-testid="wc-product-submit-btn"]').click();
    await expect(page).toHaveURL('/working-capital/loan-products');

    const after = await workingCapitalProduct(api, productId);
    expect(after.name).toContain('edited');
    expect(after.accountingRule?.id).toBe('ACC_DEF_REV_AM');
    for (const slot of MANDATORY_SLOTS) {
      const responseKey = slot.replace(/Id$/, '');
      expect(after.accountingMappings?.[responseKey]?.id, `${slot} was lost on save`).toBe(
        before.accountingMappings?.[responseKey]?.id,
      );
    }
    // Both reason tables survive, including the one whose request key differs from its response
    // key in a way no field name hints at.
    expect(after.chargeOffReasonToExpenseAccountMappings?.[0]?.reasonCodeValue?.id).toBe(
      reasons.chargeOffReasonId,
    );
    expect(after.writeOffReasonsToExpenseMappings?.[0]?.reasonCodeValue?.id).toBe(
      reasons.writeOffReasonId,
    );
    // And so does the allocation, over all six rules the platform requires.
    expect(after.paymentAllocation?.[0]?.paymentAllocationOrder).toHaveLength(6);
  });
});
