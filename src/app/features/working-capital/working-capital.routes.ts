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

import { Routes } from '@angular/router';

export const WORKING_CAPITAL_ROUTES: Routes = [
  {
    path: 'breach',
    loadComponent: () =>
      import('./breach/wc-breach-list.component').then((m) => m.WcBreachListComponent),
  },
  {
    path: 'breach/create',
    loadComponent: () =>
      import('./breach/wc-breach-form.component').then((m) => m.WcBreachFormComponent),
  },
  {
    path: 'breach/edit/:id',
    loadComponent: () =>
      import('./breach/wc-breach-form.component').then((m) => m.WcBreachFormComponent),
  },
  {
    path: 'near-breach',
    loadComponent: () =>
      import('./near-breach/wc-near-breach-list.component').then(
        (m) => m.WcNearBreachListComponent,
      ),
  },
  {
    path: 'near-breach/create',
    loadComponent: () =>
      import('./near-breach/wc-near-breach-form.component').then(
        (m) => m.WcNearBreachFormComponent,
      ),
  },
  {
    path: 'near-breach/edit/:id',
    loadComponent: () =>
      import('./near-breach/wc-near-breach-form.component').then(
        (m) => m.WcNearBreachFormComponent,
      ),
  },
  {
    path: 'loan-products',
    loadComponent: () =>
      import('./loan-products/wc-loan-products-list.component').then(
        (m) => m.WcLoanProductsListComponent,
      ),
  },
  {
    path: 'loan-products/create',
    loadComponent: () =>
      import('./loan-products/wc-loan-product-form.component').then(
        (m) => m.WcLoanProductFormComponent,
      ),
  },
  {
    path: 'loan-products/edit/:id',
    loadComponent: () =>
      import('./loan-products/wc-loan-product-form.component').then(
        (m) => m.WcLoanProductFormComponent,
      ),
  },
  {
    path: 'loans',
    loadComponent: () =>
      import('./loans/wc-loans-list.component').then((m) => m.WcLoansListComponent),
  },
  {
    path: 'loans/create',
    loadComponent: () =>
      import('./loans/wc-loan-form.component').then((m) => m.WcLoanFormComponent),
  },
  {
    path: 'loans/view/:id',
    loadComponent: () =>
      import('./loans/wc-loan-view.component').then((m) => m.WcLoanViewComponent),
  },
  {
    path: 'loans/:id/action/:command',
    loadComponent: () =>
      import('./loans/wc-loan-action-form.component').then((m) => m.WcLoanActionFormComponent),
  },
  {
    path: 'loans/account-locks',
    loadComponent: () =>
      import('./loans/wc-account-lock/wc-loan-account-lock.component').then(
        (m) => m.WcLoanAccountLockComponent,
      ),
  },
  {
    path: 'loans/cob-catchup',
    loadComponent: () =>
      import('./loans/wc-cob-catchup/wc-loan-cob-catchup.component').then(
        (m) => m.WcLoanCobCatchupComponent,
      ),
  },
];
