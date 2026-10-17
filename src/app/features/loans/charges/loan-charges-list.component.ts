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
import { I18N, TranslatePipe } from '../../../core/adapters';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { LoanChargesService, GetLoansLoanIdChargesChargeIdResponse } from '../../../api';
import { DialogService } from '../../../core/services/dialog.service';
import { CHARGE_COMMAND_PERMISSIONS } from '../../../core/guards/command-permissions';
import { NotificationService } from '../../../core/services/notification.service';
import { toIsoDate } from '../../../core/utils/date-formatter';
import { RequiresPermissionDirective } from '../../../shared/directives/requires-permission.directive';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { ButtonComponent } from '../../../ui/button/button.component';

/** Fineract parses the dates these commands send against this format. */
const DATE_FORMAT = 'yyyy-MM-dd';
const LOCALE = 'en';

/**
 * Whether a charge still has something to pay, waive or adjust.
 *
 * `amountOutstanding` rather than the `paid` flag the delete action reads: a partly paid charge
 * is neither paid nor fully settled, and it is exactly the one that can still be waived.
 */
function outstanding(charge: GetLoansLoanIdChargesChargeIdResponse): number {
  return charge.amountOutstanding ?? 0;
}

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
        @if (isOutstanding(row)) {
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
  readonly charges = signal<GetLoansLoanIdChargesChargeIdResponse[]>([]);

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

  isOutstanding(row: GetLoansLoanIdChargesChargeIdResponse): boolean {
    return outstanding(row) > 0;
  }

  /**
   * Pays a charge on the date the user gives.
   *
   * The date is asked for rather than assumed to be today, because a charge is often paid
   * against a date already past — and because the tenant's business date can be behind the
   * browser's, which is issue #758. The platform demands it:
   * `validation.msg.loan.charge.payment.transaction.transactionDate.cannot.be.blank`.
   */
  async onPay(row: GetLoansLoanIdChargesChargeIdResponse): Promise<void> {
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
          value: toIsoDate(new Date()),
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
  async onWaive(row: GetLoansLoanIdChargesChargeIdResponse): Promise<void> {
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

  /** Adjusts a charge to a different amount. `adjustment` takes the amount and nothing else. */
  async onAdjust(row: GetLoansLoanIdChargesChargeIdResponse): Promise<void> {
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

    this.send(row, 'adjustment', {
      amount: Number(values['amount']),
      locale: LOCALE,
      dateFormat: DATE_FORMAT,
    });
  }

  /**
   * Issues one charge command and reloads.
   *
   * The reload is unconditional on success because every one of these changes the row it was
   * issued from — a paid charge's outstanding falls, a waived one's goes to zero — and a stale
   * row would keep offering actions the platform has just refused.
   */
  private send(
    row: GetLoansLoanIdChargesChargeIdResponse,
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

  async onDelete(row: GetLoansLoanIdChargesChargeIdResponse): Promise<void> {
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
