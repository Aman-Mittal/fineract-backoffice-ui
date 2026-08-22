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

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';

import { I18N, TranslatePipe } from '../../../core/adapters';
import { NotificationService } from '../../../core/services/notification.service';
import {
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
  formatDateToFineract,
  toIsoDate,
} from '../../../core/utils/date-formatter';
import {
  BASE_PATH,
  BatchAPIService,
  BatchRequest,
  GetLoanProductsResponse,
  LoanProductsService,
} from '../../../api';
import { GroupDetail } from '../group-detail.model';

interface GlimMemberRow {
  id: number;
  displayName: string;
  selected: boolean;
  principal: number | null;
}

/** The static enum options `loan-form.component.ts` also uses; Fineract does not vary these by product. */
const LOAN_TERM_FREQUENCY_TYPES = [
  { id: 0, labelKey: 'COMMON.DAYS' },
  { id: 1, labelKey: 'COMMON.WEEKS' },
  { id: 2, labelKey: 'COMMON.MONTHS' },
  { id: 3, labelKey: 'COMMON.YEARS' },
] as const;

const REPAYMENT_FREQUENCY_TYPES = [
  { id: 0, labelKey: 'COMMON.DAYS' },
  { id: 1, labelKey: 'COMMON.WEEKS' },
  { id: 2, labelKey: 'COMMON.MONTHS' },
] as const;

const INTEREST_TYPES = [
  { id: 0, labelKey: 'LOANS.DECLINING_BALANCE' },
  { id: 1, labelKey: 'LOANS.FLAT' },
] as const;

const AMORTIZATION_TYPES = [
  { id: 1, labelKey: 'LOANS.EQUAL_INSTALLMENTS' },
  { id: 0, labelKey: 'LOANS.EQUAL_PRINCIPAL' },
] as const;

const INTEREST_CALCULATION_PERIOD_TYPES = [
  { id: 0, labelKey: 'LOANS.DAILY' },
  { id: 1, labelKey: 'LOANS.SAME_AS_REPAYMENT' },
] as const;

interface GlimTerms {
  productId: number | null;
  loanTermFrequency: number | null;
  loanTermFrequencyType: number | null;
  numberOfRepayments: number | null;
  repaymentEvery: number | null;
  repaymentFrequencyType: number | null;
  interestRatePerPeriod: number | null;
  interestType: number | null;
  amortizationType: number | null;
  interestCalculationPeriodType: number | null;
}

function defaultTerms(): GlimTerms {
  return {
    productId: null,
    loanTermFrequency: null,
    loanTermFrequencyType: null,
    numberOfRepayments: null,
    repaymentEvery: null,
    repaymentFrequencyType: null,
    interestRatePerPeriod: null,
    interestType: null,
    amortizationType: null,
    interestCalculationPeriodType: null,
  };
}

/**
 * Creates a GLIM (Group Loan In individual Monitoring) application: one loan per selected
 * group member, sharing the same product and terms, submitted together through the batch API.
 *
 * Mirrors web-app's `create-glim-account.component.ts`, whose real submission shape marks every
 * member request `isParentAccount: true` and carries the same `totalLoan` (the sum of every
 * selected member's principal) — not just the first one. That looked like it could be a mistake
 * on first read, but it is what the working implementation actually sends, so it is what this
 * mirrors rather than a guessed "first member is parent" scheme.
 */
