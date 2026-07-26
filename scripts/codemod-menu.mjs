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
 * mat-menu -> ion-popover.
 *
 * Material wires a menu to its trigger through a template reference; Ionic wires a popover
 * to a DOM id. So `[matMenuTriggerFor]="fooMenu"` becomes `id="fooMenu-trigger"` on the
 * button and `trigger="fooMenu-trigger"` on the popover.
 *
 * TEMPORARY: delete once the migration is finished.
 *
 * Usage: node scripts/codemod-menu.mjs <file-or-dir> [...]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(target) {
  if (statSync(target).isFile()) return target.endsWith('.ts') ? [target] : [];
  return readdirSync(target).flatMap((e) => walk(join(target, e)));
}

/** Finds a balanced `<mat-menu …>…</mat-menu>` span. */
function findMenu(s) {
  const open = s.match(/<mat-menu\b[^>]*>/);
  if (!open) return null;
  const start = s.indexOf(open[0]);
  let depth = 0;
  const re = /<mat-menu\b[^>]*>|<\/mat-menu>/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(s))) {
    if (m[0].startsWith('</')) {
      depth--;
      if (depth === 0) {
        return {
          start,
          end: m.index + m[0].length,
          openTag: open[0],
          body: s.slice(start + open[0].length, m.index),
        };
      }
    } else depth++;
  }
  return null;
}

function convertItems(body) {
  return body
    .replace(/<button\b([^>]*?)\bmat-menu-item\b([^>]*?)>/g, (whole, before, after) => {
      const attrs = `${before} ${after}`.replace(/\s+/g, ' ').trimEnd();
      return `<ion-item button${attrs ? ' ' + attrs.trim() : ''}>`;
    })
    .replace(/<\/button\s*>/g, '</ion-item>')
    // A menu item's text sits in a <span>; ion-item wants an ion-label.
    .replace(/<span>([\s\S]*?)<\/span>/g, '<ion-label>$1</ion-label>')
    // Leading icons need an explicit slot inside ion-item.
    .replace(/<ion-icon\b((?:(?!slot=)[^>])*?)>/g, '<ion-icon slot="start"$1>');
}

function transform(source) {
  let s = source;
  let converted = false;

  for (let guard = 0; guard < 12; guard++) {
    const menu = findMenu(s);
    if (!menu) break;

    const ref = menu.openTag.match(/#(\w+)\s*=\s*"matMenu"/);
    if (!ref) break;
    const trigger = `${ref[1]}-trigger`;

    const popover =
      `<ion-popover trigger="${trigger}" [dismissOnSelect]="true">\n` +
      `        <ng-template>\n` +
      `          <ion-list>${convertItems(menu.body)}</ion-list>\n` +
      `        </ng-template>\n` +
      `      </ion-popover>`;

    s = s.slice(0, menu.start) + popover + s.slice(menu.end);
    s = s.replace(new RegExp(`\\[matMenuTriggerFor\\]="${ref[1]}"`, 'g'), `id="${trigger}"`);
    converted = true;
  }

  if (!converted) return source;

  const needed = ['IonPopover', 'IonList', 'IonItem', 'IonLabel'];
  s = s
    .replace(/import \{[^}]*MatMenuModule[^}]*\} from '@angular\/material\/menu';\n/g, '')
    .replace(/\s*MatMenuModule,/g, '');

  if (/from '@ionic\/angular\/standalone'/.test(s)) {
    s = s.replace(/import \{([^}]*)\} from '@ionic\/angular\/standalone';/s, (whole, names) => {
      const all = [
        ...new Set([...names.split(',').map((n) => n.trim()).filter(Boolean), ...needed]),
      ].sort();
      return `import { ${all.join(', ')} } from '@ionic/angular/standalone';`;
    });
  } else {
    const anchor = [...s.matchAll(/^import .*?;$/gm)].pop();
    const at = anchor.index + anchor[0].length;
    s = `${s.slice(0, at)}\nimport { ${needed.sort().join(', ')} } from '@ionic/angular/standalone';${s.slice(at)}`;
  }

  s = s.replace(/(imports:\s*\[)([\s\S]*?)(\],?\n)/, (whole, open, body, close) => {
    const existing = body.split(',').map((n) => n.trim()).filter(Boolean);
    return `${open}${[...new Set([...existing, ...needed])].join(', ')}${close}`;
  });

  return s;
}

const targets = process.argv.slice(2).flatMap(walk);
let changed = 0;
for (const file of targets) {
  const before = readFileSync(file, 'utf8');
  if (!/<mat-menu\b/.test(before)) continue;
  const after = transform(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}
console.log(`Converted menus in ${changed} file(s).`);
