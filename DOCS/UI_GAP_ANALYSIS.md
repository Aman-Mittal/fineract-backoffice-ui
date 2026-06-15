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

# UI Gap Analysis — Fineract Backoffice UI

> Generated 2026-06-15 via Playwright MCP browser exploration against the
> **Mifos Community API** (demo.mifos.io) backend.

---

## Executive Summary

Every navigable page in the application was explored end-to-end through the
Playwright MCP browser tools. The sidebar links, create forms, list tables,
header bar, and footer were all verified. Below is a module-by-module
breakdown of confirmed working features, observed gaps, console errors, and
recommended next steps.

---

## 1. Navigation & Layout

| Item                           | Status  | Notes                                                                                                                                                                                      |
| ------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sidebar renders all nav groups | ✅ PASS | Dashboard, Clients, Groups, Centers, Loans, Products, Accounting, Security, Settings, Organization, System, Reporting, Tasks, Teller Operations, Embedded Fintech, Transfers — all present |
| Header shows username          | ✅ PASS | Displays "mifos" (or logged-in user)                                                                                                                                                       |
| Header shows business date     | ✅ PASS | "Business Date:" with current date                                                                                                                                                         |
| Header shows render time       | ✅ PASS | "Render Time: X.XXms"                                                                                                                                                                      |
| Help Tour button visible       | ✅ PASS | Tour card renders on click                                                                                                                                                                 |
| Logout button visible          | ✅ PASS | Visible in header                                                                                                                                                                          |
| Language selector present      | ✅ PASS | Combobox with EN/HI/KO options                                                                                                                                                             |

**Console errors:** None on navigation between pages.

---

## 2. Dashboard (`/dashboard`)

| Feature                           | Status  | Notes                                         |
| --------------------------------- | ------- | --------------------------------------------- |
| Total Clients metric              | ✅ PASS | Shows count (e.g. 311)                        |
| Active Loans metric               | ✅ PASS | Shows count                                   |
| Savings Accounts metric           | ✅ PASS | Shows count                                   |
| System Health indicator           | ✅ PASS | Shows green/healthy                           |
| Pending Approvals section         | ✅ PASS | Lists pending items                           |
| Loan Status Distribution chart    | ✅ PASS | Pie chart renders                             |
| Savings Status Distribution chart | ✅ PASS | Pie chart renders                             |
| System Operational Status         | ✅ PASS | Runtime API URL, Active Tenant, API Proxy URL |

**Gaps:**

- No drill-down links from metric cards to the underlying list pages.

---

## 3. Clients (`/clients`)

| Feature                          | Status  | Notes                           |
| -------------------------------- | ------- | ------------------------------- |
| Client list loads                | ✅ PASS | Paginated table with search     |
| Search input present             | ✅ PASS | "Type to search..." placeholder |
| "Create Client" button           | ✅ PASS | Navigates to `/clients/create`  |
| Create form: First/Last name     | ✅ PASS | Input fields present            |
| Create form: Legal Form selector | ✅ PASS | Person/Entity dropdown          |
| Create form: Office selector     | ✅ PASS | Dropdown with offices           |
| Client count display             | ✅ PASS | Shows "Client Count: N"         |

**Gaps:**

- **Client list navigation** — Drilldown links on list view cells are missing to navigate to the detailed client view directly.

### Client Detailed View (`/clients/view/:id`)

