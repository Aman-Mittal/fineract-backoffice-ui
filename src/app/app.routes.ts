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
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/system-status.component').then(
            (m) => m.SystemStatusComponent,
          ),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/clients-list.component').then((m) => m.ClientsListComponent),
      },
      {
        path: 'clients/create',
        loadComponent: () =>
          import('./features/clients/client-form.component').then((m) => m.ClientFormComponent),
      },
      {
        path: 'clients/edit/:id',
        loadComponent: () =>
          import('./features/clients/client-form.component').then((m) => m.ClientFormComponent),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./features/groups/groups-list.component').then((m) => m.GroupsListComponent),
      },
      {
        path: 'groups/create',
        loadComponent: () =>
          import('./features/groups/group-form.component').then((m) => m.GroupFormComponent),
      },
      {
        path: 'groups/edit/:id',
        loadComponent: () =>
          import('./features/groups/group-form.component').then((m) => m.GroupFormComponent),
      },
      {
        path: 'centers',
        loadComponent: () =>
          import('./features/centers/centers-list.component').then((m) => m.CentersListComponent),
      },
      {
        path: 'centers/create',
        loadComponent: () =>
          import('./features/centers/center-form.component').then((m) => m.CenterFormComponent),
      },
      {
        path: 'centers/edit/:id',
        loadComponent: () =>
          import('./features/centers/center-form.component').then((m) => m.CenterFormComponent),
      },
      {
        path: 'products/loan',
        loadComponent: () =>
          import('./features/products/loan-products-list.component').then((m) => m.LoanProductsListComponent),
      },
      {
        path: 'products/loan/create',
        loadComponent: () =>
          import('./features/products/loan-product-form.component').then((m) => m.LoanProductFormComponent),
      },
      {
        path: 'products/loan/edit/:id',
        loadComponent: () =>
          import('./features/products/loan-product-form.component').then((m) => m.LoanProductFormComponent),
      },
      {
        path: 'products/savings',
        loadComponent: () =>
          import('./features/products/savings-products-list.component').then((m) => m.SavingsProductsListComponent),
      },
      {
        path: 'products/savings/create',
        loadComponent: () =>
          import('./features/products/savings-product-form.component').then((m) => m.SavingsProductFormComponent),
      },
      {
        path: 'products/savings/edit/:id',
        loadComponent: () =>
          import('./features/products/savings-product-form.component').then((m) => m.SavingsProductFormComponent),
      },
      {
        path: 'fintech/asset-owners',
        loadComponent: () =>
          import('./features/fintech/asset-owners-list.component').then((m) => m.ExternalAssetOwnersListComponent),
      },
      {
        path: 'accounting/chart-of-accounts',
        loadComponent: () =>
          import('./features/accounting/chart-of-accounts.component').then((m) => m.ChartOfAccountsComponent),
      },
      {
        path: 'accounting/chart-of-accounts/create',
        loadComponent: () =>
          import('./features/accounting/gl-account-form.component').then((m) => m.GLAccountFormComponent),
      },
      {
        path: 'accounting/chart-of-accounts/edit/:id',
        loadComponent: () =>
          import('./features/accounting/gl-account-form.component').then((m) => m.GLAccountFormComponent),
      },
      {
        path: 'organization/offices',
        loadComponent: () =>
          import('./features/organization/offices/offices-list.component').then((m) => m.OfficesListComponent),
      },
      {
        path: 'organization/offices/create',
        loadComponent: () =>
          import('./features/organization/offices/office-form.component').then((m) => m.OfficeFormComponent),
      },
      {
        path: 'organization/offices/edit/:id',
        loadComponent: () =>
          import('./features/organization/offices/office-form.component').then((m) => m.OfficeFormComponent),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./features/loans/loans-list.component').then((m) => m.LoansListComponent),
      },
      {
        path: 'loans/create',
        loadComponent: () =>
          import('./features/loans/loan-form.component').then((m) => m.LoanFormComponent),
      },
      {
        path: 'loans/edit/:id',
        loadComponent: () =>
          import('./features/loans/loan-form.component').then((m) => m.LoanFormComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
