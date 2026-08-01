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

export const CAMPAIGNS_ROUTES: Routes = [
  {
    path: 'email',
    loadComponent: () =>
      import('./email-campaigns/email-campaigns-list.component').then(
        (m) => m.EmailCampaignsListComponent,
      ),
  },
  {
    path: 'email/create',
    loadComponent: () =>
      import('./email-campaigns/email-campaign-form.component').then(
        (m) => m.EmailCampaignFormComponent,
      ),
  },
  {
    path: 'email/:id/edit',
    loadComponent: () =>
      import('./email-campaigns/email-campaign-form.component').then(
        (m) => m.EmailCampaignFormComponent,
      ),
  },
  {
    path: 'sms',
    loadComponent: () =>
      import('./sms-campaigns/sms-campaigns-list.component').then(
        (m) => m.SmsCampaignsListComponent,
      ),
  },
  {
    path: 'sms/create',
    loadComponent: () =>
      import('./sms-campaigns/sms-campaign-form.component').then((m) => m.SmsCampaignFormComponent),
  },
  {
    path: 'sms/:id/edit',
    loadComponent: () =>
      import('./sms-campaigns/sms-campaign-form.component').then((m) => m.SmsCampaignFormComponent),
  },
  {
    path: 'email-messages',
    loadComponent: () =>
      import('./email-messages/email-messages.component').then((m) => m.EmailMessagesComponent),
  },
];
