# CI checks

Every check that runs on a pull request, what it actually enforces, and how to run
it yourself. Reproducing a failure locally is almost always faster than pushing
again to see what the runner says.

Run the whole set before pushing:

```bash
npm ci                 # CI installs from the lockfile; see "dependencies" below
npm run lint
npm run format:check
npm run i18n:check
npm run check:icons
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
bash scripts/check-license.sh
```

---

## `ci.yml` — CI

Runs on pull requests and pushes to `main` and `develop`. Every job except
`rat-scan` waits on `dependencies`.

### `dependencies`

`npm ci` — installs strictly from `package-lock.json`.

Fails when the lockfile disagrees with `package.json`. If you edited dependencies
by hand, run `npm install` and commit the resulting lockfile. Note that `npm ci`
refuses `--legacy-peer-deps`, so a peer-dependency conflict has to be resolved
properly rather than waved through.

### `lint`

```bash
npm run lint
```

ESLint over `src/**/*.ts` and `src/**/*.html`, for both projects in the workspace.
`src/app/api/**` is excluded — it is generated.

Two rules here are deliberate and worth knowing before you fight them:

- **`no-restricted-imports` bans `@angular/material`.** The app migrated to Ionic;
  this is what stops it creeping back. Use `@ionic/angular/standalone` and see
  `STYLE.md` for the component mapping. `@angular/cdk` is still allowed.
- **`sonarjs/*` is on**, and is stricter than most setups — it will reject nested
  ternaries and string literals repeated three times or more. Extracting a named
  constant is usually the right response, not a disable comment.

### `html-lint`

```bash
npx --no-install eslint "src/**/*.html"
```

Angular's template accessibility rules. Separate from `lint` so a template
failure is legible in the job list rather than buried in a TypeScript run.

### `format`

```bash
npm run format:check     # npm run format writes the fixes
```

Prettier over the whole repo. `src/app/api/` is excluded via `.prettierignore`.

**`public/api/fineract.json` is _not_ excluded.** The upstream Fineract spec is
served minified, so a hand-copied spec fails this check as one 1.4 MB line — run
`npm run format` after replacing it. The spec-sync workflow does this for you.

### `i18n-check`

```bash
npm run i18n:check       # every referenced key exists in src/assets/i18n/en.json
npm run check:icons      # every <ion-icon name> is registered in src/app/core/icons.ts
```

Both failures are invisible at runtime rather than loud: a missing translation key
renders as the raw key, and an unregistered ionicon renders as blank space with no
console error.

`npm run i18n:check -- --unused` lists orphaned keys.

### `test`

```bash
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
```

Karma + Jasmine. Coverage is uploaded as an artifact for 7 days.

`ng test` runs **both** workspace projects; the totals print separately, so a run
ending in `TOTAL: 2 SUCCESS` is the `fineract-mfe` project and not the app. Add
`--project=fineract-backoffice-ui` when you want just the app.

> `jest.config.ts`, `setup-jest.ts` and a `vitest` devDependency all exist in the
> repo but nothing runs them. Karma is the real runner.

### `api-client-drift`

```bash
npm run verify-api-client    # regenerates the client, then git diff --exit-code
```

Proves `src/app/api/` is exactly what the committed spec generates, so nobody
hand-edits generated code. Needs **Java 17** as well as Node — the generator is a
jar.

If this fails, do not edit `src/app/api/` — change `public/api/fineract.json` (or
the generator options) and regenerate. See `DOCS/OPENAPI_GENERATOR.md`.

### `build`

```bash
npm run build
```

Production build, which is also the only check that compiles templates ahead of
time. A template type error — a signal read without `()`, a possibly-null value in
an interpolation — fails here and **nowhere else**: `tsc --noEmit` does not see
templates, and the unit tests may not render the affected component.

Budgets are enforced: 3 MB initial (4 MB error) and 4 kB per component stylesheet
(8 kB error). With ~190 inline-styled components, a component whose styles grow
past the limit fails the build in a way that looks unrelated to your change.

### `compliance`

```bash
bash scripts/check-license.sh
npx --no-install license-checker --production \
  --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;0BSD"
```

Two separate things: every source file carries the ASF header, and every
production dependency has a compatible licence.

