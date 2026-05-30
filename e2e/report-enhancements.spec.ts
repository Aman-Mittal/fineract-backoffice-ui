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

import { test, expect } from '@playwright/test';

test.describe('Report Enhancements, Pagination, and Help Tour', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept config.json
    await page.route('**/config.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          fineractApiUrl: '/api/v1',
          defaultTenantId: 'default',
        }),
      });
    });

    // Intercept Authentication API
    await page.route('**/api/v1/authentication**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          username: 'mifos',
          userId: 1,
          base64EncodedAuthenticationKey: 'YmFzZTY0',
          authenticated: true,
          officeId: 1,
          officeName: 'Head Office',
          roles: [{ id: 1, name: 'Super User', description: 'Super user' }],
          permissions: ['ALL_FUNCTIONS'],
        }),
      });
    });

    // Intercept Offices API
    await page.route('**/api/v1/offices**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            name: 'Head Office',
            nameDecorated: 'Head Office',
            externalId: '1',
            openingDate: [2009, 1, 1],
            hierarchy: '.',
          },
        ]),
      });
    });

    // Intercept Reports API
    await page.route('**/api/v1/reports', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            reportName: 'Active Clients Summary',
            reportType: 'Table',
            reportSubType: 'Detailed',
            reportCategory: 'Client',
            useReport: true,
          },
        ]),
      });
    });

    // Intercept RunReport API with mock paginated data (12 rows)
    await page.route('**/api/v1/runreports/Active%20Clients%20Summary**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          columnHeaders: [
            { columnName: 'Client ID', columnType: 'INTEGER' },
            { columnName: 'Display Name', columnType: 'VARCHAR' },
            { columnName: 'Office', columnType: 'VARCHAR' },
            { columnName: 'Activation Date', columnType: 'DATE' },
          ],
          data: [
            { row: [101, 'Alice Smith', 'Head Office', [2021, 5, 10]] },
            { row: [102, 'Bob Jones', 'Head Office', [2021, 6, 12]] },
            { row: [103, 'Charlie Brown', 'Head Office', [2021, 7, 15]] },
            { row: [104, 'Diana Prince', 'Head Office', [2021, 8, 20]] },
            { row: [105, 'Evan Wright', 'Head Office', [2021, 9, 25]] },
            { row: [106, 'Fiona Gallagher', 'Head Office', [2021, 10, 30]] },
            { row: [107, 'George Costanza', 'Head Office', [2021, 11, 5]] },
            { row: [108, 'Hannah Baker', 'Head Office', [2021, 12, 10]] },
            { row: [109, 'Ian Malcolm', 'Head Office', [2022, 1, 15]] },
            { row: [110, 'Julia Roberts', 'Head Office', [2022, 2, 20]] },
            { row: [111, 'Kevin Bacon', 'Head Office', [2022, 3, 25]] },
            { row: [112, 'Lois Lane', 'Head Office', [2022, 4, 30]] },
          ],
        }),
      });
    });

    // Navigate to Login page and execute log in
    await page.goto('/login');
    await page.locator('#tenantId').fill('default');
    await page.locator('#username').fill('mifos');
    await page.locator('#password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should run report, show paginated data, and download CSV', async ({ page }) => {
    // Navigate to Reporting
    await page.getByRole('link', { name: 'Reporting' }).click();
    await expect(page.locator('h1')).toContainText('Reports');

    // Run the report
    await page.locator('button[matTooltip="Run Report"]').first().click();
    await expect(page).toHaveURL(/\/reporting\/run\/Active%20Clients%20Summary/);

    // Select an office and click Run
    await page.locator('mat-select').click();
    await page.getByRole('option', { name: 'Head Office' }).click();
    await page.getByRole('button', { name: 'Run Report' }).click();

    // Verify report results are shown
    const resultsHeader = page.locator('.results-header h3');
    await expect(resultsHeader).toContainText('Report Results');

    // Verify first page of data is rendered (10 rows limit)
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows).toHaveCount(10);
    await expect(page.locator('table')).toContainText('Alice Smith');
    await expect(page.locator('table')).toContainText('Julia Roberts');
    await expect(page.locator('table')).not.toContainText('Kevin Bacon'); // Should be on page 2

    // Check pagination range label
    const paginatorRange = page.locator('.mat-mdc-paginator-range-label');
    await expect(paginatorRange).toContainText('1 – 10 of 12');

    // Navigate to the next page
    await page.locator('button[aria-label="Next page"]').click();
    await expect(tableRows).toHaveCount(2);
    await expect(page.locator('table')).toContainText('Kevin Bacon');
    await expect(page.locator('table')).toContainText('Lois Lane');
    await expect(page.locator('table')).not.toContainText('Alice Smith');
    await expect(paginatorRange).toContainText('11 – 12 of 12');

    // Intercept and assert the CSV download trigger
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download CSV' }).click();
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toContain('Active_Clients_Summary_Report.csv');
  });

  test('should trigger guidance help tour and navigate steps', async ({ page }) => {
    // Start the help tour from main layout
    const tourBtn = page.locator('.tour-btn');
    await expect(tourBtn).toBeVisible();
    await tourBtn.click();

    // Verify tour card is visible
    const tourCard = page.locator('app-guidance-tour');
    await expect(tourCard).toBeVisible();
    await expect(tourCard.locator('mat-card-title')).toContainText('Dashboard Walkthrough');

    // Click Next to proceed
    const nextBtn = page.getByRole('button', { name: 'Next' });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Card should update its header
    await expect(tourCard.locator('mat-card-title')).toContainText('System Configuration');

    // Click Exit to close the tour
    const exitBtn = page.getByRole('button', { name: 'Exit' });
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();

    // Tour should be dismissed from the view
    await expect(tourCard).not.toBeVisible();
  });
});
