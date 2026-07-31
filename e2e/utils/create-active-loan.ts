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
import { createApiContext, seedActiveLoan } from './seed-api';

/**
 * Seeds a client, a Cumulative loan product and an approved+disbursed loan, then
 * opens the resulting Active loan account — the starting point for specs that
 * exercise servicing actions (repayment, notes, adjustments, write-off).
 *
 * This used to build all three through the UI, which meant a specs asserting on
 * a write-off dialog could fail inside the client form instead. The
 * client-search dropdown was the recurring offender: a freshly created client is
 * not reliably returned by the search endpoint, so `#client-search-results`
 * stayed empty until the test timed out.
 *
 * The forms themselves still have direct coverage — loan-lifecycle.spec.ts walks
 * creation, approval and disbursement through the UI on purpose. There is no
 * value in re-walking them as setup for an unrelated assertion.
 */
export async function createActiveLoan(
  page: Page,
  namePrefix = 'E2EDemo',
): Promise<{ loanId: number; firstName: string }> {
  const api = await createApiContext();
  try {
    const { loanId, firstName } = await seedActiveLoan(api, namePrefix);

    await page.goto(`/loans/view/${loanId}`);
    await expect(page.getByText('Active', { exact: true })).toBeVisible({ timeout: 15000 });

    return { loanId, firstName };
  } finally {
    await api.dispose();
  }
}
