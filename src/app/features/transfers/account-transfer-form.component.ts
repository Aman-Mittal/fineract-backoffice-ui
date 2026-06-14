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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  AccountTransfersService,
  OfficesService,
  ClientService,
  AccountTransferRequest,
  GetOfficesResponse,
  GetClientsPageItemsResponse,
} from '../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../core/utils/date-formatter';

export interface MiniAccount {
  id: number;
  accountNo: string;
  productName: string;
}

@Component({
  selector: 'app-account-transfer-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'ACTIONS.ACCOUNT_TRANSFER' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #transferForm="ngForm" (ngSubmit)="onSubmit()" class="transfer-form">
            <div class="transfer-grid">
              <!-- From Account Section -->
              <div class="section">
                <h3>{{ 'CLIENTS.TRANSFER_FROM' | translate }}</h3>
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'COMMON.OFFICE' | translate }}</mat-label>
                  <mat-select
                    name="fromOfficeId"
                    [(ngModel)]="request.fromOfficeId"
                    (selectionChange)="onOfficeChange('from')"
                    required
                  >
                    @for (office of offices(); track office.id) {
                      <mat-option [value]="office.id">{{ office.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'COMMON.CLIENT' | translate }}</mat-label>
                  <mat-select
                    name="fromClientId"
                    [(ngModel)]="request.fromClientId"
                    (selectionChange)="onClientChange('from')"
                    required
                  >
                    @for (client of fromClients(); track client.id) {
                      <mat-option [value]="client.id">{{ client.displayName }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.ACCOUNT_TYPE' | translate }}</mat-label>
                  <mat-select
                    name="fromAccountType"
                    [(ngModel)]="request.fromAccountType"
                    (selectionChange)="onAccountTypeChange('from')"
                    required
                  >
                    <mat-option [value]="'2'">{{ 'nav.savingsAccounts' | translate }}</mat-option>
                    <mat-option [value]="'1'">{{ 'nav.loanAccounts' | translate }}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.ACCOUNT_NO' | translate }}</mat-label>
                  <mat-select name="fromAccountId" [(ngModel)]="request.fromAccountId" required>
                    @for (account of fromAccounts(); track account.id) {
                      <mat-option [value]="account.id"
                        >{{ account.accountNo }} ({{ account.productName }})</mat-option
                      >
                    }
                  </mat-select>
                </mat-form-field>
              </div>

              <!-- To Account Section -->
              <div class="section">
                <h3>{{ 'CLIENTS.TRANSFER_TO' | translate }}</h3>
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'COMMON.OFFICE' | translate }}</mat-label>
                  <mat-select
                    name="toOfficeId"
                    [(ngModel)]="request.toOfficeId"
                    (selectionChange)="onOfficeChange('to')"
                    required
                  >
                    @for (office of offices(); track office.id) {
                      <mat-option [value]="office.id">{{ office.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'COMMON.CLIENT' | translate }}</mat-label>
                  <mat-select
                    name="toClientId"
                    [(ngModel)]="request.toClientId"
                    (selectionChange)="onClientChange('to')"
                    required
                  >
                    @for (client of toClients(); track client.id) {
                      <mat-option [value]="client.id">{{ client.displayName }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.ACCOUNT_TYPE' | translate }}</mat-label>
                  <mat-select
                    name="toAccountType"
                    [(ngModel)]="request.toAccountType"
                    (selectionChange)="onAccountTypeChange('to')"
                    required
                  >
                    <mat-option [value]="'2'">{{ 'nav.savingsAccounts' | translate }}</mat-option>
                    <mat-option [value]="'1'">{{ 'nav.loanAccounts' | translate }}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.ACCOUNT_NO' | translate }}</mat-label>
                  <mat-select name="toAccountId" [(ngModel)]="request.toAccountId" required>
                    @for (account of toAccounts(); track account.id) {
                      <mat-option [value]="account.id"
                        >{{ account.accountNo }} ({{ account.productName }})</mat-option
                      >
                    }
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <div class="transfer-details">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.TRANSFER_AMOUNT' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="transferAmount"
                  [(ngModel)]="request.transferAmount"
                  required
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.TRANSFER_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="transferPicker"
                  name="transferDate"
                  [(ngModel)]="transferDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="transferPicker"></mat-datepicker-toggle>
                <mat-datepicker #transferPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'COMMON.DESCRIPTION' | translate }}</mat-label>
                <textarea
                  matInput
                  name="transferDescription"
                  [(ngModel)]="request.transferDescription"
                  rows="2"
                ></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!transferForm.form.valid"
              >
                {{ 'COMMON.CONFIRM' | translate }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 1000px;
        margin: 0 auto;
      }
      .transfer-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding-top: 16px;
      }
      .transfer-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }
      .section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .section h3 {
        margin: 0 0 8px 0;
        color: var(--primary-color);
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;
      }
      .transfer-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        border-top: 1px dashed #ccc;
        padding-top: 24px;
      }
      .full-width {
        grid-column: span 2;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class AccountTransferFormComponent implements OnInit {
  private readonly transfersService = inject(AccountTransfersService);
  private readonly officesService = inject(OfficesService);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  offices = signal<GetOfficesResponse[]>([]);
  fromClients = signal<GetClientsPageItemsResponse[]>([]);
  toClients = signal<GetClientsPageItemsResponse[]>([]);
  fromAccounts = signal<MiniAccount[]>([]);
  toAccounts = signal<MiniAccount[]>([]);

  transferDate = new Date();
  request: AccountTransferRequest = {
    fromOfficeId: undefined,
    fromClientId: undefined,
    fromAccountType: '2',
    fromAccountId: undefined,
    toOfficeId: undefined,
    toClientId: undefined,
    toAccountType: '2',
    toAccountId: undefined,
    transferAmount: '',
    transferDescription: '',
  };

  ngOnInit(): void {
    this.loadOffices();
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams['fromOfficeId'])
      this.request.fromOfficeId = queryParams['fromOfficeId']?.toString();
    if (queryParams['fromClientId']) {
      this.request.fromClientId = queryParams['fromClientId']?.toString();
      this.onClientChange('from');
    }
    if (queryParams['fromAccountId'])
      this.request.fromAccountId = queryParams['fromAccountId']?.toString();
    if (queryParams['fromAccountType'])
      this.request.fromAccountType = queryParams['fromAccountType']?.toString();
  }

  loadOffices(): void {
    this.officesService.retrieveOffices().subscribe((data) => {
      this.offices.set(data);
      if (!this.request.fromOfficeId && data.length > 0) {
        this.request.fromOfficeId = data[0].id?.toString();
        this.onOfficeChange('from');
      }
      if (!this.request.toOfficeId && data.length > 0) {
        this.request.toOfficeId = data[0].id?.toString();
        this.onOfficeChange('to');
      }
    });
  }

  onOfficeChange(type: 'from' | 'to'): void {
    const officeIdStr = type === 'from' ? this.request.fromOfficeId : this.request.toOfficeId;
    const officeId = officeIdStr ? Number(officeIdStr) : undefined;
    this.clientService
      .retrieveAll21(
        officeId,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      )
      .subscribe((data) => {
        if (type === 'from') {
          this.fromClients.set(Array.from(data.pageItems || []));
        } else {
          this.toClients.set(Array.from(data.pageItems || []));
        }
      });
  }

  onClientChange(type: 'from' | 'to'): void {
    this.onAccountTypeChange(type);
  }

  onAccountTypeChange(type: 'from' | 'to'): void {
    const clientId =
      type === 'from' ? Number(this.request.fromClientId) : Number(this.request.toClientId);
    const accountType = type === 'from' ? this.request.fromAccountType : this.request.toAccountType;

    if (!clientId) return;

    this.clientService.retrieveAssociatedAccounts(clientId).subscribe((data) => {
      if (accountType === '2') {
        const savings = Array.from(data.savingsAccounts || []) as unknown as MiniAccount[];
        if (type === 'from') this.fromAccounts.set(savings);
        else this.toAccounts.set(savings);
      } else {
        const loans = Array.from(data.loanAccounts || []) as unknown as MiniAccount[];
        if (type === 'from') this.fromAccounts.set(loans);
        else this.toAccounts.set(loans);
      }
    });
  }

  onSubmit(): void {
    const payload: AccountTransferRequest = {
      fromOfficeId: this.request.fromOfficeId ? String(this.request.fromOfficeId) : undefined,
      fromClientId: this.request.fromClientId ? String(this.request.fromClientId) : undefined,
      fromAccountType: this.request.fromAccountType
        ? String(this.request.fromAccountType)
        : undefined,
      fromAccountId: this.request.fromAccountId ? String(this.request.fromAccountId) : undefined,
      toOfficeId: this.request.toOfficeId ? String(this.request.toOfficeId) : undefined,
      toClientId: this.request.toClientId ? String(this.request.toClientId) : undefined,
      toAccountType: this.request.toAccountType ? String(this.request.toAccountType) : undefined,
      toAccountId: this.request.toAccountId ? String(this.request.toAccountId) : undefined,
      transferAmount: this.request.transferAmount ? String(this.request.transferAmount) : undefined,
      transferDescription: this.request.transferDescription,
      transferDate: formatDateToFineract(this.transferDate),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.transfersService.create4(payload).subscribe({
      next: () => {
        this.router.navigate(['/clients/view', this.request.fromClientId]);
      },
      error: (err) => console.error('Transfer failed', err),
    });
  }

  onCancel(): void {
    if (this.request.fromClientId) {
      this.router.navigate(['/clients/view', this.request.fromClientId]);
    } else {
      this.router.navigate(['/clients']);
    }
  }
}
