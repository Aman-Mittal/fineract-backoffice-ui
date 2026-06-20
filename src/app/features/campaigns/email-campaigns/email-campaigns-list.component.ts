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

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DefaultService } from '../../../api';

interface EmailCampaign {
  id: number;
  campaignName?: string;
  campaignType?: string;
  status?: { value?: string } | string;
}

@Component({
  selector: 'app-email-campaigns-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'EMAIL_CAMPAIGNS.TITLE' | translate }}</mat-card-title>
          <div class="actions-header">
            <button mat-raised-button color="primary" (click)="navigateToCreate()">
              <mat-icon>add</mat-icon>
              {{ 'EMAIL_CAMPAIGNS.CREATE' | translate }}
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          @if (isLoading()) {
            <div class="spinner-container">
              <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="campaigns()" class="mat-elevation-z1">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>{{ 'EMAIL_CAMPAIGNS.ID' | translate }}</th>
                <td mat-cell *matCellDef="let campaign">{{ campaign.id }}</td>
              </ng-container>

              <ng-container matColumnDef="campaignName">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'EMAIL_CAMPAIGNS.CAMPAIGN_NAME' | translate }}
                </th>
                <td mat-cell *matCellDef="let campaign">{{ campaign.campaignName }}</td>
              </ng-container>

              <ng-container matColumnDef="campaignType">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'EMAIL_CAMPAIGNS.CAMPAIGN_TYPE' | translate }}
                </th>
                <td mat-cell *matCellDef="let campaign">{{ campaign.campaignType }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'EMAIL_CAMPAIGNS.STATUS' | translate }}
                </th>
                <td mat-cell *matCellDef="let campaign">
                  {{ campaign.status?.value ?? campaign.status }}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'EMAIL_CAMPAIGNS.ACTIONS' | translate }}
                </th>
                <td mat-cell *matCellDef="let campaign">
                  <button
                    mat-icon-button
                    color="primary"
                    [title]="'EMAIL_CAMPAIGNS.EDIT' | translate"
                    (click)="navigateToEdit(campaign.id)"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="accent"
                    [title]="'EMAIL_CAMPAIGNS.ACTIVATE' | translate"
                    (click)="activate(campaign.id)"
                  >
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    [title]="'EMAIL_CAMPAIGNS.DEACTIVATE' | translate"
                    (click)="deactivate(campaign.id)"
                  >
                    <mat-icon>pause</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    [title]="'EMAIL_CAMPAIGNS.DELETE' | translate"
                    (click)="delete(campaign.id)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

              <tr *matNoDataRow>
                <td class="no-data-cell" [attr.colspan]="displayedColumns.length">
                  {{ 'EMAIL_CAMPAIGNS.NO_DATA' | translate }}
                </td>
              </tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 1rem;
      }
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .actions-header {
        display: flex;
        gap: 0.5rem;
      }
      .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      }
      table {
        width: 100%;
      }
      .no-data-cell {
        text-align: center;
        padding: 1rem;
      }
    `,
  ],
})
export class EmailCampaignsListComponent implements OnInit {
  private readonly api = inject(DefaultService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  campaigns = signal<EmailCampaign[]>([]);
  isLoading = signal(false);

  displayedColumns: string[] = ['id', 'campaignName', 'campaignType', 'status', 'actions'];

  ngOnInit(): void {
    this.loadCampaigns();
  }

  private loadCampaigns(): void {
    this.isLoading.set(true);
    this.api.getEmailCampaign().subscribe({
      next: (raw: string) => {
        try {
          const parsed = JSON.parse(raw);
          this.campaigns.set(Array.isArray(parsed) ? parsed : [parsed]);
        } catch {
          this.campaigns.set([]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.campaigns.set([]);
        this.isLoading.set(false);
        this.showError('EMAIL_CAMPAIGNS.LOAD_ERROR');
      },
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/campaigns/email/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/campaigns/email', id, 'edit']);
  }

  activate(id: number): void {
    this.api.postEmailCampaignResourceId(id, 'activate', undefined).subscribe({
      next: () => {
        this.showSuccess('EMAIL_CAMPAIGNS.ACTIVATED');
        this.loadCampaigns();
      },
      error: () => this.showError('EMAIL_CAMPAIGNS.ACTIVATE_ERROR'),
    });
  }

  deactivate(id: number): void {
    this.api.postEmailCampaignResourceId(id, 'deactivate', undefined).subscribe({
      next: () => {
        this.showSuccess('EMAIL_CAMPAIGNS.DEACTIVATED');
        this.loadCampaigns();
      },
      error: () => this.showError('EMAIL_CAMPAIGNS.DEACTIVATE_ERROR'),
    });
  }

  delete(id: number): void {
    this.api.deleteEmailCampaignResourceId(id).subscribe({
      next: () => {
        this.showSuccess('EMAIL_CAMPAIGNS.DELETED');
        this.loadCampaigns();
      },
      error: () => this.showError('EMAIL_CAMPAIGNS.DELETE_ERROR'),
    });
  }

  private showSuccess(key: string): void {
    this.translate.get(key).subscribe((msg: string) => {
      this.snackBar.open(msg, '', { duration: 3000 });
    });
  }

  private showError(key: string): void {
    this.translate.get(key).subscribe((msg: string) => {
      this.snackBar.open(msg, '', { duration: 4000, panelClass: ['error-snack'] });
    });
  }
}
