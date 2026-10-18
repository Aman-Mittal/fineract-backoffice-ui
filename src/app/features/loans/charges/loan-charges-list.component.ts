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
import { PlatformDateService } from '../../../core/services/platform-date.service';
import { ActivatedRoute, Router } from '@angular/router';
import { I18N, TranslatePipe } from '../../../core/adapters';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { LoanChargesService, GetLoansLoanIdChargesChargeIdResponse } from '../../../api';
import { DialogService } from '../../../core/services/dialog.service';
import { CHARGE_COMMAND_PERMISSIONS } from '../../../core/guards/command-permissions';
import { NotificationService } from '../../../core/services/notification.service';
import { RequiresPermissionDirective } from '../../../shared/directives/requires-permission.directive';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { ButtonComponent } from '../../../ui/button/button.component';

/** Fineract parses the date `pay` sends against this format. The adjustment takes neither. */
const DATE_FORMAT = 'yyyy-MM-dd';
const LOCALE = 'en';

/**
 * Whether a charge still has something to pay, waive or adjust.
 *
 * `amountOutstanding` rather than the `paid` flag the delete action reads: a partly paid charge
 * is neither paid nor fully settled, and it is exactly the one that can still be waived.
 */
function outstanding(charge: LoanChargeRow): number {
  return charge.amountOutstanding ?? 0;
}

/**
 * The charge fields this list branches on that the generated response type leaves out.
 *
 * `GetLoansLoanIdChargesChargeIdResponse` declares the amounts but not `chargePayable`,
 * `waived` or `paid`, all three of which the payload carries:
 *
 * ```json
 * {"amount":20,"amountOutstanding":20,"paid":false,"waived":false,"chargePayable":false,
 *  "chargePaymentMode":{"id":0,"code":"chargepaymentmode.regular","value":"Regular"}}
 * ```
 *
 * That is issue #653 again, and `chargePayable` is the one that matters: it is the platform's
 * own answer to whether this charge can be paid. The delete action has read the undeclared
 * `paid` from the template since before this change, which is how the omission was noticed.
 */
interface LoanChargeFlags {
  /** False unless the charge's payment mode is account transfer. */
  readonly chargePayable?: boolean;
  readonly waived?: boolean;
  readonly paid?: boolean;
}

/**
 * A charge row as this screen handles one: what the client declares, plus what it omits.
 *
 * Exported because it is the type of every row the component takes, including in its tests —
 * which cannot import the generated response type at all (ADR 0006).
 */
export type LoanChargeRow = GetLoansLoanIdChargesChargeIdResponse & LoanChargeFlags;

/**
 * Lists the charges attached to a single loan, and services them.
 *
 * The loan id is read from the route snapshot; every action operates within that loan's charge
 * collection. Paid charges cannot be deleted and the delete button is hidden for those rows.
 *
 * Pay, Waive and Adjustment are offered per row, each gated on its own permission and on the
 * charge still having something outstanding. Before this, a wrongly applied charge could only
 * be deleted — which the platform refuses once it has been paid or partly paid, and which
 * leaves no record that a waiver happened (issue #754).
 *
 * The bodies are the platform's, measured rather than inferred: `pay` takes a
 * `transactionDate`, `adjustment` takes an `amount`, and `waive` takes neither.
 */
