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
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DefaultService } from '../../../api';

interface SmsCampaign {
  id: number;
  campaignName?: string;
  campaignType?: { id?: number; value?: string } | string;
  status?: { id?: number; value?: string } | string;
  campaignStatus?: { id?: number; value?: string } | string;
}

@Component({
  selector: 'app-sms-campaigns-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule,
    TranslateModule,
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'SMS_CAMPAIGNS.TITLE' | translate }}</mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" [routerLink]="['/campaigns/sms/create']">
              <mat-icon>add</mat-icon>
              {{ 'SMS_CAMPAIGNS.CREATE' | translate }}
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          @if (loading()) {
            <div class="spinner-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="campaigns()" class="full-width">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let row">{{ row.id }}</td>
              </ng-container>

              <ng-container matColumnDef="campaignName">
                <th mat-header-cell *matHeaderCellDef>{{ 'SMS_CAMPAIGNS.NAME' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.campaignName }}</td>
              </ng-container>

              <ng-container matColumnDef="campaignType">
                <th mat-header-cell *matHeaderCellDef>{{ 'SMS_CAMPAIGNS.TYPE' | translate }}</th>
                <td mat-cell *matCellDef="let row">
                  {{ row.campaignType?.value ?? row.campaignType }}
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>{{ 'SMS_CAMPAIGNS.STATUS' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.status?.value ?? row.status }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ 'SMS_CAMPAIGNS.ACTIONS' | translate }}</th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button color="primary" (click)="edit(row.id)" title="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="accent"
                    (click)="activate(row.id)"
                    title="{{ 'SMS_CAMPAIGNS.ACTIVATE' | translate }}"
                  >
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="deactivate(row.id)"
                    title="{{ 'SMS_CAMPAIGNS.DEACTIVATE' | translate }}"
                  >
                    <mat-icon>pause</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="delete(row.id)"
                    title="{{ 'SMS_CAMPAIGNS.DELETE' | translate }}"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

              @if (campaigns().length === 0) {
                <tr class="mat-row">
                  <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                    {{ 'SMS_CAMPAIGNS.NO_DATA' | translate }}
                  </td>
                </tr>
              }
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 16px;
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
      .spinner-container {
        display: flex;
        justify-content: center;
        padding: 24px;
      }
      .full-width {
        width: 100%;
      }
      .no-data-cell {
        text-align: center;
        padding: 16px;
      }
    `,
  ],
})
export class SmsCampaignsListComponent implements OnInit {
  private readonly api = inject(DefaultService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  campaigns = signal<SmsCampaign[]>([]);
  loading = signal(false);

  displayedColumns = ['id', 'campaignName', 'campaignType', 'status', 'actions'];

  ngOnInit(): void {
    this.loadCampaigns();
  }

  private loadCampaigns(): void {
    this.loading.set(true);
    this.api.getSmscampaigns().subscribe({
      next: (res) => {
        const items = Array.isArray(res) ? res : ((res as Record<string, unknown>)['pageItems'] ?? []);
        this.campaigns.set(items as SmsCampaign[]);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.showError();
      },
    });
  }

  edit(id: number): void {
    this.router.navigate(['/campaigns/sms', id, 'edit']);
  }

  activate(id: number): void {
    this.api.postSmscampaignsCampaignId(id, 'activate').subscribe({
      next: () => {
        this.showSuccess();
        this.loadCampaigns();
      },
      error: () => this.showError(),
    });
  }

  deactivate(id: number): void {
    this.api.postSmscampaignsCampaignId(id, 'deactivate').subscribe({
      next: () => {
        this.showSuccess();
        this.loadCampaigns();
      },
      error: () => this.showError(),
    });
  }

  delete(id: number): void {
    this.api.deleteSmscampaignsCampaignId(id).subscribe({
      next: () => {
        this.showSuccess();
        this.loadCampaigns();
      },
      error: () => this.showError(),
    });
  }

  private showSuccess(): void {
    this.snackBar.open(this.translate.instant('SMS_CAMPAIGNS.SUCCESS'), undefined, {
      duration: 3000,
    });
  }

  private showError(): void {
    this.snackBar.open(this.translate.instant('COMMON.ERROR'), undefined, { duration: 4000 });
  }
}
