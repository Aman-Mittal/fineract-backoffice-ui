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
 * Mechanical Angular Material -> Ionic codemod.
 *
 * Covers the repetitive, unambiguous conversions: form fields, selects, buttons, icons,
 * cards, tooltips, and the corresponding import statements and `imports:` arrays.
 *
 * Deliberately does NOT touch constructs that need judgement — date pickers, tab groups,
 * menus, raw mat-table markup and dialogs. A Material module is only dropped from a file
 * once no markup that needs it remains, so a partially-converted file still compiles.
 *
 * TEMPORARY: delete this script, and scripts/icon-map.json, once the migration is done.
 *
 * Usage: node scripts/codemod-ionic.mjs <file-or-dir> [...]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ICON_MAP = JSON.parse(readFileSync('scripts/icon-map.json', 'utf8'));

/** Marks a <button> that carried a Material button directive, so only those become ion-button. */
const BTN = '__ION_BUTTON__';

/**
 * A Material module may only be removed from a file once none of these patterns remain.
 * This keeps half-converted files compiling.
 */
const MODULE_GUARDS = {
  MatCardModule: /<mat-card/,
  MatButtonModule: /mat-(raised-|icon-|stroked-|flat-)?button|mat-fab|mat-mini-fab/,
  MatIconModule: /<mat-icon/,
  MatInputModule: /matInput\b/,
  MatFormFieldModule: /<mat-form-field|<mat-label|<mat-hint|matSuffix|matPrefix/,
  MatSelectModule: /<mat-select|<mat-option/,
  MatCheckboxModule: /<mat-checkbox/,
  MatSlideToggleModule: /<mat-slide-toggle/,
  MatRadioModule: /<mat-radio/,
  MatProgressSpinnerModule: /<mat-spinner|<mat-progress-spinner/,
  MatProgressBarModule: /<mat-progress-bar/,
  MatChipsModule: /<mat-chip/,
  MatListModule: /<mat-list|<mat-selection-list|matListItem/,
  MatTooltipModule: /matTooltip/,
  MatDividerModule: /<mat-divider/,
  MatTabsModule: /<mat-tab/,
  MatTableModule: /mat-table|matColumnDef|mat-cell|mat-header-cell|mat-row|matNoDataRow/,
  MatMenuModule: /<mat-menu|matMenuTriggerFor|mat-menu-item/,
  MatDatepickerModule: /matDatepicker|<mat-datepicker/,
  MatNativeDateModule: /matDatepicker|<mat-datepicker/,
  MatAutocompleteModule: /matAutocomplete/,
  MatExpansionModule: /<mat-expansion|<mat-panel/,
  MatSnackBarModule: /MatSnackBar\b/,
  MatDialogModule: /mat-dialog-|MatDialog\b/,
  MatPaginatorModule: /<mat-paginator/,
  MatSortModule: /matSort|mat-sort-header/,
};

const STRUCTURAL = [
  ['datepicker', /matDatepicker|mat-datepicker/],
  ['tabs', /<mat-tab\b|mat-tab-group/],
  ['raw table', /\bmat-table\b|matColumnDef/],
  ['dialog', /MatDialog\b|MAT_DIALOG_DATA|mat-dialog-/],
  ['menu', /matMenuTriggerFor|<mat-menu|mat-menu-item/],
  ['autocomplete', /matAutocomplete/],
  ['expansion', /mat-expansion/],
  ['list', /<mat-list|<mat-selection-list/],
  ['snackbar', /MatSnackBar\b/],
  ['radio', /<mat-radio/],
];

function walk(target) {
  if (statSync(target).isFile()) return target.endsWith('.ts') ? [target] : [];
  return readdirSync(target).flatMap((e) => walk(join(target, e)));
}

/** Rewrites `<input matInput ...>` / `<textarea matInput ...>` to their Ionic equivalents. */
function convertInputs(s, needed) {
  s = s.replace(/<input\b([^>]*?)\/?>/g, (whole, attrs) => {
    if (!/\bmatInput\b/.test(attrs)) return whole;
    // A date input belongs to a picker; leave the whole construct for a human.
    if (/\[matDatepicker\]/.test(attrs)) return whole;
    needed.add('IonInput');
    return `<ion-input${attrs.replace(/\s*\bmatInput\b/, '')}></ion-input>`;
  });

  s = s.replace(/<textarea\b([^>]*?)>([\s\S]*?)<\/textarea>/g, (whole, attrs, body) => {
    if (!/\bmatInput\b/.test(attrs)) return whole;
    needed.add('IonTextarea');
    return `<ion-textarea${attrs.replace(/\s*\bmatInput\b/, '')}>${body}</ion-textarea>`;
  });

  return s;
}

