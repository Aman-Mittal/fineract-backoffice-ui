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

# ADR 0006: A boundary around the generated OpenAPI client

## Context

`src/app/api` is 145,000 lines of TypeScript — 155 services and 1,476 models — regenerated from
`api-spec/fineract.json` by `openapi-generator`. It is the only dependency in this repository
that can change without anyone here deciding to change it: the spec follows Fineract's release
cadence (ADR 0002 syncs it automatically), and the generator follows its own.

Measured on `d976842b`, 463 files outside `src/app/api` import it, 278 of them feature
components. There is no mapping layer: a component injects `ClientsService`, receives
`GetClientsClientIdResponse`, and binds that shape straight into its template. The generated
client _is_ this application's domain model.

Two previous decisions already cover part of this, and it is worth being precise about which
part, because the gap between them is what this ADR is for.

- **ADR 0001** made generated _names_ deterministic by preprocessing `operationId`s. Before it,
  one spec bump renamed methods and broke 137 call sites across 63 components. It also
  explicitly rejected a hand-written facade that would rename ~54 services — a permanently
  maintained indirection whose only job was friendlier names.
- **`scripts/check-api-surface.mjs`** records which generated operations the application calls,
  so an endpoint disappearing upstream produces one diagnostic naming the operation and its
  callers, rather than a compile error per call site.

Between them, a _generator_ bump and an endpoint _removal_ are handled. What is not handled is a
change to an emitted **shape**: a field becoming optional, an enum gaining a member, a response
nesting one level deeper, a numeric id widening. Names stay stable, `check-api-surface` still
passes, and the change lands on every file that binds that shape — today, up to 463 of them.

## Decision

Treat generated code as disposable, and make the cost of coupling to it visible and
non-increasing.

1. `local/no-generated-api-import` reports any import that resolves into `src/app/api` from
   outside the designated locations. Matching is on the resolved path, not the specifier, so
   `'../../api'` and `'../api/model/getClientsResponse'` are caught alike regardless of the
   importing file's depth.
2. The designated locations are `src/app/core/adapters/api/**` — the adapters that map generated
   types onto application models, and their specs — and `src/app/app.config.ts`, which
   configures `BASE_PATH` rather than calling anything.
3. The existing 475 violations are seeded into `eslint-suppressions.json`, which this repository
   documents as only ever shrinking. Nothing breaks on adoption; the count cannot grow.
4. Where a screen is migrated, it depends on an application-level contract and model —
   `LoanApi`, `Loan` — implemented by an adapter that calls the generated client and maps its
   response. Add these **selectively**, for domains where the shape is actually consumed widely
   or is known to move. A contract whose only content is a rename of a generated method is the
   facade ADR 0001 rejected, and is still rejected.

Three domains are migrated so far. Two were chosen because each had a defect the generated type
could not prevent: accounting closures (a field read that no payload contains) and offices (a
date typed `string` that arrives as `[y, m, d]`, plus two fields the type never declares). The
third, entity notes, was chosen on reach rather than on a defect — its payload agrees with the
generated type, but it is consumed from client, group, loan and savings screens, and the
`resourceType` path segment was a bare `string` in both the client and the component. All three
are written up in `DOCS/ADAPTERS.md`; issue #653 records the shape disagreements. The baseline
stands at 462 after them.

That arithmetic is worth stating plainly: three domains, seven files cleared. 462 files import
the client across 462 of them, and 361 depend on exactly one generated service, so the work is
tractable — but the distribution is flat. The largest single domain left is nine files. This is a
long campaign of small PRs, not something one change finishes, and the ratchet exists so that it
can proceed at that pace without the number going back up.

This is deliberately not the facade from ADR 0001. It renames nothing, it does not require a
wrapper per service, and it adds no indirection on day one. It is a measurement that fails CI
when it worsens, plus a sanctioned place to put a mapping when a mapping earns its keep.

## Why a rule of its own

`eslint-suppressions.json` counts violations per rule id. `no-restricted-imports` already
carries the Angular Material and `@ngx-translate` backlogs, and `local/no-vendor-ui-import`
carries Ionic's. Seeding 475 more into either would make the boundaries fungible: a file allowed
_n_ violations could drop a generated-client import, add an `@ngx-translate` one, and the
ratchet would not move. `no-vendor-ui-import` exists as a separate rule for exactly this reason,
and its header records the bug that taught it.

## Consequences

- A new file importing the generated client fails CI, with a message naming this ADR.
- The 475 existing imports are legal until migrated, and `--prune-suppressions` removes each
  entry as it goes, so the number only falls.
- Migration is reviewable one domain at a time, which is how Angular Material went from 250
  files to zero here and how Ionic is going from 250 to 227.
- The generated client stays the only thing that talks to Fineract. No second HTTP path, no
  hand-written models duplicating the spec.

## Alternatives considered

- **A contract and mapper per generated service, up front** — rejected: 155 services, most
  called from one screen. That is the indirection ADR 0001 rejected, with a mapping layer added
  on top.
- **`import/no-restricted-paths`** — would work, but its rule id is shared with any future
  `import` plugin path rule, and the per-rule counter is the mechanism that makes the ratchet
  trustworthy.
- **Documentation only** — rejected: the 84% coupling has been documented since ADR 0001 and
  grew by seven files in the week this was written.
- **Do nothing, rely on `check-api-surface.mjs`** — rejected: it tracks which _operations_ are
  called, which is orthogonal. Every operation can still exist while every response shape
  changes.

## References

- [ADR 0001: stable OpenAPI operation ids](0001-stable-openapi-operation-ids.md)
- [ADR 0002: automated Fineract spec sync](0002-automated-fineract-spec-sync.md)
- [ADR 0003: the adapter boundary](0003-adapter-boundary.md)
- [ADR 0005: an application-owned UI and test boundary](0005-ui-boundary.md)
- `eslint-rules/no-generated-api-import.js`
- `scripts/check-api-surface.mjs`
