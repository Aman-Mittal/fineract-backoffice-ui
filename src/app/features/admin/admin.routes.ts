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

export const ADMIN_ROUTES: Routes = [
  {
    path: 'batch-operations',
    loadComponent: () =>
      import('./batch-operations/batch-operations.component').then(
        (m) => m.BatchOperationsComponent,
      ),
  },
  {
    path: 'inline-job',
    loadComponent: () =>
      import('./inline-job/inline-job.component').then((m) => m.InlineJobComponent),
  },
  {
    path: 'cob-tools',
    loadComponent: () => import('./cob-tools/cob-tools.component').then((m) => m.CobToolsComponent),
  },
  {
    path: 'wc-cob-tools',
    loadComponent: () =>
      import('./wc-cob-tools/wc-cob-tools.component').then((m) => m.WcCobToolsComponent),
  },
  {
    path: 'external-events',
    loadComponent: () =>
      import('./external-events/external-events.component').then((m) => m.ExternalEventsComponent),
  },
  {
    path: 'progressive-loan',
    loadComponent: () =>
      import('./progressive-loan/progressive-loan-model.component').then(
        (m) => m.ProgressiveLoanModelComponent,
      ),
  },
];