/** Converts a whole `<mat-form-field>…</mat-form-field>` block. */
function convertFormFields(s, needed) {
  return s.replace(/<mat-form-field\b([^>]*)>([\s\S]*?)<\/mat-form-field>/g, (whole, attrs, body) => {
    // Date pickers need an ion-datetime + ion-modal, which is not a mechanical rewrite.
    if (/matDatepicker/.test(body)) return whole;

    const cleaned = attrs.replace(/\s*appearance="[^"]*"/g, '');
    needed.add('IonItem');
    let inner = body;

    if (/<mat-label\b/.test(inner)) {
      needed.add('IonLabel');
      inner = inner
        .replace(/<mat-label\b([^>]*)>/g, '<ion-label position="stacked"$1>')
        .replace(/<\/mat-label\s*>/g, '</ion-label>');
    }
    inner = inner
      .replace(/<mat-hint\b([^>]*)>/g, '<ion-note$1>')
      .replace(/<\/mat-hint\s*>/g, '</ion-note>')
      .replace(/\bmatSuffix\b|\bmatIconSuffix\b/g, 'slot="end"')
      .replace(/\bmatPrefix\b|\bmatIconPrefix\b/g, 'slot="start"');
    if (/<ion-note/.test(inner)) needed.add('IonNote');

    return `<ion-item fill="outline"${cleaned}>${inner}</ion-item>`;
  });
}

