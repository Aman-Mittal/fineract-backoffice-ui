/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Gate for specs that need a *seeded* Fineract, not merely a running one.
 *
 * Most specs stub the API with `page.route()` and need no backend at all. A
 * handful drive real end-to-end loan flows — creating a client, building a loan
 * product, approving and disbursing — and those depend on reference data (loan
 * products, payment types, active loan accounts, staff) that a freshly migrated
 * Fineract does not have. Against the bare `apache/fineract` image in
 * `deploy/docker-compose-e2e.yml` they fail on missing prerequisites rather than
 * on anything wrong with the UI, so CI skips them instead of reporting red.
 *
 * Set `FINERACT_SEEDED_BACKEND=1` to run them against an instance that does have
 * the data:
 *
 *   FINERACT_SEEDED_BACKEND=1 \
 *   FINERACT_SERVER_URL=/fineract-provider/api/v1 \
 *   npx playwright test e2e/loan-lifecycle.spec.ts
 *
 * Removing this gate is the goal: seed the reference data during stack bring-up
 * so the flows run unconditionally.
 */
export const SEEDED_BACKEND = process.env.FINERACT_SEEDED_BACKEND === '1';

export const SEEDED_BACKEND_REASON =
  'Needs a seeded Fineract (loan products, active loans). Set FINERACT_SEEDED_BACKEND=1 to run.';
