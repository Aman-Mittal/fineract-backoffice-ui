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
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { ClientSearchV2Service, PageClientSearchData, ClientSearchData } from '../../api';

@Component({
  selector: 'app-client-search-v2',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'CLIENT_SEARCH_V2.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="search-row">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>{{ 'CLIENT_SEARCH_V2.QUERY' | translate }}</mat-label>
            <input matInput [(ngModel)]="query" (keyup.enter)="search()" [disabled]="isLoading" />
          </mat-form-field>
          <button
            mat-raised-button
            color="primary"
            (click)="search()"
            [disabled]="!query || isLoading"
          >
            <mat-icon>search</mat-icon>
            {{ 'CLIENT_SEARCH_V2.SEARCH' | translate }}
          </button>
        </div>

        @if (isLoading) {
          <div class="spinner-row">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        }

        @if (results().length > 0) {
          <table mat-table [dataSource]="results()" class="full-width">
            <ng-container matColumnDef="displayName">
              <th mat-header-cell *matHeaderCellDef>{{ 'CLIENT_SEARCH_V2.NAME' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.displayName }}</td>
            </ng-container>

            <ng-container matColumnDef="accountNo">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'CLIENT_SEARCH_V2.ACCOUNT_NO' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ row.accountNo }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>{{ 'CLIENT_SEARCH_V2.STATUS' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.status?.value }}</td>
            </ng-container>

            <ng-container matColumnDef="officeName">
              <th mat-header-cell *matHeaderCellDef>{{ 'CLIENT_SEARCH_V2.OFFICE' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.officeName }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let row">
                <button
                  mat-icon-button
                  (click)="viewClient(row.id)"
                  [title]="'CLIENT_SEARCH_V2.VIEW' | translate"
                >
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              class="clickable-row"
              (click)="viewClient(row.id)"
            ></tr>
          </table>

          <mat-paginator
            [length]="totalElements()"
            [pageSize]="pageSize"
            [pageSizeOptions]="[10, 25, 50]"
            (page)="onPage($event)"
          ></mat-paginator>
        }

        @if (searched && results().length === 0 && !isLoading) {
          <p class="no-results">{{ 'CLIENT_SEARCH_V2.NO_RESULTS' | translate }}</p>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .search-row {
        display: flex;
        gap: 16px;
        align-items: center;
        margin-bottom: 8px;
      }
      .search-field {
        flex: 1;
      }
      .spinner-row {
        display: flex;
        justify-content: center;
        padding: 24px;
      }
      .full-width {
        width: 100%;
      }
      .clickable-row {
        cursor: pointer;
      }
      .clickable-row:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      .no-results {
        text-align: center;
        color: rgba(0, 0, 0, 0.5);
        padding: 24px 0;
      }
    `,
  ],
})
export class ClientSearchV2Component {
  private readonly clientSearchService = inject(ClientSearchV2Service);
  private readonly router = inject(Router);

  query = '';
  pageSize = 10;
  pageNumber = 0;
  isLoading = false;
  searched = false;

  results = signal<ClientSearchData[]>([]);
  totalElements = signal(0);

  displayedColumns = ['displayName', 'accountNo', 'status', 'officeName', 'actions'];

  search(page = 0): void {
    if (!this.query.trim()) return;
    this.isLoading = true;
    this.pageNumber = page;

    this.clientSearchService
      .postClientsSearch({
        request: { text: this.query },
        page: this.pageNumber,
        size: this.pageSize,
      })
      .subscribe({
        next: (data: PageClientSearchData) => {
          this.results.set(data?.content ?? []);
          this.totalElements.set(data?.totalElements ?? 0);
          this.isLoading = false;
          this.searched = true;
        },
        error: () => {
          this.isLoading = false;
          this.searched = true;
        },
      });
  }

  onPage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.search(event.pageIndex);
  }

  viewClient(id: number): void {
    this.router.navigate(['/clients/view', id]);
  }
}
