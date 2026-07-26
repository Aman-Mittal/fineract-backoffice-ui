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
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import {
  DataTableComponent,
  ColumnDef,
  HasPermissionDirective,
  CellTemplateDirective,
} from '../../../shared';
import {
  DelinquencyRangeAndBucketsManagementService,
  DelinquencyRangeData,
  DelinquencyBucketResponse,
} from '../../../api';

@Component({
  selector: 'app-delinquency-management',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    MatTabsModule,
    DataTableComponent,
    HasPermissionDirective,
    CellTemplateDirective,
    IonIcon,
    IonButton,
  ],
  template: `
    <div class="management-container">
      <mat-tab-group>
        <mat-tab [label]="'SYSTEM.DELINQUENCY_RANGES' | translate">
          <div class="tab-content">
            <app-data-table
              [columns]="rangeColumns"
              [data]="ranges()"
              [isLoading]="isLoadingRanges()"
              [localLogic]="true"
            >
              <ion-button
                headerActions
                color="primary"
                [routerLink]="['ranges', 'create']"
                *appHasPermission="'CREATE_DELINQUENCYRANGE'"
              >
                <ion-icon name="add-outline"></ion-icon>
                {{ 'SYSTEM.CREATE_RANGE' | translate }}
              </ion-button>

              <ng-template appCellTemplate="actions" let-row>
                <div class="action-buttons">
                  <ion-button
                    fill="clear"
                    color="primary"
                    [routerLink]="['ranges', 'edit', row.id]"
                    *appHasPermission="'UPDATE_DELINQUENCYRANGE'"
                    [attr.title]="'COMMON.EDIT' | translate"
                  >
                    <ion-icon name="create-outline"></ion-icon>
                  </ion-button>
                  <ion-button
                    fill="clear"
                    color="warn"
                    (click)="onDeleteRange(row.id)"
                    *appHasPermission="'DELETE_DELINQUENCYRANGE'"
                    [attr.title]="'COMMON.DELETE' | translate"
                  >
                    <ion-icon name="trash-outline"></ion-icon>
                  </ion-button>
                </div>
              </ng-template>
            </app-data-table>
          </div>
        </mat-tab>

        <mat-tab [label]="'SYSTEM.DELINQUENCY_BUCKETS' | translate">
          <div class="tab-content">
            <app-data-table
              [columns]="bucketColumns"
              [data]="buckets()"
              [isLoading]="isLoadingBuckets()"
              [localLogic]="true"
            >
              <ion-button
                headerActions
                color="primary"
                [routerLink]="['buckets', 'create']"
                *appHasPermission="'CREATE_DELINQUENCYBUCKET'"
              >
                <ion-icon name="add-outline"></ion-icon>
                {{ 'SYSTEM.CREATE_BUCKET' | translate }}
              </ion-button>

              <ng-template appCellTemplate="ranges" let-row>
                @for (range of row.ranges; track range.id; let last = $last) {
                  {{ range.classification }}{{ !last ? ', ' : '' }}
                }
              </ng-template>

              <ng-template appCellTemplate="actions" let-row>
                <div class="action-buttons">
                  <ion-button
                    fill="clear"
                    color="primary"
                    [routerLink]="['buckets', 'edit', row.id]"
                    *appHasPermission="'UPDATE_DELINQUENCYBUCKET'"
                    [attr.title]="'COMMON.EDIT' | translate"
                  >
                    <ion-icon name="create-outline"></ion-icon>
                  </ion-button>
                  <ion-button
                    fill="clear"
                    color="warn"
                    (click)="onDeleteBucket(row.id)"
                    *appHasPermission="'DELETE_DELINQUENCYBUCKET'"
                    [attr.title]="'COMMON.DELETE' | translate"
                  >
                    <ion-icon name="trash-outline"></ion-icon>
                  </ion-button>
                </div>
              </ng-template>
            </app-data-table>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .management-container {
        padding: 24px;
      }
      .tab-content {
        padding-top: 16px;
      }
      .action-buttons {
        display: flex;
        gap: 8px;
      }
    `,
  ],
})
export class DelinquencyManagementComponent implements OnInit {
  private readonly delinquencyService = inject(DelinquencyRangeAndBucketsManagementService);

  ranges = signal<DelinquencyRangeData[]>([]);
  buckets = signal<DelinquencyBucketResponse[]>([]);
  isLoadingRanges = signal<boolean>(false);
  isLoadingBuckets = signal<boolean>(false);

  rangeColumns: ColumnDef[] = [
    { key: 'classification', label: 'COMMON.NAME', sortable: true },
    { key: 'minimumAgeDays', label: 'SYSTEM.MIN_AGE_DAYS', sortable: true },
    { key: 'maximumAgeDays', label: 'SYSTEM.MAX_AGE_DAYS', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS' },
  ];

  bucketColumns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'ranges', label: 'SYSTEM.RANGES' },
    { key: 'actions', label: 'COMMON.ACTIONS' },
  ];

  ngOnInit(): void {
    this.loadRanges();
    this.loadBuckets();
  }

  loadRanges(): void {
    this.isLoadingRanges.set(true);
    this.delinquencyService.getDelinquencyRanges().subscribe({
      next: (data) => {
        this.ranges.set(data);
        this.isLoadingRanges.set(false);
      },
      error: (err) => {
        console.error('Failed to load delinquency ranges', err);
        this.isLoadingRanges.set(false);
      },
    });
  }

  loadBuckets(): void {
    this.isLoadingBuckets.set(true);
    this.delinquencyService.getDelinquencyBuckets().subscribe({
      next: (data) => {
        this.buckets.set(data);
        this.isLoadingBuckets.set(false);
      },
      error: (err) => {
        console.error('Failed to load delinquency buckets', err);
        this.isLoadingBuckets.set(false);
      },
    });
  }

  onDeleteRange(id: number): void {
    if (confirm('Are you sure you want to delete this delinquency range?')) {
      this.delinquencyService.deleteDelinquencyRangesDelinquencyRangeId(id).subscribe({
        next: () => this.loadRanges(),
        error: (err) => console.error('Delete range failed', err),
      });
    }
  }

  onDeleteBucket(id: number): void {
    if (confirm('Are you sure you want to delete this delinquency bucket?')) {
      this.delinquencyService.deleteDelinquencyBucketsDelinquencyBucketId(id).subscribe({
        next: () => this.loadBuckets(),
        error: (err) => console.error('Delete bucket failed', err),
      });
    }
  }
}
