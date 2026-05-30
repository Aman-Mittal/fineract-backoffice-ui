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

import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';
import { GuidanceTourComponent } from '../shared';
import { LoadingService } from '../core/services/loading.service';

/**
 * The primary application layout component (App Shell).
 *
 * Composes the `HeaderComponent` and `SidebarComponent` into a standard
 * business application layout with a scrollable main content area.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule,
    MatProgressBarModule,
    HeaderComponent,
    SidebarComponent,
    GuidanceTourComponent,
  ],
  template: `
    <div class="app-container">
      @if (loadingService.isLoading()) {
        <mat-progress-bar mode="indeterminate" class="global-loader"></mat-progress-bar>
      }
      <app-header />
      <div class="main-wrapper">
        <app-sidebar />
        <main class="content-area" role="main">
          <router-outlet />
        </main>
      </div>
      <app-guidance-tour />
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
        position: relative;
      }
      .global-loader {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        height: 3px;
      }
      .main-wrapper {
        display: flex;
        flex: 1;
        overflow: hidden;
      }
      .content-area {
        flex: 1;
        padding: 2rem;
        background-color: var(--bg-color);
        overflow-y: auto;
      }
    `,
  ],
})
export class MainLayoutComponent {
  protected readonly loadingService = inject(LoadingService);
}
