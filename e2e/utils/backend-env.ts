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
 * One place that decides which Fineract the e2e suite talks to.
 *
 * There are genuinely two addresses, and they are not interchangeable:
 *
 *   SERVER_URL is typed into the login form and used by the *browser*. CI sets it to
 *   the relative `/fineract-provider/api/v1` on purpose, so requests go through the
 *   dev-server proxy and stay same-origin — no CORS preflight, and no self-signed
 *   certificate prompt.
 *
 *   API_BASE is used by the seeding helpers, which run in *Node*, where a relative
 *   path has nothing to resolve against and must address the backend directly.
 *
 * They used to be independent env vars with different defaults — the public Mifos
 * sandbox for one and localhost:8443 for the other — and CI only ever set the first.
 * So seeding could write to the sandbox while the browser read the local stack, and
 * the resulting "my seeded client isn't there" failure pointed nowhere near the cause.
 *
 * API_BASE is therefore *derived* from SERVER_URL rather than configured beside it.
 * FINERACT_API_BASE still wins if set, for the case where Node genuinely needs a
 * different host from the browser.
 */

import { APIRequestContext } from '@playwright/test';

/** Where the backend actually listens, used to absolutise a relative SERVER_URL. */
export const BACKEND_ORIGIN = process.env.FINERACT_BACKEND_ORIGIN ?? 'https://localhost:8443';

/** What goes into the login form's server field. Consumed by the browser. */
export const SERVER_URL =
  process.env.FINERACT_SERVER_URL ?? 'https://apis.mifos.community/1.0/core/api/v1';

export const TENANT_ID = process.env.FINERACT_TENANT_ID ?? 'default';
export const USERNAME = process.env.FINERACT_USERNAME ?? 'mifos';
export const PASSWORD = process.env.FINERACT_PASSWORD ?? 'password';

function deriveApiBase(): string {
  if (process.env.FINERACT_API_BASE) {
    return process.env.FINERACT_API_BASE;
  }
  // An absolute SERVER_URL is already usable from Node; a relative one (the CI case)
  // needs the origin the proxy would have forwarded to.
  return /^https?:\/\//i.test(SERVER_URL) ? SERVER_URL : new URL(SERVER_URL, BACKEND_ORIGIN).href;
}

/** Absolute API root for the seeding helpers. Consumed by Node. */
export const API_BASE = deriveApiBase().replace(/\/$/, '');

/**
 * Fails fast, and with the derivation spelled out, when the seeding context cannot
 * reach the backend. Without this a misconfiguration surfaces twenty steps later as
 * an unrelated-looking assertion failure.
 */
export async function assertBackendReachable(api: APIRequestContext): Promise<void> {
  let status: number | string;
  try {
    status = (await api.get(`${API_BASE}/offices/1`)).status();
  } catch (cause) {
    status = cause instanceof Error ? cause.message : String(cause);
  }
  if (status !== 200) {
    throw new Error(
      `Seeding backend unreachable at ${API_BASE} (got ${status}).\n` +
        `Derived from FINERACT_SERVER_URL=${SERVER_URL} and ` +
        `FINERACT_BACKEND_ORIGIN=${BACKEND_ORIGIN}; ` +
        `set FINERACT_API_BASE to override the derivation.`,
    );
  }
}
