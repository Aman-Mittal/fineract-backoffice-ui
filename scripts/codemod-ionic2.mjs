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
 * Second Material -> Ionic codemod pass: snackbars and raw tables.
 *
 *  - MatSnackBar becomes NotificationService. Severity is inferred from the message,
 *    which is reported per call so the guesses can be reviewed.
 *  - mat-table markup becomes cdk-table. The engine is the same; only the styling goes,
 *    and that is supplied globally by the `table[cdk-table]` rules in _common.scss.
 *
 * TEMPORARY: delete once the migration is finished.
 *
 * Usage: node scripts/codemod-ionic2.mjs <file-or-dir> [...]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const FAILURE = /fail|error|unable|invalid|could not|cannot|not found|denied|rejected/i;

const TABLE_RENAMES = [
  [/\bmat-header-cell\b/g, 'cdk-header-cell'],
  [/\bmatHeaderCellDef\b/g, 'cdkHeaderCellDef'],
  [/\bmatHeaderRowDef\b/g, 'cdkHeaderRowDef'],
  [/\bmat-header-row\b/g, 'cdk-header-row'],
  [/\bmat-footer-cell\b/g, 'cdk-footer-cell'],
  [/\bmatFooterCellDef\b/g, 'cdkFooterCellDef'],
  [/\bmatFooterRowDef\b/g, 'cdkFooterRowDef'],
  [/\bmat-footer-row\b/g, 'cdk-footer-row'],
  [/\bmatColumnDef\b/g, 'cdkColumnDef'],
  [/\bmatNoDataRow\b/g, 'cdkNoDataRow'],
  [/\bmatCellDef\b/g, 'cdkCellDef'],
  [/\bmatRowDef\b/g, 'cdkRowDef'],
  [/\bmat-cell\b/g, 'cdk-cell'],
  [/\bmat-row\b/g, 'cdk-row'],
  [/\bmat-table\b/g, 'cdk-table'],
];

function walk(target) {
  if (statSync(target).isFile()) return target.endsWith('.ts') ? [target] : [];
  return readdirSync(target).flatMap((e) => walk(join(target, e)));
}

/** Import path from `file` to a module under src/app. */
function importPath(file, moduleFromAppRoot) {
  let rel = relative(dirname(file), join('src/app', moduleFromAppRoot)).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}

function addImport(s, statement) {
  if (s.includes(statement)) return s;
  const anchor = [...s.matchAll(/^import .*?;$/gm)].pop();
  const at = anchor.index + anchor[0].length;
  return `${s.slice(0, at)}\n${statement}${s.slice(at)}`;
}

function convertSnackBar(s, file, notes) {
  if (!/MatSnackBar\b/.test(s)) return s;

  s = s.replace(
    /this\.snackBar\.open\(\s*([\s\S]*?)\s*,\s*'[^']*'\s*,\s*\{[\s\S]*?\}\s*\)/g,
    (whole, message) => {
      const severity = FAILURE.test(message) ? 'error' : 'success';
      notes.push(`    ${severity}: ${message.replace(/\s+/g, ' ').slice(0, 70)}`);
      return `this.notifications.${severity}(${message})`;
    },
  );
  // Two-argument form, no config object.
  s = s.replace(/this\.snackBar\.open\(\s*([\s\S]*?)\s*,\s*'[^']*'\s*\)/g, (whole, message) => {
    const severity = FAILURE.test(message) ? 'error' : 'success';
    notes.push(`    ${severity}: ${message.replace(/\s+/g, ' ').slice(0, 70)}`);
    return `this.notifications.${severity}(${message})`;
  });

  s = s
    .replace(/(\w+\s+)?readonly snackBar = inject\(MatSnackBar\);/g, (whole, mods) =>
      `${mods ?? ''}readonly notifications = inject(NotificationService);`,
    )
    .replace(/\bthis\.snackBar\b/g, 'this.notifications');

  // Drop the Material import and the module from the imports array.
  s = s
    .replace(/import \{[^}]*\} from '@angular\/material\/snack-bar';\n/g, '')
    .replace(/\s*MatSnackBarModule,/g, '')
    .replace(/\[\s*MatSnackBarModule\s*\]/g, '[]');

  return addImport(
    s,
    `import { NotificationService } from '${importPath(file, 'core/services/notification.service')}';`,
  );
}

function convertTable(s) {
  if (!/\bmat-table\b|matColumnDef/.test(s)) return s;

  for (const [from, to] of TABLE_RENAMES) s = s.replace(from, to);
  // Material's elevation helper has no CDK counterpart.
  s = s.replace(/\s*class="mat-elevation-z\d+"/g, '').replace(/\s*mat-elevation-z\d+/g, '');

  s = s
    .replace(/import \{[^}]*MatTableModule[^}]*\} from '@angular\/material\/table';\n/g, '')
    .replace(/\bMatTableModule\b/g, 'CdkTableModule');

  return addImport(s, `import { CdkTableModule } from '@angular/cdk/table';`);
}

const targets = process.argv.slice(2).flatMap(walk);
let snack = 0;
let table = 0;
const notes = [];

for (const file of targets) {
  const before = readFileSync(file, 'utf8');
  if (!/@angular\/material/.test(before)) continue;

  const fileNotes = [];
  let after = convertSnackBar(before, file, fileNotes);
  const afterSnack = after;
  after = convertTable(after);

  if (afterSnack !== before) snack++;
  if (after !== afterSnack) table++;
  if (after !== before) writeFileSync(file, after);
  if (fileNotes.length) notes.push(`  ${file}`, ...fileNotes);
}

console.log(`snackbar -> NotificationService: ${snack} file(s)`);
console.log(`mat-table -> cdk-table:          ${table} file(s)`);
if (notes.length) {
  console.log('\nInferred severities (review these):');
  console.log(notes.join('\n'));
}
