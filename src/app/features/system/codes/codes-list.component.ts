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
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CodesService, GetCodesResponse } from '../../../api';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-codes-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    StatusBadgeComponent,
  ],
  template: `
    <div class="list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'CODES.TITLE' | translate }}</mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="onCreate()">
              <mat-icon>add</mat-icon>
              {{ 'CODES.CREATE' | translate }}
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          @if (loading()) {
            <div class="spinner-container">
              <mat-spinner diameter="40"></mat-spinner>
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
                  <button mat-button color="primary" (click)="onEdit(row)">
                    <mat-icon>edit</mat-icon>
                    {{ 'CODES.EDIT' | translate }}
                  </button>
                  <button mat-button color="accent" (click)="onCodeValues(row)">
                    <mat-icon>list</mat-icon>
                    {{ 'CODES.CODE_VALUES' | translate }}
                  </button>
                  <button
                    mat-button
                    color="warn"
                    (click)="onDelete(row)"
                    [disabled]="row.systemDefined === true"
                    [style.visibility]="row.systemDefined === true ? 'hidden' : 'visible'"
                  >
                    <mat-icon>delete</mat-icon>
                    {{ 'CODES.DELETE' | translate }}
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
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
