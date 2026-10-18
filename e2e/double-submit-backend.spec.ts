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
 * #756. One double-click posted two repayments.
 *
 * Measured on a running Fineract: `POST /loans/{id}/transactions?command=repayment` twice, both
 * `200`, two transactions of the same amount, and the borrower's balance reduced by double what
 * they paid. Create Client made two clients the same way. The forms' `isSaving` flag is bound to
 * `[disabled]`, which the second click of a double-click beats to the DOM.
 *
 * These run against the real platform because the assertion that matters is not "one request
 * left the browser" but "the money moved once" — the first is how the UI behaves, the second is
 * what the borrower's statement says.
 */

import { test, expect, Page, recordingTimeout } from './fixtures';
import { login } from './utils/fineract-login';
import { selectOption } from './utils/select-option';
import {
  API_BASE,
  createApiContext,
  loanTransactions,
  seedActiveLoan,
  seedSuffix,
} from './utils/seed-api';

/** Counts the requests the page issues to a command endpoint while a block runs. */
async function countingPosts(
  page: Page,
  pattern: RegExp,
  action: () => Promise<void>,
): Promise<number> {
  const seen: string[] = [];
  const listener = (request: { method: () => string; url: () => string }): void => {
    if (request.method() === 'POST' && pattern.test(request.url())) seen.push(request.url());
  };
  page.on('request', listener);
  try {
    await action();
  } finally {
    page.off('request', listener);
  }
  return seen.length;
}

test.describe('A double-click submits once', () => {
  test('a repayment is recorded once, not twice', async ({ page }) => {
    test.setTimeout(recordingTimeout(240000));
    const api = await createApiContext();
    const loan = await seedActiveLoan(api, 'E2EDouble');

    await login(page);
    await page.goto(`/loans/${loan.loanId}/transactions/repayment`);

    // The transaction date prefills from the loan template, and renders behind an
    // ion-datetime-button with no native input — only the amount needs setting.
    const amount = page.locator('input[name="transactionAmount"]');
    await expect(amount).toBeVisible({ timeout: 20000 });
    await amount.fill('100');

    const posts = await countingPosts(
      page,
      /\/loans\/\d+\/transactions\?command=repayment/,
      async () => {
        // One double-click, as a cashier makes it — not two deliberate submissions.
        await page.getByRole('button', { name: /^save$/i }).dblclick();
        await expect(page).toHaveURL(/\/loans$/, { timeout: 20000 });
      },
    );

    expect(posts).toBe(1);

    // And the platform agrees: one repayment of 100, not two.
    const transactions = await loanTransactions(api, loan.loanId);
    const hundreds = transactions.filter(
      (transaction) => transaction.amount === 100 && transaction.manuallyReversed !== true,
    );
    expect(hundreds).toHaveLength(1);
  });

  test('a client is created once, not twice', async ({ page }) => {
    test.setTimeout(recordingTimeout(240000));
    const api = await createApiContext();
    const surname = `Double${seedSuffix()}`;

    await login(page);
    // The form is a three-step wizard: office, then the name, then review.
    await page.goto('/clients/create');
    await selectOption(page, 'Office', 'Head Office');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('E2EDbl');
    await page.getByRole('textbox', { name: 'Last Name' }).fill(surname);
    await page.getByRole('button', { name: 'Next' }).click();

    const posts = await countingPosts(page, /\/clients(\?|$)/, async () => {
      await page.getByRole('button', { name: /^save$/i }).dblclick();
      // `$` matters: `/clients/create` also matches `/clients`, so a form that never
      // submitted would pass a looser assertion.
      await expect(page).toHaveURL(/\/clients$/, { timeout: 20000 });
    });

    expect(posts).toBe(1);

    // Duplicate clients break KYC uniqueness, so the platform side is asserted too.
    const response = await api.get(`${API_BASE}/clients?displayName=${surname}&limit=50`);
    const body = (await response.json()) as { pageItems?: { displayName?: string }[] };
    const matches = (body.pageItems ?? []).filter((client) =>
      (client.displayName ?? '').includes(surname),
    );
    expect(matches).toHaveLength(1);
  });
});
