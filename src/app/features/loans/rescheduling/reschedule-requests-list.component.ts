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

import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DataTableComponent,
  ColumnDef,
  CellTemplateDirective,
  StatusBadgeComponent,
} from '../../../shared';
import { RescheduleLoansService, GetLoanRescheduleRequestResponse } from '../../../api';

/**
 * Component for listing loan reschedule requests.
 *
 * Provides a view of pending and historical rescheduling applications for a loan.
 */
@Component({
  selector: 'app-reschedule-requests-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
    StatusBadgeComponent,
  ],
  template: `
    <app-data-table
      title="Loan Reschedule Requests"
      helpTextKey="HELP.RESCHEDULING_DESC"
      [createButtonLabel]="loanId ? 'LOANS.REQUEST_RESCHEDULE' : ''"
      [columns]="columns"
      [data]="requests"
      [totalRecords]="requests.length"
      [showSearch]="true"
      [localLogic]="true"
      (create)="onCreateRequest()"
    >
      <ng-template appCellTemplate="rescheduleFromDate" let-request>
        {{ formatArrayDate(request.rescheduleFromDate) }}
      </ng-template>

      <ng-template appCellTemplate="rescheduleReason" let-request>
        {{ request.rescheduleReasonCodeValue?.name }}
      </ng-template>

      <ng-template appCellTemplate="status" let-request>
        <app-status-badge [status]="request.statusEnum"></app-status-badge>
      </ng-template>

      <ng-template appCellTemplate="actions" let-request>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.VIEW' | translate"
          matTooltip="View Request Details"
          (click)="onViewRequest(request)"
        >
          <mat-icon>visibility</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class RescheduleRequestsListComponent implements OnInit {
  private readonly rescheduleService = inject(RescheduleLoansService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loanId: number | null = null;

  readonly columns: ColumnDef[] = [
    { key: 'loanAccountNumber', label: 'LOANS.ACCOUNT_NO', sortable: true },
    { key: 'rescheduleFromDate', label: 'LOANS.RESCHEDULE_FROM', sortable: true },
    { key: 'rescheduleReason', label: 'COMMON.REASON', sortable: true },
    { key: 'status', label: 'COMMON.STATUS', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  requests: GetLoanRescheduleRequestResponse[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('loanId');
      if (id) {
        this.loanId = +id;
      }
      this.loadRequests();
    });
  }

  private loadRequests(): void {
    this.rescheduleService
      .retrieveAllRescheduleRequest(undefined, this.loanId || undefined)
      .subscribe({
        next: (data) => {
          this.requests = data || [];
        },
        error: (err) => console.error('Failed to load reschedule requests', err),
      });
  }

  onCreateRequest(): void {
    if (this.loanId) {
      this.router.navigate(['/loans', this.loanId, 'rescheduling', 'create']);
    }
  }

  onViewRequest(request: GetLoanRescheduleRequestResponse): void {
    // Navigation to details/approval screen
    console.log('View reschedule request', request.id);
  }

  formatArrayDate(dateArray: unknown): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return '-';
    }
    return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
  }
}
