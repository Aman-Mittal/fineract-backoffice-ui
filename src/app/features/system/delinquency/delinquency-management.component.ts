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
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
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
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    DataTableComponent,
    HasPermissionDirective,
    CellTemplateDirective,
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
              <button
                headerActions
                mat-raised-button
                color="primary"
                [routerLink]="['ranges', 'create']"
                *appHasPermission="'CREATE_DELINQUENCYRANGE'"
              >
                <mat-icon>add</mat-icon>
                {{ 'SYSTEM.CREATE_RANGE' | translate }}
              </button>

              <ng-template appCellTemplate="actions" let-row>
                <div class="action-buttons">
                  <button
                    mat-icon-button
                    color="primary"
                    [routerLink]="['ranges', 'edit', row.id]"
                    *appHasPermission="'UPDATE_DELINQUENCYRANGE'"
                    [matTooltip]="'COMMON.EDIT' | translate"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="onDeleteRange(row.id)"
                    *appHasPermission="'DELETE_DELINQUENCYRANGE'"
                    [matTooltip]="'COMMON.DELETE' | translate"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
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
              <button
                headerActions
                mat-raised-button
                color="primary"
                [routerLink]="['buckets', 'create']"
                *appHasPermission="'CREATE_DELINQUENCYBUCKET'"
              >
                <mat-icon>add</mat-icon>
                {{ 'SYSTEM.CREATE_BUCKET' | translate }}
              </button>

              <ng-template appCellTemplate="ranges" let-row>
                @for (range of row.ranges; track range.id; let last = $last) {
                  {{ range.classification }}{{ !last ? ', ' : '' }}
                }
              </ng-template>

              <ng-template appCellTemplate="actions" let-row>
                <div class="action-buttons">
                  <button
                    mat-icon-button
                    color="primary"
                    [routerLink]="['buckets', 'edit', row.id]"
                    *appHasPermission="'UPDATE_DELINQUENCYBUCKET'"
                    [matTooltip]="'COMMON.EDIT' | translate"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="onDeleteBucket(row.id)"
                    *appHasPermission="'DELETE_DELINQUENCYBUCKET'"
                    [matTooltip]="'COMMON.DELETE' | translate"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
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
