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
import { authGuard } from '../../core/guards/auth.guard';

export const ORGANIZATION_ROUTES: Routes = [
  {
    path: 'offices',
    loadComponent: () =>
      import('./offices/offices-list.component').then((m) => m.OfficesListComponent),
  },
  {
    path: 'offices/create',
    loadComponent: () =>
      import('./offices/office-form.component').then((m) => m.OfficeFormComponent),
  },
  {
    path: 'offices/edit/:id',
    loadComponent: () =>
      import('./offices/office-form.component').then((m) => m.OfficeFormComponent),
  },
  {
    path: 'funds',
    loadComponent: () => import('./funds/funds-list.component').then((m) => m.FundsListComponent),
  },
  {
    path: 'funds/create',
    loadComponent: () => import('./funds/fund-form.component').then((m) => m.FundFormComponent),
  },
  {
    path: 'funds/edit/:id',
    loadComponent: () => import('./funds/fund-form.component').then((m) => m.FundFormComponent),
  },
  {
    path: 'payment-types',
    loadComponent: () =>
      import('./payment-types/payment-types-list.component').then(
        (m) => m.PaymentTypesListComponent,
      ),
  },
  {
    path: 'payment-types/create',
    loadComponent: () =>
      import('./payment-types/payment-type-form.component').then((m) => m.PaymentTypeFormComponent),
  },
  {
    path: 'payment-types/edit/:id',
    loadComponent: () =>
      import('./payment-types/payment-type-form.component').then((m) => m.PaymentTypeFormComponent),
  },
  {
    path: 'staff',
    loadComponent: () => import('./staff/staff-list.component').then((m) => m.StaffListComponent),
  },
  {
    path: 'staff/create',
    loadComponent: () => import('./staff/staff-form.component').then((m) => m.StaffFormComponent),
  },
  {
    path: 'staff/edit/:id',
    loadComponent: () => import('./staff/staff-form.component').then((m) => m.StaffFormComponent),
  },
  {
    path: 'currencies',
    loadComponent: () =>
      import('./currencies/currencies.component').then((m) => m.CurrenciesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'account-number-formats',
    loadComponent: () =>
      import('./account-number-formats/account-number-formats-list.component').then(
        (m) => m.AccountNumberFormatsListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'account-number-formats/create',
    loadComponent: () =>
      import('./account-number-formats/account-number-format-form.component').then(
        (m) => m.AccountNumberFormatFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'account-number-formats/edit/:id',
    loadComponent: () =>
      import('./account-number-formats/account-number-format-form.component').then(
        (m) => m.AccountNumberFormatFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'group-levels',
    loadComponent: () =>
      import('./group-levels/group-levels-list.component').then((m) => m.GroupLevelsListComponent),
  },
  {
    path: 'office-transactions',
    loadComponent: () =>
      import('./office-transactions/office-transactions-list.component').then(
        (m) => m.OfficeTransactionsListComponent,
      ),
  },
  {
    path: 'office-transactions/create',
    loadComponent: () =>
      import('./office-transactions/office-transaction-form.component').then(
        (m) => m.OfficeTransactionFormComponent,
      ),
  },
];
