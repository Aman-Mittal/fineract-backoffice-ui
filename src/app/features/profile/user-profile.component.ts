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

import { TranslateModule } from '@ngx-translate/core';
import { GetUsersUserIdResponse, RoleData, UsersService } from '../../api';
import { AuthService } from '../../core/services/auth.service';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    TranslateModule,
    IonSpinner,
    IonIcon,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonChip,
  ],
  template: `
    <div class="profile-container">
      <ion-card class="profile-card">
        <ion-card-header>
          <ion-card-title>{{ 'PROFILE.TITLE' | translate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          @if (isLoading()) {
            <div class="spinner-wrapper">
              <ion-spinner name="crescent"></ion-spinner>
            </div>
          } @else if (loadError()) {
            <div class="load-error" role="alert" data-testid="profile-load-error">
              <ion-icon name="alert-circle-outline"></ion-icon>
              <span>{{ 'PROFILE.LOAD_ERROR' | translate }}</span>
            </div>
          }

          @if (!isLoading() && userDetails()) {
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
                <div class="roles-chips">
                  @for (role of roles; track role) {
                    <ion-chip>
                      {{ role.name || role }}
                    </ion-chip>
                  }
                </div>
              </div>
            </div>
          }
        </ion-card-content>
      </ion-card>
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
      .load-error {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 24px 0;
        color: var(--error-color);
      }
    `,
  ],
})
export class UserProfileComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);

  /* Signals, not plain fields: these are written from an async callback, and a
     plain field mutated there never marks the view dirty — which is why a failed
     load previously left the spinner running forever instead of showing an
     error. */
  readonly isLoading = signal(true);
  readonly loadError = signal(false);
  readonly userDetails = signal<GetUsersUserIdResponse | null>(null);

  get username(): string {
    return this.userDetails()?.username ?? '';
  }

  get displayName(): string {
    const user = this.userDetails();
    return [user?.firstname, user?.lastname].filter(Boolean).join(' ');
  }

  get officeName(): string {
    return this.userDetails()?.officeName ?? '';
  }

  get officeId(): number | undefined {
    return this.userDetails()?.officeId;
  }

  get email(): string {
    return this.userDetails()?.email ?? '';
  }

  get roles(): RoleData[] {
    return this.userDetails()?.selectedRoles ?? [];
  }

  ngOnInit(): void {
    /* GET /userdetails is not present on every Fineract build (it 404s on the
       current one), while GET /users/{id} is, and carries the same fields plus
       the user's selected roles. Resolve the id from the session established at
       login rather than asking the server who we are. */
    const userId = this.authService.currentUser()?.userId;
    if (userId == null) {
      this.isLoading.set(false);
      this.loadError.set(true);
      return;
    }

    this.isLoading.set(true);
    this.usersService.getUsersUserId(userId).subscribe({
      next: (data) => {
        this.userDetails.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set(true);
      },
    });
  }
}
