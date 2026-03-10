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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Responsive sidebar component for primary application navigation.
 *
 * Provides links to core feature modules including Dashboard, Clients,
 * Loans, and Organization management. Supports active route highlighting.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <nav class="sidebar" role="navigation" [attr.aria-label]="'nav.main' | translate">
      <ul class="nav-list">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-text">{{ 'nav.dashboard' | translate }}</span>
          </a>
        </li>
        <li>
          <a routerLink="/features/clients" routerLinkActive="active" class="nav-item">
            <span class="nav-text">{{ 'nav.clients' | translate }}</span>
          </a>
        </li>
        <li>
          <a routerLink="/features/loans" routerLinkActive="active" class="nav-item">
            <span class="nav-text">{{ 'nav.loans' | translate }}</span>
          </a>
        </li>
        <li>
          <a routerLink="/features/organization" routerLinkActive="active" class="nav-item">
            <span class="nav-text">{{ 'nav.organization' | translate }}</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [
    `
      .sidebar {
        width: var(--sidebar-width);
        background-color: var(--secondary-color);
        color: #fff;
        height: calc(100vh - var(--header-height));
        padding-top: 1rem;
      }
      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .nav-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        color: #bdc3c7;
        text-decoration: none;
        transition: all 0.2s;
      }
      .nav-item:hover {
        background-color: #34495e;
        color: #fff;
      }
      .nav-item.active {
        background-color: var(--primary-color);
        color: #fff;
        border-left: 4px solid #fff;
      }
      .nav-text {
        font-size: 0.9rem;
        font-weight: 500;
      }
    `,
  ],
})
export class SidebarComponent {}
