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

import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';

import { WorkingCapitalLoansService } from '../../../api';
import type { GetWorkingCapitalLoansLoanIdResponse } from '../../../api';
import type {
  WorkingCapitalLoanSnapshot,
  WorkingCapitalPortfolioApi,
} from './working-capital-portfolio.api';

/**
 * Maps one generated working-capital loan onto the portfolio snapshot.
 *
 * Exported for its own test, and the mapping is where an upstream shape change is meant to
 * surface rather than in a total on a dashboard.
 *
 * Every numeric field resolves to a number here. The generated type marks all of them optional
 * because the spec marks nothing required, and a portfolio view adds them up — one `undefined`
 * turns a column of figures into `NaN`, which renders as "NaN" beside real money.
 */
export function mapWorkingCapitalLoanSnapshot(
  response: GetWorkingCapitalLoansLoanIdResponse,
): WorkingCapitalLoanSnapshot {
  return {
    id: required(response.id, 'id'),
    accountNo: response.accountNo ?? '',
    clientId: response.client?.id ?? response.clientId ?? null,
    clientName: response.client?.displayName ?? response.clientName ?? null,
    status: response.status?.value ?? null,
    currencyCode: response.currency?.code ?? null,
    // The loans list shows the approved figure once there is one and the proposal before that,
    // which is the same precedence the existing list screen uses.
    principal: response.approvedPrincipal ?? response.proposedPrincipal ?? 0,
    outstanding: response.summary?.totalOutstanding ?? 0,
    delinquentAmount: response.delinquent?.delinquentAmount ?? 0,
    delinquentDays: response.delinquent?.delinquentDays ?? 0,
    breachPastDueAmount: response.balance?.breachPastDueAmount ?? 0,
    chargedOff: response.chargedOff === true,
    fraud: response.fraud === true,
  };
}

/**
 * `id` is the one field that cannot be defaulted: every row links to a loan, and a zero would
 * route the operator to a loan that does not exist rather than report the problem.
 */
function required<T>(value: T | undefined, field: string): T {
  if (value === undefined || value === null) {
    throw new Error(`Fineract returned a working-capital loan with no ${field}`);
  }
  return value;
}

@Injectable({ providedIn: 'root' })
export class FineractWorkingCapitalPortfolioApi implements WorkingCapitalPortfolioApi {
  private readonly loans = inject(WorkingCapitalLoansService);

  listLoans(): Observable<WorkingCapitalLoanSnapshot[]> {
    // `content` rather than `pageItems`: this endpoint answers a Spring page, which is why the
    // existing list screen reads the same field.
    return this.loans
      .getWorkingCapitalLoans()
      .pipe(map((page) => (page.content ?? []).map(mapWorkingCapitalLoanSnapshot)));
  }
}
