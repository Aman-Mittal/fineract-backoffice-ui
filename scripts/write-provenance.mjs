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
 * Records where public/api/fineract.json came from.
 *
 * Nothing used to. "Which Fineract is this client for?" could only be answered
 * from an `info.version` of `1.16.0-SNAPSHOT`, which is the same string for
 * months at a time and says nothing about which build produced it.
 *
 * Two hashes are stored deliberately:
 *   upstreamSha256  — the raw bytes as upstream serves them (minified). This is
 *                     the sync workflow's short-circuit key: exact and cheap.
 *   committedSha256 — the file as committed, which Prettier has reformatted. Lets
 *                     a human check the spec was not hand-edited.
 *
 * Everything comes from the environment so the workflow never interpolates
 * ${{ }} into a script body.
 *
 *   node scripts/write-provenance.mjs <spec.json> <upstream-raw.json>
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const [committedPath, upstreamRawPath] = process.argv.slice(2);
const OUTPUT = 'public/api/fineract.provenance.json';

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

const committedRaw = readFileSync(committedPath);
const upstreamRaw = upstreamRawPath ? readFileSync(upstreamRawPath) : committedRaw;
const spec = JSON.parse(committedRaw.toString('utf8'));

const operationCount = Object.values(spec.paths ?? {}).reduce(
  (total, item) =>
    total +
    Object.keys(item ?? {}).filter((key) =>
      ['get', 'put', 'post', 'delete', 'patch', 'head', 'options'].includes(key),
    ).length,
  0,
);

const provenance = {
  $comment:
    'Provenance for public/api/fineract.json. Written by .github/workflows/api-spec-sync.yml; do not edit by hand.',
  license: 'Apache-2.0',
  schemaVersion: 1,
  fetchedAt: process.env.FETCHED_AT ?? new Date().toISOString(),
  source: {
    project: 'apache/fineract',
    method: process.env.FETCH_METHOD ?? 'http',
    url: process.env.FETCH_URL ?? '',
    image: {
      requested: process.env.IMAGE_REQUESTED ?? 'apache/fineract:latest',
      ref: process.env.IMAGE_REF ?? '',
      digest: process.env.IMAGE_DIGEST ?? '',
    },
    // Docker Hub tags apache/fineract images with the upstream commit SHA, so this
    // is a real commit rather than a guess — when the reverse lookup succeeds.
    commit: process.env.UPSTREAM_COMMIT || 'unknown',
  },
  spec: {
    path: 'public/api/fineract.json',
    infoVersion: spec.info?.version ?? 'unknown',
    upstreamSha256: sha256(upstreamRaw),
    committedSha256: sha256(committedRaw),
    committedBytes: committedRaw.length,
    pathCount: Object.keys(spec.paths ?? {}).length,
    operationCount,
    schemaCount: Object.keys(spec.components?.schemas ?? {}).length,
  },
  generator: {
    tool: 'openapi-generator-cli',
    version: JSON.parse(readFileSync('openapitools.json', 'utf8'))['generator-cli'].version,
    generatorName: 'typescript-angular',
    preprocessor: 'scripts/preprocess-spec.mjs',
    output: 'src/app/api',
  },
  workflow: {
    runUrl: process.env.RUN_URL ?? '',
  },
};

writeFileSync(OUTPUT, `${JSON.stringify(provenance, null, 2)}\n`);
console.log(`Wrote ${OUTPUT} (info.version ${provenance.spec.infoVersion})`);
