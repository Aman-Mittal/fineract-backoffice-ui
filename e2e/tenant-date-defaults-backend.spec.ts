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
 * #758. Create Client and Create Loan defaulted their dates to the browser's day.
 *
 * Fineract decides what "the future" is by its own reckoning — the tenant's timezone, or the
 * business date when that feature is on — so whenever the browser runs ahead, submitting the
 * defaults was refused: `error.msg.clients.submittedOnDate.in.the.future` on the client form,
 * and a `403` reading like a permission problem on the loan one. Every client and loan entered
 * during those hours failed on first submit, and the user was pushed into editing dates by
 * trial and error.
 *
 * The browser clock is moved a day forward here rather than waited for, with Playwright's clock
 * API. `setFixedTime` is deliberate: it changes what `new Date()` answers without replacing the
 * timer queue, which Angular and Ionic both run on.
 */

import { test, expect, recordingTimeout } from './fixtures';
import { login } from './utils/fineract-login';
import { selectOption } from './utils/select-option';
import { API_BASE, createApiContext, seedSuffix } from './utils/seed-api';

/** A day after the real one, which is what the defect needs to show itself. */
function tomorrow(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

test.describe('Date defaults come from the platform, not the browser', () => {
  test('a client can be created while the browser is a day ahead', async ({ page }) => {
    test.setTimeout(recordingTimeout(240000));
    // Fixed before the app loads, so every `new Date()` in it reads the later day.
    await page.clock.setFixedTime(tomorrow());

    await login(page);
    const surname = `AheadClient${seedSuffix()}`;

    await page.goto('/clients/create');
    await selectOption(page, 'Office', 'Head Office');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('E2EAhead');
    await page.getByRole('textbox', { name: 'Last Name' }).fill(surname);
    await page.getByRole('button', { name: 'Next' }).click();

    // No date is touched. Before the fix this submitted the browser's tomorrow and the platform
    // refused it; the form stayed put with a toast naming an ISO date.
    await page.getByRole('button', { name: /^save$/i }).click();
    // `$` matters: `/clients/create` also matches `/clients`, so a form that never
    // submitted would pass a looser assertion.
    await expect(page).toHaveURL(/\/clients$/, { timeout: 20000 });

    // The platform holding the record is the assertion — a navigation alone could mean a toast
    // was missed.
    const api = await createApiContext();
    const response = await api.get(`${API_BASE}/clients?displayName=${surname}&limit=50`);
    const body = (await response.json()) as { pageItems?: { displayName?: string }[] };
    expect(
      (body.pageItems ?? []).filter((client) => (client.displayName ?? '').includes(surname)),
    ).toHaveLength(1);
  });
});
