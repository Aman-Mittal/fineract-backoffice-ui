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

/**
 * Opens an ion-select and picks an option by name, retrying the open if the option list
 * hasn't rendered yet (async template loads) or a stray overlay from a prior interaction
 * is still on screen.
 *
 * Synchronises on `ion-alert`/`ion-popover` rather than Material's `.cdk-overlay-backdrop`:
 * ion-select presents its options in one of those, and they mount and unmount on their own
 * animation timing.
 */
export async function selectOption(
  page: Page,
  comboboxName: string,
  optionName: string,
): Promise<void> {
  // ion-select has no accessible name until a value is chosen (and no combobox role at all —
  // it renders as a plain button), so scope by the ion-item containing its stacked label instead.
  const combobox = page
    .locator('ion-item')
    .filter({ has: page.getByText(comboboxName, { exact: true }) })
    .locator('ion-select');
  const overlay = page.locator('ion-alert, ion-popover, ion-action-sheet');
  // Ionic renders select options as radios inside the overlay, not as role="option".
  const option = overlay.getByRole('radio', { name: optionName, exact: true });

  await combobox.scrollIntoViewIfNeeded();
  for (let attempt = 0; attempt < 5; attempt++) {
    await page.keyboard.press('Escape');
    await expect(overlay).toHaveCount(0);
    await combobox.click();
    try {
      await expect(option).toBeVisible({ timeout: 8000 });
      break;
    } catch (err) {
      if (attempt === 4) throw err;
    }
  }
  await option.click();
  // The alert interface needs an explicit confirmation; the popover selects on click.
  const confirm = overlay.getByRole('button', { name: /^(ok|done)$/i });
  if (await confirm.count()) await confirm.first().click();
  await expect(overlay).toHaveCount(0);
}