function transform(source) {
  let s = source;
  const needed = new Set();

  // --- icons -------------------------------------------------------------
  s = s.replace(/<mat-icon([^>]*)>\s*([a-z0-9_]+)\s*<\/mat-icon>/g, (whole, attrs, ligature) => {
    const name = ICON_MAP[ligature];
    if (!name) return whole;
    needed.add('IonIcon');
    return `<ion-icon${attrs} name="${name}"></ion-icon>`;
  });

  // --- buttons -----------------------------------------------------------
  // Mark Material buttons first so plain <button> elements and mat-menu-item stay put.
  s = s
    .replace(/\bmat-icon-button\b/g, `${BTN} fill="clear"`)
    .replace(/\bmat-stroked-button\b/g, `${BTN} fill="outline"`)
    .replace(/\bmat-flat-button\b|\bmat-raised-button\b/g, BTN)
    .replace(/\bmat-button\b(?!-toggle)/g, `${BTN} fill="clear"`);

  s = s.replace(/<button\b([^>]*?)>/g, (whole, attrs) => {
    if (!attrs.includes(BTN)) return whole;
    needed.add('IonButton');
    const cleaned = attrs.replace(BTN, '').replace(/[ \t]+/g, ' ').replace(/ >$/, '>');
    return `<ion-button${cleaned}>`;
  });

  // Re-close only the buttons that were opened as ion-button, tracking nesting order.
  {
    const stack = [];
    s = s.replace(/<ion-button\b[^>]*>|<button\b[^>]*>|<\/button>/g, (tag) => {
      if (tag.startsWith('<ion-button')) {
        stack.push(true);
        return tag;
      }
      if (tag.startsWith('<button')) {
        stack.push(false);
        return tag;
      }
      return stack.pop() ? '</ion-button>' : tag;
    });
  }

  // --- tooltips ----------------------------------------------------------
  s = s
    .replace(/\[matTooltip\]="/g, '[attr.title]="')
    .replace(/\bmatTooltip="/g, 'title="')
    .replace(/\s*\[?matTooltipPosition\]?="[^"]*"/g, '');

  // --- compound elements, before the simple renames -----------------------
  s = s.replace(/<mat-(?:progress-)?spinner\b[^>]*><\/mat-(?:progress-)?spinner>/g, () => {
    needed.add('IonSpinner');
    return '<ion-spinner name="crescent"></ion-spinner>';
  });
  s = s.replace(/<mat-progress-bar\b([^>]*)><\/mat-progress-bar>/g, (whole, attrs) => {
    needed.add('IonProgressBar');
    return `<ion-progress-bar${attrs.replace(/mode="indeterminate"/, 'type="indeterminate"')}></ion-progress-bar>`;
  });
  s = s.replace(/<mat-divider\b[^>]*><\/mat-divider>/g, '<hr class="divider" />');
  s = s.replace(/<mat-chip-set\b/g, '<div').replace(/<\/mat-chip-set\s*>/g, '</div>');
  s = s
    .replace(/<mat-card-actions\b([^>]*)>/g, (whole, attrs) => {
      const cleaned = attrs.replace(/\s*align="[^"]*"/g, '');
      return /class="/.test(cleaned)
        ? `<div${cleaned.replace(/class="/, 'class="card-actions ')}>`
        : `<div class="card-actions"${cleaned}>`;
    })
    .replace(/<\/mat-card-actions\s*>/g, '</div>');

  // --- form fields and inputs -------------------------------------------
  s = convertInputs(s, needed);
  s = convertFormFields(s, needed);

  // --- simple element renames -------------------------------------------
  for (const [from, to, component] of [
    ['mat-card-subtitle', 'ion-card-subtitle', 'IonCardSubtitle'],
    ['mat-card-content', 'ion-card-content', 'IonCardContent'],
    ['mat-card-header', 'ion-card-header', 'IonCardHeader'],
    ['mat-card-title', 'ion-card-title', 'IonCardTitle'],
    ['mat-card', 'ion-card', 'IonCard'],
    ['mat-option', 'ion-select-option', 'IonSelectOption'],
    ['mat-select', 'ion-select', 'IonSelect'],
    ['mat-checkbox', 'ion-checkbox', 'IonCheckbox'],
    ['mat-slide-toggle', 'ion-toggle', 'IonToggle'],
    ['mat-chip', 'ion-chip', 'IonChip'],
  ]) {
    if (new RegExp(`<${from}[\\s>/]`).test(s)) {
      s = s.replace(new RegExp(`<${from}\\b`, 'g'), `<${to}`);
      // Prettier may wrap a closing tag as `</mat-option\n  >`, so allow whitespace.
      s = s.replace(new RegExp(`</${from}\\s*>`, 'g'), `</${to}>`);
      needed.add(component);
    }
  }

  // --- event handlers ----------------------------------------------------
  // Ionic components emit their own CustomEvents, with the payload under `detail`.
  s = s.replace(
    /<(ion-toggle|ion-checkbox|ion-select|ion-input|ion-textarea)\b([^>]*)>/g,
    (whole, tag, attrs) => {
      let a = attrs
        .replace(/\(change\)="/g, '(ionChange)="')
        .replace(/\(selectionChange\)="/g, '(ionChange)="');
      if (/\(ionChange\)/.test(a)) {
        a = a
          .replace(/\$event\.checked/g, '$event.detail.checked')
          .replace(/\$event\.value/g, '$event.detail.value');
      }
      return `<${tag}${a}>`;
    },
  );

  // --- imports -----------------------------------------------------------
  // Only drop a module once nothing in the file still needs it.
  const droppable = Object.entries(MODULE_GUARDS)
    .filter(([, guard]) => !guard.test(s))
    .map(([name]) => name);

  s = s.replace(/import \{([^}]*)\} from '@angular\/material\/[^']*';\n/g, (whole, names) => {
    const kept = names
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
      .filter((n) => !droppable.includes(n));
    return kept.length ? whole.replace(/\{[^}]*\}/, `{ ${kept.join(', ')} }`) : '';
  });

  s = s.replace(/(imports:\s*\[)([\s\S]*?)(\],?\n)/g, (whole, open, body, close) => {
    const kept = body
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
      .filter((n) => !droppable.includes(n));
    return `${open}${[...new Set([...kept, ...needed])].join(', ')}${close}`;
  });

  if (needed.size > 0) {
    if (/from '@ionic\/angular\/standalone'/.test(s)) {
      s = s.replace(/import \{([^}]*)\} from '@ionic\/angular\/standalone';/, (whole, names) => {
        const all = [
          ...new Set([
            ...names
              .split(',')
              .map((n) => n.trim())
              .filter(Boolean),
            ...needed,
          ]),
        ].sort();
        return `import { ${all.join(', ')} } from '@ionic/angular/standalone';`;
      });
    } else {
      const anchor = [...s.matchAll(/^import .*?;$/gm)].pop();
      const at = anchor.index + anchor[0].length;
      s = `${s.slice(0, at)}\nimport { ${[...needed].sort().join(', ')} } from '@ionic/angular/standalone';${s.slice(at)}`;
    }
  }

  return s;
}

const targets = process.argv.slice(2).flatMap(walk);
let changed = 0;
const manual = [];

for (const file of targets) {
  const before = readFileSync(file, 'utf8');
  if (!/@angular\/material/.test(before)) continue;

  const after = transform(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
  const remaining = STRUCTURAL.filter(([, re]) => re.test(after)).map(([label]) => label);
  if (remaining.length) manual.push(`  ${file}: ${remaining.join(', ')}`);
}

console.log(`Rewrote ${changed} file(s).`);
if (manual.length) console.log(`Still needs a human: ${manual.length} file(s).`);
