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
import { GroupsService, LoansService } from '../../../api';
import { StatusBadgeComponent } from '../../../shared';

interface GlimChildLoanRow {
  childLoanId?: number;
  clientId?: number;
  clientName?: string;
  childLoanAccountNo?: string;
  childPrincipalAmount?: number;
  parentPrincipalAmount?: number;
  status?: { code?: string; value?: string };
}

/**
 * Reads one GLIM parent application: the member loans it bundled, each with its own principal
 * and status alongside the shared group ("parent") principal.
 *
 * `getLoansGlimAccountGlimId` answers a raw JSON string, same as every other GLIM/GSIM endpoint
 * this codebase has met — the generated model stops at the response type, not its shape, so the
 * rows are read as `unknown` and read defensively.
 */
@Component({
  selector: 'app-glim-account-view',
  standalone: true,
  imports: [TranslatePipe, StatusBadgeComponent, IonButton, IonSpinner],
  template: `
    <div class="view-container">
      <h1>{{ 'GROUPS.GLIM_ACCOUNT_OVERVIEW' | appTranslate }}</h1>

      @if (isLoading()) {
        <ion-spinner data-testid="glim-view-loading" />
      } @else if (rows().length === 0) {
        <p data-testid="glim-view-empty">{{ 'GROUPS.GLIM_NOT_FOUND' | appTranslate }}</p>
      } @else {
        <table class="rows-table" data-testid="glim-view-table">
          <thead>
            <tr>
              <th>{{ 'GROUPS.LOAN_ID' | appTranslate }}</th>
              <th>{{ 'COMMON.CLIENT_ID' | appTranslate }}</th>
              <th>{{ 'COMMON.NAME' | appTranslate }}</th>
              <th>{{ 'GROUPS.LOAN_ACCOUNT_NUMBER' | appTranslate }}</th>
              <th>{{ 'GROUPS.CLIENT_PRINCIPAL' | appTranslate }}</th>
              <th>{{ 'GROUPS.TOTAL_PRINCIPAL' | appTranslate }}</th>
              <th>{{ 'COMMON.STATUS' | appTranslate }}</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.childLoanId) {
              <tr class="clickable" (click)="onOpenLoan(row.childLoanId)">
                <td>{{ row.childLoanId }}</td>
                <td>{{ row.clientId }}</td>
                <td>{{ row.clientName }}</td>
                <td>{{ row.childLoanAccountNo }}</td>
                <td>{{ row.childPrincipalAmount }}</td>
                <td>{{ row.parentPrincipalAmount }}</td>
                <td><app-status-badge [status]="row.status?.value" /></td>
              </tr>
            }
          </tbody>
        </table>
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
      .rows-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
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
export class GlimAccountViewComponent implements OnInit {
  private readonly loansService = inject(LoansService);
  private readonly groupsService = inject(GroupsService);
  private readonly notifications = inject(NotificationService);
  private readonly i18n = inject(I18N);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  groupId = 0;
  glimId: number | null = null;
  readonly isLoading = signal(true);
  readonly rows = signal<GlimChildLoanRow[]>([]);

  /**
   * With a `glimId` this reads one specific GLIM application. Without one — reached from the
   * group's accounts tab, which has no single glimId to link to — it falls back to the group-
   * level endpoint, which accepts the same optional filter web-app's own screens never pass
   * either, and so answers with every GLIM application the group has made.
   */
  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    const glimIdParam = this.route.snapshot.paramMap.get('glimId');
    this.glimId = glimIdParam ? Number(glimIdParam) : null;

    const request = this.glimId
      ? this.loansService.getLoansGlimAccountGlimId(this.glimId)
      : this.groupsService.getGroupsGroupIdGlimaccounts(this.groupId);

    request.subscribe({
      next: (raw) => {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        this.rows.set(Array.isArray(parsed) ? parsed : []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notifications.error(this.i18n.translate('GROUPS.GLIM_LOAD_FAILED'));
      },
    });
  }

  onOpenLoan(loanId: number | undefined): void {
    if (loanId !== undefined) {
      this.router.navigate(['/loans/view', loanId]);
    }
  }

  onBack(): void {
    this.router.navigate(['/groups/view', this.groupId]);
  }
}
