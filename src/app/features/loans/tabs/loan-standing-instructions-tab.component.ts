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

import { Component, OnInit, inject, input, signal } from '@angular/core';

import { CellTemplateDirective, ColumnDef, DataTableComponent } from '../../../shared';
import { StandingInstructionsService } from '../../../api';

/** Fineract's PortfolioAccountType. A standing instruction's account id means nothing without it. */
const LOAN_ACCOUNT_TYPE = 1;

interface StandingInstructionRow {
  id?: number;
  name?: string;
  amount?: number;
  validFrom?: string;
  status?: { value?: string };
  transferType?: { value?: string };
  fromAccount?: { id?: number; accountNo?: number };
  fromAccountType?: { id?: number };
  toAccount?: { id?: number; accountNo?: number };
  toAccountType?: { id?: number };
  fromClient?: { displayName?: string };
  toClient?: { displayName?: string };
}

/**
 * The standing instructions that move money into or out of this loan.
 *
 * Without this, an instruction paying a loan down automatically shows up only as repayments
 * nobody posted — which reads as an unexplained transaction rather than an arrangement the
 * client set up.
 *
 * Filtered here rather than by the platform, and that is a deliberate compromise:
 * `getStandinginstructions` filters by the *from* account, and an instruction that pays a loan
 * has the loan as its *to* account, so asking the platform for "instructions on this loan"
 * is not a question the endpoint answers. The narrowest available request is by client, and
 * the loan is picked out of the result by account id **and** account type — an id alone is
 * ambiguous, since savings account 7 and loan account 7 both exist.
 */
@Component({
  selector: 'app-loan-standing-instructions-tab',
  standalone: true,
  imports: [DataTableComponent, CellTemplateDirective],
  template: `
    <app-data-table
      [data]="instructions()"
      [columns]="columns"
      [isLoading]="isLoading()"
      [hasError]="hasError()"
      (retry)="load()"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="direction" let-row>
        {{ row.toAccount?.id === loanId() ? 'Into this loan' : 'Out of this loan' }}
      </ng-template>
      <ng-template appCellTemplate="status" let-row>
        {{ row.status?.value || '-' }}
      </ng-template>
      <ng-template appCellTemplate="transferType" let-row>
        {{ row.transferType?.value || '-' }}
      </ng-template>
    </app-data-table>
  `,
})
export class LoanStandingInstructionsTabComponent implements OnInit {
  readonly loanId = input.required<number>();
  readonly clientId = input<number | undefined>(undefined);

  private readonly standingInstructions = inject(StandingInstructionsService);

  readonly instructions = signal<StandingInstructionRow[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME' },
    { key: 'direction', label: 'LOANS.DIRECTION' },
    { key: 'amount', label: 'COMMON.AMOUNT' },
    { key: 'transferType', label: 'LOANS.TRANSFER_TYPE' },
    { key: 'validFrom', label: 'LOANS.VALID_FROM' },
    { key: 'status', label: 'COMMON.STATUS' },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const clientId = this.clientId();
    if (!clientId) {
      this.instructions.set([]);
      return;
    }

    this.isLoading.set(true);
    // Positional arguments, and easy to get wrong: the signature is
    // (externalId, offset, limit, orderBy, sortOrder, transferType, clientName, clientId, ...),
    // so `clientId` is the eighth. Passing it in the wrong slot still compiles, because the
    // generated types are all optional primitives.
    this.standingInstructions
      .getStandinginstructions(
        undefined,
        0,
        200,
        undefined,
        undefined,
        undefined,
        undefined,
        clientId,
      )
      .subscribe({
        next: (page) => {
          const rows = [...((page?.pageItems as Iterable<StandingInstructionRow>) ?? [])];
          this.instructions.set(rows.filter((row) => this.touchesThisLoan(row)));
          this.hasError.set(false);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  private touchesThisLoan(row: StandingInstructionRow): boolean {
    const paysIn =
      row.toAccountType?.id === LOAN_ACCOUNT_TYPE && row.toAccount?.id === this.loanId();
    const paysOut =
      row.fromAccountType?.id === LOAN_ACCOUNT_TYPE && row.fromAccount?.id === this.loanId();
    return paysIn || paysOut;
  }
}
