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
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PasswordManagementService, ForgotPasswordRequest } from '../../../api';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <div class="forgot-password-container">
      <mat-card class="forgot-password-card">
        <mat-card-header>
          <mat-card-title>{{ 'FORGOT_PASSWORD.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (sent) {
            <div class="success-message">
              {{ 'FORGOT_PASSWORD.SUCCESS_MSG' | translate }}
            </div>
          } @else {
            <form #forgotForm="ngForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'FORGOT_PASSWORD.EMAIL' | translate }}</mat-label>
                <input
                  matInput
                  type="email"
                  name="email"
                  [(ngModel)]="email"
                  required
                  email
                  [disabled]="isSending"
                />
              </mat-form-field>

              <div class="actions">
                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="forgotForm.invalid || isSending"
                >
                  @if (isSending) {
                    <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
                  }
                  {{ 'FORGOT_PASSWORD.SEND' | translate }}
                </button>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .forgot-password-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
        padding: 16px;
      }
      .forgot-password-card {
        width: 100%;
        max-width: 400px;
      }
      .full-width {
        width: 100%;
        margin-top: 16px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
      }
      .inline-spinner {
        display: inline-block;
        margin-right: 8px;
      }
      .success-message {
        padding: 16px 0;
        color: #388e3c;
        font-size: 1rem;
      }
    `,
  ],
})
export class ForgotPasswordComponent {
  private passwordManagementService = inject(PasswordManagementService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  email = '';
  isSending = false;
  sent = false;

  onSubmit(): void {
    if (!this.email) {
      return;
    }
    this.isSending = true;
    this.passwordManagementService
      .postPasswordForgot({ email: this.email } as ForgotPasswordRequest)
      .subscribe({
        next: () => {
          this.isSending = false;
          this.sent = true;
        },
        error: () => {
          this.isSending = false;
          this.translate.get('FORGOT_PASSWORD.ERROR').subscribe((msg: string) => {
            this.snackBar.open(msg, 'X', { duration: 4000 });
          });
        },
      });
  }
}
