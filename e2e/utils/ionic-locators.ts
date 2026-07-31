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
 * Locators for Ionic overlays, whose accessibility shape is not what the markup
 * suggests. Both of these cost real debugging time, so they live here once
 * rather than being re-derived per spec.
 */

import { expect, Locator, Page } from '@playwright/test';

/**
 * Selects a tab in an ion-segment tab strip.
 *
 * Entity views have more tabs than fit (loan-view has 11), so the strip scrolls.
 * Ionic scrolls the checked button into view itself, which competes with
 * Playwright's own scroll-then-click and can leave a plain `.click()` retrying
 * until it times out. Scroll first, then force past the stability check — and
 * assert aria-selected afterwards, so a click that silently failed to register
 * still fails the test rather than passing quietly.
 */
export async function selectTab(page: Page, name: string | RegExp): Promise<void> {
  const tab = page.getByRole('tab', { name });
  await tab.scrollIntoViewIfNeeded();
  await tab.click({ force: true });
  await expect(tab).toHaveAttribute('aria-selected', 'true');
}

/**
 * An entry in a popover menu.
 *
 * Menus are an ion-popover of `ion-item button` rows. Despite the `button`
 * attribute those expose role="listitem" — not "button", and not "menuitem" —
 * so match on the element and its text rather than a role. Scoping to the
 * popover also stops the page's own controls matching the same name.
 */
export function menuItem(page: Page, name: string | RegExp): Locator {
  return page.locator('ion-popover').locator('ion-item').filter({ hasText: name });
}

/**
 * The confirm modal rendered by DialogService.confirm().
 *
 * Scoped by its component rather than by `ion-modal` alone: any date-picker
 * field on the page keeps a second, hidden ion-modal mounted
 * ([keepContentsMounted]), so a bare `ion-modal` locator resolves to two
 * elements and trips strict mode.
 *
 * Note the modal's content sits behind a shadow boundary that a chained
 * getByRole() does not reach — assert on text or on plain element locators.
 */
export function confirmDialog(page: Page): Locator {
  return page.locator('ion-modal').filter({ has: page.locator('app-confirm-dialog') });
}

/** A modal hosting a specific component, e.g. 'app-transaction-detail-dialog'. */
export function modalFor(page: Page, componentSelector: string): Locator {
  return page.locator('ion-modal').filter({ has: page.locator(componentSelector) });
}
