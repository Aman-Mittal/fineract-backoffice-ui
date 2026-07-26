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
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DefaultService, ExternalEventResponse } from '../../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-external-events',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    MatTableModule,
    MatSnackBarModule,
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
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ 'EXTERNAL_EVENTS.TITLE' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div class="filter-row">
          <ion-item fill="outline">
            <ion-label position="stacked">{{
              'EXTERNAL_EVENTS.IDEMPOTENCY_KEY' | translate
            }}</ion-label>
            <ion-input [(ngModel)]="filters.idempotencyKey"></ion-input>
          </ion-item>

          <ion-item fill="outline">
            <ion-label position="stacked">{{ 'EXTERNAL_EVENTS.TYPE' | translate }}</ion-label>
            <ion-input [(ngModel)]="filters.type"></ion-input>
          </ion-item>

          <ion-item fill="outline">
            <ion-label position="stacked">{{ 'EXTERNAL_EVENTS.CATEGORY' | translate }}</ion-label>
            <ion-input [(ngModel)]="filters.category"></ion-input>
          </ion-item>

          <ion-item fill="outline">
            <ion-label position="stacked">{{
              'EXTERNAL_EVENTS.AGGREGATE_ROOT_ID' | translate
            }}</ion-label>
            <ion-input [(ngModel)]="filters.aggregateRootId"></ion-input>
          </ion-item>
        </div>

        <div class="action-row">
          <ion-button color="primary" (click)="load()" [disabled]="isLoading">
            @if (isLoading) {
              <ion-spinner name="crescent"></ion-spinner>
            } @else {
              {{ 'EXTERNAL_EVENTS.LOAD' | translate }}
            }
          </ion-button>
          <ion-button color="warn" (click)="clearAll()" [disabled]="isLoading">
            {{ 'EXTERNAL_EVENTS.CLEAR_ALL' | translate }}
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>

    @if (events().length > 0) {
      <ion-card class="table-card">
        <ion-card-content>
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
        </ion-card-content>
      </ion-card>
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
