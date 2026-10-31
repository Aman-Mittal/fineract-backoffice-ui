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

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  TranslatePipe,
  WORKING_CAPITAL_PORTFOLIO_API,
  summarisePortfolio,
  type WorkingCapitalLoanSnapshot,
} from '../../../core/adapters';
import { LoadErrorComponent } from '../../../shared';
import { SpinnerComponent } from '../../../ui/spinner/spinner.component';

/**
 * The working-capital book at portfolio level.
 *
 * Every other screen in this module is one loan or one piece of reference data, so nothing told
 * an operator what the book as a whole looks like: how much is outstanding, how much of it is
 * delinquent, and how that delinquency ages. This is the only screen that reads across loans.
 *
 * It states figures the platform states per loan and adds them up — see `summarisePortfolio`,
 * which holds the arithmetic and is tested on its own. In particular it does not claim which
 * loans are "in breach": that is a judgement the module's payload does not make, and the one
 * breach figure it does name (`breachPastDueAmount`) is reported under that name.
 */
@Component({
  selector: 'app-wc-portfolio-overview',
  standalone: true,
  imports: [RouterModule, DecimalPipe, TranslatePipe, LoadErrorComponent, SpinnerComponent],
  template: `
    <div class="overview-container">
      <h1 class="page-title">{{ 'WC_PORTFOLIO.TITLE' | appTranslate }}</h1>

      @if (loadError()) {
        <app-load-error
          testId="wc-portfolio-load-error"
          [message]="'WC_PORTFOLIO.LOAD_FAILED' | appTranslate"
          [actionLabel]="'COMMON.RETRY' | appTranslate"
          (action)="load()"
        ></app-load-error>
      } @else if (isLoading()) {
        <app-spinner data-testid="wc-portfolio-loading" />
      } @else if (summary().loans === 0) {
        <section class="panel">
          <p class="panel-body" data-testid="wc-portfolio-empty">
            {{ 'WC_PORTFOLIO.EMPTY' | appTranslate }}
          </p>
        </section>
      } @else {
        <div class="tiles">
          <section class="tile" data-testid="wc-tile-loans">
            <h2 class="tile-label">{{ 'WC_PORTFOLIO.LOANS' | appTranslate }}</h2>
            <div class="tile-body">
              <span class="figure">{{ summary().loans | number }}</span>
            </div>
          </section>

          <section class="tile" data-testid="wc-tile-outstanding">
            <h2 class="tile-label">{{ 'WC_PORTFOLIO.OUTSTANDING' | appTranslate }}</h2>
            <div class="tile-body">
              <span class="figure">{{ summary().outstanding | number: '1.2-2' }}</span>
              <span class="currency">{{ currencyLabel() }}</span>
            </div>
          </section>

          <section class="tile" data-testid="wc-tile-delinquent">
            <h2 class="tile-label">{{ 'WC_PORTFOLIO.DELINQUENT' | appTranslate }}</h2>
            <div class="tile-body">
              <span class="figure">{{ summary().delinquentAmount | number: '1.2-2' }}</span>
              <span class="detail">{{
                'WC_PORTFOLIO.ACROSS_LOANS' | appTranslate: { count: summary().delinquentLoans }
              }}</span>
            </div>
          </section>

          <section class="tile" data-testid="wc-tile-breach-past-due">
            <h2 class="tile-label">{{ 'WC_PORTFOLIO.BREACH_PAST_DUE' | appTranslate }}</h2>
            <div class="tile-body">
              <span class="figure">{{ summary().breachPastDueAmount | number: '1.2-2' }}</span>
              <span class="detail">{{
                'WC_PORTFOLIO.ACROSS_LOANS' | appTranslate: { count: summary().breachPastDueLoans }
              }}</span>
            </div>
          </section>

          <section class="tile" data-testid="wc-tile-flagged">
            <h2 class="tile-label">{{ 'WC_PORTFOLIO.FLAGGED' | appTranslate }}</h2>
            <div class="tile-body">
              <span class="figure">{{ summary().chargedOffLoans | number }}</span>
              <span class="detail">{{
                'WC_PORTFOLIO.CHARGED_OFF_AND_FRAUD' | appTranslate: { fraud: summary().fraudLoans }
              }}</span>
            </div>
          </section>
        </div>

        <section class="panel">
          <h2 class="panel-title">{{ 'WC_PORTFOLIO.AGING_TITLE' | appTranslate }}</h2>
          <div class="panel-body">
            <table class="overview-table" data-testid="wc-portfolio-aging">
              <caption class="sr-only">
                {{
                  'WC_PORTFOLIO.AGING_TITLE' | appTranslate
                }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ 'WC_PORTFOLIO.AGING_BAND' | appTranslate }}</th>
                  <th scope="col" class="numeric">{{ 'WC_PORTFOLIO.LOANS' | appTranslate }}</th>
                  <th scope="col" class="numeric">
                    {{ 'WC_PORTFOLIO.OUTSTANDING' | appTranslate }}
                  </th>
                  <th scope="col" class="numeric">
                    {{ 'WC_PORTFOLIO.DELINQUENT' | appTranslate }}
                  </th>
                </tr>
              </thead>
              <tbody>
                @for (row of summary().aging; track row.key) {
                  <tr [attr.data-testid]="'wc-aging-' + row.key">
                    <th scope="row">{{ row.labelKey | appTranslate }}</th>
                    <td class="numeric">{{ row.loans | number }}</td>
                    <td class="numeric">{{ row.outstanding | number: '1.2-2' }}</td>
                    <td class="numeric">{{ row.delinquentAmount | number: '1.2-2' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel">
          <h2 class="panel-title">{{ 'WC_PORTFOLIO.BY_STATUS' | appTranslate }}</h2>
          <div class="panel-body">
            <table class="overview-table" data-testid="wc-portfolio-status">
              <caption class="sr-only">
                {{
                  'WC_PORTFOLIO.BY_STATUS' | appTranslate
                }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ 'WC_LOANS.STATUS' | appTranslate }}</th>
                  <th scope="col" class="numeric">{{ 'WC_PORTFOLIO.LOANS' | appTranslate }}</th>
                  <th scope="col" class="numeric">
                    {{ 'WC_PORTFOLIO.OUTSTANDING' | appTranslate }}
                  </th>
                </tr>
              </thead>
              <tbody>
                @for (row of summary().byStatus; track row.status) {
                  <tr>
                    <th scope="row">
                      {{ row.status || ('WC_PORTFOLIO.STATUS_UNKNOWN' | appTranslate) }}
                    </th>
                    <td class="numeric">{{ row.loans | number }}</td>
                    <td class="numeric">{{ row.outstanding | number: '1.2-2' }}</td>
                  </tr>
                }
              </tbody>
            </table>
            <a class="all-loans" routerLink="/working-capital/loans" data-testid="wc-all-loans">
              {{ 'WC_PORTFOLIO.VIEW_ALL_LOANS' | appTranslate }}
            </a>
          </div>
        </section>
      }
    </div>
  `,
  styles: [
    `
      .overview-container {
        padding: 24px;
        max-width: 1100px;
        margin: 0 auto;
      }
      .page-title {
        font-size: 1.4rem;
        margin: 0 0 16px;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
        gap: 12px;
        margin-bottom: 16px;
      }
      .tile,
      .panel {
        background: var(--ion-card-background, #fff);
        border: 1px solid var(--ion-color-light-shade, #d7d8da);
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 16px;
      }
      .tile-label,
      .panel-title {
        font-size: 0.85rem;
        font-weight: 600;
        margin: 0 0 8px;
        color: var(--ion-color-medium-shade, #808289);
      }
      .panel-title {
        font-size: 1rem;
        color: inherit;
      }
      .figure {
        display: block;
        font-size: 1.5rem;
        font-weight: 600;
      }
      .currency,
      .detail {
        display: block;
        font-size: 0.8125rem;
        color: var(--ion-color-medium, #92949c);
      }
      .overview-table {
        width: 100%;
        border-collapse: collapse;
      }
      .overview-table th,
      .overview-table td {
        text-align: start;
        padding: 8px 12px;
        border-bottom: 1px solid var(--ion-color-light-shade, #d7d8da);
      }
      .overview-table .numeric {
        text-align: end;
        font-variant-numeric: tabular-nums;
      }
      .all-loans {
        display: inline-block;
        margin-top: 12px;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }
    `,
  ],
})
export class WcPortfolioOverviewComponent implements OnInit {
  private readonly portfolio = inject(WORKING_CAPITAL_PORTFOLIO_API);

  readonly loans = signal<WorkingCapitalLoanSnapshot[]>([]);
  readonly isLoading = signal(false);
  readonly loadError = signal(false);

  readonly summary = computed(() => summarisePortfolio(this.loans()));

  /** Blank on a mixed-currency book, where a single code would mislabel the totals. */
  readonly currencyLabel = computed(() => this.summary().currencyCode ?? '');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.loadError.set(false);
    this.portfolio.listLoans().subscribe({
      next: (loans) => {
        this.loans.set(loans);
        this.isLoading.set(false);
      },
      error: () => {
        // An empty overview and a failed one look identical once the spinner stops, and this
        // screen's whole job is to be trusted as a total.
        this.loans.set([]);
        this.loadError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}
