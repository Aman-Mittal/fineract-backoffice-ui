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
 * Brings the backend up to the baseline the real-backend specs assume, once per run.
 *
 * This used to be a per-spec `test.skip(!SEEDED_BACKEND)` gate, which meant the three
 * richest specs — the full demo, the loan lifecycle and the schedule-type flows —
 * never ran anywhere, including CI. Seeding the prerequisites here instead of asking
 * the operator to supply them is what lets those specs run unconditionally.
 *
 * Runs as a Playwright `setup` project that the browser projects depend on, rather
 * than in the CI workflow, so a local run gets the same baseline with no extra steps.
 */

import { test as setup } from '@playwright/test';

import {
  createApiContext,
  ensureReferenceData,
  seedCollateralProduct,
  seedLoanDatatable,
} from './utils/seed-api';

setup('seed backend reference data', async () => {
  // Fineract's first request after boot can be slow while caches warm.
  setup.setTimeout(120000);

  const api = await createApiContext();
  try {
    await ensureReferenceData(api);
    await seedLoanDatatable(api);
    await seedCollateralProduct(api);
  } finally {
    await api.dispose();
  }
});
