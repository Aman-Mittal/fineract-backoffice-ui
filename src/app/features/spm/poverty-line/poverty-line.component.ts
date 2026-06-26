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
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HelpIconComponent } from '../../../shared';
import { PovertyLineService } from '../../../api';

interface PovertyLineRow {
  scoreFrom?: number;
  scoreTo?: number;
  povertyLine?: number;
  enabled?: boolean;
}

/**
 * Read view of the poverty-line (PPI) table for a given PPI name. The endpoint returns a
 * raw JSON string, so the body is parsed before display.
 */
@Component({
  selector: 'app-poverty-line',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    HelpIconComponent,
  ],
  template: `
    <div class="pl-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ 'POVERTY_LINE.TITLE' | translate }}
            <app-help-icon helpTextKey="HELP.POVERTY_LINE_DESC"></app-help-icon>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form #plForm="ngForm" (ngSubmit)="load()" class="pl-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'POVERTY_LINE.PPI_NAME' | translate }}</mat-label>
              <input matInput name="ppiName" [(ngModel)]="ppiName" required />
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="plForm.invalid || isLoading"
            >
              {{ 'POVERTY_LINE.LOAD' | translate }}
            </button>
          </form>

          @if (isLoading) {
            <mat-spinner diameter="32"></mat-spinner>
          } @else if (rows.length) {
            <table mat-table [dataSource]="rows" class="pl-table">
              <ng-container matColumnDef="scoreFrom">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'POVERTY_LINE.SCORE_FROM' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.scoreFrom }}</td>
              </ng-container>
              <ng-container matColumnDef="scoreTo">
                <th mat-header-cell *matHeaderCellDef>{{ 'POVERTY_LINE.SCORE_TO' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.scoreTo }}</td>
              </ng-container>
              <ng-container matColumnDef="povertyLine">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'POVERTY_LINE.POVERTY_LINE' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.povertyLine }}</td>
              </ng-container>
              <ng-container matColumnDef="enabled">
                <th mat-header-cell *matHeaderCellDef>{{ 'POVERTY_LINE.ENABLED' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.enabled }}</td>
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
      .pl-container {
        padding: 24px;
      }
      .pl-form {
        display: flex;
        align-items: baseline;
        gap: 16px;
        margin-bottom: 16px;
      }
      .pl-table {
        width: 100%;
      }
    `,
  ],
})
export class PovertyLineComponent {
  private readonly povertyLineService = inject(PovertyLineService);

  readonly columns = ['scoreFrom', 'scoreTo', 'povertyLine', 'enabled'];

  ppiName = '';
  rows: PovertyLineRow[] = [];
  isLoading = false;

  load(): void {
    if (!this.ppiName) return;
    this.isLoading = true;
    this.povertyLineService.getPovertyLinePpiName(this.ppiName).subscribe({
      next: (raw: string) => {
        this.rows = this.parseList(raw);
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load poverty line', err);
        this.rows = [];
        this.isLoading = false;
      },
    });
  }

  private parseList(raw: string): PovertyLineRow[] {
    if (!raw) return [];
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (Array.isArray(parsed)) return parsed as PovertyLineRow[];
      const obj = parsed as { povertyLineList?: PovertyLineRow[] };
      return Array.isArray(obj.povertyLineList) ? obj.povertyLineList : [];
    } catch {
      return [];
    }
  }
}
