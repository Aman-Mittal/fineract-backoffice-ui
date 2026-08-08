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
import { GetLoansLoanIdLoanTermVariations } from '../../../api';

/**
 * The variations applied to a loan's terms after it was created.
 *
 * This is the audit trail for the question "why does this loan not match its product" — a
 * rescheduling, a changed instalment amount, an extended term. The platform has always returned
 * it on the loan; the screen simply never showed it.
 *
 * Takes its rows as an input rather than fetching: `loanTermVariations` arrives in the
 * `associations=all` response the parent already makes, so a request here would be a second
 * copy of data the page is holding.
 */
@Component({
  selector: 'app-loan-term-variations-tab',
  standalone: true,
  imports: [DataTableComponent, CellTemplateDirective],
  template: `
    <app-data-table [data]="rows()" [columns]="columns" [localLogic]="true">
      <ng-template appCellTemplate="termType" let-row>
        {{ row.termType?.value || '-' }}
      </ng-template>
      <ng-template appCellTemplate="isProcessed" let-row>
        {{ row.isProcessed ? 'Yes' : 'No' }}
      </ng-template>
    </app-data-table>
  `,
})
export class LoanTermVariationsTabComponent {
  readonly variations = input<GetLoansLoanIdLoanTermVariations[] | undefined>([]);

  readonly rows = computed(() => this.variations() ?? []);

  columns: ColumnDef[] = [
    { key: 'termType', label: 'LOANS.TERM_VARIATION_TYPE' },
    { key: 'termVariationApplicableFrom', label: 'LOANS.APPLICABLE_FROM' },
    { key: 'decimalValue', label: 'COMMON.VALUE' },
    { key: 'dateValue', label: 'COMMON.DATE' },
    { key: 'isProcessed', label: 'LOANS.PROCESSED' },
  ];
}
