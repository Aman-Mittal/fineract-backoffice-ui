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

import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'loan',
    loadComponent: () =>
      import('./loan-products-list.component').then((m) => m.LoanProductsListComponent),
  },
  {
    path: 'loan/create',
    loadComponent: () =>
      import('./loan-product-form.component').then((m) => m.LoanProductFormComponent),
  },
  {
    path: 'loan/edit/:id',
    loadComponent: () =>
      import('./loan-product-form.component').then((m) => m.LoanProductFormComponent),
  },
  {
    path: 'loan/view/:id',
    loadComponent: () =>
      import('./loan-product-view.component').then((m) => m.LoanProductViewComponent),
  },
  {
    path: 'savings',
    loadComponent: () =>
      import('./savings-products-list.component').then((m) => m.SavingsProductsListComponent),
  },
  {
    path: 'savings/create',
    loadComponent: () =>
      import('./savings-product-form.component').then((m) => m.SavingsProductFormComponent),
  },
  {
    path: 'savings/edit/:id',
    loadComponent: () =>
      import('./savings-product-form.component').then((m) => m.SavingsProductFormComponent),
  },
  {
    path: 'fixed',
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-products-list.component').then(
        (m) => m.FixedDepositProductsListComponent,
      ),
  },
  {
    path: 'fixed/create',
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-product-form.component').then(
        (m) => m.FixedDepositProductFormComponent,
      ),
  },
  {
    path: 'fixed/edit/:id',
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-product-form.component').then(
        (m) => m.FixedDepositProductFormComponent,
      ),
  },
  {
    path: 'recurring',
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposit-products-list.component').then(
        (m) => m.RecurringDepositProductsListComponent,
      ),
  },
  {
    path: 'recurring/create',
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposit-product-form.component').then(
        (m) => m.RecurringDepositProductFormComponent,
      ),
  },
  {
    path: 'recurring/edit/:id',
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposit-product-form.component').then(
        (m) => m.RecurringDepositProductFormComponent,
      ),
  },
  {
    path: 'share',
    loadComponent: () =>
      import('./shares/share-products-list.component').then((m) => m.ShareProductsListComponent),
  },
  {
    path: 'share/create',
    loadComponent: () =>
      import('./shares/share-product-form.component').then((m) => m.ShareProductFormComponent),
  },
  {
    path: 'share/edit/:id',
    loadComponent: () =>
      import('./shares/share-product-form.component').then((m) => m.ShareProductFormComponent),
  },
  {
    path: 'tax-components',
    loadComponent: () =>
      import('./tax-components/tax-components-list.component').then(
        (m) => m.TaxComponentsListComponent,
      ),
  },
  {
    path: 'tax-components/create',
    loadComponent: () =>
      import('./tax-components/tax-component-form.component').then(
        (m) => m.TaxComponentFormComponent,
      ),
  },
  {
    path: 'tax-components/edit/:id',
    loadComponent: () =>
      import('./tax-components/tax-component-form.component').then(
        (m) => m.TaxComponentFormComponent,
      ),
  },
  {
    path: 'tax-groups',
    loadComponent: () =>
      import('./tax-groups/tax-groups-list.component').then((m) => m.TaxGroupsListComponent),
  },
  {
    path: 'tax-groups/create',
    loadComponent: () =>
      import('./tax-groups/tax-group-form.component').then((m) => m.TaxGroupFormComponent),
  },
  {
    path: 'tax-groups/edit/:id',
    loadComponent: () =>
      import('./tax-groups/tax-group-form.component').then((m) => m.TaxGroupFormComponent),
  },
  {
    path: 'floating-rates',
    loadComponent: () =>
      import('./floating-rates/floating-rates-list.component').then(
        (m) => m.FloatingRatesListComponent,
      ),
  },
  {
    path: 'floating-rates/create',
    loadComponent: () =>
      import('./floating-rates/floating-rate-form.component').then(
        (m) => m.FloatingRateFormComponent,
      ),
  },
  {
    path: 'floating-rates/edit/:id',
    loadComponent: () =>
      import('./floating-rates/floating-rate-form.component').then(
        (m) => m.FloatingRateFormComponent,
      ),
  },
  {
    path: 'savings-accounts',
    loadComponent: () =>
      import('./savings-accounts-list.component').then((m) => m.SavingsAccountsListComponent),
  },
  {
    path: 'savings-accounts/create',
    loadComponent: () =>
      import('./savings-account-form.component').then((m) => m.SavingsAccountFormComponent),
  },
  {
    path: 'savings-accounts/edit/:id',
    loadComponent: () =>
      import('./savings-account-form.component').then((m) => m.SavingsAccountFormComponent),
  },
  {
    path: 'savings-accounts/view/:id',
    loadComponent: () =>
      import('./savings-account-view.component').then((m) => m.SavingsAccountViewComponent),
  },
  {
    path: 'savings-accounts/:accountId/transactions/:command',
    loadComponent: () =>
      import('./savings-account-transaction-form.component').then(
        (m) => m.SavingsAccountTransactionFormComponent,
      ),
  },
  {
    path: 'fixed-deposits',
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposits-list.component').then(
        (m) => m.FixedDepositAccountsListComponent,
      ),
  },
  {
    path: 'fixed-deposits/create',
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-form.component').then(
        (m) => m.FixedDepositAccountFormComponent,
      ),
  },
  {
    path: 'fixed-deposits/edit/:id',
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-form.component').then(
        (m) => m.FixedDepositAccountFormComponent,
      ),
  },
  {
    path: 'fixed-deposits/view/:id',
    loadComponent: () =>
      import('./deposit-account-view.component').then((m) => m.DepositAccountViewComponent),
  },
  {
    path: 'recurring-deposits',
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposits-list.component').then(
        (m) => m.RecurringDepositsListComponent,
      ),
  },
  {
    path: 'recurring-deposits/create',
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposit-form.component').then(
        (m) => m.RecurringDepositAccountFormComponent,
      ),
  },
  {
    path: 'recurring-deposits/edit/:id',
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposit-form.component').then(
        (m) => m.RecurringDepositAccountFormComponent,
      ),
  },
  {
    path: 'recurring-deposits/view/:id',
    loadComponent: () =>
      import('./deposit-account-view.component').then((m) => m.DepositAccountViewComponent),
  },
  {
    path: 'shares',
    loadComponent: () =>
      import('./shares/share-accounts-list.component').then((m) => m.ShareAccountsListComponent),
  },
  {
    path: 'shares/create',
    loadComponent: () =>
      import('./shares/share-account-form.component').then((m) => m.ShareAccountFormComponent),
  },
  {
    path: 'shares/edit/:id',
    loadComponent: () =>
      import('./shares/share-account-form.component').then((m) => m.ShareAccountFormComponent),
  },
  {
    path: ':accountType/:accountId/action/:command',
    loadComponent: () =>
      import('./account-action-form.component').then((m) => m.AccountActionFormComponent),
  },
  {
    path: 'rates',
    loadComponent: () => import('./rates/rates-list.component').then((m) => m.RatesListComponent),
  },
  {
    path: 'rates/create',
    loadComponent: () => import('./rates/rate-form.component').then((m) => m.RateFormComponent),
  },
  {
    path: 'rates/edit/:id',
    loadComponent: () => import('./rates/rate-form.component').then((m) => m.RateFormComponent),
  },
  {
    path: 'interest-rate-charts',
    loadComponent: () =>
      import('./interest-rate-charts/interest-rate-charts-list.component').then(
        (m) => m.InterestRateChartsListComponent,
      ),
  },
  {
    path: 'interest-rate-charts/create',
    loadComponent: () =>
      import('./interest-rate-charts/interest-rate-chart-form.component').then(
        (m) => m.InterestRateChartFormComponent,
      ),
  },
  {
    path: 'interest-rate-charts/edit/:id',
    loadComponent: () =>
      import('./interest-rate-charts/interest-rate-chart-form.component').then(
        (m) => m.InterestRateChartFormComponent,
      ),
  },
  {
    path: 'interest-rate-charts/:chartId/slabs',
    loadComponent: () =>
      import('./interest-rate-charts/interest-rate-chart-slabs.component').then(
        (m) => m.InterestRateChartSlabsComponent,
      ),
  },
  {
    path: 'loan/:productId/product-mix',
    loadComponent: () =>
      import('./product-mix/product-mix.component').then((m) => m.ProductMixComponent),
  },
  {
    path: 'savings-accounts/:savingsAccountId/charges',
    loadComponent: () =>
      import('./savings-charges/savings-charges-list.component').then(
        (m) => m.SavingsChargesListComponent,
      ),
  },
  {
    path: 'savings-accounts/:savingsAccountId/charges/create',
    loadComponent: () =>
      import('./savings-charges/savings-charge-form.component').then(
        (m) => m.SavingsChargeFormComponent,
      ),
  },
  {
    path: 'shares/:productId/dividends',
    loadComponent: () =>
      import('./share-dividends/share-dividends-list.component').then(
        (m) => m.ShareDividendsListComponent,
      ),
  },
  {
    path: 'shares/:productId/dividends/create',
    loadComponent: () =>
      import('./share-dividends/share-dividend-form.component').then(
        (m) => m.ShareDividendFormComponent,
      ),
  },
  {
    path: 'fixed-deposits/:accountId/transactions',
    loadComponent: () =>
      import('./fixed-deposit-transactions/fixed-deposit-transactions-list.component').then(
        (m) => m.FixedDepositTransactionsListComponent,
      ),
  },
  {
    path: 'recurring-deposits/:accountId/transactions/create',
    loadComponent: () =>
      import('./recurring-deposit-transactions/recurring-deposit-transaction-form.component').then(
        (m) => m.RecurringDepositTransactionFormComponent,
      ),
  },
  {
    path: 'savings-accounts/:savingsId/on-hold-transactions',
    loadComponent: () =>
      import('./on-hold-transactions/on-hold-transactions-list.component').then(
        (m) => m.OnHoldTransactionsListComponent,
      ),
  },
  {
    path: 'loan-originators',
    loadComponent: () =>
      import('./loan-originators/loan-originators-list.component').then(
        (m) => m.LoanOriginatorsListComponent,
      ),
  },
  {
    path: 'loan-originators/create',
    loadComponent: () =>
      import('./loan-originators/loan-originator-form.component').then(
        (m) => m.LoanOriginatorFormComponent,
      ),
  },
  {
    path: 'loan-originators/edit/:id',
    loadComponent: () =>
      import('./loan-originators/loan-originator-form.component').then(
        (m) => m.LoanOriginatorFormComponent,
      ),
  },
  {
    path: 'collateral-management',
    loadComponent: () =>
      import('./collateral-management/collateral-management-list.component').then(
        (m) => m.CollateralManagementListComponent,
      ),
  },
  {
    path: 'collateral-management/create',
    loadComponent: () =>
      import('./collateral-management/collateral-management-form.component').then(
        (m) => m.CollateralManagementFormComponent,
      ),
  },
  {
    path: 'collateral-management/edit/:id',
    loadComponent: () =>
      import('./collateral-management/collateral-management-form.component').then(
        (m) => m.CollateralManagementFormComponent,
      ),
  },
];
