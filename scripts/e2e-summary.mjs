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
 * Renders the Playwright JSON report as Markdown for the run summary and the PR
 * comment. Prints to stdout; the workflow redirects it.
 *
 * Never exits non-zero: this is reporting, and it runs with `if: always()`, so a
 * missing or malformed report must not turn a passing run red or mask a real
 * failure with a crash here.
 */

import { readFileSync } from 'node:fs';

const REPORT = process.env.PLAYWRIGHT_JSON_OUTPUT_NAME ?? 'playwright-results.json';

function collect(suite, out) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const result = test.results?.[test.results.length - 1];
      out.push({
        title: [...(suite.title ? [suite.title] : []), spec.title].join(' › '),
        file: spec.file ?? suite.file ?? '',
        status: test.status === 'skipped' ? 'skipped' : (result?.status ?? test.status),
        expected: test.expectedStatus,
        durationMs: result?.duration ?? 0,
        error: result?.error?.message ?? '',
      });
    }
  }
  for (const child of suite.suites ?? []) collect(child, out);
}

function main() {
  let report;
  try {
    report = JSON.parse(readFileSync(REPORT, 'utf8'));
  } catch {
    console.log('## 🎭 E2E Tests\n\nNo Playwright JSON report was produced.');
    return;
  }

  const tests = [];
  for (const suite of report.suites ?? []) collect(suite, tests);

  const passed = tests.filter((t) => t.status === 'passed' && t.expected !== 'skipped').length;
  const failed = tests.filter((t) => t.status === 'failed' || t.status === 'timedOut');
  const skipped = tests.filter((t) => t.status === 'skipped').length;
  const seconds = Math.round((report.stats?.duration ?? 0) / 1000);

  const verdict = failed.length === 0 ? '✅ All green' : `❌ ${failed.length} failing`;
  const lines = [
    '## 🎭 E2E Tests',
    '',
    `**${verdict}** — ${passed} passed · ${failed.length} failed · ${skipped} skipped, in ${seconds}s.`,
    '',
    '| Result | Count |',
    '| --- | ---: |',
    `| ✅ Passed | ${passed} |`,
    `| ❌ Failed | ${failed.length} |`,
    `| ⏭️ Skipped | ${skipped} |`,
  ];

  if (failed.length) {
    lines.push('', '### Failures', '');
    for (const t of failed.slice(0, 20)) {
      const first = t.error.split('\n').find((l) => l.trim()) ?? '';
      lines.push(`- **${t.title}** \`${t.file}\``);
      if (first) lines.push(`  - ${first.replace(/\s+/g, ' ').slice(0, 200)}`);
    }
    if (failed.length > 20) lines.push(`- …and ${failed.length - 20} more.`);
  }

  if (skipped) {
    lines.push(
      '',
      `<sub>Skipped specs need a seeded backend (\`FINERACT_SEEDED_BACKEND=1\`) or are marked \`fixme\`.</sub>`,
    );
  }

  console.log(lines.join('\n'));
}

main();
