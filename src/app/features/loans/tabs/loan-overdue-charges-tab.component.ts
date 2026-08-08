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

import { Component, computed, input } from '@angular/core';

import { CellTemplateDirective, ColumnDef, DataTableComponent } from '../../../shared';
import { LoanOverdueCharge } from './loan-overdue-charge.model';

/**
 * The charges the platform will apply once this loan falls overdue.
 *
 * What the borrower owes on top of the balance if they miss a due date, which is not derivable
 * from the schedule or the charges tab — those show what has been charged, not what is waiting.
 *
 * Rows come in as an input: `overdueCharges` is already on the loan response.
 */
@Component({
  selector: 'app-loan-overdue-charges-tab',
  standalone: true,
  imports: [DataTableComponent, CellTemplateDirective],
  template: `
    <app-data-table [data]="rows()" [columns]="columns" [localLogic]="true">
      <ng-template appCellTemplate="chargeTimeType" let-row>
        {{ row.chargeTimeType?.value || '-' }}
      </ng-template>
      <ng-template appCellTemplate="chargeCalculationType" let-row>
        {{ row.chargeCalculationType?.value || '-' }}
      </ng-template>
      <ng-template appCellTemplate="penalty" let-row>
        {{ row.penalty ? 'Yes' : 'No' }}
      </ng-template>
    </app-data-table>
  `,
})
export class LoanOverdueChargesTabComponent {
  readonly charges = input<LoanOverdueCharge[] | undefined>([]);

  readonly rows = computed(() => this.charges() ?? []);

  columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME' },
    { key: 'amount', label: 'COMMON.AMOUNT' },
    { key: 'chargeTimeType', label: 'LOANS.CHARGE_TIME' },
    { key: 'chargeCalculationType', label: 'LOANS.CHARGE_CALCULATION' },
    { key: 'penalty', label: 'LOANS.PENALTY' },
  ];
}
