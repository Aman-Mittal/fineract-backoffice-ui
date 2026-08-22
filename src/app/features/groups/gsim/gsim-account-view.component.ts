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

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';

import { I18N, TranslatePipe } from '../../../core/adapters';
import { NotificationService } from '../../../core/services/notification.service';
import { GroupsService } from '../../../api';
import { StatusBadgeComponent } from '../../../shared';

interface GsimChildAccountRow {
  id?: number;
  displayName?: string;
  accountNo?: string;
  productName?: string;
  clientId?: number;
  status?: { code?: string; value?: string };
}

interface GsimParentAccountRow {
  id?: number;
  accountNo?: string;
  productName?: string;
  status?: { code?: string; value?: string };
  childGSIMAccounts?: GsimChildAccountRow[];
}

/**
 * Reads a group's GSIM applications.
 *
 * `getGroupsGroupIdGsimaccounts` takes an optional `parentGSIMAccountNo`/`parentGSIMId` filter,
 * but web-app's own view never passes one — it fetches every parent for the group and (per its
 * `gsim-account.component.ts`) shows only the first. This lists every parent it gets back
 * instead of arbitrarily picking one, since the endpoint already hands over the full set.
 */
@Component({
  selector: 'app-gsim-account-view',
  standalone: true,
  imports: [TranslatePipe, StatusBadgeComponent, IonButton, IonSpinner],
  template: `
    <div class="view-container">
      <h1>{{ 'GROUPS.GSIM_ACCOUNT_OVERVIEW' | appTranslate }}</h1>

      @if (isLoading()) {
        <ion-spinner data-testid="gsim-view-loading" />
      } @else if (parents().length === 0) {
        <p data-testid="gsim-view-empty">{{ 'GROUPS.GSIM_NOT_FOUND' | appTranslate }}</p>
      } @else {
        @for (parent of parents(); track parent.id) {
          <section class="parent-account" data-testid="gsim-parent-account">
            <h2>
              {{ parent.accountNo }} — {{ parent.productName }}
              <app-status-badge [status]="parent.status?.value" />
            </h2>
            <table class="rows-table">
              <thead>
                <tr>
                  <th>{{ 'COMMON.NAME' | appTranslate }}</th>
                  <th>{{ 'COMMON.ACCOUNT_NO' | appTranslate }}</th>
                  <th>{{ 'COMMON.PRODUCT' | appTranslate }}</th>
                  <th>{{ 'COMMON.STATUS' | appTranslate }}</th>
                </tr>
              </thead>
              <tbody>
                @for (child of parent.childGSIMAccounts ?? []; track child.id) {
                  <tr class="clickable" (click)="onOpenSavings(child.id)">
                    <td>{{ child.displayName }}</td>
                    <td>{{ child.accountNo }}</td>
                    <td>{{ child.productName }}</td>
                    <td><app-status-badge [status]="child.status?.value" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </section>
        }
      }

      <ion-button fill="clear" (click)="onBack()">{{ 'COMMON.BACK' | appTranslate }}</ion-button>
    </div>
  `,
  styles: [
    `
      .view-container {
        padding: 24px;
        max-width: 1000px;
        margin: 0 auto;
      }
      .parent-account {
        margin-bottom: 24px;
      }
      h2 {
        font-size: 1rem;
        margin: 8px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .rows-table {
        width: 100%;
        border-collapse: collapse;
      }
      .rows-table th,
      .rows-table td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid var(--ion-color-light-shade);
      }
      .clickable {
        cursor: pointer;
      }
    `,
  ],
})
export class GsimAccountViewComponent implements OnInit {
  private readonly groupsService = inject(GroupsService);
  private readonly notifications = inject(NotificationService);
  private readonly i18n = inject(I18N);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  groupId = 0;
  readonly isLoading = signal(true);
  readonly parents = signal<GsimParentAccountRow[]>([]);

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));

    this.groupsService.getGroupsGroupIdGsimaccounts(this.groupId).subscribe({
      next: (raw) => {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        this.parents.set(Array.isArray(parsed) ? parsed : []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notifications.error(this.i18n.translate('GROUPS.GSIM_LOAD_FAILED'));
      },
    });
  }

  onOpenSavings(savingsId: number | undefined): void {
    if (savingsId !== undefined) {
      this.router.navigate(['/products/savings-accounts/view', savingsId]);
    }
  }

  onBack(): void {
    this.router.navigate(['/groups/view', this.groupId]);
  }
}