| Feature                       | Status     | Notes                                                                                                                                                                                                  |
| ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Client Profile Tabs           | ✅ PASS    | Details, Savings Accounts, Loan Accounts, Identifiers, Addresses, Family Members, Notes, Documents, Custom Fields tabs render and load data.                                                           |
| Client Identifier Creation    | ✅ PASS    | "Add Identifier" form successfully captures and posts document type, key, description. Persists and displays in table (e.g., SSN).                                                                     |
| Client Family Member Creation | ✅ PASS    | "Add Family Member" form successfully submits to `POST /clients/{clientId}/familymembers`. Persists, displays in table, and Edit mode retrieves template data and populates inputs correctly.          |
| Client Note Creation          | ✅ PASS    | "Add Note" form successfully submits to `POST /clients/{clientId}/notes` and displays correctly in the list.                                                                                           |
| Client Address Creation       | ❌ FAIL    | Submission of "Add Address" form triggers `400 Bad Request` on `POST /client/{clientId}/addresses` because payload includes unsupported parameters: `addressTypeId`, `townVillage`, `countyDistrict`.  |
| Client Status Transitions     | ⚠️ PARTIAL | Menu option "Activate Client" shows activation dialog, but submission triggers `400 Bad Request` on `POST /clients/{clientId}?command=activate` because payload includes unsupported parameter `note`. |

---

## 4. Groups (`/groups`)

| Feature                | Status  | Notes                         |
| ---------------------- | ------- | ----------------------------- |
| Groups list loads      | ✅ PASS | "Groups" title in mat-card    |
| Create button visible  | ✅ PASS | "Create" button present       |
| Office filter dropdown | ✅ PASS | "All" / "Head Office" options |
| Search input present   | ✅ PASS | "Type to search..."           |

**Gaps:**

- No visible group hierarchy/group levels navigation in the UI (API exists via `groupsLevel.service.ts`)

---

## 5. Centers (`/centers`)

| Feature                | Status  | Notes                         |
| ---------------------- | ------- | ----------------------------- |
| Centers list loads     | ✅ PASS | "Centers" title in mat-card   |
| Create button visible  | ✅ PASS | "Create" button present       |
| Office filter dropdown | ✅ PASS | "All" / "Head Office" options |

**Gaps:**

- None observed at list level.

---

## 6. Loans (`/loans`)

| Feature                | Status  | Notes                                                                                       |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------- |
| Loan list loads        | ✅ PASS | Table with columns: Loan Account, Client Name, Office, Principle Amount, Loan Product, etc. |
| Office filter          | ✅ PASS | "All" / "Head Office"                                                                       |
| Search input           | ✅ PASS | "Type to search..."                                                                         |
| "Create Loan" button   | ✅ PASS | Present                                                                                     |
| Loan count display     | ✅ PASS | "Loan Count: N"                                                                             |
| Pending amount display | ✅ PASS | "Pending amount: N"                                                                         |

**Gaps:**

- **Guarantor management** — no visible guarantors tab from loan list (API exists via `guarantors.service.ts`)
- **Loan Collateral management** — no visible collateral management in list view (API exists via `collateralManagement.service.ts`)
- **Loan Transactions view** — not accessible from list (no drill-down visible)
- **Loan Reschedule** — no reschedule action visible (API exists via `rescheduleLoan` in loan service)

---

## 7. Products

### 7a. Loan Products (`/products/loan`)

| Feature                      | Status  | Notes                      |
| ---------------------------- | ------- | -------------------------- |
| List loads                   | ✅ PASS | Table with product columns |
| Search input                 | ✅ PASS | "Type to search..."        |
| "Create Loan Product" button | ✅ PASS | Present                    |

### 7b. Savings Products (`/products/savings`)

| Feature      | Status  | Notes                      |
| ------------ | ------- | -------------------------- |
| List loads   | ✅ PASS | Table with product columns |
| Search input | ✅ PASS | "Type to search..."        |

### 7c. Savings Accounts (`/products/savings-accounts`)

| Feature       | Status  | Notes                    |
| ------------- | ------- | ------------------------ |
| List loads    | ✅ PASS | "Savings Accounts" title |
| Office filter | ✅ PASS | "All" / "Head Office"    |
| Create button | ✅ PASS | "Create Savings Account" |

### 7d. Fixed Deposits, Recurring Deposits, Share Accounts

| Feature             | Status  | Notes                            |
| ------------------- | ------- | -------------------------------- |
| All list pages load | ✅ PASS | Each renders its title correctly |

### 7e. Tax Components & Tax Groups

