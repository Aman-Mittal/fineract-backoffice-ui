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
 * Summarises what changed between two Fineract OpenAPI specs, as Markdown.
 *
 * The point is the *removed* operations. ADR-0001 records a spec bump that broke
 * 137 call sites across 63 components; the breakage is invisible in a 140k-line
 * generated diff but obvious in a list of methods that no longer exist. Because
 * the generator derives method names from method+path through
 * preprocess-spec.mjs, this can name the exact TypeScript methods that disappear
 * and count their call sites — before anyone merges.
 *
 *   node scripts/spec-diff-summary.mjs <old-spec.json> <new-spec.json>
 *
 * Writes Markdown to stdout and, like scripts/e2e-summary.mjs, never exits
 * non-zero: it is a reporting aid, and a crash here must not fail a sync that
 * otherwise succeeded.
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

import { deterministicName } from './preprocess-spec.mjs';

const HTTP_METHODS = new Set(['get', 'put', 'post', 'delete', 'patch', 'head', 'options']);

function read(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

/** `Map<"GET /loans/{id}", operation>` for every operation in the document. */
function operations(spec) {
  const found = new Map();
  for (const [path, item] of Object.entries(spec?.paths ?? {})) {
    for (const [method, operation] of Object.entries(item ?? {})) {
      if (HTTP_METHODS.has(method)) {
        found.set(`${method.toUpperCase()} ${path}`, operation);
      }
    }
  }
  return found;
}

/** Files referencing `.<name>(`, so a removed operation's blast radius is visible. */
function callSites(methodName) {
  try {
    const out = execFileSync('grep', ['-rn', '--include=*.ts', `\\.${methodName}(`, 'src'], {
      encoding: 'utf8',
    });
    return out.trim().split('\n').filter(Boolean);
  } catch {
    // grep exits 1 when nothing matches, which is the common and healthy case.
    return [];
  }
}

function table(rows) {
  return ['| | added | removed | changed |', '|---|---|---|---|', ...rows].join('\n');
}

function main() {
  const [oldFile, newFile] = process.argv.slice(2);
  const oldSpec = read(oldFile);
  const newSpec = read(newFile);

  if (!oldSpec || !newSpec) {
    console.log('_Could not read both specs, so no diff summary was produced._');
    return;
  }

  const before = operations(oldSpec);
  const after = operations(newSpec);

  const added = [...after.keys()].filter((k) => !before.has(k)).sort();
  const removed = [...before.keys()].filter((k) => !after.has(k)).sort();
  const changed = [...after.keys()].filter(
    (k) => before.has(k) && JSON.stringify(before.get(k)) !== JSON.stringify(after.get(k)),
  );

  const oldSchemas = Object.keys(oldSpec.components?.schemas ?? {});
  const newSchemas = Object.keys(newSpec.components?.schemas ?? {});
  const addedSchemas = newSchemas.filter((s) => !oldSchemas.includes(s));
  const removedSchemas = oldSchemas.filter((s) => !newSchemas.includes(s));

  const lines = ['### API surface diff', ''];
  lines.push(
    table([
      `| paths | ${Object.keys(newSpec.paths ?? {}).length - Object.keys(oldSpec.paths ?? {}).length >= 0 ? '+' : ''}${Object.keys(newSpec.paths ?? {}).length - Object.keys(oldSpec.paths ?? {}).length} | | |`,
      `| operations | ${added.length} | ${removed.length} | ${changed.length} |`,
      `| schemas | ${addedSchemas.length} | ${removedSchemas.length} | |`,
    ]),
  );
  lines.push('');

  if (removed.length) {
    lines.push('#### ⚠️ Removed operations — these generated methods disappear', '');
    lines.push('| operation | generated method | call sites in `src/` |');
    lines.push('|---|---|---|');
    const details = [];
    for (const key of removed) {
      const [method, path] = key.split(' ');
      const name = deterministicName(method.toLowerCase(), path);
      const sites = callSites(name);
      const count = sites.length ? `**${sites.length}**` : '0';
      lines.push(`| \`${key}\` | \`${name}\` | ${count} |`);
      if (sites.length) details.push(...sites);
    }
    lines.push('');
    if (details.length) {
      lines.push('<details><summary>Exact call sites</summary>', '', '```');
      lines.push(...details.slice(0, 100));
      if (details.length > 100) lines.push(`…and ${details.length - 100} more`);
      lines.push('```', '</details>', '');
    }
  } else {
    lines.push('No operations were removed, so no existing call site can break.', '');
  }

  if (added.length) {
    lines.push('<details><summary>Added operations</summary>', '', '```');
    lines.push(...added.slice(0, 100));
    if (added.length > 100) lines.push(`…and ${added.length - 100} more`);
    lines.push('```', '</details>', '');
  }

  console.log(lines.join('\n'));
}

try {
  main();
} catch (error) {
  console.log(`_Diff summary failed: ${error.message}_`);
}
