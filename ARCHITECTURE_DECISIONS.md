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

# Architectural Decisions & PM Responses

Strategic responses to the Product Manager's concerns regarding the Fineract Backoffice UI
baseline, including Community Bank specific considerations.

> Each item is tagged **Implemented** or **Planned**. "Planned" records an agreed direction, not
> current behaviour — do not rely on a Planned item being present in the codebase. `security.md`
> cross-references several of these; the tags here are the authority on what actually ships today.

---

## 0. UI Component Library — **Implemented**

- **Ionic (`@ionic/angular` v8) in `mode: 'md'`.** Chosen over Angular Material for its
  CSS-custom-property theming, which serves the white-labeling goal in §3 far better than
  Material's Sass-compiled themes, and for its mobile-capable primitives, which matter for the MFI
  field-officer profile in §2.
- Angular Material is being removed; `@angular/cdk` is retained for unstyled primitives
  (`cdk-table`, virtual scroll, a11y). See `STYLE.md` for the conventions.

## 1. Data Privacy & Tenant Isolation — **Implemented**

- **Dynamic Resolution:** Tenant ID resolved from hostname or storage, never hardcoded.
- **Security Enforcement:** Strict injection via `HttpInterceptor` and immutable application state.

## 2. Connectivity & Performance (MFI vs. Community Bank)

- **MFI (Last-Mile)** — _Planned._ PWA support with IndexedDB sync queue for offline loan
  applications. No service worker is registered today.
- **Community Bank (Scalability)** — _Partially implemented._ Server-side pagination is the
  default for data grids. Virtual scrolling is not yet applied; `@angular/cdk/scrolling` is
  available for it.

## 3. White Labeling & Configuration-Driven UI

- **Runtime Theme Injection** — _Partially implemented._ Branding runs on CSS custom properties:
  design tokens in `src/styles/_common.scss`, mapped onto Ionic's variables in
  `src/styles/_ionic-theme.scss`. The per-tenant `branding.json` loader is **not** implemented;
  runtime config today is `public/config.json` (API URL and default tenant) via `ConfigService`.
- **Formly / Dynamic Forms** — _Planned._ Entity forms are currently template-driven and bound to
  the OpenAPI-generated request models, not schema-driven.
- **Mode-Based Layouts** — _Partially implemented._ `InstitutionConfigService` plus the
  `*appInstitutionFeature` directive gate Groups, Centers and Collection Sheet by institution
  type. There is no broader "MFI Mode" vs "Bank Mode" layout engine.

## 4. Security & Compliance

- **Local HTTPS** — _Implemented._ Automated SSL scaffolding for development against remote
  sandboxes.
- **Zero Persistence for PII** — _Implemented._ Sensitive data kept in-memory (Angular Signals).
- **Encrypted Storage** — _Planned._ Non-sensitive persistence is currently plaintext
  `localStorage`; see `security.md` for the associated risk.

## 5. Relationship Management & Domain Schemas — **Planned**

- **360-View profile:** To support Community Bank relationship banking, the client profile will be
  designed as a "Composite Resource," aggregating data from Fineract's Clients, Accounts, and
  Loans APIs into a single dashboard view.

## 6. Regulatory & Audit

- **Telemetry Service** — _Planned._ Scaffolded to log UI-side actions for banking audit
  requirements.
- **RBAC** — _Implemented._ Structural directives `*appHasPermission` and
  `*appInstitutionFeature` adapt the UI to granular Fineract permissions, gated by
  `environment.rbacEnabled`. UI visibility only — authorization is always enforced server-side.
