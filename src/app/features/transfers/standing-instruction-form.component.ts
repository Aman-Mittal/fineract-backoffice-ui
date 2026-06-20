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
import { ActivatedRoute, Router } from '@angular/router';
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
  StandingInstructionsService,
  OfficesService,
  ClientService,
  StandingInstructionCreationRequest,
  GetOfficesResponse,
  GetClientsPageItemsResponse,
  GetStandingInstructionsStandingInstructionIdResponse,
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
  selector: 'app-standing-instruction-form',
  standalone: true,
  imports: [
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
          <mat-card-title>
            {{
              isEditMode
                ? ('CLIENTS.EDIT_STANDING_INSTRUCTION' | translate)
                : ('CLIENTS.CREATE_STANDING_INSTRUCTION' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #instructionForm="ngForm" (ngSubmit)="onSubmit()" class="instruction-form">
            <div class="form-grid">
              <!-- Header Info -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="request.name" required />
              </mat-form-field>

              <!-- From Account Section -->
              <div class="section-group">
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
              <div class="section-group">
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

              <!-- Transfer Details -->
              <div class="section-group full-width details-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.TRANSFER_TYPE' | translate }}</mat-label>
                  <mat-select name="transferType" [(ngModel)]="request.transferType" required>
                    <mat-option [value]="'1'">Account Transfer</mat-option>
                    <mat-option [value]="'2'">Loan Repayment</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'COMMON.AMOUNT' | translate }}</mat-label>
                  <input
                    matInput
                    type="number"
                    name="amount"
                    [(ngModel)]="request.amount"
                    required
                  />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.INSTRUCTION_TYPE' | translate }}</mat-label>
                  <mat-select name="instructionType" [(ngModel)]="request.instructionType" required>
                    <mat-option [value]="'1'">Fixed</mat-option>
                    <mat-option [value]="'2'">Dues</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'COMMON.PRIORITY' | translate }}</mat-label>
                  <mat-select name="priority" [(ngModel)]="request.priority" required>
                    <mat-option [value]="'1'">High</mat-option>
                    <mat-option [value]="'2'">Medium</mat-option>
                    <mat-option [value]="'3'">Low</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <!-- Recurrence -->
              <div class="section-group full-width recurrence-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.RECURRENCE_TYPE' | translate }}</mat-label>
                  <mat-select name="recurrenceType" [(ngModel)]="request.recurrenceType" required>
                    <mat-option [value]="'1'">Periodic</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.RECURRENCE_FREQUENCY' | translate }}</mat-label>
                  <mat-select
                    name="recurrenceFrequency"
                    [(ngModel)]="request.recurrenceFrequency"
                    required
                  >
                    <mat-option [value]="'1'">Days</mat-option>
                    <mat-option [value]="'2'">Weeks</mat-option>
                    <mat-option [value]="'3'">Months</mat-option>
                    <mat-option [value]="'4'">Years</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.RECURRENCE_INTERVAL' | translate }}</mat-label>
                  <input
                    matInput
                    type="number"
                    name="recurrenceInterval"
                    [(ngModel)]="request.recurrenceInterval"
                    required
                  />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.VALID_FROM' | translate }}</mat-label>
                  <input
                    matInput
                    [matDatepicker]="fromPicker"
                    name="validFrom"
                    [(ngModel)]="validFrom"
                    required
                  />
                  <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
                  <mat-datepicker #fromPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'CLIENTS.VALID_TILL' | translate }}</mat-label>
                  <input
                    matInput
                    [matDatepicker]="tillPicker"
                    name="validTill"
                    [(ngModel)]="validTill"
                  />
                  <mat-datepicker-toggle matSuffix [for]="tillPicker"></mat-datepicker-toggle>
                  <mat-datepicker #tillPicker></mat-datepicker>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!instructionForm.form.valid"
              >
                {{ 'COMMON.SAVE' | translate }}
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
        max-width: 1200px;
        margin: 0 auto;
      }
      .instruction-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding-top: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }
      .section-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .section-group h3 {
        margin: 0 0 8px 0;
        color: var(--primary-color);
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;
      }
      .details-row,
      .recurrence-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        border-top: 1px dashed #ccc;
        padding-top: 24px;
      }
      .recurrence-row {
        grid-template-columns: repeat(5, 1fr);
      }
    `,
  ],
})
export class StandingInstructionFormComponent implements OnInit {
  private readonly instructionsService = inject(StandingInstructionsService);
  private readonly officesService = inject(OfficesService);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly instructionsPath = '/transfers/standing-instructions';

  isEditMode = false;
  instructionId?: number;
  offices = signal<GetOfficesResponse[]>([]);
  fromClients = signal<GetClientsPageItemsResponse[]>([]);
  toClients = signal<GetClientsPageItemsResponse[]>([]);
  fromAccounts = signal<MiniAccount[]>([]);
  toAccounts = signal<MiniAccount[]>([]);

  validFrom = new Date();
  validTill?: Date;

  request: StandingInstructionCreationRequest = {
    name: '',
    fromOfficeId: undefined,
    fromClientId: undefined,
    fromAccountType: '2',
    fromAccountId: undefined,
    toOfficeId: undefined,
    toClientId: undefined,
    toAccountType: '2',
    toAccountId: undefined,
    transferType: '1',
    amount: '',
    instructionType: '1',
    priority: '2',
    recurrenceType: '1',
    recurrenceFrequency: '3',
    recurrenceInterval: '1',
    status: '1',
  };

  ngOnInit(): void {
    this.loadOffices();
    this.instructionId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.instructionId) {
      this.isEditMode = true;
      this.loadInstructionData();
    }
  }

  loadOffices(): void {
    this.officesService.getOffices().subscribe((data) => {
      this.offices.set(data);
      if (!this.isEditMode && data.length > 0) {
        this.request.fromOfficeId = data[0].id?.toString();
        this.request.toOfficeId = data[0].id?.toString();
        this.onOfficeChange('from');
        this.onOfficeChange('to');
      }
    });
  }

  loadInstructionData(): void {
    this.instructionsService
      .getStandinginstructionsStandingInstructionId(this.instructionId!)
      .subscribe((data: GetStandingInstructionsStandingInstructionIdResponse) => {
        this.populateRequest(data);
        this.populateDates(data);
        this.onOfficeChange('from');
        this.onOfficeChange('to');
      });
  }

  private populateRequest(data: GetStandingInstructionsStandingInstructionIdResponse): void {
    this.request = {
      name: data.name,
      fromOfficeId: data.fromOffice?.id?.toString(),
      fromClientId: data.fromClient?.id?.toString(),
      fromAccountType: data.fromAccountType?.id?.toString(),
      fromAccountId: data.fromAccount?.id?.toString(),
      toOfficeId: data.toOffice?.id?.toString(),
      toClientId: data.toClient?.id?.toString(),
      toAccountType: data.toAccountType?.id?.toString(),
      toAccountId: data.toAccount?.id?.toString(),
      transferType: data.transferType?.id?.toString(),
      amount: data.amount?.toString(),
      instructionType: data.instructionType?.id?.toString(),
      priority: data.priority?.id?.toString(),
      recurrenceType: data.recurrenceType?.id?.toString(),
      recurrenceFrequency: data.recurrenceFrequency?.id?.toString(),
      recurrenceInterval: data.recurrenceInterval?.toString(),
      status: data.status?.id?.toString(),
    };
  }

  private populateDates(data: GetStandingInstructionsStandingInstructionIdResponse): void {
    if (data.validFrom) {
      const vf = data.validFrom as unknown as number[];
      this.validFrom = new Date(vf[0], vf[1] - 1, vf[2]);
    }
    const rawData = data as unknown as Record<string, unknown>;
    if (rawData['validTill']) {
      const vt = rawData['validTill'] as unknown as number[];
      this.validTill = new Date(vt[0], vt[1] - 1, vt[2]);
    }
  }

  onOfficeChange(type: 'from' | 'to'): void {
    const officeIdStr = type === 'from' ? this.request.fromOfficeId : this.request.toOfficeId;
    const officeId = officeIdStr ? Number(officeIdStr) : undefined;
    if (!officeId) return;
    this.clientService
      .getClients(
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

    this.clientService.getClientsClientIdAccounts(clientId).subscribe((data) => {
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
    const payload = this.buildPayload();

    if (this.isEditMode) {
      this.updateInstruction(payload);
    } else {
      this.createInstruction(payload);
    }
  }

  private buildPayload(): StandingInstructionCreationRequest {
    const payload = this.mapBasicFields();
    return {
      ...payload,
      validFrom: formatDateToFineract(this.validFrom),
      validTill: this.validTill ? formatDateToFineract(this.validTill) : undefined,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
      monthDayFormat: 'dd MMMM',
    };
  }

  private mapBasicFields(): Partial<StandingInstructionCreationRequest> {
    return {
      ...this.mapAccountFields(),
      ...this.mapRuleFields(),
    };
  }

  private mapAccountFields(): Partial<StandingInstructionCreationRequest> {
    return {
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
    };
  }

  private mapRuleFields(): Partial<StandingInstructionCreationRequest> {
    return {
      name: this.request.name,
      transferType: this.request.transferType ? String(this.request.transferType) : undefined,
      amount: this.request.amount ? String(this.request.amount) : undefined,
      instructionType: this.request.instructionType
        ? String(this.request.instructionType)
        : undefined,
      priority: this.request.priority ? String(this.request.priority) : undefined,
      recurrenceType: this.request.recurrenceType ? String(this.request.recurrenceType) : undefined,
      recurrenceFrequency: this.request.recurrenceFrequency
        ? String(this.request.recurrenceFrequency)
        : undefined,
      recurrenceInterval: this.request.recurrenceInterval
        ? String(this.request.recurrenceInterval)
        : undefined,
      status: this.request.status ? String(this.request.status) : undefined,
    };
  }

  private updateInstruction(payload: StandingInstructionCreationRequest): void {
    this.instructionsService
      .putStandinginstructionsStandingInstructionId(this.instructionId!, undefined, payload)
      .subscribe({
        next: () => this.router.navigate([this.instructionsPath]),
        error: (err) => console.error('Update failed', err),
      });
  }

  private createInstruction(payload: StandingInstructionCreationRequest): void {
    this.instructionsService.postStandinginstructions(payload).subscribe({
      next: () => this.router.navigate([this.instructionsPath]),
      error: (err) => console.error('Creation failed', err),
    });
  }

  onCancel(): void {
    this.router.navigate([this.instructionsPath]);
  }
}
