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

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Functional HTTP Interceptor that handles authentication and multi-tenancy.
 *
 * Injects the mandatory `Fineract-Platform-TenantId` header and the
 * `Authorization` header (if an active session exists) into every outgoing request.
 *
 * @param req - The outgoing HTTP request
 * @param next - The next handler in the interceptor chain
 * @returns An observable of the intercepted HTTP event stream
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);
  const token = authService.getAuthToken();
  const tenantId = authService.currentTenantId();

  // Always include Tenant headers for Fineract/Mifos compatibility
  let authReq = req.clone({
    setHeaders: {
      'Fineract-Platform-TenantId': tenantId,
      'X-Mifos-Platform-TenantId': tenantId,
    },
  });

  // Inject Basic Auth token if the user is logged in
  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Basic ${token}`,
      },
    });
  }

  return next(authReq);
};
