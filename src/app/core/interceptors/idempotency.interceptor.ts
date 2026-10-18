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

import { HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, ReplaySubject, finalize, share } from 'rxjs';

/**
 * Makes a double submit do one thing.
 *
 * Save buttons across this application set an `isSaving` flag and bind it to `[disabled]`, which
 * is not a guard: the second click of a double-click, and a second Enter press, both land before
 * that flag reaches the DOM. Measured on a running Fineract (#756), one double-click on the loan
 * repayment form posted **two** repayments, each `200` — the borrower's balance and the GL were
 * both wrong, and someone had to notice and reverse one. Create Client made two clients the same
 * way. Commands guarded by a state transition — approve, disburse — were protected only by
 * accident, because the platform refused the second one.
 *
 * This fixes it once, for every form, rather than at ninety-nine call sites:
 *
 * **1. Identical requests in flight are collapsed.** The second subscriber gets the first
 * request's response, and no second request is issued. The window is exactly the first request's
 * flight — not a timed cache — so two *deliberate* identical submissions remain two requests as
 * long as the first has finished, which no human double-click can arrange.
 *
 * **2. Every mutating request carries an idempotency key.** Fineract honours it: measured, two
 * `POST /loans/{id}/transactions?command=repayment` with the same `Idempotency-Key` produced one
 * transaction and returned the same `resourceId` twice, and two `POST /clients` with one key
 * produced one client where keyless duplicates produced two. So even a retry that leaves the
 * browser — a dropped connection, a proxy replay — cannot double-post.
 *
 * The key is the application's half of what {@link IDEMPOTENT} describes: "a POST with a
 * client-supplied idempotency key". Retrying such a request is now meaningful rather than
 * reckless, though nothing here opts commands into `retryInterceptor` — that decision stays with
 * the call site.
 */

/**
 * The header Fineract reads the key from.
 *
 * Its own default (`fineract.idempotency-key-header-name`). Sent on every mutating request, which
 * a server that does not implement it simply ignores.
 */
export const IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';

/** Methods that change something, and so can be double-applied. */
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * In-flight mutating requests, by what they would do.
 *
 * Module-level rather than per-injector: the interceptor is a function, and the window being
 * guarded is a few hundred milliseconds of a single user's clicking. Entries remove themselves
 * when the request settles, so this holds nothing between submissions.
 */
const inFlight = new Map<string, Observable<HttpEvent<unknown>>>();

/**
 * What this request would do, as a string.
 *
 * Method, URL *with* its query (the command is in there — `?command=repayment`), and the body.
 * A body that cannot be compared by value — a file upload, a blob — makes the request
 * un-fingerprintable, and those are left alone rather than guessed at.
 */
function fingerprint(req: HttpRequest<unknown>): string | null {
  const body = req.body;
  if (body === null || body === undefined) {
    return `${req.method} ${req.urlWithParams} -`;
  }
  if (typeof body === 'string') {
    return `${req.method} ${req.urlWithParams} ${body}`;
  }
  if (typeof body === 'object') {
    if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
      return null;
    }
    try {
      return `${req.method} ${req.urlWithParams} ${JSON.stringify(body)}`;
    } catch {
      // A circular or otherwise unserialisable body: not comparable, so not collapsed.
      return null;
    }
  }
  return `${req.method} ${req.urlWithParams} ${String(body)}`;
}

/**
 * A key unique to this submission.
 *
 * `crypto.randomUUID` where it exists, which is every browser this application supports and the
 * Node used by the unit tests. The fallback is only for an insecure context, where `crypto` is
 * unavailable; collisions there would merely mean the platform treating two unrelated commands as
 * one retry, so it still has to be unguessable rather than sequential.
 */
function newKey(): string {
  const generator = globalThis.crypto;
  if (generator && typeof generator.randomUUID === 'function') {
    return generator.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export const idempotencyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!MUTATING_METHODS.has(req.method)) {
    return next(req);
  }

  const key = fingerprint(req);
  if (key === null) {
    return next(req.clone({ setHeaders: { [IDEMPOTENCY_KEY_HEADER]: newKey() } }));
  }

  const existing = inFlight.get(key);
  if (existing) {
    return existing;
  }

  const shared = next(req.clone({ setHeaders: { [IDEMPOTENCY_KEY_HEADER]: newKey() } })).pipe(
    finalize(() => inFlight.delete(key)),
    // `resetOnRefCountZero: false` deliberately: the request is not cancelled when the first
    // subscriber walks away. A posted repayment that is cancelled mid-flight has still been
    // applied server-side, and the second subscriber — the double-click — still needs the
    // answer. The replay buffer is what lets it arrive late and still be told.
    share({
      connector: () => new ReplaySubject<HttpEvent<unknown>>(1),
      resetOnError: false,
      resetOnComplete: false,
      resetOnRefCountZero: false,
    }),
  );

  inFlight.set(key, shared);
  return shared;
};
