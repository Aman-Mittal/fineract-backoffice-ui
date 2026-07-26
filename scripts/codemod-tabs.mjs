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
 * mat-tab-group -> ion-segment.
 *
 * Ionic's ion-tabs is for routed, app-level navigation; the in-page equivalent of a
 * Material tab group is a segment plus conditional content. mat-tab-group tracks the
 * selected tab internally, so each converted component gains a signal to hold it.
 *
 * Nested groups are converted innermost-first. Anything that cannot be parsed is reported
 * rather than half-rewritten.
 *
 * TEMPORARY: delete once the migration is finished.
 *
 * Usage: node scripts/codemod-tabs.mjs <file-or-dir> [...]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(target) {
  if (statSync(target).isFile()) return target.endsWith('.ts') ? [target] : [];
  return readdirSync(target).flatMap((e) => walk(join(target, e)));
}

/** Finds the innermost `<mat-tab-group ...>…</mat-tab-group>` span, or null. */
function innermostGroup(s) {
  const opens = [...s.matchAll(/<mat-tab-group\b[^>]*>/g)];
  if (opens.length === 0) return null;

  for (const open of [...opens].reverse()) {
    const start = open.index;
    let depth = 0;
    const re = /<mat-tab-group\b[^>]*>|<\/mat-tab-group>/g;
    re.lastIndex = start;
    let m;
    while ((m = re.exec(s))) {
      if (m[0].startsWith('</')) {
        depth--;
        if (depth === 0) {
          const inner = s.slice(open.index + open[0].length, m.index);
          if (!/<mat-tab-group\b/.test(inner)) {
            return { start, end: m.index + m[0].length, body: inner };
          }
          break;
        }
      } else depth++;
    }
  }
  return null;
}

/** Splits a tab-group body into its direct `<mat-tab>` children. */
function splitTabs(body) {
  const tabs = [];
  const re = /<mat-tab\b(?!-)([^>]*)>/g;
  let m;
  while ((m = re.exec(body))) {
    const attrs = m[1];
    let depth = 0;
    const inner = /<mat-tab\b(?!-)[^>]*>|<\/mat-tab>/g;
    inner.lastIndex = m.index;
    let t;
    while ((t = inner.exec(body))) {
      if (t[0].startsWith('</')) {
        depth--;
        if (depth === 0) {
          tabs.push({ attrs, content: body.slice(m.index + m[0].length, t.index) });
          re.lastIndex = t.index + t[0].length;
          break;
        }
      } else depth++;
    }
    if (!t) return null;
  }
  return tabs.length ? tabs : null;
}

function labelExpression(attrs) {
  const bound = attrs.match(/\[label\]="([^"]+)"/);
  if (bound) return `{{ ${bound[1]} }}`;
  const literal = attrs.match(/\blabel="([^"]*)"/);
  return literal ? literal[1] : '';
}

function transform(source, file, failures) {
  let s = source;
  let signalsAdded = 0;

  for (let guard = 0; guard < 10; guard++) {
    const group = innermostGroup(s);
    if (!group) break;

    const tabs = splitTabs(group.body);
    if (!tabs) {
      failures.push(`  ${file}: could not parse a mat-tab-group`);
      return source;
    }

    const name = signalsAdded === 0 ? 'activeTab' : `activeTab${signalsAdded + 1}`;
    signalsAdded++;

    const buttons = tabs
      .map(
        (t, i) =>
          `        <ion-segment-button value="${i}">\n` +
          `          <ion-label>${labelExpression(t.attrs)}</ion-label>\n` +
          `        </ion-segment-button>`,
      )
      .join('\n');

    const panels = tabs
      .map(
        (t, i) =>
          `      @if (${name}() === '${i}') {\n${t.content.trimEnd()}\n      }`,
      )
      .join('\n');

    const replacement =
      `<ion-segment\n` +
      `        [value]="${name}()"\n` +
      `        (ionChange)="${name}.set($any($event).detail.value)"\n` +
      `      >\n${buttons}\n      </ion-segment>\n\n${panels}`;

    s = s.slice(0, group.start) + replacement + s.slice(group.end);
  }

  if (signalsAdded === 0) return source;

  // Each converted group needs a signal to hold its selected tab.
  const decls = Array.from(
    { length: signalsAdded },
    (unused, i) =>
      `  /** Selected tab; mat-tab-group tracked this internally, ion-segment does not. */\n` +
      `  readonly ${i === 0 ? 'activeTab' : `activeTab${i + 1}`} = signal('0');`,
  ).join('\n');

  s = s.replace(/(export class \w+[^{]*\{\n)/, `$1${decls}\n`);

  // Imports.
  s = s
    .replace(/import \{[^}]*MatTabsModule[^}]*\} from '@angular\/material\/tabs';\n/g, '')
    .replace(/\s*MatTabsModule,/g, '');

  if (/from '@ionic\/angular\/standalone'/.test(s)) {
    s = s.replace(/import \{([^}]*)\} from '@ionic\/angular\/standalone';/, (whole, names) => {
      const all = [
        ...new Set([
          ...names.split(',').map((n) => n.trim()).filter(Boolean),
          'IonSegment',
          'IonSegmentButton',
          'IonLabel',
        ]),
      ].sort();
      return `import { ${all.join(', ')} } from '@ionic/angular/standalone';`;
    });
  } else {
    const anchor = [...s.matchAll(/^import .*?;$/gm)].pop();
    const at = anchor.index + anchor[0].length;
    s = `${s.slice(0, at)}\nimport { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';${s.slice(at)}`;
  }

  s = s.replace(/(imports:\s*\[)([\s\S]*?)(\],?\n)/, (whole, open, body, close) => {
    const existing = body.split(',').map((n) => n.trim()).filter(Boolean);
    return `${open}${[...new Set([...existing, 'IonSegment', 'IonSegmentButton', 'IonLabel'])].join(', ')}${close}`;
  });

  if (!/\bsignal\b/.test(s.split('@Component')[0])) {
    s = s.replace(
      /import \{([^}]*)\} from '@angular\/core';/,
      (whole, names) =>
        `import { ${[...new Set([...names.split(',').map((n) => n.trim()).filter(Boolean), 'signal'])].join(', ')} } from '@angular/core';`,
    );
  }

  return s;
}

const targets = process.argv.slice(2).flatMap(walk);
const failures = [];
let changed = 0;

for (const file of targets) {
  const before = readFileSync(file, 'utf8');
  if (!/<mat-tab-group/.test(before)) continue;
  const after = transform(before, file, failures);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}

console.log(`Converted tab groups in ${changed} file(s).`);
if (failures.length) console.log(failures.join('\n'));
