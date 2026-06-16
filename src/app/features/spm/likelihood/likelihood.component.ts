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

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HelpIconComponent } from '../../../shared';
import { LikelihoodService } from '../../../api';

interface LikelihoodRow {
  id?: number;
  name?: string;
  code?: string;
  likelihood?: number;
  enabled?: number;
}

/**
 * Read + update view of likelihood (PPI) entries for a given PPI name. The list endpoint
 * returns a raw JSON string; updates are posted back as a JSON-string body via the put
 * endpoint (likelihoodId, ppiName, body).
 */
@Component({
  selector: 'app-likelihood',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatProgressSpinnerModule,
    HelpIconComponent,
  ],
  template: `
    <div class="lk-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ 'LIKELIHOOD.TITLE' | translate }}
            <app-help-icon helpTextKey="HELP.LIKELIHOOD_DESC"></app-help-icon>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form #lkForm="ngForm" (ngSubmit)="load()" class="lk-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'LIKELIHOOD.PPI_NAME' | translate }}</mat-label>
              <input matInput name="ppiName" [(ngModel)]="ppiName" required />
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="lkForm.invalid || isLoading"
            >
              {{ 'LIKELIHOOD.LOAD' | translate }}
            </button>
          </form>

          @if (isLoading) {
            <mat-spinner diameter="32"></mat-spinner>
          } @else if (rows.length) {
            <table mat-table [dataSource]="rows" class="lk-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>{{ 'LIKELIHOOD.NAME' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.name }}</td>
              </ng-container>
              <ng-container matColumnDef="likelihood">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'LIKELIHOOD.LIKELIHOOD' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">
                  <mat-form-field appearance="outline" class="lk-inline">
                    <input
                      matInput
                      type="number"
                      [name]="'likelihood-' + row.id"
                      [(ngModel)]="row.likelihood"
                    />
                  </mat-form-field>
                </td>
              </ng-container>
              <ng-container matColumnDef="enabled">
                <th mat-header-cell *matHeaderCellDef>{{ 'LIKELIHOOD.ENABLED' | translate }}</th>
                <td mat-cell *matCellDef="let row">
                  <mat-checkbox
                    [ngModel]="row.enabled === 100"
                    [name]="'enabled-' + row.id"
                    (ngModelChange)="row.enabled = $event ? 100 : 0"
                  ></mat-checkbox>
                </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.ACTIONS' | translate }}</th>
                <td mat-cell *matCellDef="let row">
                  <button
                    mat-button
                    color="primary"
                    type="button"
                    [disabled]="isSaving"
                    (click)="onSave(row)"
                  >
                    {{ 'COMMON.SAVE' | translate }}
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns"></tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .lk-container {
        padding: 24px;
      }
      .lk-form {
        display: flex;
        align-items: baseline;
        gap: 16px;
        margin-bottom: 16px;
      }
      .lk-table {
        width: 100%;
      }
      .lk-inline {
        width: 120px;
      }
    `,
  ],
})
export class LikelihoodComponent {
  private readonly likelihoodService = inject(LikelihoodService);

  readonly columns = ['name', 'likelihood', 'enabled', 'actions'];

  ppiName = '';
  rows: LikelihoodRow[] = [];
  isLoading = false;
  isSaving = false;

  load(): void {
    if (!this.ppiName) return;
    this.isLoading = true;
    this.likelihoodService.getLikelihoodPpiName(this.ppiName).subscribe({
      next: (raw: string) => {
        this.rows = this.parseList(raw);
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load likelihoods', err);
        this.rows = [];
        this.isLoading = false;
      },
    });
  }

  onSave(row: LikelihoodRow): void {
    if (!row.id) return;
    this.isSaving = true;
    const body = JSON.stringify({ likelihood: row.likelihood, enabled: row.enabled });
    this.likelihoodService.putLikelihoodPpiNameLikelihoodId(row.id, this.ppiName, body).subscribe({
      next: () => {
        this.isSaving = false;
      },
      error: (err: unknown) => {
        console.error('Failed to update likelihood', err);
        this.isSaving = false;
      },
    });
  }

  private parseList(raw: string): LikelihoodRow[] {
    if (!raw) return [];
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? (parsed as LikelihoodRow[]) : [];
    } catch {
      return [];
    }
  }
}
