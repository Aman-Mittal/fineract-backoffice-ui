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

import { Component, OnInit, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import {
  CodeValuesService,
  CodesService,
  GetCodeValuesDataResponse,
  GetCodesResponse,
} from '../../../api';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-code-values-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatTableModule,
    StatusBadgeComponent,
    IonIcon,
    IonButton,
    IonSpinner,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <div class="list-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ 'CODE_VALUES.FOR_CODE' | translate }}
            @if (codeName()) {
              : {{ codeName() }}
            }
          </ion-card-title>
          <div class="header-actions">
            <ion-button fill="clear" (click)="onBack()">
              <ion-icon name="arrow-back-outline"></ion-icon>
              {{ 'CODE_VALUES.BACK' | translate }}
            </ion-button>
            <ion-button color="primary" (click)="onAddValue()">
              <ion-icon name="add-outline"></ion-icon>
              {{ 'CODE_VALUES.ADD_VALUE' | translate }}
            </ion-button>
          </div>
        </ion-card-header>

        <ion-card-content>
          @if (loading()) {
            <div class="spinner-container">
              <ion-spinner name="crescent"></ion-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="codeValues()" class="full-width-table">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>{{ 'CODE_VALUES.NAME' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.name }}</td>
              </ng-container>

              <!-- Description Column -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'CODE_VALUES.DESCRIPTION' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.description }}</td>
              </ng-container>

              <!-- Position Column -->
              <ng-container matColumnDef="position">
                <th mat-header-cell *matHeaderCellDef>{{ 'CODE_VALUES.POSITION' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.position }}</td>
              </ng-container>

              <!-- Active Column -->
              <ng-container matColumnDef="isActive">
                <th mat-header-cell *matHeaderCellDef>{{ 'CODE_VALUES.ACTIVE' | translate }}</th>
                <td mat-cell *matCellDef="let row">
                  @if (row.isActive === true) {
                    <app-status-badge status="Active"></app-status-badge>
                  } @else {
                    <app-status-badge status="Inactive"></app-status-badge>
                  }
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ 'CODE_VALUES.ACTIONS' | translate }}</th>
                <td mat-cell *matCellDef="let row">
                  <ion-button fill="clear" color="primary" (click)="onEdit(row)">
                    <ion-icon name="create-outline"></ion-icon>
                    {{ 'CODE_VALUES.EDIT' | translate }}
                  </ion-button>
                  @if (row.isSystemDefined !== true) {
                    <ion-button fill="clear" color="warn" (click)="onDelete(row)">
                      <ion-icon name="trash-outline"></ion-icon>
                      {{ 'CODE_VALUES.DELETE' | translate }}
                    </ion-button>
                  }
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          }
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [
    `
      .list-container {
        padding: 24px;
      }
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .header-actions {
        margin-left: auto;
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .full-width-table {
        width: 100%;
      }
      .spinner-container {
        display: flex;
        justify-content: center;
        padding: 32px;
      }
    `,
  ],
})
export class CodeValuesListComponent implements OnInit {
  private readonly codeValuesService = inject(CodeValuesService);
  private readonly codesService = inject(CodesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly CODES_BASE = '/system/codes';

  readonly codeValues = signal<GetCodeValuesDataResponse[]>([]);
  readonly codeName = signal<string>('');
  readonly loading = signal(false);

  codeId = 0;

  readonly displayedColumns = ['name', 'description', 'position', 'isActive', 'actions'];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('codeId');
      if (id) {
        this.codeId = +id;
        this.loadCodeName();
        this.load();
      }
    });
  }

  loadCodeName(): void {
    this.codesService.getCodesCodeId(this.codeId).subscribe({
      next: (data: GetCodesResponse) => {
        this.codeName.set(data.name ?? '');
      },
      error: (err: unknown) => {
        console.error('Failed to load code name', err);
      },
    });
  }

  load(): void {
    this.loading.set(true);
    this.codeValuesService.getCodesCodeIdCodevalues(this.codeId).subscribe({
      next: (data: GetCodeValuesDataResponse[]) => {
        this.codeValues.set(data || []);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load code values', err);
        this.loading.set(false);
      },
    });
  }

  onBack(): void {
    this.router.navigate([this.CODES_BASE]);
  }

  onAddValue(): void {
    this.router.navigate([this.CODES_BASE, this.codeId, 'values', 'create']);
  }

  onEdit(row: GetCodeValuesDataResponse): void {
    this.router.navigate([this.CODES_BASE, this.codeId, 'values', 'edit', row.id]);
  }

  onDelete(row: GetCodeValuesDataResponse): void {
    // isSystemDefined not available in GetCodeValuesDataResponse; deletion is guarded by API
    const confirmed = window.confirm(`${'CODE_VALUES.CONFIRM_DELETE'}: ${row.name}`);
    if (!confirmed || row.id === undefined) return;
    this.codeValuesService.deleteCodesCodeIdCodevaluesCodeValueId(this.codeId, row.id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete code value', err),
    });
  }
}
