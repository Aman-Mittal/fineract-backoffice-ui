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

import { computed, inject, signal, Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DecimalPipe, NgClass } from '@angular/common';
import {
  SavingsAccountService,
  SavingsAccountData,
  SavingsAccountTransactionData,
  SavingsAccountChargeData,
} from '../../api';
import { StatusBadgeComponent, HasPermissionDirective } from '../../shared';
import { NotificationService } from '../../core/services/notification.service';
import { DialogService } from '../../core/services/dialog.service';
import {
  SavingsBlockDialogComponent,
  SavingsBlockDialogData,
  SavingsBlockResult,
} from './savings-block-dialog.component';
import { CdkTableModule } from '@angular/cdk/table';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonChip,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import {
  resolveAccountActionType,
  resolveAccountRoutePrefix,
} from '../../core/utils/account-type-resolver';

@Component({
  selector: 'app-savings-account-view',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    CdkTableModule,
    StatusBadgeComponent,
    HasPermissionDirective,
    DecimalPipe,
    NgClass,
    IonIcon,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSegment,
    IonSegmentButton,
    IonChip,
    IonItem,
    IonLabel,
    IonList,
    IonPopover,
    TooltipDirective,
  ],
  template: `
    @if (account()) {
      <div class="view-container">
        <!-- Header Actions Card -->
        <ion-card class="header-card">
          <ion-card-content class="header-content">
            <div class="savings-title-area">
              <div class="avatar-circle">
                <ion-icon name="wallet-outline"></ion-icon>
              </div>
              <div class="title-details">
                <h2>{{ account()?.savingsProductName }}</h2>
                <div class="subtitle-row">
                  <span class="account-no">#{{ account()?.accountNo }}</span>
                  <span class="divider">|</span>
                  <span class="client-name">Client: {{ account()?.clientName }}</span>
                  <app-status-badge
                    [status]="account()?.status"
                    class="status-badge"
                  ></app-status-badge>
                  @if (blockLabelKey(); as blockKey) {
                    <ion-chip color="warning" highlighted data-testid="savings-blocked-chip">
                      {{ blockKey | translate }}
                    </ion-chip>
                  }
                </div>
              </div>
            </div>
            <div class="actions-area">
              @if (account()?.status?.submittedAndPendingApproval) {
                <ion-button
                  color="secondary"
                  *appHasPermission="'APPROVE_SAVINGSACCOUNT'"
                  (click)="onSavingsAction('approve')"
                  [appTooltip]="'SAVINGS.APPROVE' | translate"
                >
                  <ion-icon name="checkmark-circle-outline"></ion-icon>
                  Approve
                </ion-button>
              }
              @if (account()?.status?.approved) {
                <ion-button
                  color="primary"
                  *appHasPermission="'ACTIVATE_SAVINGSACCOUNT'"
                  (click)="onSavingsAction('activate')"
                  [appTooltip]="'SAVINGS.ACTIVATE' | translate"
                >
                  <ion-icon name="play-circle-outline"></ion-icon>
                  Activate
                </ion-button>
              }
              @if (account()?.status?.active) {
                <ion-button
                  color="danger"
                  *appHasPermission="'CLOSE_SAVINGSACCOUNT'"
                  (click)="onSavingsAction('close')"
                  [appTooltip]="'SAVINGS.CLOSE' | translate"
                >
                  <ion-icon name="power-outline"></ion-icon>
                  Close
                </ion-button>
              }
              <ion-button
                color="primary"
                *appHasPermission="'DEPOSIT_SAVINGSACCOUNT'"
                (click)="onTransaction('deposit')"
                [appTooltip]="'SAVINGS.DEPOSIT_CASH' | translate"
              >
                <ion-icon name="add-circle-outline"></ion-icon>
                Deposit
              </ion-button>
              <ion-button
                color="danger"
                *appHasPermission="'WITHDRAW_SAVINGSACCOUNT'"
                (click)="onTransaction('withdrawal')"
                [appTooltip]="'SAVINGS.WITHDRAW_CASH' | translate"
              >
                <ion-icon name="remove-circle-outline"></ion-icon>
                Withdraw
              </ion-button>
              @if (isActive()) {
                <ion-button color="primary" id="savingsMenu-trigger" data-testid="savings-actions">
                  <ion-icon name="caret-down-outline"></ion-icon>
                  {{ 'COMMON.ACTIONS' | translate }}
                </ion-button>
                <ion-popover trigger="savingsMenu-trigger" [dismissOnSelect]="true">
                  <ng-template>
                    <ion-list>
                      <ion-item
                        button
                        data-testid="savings-calculate-interest"
                        (click)="onSimpleCommand('calculateInterest')"
                      >
                        <ion-icon slot="start" name="calculator-outline"></ion-icon>
                        <ion-label>{{ 'SAVINGS.CALCULATE_INTEREST' | translate }}</ion-label>
                      </ion-item>

                      <ion-item
                        button
                        data-testid="savings-post-interest"
                        (click)="onSimpleCommand('postInterest')"
                      >
                        <ion-icon slot="start" name="trending-up-outline"></ion-icon>
                        <ion-label>{{ 'SAVINGS.POST_INTEREST' | translate }}</ion-label>
                      </ion-item>

                      <ion-item
                        button
                        data-testid="savings-apply-annual-fees"
                        (click)="onSimpleCommand('applyAnnualFees')"
                      >
                        <ion-icon slot="start" name="pricetag-outline"></ion-icon>
                        <ion-label>{{ 'SAVINGS.APPLY_ANNUAL_FEES' | translate }}</ion-label>
                      </ion-item>

                      @if (!isBlocked()) {
                        <ion-item
                          button
                          class="warn-item"
                          data-testid="savings-block"
                          (click)="onBlockCommand('block')"
                        >
                          <ion-icon slot="start" color="danger" name="lock-closed-outline">
                          </ion-icon>
                          <ion-label>{{ 'SAVINGS.BLOCK' | translate }}</ion-label>
                        </ion-item>

                        @if (!isDebitBlocked()) {
                          <ion-item
                            button
                            data-testid="savings-block-debit"
                            (click)="onBlockCommand('blockDebit')"
                          >
                            <ion-icon slot="start" name="arrow-up-circle-outline"></ion-icon>
                            <ion-label>{{ 'SAVINGS.BLOCK_DEBIT' | translate }}</ion-label>
                          </ion-item>
                        }
                        @if (!isCreditBlocked()) {
                          <ion-item
                            button
                            data-testid="savings-block-credit"
                            (click)="onBlockCommand('blockCredit')"
                          >
                            <ion-icon slot="start" name="arrow-down-circle-outline"></ion-icon>
                            <ion-label>{{ 'SAVINGS.BLOCK_CREDIT' | translate }}</ion-label>
                          </ion-item>
                        }
                      }

                      <!-- Reversals only. Fineract rejects each one unless the matching block is
                           actually in force, so they appear only when it is. -->
                      @if (isBlocked()) {
                        <ion-item
                          button
                          data-testid="savings-unblock"
                          (click)="onSimpleCommand('unblock')"
                        >
                          <ion-icon slot="start" name="lock-open-outline"></ion-icon>
                          <ion-label>{{ 'SAVINGS.UNBLOCK' | translate }}</ion-label>
                        </ion-item>
                      }
                      @if (isDebitBlocked()) {
                        <ion-item
                          button
                          data-testid="savings-unblock-debit"
                          (click)="onSimpleCommand('unblockDebit')"
                        >
                          <ion-icon slot="start" name="lock-open-outline"></ion-icon>
                          <ion-label>{{ 'SAVINGS.UNBLOCK_DEBIT' | translate }}</ion-label>
                        </ion-item>
                      }
                      @if (isCreditBlocked()) {
                        <ion-item
                          button
                          data-testid="savings-unblock-credit"
                          (click)="onSimpleCommand('unblockCredit')"
                        >
                          <ion-icon slot="start" name="lock-open-outline"></ion-icon>
                          <ion-label>{{ 'SAVINGS.UNBLOCK_CREDIT' | translate }}</ion-label>
                        </ion-item>
                      }
                    </ion-list>
                  </ng-template>
                </ion-popover>
              }
              <ion-button fill="clear" (click)="onBack()">
                <ion-icon name="arrow-back-outline"></ion-icon>
                {{ 'COMMON.BACK' | translate }}
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Tabs Section -->
        <ion-segment [value]="activeTab()" (ionChange)="activeTab.set($any($event).detail.value)">
          <ion-segment-button value="0">
            <ion-label>Overview</ion-label>
          </ion-segment-button>
          <ion-segment-button value="1">
            <ion-label>{{ 'COMMON.TRANSACTIONS' | translate }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="2">
            <ion-label>{{ 'LOANS.CHARGES' | translate }}</ion-label>
          </ion-segment-button>
        </ion-segment>

        @if (activeTab() === '0') {
          <div class="tab-content">
            <div class="info-grid">
              <ion-card class="info-card">
                <ion-card-header>
                  <ion-card-title>
                    <ion-icon name="information-circle-outline"></ion-icon>
                    Interest Settings
                  </ion-card-title>
                </ion-card-header>
                <ion-card-content class="details-list">
                  <div class="detail-item">
                    <span class="label">Nominal Annual Interest Rate</span>
                    <span class="value">{{ account()?.nominalAnnualInterestRate }}%</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Compounding Period</span>
                    <span class="value">{{ account()?.interestCompoundingPeriodType?.value }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Posting Period</span>
                    <span class="value">{{ account()?.interestPostingPeriodType?.value }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Interest Calculation Day-in-Year</span>
                    <span class="value">{{
                      account()?.interestCalculationDaysInYearType?.value
                    }}</span>
                  </div>
                </ion-card-content>
              </ion-card>

              <ion-card class="info-card">
                <ion-card-header>
                  <ion-card-title>
                    <ion-icon name="pulse-outline"></ion-icon>
                    Timeline & Balance
                  </ion-card-title>
                </ion-card-header>
                <ion-card-content class="details-list">
                  <div class="detail-item">
                    <span class="label">Submitted On Date</span>
                    <span class="value">{{ formattedSubmittedDate }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Activated On Date</span>
                    <span class="value">{{ formattedActivatedDate }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Field Officer</span>
                    <span class="value">{{ account()?.fieldOfficerName || '-' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Account Balance</span>
                    <span class="value">
                      {{ account()?.currency?.displaySymbol }}
                      {{ account()?.summary?.accountBalance || 0 | number: '1.2-2' }}
                    </span>
                  </div>
                </ion-card-content>
              </ion-card>
            </div>
          </div>
        }
        @if (activeTab() === '1') {
          <div class="tab-content">
            <ion-card class="table-card">
              <ion-card-content>
                @if (transactions().length > 0) {
                  <table cdk-table [dataSource]="transactions()" class="full-width-table">
                    <ng-container cdkColumnDef="id">
                      <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.ID' | translate }}</th>
                      <td cdk-cell *cdkCellDef="let tx">{{ tx.id }}</td>
                    </ng-container>

                    <ng-container cdkColumnDef="date">
                      <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.DATE' | translate }}</th>
                      <td cdk-cell *cdkCellDef="let tx">{{ formatDate(tx.date) }}</td>
                    </ng-container>

                    <ng-container cdkColumnDef="type">
                      <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.TYPE' | translate }}</th>
                      <td cdk-cell *cdkCellDef="let tx">{{ tx.transactionType?.value }}</td>
                    </ng-container>

                    <ng-container cdkColumnDef="amount">
                      <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.AMOUNT' | translate }}</th>
                      <td cdk-cell *cdkCellDef="let tx">
                        <span
                          [ngClass]="{
                            'debit-amount': tx.debit && !tx.reversed,
                            'credit-amount': tx.credit && !tx.reversed,
                            'reversed-amount': tx.reversed,
                          }"
                        >
                          {{ tx.debit ? '-' : tx.credit ? '+' : '' }}
                          {{ account()?.currency?.displaySymbol }}{{ tx.amount | number: '1.2-2' }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container cdkColumnDef="runningBalance">
                      <th cdk-header-cell *cdkHeaderCellDef>
                        {{ 'COMMON.RUNNING_BALANCE' | translate }}
                      </th>
                      <td cdk-cell *cdkCellDef="let tx">
                        {{ account()?.currency?.displaySymbol }}
                        {{ tx.runningBalance || 0 | number: '1.2-2' }}
                      </td>
                    </ng-container>

                    <tr cdk-header-row *cdkHeaderRowDef="transactionColumns"></tr>
                    <tr cdk-row *cdkRowDef="let row; columns: transactionColumns"></tr>
                  </table>
                } @else {
                  <div class="empty-state">
                    <ion-icon name="receipt-outline"></ion-icon>
                    <p>{{ 'LOANS.NO_TRANSACTIONS' | translate }}</p>
                  </div>
                }
              </ion-card-content>
            </ion-card>
          </div>
        }
        @if (activeTab() === '2') {
          <div class="tab-content">
            <ion-card class="table-card">
              <ion-card-content>
                @if (charges().length > 0) {
                  <table cdk-table [dataSource]="charges()" class="full-width-table">
                    <ng-container cdkColumnDef="name">
                      <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.NAME' | translate }}</th>
                      <td cdk-cell *cdkCellDef="let c">{{ c.name }}</td>
                    </ng-container>

                    <ng-container cdkColumnDef="amount">
                      <th cdk-header-cell *cdkHeaderCellDef>{{ 'COMMON.AMOUNT' | translate }}</th>
                      <td cdk-cell *cdkCellDef="let c">
                        {{ account()?.currency?.displaySymbol }} {{ c.amount | number: '1.2-2' }}
                      </td>
                    </ng-container>

                    <ng-container cdkColumnDef="outstanding">
                      <th cdk-header-cell *cdkHeaderCellDef>
                        {{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.OUTSTANDING' | translate }}
                      </th>
                      <td cdk-cell *cdkCellDef="let c">
                        {{ account()?.currency?.displaySymbol }}
                        {{ c.amountOutstanding | number: '1.2-2' }}
                      </td>
                    </ng-container>

                    <tr cdk-header-row *cdkHeaderRowDef="chargeColumns"></tr>
                    <tr cdk-row *cdkRowDef="let row; columns: chargeColumns"></tr>
                  </table>
                } @else {
                  <div class="empty-state">
                    <ion-icon name="cash-outline"></ion-icon>
                    <p>{{ 'SAVINGS.NO_CHARGES' | translate }}</p>
                  </div>
                }
              </ion-card-content>
            </ion-card>
          </div>
        }
      </div>
    }
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
      .savings-title-area {
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
        color: #2c3e50;
      }
      .subtitle-row {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #7f8c8d;
        font-size: 14px;
      }
      .divider {
        color: #bdc3c7;
      }
      .actions-area {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .tab-group {
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .tab-content {
        padding: 24px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
      .info-card {
        border-radius: 8px;
        border: 1px solid #eaedf1;
      }
      .info-card mat-card-header {
        margin-bottom: 12px;
      }
      .info-card mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #34495e;
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
        border-bottom: 1px solid #f5f7fa;
      }
      .detail-item .label {
        color: #7f8c8d;
        font-size: 14px;
        font-weight: 500;
      }
      .detail-item .value {
        color: #2c3e50;
        font-size: 14px;
        font-weight: 600;
      }
      .table-card {
        border: 1px solid #eaedf1;
        box-shadow: none;
      }
      .full-width-table {
        width: 100%;
      }
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px;
        color: #95a5a6;
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
      .debit-amount {
        color: #e74c3c;
        font-weight: 600;
      }
      .credit-amount {
        color: #2ecc71;
        font-weight: 600;
      }
      .reversed-amount {
        text-decoration: line-through;
        opacity: 0.6;
        color: #7f8c8d;
      }
    `,
  ],
})
export class SavingsAccountViewComponent implements OnInit {
  /** Selected tab; mat-tab-group tracked this internally, ion-segment does not. */
  readonly activeTab = signal('0');
  private readonly savingsService = inject(SavingsAccountService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);