@Component({
  selector: 'app-create-glim-account',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox,
    IonDatetime,
    IonDatetimeButton,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonSpinner,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ 'GROUPS.CREATE_GLIM_LOAN' | appTranslate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          @if (isLoading()) {
            <ion-spinner data-testid="glim-form-loading" />
          } @else {
            <form #glimForm="ngForm" (ngSubmit)="onSubmit()" class="glim-form">
              <div class="form-grid">
                <ion-item fill="outline">
                  <ion-label position="stacked">{{ 'LOANS.PRODUCT' | appTranslate }}</ion-label>
                  <ion-select
                    [attr.aria-label]="'LOANS.PRODUCT' | appTranslate"
                    interface="popover"
                    name="productId"
                    [(ngModel)]="terms.productId"
                    (ngModelChange)="onProductSelected($event)"
                    required
                  >
                    @for (product of products(); track product.id) {
                      <ion-select-option [value]="product.id">{{ product.name }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'COMMON.SUBMITTED_ON' | appTranslate
                  }}</ion-label>
                  <ion-datetime-button datetime="submittedOnDate-picker" />
                  <ion-modal [keepContentsMounted]="true">
                    <ng-template>
                      <ion-datetime
                        id="submittedOnDate-picker"
                        data-testid="submittedOnDate-picker"
                        presentation="date"
                        name="submittedOnDate"
                        [ngModel]="submittedOnDate()"
                        (ngModelChange)="submittedOnDate.set($event)"
                        required
                      />
                    </ng-template>
                  </ion-modal>
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'LOANS.EXPECTED_DISBURSEMENT' | appTranslate
                  }}</ion-label>
                  <ion-datetime-button datetime="expectedDisbursementDate-picker" />
                  <ion-modal [keepContentsMounted]="true">
                    <ng-template>
                      <ion-datetime
                        id="expectedDisbursementDate-picker"
                        data-testid="expectedDisbursementDate-picker"
                        presentation="date"
                        name="expectedDisbursementDate"
                        [ngModel]="expectedDisbursementDate()"
                        (ngModelChange)="expectedDisbursementDate.set($event)"
                        required
                      />
                    </ng-template>
                  </ion-modal>
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'LOANS.TERM_FREQUENCY' | appTranslate
                  }}</ion-label>
                  <ion-input
                    [attr.aria-label]="'LOANS.TERM_FREQUENCY' | appTranslate"
                    type="number"
                    name="loanTermFrequency"
                    [(ngModel)]="terms.loanTermFrequency"
                    required
                  />
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{ 'LOANS.TERM_TYPE' | appTranslate }}</ion-label>
                  <ion-select
                    [attr.aria-label]="'LOANS.TERM_TYPE' | appTranslate"
                    interface="popover"
                    name="loanTermFrequencyType"
                    [(ngModel)]="terms.loanTermFrequencyType"
                    required
                  >
                    @for (option of loanTermFrequencyTypes; track option.id) {
                      <ion-select-option [value]="option.id">{{
                        option.labelKey | appTranslate
                      }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'LOANS.REPAYMENTS_COUNT' | appTranslate
                  }}</ion-label>
                  <ion-input
                    [attr.aria-label]="'LOANS.REPAYMENTS_COUNT' | appTranslate"
                    type="number"
                    name="numberOfRepayments"
                    [(ngModel)]="terms.numberOfRepayments"
                    required
                  />
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'LOANS.REPAYMENT_EVERY' | appTranslate
                  }}</ion-label>
                  <ion-input
                    [attr.aria-label]="'LOANS.REPAYMENT_EVERY' | appTranslate"
                    type="number"
                    name="repaymentEvery"
                    [(ngModel)]="terms.repaymentEvery"
                    required
                  />
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{ 'COMMON.FREQUENCY' | appTranslate }}</ion-label>
                  <ion-select
                    [attr.aria-label]="'COMMON.FREQUENCY' | appTranslate"
                    interface="popover"
                    name="repaymentFrequencyType"
                    [(ngModel)]="terms.repaymentFrequencyType"
                    required
                  >
                    @for (option of repaymentFrequencyTypes; track option.id) {
                      <ion-select-option [value]="option.id">{{
                        option.labelKey | appTranslate
                      }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'COMMON.INTEREST_RATE' | appTranslate
                  }}</ion-label>
                  <ion-input
                    [attr.aria-label]="'COMMON.INTEREST_RATE' | appTranslate"
                    type="number"
                    name="interestRatePerPeriod"
                    [(ngModel)]="terms.interestRatePerPeriod"
                    required
                  />
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'PRODUCTS.INTEREST_TYPE' | appTranslate
                  }}</ion-label>
                  <ion-select
                    [attr.aria-label]="'PRODUCTS.INTEREST_TYPE' | appTranslate"
                    interface="popover"
                    name="interestType"
                    [(ngModel)]="terms.interestType"
                    required
                  >
                    @for (option of interestTypes; track option.id) {
                      <ion-select-option [value]="option.id">{{
                        option.labelKey | appTranslate
                      }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'PRODUCTS.AMORTIZATION_TYPE' | appTranslate
                  }}</ion-label>
                  <ion-select
                    [attr.aria-label]="'PRODUCTS.AMORTIZATION_TYPE' | appTranslate"
                    interface="popover"
                    name="amortizationType"
                    [(ngModel)]="terms.amortizationType"
                    required
                  >
                    @for (option of amortizationTypes; track option.id) {
                      <ion-select-option [value]="option.id">{{
                        option.labelKey | appTranslate
                      }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'PRODUCTS.INTEREST_CALCULATION_PERIOD_TYPE' | appTranslate
                  }}</ion-label>
                  <ion-select
                    [attr.aria-label]="'PRODUCTS.INTEREST_CALCULATION_PERIOD_TYPE' | appTranslate"
                    interface="popover"
                    name="interestCalculationPeriodType"
                    [(ngModel)]="terms.interestCalculationPeriodType"
                    required
                  >
                    @for (option of interestCalculationPeriodTypes; track option.id) {
                      <ion-select-option [value]="option.id">{{
                        option.labelKey | appTranslate
                      }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>
              </div>

              <h2>{{ 'GROUPS.MEMBER_PRINCIPALS' | appTranslate }}</h2>
              @if (members().length === 0) {
                <p data-testid="glim-no-members">{{ 'GROUPS.NO_ACTIVE_MEMBERS' | appTranslate }}</p>
              } @else {
                <table class="members-table" data-testid="glim-members-table">
                  <tbody>
                    @for (member of members(); track member.id) {
                      <tr>
                        <td>
                          <ion-checkbox
                            [attr.aria-label]="member.displayName"
                            [ngModel]="member.selected"
                            (ngModelChange)="onMemberSelectedChange(member, $event)"
                            [name]="'select-' + member.id"
                          />
                        </td>
                        <td>{{ member.displayName }}</td>
                        <td>
                          <ion-input
                            [attr.aria-label]="
                              ('LOANS.PRINCIPAL' | appTranslate) + ' - ' + member.displayName
                            "
                            type="number"
                            [name]="'principal-' + member.id"
                            [ngModel]="member.principal"
                            (ngModelChange)="onMemberPrincipalChange(member, $event)"
                            [disabled]="!member.selected"
                          />
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
                <p data-testid="glim-total-principal">
                  {{ 'GROUPS.TOTAL_PRINCIPAL' | appTranslate }}: {{ totalPrincipal() }}
                </p>
              }

              <div class="form-actions">
                <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving()">
                  {{ 'COMMON.CANCEL' | appTranslate }}
                </ion-button>
                <ion-button
                  color="primary"
                  type="submit"
                  [disabled]="glimForm.invalid || !canSubmit() || isSaving()"
                >
                  @if (isSaving()) {
                    <ion-spinner name="crescent" />
                    {{ 'COMMON.SAVING' | appTranslate }}
                  } @else {
                    {{ 'COMMON.SAVE' | appTranslate }}
                  }
                </ion-button>
              </div>
            </form>
          }
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
      }
      .glim-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      h2 {
        font-size: 1rem;
        margin: 8px 0;
      }
      .members-table {
        width: 100%;
        border-collapse: collapse;
      }
      .members-table td {
        padding: 8px;
        border-bottom: 1px solid var(--ion-color-light-shade);
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    `,
  ],
})
export class CreateGlimAccountComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly basePath = inject(BASE_PATH);
  private readonly productService = inject(LoanProductsService);
  private readonly batchService = inject(BatchAPIService);
  private readonly notifications = inject(NotificationService);
  private readonly i18n = inject(I18N);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  groupId = 0;

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly members = signal<GlimMemberRow[]>([]);
  readonly products = signal<GetLoanProductsResponse[]>([]);

  readonly submittedOnDate = signal(toIsoDate(new Date()));
  readonly expectedDisbursementDate = signal(toIsoDate(new Date()));
  terms: GlimTerms = defaultTerms();

  readonly loanTermFrequencyTypes = LOAN_TERM_FREQUENCY_TYPES;
  readonly repaymentFrequencyTypes = REPAYMENT_FREQUENCY_TYPES;
  readonly interestTypes = INTEREST_TYPES;
  readonly amortizationTypes = AMORTIZATION_TYPES;
  readonly interestCalculationPeriodTypes = INTEREST_CALCULATION_PERIOD_TYPES;

  readonly selectedMembers = computed(() => this.members().filter((member) => member.selected));
  readonly totalPrincipal = computed(() =>
    this.selectedMembers().reduce((sum, member) => sum + (member.principal ?? 0), 0),
  );
  readonly canSubmit = computed(
    () =>
      this.selectedMembers().length > 0 &&
      this.selectedMembers().every((member) => (member.principal ?? 0) > 0),
  );

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.loadProducts();
    this.loadMembers();
  }

  private loadProducts(): void {
    this.productService.getLoanproducts().subscribe({
      next: (data) => this.products.set(data ?? []),
      error: () => this.notifications.error(this.i18n.translate('GROUPS.GLIM_TEMPLATE_FAILED')),
    });
  }

  /**
   * Fetched the same way `group-view.component.ts` fetches the group — `associations=all` is
   * not in the generated client's `getGroupsGroupId`, so this goes through `HttpClient` directly.
   */
  private loadMembers(): void {
    this.httpClient
      .get<GroupDetail>(`${this.basePath}/v1/groups/${this.groupId}`, {
        params: { associations: 'all' },
      })
      .subscribe({
        next: (detail) => {
          const source = detail.activeClientMembers ?? detail.clientMembers ?? [];
          this.members.set(
            source
              .filter((member) => member.id !== undefined)
              .map((member) => ({
                id: member.id as number,
                displayName: member.displayName ?? '',
                selected: false,
                principal: null,
              })),
          );
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.notifications.error(this.i18n.translate('GROUPS.GLIM_TEMPLATE_FAILED'));
        },
      });
  }

  onProductSelected(productId: number): void {
    this.terms.productId = productId;
  }

  /**
   * Mutating `member.selected` in place would leave `selectedMembers`/`totalPrincipal`/
   * `canSubmit` — every one a `computed()` over the `members` signal — showing a stale value:
   * a signal only notifies its computeds when its own value changes identity, not when a
   * property on an object it already holds changes. Replacing the array gives it a new identity
   * without needing to rebuild each row.
   */
  onMemberSelectedChange(member: GlimMemberRow, selected: boolean): void {
    member.selected = selected;
    this.members.update((list) => [...list]);
  }

  onMemberPrincipalChange(member: GlimMemberRow, principal: number): void {
    member.principal = principal;
    this.members.update((list) => [...list]);
  }

  onSubmit(): void {
    const selected = this.selectedMembers();
    if (selected.length === 0) return;

    this.isSaving.set(true);
    const totalLoan = this.totalPrincipal();
    const submittedOn = formatDateToFineract(this.submittedOnDate());
    const expectedDisbursement = formatDateToFineract(this.expectedDisbursementDate());

    const requests: BatchRequest[] = selected.map((member, index) => ({
      requestId: index,
      method: 'POST',
      relativeUrl: 'loans',
      body: JSON.stringify({
        loanType: 'glim',
        groupId: this.groupId,
        clientId: member.id,
        principal: member.principal,
        totalLoan,
        isParentAccount: true,
        productId: this.terms.productId,
        loanTermFrequency: this.terms.loanTermFrequency,
        loanTermFrequencyType: this.terms.loanTermFrequencyType,
        numberOfRepayments: this.terms.numberOfRepayments,
        repaymentEvery: this.terms.repaymentEvery,
        repaymentFrequencyType: this.terms.repaymentFrequencyType,
        interestRatePerPeriod: this.terms.interestRatePerPeriod,
        interestType: this.terms.interestType,
        amortizationType: this.terms.amortizationType,
        interestCalculationPeriodType: this.terms.interestCalculationPeriodType,
        submittedOnDate: submittedOn,
        expectedDisbursementDate: expectedDisbursement,
        dateFormat: FINERACT_DATE_FORMAT,
        locale: FINERACT_LOCALE,
      }),
    }));

    this.batchService.postBatches(requests, true).subscribe({
      next: (responses) => {
        this.isSaving.set(false);
        const hasFailure = responses.some((response) => (response.statusCode ?? 500) >= 300);
        if (hasFailure) {
          this.notifications.error(this.i18n.translate('GROUPS.GLIM_CREATE_FAILED'));
          return;
        }
        const parentBody = responses[0]?.body ? JSON.parse(responses[0].body) : {};
        this.notifications.success(this.i18n.translate('GROUPS.GLIM_CREATED'));
        if (parentBody.glimId) {
          this.router.navigate(['/groups', this.groupId, 'glim', 'view', parentBody.glimId]);
        } else {
          this.router.navigate(['/groups/view', this.groupId]);
        }
      },
      error: () => {
        this.isSaving.set(false);
        this.notifications.error(this.i18n.translate('GROUPS.GLIM_CREATE_FAILED'));
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/groups/view', this.groupId]);
  }
}