| Feature    | Status  | Notes         |
| ---------- | ------- | ------------- |
| Pages load | ✅ PASS | Titles render |

### 7f. Floating Rates

| Feature    | Status  | Notes         |
| ---------- | ------- | ------------- |
| Page loads | ✅ PASS | Title renders |

**Gaps across Products:**

- **Share Products CRUD** — list exists but no visible create/edit flow for shares (API exists via `shareproduct.service.ts`)
- **Fixed Deposit Product** — list exists; form exists for creation (verified)
- **Recurring Deposit Product** — list exists; form exists

---

## 8. Accounting

### 8a. Chart of Accounts (`/accounting/chart-of-accounts`)

| Feature              | Status  | Notes                     |
| -------------------- | ------- | ------------------------- |
| Page loads           | ✅ PASS | "Chart of Accounts" title |
| "Add Account" button | ✅ PASS | Present                   |
| Account type filter  | ✅ PASS | Dropdown present          |
| Tree/grid view       | ✅ PASS | Shows hierarchy           |

### 8b. Journal Entries (`/accounting/journal-entries`)

| Feature           | Status  | Notes                                 |
| ----------------- | ------- | ------------------------------------- |
| Page loads        | ✅ PASS | "Journal Entries" title               |
| Search/filter     | ✅ PASS | Transaction ID search, account search |
| "Adjust" button   | ✅ PASS | Present                               |
| Date range filter | ✅ PASS | From/To date pickers                  |

### 8c. Accounting Closures (`/accounting/closures`)

| Feature       | Status  | Notes                       |
| ------------- | ------- | --------------------------- |
| Page loads    | ✅ PASS | "Accounting Closures" title |
| Create button | ✅ PASS | "Create Closing" present    |
| Office filter | ✅ PASS | Dropdown present            |

### 8d. Accounting Rules (`/accounting/rules`)

| Feature       | Status  | Notes                    |
| ------------- | ------- | ------------------------ |
| Page loads    | ✅ PASS | "Accounting Rules" title |
| Create button | ✅ PASS | "Create Rule" present    |
| Office filter | ✅ PASS | Dropdown present         |

### 8e. Financial Activity Mappings (`/accounting/financial-activity-mappings`)

| Feature       | Status  | Notes                                       |
| ------------- | ------- | ------------------------------------------- |
| Page loads    | ✅ PASS | "Financial Activity to GL Account Mappings" |
| Create button | ✅ PASS | "Create Mapping" present                    |

### 8f. Charges (`/accounting/charges`)

| Feature       | Status  | Notes                   |
| ------------- | ------- | ----------------------- |
| Page loads    | ✅ PASS | "Charges" title         |
| Create button | ✅ PASS | "Create Charge" present |
| Search input  | ✅ PASS | "Type to search..."     |

**Gaps across Accounting:**

- No visible **GL Account import/export** feature.
- No visible **accounting period close/open** actions beyond the basic closure.

---

## 9. Security

### 9a. Users (`/security/users`)

| Feature      | Status  | Notes               |
| ------------ | ------- | ------------------- |
| Page loads   | ✅ PASS | "Users" title       |
| Search input | ✅ PASS | "Type to search..." |

### 9b. Roles (`/security/roles`)

| Feature       | Status  | Notes              |
| ------------- | ------- | ------------------ |
| Page loads    | ✅ PASS | "Roles" title      |
| Create button | ✅ PASS | "Add Role" present |

### 9c. Audit Logs (`/security/audits`)

| Feature           | Status  | Notes                      |
| ----------------- | ------- | -------------------------- |
| Page loads        | ✅ PASS | "Audit Logs" title         |
| Date range filter | ✅ PASS | "From" / "To" date pickers |
| Search input      | ✅ PASS | "Type to search..."        |
| "Search" button   | ✅ PASS | Present                    |

**Gaps:**

- No visible **password policy management** UI.
- No visible **2FA/MFA configuration** UI.
- No visible **user session management** UI.

---

## 10. Settings

### 10a. Global Configurations (`/settings/configurations`)

