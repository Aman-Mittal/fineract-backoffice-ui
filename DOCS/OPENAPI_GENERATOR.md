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

# OpenAPI Client Generation

This project uses [OpenAPI Generator](https://openapi-generator.tech/) to automatically generate the API client services and models based on the Apache Fineract Swagger specification.

## Configuration

The generator is configured in `package.json` and uses custom templates located in `templates/openapi-generator/`.

- **Output Directory**: `src/app/api/`
- **Spec Source**: `public/api/fineract.json` (preprocessed into `api-spec/fineract.json` during generation)
- **Custom Templates**: `templates/openapi-generator/licenseInfo.mustache` (adds Apache License header to all files)
- **Spec Preprocessor**: `scripts/preprocess-spec.mjs` (rewrites operationIds for stable method names — see below)

## Stable method names (important)

Generated method names are **stable across spec versions** by design. Without intervention, the
`typescript-angular` generator names methods from the spec's `operationId`s, which the Fineract spec
reuses across hundreds of endpoints; the generator then disambiguates them with a global,
document-order counter (`retrieveAll21`, `create6`, ...). Any spec change reshuffles every number and
breaks call sites throughout the app.

To prevent this, `npm run copy-swagger` runs `scripts/preprocess-spec.mjs`, which rewrites every
`operationId` to a deterministic value derived from the HTTP method + request path:

| Endpoint                       | Generated method              |
| ------------------------------ | ----------------------------- |
| `GET /v1/clients`              | `getClients`                  |
| `GET /v1/clients/{clientId}`   | `getClientsClientId`          |
| `PUT /v1/savingsaccounts/{id}` | `putSavingsaccountsAccountId` |

Because `(method, path)` is unique per OpenAPI, these names are collision-free and independent of
document order, so regenerating against a newer Fineract spec does **not** churn names. The
preprocessor also fills in any missing `responses.*.description`, so generation passes validation
without `--skip-validate-spec`. The committed spec (`public/api/fineract.json`) is never modified —
only the throwaway `api-spec/fineract.json` copy the generator consumes.

The rationale and alternatives considered are recorded in
[`DOCS/adr/0001-stable-openapi-operation-ids.md`](./adr/0001-stable-openapi-operation-ids.md).

## Commands

### Generate the API Client

To (re)generate the API client, run:

```bash
npm run generate-api
```

This command will:

1. **Preprocess** the spec (`copy-swagger`): run `scripts/preprocess-spec.mjs` to rewrite operationIds and patch missing response descriptions, writing `api-spec/fineract.json`.
2. **Clean** the previous output (`clean-api`): remove `src/app/api/api` and `src/app/api/model` so endpoints removed upstream do not leave orphan files behind (the generator never prunes).
3. Run the OpenAPI generator (`typescript-angular`, `ngVersion=21.0.0`) with the custom license header template.

### Update the Swagger Spec

If the Fineract API changes, replace `public/api/fineract.json` with the new spec and run
`npm run generate-api`. You can also point at a spec elsewhere via the `FINERACT_SWAGGER_PATH`
environment variable. Because method names are stable (see above), most call sites continue to compile;
only genuinely added/removed/renamed endpoints need attention.

## Maintenance

### Custom Templates

If you need to customize the generated code further (e.g., adding common interceptors or changing the way models are generated), you can add more `.mustache` files to the `templates/openapi-generator/` directory.

### Ignoring Files

To prevent the generator from overwriting or creating certain files, add them to the `.openapi-generator-ignore` file in the root of the project. Currently ignored:

- `git_push.sh`
- `README.md` (inside `src/app/api/`)
- `.gitignore` (inside `src/app/api/`)
