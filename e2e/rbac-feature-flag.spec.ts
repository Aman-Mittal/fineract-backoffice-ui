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
 * End-to-end coverage for issue #113 — RBAC feature flag for gradual rollout.
 *
 * The `environment.rbacEnabled` flag is a build-time constant and the e2e build
 * ships with its default value (`true`). These tests therefore exercise the
 * observable RBAC-enabled behaviour:
 *   - the sidebar filters permission-gated nav groups by the user's permissions
 *     (via `*appHasPermission`), and
 *   - it filters the institution-feature items Groups / Centers / Collection
 *     Sheet by institution type (via `*appInstitutionFeature` +
 *     `InstitutionConfigService`).
 *
 * The `rbacEnabled = false` path (everything visible) is a compile-time variant
 * and is covered by the directive unit specs.
 */

import { test, expect, Page } from '@playwright/test';

const API_BASE = '/api/v1';
const TENANT_DEFAULT = 'default';
const TEST_USER = 'mifos';
const TEST_PASSWORD = 'password';
const INSTITUTION_STORAGE_KEY = 'fineract_institution_type';

type InstitutionType = 'mfis' | 'cb' | 'cu' | 'universal';

interface LoginOptions {
  permissions: string[];
  institutionType?: InstitutionType;
}

/**
 * Logs in against mocked config + authentication endpoints, injecting the given
 * permission set and (optionally) pre-seeding the institution type in
 * localStorage before the app bootstraps.
 */
async function login(page: Page, options: LoginOptions): Promise<void> {
  const { permissions, institutionType } = options;

  if (institutionType) {
    await page.addInitScript(
      ([key, value]) => {
        window.localStorage.setItem(key, value);
      },
      [INSTITUTION_STORAGE_KEY, institutionType],
    );
  }

  await page.route('**/config.json', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fineractApiUrl: API_BASE, defaultTenantId: TENANT_DEFAULT }),
    });
  });

  await page.route('**/api/v1/authentication**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        username: TEST_USER,
        userId: 1,
        base64EncodedAuthenticationKey: 'YmFzZTY0',
        authenticated: true,
        officeId: 1,
        officeName: 'Head Office',
        roles: [{ id: 1, name: 'Test Role', description: 'Test role' }],
        permissions,
      }),
    });
  });

  await page.goto('/login');
  await page.locator('#tenantId').fill(TENANT_DEFAULT);
  await page.locator('#username').fill(TEST_USER);
  await page.locator('#password').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
}

const link = (page: Page, name: string) => page.getByRole('link', { name, exact: true });

// Nav links that live inside permission-gated groups (see sidebar.component.ts).
const GATED_LINKS = [
  'Users', // Security  (READ_USER / READ_ROLE / READ_AUDIT)
  'Roles',
  'Audit Logs',
  'Data Tables', // System   (READ_DATATABLE / READ_HOOK)
  'Global Configurations', // Settings  (READ_CONFIGURATION)
  'Chart of Accounts', // Accounting (READ_GLACCOUNT)
];

// ─────────────────────────────────────────────────────────────────────────────
// Permission-based sidebar filtering
// ─────────────────────────────────────────────────────────────────────────────
test.describe('RBAC permission gating (rbacEnabled = true)', () => {
  test('a limited user does not see permission-gated nav groups', async ({ page }) => {
    await login(page, { permissions: ['READ_CLIENT', 'READ_LOAN'], institutionType: 'universal' });

    // Ungated items remain visible.
    await expect(link(page, 'Dashboard')).toBeVisible();
    await expect(link(page, 'Clients')).toBeVisible();
    await expect(link(page, 'Loans')).toBeVisible();

    // Gated groups are removed from the DOM entirely.
    for (const name of GATED_LINKS) {
      await expect(link(page, name)).toHaveCount(0);
    }
  });

  test('a user with READ_USER sees the Security group', async ({ page }) => {
    await login(page, { permissions: ['READ_CLIENT', 'READ_USER'], institutionType: 'universal' });

    await expect(link(page, 'Users')).toBeVisible();
    await expect(link(page, 'Roles')).toBeVisible();
    await expect(link(page, 'Audit Logs')).toBeVisible();

    // Other gated groups the user has no permission for stay hidden.
    await expect(link(page, 'Data Tables')).toHaveCount(0);
    await expect(link(page, 'Global Configurations')).toHaveCount(0);
  });

  test('a superuser (ALL_FUNCTIONS) sees all permission-gated groups', async ({ page }) => {
    await login(page, { permissions: ['ALL_FUNCTIONS'], institutionType: 'universal' });

    for (const name of GATED_LINKS) {
      await expect(link(page, name)).toBeVisible();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Institution-config sidebar filtering
// ─────────────────────────────────────────────────────────────────────────────
test.describe('RBAC institution-feature gating (rbacEnabled = true)', () => {
  test('universal institution shows Groups, Centers and Collection Sheet', async ({ page }) => {
    await login(page, { permissions: ['ALL_FUNCTIONS'], institutionType: 'universal' });

    await expect(link(page, 'Groups')).toBeVisible();
    await expect(link(page, 'Centers')).toBeVisible();
    await expect(link(page, 'Collection Sheet')).toBeVisible();
  });

  test('commercial bank (cb) hides all group-lending features', async ({ page }) => {
    await login(page, { permissions: ['ALL_FUNCTIONS'], institutionType: 'cb' });

    // Group-lending nav items are removed for a commercial bank...
    await expect(link(page, 'Groups')).toHaveCount(0);
    await expect(link(page, 'Centers')).toHaveCount(0);
    await expect(link(page, 'Collection Sheet')).toHaveCount(0);

    // ...but non-feature items remain.
    await expect(link(page, 'Clients')).toBeVisible();
  });

  test('credit union (cu) shows Groups but hides Centers and Collection Sheet', async ({
    page,
  }) => {
    await login(page, { permissions: ['ALL_FUNCTIONS'], institutionType: 'cu' });

    await expect(link(page, 'Groups')).toBeVisible();
    await expect(link(page, 'Centers')).toHaveCount(0);
    await expect(link(page, 'Collection Sheet')).toHaveCount(0);
  });
});
