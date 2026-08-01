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
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SearchAPIService, GetSearchResponse } from '../../api';
import { CdkTableModule } from '@angular/cdk/table';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    FormsModule,
    CdkTableModule,
    RouterModule,
    TranslateModule,
    IonButton,
    IonSpinner,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
    IonCheckbox,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ 'SEARCH.TITLE' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div class="search-form">
          <ion-item fill="outline">
            <ion-label position="stacked">{{ 'SEARCH.QUERY' | translate }}</ion-label>
            <ion-input
              [attr.aria-label]="'SEARCH.QUERY' | translate"
              [(ngModel)]="query"
              name="query"
              required
            ></ion-input>
          </ion-item>

          <ion-item fill="outline">
            <ion-label position="stacked">{{ 'SEARCH.RESOURCE_TYPE' | translate }}</ion-label>
            <ion-select
              [attr.aria-label]="'SEARCH.RESOURCE_TYPE' | translate"
              interface="popover"
              [(ngModel)]="selectedResource"
              name="resource"
            >
              <ion-select-option value="">{{ 'SEARCH.ALL_TYPES' | translate }}</ion-select-option>
              @for (type of allowedSearchTypes; track type) {
                <ion-select-option [value]="type">{{ type }}</ion-select-option>
              }
            </ion-select>
          </ion-item>

          <ion-checkbox [(ngModel)]="exactMatch" name="exactMatch">
            {{ 'SEARCH.EXACT_MATCH' | translate }}
          </ion-checkbox>

          <ion-button color="primary" [disabled]="!query || isLoading()" (click)="onSearch()">
            {{ 'SEARCH.SEARCH_BTN' | translate }}
          </ion-button>
        </div>

        @if (isLoading()) {
          <div class="spinner-container">
            <ion-spinner name="crescent"></ion-spinner>
          </div>
        }

        @if (!isLoading() && searched && results().length === 0) {
          <p class="no-results">{{ 'SEARCH.NO_RESULTS' | translate }}</p>
        }

        @if (!isLoading() && results().length > 0) {
          <table cdk-table [dataSource]="results()" class="results-table">
            <ng-container cdkColumnDef="entityType">
              <th cdk-header-cell *cdkHeaderCellDef>{{ 'SEARCH.ENTITY_TYPE' | translate }}</th>
              <td cdk-cell *cdkCellDef="let row">{{ row.entityType }}</td>
            </ng-container>

            <ng-container cdkColumnDef="entityName">
              <th cdk-header-cell *cdkHeaderCellDef>{{ 'SEARCH.ENTITY_NAME' | translate }}</th>
              <td cdk-cell *cdkCellDef="let row">{{ row.entityName }}</td>
            </ng-container>

            <ng-container cdkColumnDef="entityAccountNo">
              <th cdk-header-cell *cdkHeaderCellDef>{{ 'SEARCH.ACCOUNT_NO' | translate }}</th>
              <td cdk-cell *cdkCellDef="let row">{{ row.entityAccountNo }}</td>
            </ng-container>

            <ng-container cdkColumnDef="entityExternalId">
              <th cdk-header-cell *cdkHeaderCellDef>{{ 'SEARCH.EXTERNAL_ID' | translate }}</th>
              <td cdk-cell *cdkCellDef="let row">{{ row.entityExternalId }}</td>
            </ng-container>

            <ng-container cdkColumnDef="parentName">
              <th cdk-header-cell *cdkHeaderCellDef>{{ 'SEARCH.PARENT' | translate }}</th>
              <td cdk-cell *cdkCellDef="let row">{{ row.parentName }}</td>
            </ng-container>

            <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
            <tr
              cdk-row
              *cdkRowDef="let row; columns: displayedColumns"
              class="clickable-row"
              (click)="onRowClick(row)"
            ></tr>
          </table>
        }
      </ion-card-content>
    </ion-card>
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
  readonly isLoading = signal(false);
  searched = false;
  allowedSearchTypes: string[] = [];
  results = signal<GetSearchResponse[]>([]);
  displayedColumns = [
    'entityType',
    'entityName',
    'entityAccountNo',
    'entityExternalId',
    'parentName',
  ];

  ngOnInit(): void {
    this.searchApiService.getSearchTemplate().subscribe({
      next: (template) => {
        this.allowedSearchTypes =
          ((template as Record<string, unknown>)?.[`allowedSearchTypes`] as string[]) ?? [];
      },
    });
  }

  onSearch(): void {
    if (!this.query) return;
    this.isLoading.set(true);
    this.searched = false;
    const resource = this.selectedResource || undefined;
    this.searchApiService.getSearch(this.query, resource, this.exactMatch).subscribe({
      next: (data) => {
        this.results.set(data ?? []);
        this.isLoading.set(false);
        this.searched = true;
      },
      error: () => {
        this.results.set([]);
        this.isLoading.set(false);
        this.searched = true;
      },
    });
  }

  onRowClick(row: GetSearchResponse): void {
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
