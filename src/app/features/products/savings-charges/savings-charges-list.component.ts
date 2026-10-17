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
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { DialogService } from '../../../core/services/dialog.service';
import { toIsoDate } from '../../../core/utils/date-formatter';
import { ButtonComponent } from '../../../ui/button/button.component';
import {
  SavingsChargesService,
  GetSavingsAccountsSavingsAccountIdChargesResponse,
} from '../../../api';
import { CHARGE_COMMAND_PERMISSIONS } from '../../../core/guards/command-permissions';
import { NotificationService } from '../../../core/services/notification.service';
import { RequiresPermissionDirective } from '../../../shared/directives/requires-permission.directive';

/** Fineract parses `dueDate` against this format. */
const DATE_FORMAT = 'yyyy-MM-dd';
const LOCALE = 'en';

/**
 * Lists the charges attached to a single savings account, and services them.
 *
 * The account id is read from the route snapshot; every action operates within that account's
 * charge collection.
 *
 * Pay, Waive and Inactivate are offered per row, each gated on its own permission. Before this
 * a savings charge could only be added or deleted, so there was no remedy at all for one
 * applied in error (issue #754). The commands are the platform's own spellings — a savings
 * charge is paid with `paycharge`, not `pay`, which is how a loan charge is paid — and `pay`
 * is the only one with a body: `amount` and `dueDate`, both demanded.
 */
