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
authenticate, the user journeys worth covering, and how to wire E2E into CI.

## Status at a glance

- **Runner**: Playwright (`playwright.config.ts`), test directory `e2e/`.
- **Browsers**: three projects — `chromium`, `firefox`, `webkit`.
- **Base URL**: `https://localhost:4200` with `ignoreHTTPSErrors: true` (the dev server uses a
  self-signed certificate — see [Prerequisites](#prerequisites)).
- **Web server**: Playwright auto-starts `npm run start` (`ng serve`) and reuses an already-running
  instance (`reuseExistingServer: true`).
- **Existing specs**: `e2e/login.spec.ts`, `e2e/client.spec.ts`, `e2e/reporting.spec.ts`,
  `e2e/report-enhancements.spec.ts`.
- **Backend**: every spec past the login screen **mocks the backend** with `page.route(...)` — these
  are UI-integration tests with stubbed network calls, not tests against a live Fineract.
- **CI**: there is **no** E2E job today; `npm run test:e2e` is run locally only.

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

E2E is not yet run in CI (`.github/workflows/ci.yml` has unit, lint, build, and security jobs but no
Playwright job). To add one:

```yaml
e2e:
  name: E2E Tests
  needs: dependencies
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 'lts/*'
        cache: 'npm'
    - run: npm ci
    - run: npx playwright install --with-deps
    - name: Generate dev TLS certs
      run: |
        mkdir -p ssl
        openssl req -x509 -newkey rsa:2048 -nodes \
          -keyout ssl/localhost.key -out ssl/localhost.crt \
          -days 825 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
    - run: npm run test:e2e
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

The config already gates CI behavior: `forbidOnly`, `retries: 2`, and `workers: 1` apply only when
`process.env.CI` is set, so no config change is needed. Keep the CI suite on the **mocked** path so it
is hermetic; run live smoke tests out of band.

## Conventions

- Place specs in `e2e/` named `<feature>.spec.ts`; keep shared helpers/fixtures under `e2e/fixtures/`.
- Prefer role/label/test-id selectors over brittle CSS where practical.
- Every source file carries the Apache license header (enforced by Apache RAT); `.spec.ts` E2E files
  should too.

## Related docs

- [`DOCS/OPENAPI_GENERATOR.md`](./OPENAPI_GENERATOR.md) — how the API client the UI calls is generated.
