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

import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  const testUrl = '/api/test';
  const expectedErrorMsg = 'expected an error';

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should pass through successful requests', () => {
    httpClient.get(testUrl).subscribe((response) => {
      expect(response).toEqual({ data: 'ok' });
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush({ data: 'ok' });

    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should handle Client-side / Network Error Event', () => {
    const errorEvent = new ErrorEvent('Network error', { message: 'Failed to connect' });

    httpClient.get(testUrl).subscribe({
      next: () => fail(expectedErrorMsg),
      error: (error) => {
        expect(error.status).toBe(0);
      },
    });

    const req = httpTestingController.expectOne(testUrl);
    req.error(errorEvent);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Error: Failed to connect',
      'Close',
      jasmine.any(Object),
    );
  });

  it('should handle validation errors array from API', () => {
    const mockValidationErrorResponse = {
      errors: [
        { parameterName: 'username', developerMessage: 'Username already exists' },
        { defaultUserMessage: 'Invalid email format' },
      ],
      defaultUserMessage: 'Validation failed',
    };

    httpClient.get(testUrl).subscribe({
      next: () => fail(expectedErrorMsg),
      error: () => expect().nothing(),
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush(mockValidationErrorResponse, { status: 400, statusText: 'Bad Request' });

    const expectedMessage =
      'Validation failed\n\n• [username] Username already exists\n• Invalid email format';
    expect(snackBarSpy.open).toHaveBeenCalledWith(expectedMessage, 'Close', jasmine.any(Object));
  });

  it('should handle single developerMessage or defaultUserMessage', () => {
    httpClient.get(testUrl).subscribe({
      next: () => fail(expectedErrorMsg),
      error: () => expect().nothing(),
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush(
      { developerMessage: 'Custom dev message' },
      { status: 500, statusText: 'Server Error' },
    );

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Custom dev message',
      'Close',
      jasmine.any(Object),
    );

    // Reset spy
    snackBarSpy.open.calls.reset();

    httpClient.get('/api/test2').subscribe({
      next: () => fail(expectedErrorMsg),
      error: () => expect().nothing(),
    });

    const req2 = httpTestingController.expectOne('/api/test2');
    req2.flush(
      { defaultUserMessage: 'Custom user message' },
      { status: 404, statusText: 'Not Found' },
    );

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Custom user message',
      'Close',
      jasmine.any(Object),
    );
  });

  it('should handle status 0 when no message is present', () => {
    httpClient.get(testUrl).subscribe({
      next: () => fail(expectedErrorMsg),
      error: () => expect().nothing(),
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush(null, { status: 0, statusText: '' });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Unable to connect to the server. Please check your network or CORS settings.',
      'Close',
      jasmine.any(Object),
    );
  });

  it('should fallback to status code and message description for other errors', () => {
    httpClient.get(testUrl).subscribe({
      next: () => fail(expectedErrorMsg),
      error: () => expect().nothing(),
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Plain error body', { status: 503, statusText: 'Service Unavailable' });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      jasmine.stringMatching(/Error Code: 503/),
      'Close',
      jasmine.any(Object),
    );
  });
});