  accountId = 0;
  readonly account = signal<SavingsAccountData | null>(null);
  readonly transactions = signal<SavingsAccountTransactionData[]>([]);
  readonly charges = signal<SavingsAccountChargeData[]>([]);

  transactionColumns = ['id', 'date', 'type', 'amount', 'runningBalance'];
  chargeColumns = ['name', 'amount', 'outstanding'];

  get formattedSubmittedDate(): string {
    const dates = this.account()?.timeline?.submittedOnDate as unknown as number[];
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    return '-';
  }

  get formattedActivatedDate(): string {
    const dates = this.account()?.timeline?.activatedOnDate as unknown as number[];
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    return '-';
  }

  formatDate(dates: number[] | undefined | null): string {
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    return '-';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.accountId = +id;
        this.loadAccountData();
      }
    });
  }

  loadAccountData() {
    this.savingsService
      .getSavingsaccountsAccountId(this.accountId, false, undefined, 'all')
      .subscribe({
        next: (data) => {
          this.account.set(data);
          this.transactions.set(data.transactions || []);
          this.charges.set(data.charges || []);
        },
        error: () => this.notifications.error('Operation failed. Please try again.'),
      });
  }

  onTransaction(command: string) {
    this.router.navigate([`/products/savings-accounts/${this.accountId}/transactions/${command}`]);
  }

  /**
   * `subStatus` is where Fineract records a block; `status` stays `Active` throughout, so the
   * status badge alone cannot tell a frozen account from a healthy one.
   */
  readonly isActive = computed(() => this.account()?.status?.active === true);
  readonly isBlocked = computed(() => this.subStatus()?.['block'] === true);
  readonly isDebitBlocked = computed(() => this.subStatus()?.['blockDebit'] === true);
  readonly isCreditBlocked = computed(() => this.subStatus()?.['blockCredit'] === true);

  private subStatus(): Record<string, unknown> | undefined {
    return (this.account() as unknown as Record<string, Record<string, unknown>> | null)?.[
      'subStatus'
    ];
  }

  /** The most restrictive block in force, or null when the account moves freely. */
  blockLabelKey(): string | null {
    if (this.isBlocked()) return 'SAVINGS.BLOCKED';
    if (this.isDebitBlocked() && this.isCreditBlocked()) return 'SAVINGS.BLOCKED';
    if (this.isDebitBlocked()) return 'SAVINGS.DEBITS_BLOCKED';
    if (this.isCreditBlocked()) return 'SAVINGS.CREDITS_BLOCKED';
    return null;
  }

  /**
   * Commands that need nothing beyond a confirmation.
   *
   * Each was verified against a running Fineract: they accept `dateFormat` and `locale` and
   * nothing else. The block commands are deliberately not here — they require a
   * `reasonForBlock` drawn from a different code list per block type, which needs its own picker.
   */
  onSimpleCommand(command: string): void {
    const titleKey = `SAVINGS.${command.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
    from(
      this.dialogService.confirm({
        title: this.translate.instant(titleKey),
        message: this.translate.instant(
          `SAVINGS.CONFIRM_${command.replace(/([A-Z])/g, '_$1').toUpperCase()}`,
        ),
      }),
    ).subscribe((confirmed) => {
      if (!confirmed) return;
      this.savingsService
        .postSavingsaccountsAccountId(
          this.accountId,
          { dateFormat: 'dd MMMM yyyy', locale: 'en' } as never,
          command,
        )
        .subscribe({
          next: () => {
            this.notifications.success(this.translate.instant('COMMON.SUCCESS'));
            this.loadAccountData();
          },
          error: () => this.notifications.error(this.translate.instant('COMMON.ERRORS.UNEXPECTED')),
        });
    });
  }

  /**
   * The block commands, each of which needs a reason.
   *
   * The three draw from *different* Fineract code lists, so the reason cannot be a shared
   * lookup — picking from the wrong list would offer reasons the server rejects.
   */
  onBlockCommand(command: 'block' | 'blockDebit' | 'blockCredit'): void {
    const config = {
      block: { codeName: 'SavingsAccountBlockReasons', key: 'BLOCK' },
      blockDebit: { codeName: 'DebitTransactionFreezeReasons', key: 'BLOCK_DEBIT' },
      blockCredit: { codeName: 'CreditTransactionFreezeReasons', key: 'BLOCK_CREDIT' },
    }[command];

    from(
      this.dialogService.open<SavingsBlockResult>(SavingsBlockDialogComponent, {
        data: {
          titleKey: `SAVINGS.${config.key}`,
          messageKey: `SAVINGS.CONFIRM_${config.key}`,
          codeName: config.codeName,
        } satisfies SavingsBlockDialogData,
      }),
    ).subscribe((result) => {
      if (!result) return;
      this.savingsService
        .postSavingsaccountsAccountId(
          this.accountId,
          { reasonForBlock: result.reasonForBlock } as never,
          command,
        )
        .subscribe({
          next: () => {
            this.notifications.success(this.translate.instant('COMMON.SUCCESS'));
            this.loadAccountData();
          },
          error: () => this.notifications.error(this.translate.instant('COMMON.ERRORS.UNEXPECTED')),
        });
    });
  }

  onSavingsAction(command: string) {
    const rawAccount = this.account() as unknown as Record<string, unknown>;
    const type = resolveAccountActionType(rawAccount);
    this.router.navigate([`/products/${type}/${this.accountId}/action/${command}`]);
  }

  onBack() {
    const rawAccount = this.account() as unknown as Record<string, unknown>;
    const routePrefix = resolveAccountRoutePrefix(rawAccount);
    this.router.navigate([`/products/${routePrefix}`]);
  }
}
