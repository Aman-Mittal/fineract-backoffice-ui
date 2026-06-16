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

import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HelpIconComponent } from '../../../shared';
import { CreditBureauConfigurationService } from '../../../api';

interface CreditBureauRow {
  id?: number;
  name?: string;
  product?: string;
  country?: string;
  implementationKey?: string;
}

interface LoanProductMappingRow {
  loanProductId?: number;
  loanProductName?: string;
  organisationCreditBureauId?: number;
  alias?: string;
  isCreditCheckMandatory?: boolean;
}

/**
 * Read-leaning view of the configured credit bureaus and their loan-product mappings.
 * The credit-bureau configuration endpoints return raw JSON strings, so the bodies are
 * parsed before display. The post/update endpoints are complex and intentionally omitted.
 */
@Component({
  selector: 'app-credit-bureau-config',
  standalone: true,
  imports: [
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    HelpIconComponent,
  ],
  template: `
    <div class="cbc-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ 'CREDIT_BUREAU_CONFIG.TITLE' | translate }}
            <app-help-icon helpTextKey="HELP.CREDIT_BUREAU_CONFIG_DESC"></app-help-icon>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (isLoading) {
            <mat-spinner diameter="32"></mat-spinner>
          } @else {
            <h3>{{ 'CREDIT_BUREAU_CONFIG.BUREAUS' | translate }}</h3>
            <table mat-table [dataSource]="bureaus" class="cbc-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'CREDIT_BUREAU_CONFIG.ID' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.id }}</td>
              </ng-container>
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'CREDIT_BUREAU_CONFIG.NAME' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.name }}</td>
              </ng-container>
              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'CREDIT_BUREAU_CONFIG.PRODUCT' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.product }}</td>
              </ng-container>
              <ng-container matColumnDef="country">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'CREDIT_BUREAU_CONFIG.COUNTRY' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.country }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="bureauColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: bureauColumns"></tr>
            </table>

            <h3 class="cbc-section">{{ 'CREDIT_BUREAU_CONFIG.MAPPINGS' | translate }}</h3>
            <table mat-table [dataSource]="mappings" class="cbc-table">
              <ng-container matColumnDef="loanProductName">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'CREDIT_BUREAU_CONFIG.LOAN_PRODUCT' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.loanProductName }}</td>
              </ng-container>
              <ng-container matColumnDef="organisationCreditBureauId">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'CREDIT_BUREAU_CONFIG.ORG_BUREAU_ID' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.organisationCreditBureauId }}</td>
              </ng-container>
              <ng-container matColumnDef="alias">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'CREDIT_BUREAU_CONFIG.ALIAS' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.alias }}</td>
              </ng-container>
              <ng-container matColumnDef="isCreditCheckMandatory">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'CREDIT_BUREAU_CONFIG.MANDATORY' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.isCreditCheckMandatory }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="mappingColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: mappingColumns"></tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .cbc-container {
        padding: 24px;
      }
      .cbc-table {
        width: 100%;
      }
      .cbc-section {
        margin-top: 24px;
      }
    `,
  ],
})
export class CreditBureauConfigComponent implements OnInit {
  private readonly configService = inject(CreditBureauConfigurationService);

  readonly bureauColumns = ['id', 'name', 'product', 'country'];
  readonly mappingColumns = [
    'loanProductName',
    'organisationCreditBureauId',
    'alias',
    'isCreditCheckMandatory',
  ];

  bureaus: CreditBureauRow[] = [];
  mappings: LoanProductMappingRow[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.configService.getCreditBureauConfiguration().subscribe({
      next: (raw: string) => {
        this.bureaus = this.parseList<CreditBureauRow>(raw);
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load credit bureaus', err);
        this.isLoading = false;
      },
    });

    this.configService.getCreditBureauConfigurationLoanProduct().subscribe({
      next: (raw: string) => {
        this.mappings = this.parseList<LoanProductMappingRow>(raw);
      },
      error: (err: unknown) => {
        console.error('Failed to load loan-product mappings', err);
      },
    });
  }

  private parseList<T>(raw: string): T[] {
    if (!raw) return [];
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
}
