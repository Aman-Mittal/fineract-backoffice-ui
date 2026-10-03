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

/**
 * Refreshes `scripts/permission-codes.json` from a running Fineract.
 *
 * The catalogue grows between releases, and a stale snapshot is a false *pass* — a new code the
 * application legitimately names would be reported as invented. It is never a false failure,
 * since codes are not removed, which is why a snapshot is safe to check against in CI at all.
 *
 *   bash scripts/e2e-stack.sh
 *   npm run permissions:snapshot
 *
 * Padded codes are written verbatim. Fineract ships five with a trailing space, and
 * `READ_STANDINGINSTRUCTION` and `READ_ClientSummary` exist *only* in that form — trimming them
 * on the way in is what broke the role permission editor (#693), so they are preserved here and
 * `check-permission-codes.mjs` trims only when comparing.
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'scripts/permission-codes.json');

const origin = process.env.FINERACT_BACKEND_ORIGIN ?? 'https://localhost:8443';
const tenant = process.env.FINERACT_TENANT_ID ?? 'default';
const username = process.env.FINERACT_USERNAME ?? 'mifos';
const password = process.env.FINERACT_PASSWORD ?? 'password';

// The local stack serves a self-signed certificate, which is the whole reason this is a script
// rather than a curl in the README.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const response = await fetch(`${origin}/fineract-provider/api/v1/permissions`, {
  headers: {
    'Fineract-Platform-TenantId': tenant,
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  },
});

if (!response.ok) {
  console.error(
    `GET /permissions answered ${response.status}. Is the stack up? ` +
      '(bash scripts/e2e-stack.sh)',
  );
  process.exit(1);
}

const payload = await response.json();
const codes = [...new Set(payload.map((permission) => permission.code))].sort();
const paddedCodes = codes.filter((code) => code !== code.trim());

if (codes.length < 500) {
  console.error(
    `Only ${codes.length} codes came back, which is far fewer than any release ships. ` +
      'Refusing to overwrite the snapshot with a partial answer.',
  );
  process.exit(1);
}

writeFileSync(
  OUT,
  `${JSON.stringify(
    {
      $comment:
        'Fineract permission codes, from GET /v1/permissions on the version in ' +
        'deploy/docker-compose-e2e.yml. Regenerate with: npm run permissions:snapshot. Padded ' +
        'codes are verbatim: Fineract ships five with a trailing space and some exist only in ' +
        'that form.',
      fineractVersion: 'apache/fineract (e2e stack)',
      capturedAt: new Date().toISOString().slice(0, 10),
      count: codes.length,
      paddedCodes,
      codes,
    },
    null,
    2,
  )}\n`,
);

console.log(`✓ ${codes.length} codes written to scripts/permission-codes.json`);
console.log(
  `  ${paddedCodes.length} carry whitespace: ${paddedCodes.map((c) => JSON.stringify(c)).join(', ')}`,
);
