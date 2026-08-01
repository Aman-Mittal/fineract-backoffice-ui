<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# End-to-End Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) browser tests of the
Fineract back-office UI. This guide covers the current setup, how to run the suite, how tests
authenticate, and the conventions worth knowing before writing a spec.

For how the E2E jobs fit alongside the rest of CI, see [`CI_CHECKS.md`](CI_CHECKS.md).

## Status at a glance

- **Runner**: Playwright (`playwright.config.ts`), test directory `e2e/`.
- **Base URL**: `https://localhost:4200` with `ignoreHTTPSErrors: true` (the dev server uses a
  self-signed certificate — see [Prerequisites](#prerequisites)).
- **Web server**: Playwright auto-starts `npm run start` (`ng serve`) and reuses an already-running
  instance (`reuseExistingServer: true`).
- **Suite**: 204 tests across 15 spec files, split into two projects:
  - **`mocked`** (188 tests, 9 files) stubs every request with `page.route(...)`. Needs no
    Fineract — verified to pass with the backend stopped entirely.
  - **`backend`** (16 tests, 6 files) drives a real Fineract end to end. A `setup` project seeds
    the reference data it needs — enabled currencies, a datatable on `m_loan`, a collateral type —
    so nothing is gated behind manual preparation.
- **Browsers**: chromium for both projects; `firefox` and `webkit` projects exist for local
  cross-browser runs and are not part of CI.
- **CI**: `.github/workflows/e2e.yml` runs the two projects as **parallel jobs**, so the mocked half
  never waits on a Fineract boot. Each uploads its own report and videos and comments on the PR.
- **Artifacts**: written to `PLAYWRIGHT_OUTPUT_DIR` (system temp by default), deliberately outside
  the repository — the dev server watches the working tree, and Playwright's artifact churn used to
  race the file watcher and kill the server mid-run.

## Prerequisites

```bash
# 1. Install dependencies
npm ci

# 2. Install Playwright browsers (first run only)
npx playwright install
# in CI / fresh Linux, also pull OS deps:
npx playwright install --with-deps

# 3. Generate the dev-server TLS certs (ng serve runs over HTTPS)
mkdir -p ssl
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout ssl/localhost.key -out ssl/localhost.crt \
  -days 825 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

The `ssl/` directory is git-ignored; the certs are local-only. Without them `ng serve` fails with
`ENOENT: ... ssl/localhost.crt` and Playwright's auto-started web server cannot boot.

## Running the tests

```bash
npm run test:e2e                 # all projects, headless
npx playwright test --ui         # interactive UI mode (recommended while authoring)
npx playwright test --headed     # watch a real browser
npx playwright test --project=chromium e2e/client.spec.ts   # one file, one browser
npx playwright test --debug      # step through with the inspector
npx playwright show-report       # open the HTML report after a run
```

If you already have `npm start` running, Playwright reuses it; otherwise it boots one (allow ~60s for
the first cold `ng serve` compile).

## How tests authenticate

The app is an Angular SPA that talks to Fineract over **HTTP Basic auth** with a tenant header. Login
is driven from `src/app/features/login/login.component.ts`; `AuthService.login()`
(`src/app/core/services/auth.service.ts`) POSTs to `{apiUrl}/authentication` and stores the session in
`sessionStorage`. Route/sidebar visibility is gated by the returned permissions
(`AuthService.hasPermission`).

There are two ways to authenticate in a test:

### 1. Mocked backend (current approach — fast, deterministic, offline)

Intercept the runtime config and the auth call, returning a session with the `ALL_FUNCTIONS`
super-permission, then drive the login form. This is the canonical pattern in `e2e/client.spec.ts`:

```ts
await page.route('**/config.json', (r) =>
  r.fulfill({ json: { fineractApiUrl: '/api/v1', defaultTenant: 'default' } }),
);
await page.route('**/api/v1/authentication**', (r) =>
  r.fulfill({
    json: {
      username: 'mifos',
      base64EncodedAuthenticationKey: 'bWlmb3M6cGFzc3dvcmQ=',
      authenticated: true,
      permissions: ['ALL_FUNCTIONS'],
    },
  }),
);
// then fill #tenantId / #username / #password, click "Sign In", expect /dashboard
```

Stub every endpoint a screen calls (`page.route('**/api/v1/clients**', ...)` etc.); unstubbed calls
return the dev server's 404.

### 2. Live backend (true end-to-end)

Point the app at a running Fineract and use real credentials:

- Start Fineract locally (reachable on `https://127.0.0.1:8443`; the dev server proxies
  `/fineract-provider` there via `proxy.conf.json`), **or** target the community sandbox
  `https://apis.mifos.community/1.0/core/api/v1`.
- On the login form choose the **Local Proxy Server** option (`/fineract-provider/api/v1`), tenant
  `default`, and the demo credentials `mifos` / `password`.

Live tests are higher-fidelity but slower and dependent on backend data/state; prefer mocks for the CI
suite and reserve live runs for smoke testing.

## Recommended structure

The existing specs copy-paste their login + mocking `beforeEach`. As the suite grows, factor this out:

- **Shared auth fixture** — a `loginViaUI(page)` helper (or a Playwright fixture) that performs the
  mocked login, so specs start at `/dashboard`.
- **`storageState`** — perform login once in a setup project and reuse the saved session across specs
  to avoid logging in per test.
- **Page objects** — encapsulate selectors for high-traffic screens (login, client form, loan form).
- **Central mock helpers** — one place that stubs `config.json` + `/authentication` and common
  reference data (offices, currencies).

## Key user journeys to cover

Prioritized by business value. (✓ = some coverage today, ◌ = not yet covered.)

| Priority | Journey                                                                                          | Status                             |
| -------- | ------------------------------------------------------------------------------------------------ | ---------------------------------- |
| P0       | Login → Dashboard                                                                                | ✓ (login page only; never submits) |
| P0       | Client: create → view → activate (+ KYC: identifiers, addresses, notes, documents)               | ◌ (create partially mocked)        |
| P0       | **Loan: apply → approve → disburse → repay** (the marquee flow)                                  | ◌                                  |
| P1       | Savings: open account → deposit → withdraw                                                       | ◌                                  |
| P1       | Accounting: create journal entry; chart of accounts                                              | ◌                                  |
| P1       | Reporting: list → run report → CSV export                                                        | ✓                                  |
| P2       | Groups / Centers, Transfers (account transfer, standing instructions)                            | ◌                                  |
| P2       | Org master data: offices, staff, **funds, payment types, tax components/groups, floating rates** | ◌                                  |
| P2       | Security: users, roles, audits; Tasks: checker inbox                                             | ◌                                  |

The single most valuable addition is the **loan lifecycle** journey, since it exercises the core
banking workflow end to end.

## Continuous integration

`.github/workflows/e2e.yml` runs the suite on every pull request to `main`/`develop`, as two jobs in
parallel:

| Job       | Project   | Tests | Fineract     |
| --------- | --------- | ----- | ------------ |
| `mocked`  | `mocked`  | 188   | not needed   |
| `backend` | `backend` | 16    | docker stack |

Splitting them means a broken mock reports in a couple of minutes instead of waiting behind a
90-second Fineract boot it never touches, and one slow real-backend flow no longer sets the
wall-clock for everything else.

`playwright.config.ts` already gates CI behaviour — `forbidOnly`, `retries: 2` and `workers: 1` apply
only when `process.env.CI` is set.

### Running the real-backend half locally

```bash
npm run e2e:stack          # bring the Fineract stack up
npm run e2e:stack:fresh    # ...destroying the volume first — what CI gets every run
npm run test:e2e:local     # both projects against it
```

**Use `--fresh` before concluding a CI-only failure is CI's fault.** A local database accumulates
data across runs and hides assumptions that a migration-fresh one exposes immediately: an assertion
like "the products list shows a badge" passes on leftover records and fails in CI, where nothing has
created one yet. That has been the cause of most CI-only failures in this suite.

The real-backend specs create genuine clients, products and loans, so they refuse to run against a
non-local backend when `CI` is set (`e2e/utils/backend-env.ts`). Pointing them at a shared instance
from your own machine is still possible, and still a deliberate act.

## Conventions

- Place specs in `e2e/` named `<feature>.spec.ts`; shared helpers live in `e2e/utils/`.
- A spec with no `page.route()` mocks belongs to the `backend` project — add it to `BACKEND_SPECS`
  in `playwright.config.ts`, or it will run in the mocked job without a backend.
- Prefer role/label/test-id selectors over brittle CSS where practical.
- Every source file carries the Apache license header (enforced by Apache RAT); `.spec.ts` E2E files
  should too.

## Related docs

- [`DOCS/CI_CHECKS.md`](./CI_CHECKS.md) — every check that runs on a pull request.
- [`DOCS/OPENAPI_GENERATOR.md`](./OPENAPI_GENERATOR.md) — how the API client the UI calls is generated.
