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

# OpenID Connect

> [!IMPORTANT]
> **This application cannot sign a user in through an identity provider.** It has a screen that
> edits the tenant's OIDC configuration, and nothing else. Login is username and password, sent as
> Basic auth. See [#370](https://github.com/apache/fineract-backoffice-ui/issues/370).

This document records what the platform actually offers, what the screen does, and the three
platform defects found while establishing that — so the next person does not have to rediscover
them.

## What the platform provides

OIDC federation landed in Fineract via
[FINERACT-2616](https://issues.apache.org/jira/browse/FINERACT-2616)
([apache/fineract#5883](https://github.com/apache/fineract/pull/5883), merged 10 June 2026),
**resolved with fix version 1.15.0**. It sits under the broader
[FINERACT-1908](https://issues.apache.org/jira/browse/FINERACT-1908) modular-security effort, which
remains in progress.

It is a **resource-server** design: Fineract validates a JWT that an identity provider issued. It
does not perform the authorization-code exchange — obtaining the token is the client's job, which
is precisely the part this application is missing.

Upstream reference: `fineract-doc/src/docs/en/chapters/security/oidc-federation.adoc`.

### Enabling it

Federation is off unless the **server** turns it on. The tenant configuration row alone does
nothing.

| Property                                                     | Default              |
| ------------------------------------------------------------ | -------------------- |
| `fineract.security.oidc-federation.enabled`                  | `false`              |
| `fineract.security.oidc-federation.tenant-claim-name`        | `fineract_tenant`    |
| `fineract.security.oidc-federation.username-claim`           | `preferred_username` |
| `fineract.security.oidc-federation.auto-create-user`         | `false`              |
| `fineract.security.oidc-federation.default-roles`            | _(empty)_            |
| `fineract.security.oidc-federation.provider`                 | `generic`            |
| `fineract.security.oidc-federation.post-logout-redirect-uri` | _(empty)_            |

Tenant resolution runs in priority order: the JWT claim named by `tenant-claim-name`, then the
`Fineract-Platform-TenantId` header, then the `tenantIdentifier` query parameter.

### It does not replace Basic auth

Both run at once. A Bearer token routes to OIDC; Basic credentials fall through to the existing
chain. Confirmed on a running instance: with a configuration present and `enabled: true`,
`GET /v1/offices` still answers 200 to Basic auth.

That is why this gap is **inert rather than dangerous** — unlike two-factor authentication
([#369](https://github.com/apache/fineract-backoffice-ui/issues/369)), which takes a deployment
offline the moment it is switched on.

## The tenant configuration

`m_tenant_oidc_config`, in the **tenants** database (`fineract_tenants`), not the tenant's own.

| Column                       | Notes                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `provider_type`              | `KEYCLOAK`, `GOOGLE`, `AZURE_AD`, `OKTA`, `AUTH0`, `GENERIC`. Selects the logout-URL dialect only. |
| `issuer_uri`                 | Unique; matched against the JWT `iss` claim                                                        |
| `client_id`, `client_secret` | Secret is write-only — `GET` never returns it                                                      |
| `jwks_uri`                   | Optional; discovered from `{issuer_uri}/.well-known/openid-configuration` when absent              |
| `username_claim`             | Default `preferred_username`                                                                       |
| `scopes`                     | Default `openid,profile,email`                                                                     |
| `post_logout_redirect_uri`   | RP-initiated logout, browser sessions only                                                         |
| `enabled`                    | `smallint` — see the defect below                                                                  |

There is **no authorization endpoint and no token endpoint**. A provider publishes both in its
discovery document, so the platform does not store them. The screen used to offer fields for both
and silently discarded whatever was typed into them.

### The API is schemaless

`POST` and `PUT /v1/tenants/{tenantId}/oidc-config` declare `requestBody: {"type": "string"}` in
the OpenAPI document — no properties, no types. The generated client therefore types the body as
`string`, and **nothing checks the field names at compile time**. That is how the screen came to
send `issuer`, `authorizationEndpoint`, `tokenEndpoint` and `jwksUrl`, none of which the platform
has ever recognised: a configured tenant opened the screen to a blank form and nobody noticed.

`oidc-config.component.spec.ts` pins a verbatim transcript of a real `GET` response for this
reason. Keep it a transcript. If it is edited to match whatever the component reads, the only
guard against the names drifting again is gone.

## Platform defects found

Three, all reproduced against `apache/fineract:latest`. None is reported upstream at the time of
writing; each deserves a FINERACT ticket.

**1 — Writing a configuration always fails on PostgreSQL.**

`POST` and `PUT` both answer 500, for every body, including one that omits `enabled` entirely:

```
ERROR: column "enabled" is of type smallint but expression is of type boolean
  at TenantOidcConfigRepositoryJdbc.insert
```

The column is `smallint`; the repository binds `ps.setBoolean(10, config.isEnabled())`. The
PostgreSQL JDBC driver does not coerce between the two. Reads and deletes are unaffected.

_Consequence:_ the screen can display and delete a configuration but cannot create or update one.
Until this is fixed, a row has to be inserted directly:

```sql
INSERT INTO m_tenant_oidc_config
  (tenant_id, provider_type, issuer_uri, client_id, client_secret, jwks_uri,
   username_claim, scopes, enabled)
VALUES ('default', 'KEYCLOAK', 'https://keycloak.example/realms/fineract', 'fineract-backoffice',
        's', 'https://keycloak.example/realms/fineract/protocol/openid-connect/certs',
        'preferred_username', 'openid,profile,email', 1);
```

**2 — Enabling federation stops Fineract from starting.**

With `FINERACT_SECURITY_OIDC_FEDERATION_ENABLED=true` the application context fails to build:

```
The dependencies of some of the beans in the application context form a cycle:
  oidcFederationSecurityConfig
   ↑     ↓
  dynamicJwtIssuerAuthenticationManagerResolver
```

`OidcFederationSecurityConfig` `@Autowired`s `DynamicJwtIssuerAuthenticationManagerResolver`, which
resolves back into the same configuration. Spring prohibits circular references by default, so the
container aborts.

_Consequence:_ the feature cannot be switched on at all on this build. Any work on
[#370](https://github.com/apache/fineract-backoffice-ui/issues/370) is blocked behind this, or
behind pinning a Fineract version where it does not occur.

**3 — The documented permission does not exist.**

Upstream documentation states the endpoint requires `MANAGE_TENANT_OIDC_CONFIG` (Super Admin).
That code is **not among the 698 permissions** `GET /v1/permissions` returns on a seeded tenant.

_Consequence:_ `/system/oidc-config` cannot be gated on it. The route is recorded in
`scripts/check-route-permissions.mjs` under `UNRESTRICTED` with that reason — see
[DOCS/RBAC.md](RBAC.md) on why a gate no role can satisfy is worse than no gate.

## What this application does today

`features/system/oidc-config/` edits the tenant configuration. After the corrections in
[#371](https://github.com/apache/fineract-backoffice-ui/pull/371) it uses the platform's own field
names, offers `provider_type` as a list rather than free text, treats a 404 as "not configured yet"
rather than an error, omits an untouched `client_secret` instead of blanking the stored one, and
reports failures to the user instead of only to the console.

It still cannot save, because of defect 1. That is the platform's, not the screen's.

## What is needed for sign-in

For [#370](https://github.com/apache/fineract-backoffice-ui/issues/370), in rough order:

1. **A Fineract build where defect 2 is fixed.** Nothing can be tested until federation starts.
2. Authorization-code flow with PKCE in the browser. The `client_secret` in the tenant
   configuration is the backend's; it must never reach the browser.
3. The resulting Bearer token replaces the Basic credential in `auth.interceptor.ts` — a second
   mode on the existing interceptor, not a second interceptor.
4. The tenant claim. Fineract reads `fineract_tenant` from the JWT, so the provider must be
   configured to emit it; a Keycloak _User Attribute_ client-scope mapper is the documented route.
5. Refresh, and a sign-out that ends the provider session (RP-initiated logout) rather than only
   the local one.
6. Permissions still arrive on the Fineract side. `AuthService.hasPermission()` must remain the
   only place they are evaluated, or the route guard in [DOCS/RBAC.md](RBAC.md) is bypassed.

### Testing it

The mocked layer carries most of the value and needs no provider: intercept the token endpoint the
way `e2e/rbac-route-protection.spec.ts` already intercepts `config.json` and `/v1/authentication`.

A real round-trip needs Keycloak in the compose stack and its own Playwright project, kept out of
the default run — the same shape as the two-factor project proposed in
[#369](https://github.com/apache/fineract-backoffice-ui/issues/369). Keycloak is the natural choice:
it is the dialect Fineract documents most fully, and the upstream setup notes are written against
it.

**The regression case matters more than the feature case.** With OIDC absent or disabled, the
username-and-password flow must be byte-for-byte what it is today. Every current deployment depends
on that.
