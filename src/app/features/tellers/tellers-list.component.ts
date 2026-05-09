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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnDef, CellTemplateDirective } from '../../shared';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TellerCashManagementService, GetTellersResponse } from '../../api';

/**
 * Component for displaying a list of branch tellers.
 *
 * Integrates with the Fineract Teller Cash Management API to retrieve
 * and display teller data. Since the API returns the full list,
 * this component uses local pagination and search.
 *
 * @example
 * <app-tellers-list></app-tellers-list>
 */
@Component({
  selector: 'app-tellers-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="nav.tellers"
      helpTextKey="HELP.TELLERS_DESC"
      createButtonLabel="TELLERS.CREATE_TELLER"
      [columns]="columns"
      [data]="tellers"
      [totalRecords]="tellers.length"
      [showSearch]="true"
      [localLogic]="true"
      (create)="onCreateTeller()"
    >
      <ng-template appCellTemplate="startDate" let-teller>
        {{ formatArrayDate(teller.startDate) }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-teller>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          matTooltip="Edit Teller Details"
          (click)="onEditTeller(teller)"
        >
          <mat-icon>edit</mat-icon>
        </button>
        <button
          mat-icon-button
          color="accent"
          [attr.aria-label]="'TELLERS.CASHIERS' | translate"
          matTooltip="Manage Cashiers"
          (click)="onManageCashiers(teller)"
        >
          <mat-icon>people</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class TellersListComponent implements OnInit {
  /** Service for teller and cashier management operations */
  private readonly tellerService = inject(TellerCashManagementService);
  /** Router for navigating to creation and edit forms */
  private readonly router = inject(Router);

  /** Column definitions for the tellers data table */
  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'TELLERS.NAME', sortable: true },
    { key: 'officeName', label: 'TELLERS.OFFICE', sortable: true },
    { key: 'status', label: 'TELLERS.STATUS', sortable: true },
    { key: 'startDate', label: 'TELLERS.START_DATE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  /** List of tellers retrieved from the API */
  tellers: GetTellersResponse[] = [];

  /**
   * Initializes the component by loading teller data.
   */
  ngOnInit(): void {
    this.loadTellers();
  }

  /**
   * Retrieves all tellers from the Fineract API.
   */
  private loadTellers(): void {
    this.tellerService.getTellerData().subscribe({
      next: (data: GetTellersResponse[]) => {
        this.tellers = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load tellers', err);
      },
    });
  }

  /**
   * Navigates to the teller creation form.
   */
  onCreateTeller(): void {
    this.router.navigate(['/tellers/create']);
  }

  /**
   * Navigates to the edit form for a specific teller.
   *
   * @param teller - The teller entity to edit.
   */
  onEditTeller(teller: GetTellersResponse): void {
    this.router.navigate(['/tellers/edit', teller.id]);
  }

  /**
   * Navigates to the cashier management view for a specific teller.
   *
   * @param teller - The teller entity.
   */
  onManageCashiers(teller: GetTellersResponse): void {
    this.router.navigate(['/tellers', teller.id, 'cashiers']);
  }
  /**
   * Formats a Fineract array date [YYYY, MM, DD] into a readable string.
   *
   * @param dateArray - The raw date value from the API.
   * @returns A formatted date string or a placeholder if invalid.
   */
  formatArrayDate(dateArray: unknown): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return '-';
    }
    const year = dateArray[0];
    const month = String(dateArray[1]).padStart(2, '0');
    const day = String(dateArray[2]).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
