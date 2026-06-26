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

# Pending / Unimplemented APIs

After the 1.15.0 OpenAPI regeneration the generated client exposed **151 services**. This document
records the build-out of UI for the previously-unimplemented services and the ones intentionally left
without a screen, so "all pending APIs" is auditable rather than ambiguous.

## Implemented in this effort (Batches 1–7)

UI was added for every unimplemented service that warrants an end-user screen. Grouped by batch:

- **Batch 1 — Working Capital**: breach, near-breach, loan products, loans (+ read tabs: charges,
  transactions, delinquency actions, delinquency range schedule, breach schedule).
- **Batch 2 — Loans**: loan originators, collateral management, bulk reassignment, guarantors,
  interest pauses, post-dated checks.
- **Batch 3 — Clients/Groups**: client charges, client collateral, client transactions, meetings,
  calendars, group levels.
- **Batch 4 — Products/Deposits**: rates, interest rate charts (+ slabs), product mix, savings
  charges, share dividends, fixed/recurring deposit transactions, on-hold fund transactions.
- **Batch 5 — Accounting**: provisioning categories, provisioning criteria, provisioning entries,
  run accruals, cashier journals.
- **Batch 6 — System/Admin**: hooks, ad-hoc query, SMS, report mailing jobs, entity data-table
  checks, entity-to-entity mapping, business steps, cache, external events, external services,
  password preferences, notifications, instance mode, scheduler jobs (+history), maker-checker
  permissions, OIDC config, field configuration, loan product details.
- **Batch 7 — Credit Bureau / SPM / MIX**: credit bureau configuration, SPM surveys, scorecards,
  poverty line, likelihood, MIX mapping, MIX report, MIX taxonomy.

Many of these endpoints are **Fineract 1.15.0-only** (all Working Capital, tenant OIDC, loan
originators, etc.) and are not reachable on the older Mifos community sandbox; those screens are
verified by spec conformance + unit tests rather than live calls.

## Intentionally NOT given a UI (no meaningful end-user screen)

These remain API-only by design — implementing a screen would be meaningless or duplicate existing
plumbing:

| Service                                                                                                                                             | Reason                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `BatchAPIService`                                                                                                                                   | Generic batch request envelope; an internal integration primitive.     |
| `InlineJobService`, `InternalCOBService`, `LoanCOBCatchUpService`, `WorkingCapitalLoanCOBCatchUpService`, `WorkingCapitalLoanInternalCOBApiService` | Close-of-business / job-internals; covered by Scheduler Jobs.          |
| `LoanAccountLockService`, `WorkingCapitalLoanAccountLockService`                                                                                    | Internal loan-lock endpoints used by COB.                              |
| `ProgressiveLoanService`                                                                                                                            | Internal progressive-loan model endpoints (test/debug).                |
| `InterOperationService`                                                                                                                             | Mojaloop payment-interop API; backend integration, not back-office.    |
| `ClientSearchV2Service`                                                                                                                             | Duplicate of the live global client search already wired in the app.   |
| `AuthenticationHTTPBasicService`                                                                                                                    | Already consumed by `AuthService`.                                     |
| `PasswordManagementService`                                                                                                                         | Public "forgot password" flow, not a back-office screen.               |
| `TwoFactorService`                                                                                                                                  | Per-user 2FA challenge/validate; belongs to the login flow, not admin. |
| `CacheService` build note                                                                                                                           | Implemented as a config screen in Batch 6.                             |

## Deferred (candidates for a future pass)

Buildable but deferred this round because of API shape or low priority:

- **Email Campaigns / SMS Campaigns / Office Transactions** — these live inside the generated
  `DefaultService` catch-all with non-standard operation ids; they need a dedicated mapping pass
  before a clean UI can be built.
- **`ExternalAssetOwnerLoanProductAttributesService`** — per-asset-owner loan-product attribute
  tab; small, belongs on the existing Asset Owners screen.
- **`SurveyService` (data-table fulfilment)** and **`SPMAPILookUpTableService`** — survey
  fulfilment is tied to client app-tables; better delivered alongside a client-survey workflow.
- **`PeriodicAccrualAccountingService`** extra commands beyond the Run Accruals action.

## Related docs

- [`DOCS/UI_GAP_ANALYSIS.md`](./UI_GAP_ANALYSIS.md)
- [`DOCS/OPENAPI_GENERATOR.md`](./OPENAPI_GENERATOR.md)
