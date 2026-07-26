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
 * MatDialog -> Ionic ModalController / DialogService.
 *
 * Dialog components take their payload as an @Input instead of MAT_DIALOG_DATA — Ionic
 * passes componentProps straight onto the instance — and dismiss through ModalController.
 * Callers move to DialogService, whose open() resolves with the dismiss payload, so
 * afterClosed().subscribe() becomes .then().
 *
 * TEMPORARY: delete once the migration is finished.
 *
 * Usage: node scripts/codemod-dialog.mjs <file-or-dir> [...]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

function walk(target) {
  if (statSync(target).isFile()) return target.endsWith('.ts') ? [target] : [];
  return readdirSync(target).flatMap((e) => walk(join(target, e)));
}

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

function addIonic(s, names) {
  if (/from '@ionic\/angular\/standalone'/.test(s)) {
    return s.replace(/import \{([^}]*)\} from '@ionic\/angular\/standalone';/, (whole, existing) => {
      const all = [
        ...new Set([...existing.split(',').map((n) => n.trim()).filter(Boolean), ...names]),
      ].sort();
      return `import { ${all.join(', ')} } from '@ionic/angular/standalone';`;
    });
  }
  return addImport(s, `import { ${[...names].sort().join(', ')} } from '@ionic/angular/standalone';`);
}

/** A dialog component: MatDialogRef / MAT_DIALOG_DATA. */
function convertComponent(s, file) {
  if (!/MatDialogRef|MAT_DIALOG_DATA/.test(s)) return s;

  // Template chrome.
  s = s
    .replace(/<h2\b[^>]*\bmat-dialog-title\b[^>]*>/g, '<h2 class="dialog-title">')
    .replace(/<mat-dialog-content\b[^>]*>/g, '<div class="dialog-content">')
    .replace(/<\/mat-dialog-content\s*>/g, '</div>')
    .replace(/<mat-dialog-actions\b([^>]*)>/g, () => '<div class="dialog-actions">')
    .replace(/<\/mat-dialog-actions\s*>/g, '</div>')
    .replace(/\s*\bmat-dialog-close\b(="[^"]*")?/g, '');

  // MAT_DIALOG_DATA becomes an @Input, since Ionic assigns componentProps to the instance.
  s = s.replace(
    /(?:public |private |protected )?(?:readonly )?data\s*=\s*inject<([^>]+)>\(MAT_DIALOG_DATA\);/g,
    (whole, type) => `@Input({ required: true }) data!: ${type};`,
  );
  s = s.replace(
    /(?:public |private |protected )?(?:readonly )?(\w+)\s*:\s*([\w<>[\]| ]+)\s*=\s*inject\(MAT_DIALOG_DATA\);/g,
    (whole, name, type) => `@Input({ required: true }) ${name}!: ${type};`,
  );
  s = s.replace(
    /(?:public |private |protected )?(?:readonly )?(\w+)\s*=\s*inject\(MAT_DIALOG_DATA\);/g,
    (whole, name) => `@Input({ required: true }) ${name}!: Record<string, unknown>;`,
  );

  // MatDialogRef becomes ModalController.
  s = s
    .replace(
      /(private |protected |)readonly dialogRef = inject\(MatDialogRef<[^>]*>\);/g,
      (whole, mods) => `${mods}readonly modalController = inject(ModalController);`,
    )
    .replace(
      /(private |protected |)dialogRef = inject\(MatDialogRef<[^>]*>\);/g,
      (whole, mods) => `${mods}modalController = inject(ModalController);`,
    )
    .replace(/this\.dialogRef\.close\(/g, 'this.modalController.dismiss(')
    .replace(/\bdialogRef\.close\(/g, 'modalController.dismiss(');

  s = addIonic(s, ['ModalController']);

  if (/@Input\(/.test(s) && !/import \{[^}]*\bInput\b[^}]*\} from '@angular\/core';/.test(s)) {
    s = s.replace(
      /import \{([^}]*)\} from '@angular\/core';/,
      (whole, names) =>
        `import { ${[...new Set([...names.split(',').map((n) => n.trim()).filter(Boolean), 'Input'])].join(', ')} } from '@angular/core';`,
    );
  }
  return s;
}

/** Reads a balanced `{...}` starting at `i`, which must be the opening brace. */
function readObject(s, i) {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return { text: s.slice(i, j + 1), end: j + 1 };
    }
  }
  return null;
}

/**
 * A caller: `dialog.open(X, {...})` followed by `afterClosed().subscribe(...)`.
 *
 * The config object is read by balancing braces rather than by regex — a `data` value can
 * contain a template literal such as `${x.toUpperCase()}_CLIENT`, whose closing brace ends
 * a lazy match in the wrong place.
 */
function convertCaller(s, file) {
  if (!/inject\(MatDialog\)/.test(s)) return s;

  let converted = false;
  const openCall = /(?:const (\w+) = )?this\.(\w*[Dd]ialog\w*)\.open\(\s*(\w+)\s*,\s*/g;
  let m;

  while ((m = openCall.exec(s))) {
    const braceAt = s.indexOf('{', m.index + m[0].length - 1);
    if (braceAt === -1) continue;
    const obj = readObject(s, braceAt);
    if (!obj) continue;

    // Pull out `data: {...}`, again by balancing braces.
    let props = 'undefined';
    const dataKey = obj.text.indexOf('data:');
    if (dataKey !== -1) {
      const dataBrace = obj.text.indexOf('{', dataKey);
      const data = dataBrace !== -1 ? readObject(obj.text, dataBrace) : null;
      if (data) props = `{ data: ${data.text} }`;
    }

    const after = s.slice(obj.end);
    const ref = m[1];
    const tail = ref
      ? new RegExp(`^\\s*\\);\\s*\\n\\s*${ref}\\.afterClosed\\(\\)\\s*\\.subscribe\\(\\s*\\(([^)]*)\\)\\s*=>\\s*\\{`)
      : /^\s*\)\s*\.afterClosed\(\)\s*\.subscribe\(\s*\(([^)]*)\)\s*=>\s*\{/;
    const t = after.match(tail);
    if (!t) continue;

    const replacement = `this.dialogService.open(${m[3]}, ${props}).then((${t[1]}) => {`;
    s = s.slice(0, m.index) + replacement + after.slice(t[0].length);
    openCall.lastIndex = m.index + replacement.length;
    converted = true;
  }

  if (converted) {
    s = s
      .replace(
        /(private |protected |)readonly \w*dialog\w* = inject\(MatDialog\);/gi,
        (whole, mods) => `${mods}readonly dialogService = inject(DialogService);`,
      )
      .replace(
        /(private |protected |)\w*dialog\w* = inject\(MatDialog\);/gi,
        (whole, mods) => `${mods}dialogService = inject(DialogService);`,
      );
    s = addImport(s, `import { DialogService } from '${importPath(file, 'core/services/dialog.service')}';`);
  }
  return s;
}

function cleanImports(s) {
  if (/MatDialog\b|MAT_DIALOG_DATA|mat-dialog-/.test(s)) return s;
  return s
    .replace(/import \{[^}]*\} from '@angular\/material\/dialog';\n/g, '')
    .replace(/\s*MatDialogModule,/g, '');
}

const targets = process.argv.slice(2).flatMap(walk);
let changed = 0;

for (const file of targets) {
  const before = readFileSync(file, 'utf8');
  if (!/MatDialog|mat-dialog-/.test(before)) continue;

  let after = convertComponent(before, file);
  after = convertCaller(after, file);
  after = cleanImports(after);

  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}

console.log(`Converted dialogs in ${changed} file(s).`);
