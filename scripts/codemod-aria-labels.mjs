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
 * Gives every form control an accessible name.
 *
 * Ionic 6/7 associated an `<ion-label>` with the control beside it inside an
 * `<ion-item>`. Ionic 8 removed that: the name must come from the control itself,
 * via its own `label` property or an `aria-label`. This app was migrated off
 * Angular Material onto the `ion-item fill="outline"` + `ion-label
 * position="stacked"` pattern, which still *renders* the label correctly — so the
 * regression is invisible on screen, and total to a screen reader. Measured before
 * this ran: 584 controls, exactly one `aria-label` between them.
 *
 * The fix is `[attr.aria-label]` rather than a migration to Ionic 8's `label`
 * property, because `label` renders its own text and would mean deleting 515
 * `<ion-label>` elements and re-checking the layout of 132 files. aria-label
 * changes no pixels.
 *
 * Idempotent: controls that already carry an aria-label are left alone.
 *
 *   node scripts/codemod-aria-labels.mjs [--dry]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const DRY = process.argv.includes('--dry');

const CONTROLS = 'ion-input|ion-select|ion-textarea';
// An <ion-label position="stacked">…</ion-label> immediately followed by a control.
// Comments and whitespace are allowed between the two; anything else means the label
// belongs to something we are not handling (an ion-datetime-button, say).
//
// The label body is written as "any character that does not begin a closing tag"
// rather than a lazy `.*?`. With a lazy quantifier the engine backtracks past the
// first </ion-label> when no control follows it, happily matching a label in one
// ion-item against a control several elements later — which would attach the wrong
// name to the wrong field. This formulation cannot cross the closing tag at all.
const PAIR = new RegExp(
  `<ion-label\\s+position="stacked"[^>]*>((?:(?!</ion-label>)[\\s\\S])*)</ion-label>` +
    `\\s*(?:<!--[\\s\\S]*?-->\\s*)*<(${CONTROLS})\\b`,
  'g',
);
const SINGLE_TRANSLATE = /^\{\{\s*('(?:[^'\\]|\\.)*')\s*\|\s*translate\s*\}\}$/;
const SINGLE_INTERPOLATION = /^\{\{(.+)\}\}$/s;

/** The Angular attribute that reproduces `labelText` as an accessible name. */
function ariaAttributeFor(labelText) {
  const text = labelText.trim().replace(/\s+/g, ' ');
  if (!text) return null;

  const translated = SINGLE_TRANSLATE.exec(text);
  if (translated) return `[attr.aria-label]="${translated[1]} | translate"`;

  const interpolated = SINGLE_INTERPOLATION.exec(text);
  if (interpolated) {
    const expression = interpolated[1].trim();
    // A binding cannot contain a double quote without escaping the attribute.
    if (expression.includes('"')) return null;
    return `[attr.aria-label]="${expression}"`;
  }

  // Plain text, e.g. <ion-label position="stacked">Amount</ion-label>.
  if (text.includes('{{') || text.includes('"') || text.includes('<')) return null;
  return `aria-label="${text}"`;
}

let changedFiles = 0;
let added = 0;
const skipped = [];

const files = globSync('src/app/**/*.ts').filter(
  (f) => !f.includes('/api/') && !f.endsWith('.spec.ts'),
);

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  let result = '';
  let cursor = 0;
  let fileAdded = 0;

  for (const match of original.matchAll(PAIR)) {
    const [full, labelText, tagName] = match;
    // Offset of the control's tag name end, i.e. where attributes start.
    const tagStart = match.index + full.length;

    // Already named? Look only inside this element's opening tag.
    const openTagEnd = original.indexOf('>', tagStart);
    const openTag = original.slice(tagStart, openTagEnd === -1 ? tagStart : openTagEnd);
    if (/\baria-label\b/.test(openTag)) continue;

    const attribute = ariaAttributeFor(labelText);
    if (!attribute) {
      skipped.push(`${file}: <${tagName}> after label ${JSON.stringify(labelText.trim())}`);
      continue;
    }

    result += original.slice(cursor, tagStart) + ' ' + attribute;
    cursor = tagStart;
    fileAdded += 1;
  }

  if (fileAdded === 0) continue;
  result += original.slice(cursor);

  if (!DRY) writeFileSync(file, result);
  changedFiles += 1;
  added += fileAdded;
}

console.log(`${DRY ? '[dry] ' : ''}added ${added} aria-labels across ${changedFiles} files`);
if (skipped.length) {
  console.log(`\nskipped ${skipped.length} control(s) needing a hand-written label:`);
  for (const s of skipped) console.log(`  ${s}`);
}
