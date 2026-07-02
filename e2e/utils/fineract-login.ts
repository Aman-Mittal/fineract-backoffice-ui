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
 * Shared real-backend login helper for e2e specs that exercise the app
 * end-to-end against an actual Fineract instance (not page.route() mocks).
 *
 * Configurable via env vars so the same specs run against either the public
 * Mifos community sandbox (default) or a fresh local Fineract instance:
 *
 *   FINERACT_SERVER_URL="https://localhost:8443/fineract-provider/api/v1" \
 *   FINERACT_TENANT_ID=default FINERACT_USERNAME=mifos FINERACT_PASSWORD=password \
 *   npx playwright test
 */

import { Page, expect } from '@playwright/test';

export const SERVER_URL =
  process.env.FINERACT_SERVER_URL ?? 'https://apis.mifos.community/1.0/core/api/v1';
export const TENANT_ID = process.env.FINERACT_TENANT_ID ?? 'default';
export const USERNAME = process.env.FINERACT_USERNAME ?? 'mifos';
export const PASSWORD = process.env.FINERACT_PASSWORD ?? 'password';

export async function login(page: Page): Promise<void> {
  await page.goto('/login');

  const serverSelect = page.locator('#serverUrl');
  const presetCount = await serverSelect.locator(`option[value="${SERVER_URL}"]`).count();
  if (presetCount > 0) {
    await serverSelect.selectOption(SERVER_URL);
  } else {
    await serverSelect.selectOption('custom');
    await page.locator('#customUrl').fill(SERVER_URL);
  }

  await page.locator('#tenantId').fill(TENANT_ID);
  await page.locator('#username').fill(USERNAME);
  await page.locator('#password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Successful login lands on a page with the main sidebar navigation.
  await expect(page.getByRole('navigation', { name: 'Main Navigation' })).toBeVisible({
    timeout: 30000,
  });
}

export function uniqueSuffix(): string {
  return Date.now().toString(36).slice(-6);
}