@Component({
  selector: 'app-loan-charges-list',
  standalone: true,
  imports: [
    TranslatePipe,
    DataTableComponent,
    CellTemplateDirective,
    ButtonComponent,
    TooltipDirective,
    RequiresPermissionDirective,
  ],
  template: `
    <app-data-table
      title="LOAN_CHARGES.TITLE"
      helpTextKey="HELP.LOAN_CHARGES_DESC"
      createButtonLabel="LOAN_CHARGES.ADD_TITLE"
      createPermission="CREATE_LOANCHARGE"
      [columns]="columns"
      [data]="charges()"
      [totalRecords]="charges().length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="paid" let-row>
        @if (row.paid) {
          <span class="badge badge-success">{{ 'COMMON.YES' | appTranslate }}</span>
        } @else {
          <span class="badge badge-neutral">{{ 'COMMON.NO' | appTranslate }}</span>
        }
      </ng-template>

      <ng-template appCellTemplate="actions" let-row>
        @if (isPayable(row)) {
          <app-button
            type="button"
            emphasis="quiet"
            data-testid="loan-charge-pay"
            [label]="'CHARGES.PAY' | appTranslate"
            icon="cash-outline"
            [appTooltip]="'CHARGES.PAY' | appTranslate"
            [appRequiresPermission]="permissions.pay"
            (click)="onPay(row)"
          />
        }
        @if (isOutstanding(row)) {
          <app-button
            type="button"
            emphasis="quiet"
            data-testid="loan-charge-waive"
            [label]="'CHARGES.WAIVE' | appTranslate"
            icon="remove-circle-outline"
            [appTooltip]="'CHARGES.WAIVE' | appTranslate"
            [appRequiresPermission]="permissions.waive"
            (click)="onWaive(row)"
          />
          <app-button
            type="button"
            emphasis="quiet"
            data-testid="loan-charge-adjust"
            [label]="'CHARGES.ADJUST' | appTranslate"
            icon="create-outline"
            [appTooltip]="'CHARGES.ADJUST' | appTranslate"
            [appRequiresPermission]="permissions.adjustment"
            (click)="onAdjust(row)"
          />
        }
        @if (!row.paid) {
          <app-button
            type="button"
            intent="danger"
            emphasis="quiet"
            [label]="'COMMON.DELETE' | appTranslate"
            icon="trash-outline"
            [appTooltip]="'COMMON.DELETE' | appTranslate"
            (click)="onDelete(row)"
          />
        }
      </ng-template>
    </app-data-table>
  `,
})
export class LoanChargesListComponent implements OnInit {
  private readonly loanChargesService = inject(LoanChargesService);
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

