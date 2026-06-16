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
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { LoanInterestPauseService, InterestPauseResponseDto } from '../../../api';

/**
 * Lists interest pause periods (start/end date) for a specific loan and allows
 * creating a new pause or deleting an existing one. The loan id is taken from the route.
 */
@Component({
  selector: 'app-interest-pauses-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="INTEREST_PAUSES.TITLE"
      helpTextKey="HELP.INTEREST_PAUSES_DESC"
      createButtonLabel="INTEREST_PAUSES.CREATE"
      [columns]="columns"
      [data]="pauses"
      [totalRecords]="pauses.length"
      [showSearch]="false"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="actions" let-row>
        <button
          mat-icon-button
          color="warn"
          [attr.aria-label]="'COMMON.DELETE' | translate"
          [matTooltip]="'COMMON.DELETE' | translate"
          (click)="onDelete(row)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class InterestPausesListComponent implements OnInit {
  private readonly pauseService = inject(LoanInterestPauseService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loanId: number | null = null;

  readonly columns: ColumnDef[] = [
    { key: 'startDate', label: 'INTEREST_PAUSES.START_DATE', sortable: true },
    { key: 'endDate', label: 'INTEREST_PAUSES.END_DATE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  pauses: InterestPauseResponseDto[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('loanId');
    if (id) {
      this.loanId = +id;
      this.load();
    }
  }

  load(): void {
    if (!this.loanId) return;
    this.pauseService.getLoansLoanIdInterestPauses(this.loanId).subscribe({
      next: (data: InterestPauseResponseDto[]) => {
        this.pauses = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load interest pauses', err);
      },
    });
  }

  onCreate(): void {
    if (this.loanId) {
      this.router.navigate(['/loans', this.loanId, 'interest-pauses', 'create']);
    }
  }

  onDelete(row: InterestPauseResponseDto): void {
    if (!this.loanId || !row.id || !window.confirm('Delete this interest pause?')) return;
    this.pauseService.deleteLoansLoanIdInterestPausesVariationId(this.loanId, row.id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete interest pause', err),
    });
  }
}
