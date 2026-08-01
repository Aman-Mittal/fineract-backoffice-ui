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

/**
 * Marks a non-GET request as safe to send more than once.
 *
 * `retryInterceptor` retries GET without being asked, because GET is defined as
 * side-effect-free. Everything else is retried only when the call site says so: a POST that
 * timed out may well have been applied server-side, and repeating it would post the journal
 * entry twice. Set this only for endpoints that are genuinely idempotent — a PUT that
 * overwrites a resource with a fixed payload, or a POST with a client-supplied idempotency key.
 */
export const IDEMPOTENT = new HttpContextToken<boolean>(() => false);

/**
 * Number of retry attempts after the first failure. Defaults to `DEFAULT_RETRY_COUNT`.
 *
 * Set to `0` to opt a request out of retrying entirely — for a poll that will come round
 * again anyway, or where the caller wants to surface the first failure immediately.
 *
 * This tunes retrying where it is already allowed; it does not authorise it. On a request
 * that is not a GET and not marked {@link IDEMPOTENT} it has no effect, so that "safe to
 * send twice" is always stated as such rather than implied by a number.
 */
export const RETRY = new HttpContextToken<number | null>(() => null);

/**
 * Milliseconds after which the request is abandoned. Off unless set.
 *
 * There is deliberately no default. Fineract has endpoints that legitimately run for minutes
 * — report generation, scheduler jobs, bulk import — and a blanket ceiling would cancel work
 * the server is still doing, while the client reports a failure that did not happen. Set it
 * per call site, where the expected duration is actually known.
 */
export const TIMEOUT_MS = new HttpContextToken<number | null>(() => null);

export function skipLoading(context = new HttpContext()): HttpContext {
  return context.set(SKIP_LOADING, true);
}

export function skipErrorToast(context = new HttpContext()): HttpContext {
  return context.set(SKIP_ERROR_TOAST, true);
}

/** Declares a non-GET request safe to repeat, opting it into `retryInterceptor`. */
export function idempotent(context = new HttpContext()): HttpContext {
  return context.set(IDEMPOTENT, true);
}

/** Overrides the retry count for this request. `0` disables retrying. */
export function withRetry(count: number, context = new HttpContext()): HttpContext {
  return context.set(RETRY, count);
}

/** Abandons this request after `ms` milliseconds. */
export function withTimeout(ms: number, context = new HttpContext()): HttpContext {
  return context.set(TIMEOUT_MS, ms);
}
