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

import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  viewChildren,
} from '@angular/core';
import { PlatformDateService } from '../../../core/services/platform-date.service';
import { ActivatedRoute, Router } from '@angular/router';
import { I18N, TranslatePipe } from '../../../core/adapters';
import { DecimalPipe } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonDatetime,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { RequiresPermissionDirective } from '../../../shared/directives/requires-permission.directive';
import { DeferredDatetimeButtonComponent } from '../../../ui/deferred-datetime-button/deferred-datetime-button.component';
import { EntityDatatablesComponent } from '../../../shared/components/entity-datatables/entity-datatables.component';
import { DialogService } from '../../../core/services/dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
  formatDateToFineract,
} from '../../../core/utils/date-formatter';
import {
  WorkingCapitalLoansService,
  WorkingCapitalLoanChargesService,
  WorkingCapitalLoanTransactionsService,
  WorkingCapitalLoanDelinquencyActionsService,
  WorkingCapitalLoanDelinquencyRangeScheduleService,
  WorkingCapitalLoanBreachScheduleService,
  WorkingCapitalLoanBreachActionsService,
  WorkingCapitalLoanNearBreachActionsService,
  WorkingCapitalLoanOriginatorsService,
  LoanOriginatorsService,
  GetWorkingCapitalLoansLoanIdResponse,
  WorkingCapitalLoanChargeData,
  GetWorkingCapitalLoanTransactionIdResponse,
  WorkingCapitalLoanDelinquencyActionData,
  WorkingCapitalLoanDelinquencyRangeScheduleData,
  WorkingCapitalLoanBreachScheduleData,
  WorkingCapitalLoanBreachActionData,
  WorkingCapitalLoanNearBreachActionData,
  LoanOriginatorData,
  WorkingCapitalLoanPeriodPaymentRateChangeData,
  ProjectedAmortizationScheduleData,
  GetWorkingCapitalLoanDelinquencyRangeScheduleTagHistoryResponse,
  LoanTransactionEnumData,
} from '../../../api';

/**
 * Detail view for a single Working Capital Loan. Shows a Details key/value summary plus tabs for
 * charges, transactions, delinquency range schedule and breach schedule (read-only, each backed
 * by its own GET), and delinquency actions, breach actions, near-breach actions and originators
 * (read/write).
 */
/**
 * The tabs on this screen, named.
 *
 * They were positional strings — '0', '7' — which say nothing at the point of use and shift
 * meaning whenever a tab is inserted in the middle. The values are still strings because
 * `ion-segment` compares them as such.
 */
export const WC_LOAN_TAB = {
  details: 'details',
  charges: 'charges',
  transactions: 'transactions',
  delinquencyActions: 'delinquencyActions',
  delinquencyRangeSchedule: 'delinquencyRangeSchedule',
  breachSchedule: 'breachSchedule',
  breachActions: 'breachActions',
  nearBreachActions: 'nearBreachActions',
  originators: 'originators',
  rateChanges: 'rateChanges',
  amortizationSchedule: 'amortizationSchedule',
  delinquencyRangeTags: 'delinquencyRangeTags',
  customFields: 'customFields',
} as const;

export type WcLoanTab = (typeof WC_LOAN_TAB)[keyof typeof WC_LOAN_TAB];

/**
 * The transaction types Fineract will undo, by the flag its type enum carries.
 *
 * `WorkingCapitalLoanWritePlatformServiceImpl` switches on the type and accepts `WAIVE_CHARGES`,
 * `REPAYMENT`, `GOODWILL_CREDIT`, `CHARGE_ADJUSTMENT` and `PAYOUT_REFUND`; anything else answers
 * `validation.msg.wc.loan.transaction.undo.not.supported`. Measured as well as read: on a live
 * loan, undo of the disbursement answers "Undo is not supported for transaction type
 * DISBURSEMENT", and of a repayment and of a charge adjustment it succeeds.
 *
 * Offering an action the platform refuses is the failure this prevents. A reversal is not
 * something to try twice, and the user cannot tell a refusal of principle from a transient fault.
 */
const UNDOABLE_TYPE_FLAGS = [
  'repayment',
  'goodwillCredit',
  'chargeAdjustment',
  'payoutRefund',
  'waiveCharges',
] as const satisfies readonly (keyof LoanTransactionEnumData)[];

/**
 * The types it will adjust: the same list without the waiver.
 *
 * A waiver has no amount of its own to re-state — it is undone, not corrected — and the
 * platform's `adjust` switch leaves it out for that reason.
 */
const ADJUSTABLE_TYPE_FLAGS = [
  'repayment',
  'goodwillCredit',
  'chargeAdjustment',
  'payoutRefund',
] as const satisfies readonly (keyof LoanTransactionEnumData)[];

/**
 * A discount fee, which `discountFeeAdjustment` corrects rather than `adjust`.
 *
 * The type carries no boolean flag of its own — `LoanTransactionEnumData` has one per type and
 * none for this one — so the code is the only thing to recognise it by. Measured: posting
 * `command=discountFee` yields `{"id": 44, "code": "loanTransactionType.discountFee"}`, `adjust`
 * on it is refused, and `discountFeeAdjustment` succeeds.
 */
const DISCOUNT_FEE_TYPE_CODE = 'loanTransactionType.discountFee';

/** Which correction form is open on the transaction panel, and so which command it will send. */
export type WcTransactionCorrection = 'adjust' | 'discountFeeAdjustment';

