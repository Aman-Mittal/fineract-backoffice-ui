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

import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { HelpIconComponent, SearchFilterComponent } from '../../../shared';
import { OfficesService, GetOfficesResponse } from '../../../api';

@Component({
  selector: 'app-offices-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    RouterLink,
    HelpIconComponent,
    SearchFilterComponent,
  ],
  template: `
    <div class="offices-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            Organization Offices
            <app-help-icon helpTextKey="Manage all branch offices and headquarters"></app-help-icon>
          </mat-card-title>
          <div class="header-actions">
            <button
              mat-raised-button
              color="primary"
              matTooltip="Create a new branch office"
              routerLink="create"
            >
              <mat-icon>add</mat-icon>
              Create Office
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="table-header">
            <app-search-filter
              label="Search Offices"
              placeholder="Ex. Head Office"
              tooltipText="Search offices by name or external ID"
              (searchChange)="onSearch($event)"
            >
            </app-search-filter>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z1">
              <ng-container matColumnDef="id">
                <th
                  mat-header-cell
                  *matHeaderCellDef
                  mat-sort-header
                  matTooltip="Internal Office ID"
                >
                  ID
                </th>
                <td mat-cell *matCellDef="let office">{{ office.id }}</td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th
                  mat-header-cell
                  *matHeaderCellDef
                  mat-sort-header
                  matTooltip="Name of the office"
                >
                  Name
                </th>
                <td mat-cell *matCellDef="let office">{{ office.name }}</td>
              </ng-container>

              <ng-container matColumnDef="externalId">
                <th
                  mat-header-cell
                  *matHeaderCellDef
                  mat-sort-header
                  matTooltip="External reference ID"
                >
                  External ID
                </th>
                <td mat-cell *matCellDef="let office">{{ office.externalId || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="openingDate">
                <th
                  mat-header-cell
                  *matHeaderCellDef
                  mat-sort-header
                  matTooltip="Date the office was opened"
                >
                  Opening Date
                </th>
                <td mat-cell *matCellDef="let office">{{ formatArrayDate(office.openingDate) }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let office">
                  <button
                    mat-icon-button
                    color="primary"
                    matTooltip="Edit Office Details"
                    [routerLink]="['edit', office.id]"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" colspan="5">No offices found matching the filter.</td>
              </tr>
            </table>

            <mat-paginator
              [pageSize]="10"
              [pageSizeOptions]="[5, 10, 25, 100]"
              aria-label="Select page of offices"
            ></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .offices-container {
        padding: 24px;
      }
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      mat-card-title {
        display: flex;
        align-items: center;
        margin: 0;
      }
      .header-actions {
        margin-left: auto;
      }
      .table-header {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 8px;
      }
      .table-container {
        overflow: auto;
      }
      table {
        width: 100%;
      }
    `,
  ],
})
export class OfficesListComponent implements OnInit {
  private readonly officesService = inject(OfficesService);
  private readonly router = inject(Router);

  displayedColumns: string[] = ['id', 'name', 'externalId', 'openingDate', 'actions'];
  dataSource = new MatTableDataSource<GetOfficesResponse>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.officesService.retrieveOffices(true).subscribe({
      next: (offices: GetOfficesResponse[]) => {
        this.dataSource.data = offices;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: unknown) => console.error('Failed to load offices', err),
    });
  }

  onSearch(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  formatArrayDate(dateArray: unknown): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return '-';
    // Fineract dates: [YYYY, MM, DD]
    return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
  }
}
