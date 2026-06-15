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
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CodesService, CodeValuesService, GetCodeValuesDataResponse } from '../../api';

export interface ClientActionDialogData {
  title: string;
  command: string;
  clientId: number;
}

@Component({
  selector: 'app-client-action-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title | translate }}</h2>
    <mat-dialog-content>
      <div class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ dateLabel | translate }}</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="actionDate" required />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        @if (showReasonDropdown) {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ reasonLabel | translate }}</mat-label>
            <mat-select [(ngModel)]="reasonId" required>
              @for (reason of reasonOptions; track reason.id) {
                <mat-option [value]="reason.id">{{ reason.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        }

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'COMMON.NOTE' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="note" rows="3"></textarea>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
      <button mat-raised-button color="primary" (click)="onConfirm()" [disabled]="!isValid">
        {{ 'COMMON.CONFIRM' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 8px;
        min-width: 350px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class ClientActionDialogComponent implements OnInit {
  private readonly codesService = inject(CodesService);
  private readonly codeValuesService = inject(CodeValuesService);
  public readonly dialogRef = inject(MatDialogRef<ClientActionDialogComponent>);
  public readonly data = inject<ClientActionDialogData>(MAT_DIALOG_DATA);

  actionDate: Date = new Date();
  reasonId?: number;
  note = '';

  reasonOptions: GetCodeValuesDataResponse[] = [];

  dateLabel = '';
  reasonLabel = '';
  showReasonDropdown = false;

  ngOnInit(): void {
    this.setupConfig();
  }

  private setupConfig(): void {
    const activationDateLabel = 'ACTIONS.ACTIVATION_DATE';
    const config: Record<string, { date: string; reason?: string; codeName?: string }> = {
      activate: { date: activationDateLabel },
      reject: {
        date: 'ACTIONS.REJECTION_DATE',
        reason: 'ACTIONS.REJECTION_REASON',
        codeName: 'ClientRejectReason',
      },
      withdraw: {
        date: 'ACTIONS.WITHDRAWAL_DATE',
        reason: 'ACTIONS.WITHDRAWAL_REASON',
        codeName: 'ClientWithdrawReason',
      },
      close: {
        date: 'ACTIONS.CLOSURE_DATE',
        reason: 'ACTIONS.CLOSURE_REASON',
        codeName: 'ClientClosureReason',
      },
      reactivate: { date: activationDateLabel },
      undoReject: { date: activationDateLabel },
      undoWithdraw: { date: activationDateLabel },
    };

    const c = config[this.data.command];
    if (c) {
      this.dateLabel = c.date;
      if (c.reason && c.codeName) {
        this.reasonLabel = c.reason;
        this.showReasonDropdown = true;
        this.loadReasons(c.codeName);
      }
    }
  }

  private loadReasons(codeName: string): void {
    this.codesService.getCodesNameCodeName(codeName).subscribe({
      next: (code) => {
        if (code.id) {
          this.codeValuesService.getCodesCodeIdCodevalues(code.id).subscribe({
            next: (values) => (this.reasonOptions = values),
          });
        }
      },
    });
  }

  get isValid(): boolean {
    if (!this.actionDate) return false;
    if (this.showReasonDropdown && !this.reasonId) return false;
    return true;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.isValid) {
      this.dialogRef.close({
        actionDate: this.actionDate,
        reasonId: this.reasonId,
        note: this.note,
      });
    }
  }
}
