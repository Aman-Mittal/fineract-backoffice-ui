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
 * Opens a mat-select combobox and picks an option by name, retrying the open
 * if the option list hasn't rendered yet (async template loads) or a stray
 * overlay from a prior interaction is still blocking the click.
 */
export async function selectMatOption(
  page: Page,
  comboboxName: string,
  optionName: string,
): Promise<void> {
  const combobox = page.getByRole('combobox', { name: comboboxName });
  const option = page.getByRole('option', { name: optionName, exact: true });
  await combobox.scrollIntoViewIfNeeded();
  for (let attempt = 0; attempt < 5; attempt++) {
    await page.keyboard.press('Escape');
    await expect(page.locator('.cdk-overlay-backdrop')).toHaveCount(0);
    await combobox.click({ force: true });
    try {
      await expect(option).toBeVisible({ timeout: 8000 });
      break;
    } catch (err) {
      if (attempt === 4) throw err;
    }
  }
  await option.click();
  await expect(page.locator('.cdk-overlay-backdrop')).toHaveCount(0);
}
