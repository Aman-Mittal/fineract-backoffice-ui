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

# AGENTS.md

Guidance for AI coding agents and human contributors working in this repository.
This complements `CONTRIBUTING.md`, `STYLE.md`, `ARCHITECTURE_DECISIONS.md`, and the
threat model in `security.md`.

## Project

Angular 21 standalone single-page application — the back-office UI for the Apache Fineract
core banking platform. It communicates with the Fineract REST API; all authorization is
enforced server-side (see `security.md`).

## Common commands

| Task       | Command                     |
| ---------- | --------------------------- |
| Dev server | `npm start`                 |
| Unit tests | `npm test -- --watch=false` |
| Lint       | `npm run lint`              |
| Format     | `npm run format`            |
| Prod build | `npm run build`             |

## Conventions

- **Standalone components/directives** (no NgModules). Services are `@Injectable({ providedIn: 'root' })`.
- **Signals** for reactive state (`signal()`, `computed()`, `asReadonly()`); see
  `src/app/core/services/config.service.ts` for the canonical pattern.
- Every source file carries the ASF Apache-2.0 license header.
- `localStorage` keys are snake*case, `fineract*`-prefixed.

## RBAC and feature flags

### `environment.rbacEnabled`

A build-time boolean read directly from `src/environments/environment.ts`,
`environment.prod.ts`, and `environment.sandbox.ts` (default: `true`).

- **`true`** — the sidebar filters navigation by user permissions and institution config;
  permission/institution directives enforce their checks.
- **`false`** — the sidebar shows all items and both directives render everything, preserving
  the pre-RBAC experience for existing deployments so RBAC can be adopted per-environment.

> The flag is a **UI-visibility** control only, never a security boundary. Authorization is
> always enforced server-side by Fineract. See `security.md` §5a and §11.7.

### Structural directives

- **`*appHasPermission`** — `src/app/shared/directives/has-permission.directive.ts`.
  Renders its element only if `AuthService.hasPermission(...)` passes. Accepts a single
  permission string or an array; add `; matchAll: true` to require all. Short-circuits to
  "always render" when `rbacEnabled === false`.
- **`*appInstitutionFeature`** — `src/app/shared/directives/has-institution-feature.directive.ts`.
  Renders its element only if `InstitutionConfigService.isFeatureEnabled(feature)` is true for
  `'groups' | 'centers' | 'collection_sheet'`. Short-circuits to "always render" when
  `rbacEnabled === false`.

### `InstitutionConfigService`

`src/app/core/services/institution-config.service.ts`. Signal-based service that persists the
institution type (`'mfis' | 'cb' | 'cu' | 'universal'`) to `localStorage`
(`fineract_institution_type`, default `'universal'`) and exposes
`isFeatureEnabled(feature)`, resolved against a per-type feature matrix.

### Sidebar integration

`src/app/layout/sidebar.component.ts` gates the three institution-feature nav items with
`*appInstitutionFeature`, and gates high-value groups (Admin, Accounting, Security, Settings,
System) with `*appHasPermission`. Additional nav items can be gated by adding the appropriate
directive to their `<li>` — the pattern is intentionally incremental.
