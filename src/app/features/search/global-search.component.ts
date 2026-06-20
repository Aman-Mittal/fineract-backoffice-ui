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
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SearchAPIService } from '../../api';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'SEARCH.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="search-form">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'SEARCH.QUERY' | translate }}</mat-label>
            <input matInput [(ngModel)]="query" name="query" required />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'SEARCH.RESOURCE_TYPE' | translate }}</mat-label>
            <mat-select [(ngModel)]="selectedResource" name="resource">
              <mat-option value="">{{ 'SEARCH.ALL_TYPES' | translate }}</mat-option>
              @for (type of allowedSearchTypes; track type) {
                <mat-option [value]="type">{{ type }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-checkbox [(ngModel)]="exactMatch" name="exactMatch">
            {{ 'SEARCH.EXACT_MATCH' | translate }}
          </mat-checkbox>

          <button
            mat-raised-button
            color="primary"
            [disabled]="!query || isLoading"
            (click)="onSearch()"
          >
            {{ 'SEARCH.SEARCH_BTN' | translate }}
          </button>
        </div>

        @if (isLoading) {
          <div class="spinner-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        }

        @if (!isLoading && searched && results().length === 0) {
          <p class="no-results">{{ 'SEARCH.NO_RESULTS' | translate }}</p>
        }

        @if (!isLoading && results().length > 0) {
          <table mat-table [dataSource]="results()" class="results-table">
            <ng-container matColumnDef="entityType">
              <th mat-header-cell *matHeaderCellDef>{{ 'SEARCH.ENTITY_TYPE' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.entityType }}</td>
            </ng-container>

            <ng-container matColumnDef="entityName">
              <th mat-header-cell *matHeaderCellDef>{{ 'SEARCH.ENTITY_NAME' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.entityName }}</td>
            </ng-container>

            <ng-container matColumnDef="entityAccountNo">
              <th mat-header-cell *matHeaderCellDef>{{ 'SEARCH.ACCOUNT_NO' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.entityAccountNo }}</td>
            </ng-container>

            <ng-container matColumnDef="entityExternalId">
              <th mat-header-cell *matHeaderCellDef>{{ 'SEARCH.EXTERNAL_ID' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.entityExternalId }}</td>
            </ng-container>

            <ng-container matColumnDef="parentName">
              <th mat-header-cell *matHeaderCellDef>{{ 'SEARCH.PARENT' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.parentName }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              class="clickable-row"
              (click)="onRowClick(row)"
            ></tr>
          </table>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .search-form {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
        margin-bottom: 24px;
      }
      .search-form mat-form-field {
        flex: 1 1 200px;
      }
      .spinner-container {
        display: flex;
        justify-content: center;
        padding: 32px;
      }
      .no-results {
        text-align: center;
        color: rgba(0, 0, 0, 0.54);
        padding: 32px;
      }
      .results-table {
        width: 100%;
      }
      .clickable-row {
        cursor: pointer;
      }
      .clickable-row:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
  ],
})
export class GlobalSearchComponent implements OnInit {
  private searchApiService = inject(SearchAPIService);
  private router = inject(Router);

  query = '';
  selectedResource = '';
  exactMatch = false;
  isLoading = false;
  searched = false;
  allowedSearchTypes: string[] = [];
  results = signal<any[]>([]);
  displayedColumns = [
    'entityType',
    'entityName',
    'entityAccountNo',
    'entityExternalId',
    'parentName',
  ];

  ngOnInit(): void {
    this.searchApiService.getSearchTemplate().subscribe({
      next: (template: any) => {
        this.allowedSearchTypes = template?.allowedSearchTypes ?? [];
      },
    });
  }

  onSearch(): void {
    if (!this.query) return;
    this.isLoading = true;
    this.searched = false;
    const resource = this.selectedResource || undefined;
    this.searchApiService.getSearch(this.query, resource, this.exactMatch).subscribe({
      next: (data: any[]) => {
        this.results.set(data ?? []);
        this.isLoading = false;
        this.searched = true;
      },
      error: () => {
        this.results.set([]);
        this.isLoading = false;
        this.searched = true;
      },
    });
  }

  onRowClick(row: any): void {
    const id = row.entityId;
    switch (row.entityType) {
      case 'CLIENT':
        this.router.navigate(['/clients', id]);
        break;
      case 'LOAN':
        this.router.navigate(['/loans', id]);
        break;
      case 'GROUP':
        this.router.navigate(['/groups', id]);
        break;
      case 'SAVING':
        this.router.navigate(['/savings', id]);
        break;
    }
  }
}
