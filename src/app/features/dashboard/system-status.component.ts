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

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="status-card">
      <h3>{{ 'dashboard.systemStatus' | translate }}</h3>
      <ul>
        <li><strong>API URL:</strong> {{ apiUrl }}</li>
        <li><strong>Environment:</strong> {{ isProd ? 'Production' : 'Development' }}</li>
        <li><strong>Tenant:</strong> {{ currentTenant() }}</li>
      </ul>
    </div>
  `,
  styles: [
    `
      .status-card {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-top: 1rem;
        background-color: #f9f9f9;
      }
    `,
  ],
})
export class SystemStatusComponent {
  protected readonly apiUrl = environment.fineractApiUrl;
  protected readonly isProd = environment.production;
  protected readonly currentTenant = signal('default');
}
