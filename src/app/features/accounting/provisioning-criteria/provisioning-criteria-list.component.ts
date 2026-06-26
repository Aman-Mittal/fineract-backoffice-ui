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
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ProvisioningCriteriaService, GetProvisioningCriteriaResponse } from '../../../api';

/**
 * Lists provisioning criteria. The list response carries the criteria name and
 * creator only; the full definitions/loan-product arrays live on the detail endpoint.
 */
@Component({
  selector: 'app-provisioning-criteria-list',
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
      title="nav.provisioningCriteria"
      helpTextKey="HELP.PROVISIONING_CRITERIA_DESC"
      createButtonLabel="PROVISIONING_CRITERIA.CREATE"
      [columns]="columns"
      [data]="criteria"
      [totalRecords]="criteria.length"
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
export class ProvisioningCriteriaListComponent implements OnInit {
  private readonly criteriaService = inject(ProvisioningCriteriaService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'criteriaName', label: 'PROVISIONING_CRITERIA.NAME', sortable: true },
    { key: 'createdBy', label: 'PROVISIONING_CRITERIA.CREATED_BY', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  criteria: GetProvisioningCriteriaResponse[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.criteriaService.getProvisioningcriteria().subscribe({
      next: (data: GetProvisioningCriteriaResponse[]) => {
        this.criteria = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load provisioning criteria', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/accounting/provisioning-criteria/create']);
  }

  onEdit(row: GetProvisioningCriteriaResponse): void {
    this.router.navigate(['/accounting/provisioning-criteria/edit', row.criteriaId]);
  }

  onDelete(row: GetProvisioningCriteriaResponse): void {
    if (!row.criteriaId || !window.confirm('Delete this provisioning criteria?')) return;
    this.criteriaService.deleteProvisioningcriteriaCriteriaId(row.criteriaId).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete provisioning criteria', err),
    });
  }
}
