/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  See the NOTICE file BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test, expect } from '@playwright/test';

test.describe('Reporting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('#tenantId').fill('default');
    await page.locator('#username').fill('mifos');
    await page.locator('#password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should display list of reports', async ({ page }) => {
    // Navigate to Reporting
    await page.getByRole('link', { name: 'Reporting' }).click();
    await expect(page.locator('h1')).toContainText('Reports');

    // Verify some report types are visible
    await expect(page.locator('table')).toContainText('Client');
    await expect(page.locator('table')).toContainText('Loan');
  });

  test('should navigate to run report page', async ({ page }) => {
    await page.getByRole('link', { name: 'Reporting' }).click();

    // Click on the first report's 'play_arrow' button
    await page.locator('button[matTooltip="Run Report"]').first().click();

    // Should be on run-report page
    await expect(page.url()).toContain('/reporting/run/');
    await expect(page.locator('h2')).toBeVisible();
  });
});
