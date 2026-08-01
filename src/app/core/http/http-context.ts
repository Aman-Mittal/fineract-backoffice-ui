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
 * Per-request instructions to this application's interceptors.
 *
 * `HttpContext` is the mechanism for this rather than a header, because a header is sent to
 * Fineract. `X-Skip-Loading` — the only opt-out that existed before — travels over the wire on
 * every request that sets it, to be ignored by a server that has no opinion about our spinner.
 * Context values never leave the browser.
 *
 * Every method on the generated client in `src/app/api` accepts `options.context`, so a call
 * site can opt out without being rewritten to use `HttpClient` directly:
 *
 * ```ts
 * this.clientService.getClients(..., { context: skipLoading() });
 * ```
 *
 * Composing more than one:
 *
 * ```ts
 * this.x.get(..., { context: skipLoading(skipErrorToast()) });
 * ```
 */

import { HttpContext, HttpContextToken } from '@angular/common/http';

/**
 * Suppresses the global progress bar for this request.
 *
 * For polling and for background refreshes, where a spinner appearing on a cadence the user
 * did not trigger reads as the page breaking rather than as progress.
 */
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

/**
 * Suppresses the error toast for this request.
 *
 * For requests whose failure the caller renders itself — an inline field error, an empty state
 * with a retry — where a toast on top of that is duplicate reporting. It does not swallow the
 * error: `errorInterceptor` still rethrows, so the caller's `catchError` runs either way.
 */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export function skipLoading(context = new HttpContext()): HttpContext {
  return context.set(SKIP_LOADING, true);
}

export function skipErrorToast(context = new HttpContext()): HttpContext {
  return context.set(SKIP_ERROR_TOAST, true);
}