@Component({
  selector: 'app-wc-loan-view',
  standalone: true,
  imports: [
    TranslatePipe,
    FormsModule,
    CdkTableModule,
    DecimalPipe,
    IonIcon,
    IonButton,
    IonCardContent,
    IonCard,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonSpinner,
    IonDatetime,
    IonModal,
    DeferredDatetimeButtonComponent,
    EntityDatatablesComponent,
    IonLabel,
    IonPopover,
    IonList,
    IonItem,
    TooltipDirective,
    RequiresPermissionDirective,
  ],
  template: `
    <div class="view-container">
      <ion-card class="header-card">
        <ion-card-content class="header-content">
          <div class="loan-title-area">
            <div class="avatar-circle">
              <ion-icon name="business-outline"></ion-icon>
            </div>
            <div class="title-details">
              <h2>#{{ loan()?.accountNo || loanId }}</h2>
              <div class="subtitle-row">
                <span
                  >{{ 'WC_LOANS.CLIENT' | appTranslate }}: {{ loan()?.client?.displayName }}</span
                >
                <span class="divider">|</span>
                <span>{{ loan()?.status?.value }}</span>
              </div>
            </div>
          </div>
          <div class="actions-area">
            <ion-button fill="clear" (click)="onBack()">
              <ion-icon name="arrow-back-outline"></ion-icon>
              {{ 'COMMON.BACK' | appTranslate }}
            </ion-button>

            @if (isLoanActive) {
              <ion-button
                color="primary"
                (click)="onRepayment()"
                appRequiresPermission="REPAYMENT_WORKINGCAPITALLOAN"
                [appTooltip]="'WC_LOANS.REPAYMENT' | appTranslate"
              >
                <ion-icon name="cash-outline"></ion-icon>
                {{ 'WC_LOANS.REPAYMENT' | appTranslate }}
              </ion-button>
            }

            @if (isLoanPendingApproval) {
              <ion-button
                color="secondary"
                (click)="onAction('approve')"
                appRequiresPermission="APPROVE_WORKINGCAPITALLOAN"
                [appTooltip]="'WC_LOANS.APPROVE' | appTranslate"
              >
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                {{ 'WC_LOANS.APPROVE' | appTranslate }}
              </ion-button>
            }

            @if (isLoanApproved) {
              <ion-button
                color="secondary"
                (click)="onAction('disburse')"
                appRequiresPermission="DISBURSE_WORKINGCAPITALLOAN"
                [appTooltip]="'WC_LOANS.DISBURSE' | appTranslate"
              >
                <ion-icon name="open-outline"></ion-icon>
                {{ 'WC_LOANS.DISBURSE' | appTranslate }}
              </ion-button>
            }

            <ion-button id="loanMenu-trigger">
              <ion-icon name="caret-down-outline"></ion-icon>
              {{ 'COMMON.ACTIONS' | appTranslate }}
            </ion-button>
            <ion-popover trigger="loanMenu-trigger" [dismissOnSelect]="true">
              <ng-template>
                <ion-list>
                  @if (isLoanPendingApproval) {
                    <ion-item
                      button
                      (click)="onEdit()"
                      appRequiresPermission="UPDATE_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="create-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.MODIFY' | appTranslate }}</ion-label>
                    </ion-item>
                    <ion-item
                      button
                      (click)="onAction('reject')"
                      appRequiresPermission="REJECT_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="close-circle-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.REJECT' | appTranslate }}</ion-label>
                    </ion-item>
                  }
                  @if (isLoanApproved) {
                    <ion-item
                      button
                      (click)="onAction('undoapproval')"
                      appRequiresPermission="APPROVALUNDO_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="arrow-undo-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.UNDO_APPROVAL' | appTranslate }}</ion-label>
                    </ion-item>
                  }
                  @if (isLoanActive) {
                    <ion-item
                      button
                      (click)="onAction('undodisbursal')"
                      appRequiresPermission="DISBURSALUNDO_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="arrow-undo-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.UNDO_DISBURSAL' | appTranslate }}</ion-label>
                    </ion-item>
                    <ion-item
                      button
                      (click)="onAction('markasfraud')"
                      appRequiresPermission="SETFRAUD_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="alert-circle-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.MARK_AS_FRAUD' | appTranslate }}</ion-label>
                    </ion-item>
                    <ion-item
                      button
                      (click)="onAction('discount')"
                      appRequiresPermission="UPDATEDISCOUNT_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="pricetag-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.APPLY_DISCOUNT' | appTranslate }}</ion-label>
                    </ion-item>
                    @if (canPostDiscountFee) {
                      <ion-item
                        button
                        (click)="onAction('discountFee')"
                        appRequiresPermission="DISCOUNTFEE_WORKINGCAPITALLOAN"
                      >
                        <ion-icon slot="start" name="receipt-outline"></ion-icon>
                        <ion-label>{{ 'WC_LOANS.ACTIONS.DISCOUNT_FEE' | appTranslate }}</ion-label>
                      </ion-item>
                    }
                    <ion-item
                      button
                      (click)="onAction('paymentrate')"
                      appRequiresPermission="UPDATERATE_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="trending-up-outline"></ion-icon>
                      <ion-label>{{
                        'WC_LOANS.ACTIONS.CHANGE_PAYMENT_RATE' | appTranslate
                      }}</ion-label>
                    </ion-item>
                    <ion-item
                      button
                      (click)="onAction('prepay')"
                      appRequiresPermission="REPAYMENT_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="flash-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.PREPAY' | appTranslate }}</ion-label>
                    </ion-item>
                  }
                  @if (acceptsCredits) {
                    <ion-item
                      button
                      (click)="onAction('goodwillCredit')"
                      appRequiresPermission="GOODWILLCREDIT_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="gift-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.GOODWILL_CREDIT' | appTranslate }}</ion-label>
                    </ion-item>
                    <ion-item
                      button
                      (click)="onAction('payoutRefund')"
                      appRequiresPermission="PAYOUTREFUND_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="return-down-back-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.PAYOUT_REFUND' | appTranslate }}</ion-label>
                    </ion-item>
                  }
                  @if (hasCreditBalance) {
                    <ion-item
                      button
                      (click)="onAction('creditBalanceRefund')"
                      appRequiresPermission="CREDITBALANCEREFUND_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="wallet-outline"></ion-icon>
                      <ion-label>{{
                        'WC_LOANS.ACTIONS.CREDIT_BALANCE_REFUND' | appTranslate
                      }}</ion-label>
                    </ion-item>
                  }
                  @if (isLoanActive && !isLoanChargedOff) {
                    <ion-item
                      button
                      (click)="onAction('chargeOff')"
                      appRequiresPermission="CHARGEOFF_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="remove-circle-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.CHARGE_OFF' | appTranslate }}</ion-label>
                    </ion-item>
                  }
                  @if (isLoanChargedOff) {
                    <ion-item
                      button
                      (click)="onAction('undoChargeOff')"
                      appRequiresPermission="UNDOCHARGEOFF_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="arrow-undo-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.UNDO_CHARGE_OFF' | appTranslate }}</ion-label>
                    </ion-item>
                  }
                  @if (isLoanActive) {
                    <ion-item
                      button
                      (click)="onAction('writeOff')"
                      appRequiresPermission="WRITEOFF_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="trending-down-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.WRITE_OFF' | appTranslate }}</ion-label>
                    </ion-item>
                  }
                  @if (canUndoWriteOff) {
                    <ion-item
                      button
                      (click)="onAction('undoWriteOff')"
                      appRequiresPermission="UNDOWRITEOFF_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="arrow-undo-outline"></ion-icon>
                      <ion-label>{{ 'WC_LOANS.ACTIONS.UNDO_WRITE_OFF' | appTranslate }}</ion-label>
                    </ion-item>
                  }
                  @if (canRecordRecovery) {
                    <ion-item
                      button
                      (click)="onAction('recoveryPayment')"
                      appRequiresPermission="RECOVERYPAYMENT_WORKINGCAPITALLOAN"
                    >
                      <ion-icon slot="start" name="cash-outline"></ion-icon>
                      <ion-label>{{
                        'WC_LOANS.ACTIONS.RECOVERY_PAYMENT' | appTranslate
                      }}</ion-label>
                    </ion-item>
                  }
                  <ion-item
                    button
                    (click)="onDelete()"
                    appRequiresPermission="DELETE_WORKINGCAPITALLOAN"
                  >
                    <ion-icon slot="start" name="trash-outline"></ion-icon>
                    <ion-label>{{ 'WC_LOANS.ACTIONS.DELETE' | appTranslate }}</ion-label>
                  </ion-item>
                </ion-list>
              </ng-template>
            </ion-popover>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-segment [value]="activeTab()" (ionChange)="activeTab.set($any($event).detail.value)">
        <ion-segment-button [value]="TAB.details">
          <ion-label>{{ 'WC_LOANS.TABS.DETAILS' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.charges">
          <ion-label>{{ 'WC_LOANS.TABS.CHARGES' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.transactions">
          <ion-label>{{ 'WC_LOANS.TABS.TRANSACTIONS' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.delinquencyActions">
          <ion-label>{{ 'WC_LOANS.TABS.DELINQUENCY_ACTIONS' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.delinquencyRangeSchedule">
          <ion-label>{{ 'WC_LOANS.TABS.DELINQUENCY_RANGE_SCHEDULE' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.breachSchedule">
          <ion-label>{{ 'WC_LOANS.TABS.BREACH_SCHEDULE' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.breachActions">
          <ion-label>{{ 'WC_LOANS.TABS.BREACH_ACTIONS' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.nearBreachActions">
          <ion-label>{{ 'WC_LOANS.TABS.NEAR_BREACH_ACTIONS' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.originators">
          <ion-label>{{ 'WC_LOANS.TABS.ORIGINATORS' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.rateChanges">
          <ion-label>{{ 'WC_LOANS.TABS.RATE_CHANGES' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.amortizationSchedule">
          <ion-label>{{ 'WC_LOANS.TABS.AMORTIZATION_SCHEDULE' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.delinquencyRangeTags">
          <ion-label>{{ 'WC_LOANS.TABS.DELINQUENCY_RANGE_TAGS' | appTranslate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button [value]="TAB.customFields">
          <ion-label>{{ 'SYSTEM.CUSTOM_FIELDS' | appTranslate }}</ion-label>
        </ion-segment-button>
      </ion-segment>

      @if (activeTab() === TAB.details) {
        <div class="tab-content">
          <ion-card class="info-card">
            <ion-card-content class="details-list">
              <div class="detail-item">
                <span class="label">{{ 'WC_LOANS.ACCOUNT_NO' | appTranslate }}</span>
                <span class="value">{{ loan()?.accountNo || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ 'WC_LOANS.CLIENT' | appTranslate }}</span>
                <span class="value">{{ loan()?.client?.displayName || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ 'WC_LOANS.PRODUCT' | appTranslate }}</span>
                <span class="value">{{ loan()?.product?.name || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ 'WC_LOANS.PRINCIPAL' | appTranslate }}</span>
                <span class="value">
                  {{ loan()?.currency?.displaySymbol }}
                  {{ loan()?.proposedPrincipal ?? loan()?.approvedPrincipal | number: '1.2-2' }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">{{ 'WC_LOANS.STATUS' | appTranslate }}</span>
                <span class="value">{{ loan()?.status?.value || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ 'WC_LOANS.REPAYMENT_EVERY' | appTranslate }}</span>
                <span class="value">
                  {{ loan()?.repaymentEvery || '-' }}
                  {{ loan()?.repaymentFrequencyType?.value }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">{{ 'WC_LOANS.BREACH' | appTranslate }}</span>
                <span class="value">{{ loan()?.breach?.name || '-' }}</span>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.charges) {
        <div class="tab-content">
          @if (selectedCharge(); as charge) {
            <ion-card class="detail-card" data-testid="wc-charge-detail">
              <ion-card-content>
                <div class="detail-header">
                  <h3>
                    {{ charge.name }}
                    <span class="detail-type">{{ charge.chargeTimeType?.value }}</span>
                  </h3>
                  <ion-button
                    fill="clear"
                    [attr.aria-label]="'COMMON.CLOSE' | appTranslate"
                    (click)="onCloseCharge()"
                  >
                    <ion-icon name="close-outline"></ion-icon>
                  </ion-button>
                </div>

                <div class="details-list">
                  <div class="detail-item">
                    <span class="label">{{ 'COMMON.AMOUNT' | appTranslate }}</span>
                    <span class="value">{{ charge.amount | number: '1.2-2' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{ 'WC_LOANS.PAID' | appTranslate }}</span>
                    <span class="value">{{ charge.amountPaid | number: '1.2-2' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{ 'WC_LOANS.CHARGE.WAIVED' | appTranslate }}</span>
                    <span class="value">{{ charge.amountWaived | number: '1.2-2' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{ 'WC_LOANS.OUTSTANDING' | appTranslate }}</span>
                    <span class="value" data-testid="wc-charge-outstanding">
                      {{ charge.amountOutstanding | number: '1.2-2' }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{ 'WC_LOANS.CHARGE.DUE_DATE' | appTranslate }}</span>
                    <span class="value">{{ formatDate(charge.dueDate) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{
                      'WC_LOANS.CHARGE.CALCULATION_TYPE' | appTranslate
                    }}</span>
                    <span class="value">{{ charge.chargeCalculationType?.value || '-' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{ 'WC_LOANS.CHARGE.PENALTY' | appTranslate }}</span>
                    <span class="value">
                      {{ (charge.penalty ? 'COMMON.YES' : 'COMMON.NO') | appTranslate }}
                    </span>
                  </div>
                </div>

                @if (isAdjustingCharge()) {
                  <form class="correction-form" (ngSubmit)="onSaveChargeAdjustment()">
                    <ion-item fill="outline">
                      <ion-label position="stacked">{{
                        'WC_LOANS.CHARGE.ADJUSTED_AMOUNT' | appTranslate
                      }}</ion-label>
                      <ion-input
                        [attr.aria-label]="'WC_LOANS.CHARGE.ADJUSTED_AMOUNT' | appTranslate"
                        data-testid="wc-charge-adjust-amount"
                        type="number"
                        name="chargeAdjustmentAmount"
                        [ngModel]="chargeAdjustmentAmount()"
                        (ngModelChange)="chargeAdjustmentAmount.set($event)"
                        required
                      ></ion-input>
                    </ion-item>
                    <div class="correction-actions">
                      <ion-button
                        fill="clear"
                        color="medium"
                        type="button"
                        (click)="isAdjustingCharge.set(false)"
                        [disabled]="isCorrecting()"
                      >
                        {{ 'COMMON.CANCEL' | appTranslate }}
                      </ion-button>
                      <ion-button
                        type="submit"
                        data-testid="wc-charge-adjust-submit"
                        [disabled]="isCorrecting() || !chargeAdjustmentAmount()"
                      >
                        @if (isCorrecting()) {
                          <ion-spinner name="crescent"></ion-spinner>
                          {{ 'COMMON.SAVING' | appTranslate }}
                        } @else {
                          {{ 'COMMON.SUBMIT' | appTranslate }}
                        }
                      </ion-button>
                    </div>
                  </form>
                } @else {
                  <div class="detail-actions">
                    @if (!charge.paid) {
                      <ion-button
                        fill="outline"
                        data-testid="wc-charge-adjust"
                        appRequiresPermission="ADJUSTMENT_WORKINGCAPITALLOANCHARGE"
                        (click)="onOpenChargeAdjustment()"
                      >
                        <ion-icon name="create-outline"></ion-icon>
                        {{ 'WC_LOANS.CHARGE.ADJUST' | appTranslate }}
                      </ion-button>
                    }
                  </div>
                }
              </ion-card-content>
            </ion-card>
          }
          <div class="tab-toolbar">
            <ion-button
              color="primary"
              (click)="onAddCharge()"
              appRequiresPermission="CREATE_WORKINGCAPITALLOANCHARGE"
              [disabled]="!loan()"
            >
              <ion-icon name="add-outline"></ion-icon>
              {{ 'WC_LOANS.CHARGE.ADD' | appTranslate }}
            </ion-button>
          </div>
          <ion-card class="table-card">
            <ion-card-content>
              @if (charges().length > 0) {
                <table cdk-table [dataSource]="charges()" class="full-width-table">
                  <ng-container cdkColumnDef="name">
                    <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.NAME' | appTranslate }}</th>
                    <td cdk-cell *cdkCellDef="let c">{{ c.name }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="amount">
                    <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.AMOUNT' | appTranslate }}</th>
                    <td cdk-cell *cdkCellDef="let c">{{ c.amount | number: '1.2-2' }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="paid">
                    <th cdk-header-cell *cdkHeaderCellDef>{{ 'WC_LOANS.PAID' | appTranslate }}</th>
                    <td cdk-cell *cdkCellDef="let c">{{ c.amountPaid | number: '1.2-2' }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="outstanding">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.OUTSTANDING' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let c">
                      {{ c.amountOutstanding | number: '1.2-2' }}
                    </td>
                  </ng-container>
                  <ng-container cdkColumnDef="actions">
                    <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.ACTIONS' | appTranslate }}</th>
                    <td cdk-cell *cdkCellDef="let c">
                      <ion-button
                        fill="clear"
                        data-testid="wc-charge-view"
                        [attr.aria-label]="'COMMON.VIEW' | appTranslate"
                        [appTooltip]="'COMMON.VIEW' | appTranslate"
                        (click)="onViewCharge(c)"
                      >
                        <ion-icon name="eye-outline"></ion-icon>
                      </ion-button>
                      @if (!c.paid) {
                        <ion-button
                          fill="clear"
                          color="danger"
                          [attr.aria-label]="'WC_LOANS.CHARGE.WAIVE' | appTranslate"
                          [appTooltip]="'WC_LOANS.CHARGE.WAIVE' | appTranslate"
                          appRequiresPermission="WAIVE_WORKINGCAPITALLOANCHARGE"
                          (click)="onWaiveCharge(c)"
                        >
                          {{ 'WC_LOANS.CHARGE.WAIVE' | appTranslate }}
                        </ion-button>
                      }
                    </td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="chargeColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: chargeColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="cash-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.transactions) {
        <div class="tab-content">
          @if (selectedTransaction(); as tx) {
            <ion-card class="detail-card" data-testid="wc-transaction-detail">
              <ion-card-content>
                <div class="detail-header">
                  <h3>
                    {{ 'WC_LOANS.TRANSACTION.TITLE' | appTranslate }} #{{ tx.id }}
                    <span class="detail-type">{{ tx.type?.value }}</span>
                  </h3>
                  <ion-button
                    fill="clear"
                    [attr.aria-label]="'COMMON.CLOSE' | appTranslate"
                    (click)="onCloseTransaction()"
                  >
                    <ion-icon name="close-outline"></ion-icon>
                  </ion-button>
                </div>

                @if (tx.reversed) {
                  <p class="reversed-banner" data-testid="wc-transaction-reversed-on">
                    <ion-icon name="alert-circle-outline"></ion-icon>
                    {{ 'WC_LOANS.TRANSACTION.REVERSED_ON' | appTranslate }}
                    {{ formatDate(tx.reversedOnDate) }}
                  </p>
                }

                <div class="details-list">
                  <div class="detail-item">
                    <span class="label">{{ 'COMMON.DATE' | appTranslate }}</span>
                    <span class="value">{{ formatDate(tx.transactionDate) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{ 'WC_LOANS.SUBMITTED_ON_DATE' | appTranslate }}</span>
                    <span class="value">{{ formatDate(tx.submittedOnDate) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{ 'COMMON.AMOUNT' | appTranslate }}</span>
                    <span class="value">{{ tx.transactionAmount | number: '1.2-2' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{
                      'WC_LOANS.TRANSACTION.PRINCIPAL_PORTION' | appTranslate
                    }}</span>
                    <span class="value">{{ tx.principalPortion | number: '1.2-2' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{
                      'WC_LOANS.TRANSACTION.FEE_PORTION' | appTranslate
                    }}</span>
                    <span class="value">{{ tx.feeChargesPortion | number: '1.2-2' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{
                      'WC_LOANS.TRANSACTION.PENALTY_PORTION' | appTranslate
                    }}</span>
                    <span class="value">{{ tx.penaltyChargesPortion | number: '1.2-2' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{
                      'WC_LOANS.TRANSACTION.OVERPAYMENT_PORTION' | appTranslate
                    }}</span>
                    <span class="value">{{ tx.overpaymentPortion | number: '1.2-2' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">{{ 'WC_LOANS.EXTERNAL_ID' | appTranslate }}</span>
                    <span class="value">{{ tx.externalId || '-' }}</span>
                  </div>
                </div>

                @if (correction()) {
                  <form class="correction-form" (ngSubmit)="onSaveCorrection()">
                    <ion-item fill="outline">
                      <ion-label position="stacked">{{
                        'WC_LOANS.ACTIONS.TRANSACTION_AMOUNT' | appTranslate
                      }}</ion-label>
                      <ion-input
                        [attr.aria-label]="'WC_LOANS.ACTIONS.TRANSACTION_AMOUNT' | appTranslate"
                        data-testid="wc-transaction-correction-amount"
                        type="number"
                        name="correctionAmount"
                        [ngModel]="correctionAmount()"
                        (ngModelChange)="correctionAmount.set($event)"
                        required
                      ></ion-input>
                    </ion-item>
                    <ion-item fill="outline">
                      <ion-label position="stacked">{{
                        'WC_LOANS.ACTIONS.TRANSACTION_DATE' | appTranslate
                      }}</ion-label>
                      <app-deferred-datetime-button datetimeId="wc-correction-date-picker" />
                      <ion-modal [keepContentsMounted]="true">
                        <ng-template>
                          <ion-datetime
                            id="wc-correction-date-picker"
                            data-testid="wc-correction-date-picker"
                            presentation="date"
                            name="correctionDate"
                            [(ngModel)]="correctionDate"
                          ></ion-datetime>
                        </ng-template>
                      </ion-modal>
                    </ion-item>
                    <div class="correction-actions">
                      <ion-button
                        fill="clear"
                        color="medium"
                        type="button"
                        (click)="correction.set(null)"
                        [disabled]="isCorrecting()"
                      >
                        {{ 'COMMON.CANCEL' | appTranslate }}
                      </ion-button>
                      <ion-button
                        type="submit"
                        data-testid="wc-transaction-correction-submit"
                        [disabled]="isCorrecting() || !correctionAmount()"
                      >
                        @if (isCorrecting()) {
                          <ion-spinner name="crescent"></ion-spinner>
                          {{ 'COMMON.SAVING' | appTranslate }}
                        } @else {
                          {{ 'COMMON.SUBMIT' | appTranslate }}
                        }
                      </ion-button>
                    </div>
                  </form>
                } @else {
                  <div class="detail-actions">
                    @if (canUndoTransaction()) {
                      <ion-button
                        color="danger"
                        data-testid="wc-transaction-undo"
                        appRequiresPermission="UNDO_WORKINGCAPITALLOANTRANSACTION"
                        [disabled]="isCorrecting()"
                        (click)="onUndoTransaction()"
                      >
                        <ion-icon name="arrow-undo-outline"></ion-icon>
                        {{ 'WC_LOANS.TRANSACTION.UNDO' | appTranslate }}
                      </ion-button>
                    }
                    @if (canAdjustTransaction()) {
                      <ion-button
                        fill="outline"
                        data-testid="wc-transaction-adjust"
                        appRequiresPermission="ADJUST_WORKINGCAPITALLOANTRANSACTION"
                        (click)="onOpenCorrection('adjust')"
                      >
                        <ion-icon name="create-outline"></ion-icon>
                        {{ 'WC_LOANS.TRANSACTION.ADJUST' | appTranslate }}
                      </ion-button>
                    }
                    @if (canAdjustDiscountFee()) {
                      <ion-button
                        fill="outline"
                        data-testid="wc-transaction-adjust-discount-fee"
                        appRequiresPermission="DISCOUNTFEEADJUSTMENT_WORKINGCAPITALLOAN"
                        (click)="onOpenCorrection('discountFeeAdjustment')"
                      >
                        <ion-icon name="pricetag-outline"></ion-icon>
                        {{ 'WC_LOANS.TRANSACTION.ADJUST_DISCOUNT_FEE' | appTranslate }}
                      </ion-button>
                    }
                  </div>
                }
              </ion-card-content>
            </ion-card>
          }
          <ion-card class="table-card">
            <ion-card-content>
              @if (transactions().length > 0) {
                <table cdk-table [dataSource]="transactions()" class="full-width-table">
                  <ng-container cdkColumnDef="id">
                    <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.ID' | appTranslate }}</th>
                    <td cdk-cell *cdkCellDef="let tx">{{ tx.id }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="date">
                    <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.DATE' | appTranslate }}</th>
                    <td cdk-cell *cdkCellDef="let tx">{{ tx.transactionDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="type">
                    <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.TYPE' | appTranslate }}</th>
                    <td cdk-cell *cdkCellDef="let tx">{{ tx.type?.value }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="amount">
                    <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.AMOUNT' | appTranslate }}</th>
                    <td cdk-cell *cdkCellDef="let tx">
                      <span [class.reversed-amount]="tx.reversed">
                        {{ tx.transactionAmount | number: '1.2-2' }}
                      </span>
                      <!--
                        Strike-through is the convention on the loan screen, and on its own it is
                        invisible to a screen reader: the amount simply reads as the amount it no
                        longer is. The marker says so in words.
                      -->
                      @if (tx.reversed) {
                        <span class="sr-only">{{
                          'WC_LOANS.TRANSACTION.REVERSED' | appTranslate
                        }}</span>
                      }
                    </td>
                  </ng-container>
                  <ng-container cdkColumnDef="txActions">
                    <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.ACTIONS' | appTranslate }}</th>
                    <td cdk-cell *cdkCellDef="let tx">
                      <ion-button
                        fill="clear"
                        data-testid="wc-transaction-view"
                        [attr.aria-label]="'COMMON.VIEW' | appTranslate"
                        [appTooltip]="'COMMON.VIEW' | appTranslate"
                        (click)="onViewTransaction(tx)"
                      >
                        <ion-icon name="eye-outline"></ion-icon>
                      </ion-button>
                    </td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="transactionColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: transactionColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="receipt-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.delinquencyActions) {
        <div class="tab-content">
          <div class="tab-toolbar">
            <ion-button
              color="primary"
              (click)="onNewDelinquencyAction()"
              appRequiresPermission="CREATE_WC_DELINQUENCY_ACTION"
              [disabled]="!loan()"
            >
              <ion-icon name="add-outline"></ion-icon>
              {{ 'WC_LOANS.DELINQUENCY_ACTION.NEW' | appTranslate }}
            </ion-button>
          </div>
          <ion-card class="table-card">
            <ion-card-content>
              @if (delinquencyActions().length > 0) {
                <table cdk-table [dataSource]="delinquencyActions()" class="full-width-table">
                  <ng-container cdkColumnDef="action">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.ACTION' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.action }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="startDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.START_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.startDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="endDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.END_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.endDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="frequency">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.DELINQUENCY_ACTION.FREQUENCY' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">
                      {{ a.frequency ? a.frequency + ' ' + a.frequencyType : '-' }}
                    </td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="delinquencyActionColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: delinquencyActionColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="hammer-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.delinquencyRangeSchedule) {
        <div class="tab-content">
          <ion-card class="table-card">
            <ion-card-content>
              @if (delinquencyRangeSchedule().length > 0) {
                <table cdk-table [dataSource]="delinquencyRangeSchedule()" class="full-width-table">
                  <ng-container cdkColumnDef="periodNumber">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.PERIOD' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let r">{{ r.periodNumber }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="fromDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.FROM_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let r">{{ r.fromDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="toDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.TO_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let r">{{ r.toDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="outstanding">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.OUTSTANDING' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let r">
                      {{ r.outstandingAmount | number: '1.2-2' }}
                    </td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="delinquencyRangeColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: delinquencyRangeColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="time-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.breachSchedule) {
        <div class="tab-content">
          <ion-card class="table-card">
            <ion-card-content>
              @if (breachSchedule().length > 0) {
                <table cdk-table [dataSource]="breachSchedule()" class="full-width-table">
                  <ng-container cdkColumnDef="periodNumber">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.PERIOD' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let b">{{ b.periodNumber }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="fromDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.FROM_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let b">{{ b.fromDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="toDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.TO_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let b">{{ b.toDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="breach">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.BREACH' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let b">
                      {{ (b.breach ? 'COMMON.YES' : 'COMMON.NO') | appTranslate }}
                    </td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="breachScheduleColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: breachScheduleColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="warning-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.breachActions) {
        <div class="tab-content">
          <div class="tab-toolbar">
            <ion-button
              color="primary"
              (click)="onNewBreachAction()"
              appRequiresPermission="CREATE_WC_BREACH_ACTION"
              [disabled]="!loan()"
            >
              <ion-icon name="add-outline"></ion-icon>
              {{ 'WC_LOANS.BREACH_ACTION.NEW' | appTranslate }}
            </ion-button>
          </div>
          <ion-card class="table-card">
            <ion-card-content>
              @if (breachActions().length > 0) {
                <table cdk-table [dataSource]="breachActions()" class="full-width-table">
                  <ng-container cdkColumnDef="action">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.ACTION' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.action }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="startDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.START_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.startDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="endDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.END_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.endDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="frequency">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.BREACH_ACTION.FREQUENCY' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">
                      {{ a.frequency ? a.frequency + ' ' + a.frequencyType : '-' }}
                    </td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="breachActionColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: breachActionColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="hammer-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.nearBreachActions) {
        <div class="tab-content">
          <div class="tab-toolbar">
            <ion-button
              color="primary"
              (click)="onNewNearBreachAction()"
              appRequiresPermission="CREATE_WC_NEAR_BREACH_ACTION"
              [disabled]="!loan()"
            >
              <ion-icon name="add-outline"></ion-icon>
              {{ 'WC_LOANS.NEAR_BREACH_ACTION.NEW' | appTranslate }}
            </ion-button>
          </div>
          <ion-card class="table-card">
            <ion-card-content>
              @if (nearBreachActions().length > 0) {
                <table cdk-table [dataSource]="nearBreachActions()" class="full-width-table">
                  <ng-container cdkColumnDef="action">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.ACTION' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.action }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="frequency">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.NEAR_BREACH_ACTION.FREQUENCY' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.frequency }} {{ a.frequencyType }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="threshold">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.NEAR_BREACH_ACTION.THRESHOLD' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.threshold }}%</td>
                  </ng-container>
                  <ng-container cdkColumnDef="createdDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.NEAR_BREACH_ACTION.CREATED_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let a">{{ a.createdDate }}</td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="nearBreachActionColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: nearBreachActionColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="warning-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.originators) {
        <div class="tab-content">
          <div class="tab-toolbar">
            <ion-item fill="outline" class="attach-select">
              <ion-label position="stacked">{{
                'WC_LOANS.ORIGINATORS.SELECT_ORIGINATOR' | appTranslate
              }}</ion-label>
              <ion-select
                [attr.aria-label]="'WC_LOANS.ORIGINATORS.SELECT_ORIGINATOR' | appTranslate"
                interface="popover"
                [ngModel]="originatorToAttach()"
                (ngModelChange)="originatorToAttach.set($event)"
              >
                @for (opt of attachableOriginators(); track opt.id) {
                  <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                }
              </ion-select>
            </ion-item>
            <ion-button
              color="primary"
              appRequiresPermission="ATTACH_WORKING_CAPITAL_LOAN_ORIGINATOR"
              (click)="onAttachOriginator()"
              [disabled]="!originatorToAttach()"
            >
              <ion-icon name="link-outline"></ion-icon>
              {{ 'WC_LOANS.ORIGINATORS.ATTACH' | appTranslate }}
            </ion-button>
          </div>
          <ion-card class="table-card">
            <ion-card-content>
              @if (originators().length > 0) {
                <table cdk-table [dataSource]="originators()" class="full-width-table">
                  <ng-container cdkColumnDef="name">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.ORIGINATORS.NAME' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let o">{{ o.name }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="type">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.ORIGINATORS.TYPE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let o">{{ o.originatorType?.name }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="channel">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.ORIGINATORS.CHANNEL' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let o">{{ o.channelType?.name }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="status">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.ORIGINATORS.STATUS' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let o">{{ o.status }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="actions">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'COMMON.ACTIONS' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let o">
                      <ion-button
                        fill="clear"
                        color="danger"
                        [attr.aria-label]="'WC_LOANS.ORIGINATORS.DETACH' | appTranslate"
                        [appTooltip]="'WC_LOANS.ORIGINATORS.DETACH' | appTranslate"
                        appRequiresPermission="DETACH_WORKING_CAPITAL_LOAN_ORIGINATOR"
                        (click)="onDetachOriginator(o)"
                      >
                        <ion-icon name="unlink-outline"></ion-icon>
                      </ion-button>
                    </td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="originatorColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: originatorColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="people-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.rateChanges) {
        <div class="tab-content">
          <ion-card class="table-card">
            <ion-card-content>
              @if (rateChanges().length > 0) {
                <table cdk-table [dataSource]="rateChanges()" class="full-width-table">
                  <ng-container cdkColumnDef="effectiveDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.RATE_CHANGE.EFFECTIVE_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let r">{{ r.effectiveDate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="previousRate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.RATE_CHANGE.PREVIOUS_RATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let r">{{ r.previousRate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="newRate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.RATE_CHANGE.NEW_RATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let r">{{ r.newRate }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="reversed">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.RATE_CHANGE.REVERSED' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let r">
                      {{ (r.reversed ? 'COMMON.YES' : 'COMMON.NO') | appTranslate }}
                    </td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="rateChangeColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: rateChangeColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="trending-up-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.amortizationSchedule) {
        <div class="tab-content">
          @if (amortizationSchedule(); as schedule) {
            <ion-card class="info-card">
              <ion-card-content class="details-list">
                <div class="detail-item">
                  <span class="label">{{ 'WC_LOANS.PERIOD_PAYMENT_RATE' | appTranslate }}</span>
                  <span class="value">{{ schedule.periodPaymentRate ?? '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">
                    {{ 'WC_LOANS.AMORTIZATION.NET_DISBURSEMENT_AMOUNT' | appTranslate }}
                  </span>
                  <span class="value">{{ schedule.netDisbursementAmount | number: '1.2-2' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ 'WC_LOANS.TOTAL_PAYMENT_VOLUME' | appTranslate }}</span>
                  <span class="value">{{ schedule.totalPaymentVolume | number: '1.2-2' }}</span>
                </div>
              </ion-card-content>
            </ion-card>
            <ion-card class="table-card">
              <ion-card-content>
                @if ((schedule.payments ?? []).length > 0) {
                  <table cdk-table [dataSource]="schedule.payments ?? []" class="full-width-table">
                    <ng-container cdkColumnDef="paymentNo">
                      <th cdk-header-cell *cdkHeaderCellDef>
                        {{ 'WC_LOANS.AMORTIZATION.PAYMENT_NO' | appTranslate }}
                      </th>
                      <td cdk-cell *cdkCellDef="let p">{{ p.paymentNo }}</td>
                    </ng-container>
                    <ng-container cdkColumnDef="paymentDate">
                      <th cdk-header-cell *cdkHeaderCellDef>
                        {{ 'WC_LOANS.AMORTIZATION.PAYMENT_DATE' | appTranslate }}
                      </th>
                      <td cdk-cell *cdkCellDef="let p">{{ p.paymentDate }}</td>
                    </ng-container>
                    <ng-container cdkColumnDef="expectedPaymentAmount">
                      <th cdk-header-cell *cdkHeaderCellDef>
                        {{ 'WC_LOANS.AMORTIZATION.EXPECTED_PAYMENT_AMOUNT' | appTranslate }}
                      </th>
                      <td cdk-cell *cdkCellDef="let p">
                        {{ p.expectedPaymentAmount | number: '1.2-2' }}
                      </td>
                    </ng-container>
                    <tr cdk-header-row *cdkHeaderRowDef="amortizationColumns"></tr>
                    <tr cdk-row *cdkRowDef="let row; columns: amortizationColumns"></tr>
                  </table>
                } @else {
                  <div class="empty-state">
                    <ion-icon name="calendar-outline"></ion-icon>
                    <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                  </div>
                }
              </ion-card-content>
            </ion-card>
          } @else {
            <div class="empty-state">
              <ion-icon name="calendar-outline"></ion-icon>
              <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
            </div>
          }
        </div>
      }
      @if (activeTab() === TAB.delinquencyRangeTags) {
        <div class="tab-content">
          <ion-card class="table-card">
            <ion-card-content>
              @if (delinquencyRangeTags().length > 0) {
                <table cdk-table [dataSource]="delinquencyRangeTags()" class="full-width-table">
                  <ng-container cdkColumnDef="periodNumber">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.PERIOD' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let t">{{ t.periodNumber }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="delinquencyRange">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.RANGE_TAG.DELINQUENCY_RANGE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let t">{{ t.delinquencyRange?.classification }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="delinquentDays">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.RANGE_TAG.DELINQUENT_DAYS' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let t">{{ t.delinquentDays }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="delinquentAmount">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.RANGE_TAG.DELINQUENT_AMOUNT' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let t">{{ t.delinquentAmount | number: '1.2-2' }}</td>
                  </ng-container>
                  <ng-container cdkColumnDef="addedOnDate">
                    <th cdk-header-cell *cdkHeaderCellDef>
                      {{ 'WC_LOANS.RANGE_TAG.ADDED_ON_DATE' | appTranslate }}
                    </th>
                    <td cdk-cell *cdkCellDef="let t">{{ t.addedOnDate }}</td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="rangeTagColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: rangeTagColumns"></tr>
                </table>
              } @else {
                <div class="empty-state">
                  <ion-icon name="flag-outline"></ion-icon>
                  <p>{{ 'WC_LOANS.NO_DATA' | appTranslate }}</p>
                </div>
              }
            </ion-card-content>
          </ion-card>
        </div>
      }
      @if (activeTab() === TAB.customFields) {
        <div class="tab-content">
          <!--
            The datatables an institution has attached to m_wc_loan. EntityTables declares
            WC_LOAN there, so the tables, their rows and the permissions generated for them work
            exactly as they do on a term loan (issue #776).
          -->
          <app-entity-datatables apptableName="m_wc_loan" [entityId]="loanId" />
        </div>
      }
    </div>
  `,
  styles: [
    `
      .view-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .header-card {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }
      .loan-title-area {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .avatar-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: var(--primary-color, #3f51b5);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .avatar-circle mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .title-details h2 {
        margin: 0 0 4px 0;
        font-size: 24px;
        font-weight: 600;
      }
      .subtitle-row {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-muted);
        font-size: 14px;
      }
      .divider {
        color: var(--border-color);
      }
      .tab-group {
        background-color: var(--card-bg);
        border-radius: 12px;
        box-shadow: var(--shadow-sm);
      }
      .tab-content {
        padding: 24px;
      }
      .info-card {
        border-radius: 8px;
        border: 1px solid var(--border-color);
      }
      .details-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .detail-item {
        display: flex;
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color);
      }
      .detail-item .label {
        color: var(--text-muted);
        font-size: 14px;
        font-weight: 500;
      }
      .detail-item .value {
        color: var(--text-color);
        font-size: 14px;
        font-weight: 600;
      }
      .table-card {
        border: 1px solid var(--border-color);
        box-shadow: none;
      }
      .tab-toolbar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }
      .tab-toolbar .attach-select {
        min-width: 260px;
        --min-height: 0;
      }
      .full-width-table {
        width: 100%;
      }
      .reversed-amount {
        text-decoration: line-through;
        color: var(--text-muted, #6b7280);
      }
      .detail-card {
        margin-bottom: 12px;
      }
      .detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .detail-header h3 {
        margin: 0;
        font-size: 16px;
      }
      .detail-type {
        margin-left: 8px;
        color: var(--text-muted, #6b7280);
        font-weight: 500;
      }
      .reversed-banner {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0 0 8px;
        color: var(--ion-color-danger, #c0392b);
        font-size: 14px;
      }
      .detail-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .correction-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 12px;
        max-width: 420px;
      }
      .correction-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px;
        color: var(--text-muted);
      }
      .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
      }
      .empty-state p {
        margin: 0;
        font-size: 16px;
      }
    `,
  ],
})
export class WcLoanViewComponent implements OnInit, OnDestroy {
  /** Selected tab; mat-tab-group tracked this internally, ion-segment does not. */
  /** Exposed so the template names its tabs instead of numbering them. */
  protected readonly TAB = WC_LOAN_TAB;

