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

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IDEMPOTENCY_KEY_HEADER, idempotencyInterceptor } from './idempotency.interceptor';

/**
 * #756. One double-click on the loan repayment form posted two repayments, both `200`.
 *
 * The forms' `isSaving` flag is bound to `[disabled]`, which the second click of a double-click
 * beats to the DOM. These pin the two things that make the second click harmless: the request is
 * not sent twice, and if it ever did leave the browser twice it would carry the same key, which
 * Fineract honours — measured, two keyed repayments produced one transaction.
 */
describe('idempotencyInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  const REPAYMENT = '/loans/2/transactions?command=repayment';
  const BODY = { transactionAmount: 100, paymentTypeId: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([idempotencyInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('issues one request for a double submit, and answers both callers', () => {
    const answers: unknown[] = [];
    http.post(REPAYMENT, BODY).subscribe((result) => answers.push(result));
    http.post(REPAYMENT, BODY).subscribe((result) => answers.push(result));

    // The whole point: one POST reached the platform, so one repayment was recorded.
    const request = backend.expectOne(REPAYMENT);
    request.flush({ resourceId: 5 });

    // And the second click is not left hanging — it is told the same thing as the first.
    expect(answers).toEqual([{ resourceId: 5 }, { resourceId: 5 }]);
  });

  it('still answers the second caller when the first walks away', () => {
    // A navigation, or a destroyed dialog, unsubscribes the first caller. The request has
    // already been applied server-side, so it is not cancelled — and the second click, which is
    // the one still on screen, is told what happened.
    const answers: unknown[] = [];
    const first = http.post(REPAYMENT, BODY).subscribe((result) => answers.push(result));
    http.post(REPAYMENT, BODY).subscribe((result) => answers.push(result));

    first.unsubscribe();
    backend.expectOne(REPAYMENT).flush({ resourceId: 5 });

    expect(answers).toEqual([{ resourceId: 5 }]);
  });

  it('sends an idempotency key on a mutating request', () => {
    http.post(REPAYMENT, BODY).subscribe();

    const request = backend.expectOne(REPAYMENT);
    expect(request.request.headers.get(IDEMPOTENCY_KEY_HEADER)).toMatch(/\S/);
    request.flush({});
  });

  it('gives a second, deliberate submission its own key and its own request', () => {
    // Deliberately posting the same amount twice is legitimate — a customer paying two
    // instalments in one visit. Only the *in-flight* window is collapsed, so once the first has
    // settled the second is a real request again.
    http.post(REPAYMENT, BODY).subscribe();
    const first = backend.expectOne(REPAYMENT);
    const firstKey = first.request.headers.get(IDEMPOTENCY_KEY_HEADER);
    first.flush({ resourceId: 5 });

    http.post(REPAYMENT, BODY).subscribe();
    const second = backend.expectOne(REPAYMENT);
    const secondKey = second.request.headers.get(IDEMPOTENCY_KEY_HEADER);
    second.flush({ resourceId: 6 });

    expect(secondKey).not.toBe(firstKey);
  });

  it('does not collapse two requests that would do different things', () => {
    http.post(REPAYMENT, { transactionAmount: 100 }).subscribe();
    http.post(REPAYMENT, { transactionAmount: 250 }).subscribe();

    const requests = backend.match(REPAYMENT);
    expect(requests).toHaveLength(2);
    for (const request of requests) request.flush({});
  });

  it('separates requests by command, which lives in the query', () => {
    // `?command=` is how Fineract distinguishes approve from disburse on the same path, so the
    // query has to be part of what makes a request distinct.
    http.post('/loans/2?command=approve', {}).subscribe();
    http.post('/loans/2?command=disburse', {}).subscribe();

    backend.expectOne('/loans/2?command=approve').flush({});
    backend.expectOne('/loans/2?command=disburse').flush({});
  });

  it('shares a failure with both callers, and then lets the form try again', () => {
    const errors: number[] = [];
    http.post(REPAYMENT, BODY).subscribe({ error: (e) => errors.push(e.status) });
    http.post(REPAYMENT, BODY).subscribe({ error: (e) => errors.push(e.status) });

    backend.expectOne(REPAYMENT).flush({}, { status: 500, statusText: 'Server Error' });
    expect(errors).toEqual([500, 500]);

    // The entry is gone once it settled, so a retry after an error is a real request — a form
    // whose save failed has to be saveable.
    http.post(REPAYMENT, BODY).subscribe({ error: () => undefined });
    backend.expectOne(REPAYMENT).flush({}, { status: 500, statusText: 'Server Error' });
  });

  it('leaves GET alone entirely', () => {
    http.get('/loans/2').subscribe();
    http.get('/loans/2').subscribe();

    const requests = backend.match('/loans/2');
    expect(requests).toHaveLength(2);
    expect(requests[0].request.headers.has(IDEMPOTENCY_KEY_HEADER)).toBe(false);
    for (const request of requests) request.flush({});
  });

  it('keys a PUT and a DELETE too, and collapses their duplicates', () => {
    http.put('/clients/2', { firstname: 'Edited' }).subscribe();
    http.put('/clients/2', { firstname: 'Edited' }).subscribe();
    const put = backend.expectOne({ method: 'PUT', url: '/clients/2' });
    expect(put.request.headers.get(IDEMPOTENCY_KEY_HEADER)).toMatch(/\S/);
    put.flush({});

    http.delete('/clients/2').subscribe();
    http.delete('/clients/2').subscribe();
    const remove = backend.expectOne({ method: 'DELETE', url: '/clients/2' });
    expect(remove.request.headers.get(IDEMPOTENCY_KEY_HEADER)).toMatch(/\S/);
    remove.flush({});
  });

  it('keys but does not collapse an upload, whose body cannot be compared', () => {
    // Two file uploads with the same name are not the same upload, and a FormData body cannot be
    // compared by value — so these stay two requests.
    const body = new FormData();
    body.append('file', new Blob(['x']), 'statement.csv');
    http.post('/documents', body).subscribe();
    http.post('/documents', body).subscribe();

    const requests = backend.match('/documents');
    expect(requests).toHaveLength(2);
    for (const request of requests) {
      expect(request.request.headers.get(IDEMPOTENCY_KEY_HEADER)).toMatch(/\S/);
      request.flush({});
    }
  });
});
