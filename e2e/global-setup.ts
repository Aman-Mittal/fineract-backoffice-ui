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
 * Warms the dev server before the suite runs.
 *
 * `webServer.url` only waits for the first 200 response, but `ng serve`
 * compiles lazy route chunks on demand — so the first navigation of the run can
 * take far longer than the default 5s expect timeout and fail tests that are
 * otherwise fine. Loading /login once here absorbs that cost outside any test.
 */

import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL ?? 'https://localhost:4200';

  const browser = await chromium.launch();
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  try {
    await page.goto(`${baseURL}/login`, { waitUntil: 'load', timeout: 180_000 });
    // The login form is the last thing to render once the route chunk is in.
    await page.locator('#username').waitFor({ state: 'visible', timeout: 180_000 });
  } finally {
    await browser.close();
  }
}

export default globalSetup;
