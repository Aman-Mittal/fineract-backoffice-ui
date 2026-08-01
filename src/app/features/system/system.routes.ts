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

export const SYSTEM_ROUTES: Routes = [
  {
    path: 'data-tables',
    loadComponent: () =>
      import('./data-tables/datatables-list.component').then((m) => m.DatatablesListComponent),
  },
  {
    path: 'data-tables/create',
    loadComponent: () =>
      import('./data-tables/datatables-form.component').then((m) => m.DatatablesFormComponent),
  },
  {
    path: 'data-tables/edit/:name',
    loadComponent: () =>
      import('./data-tables/datatables-form.component').then((m) => m.DatatablesFormComponent),
  },
  {
    path: 'codes',
    loadComponent: () => import('./codes/codes-list.component').then((m) => m.CodesListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'codes/create',
    loadComponent: () => import('./codes/code-form.component').then((m) => m.CodeFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'codes/edit/:id',
    loadComponent: () => import('./codes/code-form.component').then((m) => m.CodeFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'codes/:codeId/values',
    loadComponent: () =>
      import('./codes/code-values-list.component').then((m) => m.CodeValuesListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'codes/:codeId/values/create',
    loadComponent: () =>
      import('./codes/code-value-form.component').then((m) => m.CodeValueFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'codes/:codeId/values/edit/:id',
    loadComponent: () =>
      import('./codes/code-value-form.component').then((m) => m.CodeValueFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'business-dates',
    loadComponent: () =>
      import('./business-dates/business-dates.component').then((m) => m.BusinessDatesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'templates',
    loadComponent: () =>
      import('./templates/templates-list.component').then((m) => m.TemplatesListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'templates/create',
    loadComponent: () =>
      import('./templates/template-form.component').then((m) => m.TemplateFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'templates/edit/:id',
    loadComponent: () =>
      import('./templates/template-form.component').then((m) => m.TemplateFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'bulk-import',
    loadComponent: () =>
      import('./bulk-import/bulk-import.component').then((m) => m.BulkImportComponent),
  },
  {
    path: 'delinquency',
    loadComponent: () =>
      import('./delinquency/delinquency-management.component').then(
        (m) => m.DelinquencyManagementComponent,
      ),
  },
  {
    path: 'credit-bureau-config',
    loadComponent: () =>
      import('./credit-bureau-config/credit-bureau-config.component').then(
        (m) => m.CreditBureauConfigComponent,
      ),
  },
  {
    path: 'hooks',
    loadComponent: () => import('./hooks/hooks-list.component').then((m) => m.HooksListComponent),
  },
  {
    path: 'hooks/create',
    loadComponent: () => import('./hooks/hooks-form.component').then((m) => m.HooksFormComponent),
  },
  {
    path: 'hooks/edit/:id',
    loadComponent: () => import('./hooks/hooks-form.component').then((m) => m.HooksFormComponent),
  },
  {
    path: 'adhoc-query',
    loadComponent: () =>
      import('./adhoc-query/adhoc-query-list.component').then((m) => m.AdhocQueryListComponent),
  },
  {
    path: 'adhoc-query/create',
    loadComponent: () =>
      import('./adhoc-query/adhoc-query-form.component').then((m) => m.AdhocQueryFormComponent),
  },
  {
    path: 'adhoc-query/edit/:id',
    loadComponent: () =>
      import('./adhoc-query/adhoc-query-form.component').then((m) => m.AdhocQueryFormComponent),
  },
  {
    path: 'sms',
    loadComponent: () => import('./sms/sms-list.component').then((m) => m.SmsListComponent),
  },
  {
    path: 'sms/create',
    loadComponent: () => import('./sms/sms-form.component').then((m) => m.SmsFormComponent),
  },
  {
    path: 'sms/edit/:id',
    loadComponent: () => import('./sms/sms-form.component').then((m) => m.SmsFormComponent),
  },
  {
    path: 'report-mailing-jobs',
    loadComponent: () =>
      import('./report-mailing-jobs/report-mailing-jobs-list.component').then(
        (m) => m.ReportMailingJobsListComponent,
      ),
  },
  {
    path: 'report-mailing-jobs/create',
    loadComponent: () =>
      import('./report-mailing-jobs/report-mailing-jobs-form.component').then(
        (m) => m.ReportMailingJobsFormComponent,
      ),
  },
  {
    path: 'report-mailing-jobs/edit/:id',
    loadComponent: () =>
      import('./report-mailing-jobs/report-mailing-jobs-form.component').then(
        (m) => m.ReportMailingJobsFormComponent,
      ),
  },
  {
    path: 'entity-data-table-checks',
    loadComponent: () =>
      import('./entity-data-table-checks/entity-data-table-checks-list.component').then(
        (m) => m.EntityDataTableChecksListComponent,
      ),
  },
  {
    path: 'entity-data-table-checks/create',
    loadComponent: () =>
      import('./entity-data-table-checks/entity-data-table-checks-form.component').then(
        (m) => m.EntityDataTableChecksFormComponent,
      ),
  },
  {
    path: 'entity-mapping',
    loadComponent: () =>
      import('./entity-mapping/entity-mapping-list.component').then(
        (m) => m.EntityMappingListComponent,
      ),
  },
  {
    path: 'entity-mapping/create',
    loadComponent: () =>
      import('./entity-mapping/entity-mapping-form.component').then(
        (m) => m.EntityMappingFormComponent,
      ),
  },
  {
    path: 'entity-mapping/edit/:id',
    loadComponent: () =>
      import('./entity-mapping/entity-mapping-form.component').then(
        (m) => m.EntityMappingFormComponent,
      ),
  },
  {
    path: 'business-steps',
    loadComponent: () =>
      import('./business-steps/business-steps.component').then((m) => m.BusinessStepsComponent),
  },
  {
    path: 'cache',
    loadComponent: () => import('./cache/cache.component').then((m) => m.CacheComponent),
  },
  {
    path: 'external-events',
    loadComponent: () =>
      import('./external-events/external-events.component').then((m) => m.ExternalEventsComponent),
  },
  {
    path: 'external-services',
    loadComponent: () =>
      import('./external-services/external-services.component').then(
        (m) => m.ExternalServicesComponent,
      ),
  },
  {
    path: 'password-preferences',
    loadComponent: () =>
      import('./password-preferences/password-preferences.component').then(
        (m) => m.PasswordPreferencesComponent,
      ),
  },
  {
    path: 'notifications-config',
    loadComponent: () =>
      import('./notifications-config/notifications-config.component').then(
        (m) => m.NotificationsConfigComponent,
      ),
  },
  {
    path: 'instance-mode',
    loadComponent: () =>
      import('./instance-mode/instance-mode.component').then((m) => m.InstanceModeComponent),
  },
  {
    path: 'scheduler-jobs',
    loadComponent: () =>
      import('./scheduler-jobs/scheduler-jobs-list.component').then(
        (m) => m.SchedulerJobsListComponent,
      ),
  },
  {
    path: 'scheduler-jobs/:id/history',
    loadComponent: () =>
      import('./scheduler-jobs/scheduler-job-history.component').then(
        (m) => m.SchedulerJobHistoryComponent,
      ),
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('./permissions/permissions.component').then((m) => m.PermissionsListComponent),
  },
  {
    path: 'oidc-config',
    loadComponent: () =>
      import('./oidc-config/oidc-config.component').then((m) => m.OidcConfigComponent),
  },
  {
    path: 'field-configuration',
    loadComponent: () =>
      import('./field-configuration/field-configuration.component').then(
        (m) => m.FieldConfigurationComponent,
      ),
  },
  {
    path: 'loan-product-details',
    loadComponent: () =>
      import('./loan-product-details/loan-product-details.component').then(
        (m) => m.LoanProductDetailsComponent,
      ),
  },
];