The header check covers `src`, `deploy`, `.github`, `scripts` and `e2e`. **A new
`.github/workflows/*.yml` needs the header too** — that catches people out.
`src/app/api/` is excluded.

### `rat-scan`

Apache RAT 0.17 (downloaded, SHA-256 verified) with `.rat-excludes`.

Overlaps `compliance` but is the ASF's own tool and covers file types the script
does not. If RAT flags something generated or vendored, add it to `.rat-excludes`
rather than adding a header to it.

### `security`

```bash
npm audit --audit-level=high --omit=dev
```

Production dependencies only. Dev-only advisories in the build chain (esbuild,
vite) do not ship to users and would otherwise block every PR.

### `summary`

Writes the pass/fail table to the run summary. Always runs. Note it does **not**
depend on the e2e workflow, so a green CI summary says nothing about e2e.

---

## `e2e.yml` — E2E Tests

Runs on pull requests to `main`/`develop`, and on demand. Two jobs, in parallel,
because they have very different costs:

| Job       | Tests | Fineract     | Roughly              |
| --------- | ----- | ------------ | -------------------- |
| `mocked`  | 188   | not needed   | ~6 min               |
| `backend` | 16    | docker stack | ~4 min + ~2 min boot |

The split is defined in `playwright.config.ts` as two projects, so `--project=mocked`
and `--project=backend` mean the same thing locally as in CI. A spec belongs to
`backend` if it has no `page.route()` mocks; the list is `BACKEND_SPECS` in that file.

```bash
npm run e2e:stack          # bring the stack up
npm run e2e:stack:fresh    # ...destroying the volume first — what CI gets
npm run test:e2e:local     # both projects against it
```

**Reach for `--fresh` before blaming CI for a failure you cannot reproduce.** A
local database accumulates data across runs and hides assumptions a
migration-fresh one exposes immediately — "the list shows a badge" passes on
leftover records and fails in CI, where nothing has created one yet. That has been
the cause of most CI-only e2e failures here.

Each job uploads its report, videos and traces, and upserts its own PR comment
under its own marker. Artifacts land in `PLAYWRIGHT_OUTPUT_DIR` (the runner temp
directory) rather than the repo — the dev server watches the working tree, and
Playwright's artifact churn used to race the watcher and kill the server mid-run.

The suite refuses to run against a non-local backend when `CI` is set: these specs
create real clients, products and loans, and must never do that to a shared
instance.

---

## `codeql.yml` — CodeQL Advanced

Security analysis on pushes and PRs to `main`, plus weekly (`40 11 * * 4`).
Findings appear under the repository's Security tab, not as job output.

---

## `zizmor.yml` — GitHub Actions security analysis

Audits `.github/workflows/**` whenever they change, at
`min-severity: informational`, `min-confidence: low` — the strictest useful
setting, so it flags things other repositories tolerate.

What it reliably catches here:

- **`excessive-permissions`** — declare `permissions` per job, not at workflow
  level. A workflow-level `pull-requests: write` hands that token to every step,
  including `npm ci`. Prefer `permissions: {}` at the top.
- **`template-injection`** — never interpolate `${{ ... }}` inside a `run:` block.
  Pass the value through `env:` and reference the shell variable.
- **`unpinned-uses`** — pin every action to a 40-character SHA with a `# vX.Y.Z`
  comment. Dependabot reads that comment, so keep it accurate.
- **`artipacked`** — `persist-credentials: false` on every checkout.
- **`cache-poisoning`** — caching actions in a workflow that can write.

To check before pushing (the image cannot mount every path; copy the workflows
somewhere Docker is allowed to read):

```bash
mkdir -p ~/zizmor-check/.github && cp -r .github/workflows ~/zizmor-check/.github/
docker run --rm -v "$HOME/zizmor-check:/src:ro" -w /src ghcr.io/zizmorcore/zizmor \
  --min-severity informational --min-confidence low --no-online-audits .
```

---

## Bot-driven

`.github/dependabot.yml` opens weekly npm and github-actions updates with a 7-day
cooldown. `api-spec-sync.yml` opens a pull request when Apache Fineract's OpenAPI
spec changes — see `DOCS/adr/0002-automated-fineract-spec-sync.md`.
