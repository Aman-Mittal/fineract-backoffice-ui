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
import { ClientChargesService, GetClientsChargesPageItems } from '../../../api';
import { CHARGE_COMMAND_PERMISSIONS } from '../../../core/guards/command-permissions';
import { DialogService } from '../../../core/services/dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { formatArrayDate, toIsoDate } from '../../../core/utils/date-formatter';
import { RequiresPermissionDirective } from '../../../shared/directives/requires-permission.directive';

/** Fineract parses `transactionDate` against this format. */
const DATE_FORMAT = 'yyyy-MM-dd';
const LOCALE = 'en';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { ButtonComponent } from '../../../ui/button/button.component';

/**
 * Lists the charges attached to a single client, and services them.
 *
 * The client id is read from the route snapshot; every action operates within that client's
 * charge collection.
 *
 * Pay and Waive are offered per row, gated on their own permissions and on the charge still
 * having something outstanding. A client charge had no remedy at all before this (issue #754),
 * and the pair here is smaller than the loan's: the platform offers no adjustment for a client
 * charge, so there is none to show.
 */
@Component({
  selector: 'app-client-charges-list',
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
      title="CLIENT_CHARGES.TITLE"
      helpTextKey="HELP.CLIENT_CHARGES_DESC"
      createButtonLabel="CLIENT_CHARGES.CREATE"
      createPermission="CREATE_CLIENTCHARGE"
      [columns]="columns"
      [data]="charges()"
      [totalRecords]="charges().length"
      [hasError]="hasError()"
      [localLogic]="true"
      (create)="onCreate()"
      (retry)="onRetry()"
    >
      <ng-template appCellTemplate="dueDate" let-row>
        {{ formatDate(row.dueDate) }}
      </ng-template>
      <ng-template appCellTemplate="amountPaid" let-row>
        {{ row.amountPaid ?? 0 }}
      </ng-template>
      <ng-template appCellTemplate="amountOutstanding" let-row>
        {{ row.amountOutstanding ?? 0 }}
      </ng-template>
      <ng-template appCellTemplate="actions" let-row>
        @if (isOutstanding(row)) {
          <app-button
            type="button"
            emphasis="quiet"
            data-testid="client-charge-pay"
            [label]="'CHARGES.PAY' | appTranslate"
            icon="cash-outline"
            [appTooltip]="'CHARGES.PAY' | appTranslate"
            [appRequiresPermission]="permissions.paycharge"
            (click)="onPay(row)"
          />
          <app-button
            type="button"
            emphasis="quiet"
            data-testid="client-charge-waive"
            [label]="'CHARGES.WAIVE' | appTranslate"
            icon="remove-circle-outline"
            [appTooltip]="'CHARGES.WAIVE' | appTranslate"
            [appRequiresPermission]="permissions.waive"
            (click)="onWaive(row)"
          />
        }
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
export class ClientChargesListComponent implements OnInit {
  private readonly clientChargesService = inject(ClientChargesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly notifications = inject(NotificationService);
  private readonly i18n = inject(I18N);

  /** For the template's gates, which need the codes as values. */
  readonly permissions = CHARGE_COMMAND_PERMISSIONS.client;

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'CLIENT_CHARGES.NAME', sortable: true },
    { key: 'amount', label: 'CLIENT_CHARGES.AMOUNT', sortable: true },
    { key: 'dueDate', label: 'CLIENT_CHARGES.DUE_DATE', sortable: false },
    { key: 'amountPaid', label: 'CLIENT_CHARGES.PAID', sortable: false },
    { key: 'amountOutstanding', label: 'CLIENT_CHARGES.OUTSTANDING', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  clientId!: number;
  readonly charges = signal<GetClientsChargesPageItems[]>([]);
  readonly hasError = signal(false);

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.load();
  }

  load(): void {
    this.clientChargesService.getClientsClientIdCharges(this.clientId).subscribe({
      next: (data) => {
        this.charges.set(data?.pageItems ? Array.from(data.pageItems) : []);
        this.hasError.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load client charges', err);
        this.hasError.set(true);
      },
    });
  }

  onRetry(): void {
    this.load();
  }

  formatDate(value: unknown): string {
    return formatArrayDate(value);
  }

  onCreate(): void {
    this.router.navigate(['/clients', this.clientId, 'charges', 'create']);
  }

  isOutstanding(row: GetClientsChargesPageItems): boolean {
    return (row.amountOutstanding ?? 0) > 0;
  }

  /**
   * Pays a charge.
   *
   * `amount` and `transactionDate` are both demanded —
   * `validation.msg.CLIENTCHARGE.amount.cannot.be.blank` names them together — and the amount
   * is offered rather than fixed, because a part payment is a legitimate thing to make.
   */
  async onPay(row: GetClientsChargesPageItems): Promise<void> {
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
          name: 'transactionDate',
          label: this.i18n.translate('COMMON.TRANSACTION_DATE'),
          type: 'date',
          value: toIsoDate(new Date()),
        },
      ],
    });
    if (!values) return;

    this.send(row, 'paycharge', {
      amount: Number(values['amount']),
      transactionDate: String(values['transactionDate']),
      dateFormat: DATE_FORMAT,
      locale: LOCALE,
    });
  }

  /** Waives a charge. No body: the platform waives what is outstanding. */
  async onWaive(row: GetClientsChargesPageItems): Promise<void> {
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

  private send(
    row: GetClientsChargesPageItems,
    command: keyof typeof CHARGE_COMMAND_PERMISSIONS.client,
    body: Record<string, unknown>,
  ): void {
    if (!row.id) return;
    this.clientChargesService
      .postClientsClientIdChargesChargeId(this.clientId, row.id, body, command)
      .subscribe({
        next: () => {
          this.notifications.success(this.i18n.translate('CHARGES.SAVED'));
          this.load();
        },
        error: (err: unknown) => {
          console.error(`Failed to ${command} client charge`, err);
          this.notifications.error(this.i18n.translate('CHARGES.FAILED'));
        },
      });
  }

  async onDelete(row: GetClientsChargesPageItems): Promise<void> {
    if (!row.id) return;
    const confirmed = await this.dialogService.confirm({
      title: this.i18n.translate('COMMON.DELETE'),
      message: this.i18n.translate('CLIENT_CHARGES.CONFIRM_DELETE', {
        name: row.name ?? '',
        amount: row.amount ?? '',
        dueDate: this.formatDate(row.dueDate),
      }),
      destructive: true,
    });
    if (!confirmed) return;
    this.clientChargesService
      .deleteClientsClientIdChargesChargeId(this.clientId, row.id)
      .subscribe({
        next: () => this.load(),
        error: (err: unknown) => console.error('Failed to delete client charge', err),
      });
  }
}
