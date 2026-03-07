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

# Apache Fineract API: LLM Neutral Context

This document provides a structured summary of the Apache Fineract API for use by AI agents and developers.

## 1. Connection & Infrastructure

### 1.1 Base URL Patterns

- **Standard**: `https://{domain}/api/v1/`
- **Provider-specific**: `https://{domain}/fineract-provider/api/v1/`
- **Self-Service**: `https://{domain}/api/v1/self/`

### 1.2 Mandatory Headers

- **Tenant ID**: `Fineract-Platform-TenantId` (Standard) or `X-Mifos-Platform-TenantId` (Legacy/Mifos).
- **Authentication**: `Authorization: Basic {Base64_Credentials}` or `Authorization: bearer {token}`.
- **Content Type**: `application/json`.

### 1.3 Pagination & Sorting (Query Params)

- `offset`: Starting index (default 0).
- `limit`: Page size (default 200).
- `orderBy`: Field name (e.g., `displayName`).
- `sortOrder`: `ASC` or `DESC`.
- `fields`: Comma-separated field selection (e.g., `?fields=id,accountNo`).

---

## 2. Core Resource Schemas

### 2.1 Clients (`/clients`)

- `id`: Unique identifier (Integer).
- `accountNo`: External unique account string.
- `status`: Object `{id, code, value}`.
- `firstname`, `lastname`: Personal names.
- `officeName`: String name of the assigned office.

### 2.2 Loans (`/loans`)

- `id`: Unique identifier.
- `accountNo`: Loan account string.
- `status`: Object `{id, code, value}`.
- `productId`: Product ID.
- `principal`: Decimal amount.
- `loanTermFrequency`: Integer term length.

### 2.3 Offices (`/offices`)

- `id`: Unique identifier.
- `name`: Office name.
- `parentId`: Parent in hierarchy.
- `externalId`: External reference.

---

## 3. Error Handling

Consistent JSON structure for errors:

```json
{
  "developerMessage": "Technical details...",
  "httpStatusCode": "400",
  "defaultUserMessage": "Human readable error.",
  "errors": [
    {
      "parameterName": "name",
      "defaultUserMessage": "The parameter name cannot be blank."
    }
  ]
}
```

---

## 4. Authentication Flow

1. **POST `/authentication`**: Pass credentials.
2. **Response**: Returns user permissions, roles, and a session token/Basic auth confirmation.
3. **Requirement**: Every subsequent request must include the `TenantId` and `Authorization` headers.