@Component({
  selector: 'app-savings-charges-list',
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
      title="SAVINGS_CHARGES.TITLE"
      helpTextKey="HELP.SAVINGS_CHARGES_DESC"
      createButtonLabel="SAVINGS_CHARGES.CREATE"
      createPermission="UPDATE_SAVINGSACCOUNT"
      [columns]="columns"
      [data]="charges()"
      [totalRecords]="charges().length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="actions" let-row>
        @if (isOutstanding(row)) {
          <app-button
            type="button"
            emphasis="quiet"
            data-testid="savings-charge-pay"
            [label]="'CHARGES.PAY' | appTranslate"
            icon="cash-outline"
            [appTooltip]="'CHARGES.PAY' | appTranslate"
            [appRequiresPermission]="permissions.paycharge"
            (click)="onPay(row)"
          />
          <app-button
            type="button"
            emphasis="quiet"
            data-testid="savings-charge-waive"
            [label]="'CHARGES.WAIVE' | appTranslate"
            icon="remove-circle-outline"
            [appTooltip]="'CHARGES.WAIVE' | appTranslate"
            [appRequiresPermission]="permissions.waive"
            (click)="onWaive(row)"
          />
        }
        <!-- Not gated on an active flag: the charge response type declares none, so the row
             cannot tell whether this charge is already inactive. The platform answers a
             domain-rule violation for one that is, which surfaces as the error toast — a
             worse signal than a hidden button, but better than hiding the action on a guess
             about a field that may not be sent. -->
        <app-button
          type="button"
          emphasis="quiet"
          data-testid="savings-charge-inactivate"
          [label]="'CHARGES.INACTIVATE' | appTranslate"
          icon="pause-circle-outline"
          [appTooltip]="'CHARGES.INACTIVATE' | appTranslate"
          [appRequiresPermission]="permissions.inactivate"
          (click)="onInactivate(row)"
        />
        <app-button
          type="button"
          intent="danger"
          emphasis="quiet"
          [label]="'COMMON.DELETE' | appTranslate"
          icon="trash-outline"
          [appTooltip]="'COMMON.DELETE' | appTranslate"
          (click)="onDelete(row)"
        />
      </ng-template>
    </app-data-table>
  `,
})
export class SavingsChargesListComponent implements OnInit {
  private readonly savingsChargesService = inject(SavingsChargesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly notifications = inject(NotificationService);
  private readonly i18n = inject(I18N);

  /** For the template's gates, which need the codes as values. */
  readonly permissions = CHARGE_COMMAND_PERMISSIONS.savings;

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'SAVINGS_CHARGES.NAME', sortable: true },
    { key: 'amount', label: 'SAVINGS_CHARGES.AMOUNT', sortable: true },
    { key: 'amountOutstanding', label: 'SAVINGS_CHARGES.AMOUNT_OUTSTANDING', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  savingsAccountId!: number;
  readonly charges = signal<GetSavingsAccountsSavingsAccountIdChargesResponse[]>([]);

  ngOnInit(): void {
    this.savingsAccountId = Number(this.route.snapshot.paramMap.get('savingsAccountId'));
    this.load();
  }

  load(): void {
    this.savingsChargesService
      .getSavingsaccountsSavingsAccountIdCharges(this.savingsAccountId)
      .subscribe({
        next: (data: GetSavingsAccountsSavingsAccountIdChargesResponse[]) => {
          this.charges.set(data || []);
        },
        error: (err: unknown) => console.error('Failed to load savings charges', err),
      });
  }

  onCreate(): void {
    this.router.navigate([
      '/products/savings-accounts',
      this.savingsAccountId,
      'charges',
      'create',
    ]);
  }

  isOutstanding(row: GetSavingsAccountsSavingsAccountIdChargesResponse): boolean {
    return (row.amountOutstanding ?? 0) > 0;
  }

  /**
   * Pays a charge.
   *
   * Both fields are asked for because the platform demands both —
   * `validation.msg.savingsaccountcharge.amount.cannot.be.blank` names `amount` and `dueDate`
   * together — and because a part payment is a legitimate thing to make, so the amount is
   * offered as the outstanding balance rather than fixed to it.
   */
  async onPay(row: GetSavingsAccountsSavingsAccountIdChargesResponse): Promise<void> {
    const values = await this.dialogService.prompt({
      title: this.i18n.translate('CHARGES.PAY'),
      message: this.i18n.translate('CHARGES.CONFIRM_PAY', {
        name: row.name ?? '',
        amount: row.amountOutstanding ?? 0,
      }),
      fields: [
        {
          name: 'amount',
          label: this.i18n.translate('COMMON.AMOUNT'),
          type: 'number',
          value: row.amountOutstanding ?? 0,
        },
        {
          name: 'dueDate',
          label: this.i18n.translate('SAVINGS_CHARGES.DUE_DATE'),
          type: 'date',
          value: toIsoDate(new Date()),
        },
      ],
    });
    if (!values) return;

    this.send(row, 'paycharge', {
      amount: Number(values['amount']),
      dueDate: String(values['dueDate']),
      dateFormat: DATE_FORMAT,
      locale: LOCALE,
    });
  }

  /** Waives a charge. No body: the platform waives what is outstanding. */
  async onWaive(row: GetSavingsAccountsSavingsAccountIdChargesResponse): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: this.i18n.translate('CHARGES.WAIVE'),
      message: this.i18n.translate('CHARGES.CONFIRM_WAIVE', {
        name: row.name ?? '',
        amount: row.amountOutstanding ?? 0,
      }),
      destructive: true,
    });
    if (!confirmed) return;

    this.send(row, 'waive', {});
  }

  /**
   * Stops a recurring charge being applied, without deleting what it has already collected.
   *
   * Distinct from both waive and delete: a waiver settles the amount outstanding now, and a
   * delete is refused once anything has been paid. This is the one that ends an annual fee.
   */
  async onInactivate(row: GetSavingsAccountsSavingsAccountIdChargesResponse): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: this.i18n.translate('CHARGES.INACTIVATE'),
      message: this.i18n.translate('CHARGES.CONFIRM_INACTIVATE', { name: row.name ?? '' }),
      destructive: true,
    });
    if (!confirmed) return;

    this.send(row, 'inactivate', {});
  }

  private send(
    row: GetSavingsAccountsSavingsAccountIdChargesResponse,
    command: keyof typeof CHARGE_COMMAND_PERMISSIONS.savings,
    body: Record<string, unknown>,
  ): void {
    if (!row.id) return;
    this.savingsChargesService
      .postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId(
        this.savingsAccountId,
        row.id,
        body,
        command,
      )
      .subscribe({
        next: () => {
          this.notifications.success(this.i18n.translate('CHARGES.SAVED'));
          this.load();
        },
        error: (err: unknown) => {
          console.error(`Failed to ${command} savings charge`, err);
          this.notifications.error(this.i18n.translate('CHARGES.FAILED'));
        },
      });
  }

  async onDelete(row: GetSavingsAccountsSavingsAccountIdChargesResponse): Promise<void> {
    if (!row.id) return;
    const confirmed = await this.dialogService.confirm({
      title: this.i18n.translate('SAVINGS_CHARGES.DELETE'),
      message: this.i18n.translate('SAVINGS_CHARGES.CONFIRM_DELETE', {
        name: row.name ?? '',
        amount: row.amount ?? '',
      }),
      destructive: true,
    });
    if (!confirmed) return;
    this.savingsChargesService
      .deleteSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId(
        this.savingsAccountId,
        row.id,
      )
      .subscribe({
        next: () => this.load(),
        error: (err: unknown) => console.error('Failed to delete savings charge', err),
      });
  }
}
