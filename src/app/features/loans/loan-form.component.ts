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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { LoansService, PostLoansRequest, PutLoansLoanIdRequest, LoanProductsService, GetLoanProductsResponse } from '../../api';

@Component({
  selector: 'app-loan-form',
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
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('LOANS.EDIT_LOAN' | translate) : ('LOANS.CREATE_LOAN' | translate) }}
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form #loanForm="ngForm" (ngSubmit)="onSubmit()" class="loan-form">
            <div class="form-grid">
              <!-- Client ID -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.CLIENT_ID_DESC' | translate">
                <mat-label>{{ 'LOANS.CLIENT_ID' | translate }}</mat-label>
                <input matInput type="number" name="clientId" [(ngModel)]="loan.clientId" required [disabled]="isEditMode">
              </mat-form-field>

              <!-- Product -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.LOAN_PRODUCT_DESC' | translate">
                <mat-label>{{ 'LOANS.PRODUCT' | translate }}</mat-label>
                <mat-select name="productId" [(ngModel)]="loan.productId" required [disabled]="isEditMode">
                  @for (product of products; track product.id) {
                    <mat-option [value]="product.id">{{ product.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Principal -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.PRINCIPAL_DESC' | translate">
                <mat-label>{{ 'LOANS.PRINCIPAL' | translate }}</mat-label>
                <input matInput type="number" name="principal" [(ngModel)]="loan.principal" required>
              </mat-form-field>

              <!-- External ID -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.EXTERNAL_ID_DESC' | translate">
                <mat-label>{{ 'COMMON.EXTERNAL_ID' | translate }}</mat-label>
                <input matInput name="externalId" [(ngModel)]="loan.externalId" [disabled]="isEditMode">
              </mat-form-field>

              <!-- Submitted On -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.SUBMITTED_ON_DESC' | translate">
                <mat-label>{{ 'LOANS.SUBMITTED_ON' | translate }}</mat-label>
                <input matInput [matDatepicker]="subPicker" name="submittedOnDate" [(ngModel)]="submittedOnDate" required [disabled]="isEditMode">
                <mat-datepicker-toggle matSuffix [for]="subPicker"></mat-datepicker-toggle>
                <mat-datepicker #subPicker></mat-datepicker>
              </mat-form-field>

              <!-- Expected Disbursement -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.EXPECTED_DISBURSEMENT_DESC' | translate">
                <mat-label>{{ 'LOANS.EXPECTED_DISBURSEMENT' | translate }}</mat-label>
                <input matInput [matDatepicker]="disbPicker" name="expectedDisbursementDate" [(ngModel)]="expectedDisbursementDate" required>
                <mat-datepicker-toggle matSuffix [for]="disbPicker"></mat-datepicker-toggle>
                <mat-datepicker #disbPicker></mat-datepicker>
              </mat-form-field>

              <!-- Term Frequency -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.TERM_FREQUENCY_DESC' | translate">
                <mat-label>{{ 'LOANS.TERM_FREQUENCY' | translate }}</mat-label>
                <input matInput type="number" name="loanTermFrequency" [(ngModel)]="loan.loanTermFrequency" required>
              </mat-form-field>

              <!-- Term Type -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.TERM_TYPE_DESC' | translate">
                <mat-label>{{ 'LOANS.TERM_TYPE' | translate }}</mat-label>
                <mat-select name="loanTermFrequencyType" [(ngModel)]="loan.loanTermFrequencyType" required>
                  <mat-option [value]="0">{{ 'COMMON.DAYS' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'COMMON.WEEKS' | translate }}</mat-option>
                  <mat-option [value]="2">{{ 'COMMON.MONTHS' | translate }}</mat-option>
                  <mat-option [value]="3">{{ 'COMMON.YEARS' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="loanForm.invalid || isSaving">
                {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    .loan-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }
  `]
})
export class LoanFormComponent implements OnInit {
  private readonly loansService = inject(LoansService);
  private readonly productService = inject(LoanProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/loans';

  loanId: number | null = null;
  isEditMode = false;
  isSaving = false;
  
  loan: PostLoansRequest = {
    loanTermFrequencyType: 2, // Months
    transactionProcessingStrategyCode: 'mifos-standard-strategy',
    loanType: 'individual'
  };
  
  submittedOnDate: Date = new Date();
  expectedDisbursementDate: Date = new Date();
  products: GetLoanProductsResponse[] = [];

  ngOnInit() {
    this.loadProducts();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loanId = +id;
        this.isEditMode = true;
        this.loadLoanData();
      }
    });
  }

  loadProducts() {
    this.productService.retrieveAllLoanProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadLoanData() {
    if (!this.loanId) return;
    this.loansService.retrieveLoan(this.loanId).subscribe(loanData => {
      const subArray = loanData.timeline?.submittedOnDate as unknown as number[];
      const disbArray = loanData.timeline?.expectedDisbursementDate as unknown as number[];
      
      if (subArray) this.submittedOnDate = new Date(subArray[0], subArray[1] - 1, subArray[2]);
      if (disbArray) this.expectedDisbursementDate = new Date(disbArray[0], disbArray[1] - 1, disbArray[2]);
      
      this.loan = {
        clientId: loanData.clientId,
        productId: loanData.loanProductId,
        principal: loanData.principal,
        externalId: loanData.externalId,
        loanTermFrequency: loanData.termFrequency,
        loanTermFrequencyType: loanData.termPeriodFrequencyType?.id,
        numberOfRepayments: loanData.numberOfRepayments,
        repaymentEvery: loanData.repaymentEvery
      };
    });
  }

  onSubmit() {
    this.isSaving = true;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const formattedSubDate = `${this.submittedOnDate.getDate()} ${months[this.submittedOnDate.getMonth()]} ${this.submittedOnDate.getFullYear()}`;
    const formattedDisbDate = `${this.expectedDisbursementDate.getDate()} ${months[this.expectedDisbursementDate.getMonth()]} ${this.expectedDisbursementDate.getFullYear()}`;

    if (this.isEditMode && this.loanId) {
      const payload: PutLoansLoanIdRequest = {
        principal: this.loan.principal,
        loanTermFrequency: this.loan.loanTermFrequency,
        loanTermFrequencyType: this.loan.loanTermFrequencyType,
        expectedDisbursementDate: formattedDisbDate,
        dateFormat: 'dd MMMM yyyy',
        locale: 'en'
      };
      this.loansService.modifyLoanApplication(this.loanId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => this.isSaving = false
      });
    } else {
      this.loan.submittedOnDate = formattedSubDate;
      this.loan.expectedDisbursementDate = formattedDisbDate;
      this.loan.dateFormat = 'dd MMMM yyyy';
      this.loan.locale = 'en';
      
      this.loansService.calculateLoanScheduleOrSubmitLoanApplication(this.loan).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => this.isSaving = false
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