| Feature            | Status  | Notes                         |
| ------------------ | ------- | ----------------------------- |
| Page loads         | ✅ PASS | "Global Configurations" title |
| Configuration list | ✅ PASS | Shows configuration entries   |
| Edit action        | ✅ PASS | Edit button/link per row      |

### 10b. Holidays (`/settings/holidays`)

| Feature       | Status  | Notes                 |
| ------------- | ------- | --------------------- |
| Page loads    | ✅ PASS | "Holidays" title      |
| Create button | ✅ PASS | Present               |
| Office filter | ✅ PASS | "All" / "Head Office" |

### 10c. Working Days (`/settings/working-days`)

| Feature     | Status  | Notes                |
| ----------- | ------- | -------------------- |
| Page loads  | ✅ PASS | "Working Days" title |
| Edit button | ✅ PASS | Present              |

---

## 11. System

### 11a. Data Tables (`/system/data-tables`)

| Feature       | Status  | Notes                       |
| ------------- | ------- | --------------------------- |
| Page loads    | ✅ PASS | "Data Tables" title         |
| Create button | ✅ PASS | "Create Data Table" present |
| Search input  | ✅ PASS | "Type to search..."         |

### 11b. Bulk Import (`/system/bulk-import`)

| Feature                  | Status  | Notes               |
| ------------------------ | ------- | ------------------- |
| Page loads               | ✅ PASS | "Bulk Import" title |
| Import list              | ✅ PASS | Shows entity types  |
| Select template dropdown | ✅ PASS | Present             |

**Console errors (from Playwright MCP session):**

```
[ERROR] Failed to load resource: the server responded with a status of 404
  @ https://demo.mifos.io/fineract-provider/api/v1/imports?entityType=clients
[ERROR] Failed to load import history HttpErrorResponse
```

> The bulk import history API (`/imports?entityType=clients`) returns 404 from the demo.mifos.io backend.

### 11c. Delinquency (`/system/delinquency`)

| Feature              | Status  | Notes                                                        |
| -------------------- | ------- | ------------------------------------------------------------ |
| Page loads           | ✅ PASS | "Delinquency Ranges & Buckets Management"                    |
| Sub-tabs visible     | ✅ PASS | Delinquency Ranges, Delinquency Buckets, Delinquency Actions |
| Range list           | ✅ PASS | Shows data                                                   |
| Bucket list          | ✅ PASS | Shows data                                                   |
| Create Range button  | ✅ PASS | Present                                                      |
| Create Bucket button | ✅ PASS | Present                                                      |

---

## 12. Teller Operations (`/tellers`)

| Feature       | Status  | Notes                   |
| ------------- | ------- | ----------------------- |
| Page loads    | ✅ PASS | "Tellers" title         |
| Create button | ✅ PASS | "Create Teller" present |
| Office filter | ✅ PASS | "All" / "Head Office"   |

**Gaps:**

- **Cash allocation/settlement** UI — no visible buttons for teller cash operations (API exists via `cashiers.service.ts`, `cashierJournals.service.ts`)
- **Teller reconciliation** — no visible reconciliation actions

---

## 13. Organization

### 13a. Offices (`/organization/offices`)

| Feature          | Status  | Notes                   |
| ---------------- | ------- | ----------------------- |
| Page loads       | ✅ PASS | "Offices" title         |
| Create button    | ✅ PASS | "Create Office" present |
| Office tree view | ✅ PASS | Shows hierarchy         |

### 13b. Staff (`/organization/staff`)

| Feature       | Status  | Notes                  |
| ------------- | ------- | ---------------------- |
| Page loads    | ✅ PASS | "Staff" title          |
| Create button | ✅ PASS | "Create Staff" present |
| Search input  | ✅ PASS | "Type to search..."    |

### 13c. Funds (`/organization/funds`)

| Feature       | Status  | Notes                 |
| ------------- | ------- | --------------------- |
| Page loads    | ✅ PASS | "Funds" title         |
| Create button | ✅ PASS | "Create Fund" present |

