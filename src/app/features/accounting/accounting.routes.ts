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

export const ACCOUNTING_ROUTES: Routes = [
  {
    path: 'chart-of-accounts',
    loadComponent: () =>
      import('./chart-of-accounts.component').then((m) => m.ChartOfAccountsComponent),
  },
  {
    path: 'chart-of-accounts/create',
    loadComponent: () =>
      import('./gl-account-form.component').then((m) => m.GLAccountFormComponent),
  },
  {
    path: 'chart-of-accounts/edit/:id',
    loadComponent: () =>
      import('./gl-account-form.component').then((m) => m.GLAccountFormComponent),
  },
  {
    path: 'journal-entries',
    loadComponent: () =>
      import('./journal-entries-list.component').then((m) => m.JournalEntriesListComponent),
  },
  {
    path: 'journal-entries/create',
    loadComponent: () =>
      import('./journal-entry-form.component').then((m) => m.JournalEntryFormComponent),
  },
  {
    path: 'closures',
    loadComponent: () =>
      import('./accounting-closures-list.component').then((m) => m.AccountingClosuresListComponent),
  },
  {
    path: 'closures/create',
    loadComponent: () =>
      import('./accounting-closure-form.component').then((m) => m.AccountingClosureFormComponent),
  },
  {
    path: 'rules',
    loadComponent: () =>
      import('./accounting-rules-list.component').then((m) => m.AccountingRulesListComponent),
  },
  {
    path: 'rules/create',
    loadComponent: () =>
      import('./accounting-rule-form.component').then((m) => m.AccountingRuleFormComponent),
  },
  {
    path: 'rules/edit/:id',
    loadComponent: () =>
      import('./accounting-rule-form.component').then((m) => m.AccountingRuleFormComponent),
  },
  {
    path: 'financial-activity-mappings',
    loadComponent: () =>
      import('./financial-activity-mappings-list.component').then(
        (m) => m.FinancialActivityMappingsListComponent,
      ),
  },
  {
    path: 'financial-activity-mappings/create',
    loadComponent: () =>
      import('./financial-activity-mapping-form.component').then(
        (m) => m.FinancialActivityMappingFormComponent,
      ),
  },
  {
    path: 'financial-activity-mappings/edit/:id',
    loadComponent: () =>
      import('./financial-activity-mapping-form.component').then(
        (m) => m.FinancialActivityMappingFormComponent,
      ),
  },
  {
    path: 'charges',
    loadComponent: () =>
      import('./charges/charges-list.component').then((m) => m.ChargesListComponent),
  },
  {
    path: 'charges/create',
    loadComponent: () =>
      import('./charges/charge-form.component').then((m) => m.ChargeFormComponent),
  },
  {
    path: 'charges/edit/:id',
    loadComponent: () =>
      import('./charges/charge-form.component').then((m) => m.ChargeFormComponent),
  },
  {
    path: 'provisioning-categories',
    loadComponent: () =>
      import('./provisioning-categories/provisioning-categories-list.component').then(
        (m) => m.ProvisioningCategoriesListComponent,
      ),
  },
  {
    path: 'provisioning-categories/create',
    loadComponent: () =>
      import('./provisioning-categories/provisioning-categories-form.component').then(
        (m) => m.ProvisioningCategoriesFormComponent,
      ),
  },
  {
    path: 'provisioning-categories/edit/:id',
    loadComponent: () =>
      import('./provisioning-categories/provisioning-categories-form.component').then(
        (m) => m.ProvisioningCategoriesFormComponent,
      ),
  },
  {
    path: 'provisioning-criteria',
    loadComponent: () =>
      import('./provisioning-criteria/provisioning-criteria-list.component').then(
        (m) => m.ProvisioningCriteriaListComponent,
      ),
  },
  {
    path: 'provisioning-criteria/create',
    loadComponent: () =>
      import('./provisioning-criteria/provisioning-criteria-form.component').then(
        (m) => m.ProvisioningCriteriaFormComponent,
      ),
  },
  {
    path: 'provisioning-criteria/edit/:id',
    loadComponent: () =>
      import('./provisioning-criteria/provisioning-criteria-form.component').then(
        (m) => m.ProvisioningCriteriaFormComponent,
      ),
  },
  {
    path: 'provisioning-entries',
    loadComponent: () =>
      import('./provisioning-entries/provisioning-entries-list.component').then(
        (m) => m.ProvisioningEntriesListComponent,
      ),
  },
  {
    path: 'provisioning-entries/create',
    loadComponent: () =>
      import('./provisioning-entries/provisioning-entries-form.component').then(
        (m) => m.ProvisioningEntriesFormComponent,
      ),
  },
  {
    path: 'run-accruals',
    loadComponent: () =>
      import('./run-accruals/run-accruals.component').then((m) => m.RunAccrualsComponent),
  },
];