  /** For the template's gates, which need the codes as values. */
  readonly permissions = CHARGE_COMMAND_PERMISSIONS.loan;

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'LOAN_CHARGES.TITLE', sortable: true },
    { key: 'amount', label: 'LOAN_CHARGES.AMOUNT', sortable: true },
    { key: 'dueDate', label: 'LOAN_CHARGES.DUE_DATE', sortable: false },
    { key: 'paid', label: 'LOAN_CHARGES.PAID', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  loanId!: number;
  readonly charges = signal<LoanChargeRow[]>([]);

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('loanId'));
    this.load();
  }

  load(): void {
    this.loanChargesService.getLoansLoanIdCharges(this.loanId).subscribe({
      next: (data: GetLoansLoanIdChargesChargeIdResponse[]) => {
        this.charges.set(data || []);
      },
      error: (err: unknown) => console.error('Failed to load loan charges', err),
    });
  }

  onCreate(): void {
    this.router.navigate(['/loans', this.loanId, 'charges', 'add']);
  }

  isOutstanding(row: LoanChargeRow): boolean {
    return outstanding(row) > 0;
  }

  /**
   * Whether this charge can be paid, as opposed to merely having something outstanding.
   *
   * Pay is narrower than Waive and Adjustment. The platform accepts it only for a charge whose
   * payment mode is account transfer, and refuses every other one with
   * `validation.msg.domain.rule.violation` — "This loan charge cannot be paid as the charge
   * payment mode is not account transfer". Most charges are the regular mode, so gating Pay on
   * the outstanding amount alone would put a button that can only fail on nearly every row.
   *
   * `chargePayable` is the platform's own answer to the question, so it is the one asked.
   */
  isPayable(row: LoanChargeRow): boolean {
    return outstanding(row) > 0 && row.chargePayable === true;
  }

  /**
   * Pays a charge on the date the user gives.
   *
   * The date is asked for rather than assumed to be today, because a charge is often paid
   * against a date already past — and because the tenant's business date can be behind the
   * browser's, which is issue #758. The platform demands it:
   * `validation.msg.loan.charge.payment.transaction.transactionDate.cannot.be.blank`.
   */
  async onPay(row: LoanChargeRow): Promise<void> {
    const values = await this.dialogService.prompt({
      title: this.i18n.translate('CHARGES.PAY'),
      message: this.i18n.translate('CHARGES.CONFIRM_PAY', {
        name: row.name ?? '',
        amount: outstanding(row),
      }),
      fields: [
        {
          name: 'transactionDate',
          label: this.i18n.translate('COMMON.TRANSACTION_DATE'),
          type: 'date',
          value: this.platformDate.today(),
        },
      ],
    });
    if (!values) return;

    this.send(row, 'pay', {
      transactionDate: String(values['transactionDate']),
      dateFormat: DATE_FORMAT,
      locale: LOCALE,
    });
  }

  /**
   * Waives a charge, after confirming.
   *
   * No fields: the platform takes the whole outstanding amount and refuses a body that says
   * otherwise. Destructive, because a waiver is a write-off of the fee and is not undone from
   * this screen — the reversal is on the transaction it produces, on the loan's Transactions
   * tab, which is where the transaction id is.
   */
  async onWaive(row: LoanChargeRow): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: this.i18n.translate('CHARGES.WAIVE'),
      message: this.i18n.translate('CHARGES.CONFIRM_WAIVE', {
        name: row.name ?? '',
        amount: outstanding(row),
      }),
      destructive: true,
    });
    if (!confirmed) return;

    this.send(row, 'waive', {});
  }

  /**
   * Adjusts a charge to a different amount.
   *
   * `amount` and nothing else — and "nothing else" is literal. Sending the `locale` and
   * `dateFormat` that every other command here requires makes this one a 400: the command
   * rejects parameters it does not support, and it supports neither. The platform fills in its
   * own transaction date. Measured; the same quirk as the Working Capital charge adjustment.
   */
  async onAdjust(row: LoanChargeRow): Promise<void> {
    const values = await this.dialogService.prompt({
      title: this.i18n.translate('CHARGES.ADJUST'),
      message: this.i18n.translate('CHARGES.CONFIRM_ADJUST', { name: row.name ?? '' }),
      fields: [
        {
          name: 'amount',
          label: this.i18n.translate('COMMON.AMOUNT'),
          type: 'number',
          value: outstanding(row),
        },
      ],
    });
    if (!values) return;

    this.send(row, 'adjustment', { amount: Number(values['amount']) });
  }

  /**
   * Issues one charge command and reloads.
   *
   * The reload is unconditional on success because every one of these changes the row it was
   * issued from — a paid charge's outstanding falls, a waived one's goes to zero — and a stale
   * row would keep offering actions the platform has just refused.
   */
  private send(
    row: LoanChargeRow,
    command: keyof typeof CHARGE_COMMAND_PERMISSIONS.loan,
    body: Record<string, unknown>,
  ): void {
    if (!row.id) return;
    this.loanChargesService
      .postLoansLoanIdChargesLoanChargeId(this.loanId, row.id, body, command)
      .subscribe({
        next: () => {
          this.notifications.success(this.i18n.translate('CHARGES.SAVED'));
          this.load();
        },
        error: (err: unknown) => {
          console.error(`Failed to ${command} loan charge`, err);
          this.notifications.error(this.i18n.translate('CHARGES.FAILED'));
        },
      });
  }

  async onDelete(row: LoanChargeRow): Promise<void> {
    if (!row.id) return;
    const confirmed = await this.dialogService.confirm({
      title: this.i18n.translate('COMMON.DELETE'),
      message: this.i18n.translate('LOAN_CHARGES.DELETE_CONFIRM', {
        name: row.name ?? '',
        amount: row.amount ?? '',
      }),
      destructive: true,
    });
    if (!confirmed) return;
    this.loanChargesService.deleteLoansLoanIdChargesLoanChargeId(this.loanId, row.id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete loan charge', err),
    });
  }
}
