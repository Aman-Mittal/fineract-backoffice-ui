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
 * mat-datepicker -> ion-datetime.
 *
 * This is the one conversion that changes a value's type: mat-datepicker binds a `Date`,
 * ion-datetime binds an ISO string. The template rewrite is mechanical, so the script also
 * migrates the obvious consequences — field declarations and the hand-rolled
 * `${d.getFullYear()}-...` formatting, which becomes `toIsoDate()`. Anything it misses
 * surfaces as a type error, which is the point.
 *
 * TEMPORARY: delete once the migration is finished.
 *
 * Usage: node scripts/codemod-datepicker.mjs <file-or-dir> [...]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

/** `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate())…}` */
const MANUAL_FORMAT =
  /`\$\{\s*([\w.]+?)\.getFullYear\(\)\s*\}-\$\{\s*String\(\s*\1\.getMonth\(\)\s*\+\s*1\s*\)\.padStart\(\s*2\s*,\s*'0'\s*\)\s*\}-\$\{\s*String\(\s*\1\.getDate\(\)\s*\)\.padStart\(\s*2\s*,\s*'0'\s*\)\s*\}`/g;

function walk(target) {
  if (statSync(target).isFile()) return target.endsWith('.ts') ? [target] : [];
  return readdirSync(target).flatMap((e) => walk(join(target, e)));
}

function importPath(file, moduleFromAppRoot) {
  let rel = relative(dirname(file), join('src/app', moduleFromAppRoot)).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}

