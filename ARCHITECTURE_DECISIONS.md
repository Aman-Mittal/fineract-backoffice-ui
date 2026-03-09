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

As the Technical Architect, here are the strategic responses to the Product Manager's concerns regarding the Fineract Backoffice UI baseline, now updated to include Community Bank specific considerations.

---

## 1. Data Privacy & Tenant Isolation

- **Dynamic Resolution:** Tenant ID resolved from hostname or storage, never hardcoded.
- **Security Enforcement:** Strict injection via `HttpInterceptor` and immutable application state.

## 2. Connectivity & Performance (MFI vs. Community Bank)

- **MFI (Last-Mile):** PWA support with IndexedDB sync queue for offline loan applications.
- **Community Bank (Scalability):** We will implement a **Virtual Scrolling** and **Server-side Pagination** pattern as the default for all data grids to ensure the UI remains performant when handling community bank-sized datasets.

## 3. White Labeling & Configuration-Driven UI

- **Runtime Theme Injection:** CSS Variables used for branding, loaded from a tenant-specific `branding.json`.
- **Formly / Dynamic Forms:** Entity forms (Clients, Loans) will be schema-driven to allow vendors to hide/show fields (e.g., "Social Collateral" for MFIs vs "FICO Score" for Banks) without code changes.
- **Mode-Based Layouts:** The layout engine will support "MFI Mode" (Center/Group centric) vs "Bank Mode" (Individual/Branch centric) via high-level configuration.

## 4. Security & Compliance

- **Local HTTPS:** Automated SSL scaffolding for secure development against remote sandboxes.
- **Zero Persistence for PII:** Sensitive data kept in-memory (Angular Signals).
- **Encrypted Storage:** Non-sensitive persistence encrypted via Web Crypto API.

## 5. Relationship Management & Domain Schemas

- **360-View profile:** To support Community Bank relationship banking, the client profile will be designed as a "Composite Resource," aggregating data from Fineract's Clients, Accounts, and Loans APIs into a single dashboard view.

## 6. Regulatory & Audit

- **Telemetry Service:** Scaffolded to log UI-side actions, meeting strict banking audit requirements.
- **RBAC:** Structural directive `*appHasPermission` to dynamically adapt the UI based on granular Fineract permissions.
