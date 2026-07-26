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
 * Ratchet guarding the Angular Material -> Ionic migration.
 *
 * Fails when the number of files importing `@angular/material` increases, so new code
 * cannot reintroduce it and the count only ever goes down. When a migration lands, run
 * `node scripts/check-material.mjs --update` to lower the baseline and commit it.
 *
 * Once the baseline reaches zero, delete this script and the `check:material` npm script,
 * and enable the `no-restricted-imports` rule described in eslint.config.js instead.
 *
 * Usage:
 *   node scripts/check-material.mjs            # verify (CI)
 *   node scripts/check-material.mjs --update   # lower the baseline after migrating files
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = 'src';
const BASELINE_FILE = 'scripts/material-baseline.json';
const IMPORT = /from '@angular\/material(\/[^']*)?'/;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      // Generated API client; never contains Material.
      if (entry === 'api' || entry === 'node_modules') continue;
      out.push(...walk(path));
    } else if (path.endsWith('.ts')) {
      out.push(path);
    }
  }
  return out;
}

const offenders = walk(SRC)
  .filter((file) => IMPORT.test(readFileSync(file, 'utf8')))
  .map((file) => relative('.', file))
  .sort();

const count = offenders.length;
const update = process.argv.includes('--update');
const baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));

if (update) {
  writeFileSync(BASELINE_FILE, `${JSON.stringify({ ...baseline, count }, null, 2)}\n`);
  const delta = baseline.count - count;
  console.log(`Baseline updated: ${baseline.count} -> ${count} (${delta} file(s) migrated).`);
  process.exit(0);
}

if (count > baseline.count) {
  console.error(
    `Angular Material usage increased: ${baseline.count} -> ${count} file(s).\n\n` +
      'Angular Material is being removed; new code must use Ionic. See STYLE.md for the\n' +
      'component mapping. If you genuinely migrated files and the count should drop, run:\n\n' +
      '  node scripts/check-material.mjs --update\n',
  );
  process.exit(1);
}

if (count < baseline.count) {
  console.error(
    `Angular Material usage dropped from ${baseline.count} to ${count} file(s) — nice.\n` +
      'Lower the committed baseline so the ratchet holds:\n\n' +
      '  node scripts/check-material.mjs --update\n',
  );
  process.exit(1);
}

console.log(
  count === 0
    ? 'No Angular Material imports remain. Delete this script and enable no-restricted-imports.'
    : `Angular Material import count holding at ${count} file(s).`,
);