### 13d. Payment Types (`/organization/payment-types`)

| Feature       | Status  | Notes                         |
| ------------- | ------- | ----------------------------- |
| Page loads    | ✅ PASS | "Payment Types" title         |
| Create button | ✅ PASS | "Create Payment Type" present |

---

## 14. Transfers

### 14a. Account Transfer (`/transfers/account-transfer`)

| Feature       | Status  | Notes                     |
| ------------- | ------- | ------------------------- |
| Page loads    | ✅ PASS | "Account Transfers" title |
| Create button | ✅ PASS | "Create Transfer" present |
| Office filter | ✅ PASS | "All" / "Head Office"     |

### 14b. Standing Instructions (`/transfers/standing-instructions`)

| Feature       | Status  | Notes                                  |
| ------------- | ------- | -------------------------------------- |
| Page loads    | ✅ PASS | "Standing Instructions" title          |
| Create button | ✅ PASS | "Create Standing Instructions" present |
| Office filter | ✅ PASS | "All" / "Head Office"                  |

### 14c. SI History (`/transfers/standing-instructions/history`)

| Feature    | Status  | Notes                                 |
| ---------- | ------- | ------------------------------------- |
| Page loads | ✅ PASS | "Standing Instructions History" title |

---

## 15. Embedded Fintech (`/fintech/asset-owners`)

| Feature      | Status  | Notes                |
| ------------ | ------- | -------------------- |
| Page loads   | ✅ PASS | "Asset Owners" title |
| Search input | ✅ PASS | "Type to search..."  |

**Gaps:**

- No visible **create new asset owner** button from the list view.
- No visible **loan product-to-asset-owner mapping** UI.

---

## 16. Reporting (`/reporting`)

| Feature                  | Status  | Notes                               |
| ------------------------ | ------- | ----------------------------------- |
| Page loads               | ✅ PASS | "Reports" title                     |
| Report list              | ✅ PASS | Table with report names             |
| Run Report button        | ✅ PASS | "Run Report" tooltip on action icon |
| Report categories filter | ✅ PASS | "All" / "Client" / "Loan" etc.      |

---

## 17. Tasks

| Feature             | Status  | Notes                     |
| ------------------- | ------- | ------------------------- |
| Checker Inbox loads | ✅ PASS | "Tasks" / "Checker Inbox" |

---

## 18. Theme & UX Consistency (Light vs. Dark Mode)

| Theme Feature / Interaction | Status  | Notes                                                                                                                                                                                                             |
| --------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main content background     | ✅ PASS | Switches correctly from light grey (`#f0f2f5`) to dark grey (`#121212`)                                                                                                                                           |
| Card containers             | ✅ PASS | Transitions background color correctly to dark grey (`#1e1e1e`)                                                                                                                                                   |
| Header elements background  | ✅ PASS | Correctly uses themed background                                                                                                                                                                                  |
| Typography colors           | ✅ PASS | Body text switches color correctly                                                                                                                                                                                |
| Outlined Text Fields text   | ❌ FAIL | Typed text inside outline form fields uses static `rgba(0, 0, 0, 0.87)` color in dark mode, making it nearly invisible/unreadable. Needs `--mat-form-field-outlined-input-text-color` mapped to theme text color. |
| Language selector dropdown  | ❌ FAIL | `#lang-select` dropdown has hardcoded white background and black text, causing style inconsistency in dark mode.                                                                                                  |
| Icon Buttons contrast       | ❌ FAIL | Header buttons (`.toggle-btn`, `.theme-toggle-btn`) use hardcoded `color: #555;` and light hover states, resulting in extremely low contrast in dark mode.                                                        |

**Theme Gaps:**

- **Form Input Contrast**: When typing in Client creation forms or KYC address/identifier forms in dark mode, the contrast ratio of the input values is extremely low, presenting severe accessibility and usability issues.
- **Header Icon Contrast**: The sidebar expand/collapse button and theme toggle buttons are dark slate grey against a dark blue/black background when in dark mode.

