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

# Contributing to Fineract Backoffice UI

Thank you for your interest in contributing! This project is a GSOC 2026 initiative for Apache Fineract.

## How to Contribute

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally.
3.  **Create a feature branch** for your changes.
4.  **Implement your changes**, following the [Code Style Guide](STYLE.md).
5.  **Run local checks**:
    - `npm run lint`
    - `npm run format:check`
    - `npm test -- --watch=false`
    - `npm run build`
    - `npm run check:icons` — every `<ion-icon name="...">` is registered
    - `npm run check:material` — Angular Material usage has not increased
    - `npm run i18n:check` — translations are complete
6.  **Ensure License Headers**: All new files must include the Apache License 2.0 header. You can verify this with `./scripts/check-license.sh`.
7.  **Submit a Pull Request** against the `develop` branch.

## UI Components

The UI layer is **Ionic** (`@ionic/angular` v8), configured in `mode: 'md'`.

Angular Material is being removed and **must not be used in new code**. If you touch a component
that still imports `@angular/material`, migrate it as part of your change where the scope is
reasonable. The [Code Style Guide](STYLE.md#ui-components-ionic) has the component-by-component
equivalents, the date-picker and event idioms, and the icon registry rules.

Two conventions are easy to miss and fail silently:

- Every ionicon must be registered in `src/app/core/icons.ts`, or it renders as blank space.
  `npm run check:icons` turns that into a build failure.
- Components using Ionic overlays need `provideIonicTesting()` in their TestBed, or they fail
  with `NG0201: No provider found for _ModalController`.

`@angular/cdk` is retained deliberately — use it for unstyled primitives (`cdk-table`, virtual
scroll, a11y) rather than reaching back to Material.

### The Material ratchet

`npm run check:material` counts the files still importing `@angular/material` and fails if that
number **goes up**, so the migration cannot regress. When your change migrates files, lower the
committed baseline:

```bash
node scripts/check-material.mjs --update
```

Commit the updated `scripts/material-baseline.json` with your change. When the count reaches zero,
delete the script and baseline and enable the `no-restricted-imports` rule described in
`eslint.config.js`.

## Dependencies

New runtime dependencies must be **Apache Category A** compatible. CI enforces the allowlist
`MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;0BSD` via `license-checker`; anything GPL/LGPL/AGPL
or SSPL will fail the build. Declare packages you import directly in `package.json` rather than
relying on transitive resolution, so the audit sees them.

## Pull Request Guidelines

- Provide a clear description of the changes.
- Link to any related Jira issues or GSOC proposals.
- Ensure CI checks pass.
- New features should include unit tests.
