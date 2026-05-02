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

# Fineract Backoffice UI: Extended Baseline Plan

## 1. Vision & Architectural Strategy

As a mentor and Product Manager with BFSI experience, the goal is to move beyond a "blank" project into a **Vendor-Ready Core**. This baseline must support multiple financial institutions (Microfinance and Community Banks) and allow for rapid rebranding (White Labeling) without core code changes.

### 1.1 Multi-Tenancy (The Fineract Way)

Fineract requires a `Fineract-Platform-TenantId` header for every request.

- **Dynamic Tenant Detection**: The UI will support resolving the Tenant ID from the subdomain (e.g., `tenant1.fineract.io`) or a login-time configuration.
- **Tenant Context Service**: A core service to hold the current tenant's metadata, ensuring all interceptors are context-aware.

### 1.2 White Labeling Feature

To support vendors serving multiple MFIs and Community Banks, we will implement:

- **Design Tokens**: Using CSS Custom Properties (Variables) for primary/secondary colors, typography, and spacing.
- **Asset Mapping**: Dynamic loading of logos and icons based on a `branding.json` configuration.
- **i18n Overrides**: Allowing tenants to override specific terminology (e.g., calling a "Client" a "Member" or "Customer").

### 1.3 Target Audience Focus

- **Microfinance Institutions (MFIs)**: Focus on group lending, field operations, and low-bandwidth optimization.
- **Community Banks**: Focus on individual-based lending, relationship management (CRM), and regulatory reporting requirements.

---

## 2. Technical Roadmap

### Phase 1: Security & Dev Experience (Immediate)

- **SSL Dev Mode**: Configure `.angular.json` and provide a script to generate local certs. This is critical for connecting to HTTPS-only sandboxes.
- **Auth Architecture**:
  - `AuthService`: Supporting Basic Auth (POC) with hooks for OAuth2.
  - `AuthInterceptor`: Injecting `Authorization` and `TenantId` headers.
  - `AuthGuard`: Protecting the `/features` routes.

### Phase 2: Core Shell & Layout

- **App Shell**: Responsive layout with a collapsible sidebar and support for diverse user roles.
- **Branding Engine**: Implementing the dynamic theme loader for white-labeling.
- **Environment Management**: Robust `environment.ts` setup for diverse deployment scenarios.

### Phase 3: Domain Scaffolding (README Aligned)

- **Admin**: Organization, Product settings, and Office hierarchy (MFIs centers vs Bank branches).
- **Lending**: Support for both Individual (Community Bank) and Group (MFI) loan workflows.
- **Relationship Management**: 360-degree view profile for community bank customers.

---

## 3. Product Manager's BFSI Insights & Questions

### Q1: Data Privacy & Tenant Isolation

"In a multi-tenant environment, how are we ensuring that a Loan Officer from Tenant A cannot trigger a request to Tenant B's data?"

### Q2: Connectivity vs. Complexity

"How do we balance the 'Offline-First' needs of an MFI field officer with the 'High-Volume' data grids required by a Community Bank teller?"

### Q3: White Labeling vs. Maintainability

"Vendors want to change more than just colors; they want to hide/show specific fields based on the institution type. How can we make the UI configuration-driven?"

---

## 4. Verification & Standards

- **Strict Linting**: SonarJS rules enforcement.
- **Headless Testing**: All core logic must be 100% unit-tested.
- **License Compliance**: Automated RAT checks on every PR.

---

## 5. Implementation Summary (Completed Milestones)

### 5.1 Foundation & DevEx
- [x] **SSL Dev Mode**: Configured `angular.json` for HTTPS local development.
- [x] **Auth Layer**: Implemented Basic Auth with `AuthService`, `AuthInterceptor`, and `AuthGuard`.
- [x] **i18n Readiness**: Absolute path routing for assets, ensuring zero 404s on deep routes.

### 5.2 Common Error Thrower (Global Error Handling)
- [x] **Stacked Notifications**: Centralized HTTP Interceptor (`errorInterceptor`) that extracts Fineract's detailed validation error arrays and displays them as a stacked list of developer messages in a snackbar.

### 5.3 Architectural Shift: Metadata-Driven Design
- [x] **OpenAPI Alignment**: Re-architected forms to use **Angular Template-Driven Forms** directly bound to strictly-typed OpenAPI generator request models (`Post...Request`, `Put...Request`).
- [x] **Contextual Tooltips**: Integrated `matTooltip` on all form fields using the `HELP.XXX_DESC` naming convention to provide embedded BFSI context ("What does it do").
- [x] **CRUD Feature Slices**: Implemented end-to-end flows for **Clients**, **Loans**, **Offices**, **Groups**, **Centers**, and **Products** using the new template-driven patterns.

---

## 6. API Implementation Roadmap (Pending)

To achieve a complete, vendor-ready Fineract backoffice, the following logical BFSI feature slices are pending integration.

### Phase 1: Transactions & Teller Operations (High Priority)
- **Cash Management**: Integrating `tellerCashManagement.service.ts` and `cashiers.service.ts` for branch vault and teller drawer operations.
- **Loan Lifecycle Transactions**: Implementing full support for `loanTransactions.service.ts` including disbursals, repayments, and waived charges.
- **Savings Accounts**: Implementing operational screens for `savingsAccount.service.ts` and `savingsAccountTransactions.service.ts`.

### Phase 2: Advanced Account & Product Management
- **Term Deposits**: Integration for `fixedDepositAccount.service.ts` and `recurringDepositAccount.service.ts`.
- **Shares & Dividends**: Support for `shareAccount.service.ts` and `selfDividend.service.ts`.
- **Collateral Management**: Centralized management via `collateralManagement.service.ts` and `loanCollateral.service.ts`.

### Phase 3: Financial Integrity & Accounting
- **GL & Closures**: Automating journal entry aggregations via `journalEntries.service.ts` and handling accounting period closures with `accountingClosure.service.ts`.
- **Loan Restructuring**: Detailed screens for `loanRescheduling.service.ts` and `rescheduleLoans.service.ts`.
- **Dynamic Charges**: Configurable penalties and fees via `charges.service.ts` and `loanCharges.service.ts`.

### Phase 4: Identity, Reporting, & Configuration
- **Security**: Full UI for managing `users.service.ts`, `roles.service.ts`, and `permissions.service.ts`.
- **Reporting**: Dynamic report generation and data export using `reports.service.ts` and `runReports.service.ts`.
- **System Settings**: Global configurations, holidays, and working day definitions.


