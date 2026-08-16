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

import { authGuard } from '../../core/guards/auth.guard';
import { permissionGuard } from '../../core/guards/permission.guard';
import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'loan',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_LOANPRODUCT' },
    loadComponent: () =>
      import('./loan-products-list.component').then((m) => m.LoanProductsListComponent),
  },
  {
    path: 'loan/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_LOANPRODUCT' },
    loadComponent: () =>
      import('./loan-product-form.component').then((m) => m.LoanProductFormComponent),
  },
  {
    path: 'loan/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_LOANPRODUCT' },
    loadComponent: () =>
      import('./loan-product-form.component').then((m) => m.LoanProductFormComponent),
  },
  {
    path: 'loan/view/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_LOANPRODUCT' },
    loadComponent: () =>
      import('./loan-product-view.component').then((m) => m.LoanProductViewComponent),
  },
  {
    path: 'savings',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_SAVINGSPRODUCT' },
    loadComponent: () =>
      import('./savings-products-list.component').then((m) => m.SavingsProductsListComponent),
  },
  {
    path: 'savings/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_SAVINGSPRODUCT' },
    loadComponent: () =>
      import('./savings-product-form.component').then((m) => m.SavingsProductFormComponent),
  },
  {
    path: 'savings/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_SAVINGSPRODUCT' },
    loadComponent: () =>
      import('./savings-product-form.component').then((m) => m.SavingsProductFormComponent),
  },
  {
    path: 'fixed',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_FIXEDDEPOSITPRODUCT' },
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-products-list.component').then(
        (m) => m.FixedDepositProductsListComponent,
      ),
  },
  {
    path: 'fixed/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_FIXEDDEPOSITPRODUCT' },
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-product-form.component').then(
        (m) => m.FixedDepositProductFormComponent,
      ),
  },
  {
    path: 'fixed/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_FIXEDDEPOSITPRODUCT' },
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-product-form.component').then(
        (m) => m.FixedDepositProductFormComponent,
      ),
  },
  {
    path: 'recurring',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_RECURRINGDEPOSITPRODUCT' },
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposit-products-list.component').then(
        (m) => m.RecurringDepositProductsListComponent,
      ),
  },
  {
    path: 'recurring/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_RECURRINGDEPOSITPRODUCT' },
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposit-product-form.component').then(
        (m) => m.RecurringDepositProductFormComponent,
      ),
  },
  {
    path: 'recurring/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_RECURRINGDEPOSITPRODUCT' },
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
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_SHAREPRODUCT' },
    loadComponent: () =>
      import('./shares/share-product-form.component').then((m) => m.ShareProductFormComponent),
  },
  {
    path: 'share/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_SHAREPRODUCT' },
    loadComponent: () =>
      import('./shares/share-product-form.component').then((m) => m.ShareProductFormComponent),
  },
  {
    path: 'tax-components',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_TAXCOMPONENT' },
    loadComponent: () =>
      import('./tax-components/tax-components-list.component').then(
        (m) => m.TaxComponentsListComponent,
      ),
  },
  {
    path: 'tax-components/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_TAXCOMPONENT' },
    loadComponent: () =>
      import('./tax-components/tax-component-form.component').then(
        (m) => m.TaxComponentFormComponent,
      ),
  },
  {
    path: 'tax-components/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_TAXCOMPONENT' },
    loadComponent: () =>
      import('./tax-components/tax-component-form.component').then(
        (m) => m.TaxComponentFormComponent,
      ),
  },
  {
    path: 'tax-groups',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_TAXGROUP' },
    loadComponent: () =>
      import('./tax-groups/tax-groups-list.component').then((m) => m.TaxGroupsListComponent),
  },
  {
    path: 'tax-groups/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_TAXGROUP' },
    loadComponent: () =>
      import('./tax-groups/tax-group-form.component').then((m) => m.TaxGroupFormComponent),
  },
  {
    path: 'tax-groups/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_TAXGROUP' },
    loadComponent: () =>
      import('./tax-groups/tax-group-form.component').then((m) => m.TaxGroupFormComponent),
  },
  {
    path: 'floating-rates',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_FLOATINGRATE' },
    loadComponent: () =>
      import('./floating-rates/floating-rates-list.component').then(
        (m) => m.FloatingRatesListComponent,
      ),
  },
  {
    path: 'floating-rates/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_FLOATINGRATE' },
    loadComponent: () =>
      import('./floating-rates/floating-rate-form.component').then(
        (m) => m.FloatingRateFormComponent,
      ),
  },
  {
    path: 'floating-rates/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_FLOATINGRATE' },
    loadComponent: () =>
      import('./floating-rates/floating-rate-form.component').then(
        (m) => m.FloatingRateFormComponent,
      ),
  },
  {
    path: 'savings-accounts',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_SAVINGSACCOUNT' },
    loadComponent: () =>
      import('./savings-accounts-list.component').then((m) => m.SavingsAccountsListComponent),
  },
  {
    path: 'savings-accounts/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_SAVINGSACCOUNT' },
    loadComponent: () =>
      import('./savings-account-form.component').then((m) => m.SavingsAccountFormComponent),
  },
  {
    path: 'savings-accounts/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_SAVINGSACCOUNT' },
    loadComponent: () =>
      import('./savings-account-form.component').then((m) => m.SavingsAccountFormComponent),
  },
  {
    path: 'savings-accounts/view/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_SAVINGSACCOUNT' },
    loadComponent: () =>
      import('./savings-account-view.component').then((m) => m.SavingsAccountViewComponent),
  },
  {
    path: 'savings-accounts/:accountId/transactions/:command',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_SAVINGSACCOUNT' },
    loadComponent: () =>
      import('./savings-account-transaction-form.component').then(
        (m) => m.SavingsAccountTransactionFormComponent,
      ),
  },
  {
    path: 'fixed-deposits',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_FIXEDDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposits-list.component').then(
        (m) => m.FixedDepositAccountsListComponent,
      ),
  },
  {
    path: 'fixed-deposits/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_FIXEDDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-form.component').then(
        (m) => m.FixedDepositAccountFormComponent,
      ),
  },
  {
    path: 'fixed-deposits/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_FIXEDDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./fixed-deposits/fixed-deposit-form.component').then(
        (m) => m.FixedDepositAccountFormComponent,
      ),
  },
  {
    path: 'fixed-deposits/view/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_FIXEDDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./deposit-account-view.component').then((m) => m.DepositAccountViewComponent),
  },
  {
    path: 'recurring-deposits',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_RECURRINGDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposits-list.component').then(
        (m) => m.RecurringDepositsListComponent,
      ),
  },
  {
    path: 'recurring-deposits/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_RECURRINGDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposit-form.component').then(
        (m) => m.RecurringDepositAccountFormComponent,
      ),
  },
  {
    path: 'recurring-deposits/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_RECURRINGDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./recurring-deposits/recurring-deposit-form.component').then(
        (m) => m.RecurringDepositAccountFormComponent,
      ),
  },
  {
    path: 'recurring-deposits/view/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_RECURRINGDEPOSITACCOUNT' },
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
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_SHAREACCOUNT' },
    loadComponent: () =>
      import('./shares/share-account-form.component').then((m) => m.ShareAccountFormComponent),
  },
  {
    path: 'shares/view/:id',
    loadComponent: () =>
      import('./shares/share-account-view.component').then((m) => m.ShareAccountViewComponent),
  },
  {
    path: 'shares/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_SHAREACCOUNT' },
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
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_RATE' },
    loadComponent: () => import('./rates/rates-list.component').then((m) => m.RatesListComponent),
  },
  {
    path: 'rates/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_RATE' },
    loadComponent: () => import('./rates/rate-form.component').then((m) => m.RateFormComponent),
  },
  {
    path: 'rates/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_RATE' },
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
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_INTERESTRATECHART' },
    loadComponent: () =>
      import('./interest-rate-charts/interest-rate-chart-form.component').then(
        (m) => m.InterestRateChartFormComponent,
      ),
  },
  {
    path: 'interest-rate-charts/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_INTERESTRATECHART' },
    loadComponent: () =>
      import('./interest-rate-charts/interest-rate-chart-form.component').then(
        (m) => m.InterestRateChartFormComponent,
      ),
  },
  {
    path: 'interest-rate-charts/:chartId/slabs',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_CHARTSLAB' },
    loadComponent: () =>
      import('./interest-rate-charts/interest-rate-chart-slabs.component').then(
        (m) => m.InterestRateChartSlabsComponent,
      ),
  },
  {
    path: 'loan/:productId/product-mix',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_PRODUCTMIX' },
    loadComponent: () =>
      import('./product-mix/product-mix.component').then((m) => m.ProductMixComponent),
  },
  {
    path: 'savings-accounts/:savingsAccountId/charges',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_SAVINGSACCOUNT' },
    loadComponent: () =>
      import('./savings-charges/savings-charges-list.component').then(
        (m) => m.SavingsChargesListComponent,
      ),
  },
  {
    path: 'savings-accounts/:savingsAccountId/charges/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_SAVINGSACCOUNT' },
    loadComponent: () =>
      import('./savings-charges/savings-charge-form.component').then(
        (m) => m.SavingsChargeFormComponent,
      ),
  },
  {
    path: 'shares/:productId/dividends',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_DIVIDEND_SHAREPRODUCT' },
    loadComponent: () =>
      import('./share-dividends/share-dividends-list.component').then(
        (m) => m.ShareDividendsListComponent,
      ),
  },
  {
    path: 'shares/:productId/dividends/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_DIVIDEND_SHAREPRODUCT' },
    loadComponent: () =>
      import('./share-dividends/share-dividend-form.component').then(
        (m) => m.ShareDividendFormComponent,
      ),
  },
  {
    path: 'fixed-deposits/:accountId/transactions',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_FIXEDDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./fixed-deposit-transactions/fixed-deposit-transactions-list.component').then(
        (m) => m.FixedDepositTransactionsListComponent,
      ),
  },
  // Deposit only — the platform refuses a withdrawal on a fixed deposit, so there is no
  // `:command` segment to switch on. See the form's own documentation.
  {
    path: 'fixed-deposits/:accountId/transactions/deposit',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_FIXEDDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./fixed-deposit-transactions/fixed-deposit-transaction-form.component').then(
        (m) => m.FixedDepositTransactionFormComponent,
      ),
  },
  {
    path: 'recurring-deposits/:accountId/transactions/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_RECURRINGDEPOSITACCOUNT' },
    loadComponent: () =>
      import('./recurring-deposit-transactions/recurring-deposit-transaction-form.component').then(
        (m) => m.RecurringDepositTransactionFormComponent,
      ),
  },
  {
    path: 'savings-accounts/:savingsId/on-hold-transactions',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_SAVINGSACCOUNT' },
    loadComponent: () =>
      import('./on-hold-transactions/on-hold-transactions-list.component').then(
        (m) => m.OnHoldTransactionsListComponent,
      ),
  },
  {
    path: 'loan-originators',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_LOAN_ORIGINATOR' },
    loadComponent: () =>
      import('./loan-originators/loan-originators-list.component').then(
        (m) => m.LoanOriginatorsListComponent,
      ),
  },
  {
    path: 'loan-originators/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_LOAN_ORIGINATOR' },
    loadComponent: () =>
      import('./loan-originators/loan-originator-form.component').then(
        (m) => m.LoanOriginatorFormComponent,
      ),
  },
  {
    path: 'loan-originators/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_LOAN_ORIGINATOR' },
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
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_COLLATERAL_PRODUCT' },
    loadComponent: () =>
      import('./collateral-management/collateral-management-form.component').then(
        (m) => m.CollateralManagementFormComponent,
      ),
  },
  {
    path: 'collateral-management/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_COLLATERAL_PRODUCT' },
    loadComponent: () =>
      import('./collateral-management/collateral-management-form.component').then(
        (m) => m.CollateralManagementFormComponent,
      ),
  },
];
