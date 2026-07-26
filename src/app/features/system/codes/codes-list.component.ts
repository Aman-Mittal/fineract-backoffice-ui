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

import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { CodesService, GetCodesResponse } from '../../../api';
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
  selector: 'app-codes-list',
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
          <ion-card-title>{{ 'CODES.TITLE' | translate }}</ion-card-title>
          <div class="header-actions">
            <ion-button color="primary" (click)="onCreate()">
              <ion-icon name="add-outline"></ion-icon>
              {{ 'CODES.CREATE' | translate }}
            </ion-button>
          </div>
        </ion-card-header>

        <ion-card-content>
          @if (loading()) {
            <div class="spinner-container">
              <ion-spinner name="crescent"></ion-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="codes()" class="full-width-table">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>{{ 'CODES.NAME' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.name }}</td>
              </ng-container>

              <!-- System Defined Column -->
              <ng-container matColumnDef="systemDefined">
                <th mat-header-cell *matHeaderCellDef>{{ 'CODES.SYSTEM_DEFINED' | translate }}</th>
                <td mat-cell *matCellDef="let row">
                  @if (row.systemDefined === true) {
                    <app-status-badge status="System"></app-status-badge>
                  }
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ 'CODES.ACTIONS' | translate }}</th>
                <td mat-cell *matCellDef="let row">
                  <ion-button fill="clear" color="primary" (click)="onEdit(row)">
                    <ion-icon name="create-outline"></ion-icon>
                    {{ 'CODES.EDIT' | translate }}
                  </ion-button>
                  <ion-button fill="clear" color="accent" (click)="onCodeValues(row)">
                    <ion-icon name="list-outline"></ion-icon>
                    {{ 'CODES.CODE_VALUES' | translate }}
                  </ion-button>
                  <ion-button
                    fill="clear"
                    color="warn"
                    (click)="onDelete(row)"
                    [disabled]="row.systemDefined === true"
                    [style.visibility]="row.systemDefined === true ? 'hidden' : 'visible'"
                  >
                    <ion-icon name="trash-outline"></ion-icon>
                    {{ 'CODES.DELETE' | translate }}
                  </ion-button>
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
export class CodesListComponent implements OnInit {
  private readonly codesService = inject(CodesService);
  private readonly router = inject(Router);

  readonly codes = signal<GetCodesResponse[]>([]);
  readonly loading = signal(false);

  readonly displayedColumns = ['name', 'systemDefined', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.codesService.getCodes().subscribe({
      next: (data: GetCodesResponse[]) => {
        this.codes.set(data || []);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load codes', err);
        this.loading.set(false);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/system/codes/create']);
  }

  onEdit(row: GetCodesResponse): void {
    this.router.navigate(['/system/codes/edit', row.id]);
  }

  onCodeValues(row: GetCodesResponse): void {
    this.router.navigate(['/system/codes', row.id, 'values']);
  }

  onDelete(row: GetCodesResponse): void {
    if (row.systemDefined === true) return;
    const confirmed = window.confirm(`${'CODES.CONFIRM_DELETE'}: ${row.name}`);
    if (!confirmed || row.id === undefined) return;
    this.codesService.deleteCodesCodeId(row.id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete code', err),
    });
  }
}