---

## Summary of UI Gaps (High Priority)

| #   | Gap Area                                     | API Service Exists                      | UI Exists  | Priority |
| --- | -------------------------------------------- | --------------------------------------- | ---------- | -------- |
| 1   | Client Identifiers management                | `clientIdentifier.service.ts`           | ✅ Yes     | HIGH     |
| 2   | Client Address management                    | `clientsAddress.service.ts`             | ⚠️ Partial | HIGH     |
| 3   | Client Family Members                        | `clientFamilyMember.service.ts`         | ✅ Yes     | HIGH     |
| 4   | Client Documents/KYC                         | `documents.service.ts`                  | ✅ Yes     | HIGH     |
| 5   | Loan Guarantors management                   | `guarantors.service.ts`                 | ❌ No      | HIGH     |
| 6   | Loan Collateral management                   | `collateralManagement.service.ts`       | ❌ No      | HIGH     |
| 7   | Teller cash allocation/settlement            | `cashiers.service.ts`                   | ❌ No      | HIGH     |
| 8   | Bulk Import history (404 error)              | `bulkImport.service.ts`                 | ⚠️ Broken  | HIGH     |
| 9   | Client status transitions (approve/activate) | `client.service.ts`                     | ⚠️ Partial | MEDIUM   |
| 10  | Loan reschedule UI                           | `rescheduleLoan`                        | ❌ No      | MEDIUM   |
| 11  | Group levels/hierarchy UI                    | `groupsLevel.service.ts`                | ❌ No      | MEDIUM   |
| 12  | Share Products CRUD flow                     | `shareproduct.service.ts`               | ❌ No      | MEDIUM   |
| 13  | External Event Configuration                 | `externalEventConfiguration.service.ts` | ❌ No      | LOW      |
| 14  | External Services Configuration              | `externalServices.service.ts`           | ❌ No      | LOW      |
| 15  | Credit Bureau Integration UI                 | `creditBureauIntegration.service.ts`    | ❌ No      | LOW      |
| 16  | Scheduler/Job Management UI                  | `inlineJob.service.ts`                  | ❌ No      | LOW      |
| 17  | Maker-Checker workflow UI                    | —                                       | ❌ No      | LOW      |
| 18  | Password Policy / 2FA config                 | —                                       | ❌ No      | LOW      |

---

## Console Errors Observed

| Page                    | Error                                                              | Impact                                                                                             |
| ----------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Bulk Import             | `Failed to load resource: 404` at `/imports?entityType=clients`    | Import history feature broken                                                                      |
| Bulk Import             | `HttpErrorResponse` — failed to load import history                | Same as above                                                                                      |
| Client View (Addresses) | `Failed to load resource: 400` at `/client/1401/addresses?type=23` | Address creation fails due to unsupported fields: `addressTypeId`, `townVillage`, `countyDistrict` |
| Client View (Actions)   | `Failed to load resource: 400` at `/clients/1401?command=activate` | Client activation fails due to unsupported parameter: `note`                                       |

---

## E2E Test Coverage Summary

| Test File                         | Tests        | Coverage                                                                                                                                                                             |
| --------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `e2e/login.spec.ts`               | 10 tests     | Login page, session expiry, header controls                                                                                                                                          |
| `e2e/client.spec.ts`              | 1 test       | Client creation flow                                                                                                                                                                 |
| `e2e/reporting.spec.ts`           | 2 tests      | Report list and run report                                                                                                                                                           |
| `e2e/report-enhancements.spec.ts` | 2 tests      | Pagination, CSV export, help tour                                                                                                                                                    |
| `e2e/feature-coverage.spec.ts`    | **37 tests** | All 13 module areas: Navigation, Dashboard, Groups, Centers, Organization (4), Accounting (6), Security (3), Products (6), Settings (3), System (3), Tellers, Transfers (3), Fintech |
| **Total**                         | **52 tests** | Broad UI smoke coverage                                                                                                                                                              |
