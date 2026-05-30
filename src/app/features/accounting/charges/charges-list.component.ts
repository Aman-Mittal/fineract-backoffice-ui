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

import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../../shared';
import { ChargesService, ChargeData } from '../../../api';

/**
 * Component for listing globally configured charges and penalties.
 *
 * Provides a management view for all types of fees (Loan, Savings, Client).
 */
@Component({
  selector: 'app-charges-list',
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
      title="nav.charges"
      helpTextKey="HELP.CHARGES_DESC"
      createButtonLabel="CHARGES.CREATE"
      [columns]="columns"
      [data]="charges"
      [totalRecords]="charges.length"
      [showSearch]="true"
      [localLogic]="true"
      (create)="onCreateCharge()"
    >
      <ng-template appCellTemplate="penalty" let-charge>
        {{ (charge.penalty ? 'COMMON.YES' : 'COMMON.NO') | translate }}
      </ng-template>

      <ng-template appCellTemplate="active" let-charge>
        {{ (charge.active ? 'COMMON.YES' : 'COMMON.NO') | translate }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-charge>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          matTooltip="Edit Charge"
          (click)="onEditCharge(charge)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class ChargesListComponent implements OnInit {
  private readonly chargesService = inject(ChargesService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'penalty', label: 'COMMON.PENALTY', sortable: true },
    { key: 'amount', label: 'COMMON.AMOUNT', sortable: true },
    { key: 'active', label: 'COMMON.ACTIVE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  charges: ChargeData[] = [];

  ngOnInit(): void {
    this.loadCharges();
  }

  private loadCharges(): void {
    this.chargesService.retrieveAllCharges().subscribe({
      next: (data) => {
        this.charges = data || [];
      },
      error: (err) => console.error('Failed to load charges', err),
    });
  }

  onCreateCharge(): void {
    this.router.navigate(['/accounting/charges/create']);
  }

  onEditCharge(charge: ChargeData): void {
    this.router.navigate(['/accounting/charges/edit', charge.id]);
  }
}
