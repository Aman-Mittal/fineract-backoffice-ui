#!/usr/bin/env node
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
 * Stops the Karma suite from growing while it is being migrated away.
 *
 * Karma is deprecated and `@angular/build:karma` goes with it (DOCS/adr/0004-vitest-migration.md).
 * The suite moves to Vitest one batch at a time, which leaves a window — months, realistically —
 * where both runners are wired up. The failure mode in that window is not that migration is
 * hard; it is that new specs keep landing on the runner being removed, so the finish line moves
 * away as fast as it is approached.
 *
 * This is a ratchet, in the same shape as `eslint-suppressions.json`: the set of files still on
 * the old runner is recorded, a file may leave that set, and nothing may join it.
 *
 * ## The convention it enforces
 *
 * - `*.spec.ts` — Jasmine dialect, run by Karma (`npm test`). Legacy. Shrinking.
 * - `*.test.ts` — Vitest dialect, run by Vitest (`npm run test:unit`). Everything new.
 *
 * The two runners select by filename, so a migration is a rename plus a dialect swap, and the
 * progress metric is `wc -l` on the baseline.
 *
 * ## Modes
 *
 *   node scripts/check-test-runner.mjs           verify (exit 1 when the set grew)
 *   node scripts/check-test-runner.mjs --write   re-record after migrating a batch
 *
 * `--write` is for a batch that has *moved*, and the check refuses to write a baseline that
 * grew — otherwise the ratchet could be released by running the very command that documents it.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASELINE = 'karma-baseline.json';

/**
 * Header fields the baseline carries for `scripts/check-license.sh`, which requires a licence
 * field on every JSON file. Written on every `--write` so re-recording a migrated batch cannot
 * silently drop them and fail a later, unrelated CI run.
 */
const HEADER = {
  license: 'Apache-2.0',
  $comment:
    'Specs still on the deprecated Karma runner. Written by scripts/check-test-runner.mjs; ' +
    'files may leave this list, never join it. See DOCS/adr/0004-vitest-migration.md.',
};
const ROOTS = ['src', 'projects'];
const WRITE = process.argv.includes('--write');

/** Every `.spec.ts` under the source roots, excluding the generated client. */
function* legacySpecs(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      if (full.includes('src/app/api')) continue;
      yield* legacySpecs(full);
    } else if (entry.name.endsWith('.spec.ts')) {
      yield full;
    }
  }
}

/** Byte-order path comparison, so the baseline diffs cleanly across platforms and locales. */
function byPath(a, b) {
  if (a < b) return -1;
  return a > b ? 1 : 0;
}

const current = [...ROOTS.flatMap((root) => [...legacySpecs(root)])].sort(byPath);

if (!existsSync(BASELINE)) {
  if (!WRITE) {
    console.error(`Missing ${BASELINE}. Run: node scripts/check-test-runner.mjs --write`);
    process.exit(1);
  }
  writeFileSync(BASELINE, `${JSON.stringify({ ...HEADER, specs: current }, null, 2)}\n`);
  console.log(`Recorded ${current.length} spec(s) still on Karma.`);
  process.exit(0);
}

const stored = JSON.parse(readFileSync(BASELINE, 'utf8'));
const baseline = stored.specs ?? [];

/**
 * Specs that were already in flight in an open pull request when this ratchet landed.
 *
 * They are admitted because the rule did not exist when they were written, and failing
 * somebody's open PR for not following a convention introduced after they started is a good way
 * to make a migration unpopular. They are listed separately from `specs` rather than merged into
 * it so that the exception is visible, finite and reviewable — and so `--write` cannot quietly
 * turn "grandfathered" into "normal".
 *
 * Nothing should ever be added here. A new spec after this point is a `.test.ts`.
 */
const grandfathered = stored.grandfathered ?? [];
const recorded = new Set([...baseline, ...grandfathered]);

const added = current.filter((file) => !recorded.has(file));
const migrated = baseline.filter((file) => !current.includes(file));

if (WRITE) {
  if (added.length > 0) {
    console.error(
      `Refusing to write: ${added.length} spec(s) would be ADDED to the Karma baseline.\n` +
        `--write records a batch that has moved off Karma; it is not a way to admit new ones.\n\n` +
        added.map((f) => `  + ${f}`).join('\n') +
        `\n\nRename these to .test.ts and convert them:\n` +
        `  node scripts/codemod-jasmine-to-vitest.mjs ${added.slice(0, 3).join(' ')}${added.length > 3 ? ' ...' : ''}\n`,
    );
    process.exit(1);
  }
  writeFileSync(
    BASELINE,
    `${JSON.stringify({ ...HEADER, grandfathered, specs: current }, null, 2)}\n`,
  );
  console.log(
    `Baseline updated: ${migrated.length} spec(s) migrated, ${current.length} still on Karma.`,
  );
  process.exit(0);
}

if (added.length > 0) {
  console.error(
    `\n${added.length} new Jasmine/Karma spec(s) — Karma is being removed, so new tests go to Vitest.\n`,
  );
  for (const file of added) console.error(`  + ${file}`);
  console.error(
    `\nName the file .test.ts instead of .spec.ts and write it in Vitest dialect\n` +
      `(vi.fn() rather than jasmine.createSpy, .mockReturnValue rather than .and.returnValue).\n` +
      `Run it with: npm run test:unit\n\n` +
      `If you are moving an existing spec, the codemod does the dialect and the rename:\n` +
      `  node scripts/codemod-jasmine-to-vitest.mjs <paths...>\n` +
      `  node scripts/check-test-runner.mjs --write\n\n` +
      `See DOCS/adr/0004-vitest-migration.md.\n`,
  );
  process.exit(1);
}

if (migrated.length > 0) {
  console.log(
    `${migrated.length} spec(s) migrated off Karma since the baseline was recorded.\n` +
      `Record it: node scripts/check-test-runner.mjs --write`,
  );
}

const total = current.length + countVitest();
const done = total === 0 ? 100 : Math.round(((total - current.length) / total) * 100);
console.log(`✓ No new Karma specs. ${current.length} remaining (${done}% migrated).`);

/** Counts migrated specs, for the progress line only. */
function countVitest() {
  let n = 0;
  for (const root of ROOTS) {
    const walk = (dir) => {
      let entries;
      try {
        entries = readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        const full = join(dir, entry.name).replaceAll('\\', '/');
        if (entry.isDirectory()) {
          if (full.includes('src/app/api')) continue;
          walk(full);
        } else if (entry.name.endsWith('.test.ts')) n++;
      }
    };
    walk(root);
  }
  return n;
}
