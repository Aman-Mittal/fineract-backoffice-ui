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
 * Verifies the application's dependency on the generated OpenAPI client.
 *
 * ## Why this exists
 *
 * ADR 0001 stabilised generated *method names* by preprocessing the spec, and explicitly
 * rejected a hand-written facade over the ~54 generated services. That decision stands: this
 * script is not a facade. It is the other half of the same boundary — a manifest of the
 * generated operations the application actually calls, checked against the generated client.
 *
 * ADR 0001 solved churn caused by the *generator*. It does not cover change originating
 * upstream: when Fineract removes or renames an endpoint, the generated client loses the
 * method and the application fails to compile across every feature that called it, with no
 * single diagnostic saying which endpoint went away. This script turns that into one message
 * naming the operation, the service, and the callers.
 *
 * ## Modes
 *
 *   node scripts/check-api-surface.mjs           verify the manifest (exit 1 on drift)
 *   node scripts/check-api-surface.mjs --write    rewrite the manifest from current source
 *
 * `--write` is for deliberate changes: adopting a new endpoint, or accepting an upstream
 * removal once the callers have been migrated.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = 'src';
const GENERATED_API_DIR = join(SRC, 'app/api/api');
const MANIFEST = join(SRC, 'app/core/adapters/api/api-surface.json');

/** Walks `dir`, yielding hand-written `.ts` sources — the generated client is not a caller. */
function* sources(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full.replaceAll('\\', '/').includes('src/app/api')) continue;
      yield* sources(full);
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
      yield full;
    }
  }
}

/**
 * Reads the operations each generated service declares.
 *
 * Parsing the emitted TypeScript rather than the spec is deliberate: what breaks the build is
 * the method the generator produced, and the two can disagree when generator options change.
 */
function generatedOperations() {
  const byService = new Map();
  for (const file of readdirSync(GENERATED_API_DIR)) {
    if (!file.endsWith('.service.ts')) continue;
    const source = readFileSync(join(GENERATED_API_DIR, file), 'utf8');
    const className = /export class (\w+)/.exec(source)?.[1];
    if (!className) continue;
    const methods = new Set(
      [...source.matchAll(/^\s{4}public (\w+)\(/gm)].map((match) => match[1]),
    );
    byService.set(className, methods);
  }
  return byService;
}

/**
 * Finds calls to generated services in hand-written code.
 *
 * Resolution is receiver-scoped: a field is tied to its service by its `inject(...)` site, and
 * only calls through that field count. A bare `.getClients(` elsewhere in the file is not
 * attributed, which keeps the manifest free of false entries that would then have to be
 * explained away.
 */
function calledOperations() {
  const byService = new Map();
  const callers = new Map();

  for (const file of sources(SRC)) {
    const source = readFileSync(file, 'utf8');
    const fields = [
      ...source.matchAll(
        /(?:private |protected |public )?(?:readonly )?(\w+)\s*=\s*inject\((\w+Service)\)/g,
      ),
    ];

    for (const [, field, service] of fields) {
      // `\s*` around the dot on purpose: Prettier breaks a long call onto its own line, leaving
      // `this.tellerService\n  .getTellersTellerIdCashiers(`. Requiring the two to be adjacent
      // missed every wrapped call, so regenerating the manifest silently dropped operations that
      // are still called — quietly narrowing the drift check instead of failing loudly.
      const calls = source.matchAll(new RegExp(`this\\.${field}\\s*\\.\\s*(\\w+)\\(`, 'g'));
      for (const [, operation] of calls) {
        if (!byService.has(service)) byService.set(service, new Set());
        byService.get(service).add(operation);
        const key = `${service}.${operation}`;
        if (!callers.has(key)) callers.set(key, new Set());
        callers.get(key).add(relative(SRC, file));
      }
    }
  }
  return { byService, callers };
}

function buildManifest(generated, called) {
  const manifest = {};
  for (const [service, operations] of [...called.byService].sort()) {
    if (!generated.has(service)) continue; // hand-written service, not part of this boundary
    const used = [...operations].filter((op) => generated.get(service).has(op)).sort();
    if (used.length > 0) manifest[service] = used;
  }
  return manifest;
}

const generated = generatedOperations();
const called = calledOperations();
const current = buildManifest(generated, called);

if (process.argv.includes('--write')) {
  const total = Object.values(current).reduce((sum, ops) => sum + ops.length, 0);
  writeFileSync(MANIFEST, `${JSON.stringify(current, null, 2)}\n`);
  console.log(`Wrote ${MANIFEST}: ${Object.keys(current).length} services, ${total} operations.`);
  process.exit(0);
}

if (!existsSync(MANIFEST)) {
  console.error(`Missing ${MANIFEST}. Run: node scripts/check-api-surface.mjs --write`);
  process.exit(1);
}

const recorded = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const failures = [];

// 1. Every recorded operation must still exist on the generated client. This is the check that
//    catches an upstream endpoint removal before it becomes 40 compile errors.
for (const [service, operations] of Object.entries(recorded)) {
  const available = generated.get(service);
  if (!available) {
    failures.push(`Generated service ${service} no longer exists (recorded in the manifest).`);
    continue;
  }
  for (const operation of operations) {
    if (!available.has(operation)) {
      const users = [...(called.callers.get(`${service}.${operation}`) ?? ['no current caller'])];
      failures.push(
        `${service}.${operation} is gone from the generated client.\n` +
          `      called from: ${users.join(', ')}`,
      );
    }
  }
}

// 2. The manifest must list everything the application calls. A new call that nobody recorded
//    means the boundary stopped describing reality, and the check above stops being a guard.
for (const [service, operations] of Object.entries(current)) {
  const known = new Set(recorded[service] ?? []);
  for (const operation of operations) {
    if (!known.has(operation)) {
      failures.push(
        `${service}.${operation} is called but not recorded. ` +
          `Run: node scripts/check-api-surface.mjs --write`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error('API surface check failed:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(`\n${failures.length} problem(s). See DOCS/adr/0003-adapter-boundary.md`);
  process.exit(1);
}

const total = Object.values(recorded).reduce((sum, ops) => sum + ops.length, 0);
console.log(
  `API surface OK: ${Object.keys(recorded).length} generated services, ${total} operations.`,
);
