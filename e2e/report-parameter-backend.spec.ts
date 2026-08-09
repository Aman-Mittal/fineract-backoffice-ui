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
 * Proves dynamic report parameters against a real Fineract instance.
 *
 * Client Listing scopes its rows by Office. Head Office includes descendants, while a branch
 * includes only that branch. Two seeded clients therefore make the selected parameter observable
 * in the returned row set. A test that only checked that a table rendered would miss the original
 * bug, where the UI silently omitted a declared parameter and Fineract returned the wrong scope.
 */

import { test, expect } from './fixtures';
import { login } from './utils/fineract-login';
import { ionSelect } from './utils/ionic-locators';
import { selectOption } from './utils/select-option';
import { createApiContext, seedClient, seedOffice } from './utils/seed-api';

const REPORT_NAME = 'Client Listing';
const CASCADING_REPORT_NAME = 'Active Loans - Summary';
const HEAD_OFFICE = 'Head Office';

test.describe('Dynamic report parameters against Fineract', () => {
  test('keeps the parameter form available when a report has cascading lookups', async ({
    page,
  }) => {
    await login(page);
    await page.goto(`/reporting/run/${encodeURIComponent(CASCADING_REPORT_NAME)}?type=Table`);

    await expect(page.locator('ion-card-title')).toContainText(CASCADING_REPORT_NAME);
    await expect(page.getByTestId('report-parameters-error')).toHaveCount(0);
    await expect(page.getByTestId('report-parameter-officeId')).toBeVisible();
    await expect(page.getByTestId('report-parameter-loanOfficerId')).toBeVisible();
  });

  test('changing Office changes the Client Listing row set', async ({ page }) => {
    const api = await createApiContext();
    const branch = await seedOffice(api, 'E2EReportParameters');
    const headOfficeClient = await seedClient(api, 'E2EReportHead');
    const branchClient = await seedClient(api, 'E2EReportBranch', branch.officeId);
    await api.dispose();

    await login(page);
    await page.goto(`/reporting/run/${encodeURIComponent(REPORT_NAME)}?type=Table`);
    await expect(page.locator('ion-card-title')).toContainText(REPORT_NAME);

    const runForOffice = async (
      officeName: string,
      expectedClientName: string,
      optionName: string | RegExp = officeName,
    ): Promise<string[]> => {
      if (typeof optionName === 'string') {
        await selectOption(page, 'Office', optionName);
      } else {
        await ionSelect(page, 'Office').click();
        await page
          .locator('ion-alert, ion-popover, ion-action-sheet')
          .getByRole('radio', { name: optionName })
          .click();
      }
      const reportResponse = page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          url.pathname.endsWith(`/runreports/${encodeURIComponent(REPORT_NAME)}`) &&
          url.searchParams.get('exportCSV') === 'false' &&
          response.ok()
        );
      });
      await page.getByTestId('run-report').click();
      await reportResponse;
      const rows = page.locator('table tbody tr');
      await expect(rows.first()).toBeVisible({ timeout: 20000 });
      await expect(page.locator('table')).toContainText(expectedClientName);
      const pageSize = page.getByTestId('paginator-page-size');
      if ((await pageSize.evaluate((select: HTMLIonSelectElement) => select.value)) !== 100) {
        await pageSize.click();
        await page.locator('ion-popover').getByRole('radio', { name: '100' }).click();
      }
      return rows.allTextContents();
    };

    const headOfficeRows = await runForOffice(HEAD_OFFICE, headOfficeClient.displayName);
    // Fineract indents descendant office labels with dots. Match the seeded office name at the
    // end so this proof is independent of its depth in the office hierarchy.
    const escapedBranchName = branch.officeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const branchRows = await runForOffice(
      branch.officeName,
      branchClient.displayName,
      new RegExp(`${escapedBranchName}$`),
    );

    expect(headOfficeRows.join(' ')).toContain(headOfficeClient.displayName);
    expect(branchRows.join(' ')).toContain(branchClient.displayName);
    expect(branchRows.join(' ')).not.toContain(headOfficeClient.displayName);
    expect(branchRows).not.toEqual(headOfficeRows);
  });
});
