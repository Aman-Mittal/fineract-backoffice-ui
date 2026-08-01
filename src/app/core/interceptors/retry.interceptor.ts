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

import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { throwError, timer } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';
import { IDEMPOTENT, RETRY, TIMEOUT_MS } from '../http/http-context';

/** Retries after the first failure, unless the call site overrides it via `RETRY`. */
export const DEFAULT_RETRY_COUNT = 2;

/** Base for the exponential backoff, in milliseconds: 300ms, then 900ms. */
export const RETRY_BASE_DELAY_MS = 300;

/**
 * Statuses worth sending the same request again for.
 *
 * `0` is the browser reporting no response at all — a dropped connection, a DNS blip, a
 * proxy restarting mid-flight. The rest are the server saying it could not serve this
 * request *now*: overloaded (429), a gateway with no healthy backend (502/504), or shutting
 * down for a deploy (503).
 *
 * Everything else is excluded on purpose. A 4xx means the request itself was wrong, and
 * repeating an identical wrong request just delays the error the user needs to see. 500 is
 * excluded too: an unhandled server exception is deterministic far more often than not, and
 * Fineract returns 500 for some validation failures.
 */
const TRANSIENT_STATUSES = new Set([0, 408, 429, 502, 503, 504]);

/**
 * True when sending this request twice cannot do anything the caller did not ask for.
 *
 * GET qualifies by definition. Nothing else does without the call site saying so: a POST
 * that times out may already have been applied, and a blind retry would book the transaction
 * a second time.
 */
function isSafeToRepeat(req: HttpRequest<unknown>): boolean {
  return req.method === 'GET' || req.context.get(IDEMPOTENT);
}

function isTransient(error: unknown): boolean {
  return error instanceof HttpErrorResponse && TRANSIENT_STATUSES.has(error.status);
}

/**
 * Retries transient failures and applies an optional per-request timeout.
 *
 * Registered last in the interceptor chain so it sits closest to the backend: `loadingInterceptor`
 * then counts the whole logical request rather than flickering the progress bar once per attempt,
 * `errorInterceptor` toasts only after the retries are exhausted, and every attempt carries the
 * same correlation ID, so a retried request stays one trace on the server side.
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const timeoutMs = req.context.get(TIMEOUT_MS);
  const requested = req.context.get(RETRY);
  // An explicit count tunes retrying where it is already allowed; it does not authorise it.
  // Turning retries on for a non-GET is what `idempotent()` is for, so that the claim being
  // made — this request is safe to send twice — is the thing written at the call site.
  const count = isSafeToRepeat(req) ? (requested ?? DEFAULT_RETRY_COUNT) : 0;

  let handled = next(req);

  // Inside the retry, so the budget applies per attempt rather than to all of them together.
  // A `TimeoutError` is not an `HttpErrorResponse`, so it falls through the transient check
  // below and is not retried: the caller set a deadline, and silently taking three times as
  // long as the deadline they asked for is not honouring it.
  if (timeoutMs !== null) {
    handled = handled.pipe(timeout(timeoutMs));
  }

  if (count <= 0) {
    return handled;
  }

  return handled.pipe(
    retry({
      count,
      delay: (error, retryCount) => {
        // A retry is only worth the extra wait if the same request could plausibly succeed.
        if (!isTransient(error)) {
          return throwError(() => error);
        }
        // Backs off so a server that is already struggling is not hit three times in a row.
        return timer(RETRY_BASE_DELAY_MS * 3 ** (retryCount - 1));
      },
    }),
  );
};
