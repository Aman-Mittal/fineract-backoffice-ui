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
  let createdClients: any[] = [];

  test.beforeEach(async ({ page }) => {
    createdClients = [];

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

    // Intercept Client Create POST
    await page.route('**/api/v1/clients', async (route) => {
      if (route.request().method() === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}');
        const newClient = {
          id: Date.now(),
          accountNo: '000000001',
          displayName: `${body.firstname} ${body.lastname}`,
          firstname: body.firstname,
          lastname: body.lastname,
          status: { value: 'Active' },
          officeName: 'Head Office',
        };
        createdClients.push(newClient);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            clientId: newClient.id,
            resourceId: newClient.id,
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Intercept Clients List GET
    await page.route('**/api/v1/clients?**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalFilteredRecords: createdClients.length,
          pageItems: createdClients,
        }),
      });
    });

    await page.goto('/login');
    await page.locator('#tenantId').fill('default');
    await page.locator('#username').fill('mifos');
    await page.locator('#password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new client', async ({ page }) => {
    // Navigate to Clients
    await page.getByRole('link', { name: 'Clients' }).click();
    await expect(page).toHaveURL('/clients');
    await expect(page.locator('mat-card-title').first()).toContainText('Clients');

    // Click Create Client
    await page.getByRole('button', { name: 'Create Client', exact: true }).click();
    await expect(page).toHaveURL('/clients/create');
    await expect(page.locator('mat-card-title').first()).toContainText('Create Client');

    // Fill Client Form
    await page.locator('mat-select[name="legalFormId"]').click();
    await page.getByRole('option', { name: 'Person' }).click();

    const firstName = `TestUser${Date.now()}`;
    const lastName = 'E2E';

    await page.locator('input[name="firstname"]').fill(firstName);
    await page.locator('input[name="lastname"]').fill(lastName);

    // Select Office (assuming 'Head Office' is available)
    await page.locator('mat-select[name="officeId"]').click();
    await page.locator('mat-option').first().click();

    // Submit
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify redirection to list and presence of new client
    await expect(page).toHaveURL('/clients');
    await page.locator('input[placeholder="Type to search..."]').fill(firstName);

    // Wait for local filtering if any, or just check row
    await expect(page.locator('table')).toContainText(firstName);
  });
});
