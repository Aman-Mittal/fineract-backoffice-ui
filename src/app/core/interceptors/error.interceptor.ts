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

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/**
 * Functional HTTP Interceptor that catches API errors and displays all validation
 * errors in a stacked notification using a Snackbar.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string;

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        if (error.status === 400 && error.error?.errors && Array.isArray(error.error.errors)) {
          errorMessage = error.error.errors
            .map(
              (err: Record<string, unknown>) =>
                `• ${err['developerMessage'] || err['defaultUserMessage'] || 'Validation error'}`,
            )
            .join('\n');
        } else if (error.error?.developerMessage) {
          errorMessage = error.error.developerMessage;
        } else if (error.error?.defaultUserMessage) {
          errorMessage = error.error.defaultUserMessage;
        } else if (error.status === 0) {
          errorMessage =
            'Unable to connect to the server. Please check your network or CORS settings.';
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }

      snackBar.open(errorMessage, 'Close', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });

      return throwError(() => error);
    }),
  );
};
