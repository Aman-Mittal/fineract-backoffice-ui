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

import { Locator, Page, expect } from '@playwright/test';

/**
 * Picks an option from an `ion-select` that lives **inside a modal dialog**.
 *
 * {@link selectOption} cannot be used for this, for two independent reasons, and both fail in
 * ways that look like a broken component rather than a broken test:
 *
 *  1. **It presses Escape before each attempt.** On a page that harmlessly clears a stray
 *     overlay. Inside an `ion-modal` it dismisses the dialog, so the select is detached from
 *     the DOM mid-click and Playwright reports "element was not stable" against a control that
 *     was perfectly fine until the test closed the window it was in.
 *  2. **Its "no overlay is open" guard counts overlays that were never opened.** A screen that
 *     declares `<ion-popover trigger="...">` in its template — the group, client, loan, savings,
 *     deposit and working-capital-loan detail views all do, for their actions menus — keeps that
 *     element mounted for the life of the page, marked `.overlay-hidden`. The guard therefore
 *     never passes there and the call fails after five attempts against a popover nobody opened.
 *
 * So this addresses the select by `name` within the dialog rather than by its label text, never
 * touches the keyboard, and waits for the option overlay by visibility instead of by count.
 *
 * @param dialog   The modal, e.g. `modalFor(page, 'app-group-action-dialog')`.
 * @param name     The `name` attribute of the `ion-select` — its `formControlName`/`ngModel` name.
 * @param option   Exact visible text of the option to choose.
 */
export async function selectInDialog(
  page: Page,
  dialog: Locator,
  name: string,
  option: string,
): Promise<void> {
  const combobox = dialog.locator(`ion-select[name="${name}"]`);
  await expect(combobox).toBeVisible({ timeout: 20000 });

  // Only overlays that are actually presented. Ionic marks a mounted-but-closed one
  // `.overlay-hidden` (display: none), and the dialog's own host would otherwise match too.
  const overlay = page.locator(
    'ion-alert:not(.overlay-hidden), ion-popover:not(.overlay-hidden), ion-action-sheet:not(.overlay-hidden)',
  );
  // Ionic renders select options as radios inside the overlay, not as role="option".
  const choice = overlay.getByRole('radio', { name: option, exact: true });

  // Retried rather than clicked once: the option list is filled from an HTTP response, so a
  // first open can present an empty overlay.
  //
  // The retry must never click a select that is already covered. An open select-popover sits
  // over its own select and intercepts pointer events, so a loop that just re-clicks cannot
  // make progress — Playwright retries the click until the test times out, reporting
  // "<ion-popover class="select-popover"> intercepts pointer events" several hundred times.
  // That is a wedge, not a flake: it fails identically on every retry.
  //
  // So the overlay is closed before each new attempt, and only then is the select clicked.
  // Escape is safe *here* and only here: Ionic dismisses the topmost overlay, which is the
  // popover while one is open. It is what must not be pressed when nothing is open, because
  // then the dialog itself is topmost — see the note above.
  for (let attempt = 0; attempt < 5; attempt++) {
    if (await overlay.count()) {
      // Already open — possibly holding the option we want, so look before closing it.
      if (await choice.isVisible().catch(() => false)) break;
      await page.keyboard.press('Escape');
      await expect(overlay).toHaveCount(0);
    }

    await combobox.click();
    try {
      await expect(choice).toBeVisible({ timeout: 8000 });
      break;
    } catch (error) {
      if (attempt === 4) throw error;
    }
  }

  await choice.click();
  // The alert interface needs an explicit confirmation; the popover selects on click.
  const confirm = overlay.getByRole('button', { name: /^(ok|done)$/i });
  if (await confirm.count()) await confirm.first().click();
  await expect(overlay).toHaveCount(0);
}