  private readonly popovers = viewChildren(IonPopover);

  readonly activeTab = signal<WcLoanTab>(WC_LOAN_TAB.details);
  private readonly loansService = inject(WorkingCapitalLoansService);
  private readonly chargesService = inject(WorkingCapitalLoanChargesService);
  private readonly transactionsService = inject(WorkingCapitalLoanTransactionsService);
  private readonly delinquencyActionsService = inject(WorkingCapitalLoanDelinquencyActionsService);
  private readonly delinquencyRangeScheduleService = inject(
    WorkingCapitalLoanDelinquencyRangeScheduleService,
  );
  private readonly breachScheduleService = inject(WorkingCapitalLoanBreachScheduleService);
  private readonly breachActionsService = inject(WorkingCapitalLoanBreachActionsService);
  private readonly nearBreachActionsService = inject(WorkingCapitalLoanNearBreachActionsService);
  private readonly wcOriginatorsService = inject(WorkingCapitalLoanOriginatorsService);
  private readonly originatorsService = inject(LoanOriginatorsService);
  private readonly route = inject(ActivatedRoute);
  /**
   * Today, as the platform reckons it: the business date when one governs, and the platform's
   * own clock otherwise. Fineract judges "the future" by that reckoning, so a date seeded from
   * `new Date()` is refused whenever the browser runs ahead of it (#758).
   */
  private readonly platformDate = inject(PlatformDateService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly notifications = inject(NotificationService);
  private readonly i18n = inject(I18N);

  loanId = 0;
  readonly loan = signal<GetWorkingCapitalLoansLoanIdResponse | null>(null);
  readonly charges = signal<WorkingCapitalLoanChargeData[]>([]);
  readonly transactions = signal<GetWorkingCapitalLoanTransactionIdResponse[]>([]);
  readonly delinquencyActions = signal<WorkingCapitalLoanDelinquencyActionData[]>([]);
  readonly delinquencyRangeSchedule = signal<WorkingCapitalLoanDelinquencyRangeScheduleData[]>([]);
  readonly breachSchedule = signal<WorkingCapitalLoanBreachScheduleData[]>([]);
  readonly breachActions = signal<WorkingCapitalLoanBreachActionData[]>([]);
  readonly nearBreachActions = signal<WorkingCapitalLoanNearBreachActionData[]>([]);
  readonly originators = signal<LoanOriginatorData[]>([]);
  /** The full master list, used to offer only originators not already attached to this loan. */
  private readonly allOriginators = signal<LoanOriginatorData[]>([]);
  readonly attachableOriginators = computed(() => {
    const attachedIds = new Set(this.originators().map((o) => o.id));
    return this.allOriginators().filter((o) => !attachedIds.has(o.id));
  });
  readonly originatorToAttach = signal<number | null>(null);
  readonly rateChanges = signal<WorkingCapitalLoanPeriodPaymentRateChangeData[]>([]);
  readonly amortizationSchedule = signal<ProjectedAmortizationScheduleData | null>(null);
  readonly delinquencyRangeTags = signal<
    GetWorkingCapitalLoanDelinquencyRangeScheduleTagHistoryResponse[]
  >([]);

  /**
   * The transaction opened from the table, re-read on its own.
   *
   * The list endpoint carries the allocation too, but a correction has to be followed by a fresh
   * read of *that* transaction — after an adjust the original is reversed and a replacement
   * exists — and reading one by id is also what the detail would need if this panel ever becomes
   * a route of its own.
   */
  readonly selectedTransaction = signal<GetWorkingCapitalLoanTransactionIdResponse | null>(null);
  /** Null while the panel offers its actions; a command once its form is open. */
  readonly correction = signal<WcTransactionCorrection | null>(null);
  readonly correctionAmount = signal<number | undefined>(undefined);
  /** Plain field, not a signal: this is an `[(ngModel)]` target on the date picker. */
  correctionDate: string | null = null;
  readonly isCorrecting = signal(false);

  readonly canUndoTransaction = computed(() => this.transactionIsOneOf(UNDOABLE_TYPE_FLAGS));
  readonly canAdjustTransaction = computed(() => this.transactionIsOneOf(ADJUSTABLE_TYPE_FLAGS));

  readonly canAdjustDiscountFee = computed(() => {
    const transaction = this.selectedTransaction();
    return transaction?.reversed !== true && transaction?.type?.code === DISCOUNT_FEE_TYPE_CODE;
  });

  /**
   * The charge opened from the table, re-read on its own.
   *
   * The list carries the same fields, but an adjustment changes the outstanding amount of *that*
   * charge and the panel has to show the result rather than what the list held when the tab
   * loaded.
   */
  readonly selectedCharge = signal<WorkingCapitalLoanChargeData | null>(null);
  readonly isAdjustingCharge = signal(false);
  readonly chargeAdjustmentAmount = signal<number | undefined>(undefined);

  chargeColumns = ['name', 'amount', 'paid', 'outstanding', 'actions'];
  transactionColumns = ['id', 'date', 'type', 'amount', 'txActions'];
  delinquencyActionColumns = ['action', 'startDate', 'endDate', 'frequency'];
  delinquencyRangeColumns = ['periodNumber', 'fromDate', 'toDate', 'outstanding'];
  breachScheduleColumns = ['periodNumber', 'fromDate', 'toDate', 'breach'];
  breachActionColumns = ['action', 'startDate', 'endDate', 'frequency'];
  nearBreachActionColumns = ['action', 'frequency', 'threshold', 'createdDate'];
  originatorColumns = ['name', 'type', 'channel', 'status', 'actions'];
  rateChangeColumns = ['effectiveDate', 'previousRate', 'newRate', 'reversed'];
  amortizationColumns = ['paymentNo', 'paymentDate', 'expectedPaymentAmount'];
  rangeTagColumns = [
    'periodNumber',
    'delinquencyRange',
    'delinquentDays',
    'delinquentAmount',
    'addedOnDate',
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loanId = +id;
      this.loadData();
    }

    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab && Object.values(WC_LOAN_TAB).includes(tab as WcLoanTab)) {
      this.activeTab.set(tab as WcLoanTab);
    }
  }

  ngOnDestroy(): void {
    for (const popover of this.popovers()) {
      void popover.dismiss().catch(() => false);
    }
  }

  loadData(): void {
    this.loadLoan();
    this.loadCharges();
    this.loadTransactions();

    this.delinquencyActionsService
      .getWorkingCapitalLoansLoanIdDelinquencyActions(this.loanId)
      .subscribe({
        next: (data) => this.delinquencyActions.set(data ?? []),
        error: (err: unknown) => console.error('Failed to load delinquency actions', err),
      });

    this.delinquencyRangeScheduleService
      .getWorkingCapitalLoansLoanIdDelinquencyRangeSchedule(this.loanId)
      .subscribe({
        next: (data) => this.delinquencyRangeSchedule.set(data ?? []),
        error: (err: unknown) => console.error('Failed to load delinquency range schedule', err),
      });

    this.breachScheduleService.getWorkingCapitalLoansLoanIdBreachSchedule(this.loanId).subscribe({
      next: (data) => this.breachSchedule.set(data ?? []),
      error: (err: unknown) => console.error('Failed to load breach schedule', err),
    });

    this.breachActionsService.getWorkingCapitalLoansLoanIdBreachActions(this.loanId).subscribe({
      next: (data) => this.breachActions.set(data ?? []),
      error: (err: unknown) => console.error('Failed to load breach actions', err),
    });

    this.nearBreachActionsService
      .getWorkingCapitalLoansLoanIdNearBreachActions(this.loanId)
      .subscribe({
        next: (data) => this.nearBreachActions.set(data ?? []),
        error: (err: unknown) => console.error('Failed to load near-breach actions', err),
      });

    this.loadOriginators();

    this.originatorsService.getLoanOriginators().subscribe({
      next: (data) => this.allOriginators.set(data ?? []),
      error: (err: unknown) => console.error('Failed to load loan originators', err),
    });

    this.loansService.getWorkingCapitalLoansLoanIdRateChanges(this.loanId).subscribe({
      next: (data) => this.rateChanges.set(data ?? []),
      error: (err: unknown) => console.error('Failed to load rate changes', err),
    });

    this.loansService.getWorkingCapitalLoansLoanIdAmortizationSchedule(this.loanId).subscribe({
      next: (data) => this.amortizationSchedule.set(data ?? null),
      error: (err: unknown) => console.error('Failed to load amortization schedule', err),
    });

    this.loansService.getWorkingCapitalLoansLoanIdDelinquencyrangetags(this.loanId).subscribe({
      next: (data) => this.delinquencyRangeTags.set(data ?? []),
      error: (err: unknown) => console.error('Failed to load delinquency range tags', err),
    });
  }

  loadLoan(): void {
    this.loansService.getWorkingCapitalLoansLoanId(this.loanId).subscribe({
      next: (data) => this.loan.set(data),
      error: (err: unknown) => console.error('Failed to load working-capital loan', err),
    });
  }

  loadTransactions(): void {
    this.transactionsService.getWorkingCapitalLoansLoanIdTransactions(this.loanId).subscribe({
      next: (data) => this.transactions.set(data.content ?? []),
      error: (err: unknown) => console.error('Failed to load loan transactions', err),
    });
  }

  loadCharges(): void {
    this.chargesService.getWorkingCapitalLoansLoanIdCharges(this.loanId).subscribe({
      next: (data) => this.charges.set(data ?? []),
      error: (err: unknown) => console.error('Failed to load loan charges', err),
    });
  }

  loadOriginators(): void {
    this.wcOriginatorsService.getWorkingCapitalLoansLoanIdOriginators(this.loanId).subscribe({
      next: (data) => this.originators.set(data.originators ?? []),
      error: (err: unknown) => console.error('Failed to load loan originators for this loan', err),
    });
  }

  get isLoanPendingApproval(): boolean {
    return this.loan()?.status?.pendingApproval === true;
  }

  get isLoanApproved(): boolean {
    return this.loan()?.status?.waitingForDisbursal === true;
  }

  get isLoanActive(): boolean {
    return this.loan()?.status?.active === true;
  }

  /**
   * Status gates for the money-moving and loss-recognition actions.
   *
   * Each mirrors what the Working Capital module accepts, so the screen does not offer an action
   * the platform will refuse. The statuses come from the module's own documentation:
   * repayment, goodwill credit and payout refund take `ACTIVE`, `CLOSED_OBLIGATIONS_MET` and
   * `OVERPAID`; a written-off loan is locked to everything but a recovery payment.
   */
  get isLoanOverpaid(): boolean {
    return this.loan()?.status?.overpaid === true;
  }

  get isLoanChargedOff(): boolean {
    return this.loan()?.chargedOff === true;
  }

  get isLoanWrittenOff(): boolean {
    return this.loan()?.status?.closedWrittenOff === true;
  }

  /** Repayment-like credits: allowed while the balance can still move. */
  get acceptsCredits(): boolean {
    const status = this.loan()?.status;
    return (
      status?.active === true || status?.closedObligationsMet === true || status?.overpaid === true
    );
  }

  /**
   * The discount fee is posted as a transaction only on a loan that has none yet.
   *
   * Fineract refuses a second one — `validation.msg.wc.loan.discount.already.set.before.disbursement`,
   * "Discount was already set before disbursement and cannot be added again" — and a loan priced
   * with a discount at disbursement reads back with it here. Changing an existing one is the
   * `PUT /discount` sub-resource, which the Apply discount item above opens.
   */
  get canPostDiscountFee(): boolean {
    return this.isLoanActive && !this.loan()?.discountFee;
  }

  /** A refund needs something to refund; Fineract caps it at the overpayment. */
  get hasCreditBalance(): boolean {
    return this.isLoanOverpaid && (this.loan()?.balance?.overpaymentAmount ?? 0) > 0;
  }

  /** Recovery is capped at what is still recoverable, which the template also offers. */
  get canRecordRecovery(): boolean {
    return this.isLoanWrittenOff && (this.loan()?.balance?.writtenOffOutstanding ?? 0) > 0;
  }

  /**
   * Undo write-off is refused while any recovery stands: restoring the balance would replay money
   * already booked as recovery income against it. The recoveries have to be reversed first.
   */
  get canUndoWriteOff(): boolean {
    return this.isLoanWrittenOff && (this.loan()?.balance?.totalRecovered ?? 0) === 0;
  }

  onRepayment(): void {
    this.router.navigate([`/working-capital/loans/${this.loanId}/action/repayment`]);
  }

  onAction(command: string): void {
    this.router.navigate([`/working-capital/loans/${this.loanId}/action/${command}`]);
  }

  onEdit(): void {
    this.router.navigate([`/working-capital/loans/edit/${this.loanId}`]);
  }

  onNewDelinquencyAction(): void {
    this.router.navigate([`/working-capital/loans/${this.loanId}/delinquency-action`]);
  }

  onAddCharge(): void {
    this.router.navigate([`/working-capital/loans/${this.loanId}/charge`]);
  }

  onViewTransaction(transaction: GetWorkingCapitalLoanTransactionIdResponse): void {
    if (!transaction.id) return;
    this.correction.set(null);
    this.loadTransaction(transaction.id);
  }

  private loadTransaction(transactionId: number): void {
    this.transactionsService
      .getWorkingCapitalLoansLoanIdTransactionsTransactionId(this.loanId, transactionId)
      .subscribe({
        next: (data) => this.selectedTransaction.set(data),
        error: (err: unknown) => console.error('Failed to load the loan transaction', err),
      });
  }

  onCloseTransaction(): void {
    this.selectedTransaction.set(null);
    this.correction.set(null);
  }

  /** True when the open transaction is live and its type carries one of `flags`. */
  private transactionIsOneOf(flags: readonly (keyof LoanTransactionEnumData)[]): boolean {
    const transaction = this.selectedTransaction();
    if (!transaction || transaction.reversed === true) return false;
    const type = transaction.type;
    return type !== undefined && flags.some((flag) => type[flag] === true);
  }

  onOpenCorrection(command: WcTransactionCorrection): void {
    const transaction = this.selectedTransaction();
    this.correctionAmount.set(transaction?.transactionAmount);
    // Already `YYYY-MM-DD`, which is what the picker binds to.
    this.correctionDate = transaction?.transactionDate ?? this.platformDate.today();
    this.correction.set(command);
  }

  /**
   * Returns the promise rather than firing and forgetting, so a caller — a spec, or a future
   * caller that needs to sequence something after it — can wait for the confirmation to settle.
   */
  onUndoTransaction(): Promise<void> {
    return this.dialogService
      .confirm({
        title: this.i18n.translate('WC_LOANS.TRANSACTION.UNDO'),
        message: this.i18n.translate('WC_LOANS.TRANSACTION.CONFIRM_UNDO'),
        destructive: true,
      })
      .then((confirmed) => {
        if (!confirmed) return;
        // Undo takes no parameters of its own beyond `reversalExternalId`, which this screen
        // does not set: sending an amount or a date would be refused as unsupported.
        this.sendTransactionCommand('undo', {
          locale: FINERACT_LOCALE,
          dateFormat: FINERACT_DATE_FORMAT,
        });
      });
  }

  onSaveCorrection(): void {
    const command = this.correction();
    if (!command || !this.correctionAmount()) return;
    this.sendTransactionCommand(command, {
      locale: FINERACT_LOCALE,
      dateFormat: FINERACT_DATE_FORMAT,
      transactionAmount: this.correctionAmount(),
      transactionDate: this.correctionDate ? formatDateToFineract(this.correctionDate) : undefined,
    });
  }

  /**
   * Posts a command against the open transaction and reports what the platform did with it.
   *
   * With maker-checker on for the command, Fineract answers 200 with a `commandId` and no
   * `resourceId`: the reversal is queued for a second approver and nothing has happened to the
   * loan yet. Re-reading and saying nothing would show the transaction unchanged with no
   * explanation, which is the one outcome worth distinguishing here.
   */
  private sendTransactionCommand(command: string, body: Record<string, unknown>): void {
    const transactionId = this.selectedTransaction()?.id;
    if (!transactionId) return;
    this.isCorrecting.set(true);
    this.transactionsService
      .postWorkingCapitalLoansLoanIdTransactionsTransactionId(
        this.loanId,
        transactionId,
        command,
        body,
      )
      .subscribe({
        next: (response) => {
          this.isCorrecting.set(false);
          this.correction.set(null);
          if (isQueuedForChecker(response)) {
            void this.notifications.show(this.i18n.translate('WC_LOANS.TRANSACTION.QUEUED'));
            return;
          }
          // The balance moved, so the loan header and the list are both stale.
          this.loadTransaction(transactionId);
          this.loadTransactions();
          this.loadLoan();
        },
        error: (err: unknown) => {
          this.isCorrecting.set(false);
          console.error(`Failed to ${command} the loan transaction`, err);
        },
      });
  }

  /** `02 October 2026` rather than the raw `2026-10-02` the payload carries. */
  formatDate(date: string | undefined): string {
    return date ? formatDateToFineract(date) : '-';
  }

  onViewCharge(charge: WorkingCapitalLoanChargeData): void {
    if (!charge.id) return;
    this.isAdjustingCharge.set(false);
    this.loadCharge(charge.id);
  }

  private loadCharge(chargeId: number): void {
    this.chargesService
      .getWorkingCapitalLoansLoanIdChargesLoanChargeId(this.loanId, chargeId)
      .subscribe({
        next: (data) => this.selectedCharge.set(data),
        error: (err: unknown) => console.error('Failed to load the loan charge', err),
      });
  }

  onCloseCharge(): void {
    this.selectedCharge.set(null);
    this.isAdjustingCharge.set(false);
  }

  onOpenChargeAdjustment(): void {
    // The outstanding amount is the sum an adjustment is normally written against, and it is
    // also the one the platform caps it at.
    this.chargeAdjustmentAmount.set(this.selectedCharge()?.amountOutstanding);
    this.isAdjustingCharge.set(true);
  }

  /**
   * Posts `command=adjustment` against the open charge.
   *
   * `amount` is the only parameter the command takes beyond an external id and a note — measured:
   * an empty body answers `validation.msg.workingCapitalLoanChargeAdjustment.amount.cannot.be.blank`,
   * and the platform dates the adjustment itself rather than accepting a date. It books a Charge
   * Adjustment *transaction*, so the transactions tab and the loan balance both move with it.
   */
  onSaveChargeAdjustment(): void {
    const chargeId = this.selectedCharge()?.id;
    const amount = this.chargeAdjustmentAmount();
    if (!chargeId || !amount) return;
    this.isCorrecting.set(true);
    this.chargesService
      .postWorkingCapitalLoansLoanIdChargesLoanChargeId(
        this.loanId,
        chargeId,
        { amount, locale: FINERACT_LOCALE, dateFormat: FINERACT_DATE_FORMAT },
        'adjustment',
      )
      .subscribe({
        next: (response) => {
          this.isCorrecting.set(false);
          this.isAdjustingCharge.set(false);
          if (isQueuedForChecker(response)) {
            void this.notifications.show(this.i18n.translate('WC_LOANS.TRANSACTION.QUEUED'));
            return;
          }
          this.loadCharge(chargeId);
          this.loadCharges();
          this.loadTransactions();
          this.loadLoan();
        },
        error: (err: unknown) => {
          this.isCorrecting.set(false);
          console.error('Failed to adjust the loan charge', err);
        },
      });
  }

  onWaiveCharge(charge: WorkingCapitalLoanChargeData): void {
    if (!charge.id || !confirm(`Waive the charge "${charge.name}"?`)) return;
    const chargeId = charge.id;
    this.chargesService
      .postWorkingCapitalLoansLoanIdChargesLoanChargeId(this.loanId, chargeId, {}, 'waive')
      .subscribe({
        next: () => {
          this.loadCharges();
          // A waiver is a transaction too, and it is one of the five the platform will undo.
          this.loadTransactions();
          if (this.selectedCharge()?.id === chargeId) this.loadCharge(chargeId);
        },
        error: (err: unknown) => console.error('Failed to waive loan charge', err),
      });
  }

  onNewBreachAction(): void {
    this.router.navigate([`/working-capital/loans/${this.loanId}/breach-action`]);
  }

  onNewNearBreachAction(): void {
    this.router.navigate([`/working-capital/loans/${this.loanId}/near-breach-action`]);
  }

  onAttachOriginator(): void {
    const originatorId = this.originatorToAttach();
    if (!originatorId) return;
    this.wcOriginatorsService
      .postWorkingCapitalLoansLoanIdOriginatorsOriginatorId(this.loanId, originatorId)
      .subscribe({
        next: () => {
          this.originatorToAttach.set(null);
          this.loadOriginators();
        },
        error: (err: unknown) => console.error('Failed to attach originator', err),
      });
  }

  onDetachOriginator(originator: LoanOriginatorData): void {
    if (!originator.id || !confirm(`Detach ${originator.name} from this loan?`)) return;
    this.wcOriginatorsService
      .deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId(this.loanId, originator.id)
      .subscribe({
        next: () => this.loadOriginators(),
        error: (err: unknown) => console.error('Failed to detach originator', err),
      });
  }

  onDelete(): void {
    if (!confirm('Delete this loan?')) return;
    this.loansService.deleteWorkingCapitalLoansLoanId(this.loanId).subscribe({
      next: () => this.router.navigate(['/working-capital/loans']),
      error: (err: unknown) => console.error('Failed to delete loan', err),
    });
  }

  onBack(): void {
    this.router.navigate(['/working-capital/loans']);
  }
}

/**
 * True for the maker-checker answer: a command id and no resource.
 *
 * `commandId` is absent from the generated response types because the OpenAPI document does not
 * describe this branch — the platform returns `CommandProcessingResult` either way, and only the
 * populated fields differ.
 */
function isQueuedForChecker(response: object | undefined): boolean {
  const result = (response ?? {}) as { commandId?: number; resourceId?: number };
  return result.commandId !== undefined && result.resourceId === undefined;
}
