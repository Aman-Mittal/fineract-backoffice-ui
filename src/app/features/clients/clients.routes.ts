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

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./clients-list.component').then((m) => m.ClientsListComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./client-search-v2.component').then((m) => m.ClientSearchV2Component),
  },
  {
    path: 'create',
    loadComponent: () => import('./client-form.component').then((m) => m.ClientFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./client-form.component').then((m) => m.ClientFormComponent),
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./client-view.component').then((m) => m.ClientViewComponent),
  },
  {
    path: ':clientId/identifiers/create',
    loadComponent: () =>
      import('./kyc/client-identifier-form.component').then((m) => m.ClientIdentifierFormComponent),
  },
  {
    path: ':clientId/identifiers/edit/:id',
    loadComponent: () =>
      import('./kyc/client-identifier-form.component').then((m) => m.ClientIdentifierFormComponent),
  },
  {
    path: ':clientId/addresses/create',
    loadComponent: () =>
      import('./kyc/client-address-form.component').then((m) => m.ClientAddressFormComponent),
  },
  {
    path: ':clientId/addresses/edit/:id',
    loadComponent: () =>
      import('./kyc/client-address-form.component').then((m) => m.ClientAddressFormComponent),
  },
  {
    path: ':clientId/family-members/create',
    loadComponent: () =>
      import('./kyc/client-family-member-form.component').then(
        (m) => m.ClientFamilyMemberFormComponent,
      ),
  },
  {
    path: ':clientId/family-members/edit/:id',
    loadComponent: () =>
      import('./kyc/client-family-member-form.component').then(
        (m) => m.ClientFamilyMemberFormComponent,
      ),
  },
  {
    path: ':clientId/notes/create',
    loadComponent: () =>
      import('./kyc/client-note-form.component').then((m) => m.ClientNoteFormComponent),
  },
  {
    path: ':clientId/notes/edit/:id',
    loadComponent: () =>
      import('./kyc/client-note-form.component').then((m) => m.ClientNoteFormComponent),
  },
  {
    path: ':clientId/documents/create',
    loadComponent: () =>
      import('./kyc/client-document-form.component').then((m) => m.ClientDocumentFormComponent),
  },
  {
    path: ':clientId/documents/edit/:id',
    loadComponent: () =>
      import('./kyc/client-document-form.component').then((m) => m.ClientDocumentFormComponent),
  },
  {
    path: ':clientId/charges',
    loadComponent: () =>
      import('./charges/client-charges-list.component').then((m) => m.ClientChargesListComponent),
  },
  {
    path: ':clientId/charges/create',
    loadComponent: () =>
      import('./charges/client-charge-form.component').then((m) => m.ClientChargeFormComponent),
  },
  {
    path: ':clientId/collaterals',
    loadComponent: () =>
      import('./collateral/client-collateral-list.component').then(
        (m) => m.ClientCollateralListComponent,
      ),
  },
  {
    path: ':clientId/collaterals/create',
    loadComponent: () =>
      import('./collateral/client-collateral-form.component').then(
        (m) => m.ClientCollateralFormComponent,
      ),
  },
  {
    path: ':clientId/collaterals/edit/:id',
    loadComponent: () =>
      import('./collateral/client-collateral-form.component').then(
        (m) => m.ClientCollateralFormComponent,
      ),
  },
  {
    path: ':clientId/transactions',
    loadComponent: () =>
      import('./transactions/client-transactions-list.component').then(
        (m) => m.ClientTransactionsListComponent,
      ),
  },
];