function transform(source, file, report) {
  let s = source;
  const needed = new Set();
  const fields = new Set();

  s = s.replace(
    /<mat-form-field\b([^>]*)>([\s\S]*?)<\/mat-form-field>/g,
    (whole, ffAttrs, body) => {
      if (!/matDatepicker/.test(body)) return whole;

      const label = body.match(/<mat-label\b[^>]*>([\s\S]*?)<\/mat-label\s*>/);
      const input = body.match(/<input\b([\s\S]*?)\/?>/);
      if (!input) return whole;

      const attrs = input[1];
      const name = (attrs.match(/\bname="([^"]+)"/) || [])[1];
      const model = (attrs.match(/\[\(ngModel\)\]="([^"]+)"/) || [])[1];
      if (!name || !model) return whole;

      const required = /\brequired\b/.test(attrs);
      const disabled = attrs.match(/\[disabled\]="([^"]+)"/);
      const id = `${name}-picker`;
      fields.add(model);

      needed.add('IonItem');
      needed.add('IonDatetime');
      needed.add('IonDatetimeButton');
      needed.add('IonModal');

      const ffCleaned = ffAttrs.replace(/\s*appearance="[^"]*"/g, '');
      let labelMarkup = '';
      if (label) {
        needed.add('IonLabel');
        labelMarkup = `\n  <ion-label position="stacked">${label[1]}</ion-label>`;
      }

      return (
        `<ion-item fill="outline"${ffCleaned}>${labelMarkup}\n` +
        `  <ion-datetime-button datetime="${id}"></ion-datetime-button>\n` +
        `  <ion-modal [keepContentsMounted]="true">\n` +
        `    <ng-template>\n` +
        `      <ion-datetime\n` +
        `        id="${id}"\n` +
        `        data-testid="${id}"\n` +
        `        presentation="date"\n` +
        `        name="${name}"\n` +
        `        [(ngModel)]="${model}"${required ? '\n        required' : ''}${
          disabled ? `\n        [disabled]="${disabled[1]}"` : ''
        }\n` +
        `      ></ion-datetime>\n` +
        `    </ng-template>\n` +
        `  </ion-modal>\n` +
        `</ion-item>`
      );
    },
  );

  if (needed.size === 0) return source;

  // The toggle and picker elements are now redundant.
  s = s
    .replace(/\s*<mat-datepicker-toggle\b[^>]*>\s*<\/mat-datepicker-toggle>/g, '')
    .replace(/\s*<mat-datepicker\b[^>]*>\s*<\/mat-datepicker>/g, '');

  // ion-datetime yields an ISO string, so the hand-rolled formatting is now just a passthrough.
  let usedToIsoDate = false;
  s = s.replace(MANUAL_FORMAT, (whole, expr) => {
    usedToIsoDate = true;
    return `toIsoDate(${expr})`;
  });

  // Field declarations that held a Date now hold an ISO string.
  for (const field of fields) {
    const bare = field.replace(/^this\./, '').split('.')[0];
    const before = s;
    s = s
      .replace(new RegExp(`\\b${bare}\\s*:\\s*Date\\s*\\|\\s*null\\s*=\\s*null;`, 'g'), `${bare}: string | null = null;`)
      .replace(new RegExp(`\\b${bare}!\\s*:\\s*Date;`, 'g'), `${bare} = '';`)
      .replace(new RegExp(`\\b${bare}\\s*:\\s*Date\\s*=\\s*new Date\\(\\);`, 'g'), `${bare} = toIsoDate(new Date());`)
      .replace(new RegExp(`\\b${bare}\\s*=\\s*new Date\\(\\);`, 'g'), `${bare} = toIsoDate(new Date());`);
    if (s !== before && /toIsoDate\(new Date\(\)\)/.test(s)) usedToIsoDate = true;
  }

  // Drop the now-unused Material date modules.
  if (!/matDatepicker|<mat-datepicker/.test(s)) {
    s = s
      .replace(/import \{[^}]*MatDatepickerModule[^}]*\} from '@angular\/material\/datepicker';\n/g, '')
      .replace(/import \{[^}]*MatNativeDateModule[^}]*\} from '@angular\/material\/core';\n/g, '')
      .replace(/\s*MatDatepickerModule,/g, '')
      .replace(/\s*MatNativeDateModule,/g, '');
  }

  // Merge the Ionic imports.
  if (/from '@ionic\/angular\/standalone'/.test(s)) {
    s = s.replace(/import \{([^}]*)\} from '@ionic\/angular\/standalone';/, (whole, names) => {
      const all = [
        ...new Set([...names.split(',').map((n) => n.trim()).filter(Boolean), ...needed]),
      ].sort();
      return `import { ${all.join(', ')} } from '@ionic/angular/standalone';`;
    });
  } else {
    const anchor = [...s.matchAll(/^import .*?;$/gm)].pop();
    const at = anchor.index + anchor[0].length;
    s = `${s.slice(0, at)}\nimport { ${[...needed].sort().join(', ')} } from '@ionic/angular/standalone';${s.slice(at)}`;
  }

  // Add the Ionic components to the imports array.
  s = s.replace(/(imports:\s*\[)([\s\S]*?)(\],?\n)/, (whole, open, body, close) => {
    const existing = body.split(',').map((n) => n.trim()).filter(Boolean);
    return `${open}${[...new Set([...existing, ...needed])].join(', ')}${close}`;
  });

  if (usedToIsoDate && !/\btoIsoDate\b.*from/.test(s)) {
    const path = importPath(file, 'core/utils/date-formatter');
    if (new RegExp(`from '${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`).test(s)) {
      s = s.replace(
        new RegExp(`import \\{([^}]*)\\} from '${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}';`),
        (whole, names) => `import {${names.replace(/\s*$/, '')}, toIsoDate } from '${path}';`,
      );
    } else {
      const anchor = [...s.matchAll(/^import .*?;$/gm)].pop();
      const at = anchor.index + anchor[0].length;
      s = `${s.slice(0, at)}\nimport { toIsoDate } from '${path}';${s.slice(at)}`;
    }
  }

  report.push(`  ${file}: ${fields.size} date field(s)`);
  return s;
}

const targets = process.argv.slice(2).flatMap(walk);
const report = [];
let changed = 0;

for (const file of targets) {
  const before = readFileSync(file, 'utf8');
  if (!/matDatepicker/.test(before)) continue;
  const after = transform(before, file, report);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}

console.log(`Converted date pickers in ${changed} file(s).`);
if (report.length) console.log(report.join('\n'));
