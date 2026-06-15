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

# ADR 0001: Stable generated API method names via spec preprocessing

- **Status:** Accepted
- **Date:** 2026-06-15
- **Deciders:** Maintainers of fineract-backoffice-ui

## Context

The UI consumes a generated `typescript-angular` OpenAPI client (`src/app/api/`) produced by
`openapi-generator-cli` 7.20.0 from the Apache Fineract spec (`public/api/fineract.json`).

Generated method names were **unstable across spec versions**, for two compounding reasons:

1. The Fineract spec bakes document-order `_N` suffixes into ~58 `operationId`s
   (`retrieveAll_2`, `update_1`, ...).
2. The `typescript-angular` generator applies its own **global, document-order disambiguation
   counter** on top, because hundreds of operations collapse onto a handful of base names
   (the base `retrieveAll` covers ~101 operations). The result is names like `retrieveAll21`,
   `create6`, `update20`, `template12`.

Both sources are ordering-dependent, so adding or removing any endpoint reshuffles the numbers.
Concretely, regenerating against the sandbox spec (1.13.0 → 1.15.0-SNAPSHOT) broke **137 call sites
across 63 components** — almost all of it cosmetic churn rather than real API change. Two further
hygiene problems compounded it: the generator never prunes (regeneration left 19 orphan service +
180 orphan model files), and the stock script failed spec validation on a single missing response
description.

This made every spec bump a large, manual, error-prone edit — discouraging keeping the client current.

## Decision

Insert a deterministic **spec preprocessing** step (`scripts/preprocess-spec.mjs`) into the existing
`copy-swagger` npm hook. It rewrites every `operationId` to a value derived from the HTTP method +
request path:

```
GET    /v1/clients                -> getClients
GET    /v1/clients/{clientId}     -> getClientsClientId
PUT    /v1/savingsaccounts/{id}   -> putSavingsaccountsAccountId
```

Because `(method, path)` is unique per OpenAPI, the names are collision-free and independent of
document order — eliminating both instability sources at once. The script also fills in any missing
`responses.*.description` so generation passes validation without `--skip-validate-spec`.

Supporting changes:

- `clean-api` npm step removes `src/app/api/api` and `src/app/api/model` before each generation so
  upstream-removed endpoints cannot leave orphan files.
- `ngVersion` bumped `20.0.0` → `21.0.0` to match the project's Angular version.
- The fetched sandbox **1.15.0-SNAPSHOT** spec is frozen as the committed `public/api/fineract.json`;
  the preprocessor only transforms the throwaway `api-spec/fineract.json` copy, never the committed spec.

## Consequences

**Positive**

- Regenerating against a newer Fineract spec no longer churns method names. Proof: running
  `npm run generate-api` twice produces a byte-identical client.
- Method names are self-documenting (`getClientsClientId` vs `retrieveOne11`).
- No orphan files; the stock `generate-api` passes validation cleanly.

**Negative / cost**

- A **one-time** app-wide rename of all API call sites (~259 call sites + ~149 spec references) was
  required when adopting this. Done via a receiver-scoped codemod that joins old↔new methods on
  `(verb, path)`.
- Names embed the full path, so deep endpoints get long names
  (e.g. `getClientsExternalIdExternalId`). Accepted as a fair trade for stability and uniqueness.

## Alternatives considered

- **Hand-written facade layer** mapping friendly names to generated ones — rejected: adds a
  permanently-maintained indirection layer covering ~54 services.
- **`--operation-id-name-mappings`** generator flag — rejected: would require hand-maintaining ~942
  entries keyed on the very `operationId`s that are unstable.
- **Custom mustache template override** — rejected: the numeric disambiguation happens in the
  generator's Java core _before_ templating, so a template cannot influence naming.
- **Do nothing / fix call sites each bump** — rejected: 60+ files per spec update, indefinitely.

## References

- `scripts/preprocess-spec.mjs` — the preprocessor (exports `deterministicName(method, path)`).
- `DOCS/OPENAPI_GENERATOR.md` — day-to-day generation workflow.
- `package.json` — `copy-swagger`, `clean-api`, `generate-api` scripts.
