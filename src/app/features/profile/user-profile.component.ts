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
import { Component, OnInit, signal, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { FetchAuthenticatedUserDetailsService, GetUserDetailsResponse, RoleData } from '../../api';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressSpinnerModule, TranslateModule],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>{{ 'PROFILE.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (isLoading) {
            <div class="spinner-wrapper">
              <mat-spinner diameter="48"></mat-spinner>
            </div>
          }

          @if (!isLoading && userDetails()) {
            <div>
              <div class="detail-row">
                <span class="label">{{ 'PROFILE.USERNAME' | translate }}</span>
                <span class="value">{{ username }}</span>
              </div>
              <div class="detail-row">
                <span class="label">{{ 'PROFILE.DISPLAY_NAME' | translate }}</span>
                <span class="value">{{ displayName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">{{ 'PROFILE.OFFICE' | translate }}</span>
                <span class="value">
                  {{ officeName }}
                  @if (officeId) {
                    <span class="secondary">(ID: {{ officeId }})</span>
                  }
                </span>
              </div>
              <div class="detail-row">
                <span class="label">{{ 'PROFILE.EMAIL' | translate }}</span>
                <span class="value">{{ email }}</span>
              </div>
              <div class="detail-row roles-row">
                <span class="label">{{ 'PROFILE.ROLES' | translate }}</span>
                <mat-chip-set class="roles-chips">
                  @for (role of roles; track role) {
                    <mat-chip>
                      {{ role.name || role }}
                    </mat-chip>
                  }
                </mat-chip-set>
              </div>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .profile-container {
        padding: 24px;
        max-width: 640px;
        margin: 0 auto;
      }
      .profile-card {
        width: 100%;
      }
      .spinner-wrapper {
        display: flex;
        justify-content: center;
        padding: 32px 0;
      }
      .detail-row {
        display: flex;
        align-items: flex-start;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
      }
      .detail-row:last-child {
        border-bottom: none;
      }
      .label {
        font-weight: 500;
        width: 160px;
        flex-shrink: 0;
        color: #555;
      }
      .value {
        flex: 1;
      }
      .secondary {
        color: #888;
        font-size: 0.85em;
        margin-left: 4px;
      }
      .roles-row {
        align-items: center;
      }
      .roles-chips {
        flex: 1;
      }
    `,
  ],
})
export class UserProfileComponent implements OnInit {
  private fetchAuthenticatedUserDetailsService = inject(FetchAuthenticatedUserDetailsService);

  isLoading = false;
  userDetails = signal<GetUserDetailsResponse | null>(null);

  get username(): string {
    return this.userDetails()?.username ?? '';
  }

  get displayName(): string {
    return ((this.userDetails() as Record<string, unknown>)?.[`displayName`] as string) ?? '';
  }

  get officeName(): string {
    return this.userDetails()?.officeName ?? '';
  }

  get officeId(): number | undefined {
    return this.userDetails()?.officeId;
  }

  get email(): string {
    return ((this.userDetails() as Record<string, unknown>)?.[`email`] as string) ?? '';
  }

  get roles(): RoleData[] {
    return this.userDetails()?.roles ?? [];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.fetchAuthenticatedUserDetailsService.getUserdetails().subscribe({
      next: (data) => {
        this.userDetails.set(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
