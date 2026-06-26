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
import { ClientCollateralManagementService, ClientCollateralManagementData } from '../../../api';

/**
 * Lists the collateral attached to a single client. The client id is read from the route
 * snapshot; create, edit and delete actions operate within that client's collateral collection.
 */
@Component({
  selector: 'app-client-collateral-list',
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
      title="CLIENT_COLLATERAL.TITLE"
      helpTextKey="HELP.CLIENT_COLLATERAL_DESC"
      createButtonLabel="CLIENT_COLLATERAL.CREATE"
      [columns]="columns"
      [data]="collaterals"
      [totalRecords]="collaterals.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="actions" let-row>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(row)"
        >
          <mat-icon>edit</mat-icon>
        </button>
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
export class ClientCollateralListComponent implements OnInit {
  private readonly collateralService = inject(ClientCollateralManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'CLIENT_COLLATERAL.NAME', sortable: true },
    { key: 'quantity', label: 'CLIENT_COLLATERAL.QUANTITY', sortable: true },
    { key: 'unitPrice', label: 'CLIENT_COLLATERAL.UNIT_PRICE', sortable: false },
    { key: 'totalCollateral', label: 'CLIENT_COLLATERAL.TOTAL_COLLATERAL', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  clientId!: number;
  collaterals: ClientCollateralManagementData[] = [];

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.load();
  }

  load(): void {
    this.collateralService.getClientsClientIdCollaterals(this.clientId).subscribe({
      next: (data: ClientCollateralManagementData[]) => {
        this.collaterals = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load client collaterals', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/clients', this.clientId, 'collaterals', 'create']);
  }

  onEdit(row: ClientCollateralManagementData): void {
    this.router.navigate(['/clients', this.clientId, 'collaterals', 'edit', row.id]);
  }

  onDelete(row: ClientCollateralManagementData): void {
    if (!row.id || !window.confirm('Delete this collateral?')) return;
    this.collateralService
      .deleteClientsClientIdCollateralsCollateralId(this.clientId, row.id)
      .subscribe({
        next: () => this.load(),
        error: (err: unknown) => console.error('Failed to delete client collateral', err),
      });
  }
}
