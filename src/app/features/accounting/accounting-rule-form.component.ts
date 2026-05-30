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

import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AccountingRulesService } from '../../api/api/accountingRules.service';

@Component({
  selector: 'app-accounting-rule-form',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  template: `
    <div class="container">
      <h1>{{ isEdit ? 'Edit' : 'Create' }} Accounting Rule</h1>

      <form [formGroup]="ruleForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rule Name</mat-label>
          <input matInput formControlName="name" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Office</mat-label>
          <mat-select formControlName="officeId" required>
            @for (office of offices; track office['id']) {
              <mat-option [value]="office['id']">
                {{ office['name'] }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="section">
          <h3>Debit Details</h3>
          <mat-radio-group formControlName="debitRuleType" class="radio-group">
            <mat-radio-button value="fixedAccount">Fixed Account</mat-radio-button>
            <mat-radio-button value="tags">Account Tags</mat-radio-button>
          </mat-radio-group>

          @if (ruleForm.get('debitRuleType')?.value === 'fixedAccount') {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Account to Debit</mat-label>
              <mat-select formControlName="accountToDebit">
                @for (account of accounts; track account['id']) {
                  <mat-option [value]="account['id']">
                    {{ account['name'] }} ({{ account['glCode'] }})
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          }

          @if (ruleForm.get('debitRuleType')?.value === 'tags') {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Debit Tags</mat-label>
              <mat-select formControlName="debitTags" multiple>
                @for (tag of debitTags; track tag['id']) {
                  <mat-option [value]="tag['id']">
                    {{ tag['name'] }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          }

          <mat-checkbox formControlName="allowMultipleDebitEntries">
            Allow Multiple Debit Entries
          </mat-checkbox>
        </div>

        <div class="section">
          <h3>Credit Details</h3>
          <mat-radio-group formControlName="creditRuleType" class="radio-group">
            <mat-radio-button value="fixedAccount">Fixed Account</mat-radio-button>
            <mat-radio-button value="tags">Account Tags</mat-radio-button>
          </mat-radio-group>

          @if (ruleForm.get('creditRuleType')?.value === 'fixedAccount') {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Account to Credit</mat-label>
              <mat-select formControlName="accountToCredit">
                @for (account of accounts; track account['id']) {
                  <mat-option [value]="account['id']">
                    {{ account['name'] }} ({{ account['glCode'] }})
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          }

          @if (ruleForm.get('creditRuleType')?.value === 'tags') {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Credit Tags</mat-label>
              <mat-select formControlName="creditTags" multiple>
                @for (tag of creditTags; track tag['id']) {
                  <mat-option [value]="tag['id']">
                    {{ tag['name'] }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          }

          <mat-checkbox formControlName="allowMultipleCreditEntries">
            Allow Multiple Credit Entries
          </mat-checkbox>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <div class="actions">
          <button mat-button type="button" routerLink="/accounting/rules">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="ruleForm.invalid">
            {{ isEdit ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      .full-width {
        width: 100%;
        margin-bottom: 15px;
      }
      .section {
        margin-bottom: 25px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .radio-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
      }
    `,
  ],
})
export class AccountingRuleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountingRulesService = inject(AccountingRulesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ruleForm: FormGroup;
  isEdit = false;
  ruleId?: number;

  offices: Record<string, unknown>[] = [];
  accounts: Record<string, unknown>[] = [];
  debitTags: Record<string, unknown>[] = [];
  creditTags: Record<string, unknown>[] = [];

  constructor() {
    this.ruleForm = this.fb.group({
      name: ['', Validators.required],
      officeId: ['', Validators.required],
      debitRuleType: ['fixedAccount'],
      accountToDebit: [''],
      debitTags: [[]],
      allowMultipleDebitEntries: [false],
      creditRuleType: ['fixedAccount'],
      accountToCredit: [''],
      creditTags: [[]],
      allowMultipleCreditEntries: [false],
      description: [''],
    });
  }

  ngOnInit() {
    this.ruleId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.ruleId;

    this.loadTemplate();

    if (this.isEdit) {
      this.loadRule();
    }
  }

  loadTemplate() {
    this.accountingRulesService.retrieveTemplate1().subscribe((template) => {
      const templateData = template as Record<string, unknown>;
      this.offices = (templateData['allowedOffices'] as Record<string, unknown>[]) || [];
      this.accounts = (templateData['allowedAccounts'] as Record<string, unknown>[]) || [];
      this.debitTags = (templateData['allowedDebitTagOptions'] as Record<string, unknown>[]) || [];
      this.creditTags =
        (templateData['allowedCreditTagOptions'] as Record<string, unknown>[]) || [];
    });
  }

  loadRule() {
    this.accountingRulesService.retreiveAccountingRule(this.ruleId!).subscribe((rule) => {
      const ruleData = rule as Record<string, unknown>;
      const debitAccounts = (ruleData['debitAccounts'] as Record<string, unknown>[]) || [];
      const creditAccounts = (ruleData['creditAccounts'] as Record<string, unknown>[]) || [];
      const debitTags = (ruleData['debitTags'] as Record<string, unknown>[]) || [];
      const creditTags = (ruleData['creditTags'] as Record<string, unknown>[]) || [];

      this.ruleForm.patchValue({
        name: ruleData['name'],
        officeId: ruleData['officeId'],
        description: ruleData['description'],
        allowMultipleDebitEntries: ruleData['allowMultipleDebitEntries'],
        allowMultipleCreditEntries: ruleData['allowMultipleCreditEntries'],
        debitRuleType: debitAccounts.length ? 'fixedAccount' : 'tags',
        creditRuleType: creditAccounts.length ? 'fixedAccount' : 'tags',
        accountToDebit: debitAccounts[0]?.['id'],
        accountToCredit: creditAccounts[0]?.['id'],
        debitTags: debitTags.map((t) => (t['tag'] as Record<string, unknown>)?.['id']),
        creditTags: creditTags.map((t) => (t['tag'] as Record<string, unknown>)?.['id']),
      });
    });
  }

  onSubmit() {
    if (this.ruleForm.invalid) return;

    const formValue = this.ruleForm.value;
    const request: Record<string, unknown> = {
      name: formValue.name,
      officeId: formValue.officeId,
      description: formValue.description,
      allowMultipleDebitEntries: formValue.allowMultipleDebitEntries,
      allowMultipleCreditEntries: formValue.allowMultipleCreditEntries,
    };

    if (formValue.debitRuleType === 'fixedAccount') {
      request['accountToDebit'] = formValue.accountToDebit;
    } else {
      request['debitTags'] = formValue.debitTags;
    }

    if (formValue.creditRuleType === 'fixedAccount') {
      request['accountToCredit'] = formValue.accountToCredit;
    } else {
      request['creditTags'] = formValue.creditTags;
    }

    const obs = this.isEdit
      ? (this.accountingRulesService.updateAccountingRule(
          this.ruleId!,
          request,
        ) as Observable<unknown>)
      : (this.accountingRulesService.createAccountingRule(request) as Observable<unknown>);

    obs.subscribe(() => {
      this.router.navigate(['/accounting/rules']);
    });
  }
}
