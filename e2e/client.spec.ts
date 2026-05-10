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

test.describe('Client Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('#tenantId').fill('default');
    await page.locator('#username').fill('mifos');
    await page.locator('#password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should create a new client', async ({ page }) => {
    // Navigate to Clients
    await page.getByRole('link', { name: 'Clients' }).click();
    await expect(page.locator('h1')).toContainText('Clients');

    // Click Create Client
    await page.getByRole('button', { name: 'add Create Client' }).click();
    await expect(page.locator('mat-card-title')).toContainText('Create Client');

    // Fill Client Form
    await page.locator('mat-select[name="legalFormId"]').click();
    await page.getByRole('option', { name: 'Person' }).click();

    const firstName = `TestUser${Date.now()}`;
    const lastName = 'E2E';

    await page.locator('input[name="firstname"]').fill(firstName);
    await page.locator('input[name="lastname"]').fill(lastName);

    // Select Office (assuming 'Head Office' is available)
    await page.locator('mat-select[name="officeId"]').click();
    await page.getByRole('option').first().click();

    // Submit
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify redirection to list and presence of new client
    await expect(page).toHaveURL('/clients');
    await page.locator('input[placeholder="Type to search..."]').fill(firstName);

    // Wait for local filtering if any, or just check row
    await expect(page.locator('table')).toContainText(firstName);
  });
});
