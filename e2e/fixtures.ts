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
 * The shared Playwright `test` for this suite. Specs import from here rather than
 * from '@playwright/test' so that every test carries the change-detection check below.
 *
 * Angular's `checkNoChanges` pass runs a second change-detection cycle and compares it
 * against the first; a binding whose value differs between the two changed without ever
 * notifying Angular, and is reported as NG0100. `src/app/app.config.ts` enables that pass
 * exhaustively on an interval in dev builds, which is what the e2e suite runs against.
 *
 * That is precisely the failure mode `scripts/audit-async-state.mjs` counts: a plain field
 * assigned from an HTTP callback holds the right value while the DOM shows the old one.
 * Asserting on rendered output cannot catch it in general — an empty table and a broken
 * table look identical — so the console is the signal.
 *
 * Set ALLOW_ANGULAR_CD_ERRORS=1 to collect and print them without failing, which is the
 * useful mode while burning the existing ones down.
 */

import { test as base, expect } from '@playwright/test';

/**
 * NG0100 is ExpressionChangedAfterItHasBeenCheckedError — the checkNoChanges failure.
 *
 * Deliberately narrow. Broadening this to every Angular runtime error would fold
 * unrelated pre-existing noise into a signal that is meant to mean one thing, and a
 * check that fails for many reasons gets muted rather than fixed. Hydration codes are
 * excluded on purpose: this app has no SSR.
 */
const CHANGE_DETECTION_ERROR_CODES = ['NG0100'];

const REPORT_ONLY = process.env.ALLOW_ANGULAR_CD_ERRORS === '1';

type ChangeDetectionFixtures = {
  /** Change-detection errors seen on the page during this test. */
  changeDetectionErrors: string[];
  /** Auto-fixture: records the errors above, then asserts none were seen. */
  failOnChangeDetectionErrors: void;
};

export const test = base.extend<ChangeDetectionFixtures>({
  changeDetectionErrors: async ({}, use) => {
    await use([]);
  },

  failOnChangeDetectionErrors: [
    async ({ page, changeDetectionErrors }, use) => {
      const record = (text: string) => {
        if (CHANGE_DETECTION_ERROR_CODES.some((code) => text.includes(code))) {
          changeDetectionErrors.push(text);
        }
      };

      // Angular routes these through provideBrowserGlobalErrorListeners(), so they
      // arrive as console errors rather than as uncaught exceptions. 'pageerror' is
      // listened to as well because an interval-driven checkNoChanges throw has no
      // application frame to be caught in.
      page.on('console', (message) => {
        if (message.type() === 'error') {
          record(message.text());
        }
      });
      page.on('pageerror', (error) => record(error.message));

      await use();

      if (changeDetectionErrors.length === 0) {
        return;
      }

      // Repeats of one broken binding are the norm once the interval check is running,
      // so report each distinct message once rather than several hundred times.
      const distinct = [...new Set(changeDetectionErrors)];
      const summary = distinct.map((message) => `  - ${message}`).join('\n');

      if (REPORT_ONLY) {
        console.warn(
          `[change-detection] ${distinct.length} error(s) on ${page.url()}:\n${summary}`,
        );
        return;
      }

      expect(
        distinct,
        `Angular reported state that changed without notifying it (${page.url()}).\n` +
          `${summary}\n\n` +
          'A field assigned from a subscribe callback is the usual cause; convert it to a ' +
          'signal (scripts/audit-async-state.mjs lists them, scripts/codemod-signals.mjs ' +
          'converts them). Re-run with ALLOW_ANGULAR_CD_ERRORS=1 to report instead of fail.',
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
export type { Page, Locator, Route } from '@playwright/test';
