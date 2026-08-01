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
 * Finds component state that is assigned from an async callback but held in a plain
 * field rather than a signal.
 *
 * This app renders outside the Angular zone, so an HTTP callback never marks the view
 * dirty: whatever it assigns is invisible until some unrelated interaction happens to
 * trigger change detection. A signal marks its own consumers dirty and is therefore
 * correct either way. Components that already use signals (client-form's office list)
 * render on the same page load where plain-field components (loan-product-form's
 * dropdowns) stay empty.
 *
 * Reports `this.x = …` assignments that occur inside a `.subscribe(...)` argument
 * where `x` is also referenced by the component's template. Uses the TypeScript
 * parser rather than a regex: a regex cannot tell a nested `.subscribe` from the one
 * it is looking at, and false positives here cost real review time.
 *
 *   node scripts/audit-async-state.mjs [--json]
 */

import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import ts from 'typescript';

const AS_JSON = process.argv.includes('--json');

const files = globSync('src/app/**/*.ts').filter(
  (f) => !f.includes('/api/') && !f.endsWith('.spec.ts'),
);

/** Field names assigned via `this.<name> = …` anywhere inside `node`. */
function assignedFields(node) {
  const names = new Set();
  const walk = (n) => {
    if (
      ts.isBinaryExpression(n) &&
      n.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isPropertyAccessExpression(n.left) &&
      n.left.expression.kind === ts.SyntaxKind.ThisKeyword
    ) {
      names.add(n.left.name.text);
    }
    ts.forEachChild(n, walk);
  };
  walk(node);
  return names;
}

const findings = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (!text.includes('.subscribe(')) continue;

  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);

  // The inline template, so we only report state the view actually reads.
  const templateMatch = /template:\s*`([\s\S]*?)`\s*,\n/.exec(text);
  const template = templateMatch ? templateMatch[1] : '';
  if (!template) continue;

  // Fields already declared as signals are fine by construction.
  const signalFields = new Set();
  for (const m of text.matchAll(
    /(?:readonly\s+)?(\w+)\s*=\s*(?:signal|computed|toSignal)\s*[<(]/g,
  )) {
    signalFields.add(m[1]);
  }

  const flagged = new Set();
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'subscribe'
    ) {
      for (const arg of node.arguments) {
        for (const name of assignedFields(arg)) {
          if (signalFields.has(name)) continue;
          // Referenced by the template? Word-boundary match on the bare name.
          if (!new RegExp(`\\b${name}\\b`).test(template)) continue;
          flagged.add(name);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  if (flagged.size) findings.push({ file, fields: [...flagged].sort() });
}

findings.sort((a, b) => b.fields.length - a.fields.length || a.file.localeCompare(b.file));

if (AS_JSON) {
  console.log(JSON.stringify(findings, null, 2));
} else {
  const total = findings.reduce((n, f) => n + f.fields.length, 0);
  console.log(`${total} plain fields across ${findings.length} components are assigned`);
  console.log('asynchronously and read by their template.\n');
  for (const { file, fields } of findings) {
    console.log(`${String(fields.length).padStart(3)}  ${file}`);
    console.log(`     ${fields.join(', ')}`);
  }
}
