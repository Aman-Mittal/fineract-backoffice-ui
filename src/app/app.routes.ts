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
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/system-status.component').then(
            (m) => m.SystemStatusComponent,
          ),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/clients-list.component').then((m) => m.ClientsListComponent),
      },
      {
        path: 'clients/create',
        loadComponent: () =>
          import('./features/clients/client-form.component').then((m) => m.ClientFormComponent),
      },
      {
        path: 'clients/edit/:id',
        loadComponent: () =>
          import('./features/clients/client-form.component').then((m) => m.ClientFormComponent),
      },
      {
        path: 'clients/view/:id',
        loadComponent: () =>
          import('./features/clients/client-view.component').then((m) => m.ClientViewComponent),
      },
      {
        path: 'clients/:clientId/identifiers/create',
        loadComponent: () =>
          import('./features/clients/kyc/client-identifier-form.component').then(
            (m) => m.ClientIdentifierFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/identifiers/edit/:id',
        loadComponent: () =>
          import('./features/clients/kyc/client-identifier-form.component').then(
            (m) => m.ClientIdentifierFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/addresses/create',
        loadComponent: () =>
          import('./features/clients/kyc/client-address-form.component').then(
            (m) => m.ClientAddressFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/addresses/edit/:id',
        loadComponent: () =>
          import('./features/clients/kyc/client-address-form.component').then(
            (m) => m.ClientAddressFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/family-members/create',
        loadComponent: () =>
          import('./features/clients/kyc/client-family-member-form.component').then(
            (m) => m.ClientFamilyMemberFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/family-members/edit/:id',
        loadComponent: () =>
          import('./features/clients/kyc/client-family-member-form.component').then(
            (m) => m.ClientFamilyMemberFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/notes/create',
        loadComponent: () =>
          import('./features/clients/kyc/client-note-form.component').then(
            (m) => m.ClientNoteFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/notes/edit/:id',
        loadComponent: () =>
          import('./features/clients/kyc/client-note-form.component').then(
            (m) => m.ClientNoteFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/documents/create',
        loadComponent: () =>
          import('./features/clients/kyc/client-document-form.component').then(
            (m) => m.ClientDocumentFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/documents/edit/:id',
        loadComponent: () =>
          import('./features/clients/kyc/client-document-form.component').then(
            (m) => m.ClientDocumentFormComponent,
          ),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./features/groups/groups-list.component').then((m) => m.GroupsListComponent),
      },
      {
        path: 'groups/create',
        loadComponent: () =>
          import('./features/groups/group-form.component').then((m) => m.GroupFormComponent),
      },
      {
        path: 'groups/edit/:id',
        loadComponent: () =>
          import('./features/groups/group-form.component').then((m) => m.GroupFormComponent),
      },
      {
        path: 'centers',
        loadComponent: () =>
          import('./features/centers/centers-list.component').then((m) => m.CentersListComponent),
      },
      {
        path: 'centers/create',
        loadComponent: () =>
          import('./features/centers/center-form.component').then((m) => m.CenterFormComponent),
      },
      {
        path: 'centers/edit/:id',
        loadComponent: () =>
          import('./features/centers/center-form.component').then((m) => m.CenterFormComponent),
      },
      {
        path: 'products/loan',
        loadComponent: () =>
          import('./features/products/loan-products-list.component').then(
            (m) => m.LoanProductsListComponent,
          ),
      },
      {
        path: 'products/loan/create',
        loadComponent: () =>
          import('./features/products/loan-product-form.component').then(
            (m) => m.LoanProductFormComponent,
          ),
      },
      {
        path: 'products/loan/edit/:id',
        loadComponent: () =>
          import('./features/products/loan-product-form.component').then(
            (m) => m.LoanProductFormComponent,
          ),
      },
      {
        path: 'products/savings',
        loadComponent: () =>
          import('./features/products/savings-products-list.component').then(
            (m) => m.SavingsProductsListComponent,
          ),
      },
      {
        path: 'products/savings/create',
        loadComponent: () =>
          import('./features/products/savings-product-form.component').then(
            (m) => m.SavingsProductFormComponent,
          ),
      },
      {
        path: 'products/savings/edit/:id',
        loadComponent: () =>
          import('./features/products/savings-product-form.component').then(
            (m) => m.SavingsProductFormComponent,
          ),
      },
      {
        path: 'products/fixed',
        loadComponent: () =>
          import('./features/products/fixed-deposits/fixed-deposit-products-list.component').then(
            (m) => m.FixedDepositProductsListComponent,
          ),
      },
      {
        path: 'products/fixed/create',
        loadComponent: () =>
          import('./features/products/fixed-deposits/fixed-deposit-product-form.component').then(
            (m) => m.FixedDepositProductFormComponent,
          ),
      },
      {
        path: 'products/fixed/edit/:id',
        loadComponent: () =>
          import('./features/products/fixed-deposits/fixed-deposit-product-form.component').then(
            (m) => m.FixedDepositProductFormComponent,
          ),
      },
      {
        path: 'products/recurring',
        loadComponent: () =>
          import('./features/products/recurring-deposits/recurring-deposit-products-list.component').then(
            (m) => m.RecurringDepositProductsListComponent,
          ),
      },
      {
        path: 'products/recurring/create',
        loadComponent: () =>
          import('./features/products/recurring-deposits/recurring-deposit-product-form.component').then(
            (m) => m.RecurringDepositProductFormComponent,
          ),
      },
      {
        path: 'products/recurring/edit/:id',
        loadComponent: () =>
          import('./features/products/recurring-deposits/recurring-deposit-product-form.component').then(
            (m) => m.RecurringDepositProductFormComponent,
          ),
      },
      {
        path: 'products/share',
        loadComponent: () =>
          import('./features/products/shares/share-products-list.component').then(
            (m) => m.ShareProductsListComponent,
          ),
      },
      {
        path: 'products/share/create',
        loadComponent: () =>
          import('./features/products/shares/share-product-form.component').then(
            (m) => m.ShareProductFormComponent,
          ),
      },
      {
        path: 'products/share/edit/:id',
        loadComponent: () =>
          import('./features/products/shares/share-product-form.component').then(
            (m) => m.ShareProductFormComponent,
          ),
      },
      {
        path: 'products/tax-components',
        loadComponent: () =>
          import('./features/products/tax-components/tax-components-list.component').then(
            (m) => m.TaxComponentsListComponent,
          ),
      },
      {
        path: 'products/tax-components/create',
        loadComponent: () =>
          import('./features/products/tax-components/tax-component-form.component').then(
            (m) => m.TaxComponentFormComponent,
          ),
      },
      {
        path: 'products/tax-components/edit/:id',
        loadComponent: () =>
          import('./features/products/tax-components/tax-component-form.component').then(
            (m) => m.TaxComponentFormComponent,
          ),
      },
      {
        path: 'products/tax-groups',
        loadComponent: () =>
          import('./features/products/tax-groups/tax-groups-list.component').then(
            (m) => m.TaxGroupsListComponent,
          ),
      },
      {
        path: 'products/tax-groups/create',
        loadComponent: () =>
          import('./features/products/tax-groups/tax-group-form.component').then(
            (m) => m.TaxGroupFormComponent,
          ),
      },
      {
        path: 'products/tax-groups/edit/:id',
        loadComponent: () =>
          import('./features/products/tax-groups/tax-group-form.component').then(
            (m) => m.TaxGroupFormComponent,
          ),
      },
      {
        path: 'products/floating-rates',
        loadComponent: () =>
          import('./features/products/floating-rates/floating-rates-list.component').then(
            (m) => m.FloatingRatesListComponent,
          ),
      },
      {
        path: 'products/floating-rates/create',
        loadComponent: () =>
          import('./features/products/floating-rates/floating-rate-form.component').then(
            (m) => m.FloatingRateFormComponent,
          ),
      },
      {
        path: 'products/floating-rates/edit/:id',
        loadComponent: () =>
          import('./features/products/floating-rates/floating-rate-form.component').then(
            (m) => m.FloatingRateFormComponent,
          ),
      },
      {
        path: 'products/savings-accounts',
        loadComponent: () =>
          import('./features/products/savings-accounts-list.component').then(
            (m) => m.SavingsAccountsListComponent,
          ),
      },
      {
        path: 'products/savings-accounts/create',
        loadComponent: () =>
          import('./features/products/savings-account-form.component').then(
            (m) => m.SavingsAccountFormComponent,
          ),
      },
      {
        path: 'products/savings-accounts/edit/:id',
        loadComponent: () =>
          import('./features/products/savings-account-form.component').then(
            (m) => m.SavingsAccountFormComponent,
          ),
      },
      {
        path: 'products/savings-accounts/view/:id',
        loadComponent: () =>
          import('./features/products/savings-account-view.component').then(
            (m) => m.SavingsAccountViewComponent,
          ),
      },
      {
        path: 'products/savings-accounts/:accountId/transactions/:command',
        loadComponent: () =>
          import('./features/products/savings-account-transaction-form.component').then(
            (m) => m.SavingsAccountTransactionFormComponent,
          ),
      },
      {
        path: 'products/fixed-deposits',
        loadComponent: () =>
          import('./features/products/fixed-deposits/fixed-deposits-list.component').then(
            (m) => m.FixedDepositAccountsListComponent,
          ),
      },
      {
        path: 'products/fixed-deposits/create',
        loadComponent: () =>
          import('./features/products/fixed-deposits/fixed-deposit-form.component').then(
            (m) => m.FixedDepositAccountFormComponent,
          ),
      },
      {
        path: 'products/fixed-deposits/edit/:id',
        loadComponent: () =>
          import('./features/products/fixed-deposits/fixed-deposit-form.component').then(
            (m) => m.FixedDepositAccountFormComponent,
          ),
      },
      {
        path: 'products/fixed-deposits/view/:id',
        loadComponent: () =>
          import('./features/products/deposit-account-view.component').then(
            (m) => m.DepositAccountViewComponent,
          ),
      },
      {
        path: 'products/recurring-deposits',
        loadComponent: () =>
          import('./features/products/recurring-deposits/recurring-deposits-list.component').then(
            (m) => m.RecurringDepositsListComponent,
          ),
      },
      {
        path: 'products/recurring-deposits/create',
        loadComponent: () =>
          import('./features/products/recurring-deposits/recurring-deposit-form.component').then(
            (m) => m.RecurringDepositAccountFormComponent,
          ),
      },
      {
        path: 'products/recurring-deposits/edit/:id',
        loadComponent: () =>
          import('./features/products/recurring-deposits/recurring-deposit-form.component').then(
            (m) => m.RecurringDepositAccountFormComponent,
          ),
      },
      {
        path: 'products/recurring-deposits/view/:id',
        loadComponent: () =>
          import('./features/products/deposit-account-view.component').then(
            (m) => m.DepositAccountViewComponent,
          ),
      },
      {
        path: 'products/shares',
        loadComponent: () =>
          import('./features/products/shares/share-accounts-list.component').then(
            (m) => m.ShareAccountsListComponent,
          ),
      },
      {
        path: 'products/shares/create',
        loadComponent: () =>
          import('./features/products/shares/share-account-form.component').then(
            (m) => m.ShareAccountFormComponent,
          ),
      },
      {
        path: 'products/shares/edit/:id',
        loadComponent: () =>
          import('./features/products/shares/share-account-form.component').then(
            (m) => m.ShareAccountFormComponent,
          ),
      },
      {
        path: 'products/:accountType/:accountId/action/:command',
        loadComponent: () =>
          import('./features/products/account-action-form.component').then(
            (m) => m.AccountActionFormComponent,
          ),
      },
      {
        path: 'fintech/asset-owners',
        loadComponent: () =>
          import('./features/fintech/asset-owners-list.component').then(
            (m) => m.ExternalAssetOwnersListComponent,
          ),
      },
      {
        path: 'fintech/asset-owners/view/:id',
        loadComponent: () =>
          import('./features/fintech/asset-owner-view/asset-owner-view.component').then(
            (m) => m.AssetOwnerViewComponent,
          ),
      },
      {
        path: 'transfers/account-transfer',
        loadComponent: () =>
          import('./features/transfers/account-transfer-form.component').then(
            (m) => m.AccountTransferFormComponent,
          ),
      },
      {
        path: 'transfers/standing-instructions',
        loadComponent: () =>
          import('./features/transfers/standing-instructions-list.component').then(
            (m) => m.StandingInstructionsListComponent,
          ),
      },
      {
        path: 'transfers/standing-instructions/create',
        loadComponent: () =>
          import('./features/transfers/standing-instruction-form.component').then(
            (m) => m.StandingInstructionFormComponent,
          ),
      },
      {
        path: 'transfers/standing-instructions/edit/:id',
        loadComponent: () =>
          import('./features/transfers/standing-instruction-form.component').then(
            (m) => m.StandingInstructionFormComponent,
          ),
      },
      {
        path: 'transfers/standing-instructions/history',
        loadComponent: () =>
          import('./features/transfers/standing-instruction-history.component').then(
            (m) => m.StandingInstructionHistoryComponent,
          ),
      },
      {
        path: 'accounting/chart-of-accounts',
        loadComponent: () =>
          import('./features/accounting/chart-of-accounts.component').then(
            (m) => m.ChartOfAccountsComponent,
          ),
      },
      {
        path: 'accounting/chart-of-accounts/create',
        loadComponent: () =>
          import('./features/accounting/gl-account-form.component').then(
            (m) => m.GLAccountFormComponent,
          ),
      },
      {
        path: 'accounting/chart-of-accounts/edit/:id',
        loadComponent: () =>
          import('./features/accounting/gl-account-form.component').then(
            (m) => m.GLAccountFormComponent,
          ),
      },
      {
        path: 'accounting/journal-entries',
        loadComponent: () =>
          import('./features/accounting/journal-entries-list.component').then(
            (m) => m.JournalEntriesListComponent,
          ),
      },
      {
        path: 'accounting/journal-entries/create',
        loadComponent: () =>
          import('./features/accounting/journal-entry-form.component').then(
            (m) => m.JournalEntryFormComponent,
          ),
      },
      {
        path: 'accounting/closures',
        loadComponent: () =>
          import('./features/accounting/accounting-closures-list.component').then(
            (m) => m.AccountingClosuresListComponent,
          ),
      },
      {
        path: 'accounting/closures/create',
        loadComponent: () =>
          import('./features/accounting/accounting-closure-form.component').then(
            (m) => m.AccountingClosureFormComponent,
          ),
      },
      {
        path: 'accounting/rules',
        loadComponent: () =>
          import('./features/accounting/accounting-rules-list.component').then(
            (m) => m.AccountingRulesListComponent,
          ),
      },
      {
        path: 'accounting/rules/create',
        loadComponent: () =>
          import('./features/accounting/accounting-rule-form.component').then(
            (m) => m.AccountingRuleFormComponent,
          ),
      },
      {
        path: 'accounting/rules/edit/:id',
        loadComponent: () =>
          import('./features/accounting/accounting-rule-form.component').then(
            (m) => m.AccountingRuleFormComponent,
          ),
      },
      {
        path: 'accounting/financial-activity-mappings',
        loadComponent: () =>
          import('./features/accounting/financial-activity-mappings-list.component').then(
            (m) => m.FinancialActivityMappingsListComponent,
          ),
      },
      {
        path: 'accounting/financial-activity-mappings/create',
        loadComponent: () =>
          import('./features/accounting/financial-activity-mapping-form.component').then(
            (m) => m.FinancialActivityMappingFormComponent,
          ),
      },
      {
        path: 'accounting/financial-activity-mappings/edit/:id',
        loadComponent: () =>
          import('./features/accounting/financial-activity-mapping-form.component').then(
            (m) => m.FinancialActivityMappingFormComponent,
          ),
      },
      {
        path: 'security/users',
        loadComponent: () =>
          import('./features/security/users/users-list.component').then(
            (m) => m.UsersListComponent,
          ),
      },
      {
        path: 'security/users/create',
        loadComponent: () =>
          import('./features/security/users/user-form.component').then((m) => m.UserFormComponent),
      },
      {
        path: 'security/users/edit/:id',
        loadComponent: () =>
          import('./features/security/users/user-form.component').then((m) => m.UserFormComponent),
      },
      {
        path: 'security/roles',
        loadComponent: () =>
          import('./features/security/roles/roles-list.component').then(
            (m) => m.RolesListComponent,
          ),
      },
      {
        path: 'security/roles/create',
        loadComponent: () =>
          import('./features/security/roles/role-form.component').then((m) => m.RoleFormComponent),
      },
      {
        path: 'security/roles/edit/:id',
        loadComponent: () =>
          import('./features/security/roles/role-form.component').then((m) => m.RoleFormComponent),
      },
      {
        path: 'accounting/charges',
        loadComponent: () =>
          import('./features/accounting/charges/charges-list.component').then(
            (m) => m.ChargesListComponent,
          ),
      },
      {
        path: 'accounting/charges/create',
        loadComponent: () =>
          import('./features/accounting/charges/charge-form.component').then(
            (m) => m.ChargeFormComponent,
          ),
      },
      {
        path: 'accounting/charges/edit/:id',
        loadComponent: () =>
          import('./features/accounting/charges/charge-form.component').then(
            (m) => m.ChargeFormComponent,
          ),
      },
      {
        path: 'loans/:loanId/rescheduling',
        loadComponent: () =>
          import('./features/loans/rescheduling/reschedule-requests-list.component').then(
            (m) => m.RescheduleRequestsListComponent,
          ),
      },
      {
        path: 'loans/:loanId/rescheduling/create',
        loadComponent: () =>
          import('./features/loans/rescheduling/reschedule-form.component').then(
            (m) => m.RescheduleFormComponent,
          ),
      },
      {
        path: 'tellers',
        loadComponent: () =>
          import('./features/tellers/tellers-list.component').then((m) => m.TellersListComponent),
      },
      {
        path: 'tellers/create',
        loadComponent: () =>
          import('./features/tellers/teller-form.component').then((m) => m.TellerFormComponent),
      },
      {
        path: 'tellers/edit/:id',
        loadComponent: () =>
          import('./features/tellers/teller-form.component').then((m) => m.TellerFormComponent),
      },
      {
        path: 'tellers/:tellerId/cashiers',
        loadComponent: () =>
          import('./features/tellers/cashiers/cashiers-list.component').then(
            (m) => m.CashiersListComponent,
          ),
      },
      {
        path: 'tellers/:tellerId/cashiers/create',
        loadComponent: () =>
          import('./features/tellers/cashiers/cashier-form.component').then(
            (m) => m.CashierFormComponent,
          ),
      },
      {
        path: 'organization/offices',
        loadComponent: () =>
          import('./features/organization/offices/offices-list.component').then(
            (m) => m.OfficesListComponent,
          ),
      },
      {
        path: 'organization/offices/create',
        loadComponent: () =>
          import('./features/organization/offices/office-form.component').then(
            (m) => m.OfficeFormComponent,
          ),
      },
      {
        path: 'organization/offices/edit/:id',
        loadComponent: () =>
          import('./features/organization/offices/office-form.component').then(
            (m) => m.OfficeFormComponent,
          ),
      },
      {
        path: 'organization/funds',
        loadComponent: () =>
          import('./features/organization/funds/funds-list.component').then(
            (m) => m.FundsListComponent,
          ),
      },
      {
        path: 'organization/funds/create',
        loadComponent: () =>
          import('./features/organization/funds/fund-form.component').then(
            (m) => m.FundFormComponent,
          ),
      },
      {
        path: 'organization/funds/edit/:id',
        loadComponent: () =>
          import('./features/organization/funds/fund-form.component').then(
            (m) => m.FundFormComponent,
          ),
      },
      {
        path: 'organization/payment-types',
        loadComponent: () =>
          import('./features/organization/payment-types/payment-types-list.component').then(
            (m) => m.PaymentTypesListComponent,
          ),
      },
      {
        path: 'organization/payment-types/create',
        loadComponent: () =>
          import('./features/organization/payment-types/payment-type-form.component').then(
            (m) => m.PaymentTypeFormComponent,
          ),
      },
      {
        path: 'organization/payment-types/edit/:id',
        loadComponent: () =>
          import('./features/organization/payment-types/payment-type-form.component').then(
            (m) => m.PaymentTypeFormComponent,
          ),
      },
      {
        path: 'organization/staff',
        loadComponent: () =>
          import('./features/organization/staff/staff-list.component').then(
            (m) => m.StaffListComponent,
          ),
      },
      {
        path: 'organization/staff/create',
        loadComponent: () =>
          import('./features/organization/staff/staff-form.component').then(
            (m) => m.StaffFormComponent,
          ),
      },
      {
        path: 'organization/staff/edit/:id',
        loadComponent: () =>
          import('./features/organization/staff/staff-form.component').then(
            (m) => m.StaffFormComponent,
          ),
      },
      {
        path: 'security/audits',
        loadComponent: () =>
          import('./features/security/audit-logs/audit-logs-list.component').then(
            (m) => m.AuditLogsListComponent,
          ),
      },
      {
        path: 'system/data-tables',
        loadComponent: () =>
          import('./features/system/data-tables/datatables-list.component').then(
            (m) => m.DatatablesListComponent,
          ),
      },
      {
        path: 'system/data-tables/create',
        loadComponent: () =>
          import('./features/system/data-tables/datatables-form.component').then(
            (m) => m.DatatablesFormComponent,
          ),
      },
      {
        path: 'system/data-tables/edit/:name',
        loadComponent: () =>
          import('./features/system/data-tables/datatables-form.component').then(
            (m) => m.DatatablesFormComponent,
          ),
      },
      {
        path: 'system/bulk-import',
        loadComponent: () =>
          import('./features/system/bulk-import/bulk-import.component').then(
            (m) => m.BulkImportComponent,
          ),
      },
      {
        path: 'system/delinquency',
        loadComponent: () =>
          import('./features/system/delinquency/delinquency-management.component').then(
            (m) => m.DelinquencyManagementComponent,
          ),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./features/loans/loans-list.component').then((m) => m.LoansListComponent),
      },
      {
        path: 'loans/create',
        loadComponent: () =>
          import('./features/loans/loan-form.component').then((m) => m.LoanFormComponent),
      },
      {
        path: 'loans/edit/:id',
        loadComponent: () =>
          import('./features/loans/loan-form.component').then((m) => m.LoanFormComponent),
      },
      {
        path: 'loans/view/:id',
        loadComponent: () =>
          import('./features/loans/loan-view.component').then((m) => m.LoanViewComponent),
      },
      {
        path: 'loans/:loanId/collateral',
        loadComponent: () =>
          import('./features/loans/collateral/collateral-list.component').then(
            (m) => m.CollateralListComponent,
          ),
      },
      {
        path: 'loans/:loanId/collateral/create',
        loadComponent: () =>
          import('./features/loans/collateral/collateral-form.component').then(
            (m) => m.CollateralFormComponent,
          ),
      },
      {
        path: 'loans/:loanId/collateral/edit/:id',
        loadComponent: () =>
          import('./features/loans/collateral/collateral-form.component').then(
            (m) => m.CollateralFormComponent,
          ),
      },
      {
        path: 'reporting',
        loadComponent: () =>
          import('./features/reporting/reports-list.component').then((m) => m.ReportsListComponent),
      },
      {
        path: 'reporting/run/:reportName',
        loadComponent: () =>
          import('./features/reporting/run-report.component').then((m) => m.RunReportComponent),
      },
      {
        path: 'tasks',
        loadChildren: () => import('./features/tasks/tasks.routes').then((m) => m.TASKS_ROUTES),
      },
      {
        path: 'settings/configurations',
        loadComponent: () =>
          import('./features/settings/global-configurations.component').then(
            (m) => m.GlobalConfigurationsListComponent,
          ),
      },
      {
        path: 'settings/holidays',
        loadComponent: () =>
          import('./features/settings/holidays-list.component').then(
            (m) => m.HolidaysListComponent,
          ),
      },
      {
        path: 'settings/holidays/create',
        loadComponent: () =>
          import('./features/settings/holiday-form.component').then((m) => m.HolidayFormComponent),
      },
      {
        path: 'settings/working-days',
        loadComponent: () =>
          import('./features/settings/working-days.component').then((m) => m.WorkingDaysComponent),
      },
      {
        path: 'loans/:loanId/transactions/:type',
        loadComponent: () =>
          import('./features/loans/loan-transaction-form.component').then(
            (m) => m.LoanTransactionFormComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
