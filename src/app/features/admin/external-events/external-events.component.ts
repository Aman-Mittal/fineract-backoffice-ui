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
import { Component, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DefaultService, ExternalEventResponse } from '../../../api';

@Component({
  selector: 'app-external-events',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'EXTERNAL_EVENTS.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'EXTERNAL_EVENTS.IDEMPOTENCY_KEY' | translate }}</mat-label>
            <input matInput [(ngModel)]="filters.idempotencyKey" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'EXTERNAL_EVENTS.TYPE' | translate }}</mat-label>
            <input matInput [(ngModel)]="filters.type" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'EXTERNAL_EVENTS.CATEGORY' | translate }}</mat-label>
            <input matInput [(ngModel)]="filters.category" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'EXTERNAL_EVENTS.AGGREGATE_ROOT_ID' | translate }}</mat-label>
            <input matInput [(ngModel)]="filters.aggregateRootId" />
          </mat-form-field>
        </div>

        <div class="action-row">
          <button mat-raised-button color="primary" (click)="load()" [disabled]="isLoading">
            @if (isLoading) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              {{ 'EXTERNAL_EVENTS.LOAD' | translate }}
            }
          </button>
          <button mat-raised-button color="warn" (click)="clearAll()" [disabled]="isLoading">
            {{ 'EXTERNAL_EVENTS.CLEAR_ALL' | translate }}
          </button>
        </div>
      </mat-card-content>
    </mat-card>

    @if (events().length > 0) {
      <mat-card class="table-card">
        <mat-card-content>
          <table mat-table [dataSource]="events()" class="full-width">
            <ng-container matColumnDef="idempotencyKey">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'EXTERNAL_EVENTS.IDEMPOTENCY_KEY' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ row.idempotencyKey }}</td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>{{ 'EXTERNAL_EVENTS.TYPE' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.type }}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'EXTERNAL_EVENTS.CATEGORY' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ row.category }}</td>
            </ng-container>

            <ng-container matColumnDef="aggregateRootId">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'EXTERNAL_EVENTS.AGGREGATE_ROOT_ID' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ row.aggregateRootId }}</td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'EXTERNAL_EVENTS.CREATED_AT' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ row.createdAt | date: 'medium' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [
    `
      .filter-row {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }
      .filter-row mat-form-field {
        flex: 1 1 200px;
      }
      .action-row {
        display: flex;
        gap: 12px;
        margin-top: 8px;
      }
      .table-card {
        margin-top: 16px;
      }
      .full-width {
        width: 100%;
      }
      mat-spinner {
        display: inline-block;
      }
    `,
  ],
})
export class ExternalEventsComponent {
  private defaultService = inject(DefaultService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  filters = {
    idempotencyKey: '',
    type: '',
    category: '',
    aggregateRootId: '',
  };

  events = signal<ExternalEventResponse[]>([]);
  isLoading = false;

  displayedColumns = ['idempotencyKey', 'type', 'category', 'aggregateRootId', 'createdAt'];

  load(): void {
    this.isLoading = true;
    const { idempotencyKey, type, category, aggregateRootId } = this.filters;
    this.defaultService
      .getInternalExternalevents(
        idempotencyKey || undefined,
        type || undefined,
        category || undefined,
        aggregateRootId ? Number(aggregateRootId) : undefined,
      )
      .subscribe({
        next: (data: ExternalEventResponse[]) => {
          this.events.set(Array.isArray(data) ? data : []);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  clearAll(): void {
    this.translate.get('EXTERNAL_EVENTS.CONFIRM_CLEAR').subscribe((msg: string) => {
      const ref = this.snackBar.open(msg, 'OK', { duration: 5000 });
      ref.onAction().subscribe(() => {
        this.isLoading = true;
        this.defaultService.deleteInternalExternalevents().subscribe({
          next: () => {
            this.events.set([]);
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          },
        });
      });
    });
  }
}
