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
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  AccountingClosureService,
  PostGlClosuresRequest,
  OfficesService,
  GetOfficesResponse,
} from '../../api';
import { HelpIconComponent } from '../../shared';

/**
 * Component for closing an accounting period for an office.
 */
@Component({
  selector: 'app-accounting-closure-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HelpIconComponent,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            Close Accounting Period
            <app-help-icon [helpTextKey]="'HELP.ACCOUNTING_CLOSURES_DESC'"></app-help-icon>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #closureForm="ngForm" (ngSubmit)="onSubmit()" class="closure-form">
            <div class="form-grid">
              <!-- Office -->
              <mat-form-field appearance="outline">
                <mat-label>Office</mat-label>
                <mat-select name="officeId" [(ngModel)]="request.officeId" required>
                  @for (office of offices; track office.id) {
                    <mat-option [value]="office.id">{{ office.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Closing Date -->
              <mat-form-field appearance="outline">
                <mat-label>Closing Date</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="closingDate"
                  [(ngModel)]="closingDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <!-- Comments -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Comments</mat-label>
                <textarea
                  matInput
                  name="comments"
                  [(ngModel)]="request.comments"
                  rows="3"
                ></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">Cancel</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="closureForm.invalid || isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Close Period' }}
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
        max-width: 800px;
        margin: 0 auto;
      }
      .closure-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .full-width {
        grid-column: span 2;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
    `,
  ],
})
export class AccountingClosureFormComponent implements OnInit {
  private readonly closureService = inject(AccountingClosureService);
  private readonly officeService = inject(OfficesService);
  private readonly router = inject(Router);

  offices: GetOfficesResponse[] = [];
  request: PostGlClosuresRequest = {
    officeId: undefined,
    comments: '',
  };
  closingDate: Date = new Date();
  isSaving = false;

  ngOnInit() {
    this.officeService
      .retrieveOffices()
      .subscribe((data: GetOfficesResponse[]) => (this.offices = data));
  }

  onSubmit() {
    this.isSaving = true;
    const formattedDate = `${this.closingDate.getFullYear()}-${String(
      this.closingDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.closingDate.getDate()).padStart(2, '0')}`;

    this.request.closingDate = formattedDate;
    this.request.dateFormat = 'yyyy-MM-dd';
    this.request.locale = 'en';

    this.closureService.createGLClosure(this.request).subscribe({
      next: () => this.router.navigate(['/accounting/closures']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel() {
    this.router.navigate(['/accounting/closures']);
  }
}
