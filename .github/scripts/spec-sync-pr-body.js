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
 * Builds the body of the spec-sync pull request.
 *
 * A separate file so the workflow never interpolates ${{ }} into a script, and so
 * the wording can be changed without touching YAML. Everything arrives through
 * the environment. Writes Markdown to stdout.
 */
const fs = require('node:fs');

const read = (path, fallback = '') => {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch {
    return fallback;
  }
};

const provenance = JSON.parse(read('public/api/fineract.provenance.json', '{}'));
const diff = read('/tmp/spec-diff.md', '_No diff summary was produced._');
const buildLog = read('/tmp/build.log', '');
const buildFailed = process.env.BUILD_OUTCOME === 'failure';

const errorCount = (buildLog.match(/error TS/g) || []).length;
const commit = provenance.source?.commit;
const commitCell =
  commit && commit !== 'unknown'
    ? `[\`${commit.slice(0, 7)}\`](https://github.com/apache/fineract/commit/${commit})`
    : '_unknown_';

const lines = [
  '<!-- fineract-spec-sync -->',
  "Apache Fineract's OpenAPI spec has changed. This regenerates `src/app/api/` from it.",
  '',
  '| | |',
  '|---|---|',
  `| Spec version | \`${provenance.spec?.infoVersion ?? '?'}\` |`,
  `| Upstream commit | ${commitCell} |`,
  `| Image | \`${process.env.IMAGE_REF ?? '?'}\` |`,
  `| Paths / operations / schemas | ${provenance.spec?.pathCount ?? '?'} / ${provenance.spec?.operationCount ?? '?'} / ${provenance.spec?.schemaCount ?? '?'} |`,
  `| Run | ${process.env.RUN_URL ?? ''} |`,
  '',
];

lines.push('### Compile check', '');
if (buildFailed) {
  lines.push(
    `❌ **\`npm run build\` failed${errorCount ? ` — ${errorCount} TypeScript errors` : ''}.**`,
    '',
    'This is the expected outcome when upstream removes or renames an endpoint, and it',
    'is the reason this PR is worth opening: the errors below are precisely the call',
    'sites that need attention. See the removed operations in the diff.',
    '',
    '<details><summary>Build output (last 80 lines)</summary>',
    '',
    '```',
    buildLog.trimEnd().split('\n').slice(-80).join('\n'),
    '```',
    '</details>',
    '',
  );
} else {
  lines.push('✅ `npm run build` passed — no call site was broken by this change.', '');
}

lines.push(
  diff,
  '',
  '---',
  '',
  'Provenance for this spec is recorded in `public/api/fineract.provenance.json`.',
  'See [`DOCS/OPENAPI_GENERATOR.md`](DOCS/OPENAPI_GENERATOR.md) and',
  '[`DOCS/adr/0002-automated-fineract-spec-sync.md`](DOCS/adr/0002-automated-fineract-spec-sync.md).',
);

// The workflow passes the literal string 'true'/'false', so compare explicitly:
// `Boolean('false')` is true and the warning would never clear.
if (process.env.SPEC_SYNC_TOKEN_PRESENT !== 'true') {
  lines.push(
    '',
    '> **CI may not have run on this PR.** Without a `SPEC_SYNC_TOKEN` secret it is opened',
    '> with the default `GITHUB_TOKEN`, which cannot trigger workflows — so `api-client-drift`,',
    '> `build` and the rest stay silent. Close and reopen the PR (or push an empty commit) to',
    '> run them. The compile check above is a preview, not a substitute.',
  );
}

console.log(lines.join('\n'));
