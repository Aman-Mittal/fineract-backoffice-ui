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

# ADR 0002: Automated Fineract OpenAPI spec sync

- **Status:** Accepted
- **Date:** 2026-08-01
- **Deciders:** Maintainers of fineract-backoffice-ui

## Context

`public/api/fineract.json` is a frozen copy of Apache Fineract's OpenAPI spec, and
`src/app/api/` is generated from it. Two problems followed from that being a manual,
occasional act.

**Nothing recorded where the spec came from.** The only provenance signals were
`info.version` — `1.16.0-SNAPSHOT`, unchanged for months and identical across
hundreds of upstream builds — and the same string echoed in the generated
`src/app/api/README.md`. "Which Fineract is this client for?" had no answer.

**Updating it was blind.** [ADR-0001](0001-stable-openapi-operation-ids.md) records a
1.13.0 → 1.15.0-SNAPSHOT regeneration that broke **137 call sites across 63
components**. Stable operation IDs removed the gratuitous churn, but a genuinely
removed endpoint still breaks compilation, and the damage is invisible inside a
140,000-line generated diff. The spec was touched three times in four months, so the
cost landed rarely and heavily.

## Decision

A weekly workflow (`.github/workflows/api-spec-sync.yml`) fetches the upstream spec,
regenerates the client, and opens a pull request when anything changed.

**The spec is read out of the `apache/fineract` image, not from a running instance.**
The `resolve` Gradle task bakes `fineract.json` into `build/resources/main/static/`,
and jib places that at `/app/resources/static/fineract.json`, so `docker create` plus
`docker cp` retrieves it without a database, migrations or a Spring boot. We verified
the extracted bytes are **identical** to what a booted instance serves at
`/fineract-provider/fineract.json`, so the HTTP route buys nothing but minutes.

**Two short-circuits, both before any Java or npm work.** First the image digest,
resolved with a manifest-only registry lookup that pulls no layers — an unchanged
digest means a bit-identical image and therefore an unchanged spec. Then a sha256 of
the raw bytes. The common weekly run finishes in well under a minute.

**Provenance is committed** to `public/api/fineract.provenance.json`: the image
reference and digest, the upstream commit (Docker Hub tags `apache/fineract` images
with the upstream commit SHA, so this is a real commit rather than an inference), the
`info.version`, path/operation/schema counts, and two hashes — the raw upstream bytes,
which are the short-circuit key, and the committed file, which Prettier has
reformatted.

**The pull request leads with the blast radius.** `scripts/spec-diff-summary.mjs`
reuses `deterministicName()` from the preprocessor — the same function that decides
generated method names — so it can list the exact TypeScript methods a removed
endpoint takes with it, and `grep` their call sites. The workflow also runs
`npm run build` and reports the result. **A failing build does not block the PR**; it
is the expected outcome of a breaking upstream change and the errors are precisely
the list of call sites needing attention. The job fails only on infrastructure
problems.

## Alternatives considered

**Clone `apache/fineract` and run `./gradlew :fineract-provider:resolve`.** Produces
the spec from source and gives an exact commit, but needs the full Gradle toolchain
and 15–25 minutes, and goes red whenever upstream's build is red — for a file we can
read out of a published image in seconds.

**Read the live springdoc endpoint (`/fineract-provider/api-docs`).** Rejected: it is
a _materially different document_. It emits auto-derived `servers`, does not pass
through `FineractOperationIdReader`/`FineractOpenApiSpecFilter`, and honours
`springdoc.pathsToMatch=/api/**`, which drops `/application.wadl` — present in the
committed spec. Fineract's own Swagger UI reads the static file
(`springdoc.swagger-ui.url=/fineract.json`), and so do we.

**HTTP from a booted container as the primary path.** Correct, and verified
byte-identical, but requires Postgres, Liquibase migrations and a Spring boot before
the file is served — several minutes for the same bytes `docker cp` returns
immediately.

**Dependabot's `docker` ecosystem to track the image.** It does not read
`docker-compose*.yml`, and would not usefully bump a floating tag.

**Auto-merge.** Rejected. ADR-0001 is the argument: a human needs to see which
operations disappeared.

## Consequences

- Spec drift surfaces weekly instead of whenever someone remembers to look.
- These pull requests are **red by design** when upstream removes an endpoint. That is
  the signal, not a defect.
- Without a `SPEC_SYNC_TOKEN` secret the PR is opened with the default `GITHUB_TOKEN`,
  which **cannot trigger workflows** — `api-client-drift`, `build` and the rest stay
  silent until someone closes and reopens it. The PR body says so, and the in-workflow
  compile check partly compensates. Adding the secret removes the caveat with no
  workflow change.
- `deploy/docker-compose-e2e.yml` still runs `apache/fineract:latest` unpinned. Reading
  `source.image.ref` from the provenance file would make the E2E suite test against
  exactly the backend the client was generated from — a worthwhile follow-up, kept out
  of this change to limit blast radius.
