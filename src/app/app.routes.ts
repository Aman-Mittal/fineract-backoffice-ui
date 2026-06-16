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
      {
        path: 'spm/surveys',
        loadComponent: () =>
          import('./features/spm/surveys/spm-surveys-list.component').then(
            (m) => m.SpmSurveysListComponent,
          ),
      },
      {
        path: 'spm/surveys/create',
        loadComponent: () =>
          import('./features/spm/surveys/spm-surveys-form.component').then(
            (m) => m.SpmSurveysFormComponent,
          ),
      },
      {
        path: 'spm/surveys/edit/:id',
        loadComponent: () =>
          import('./features/spm/surveys/spm-surveys-form.component').then(
            (m) => m.SpmSurveysFormComponent,
          ),
      },
      {
        path: 'spm/surveys/:surveyId/scorecards',
        loadComponent: () =>
          import('./features/spm/scorecards/scorecards.component').then(
            (m) => m.ScorecardsComponent,
          ),
      },
      {
        path: 'spm/poverty-line',
        loadComponent: () =>
          import('./features/spm/poverty-line/poverty-line.component').then(
            (m) => m.PovertyLineComponent,
          ),
      },
      {
        path: 'spm/likelihood',
        loadComponent: () =>
          import('./features/spm/likelihood/likelihood.component').then(
            (m) => m.LikelihoodComponent,
          ),
      },
      {
        path: 'mix/mapping',
        loadComponent: () =>
          import('./features/mix/mapping/mix-mapping.component').then((m) => m.MixMappingComponent),
      },
      {
        path: 'mix/report',
        loadComponent: () =>
          import('./features/mix/report/mix-report.component').then((m) => m.MixReportComponent),
      },
      {
        path: 'mix/taxonomy',
        loadComponent: () =>
          import('./features/mix/taxonomy/mix-taxonomy.component').then(
            (m) => m.MixTaxonomyComponent,
          ),
      },
      {
        path: 'system/credit-bureau-config',
        loadComponent: () =>
          import('./features/system/credit-bureau-config/credit-bureau-config.component').then(
            (m) => m.CreditBureauConfigComponent,
          ),
      },
      {
        path: 'system/hooks',
        loadComponent: () =>
          import('./features/system/hooks/hooks-list.component').then((m) => m.HooksListComponent),
      },
      {
        path: 'system/hooks/create',
        loadComponent: () =>
          import('./features/system/hooks/hooks-form.component').then((m) => m.HooksFormComponent),
      },
      {
        path: 'system/hooks/edit/:id',
        loadComponent: () =>
          import('./features/system/hooks/hooks-form.component').then((m) => m.HooksFormComponent),
      },
      {
        path: 'system/adhoc-query',
        loadComponent: () =>
          import('./features/system/adhoc-query/adhoc-query-list.component').then(
            (m) => m.AdhocQueryListComponent,
          ),
      },
      {
        path: 'system/adhoc-query/create',
        loadComponent: () =>
          import('./features/system/adhoc-query/adhoc-query-form.component').then(
            (m) => m.AdhocQueryFormComponent,
          ),
      },
      {
        path: 'system/adhoc-query/edit/:id',
        loadComponent: () =>
          import('./features/system/adhoc-query/adhoc-query-form.component').then(
            (m) => m.AdhocQueryFormComponent,
          ),
      },
      {
        path: 'system/sms',
        loadComponent: () =>
          import('./features/system/sms/sms-list.component').then((m) => m.SmsListComponent),
      },
      {
        path: 'system/sms/create',
        loadComponent: () =>
          import('./features/system/sms/sms-form.component').then((m) => m.SmsFormComponent),
      },
      {
        path: 'system/sms/edit/:id',
        loadComponent: () =>
          import('./features/system/sms/sms-form.component').then((m) => m.SmsFormComponent),
      },
      {
        path: 'system/report-mailing-jobs',
        loadComponent: () =>
          import('./features/system/report-mailing-jobs/report-mailing-jobs-list.component').then(
            (m) => m.ReportMailingJobsListComponent,
          ),
      },
      {
        path: 'system/report-mailing-jobs/create',
        loadComponent: () =>
          import('./features/system/report-mailing-jobs/report-mailing-jobs-form.component').then(
            (m) => m.ReportMailingJobsFormComponent,
          ),
      },
      {
        path: 'system/report-mailing-jobs/edit/:id',
        loadComponent: () =>
          import('./features/system/report-mailing-jobs/report-mailing-jobs-form.component').then(
            (m) => m.ReportMailingJobsFormComponent,
          ),
      },
      {
        path: 'system/entity-data-table-checks',
        loadComponent: () =>
          import('./features/system/entity-data-table-checks/entity-data-table-checks-list.component').then(
            (m) => m.EntityDataTableChecksListComponent,
          ),
      },
      {
        path: 'system/entity-data-table-checks/create',
        loadComponent: () =>
          import('./features/system/entity-data-table-checks/entity-data-table-checks-form.component').then(
            (m) => m.EntityDataTableChecksFormComponent,
          ),
      },
      {
        path: 'system/entity-mapping',
        loadComponent: () =>
          import('./features/system/entity-mapping/entity-mapping-list.component').then(
            (m) => m.EntityMappingListComponent,
          ),
      },
      {
        path: 'system/entity-mapping/create',
        loadComponent: () =>
          import('./features/system/entity-mapping/entity-mapping-form.component').then(
            (m) => m.EntityMappingFormComponent,
          ),
      },
      {
        path: 'system/entity-mapping/edit/:id',
        loadComponent: () =>
          import('./features/system/entity-mapping/entity-mapping-form.component').then(
            (m) => m.EntityMappingFormComponent,
          ),
      },
      {
        path: 'system/business-steps',
        loadComponent: () =>
          import('./features/system/business-steps/business-steps.component').then(
            (m) => m.BusinessStepsComponent,
          ),
      },
      {
        path: 'system/cache',
        loadComponent: () =>
          import('./features/system/cache/cache.component').then((m) => m.CacheComponent),
      },
      {
        path: 'system/external-events',
        loadComponent: () =>
          import('./features/system/external-events/external-events.component').then(
            (m) => m.ExternalEventsComponent,
          ),
      },
      {
        path: 'system/external-services',
        loadComponent: () =>
          import('./features/system/external-services/external-services.component').then(
            (m) => m.ExternalServicesComponent,
          ),
      },
      {
        path: 'system/password-preferences',
        loadComponent: () =>
          import('./features/system/password-preferences/password-preferences.component').then(
            (m) => m.PasswordPreferencesComponent,
          ),
      },
      {
        path: 'system/notifications-config',
        loadComponent: () =>
          import('./features/system/notifications-config/notifications-config.component').then(
            (m) => m.NotificationsConfigComponent,
          ),
      },
      {
        path: 'system/instance-mode',
        loadComponent: () =>
          import('./features/system/instance-mode/instance-mode.component').then(
            (m) => m.InstanceModeComponent,
          ),
      },
      {
        path: 'system/scheduler-jobs',
        loadComponent: () =>
          import('./features/system/scheduler-jobs/scheduler-jobs-list.component').then(
            (m) => m.SchedulerJobsListComponent,
          ),
      },
      {
        path: 'system/scheduler-jobs/:id/history',
        loadComponent: () =>
          import('./features/system/scheduler-jobs/scheduler-job-history.component').then(
            (m) => m.SchedulerJobHistoryComponent,
          ),
      },
      {
        path: 'system/permissions',
        loadComponent: () =>
          import('./features/system/permissions/permissions.component').then(
            (m) => m.PermissionsListComponent,
          ),
      },
      {
        path: 'system/oidc-config',
        loadComponent: () =>
          import('./features/system/oidc-config/oidc-config.component').then(
            (m) => m.OidcConfigComponent,
          ),
      },
      {
        path: 'system/field-configuration',
        loadComponent: () =>
          import('./features/system/field-configuration/field-configuration.component').then(
            (m) => m.FieldConfigurationComponent,
          ),
      },
      {
        path: 'system/loan-product-details',
        loadComponent: () =>
          import('./features/system/loan-product-details/loan-product-details.component').then(
            (m) => m.LoanProductDetailsComponent,
          ),
      },
      {
        path: 'accounting/provisioning-categories',
        loadComponent: () =>
          import('./features/accounting/provisioning-categories/provisioning-categories-list.component').then(
            (m) => m.ProvisioningCategoriesListComponent,
          ),
      },
      {
        path: 'accounting/provisioning-categories/create',
        loadComponent: () =>
          import('./features/accounting/provisioning-categories/provisioning-categories-form.component').then(
            (m) => m.ProvisioningCategoriesFormComponent,
          ),
      },
      {
        path: 'accounting/provisioning-categories/edit/:id',
        loadComponent: () =>
          import('./features/accounting/provisioning-categories/provisioning-categories-form.component').then(
            (m) => m.ProvisioningCategoriesFormComponent,
          ),
      },
      {
        path: 'accounting/provisioning-criteria',
        loadComponent: () =>
          import('./features/accounting/provisioning-criteria/provisioning-criteria-list.component').then(
            (m) => m.ProvisioningCriteriaListComponent,
          ),
      },
      {
        path: 'accounting/provisioning-criteria/create',
        loadComponent: () =>
          import('./features/accounting/provisioning-criteria/provisioning-criteria-form.component').then(
            (m) => m.ProvisioningCriteriaFormComponent,
          ),
      },
      {
        path: 'accounting/provisioning-criteria/edit/:id',
        loadComponent: () =>
          import('./features/accounting/provisioning-criteria/provisioning-criteria-form.component').then(
            (m) => m.ProvisioningCriteriaFormComponent,
          ),
      },
      {
        path: 'accounting/provisioning-entries',
        loadComponent: () =>
          import('./features/accounting/provisioning-entries/provisioning-entries-list.component').then(
            (m) => m.ProvisioningEntriesListComponent,
          ),
      },
      {
        path: 'accounting/provisioning-entries/create',
        loadComponent: () =>
          import('./features/accounting/provisioning-entries/provisioning-entries-form.component').then(
            (m) => m.ProvisioningEntriesFormComponent,
          ),
      },
      {
        path: 'accounting/run-accruals',
        loadComponent: () =>
          import('./features/accounting/run-accruals/run-accruals.component').then(
            (m) => m.RunAccrualsComponent,
          ),
      },
      {
        path: 'tellers/cashier-journals',
        loadComponent: () =>
          import('./features/tellers/cashier-journals/cashier-journals-list.component').then(
            (m) => m.CashierJournalsListComponent,
          ),
      },
      {
        path: 'products/rates',
        loadComponent: () =>
          import('./features/products/rates/rates-list.component').then(
            (m) => m.RatesListComponent,
          ),
      },
      {
        path: 'products/rates/create',
        loadComponent: () =>
          import('./features/products/rates/rate-form.component').then((m) => m.RateFormComponent),
      },
      {
        path: 'products/rates/edit/:id',
        loadComponent: () =>
          import('./features/products/rates/rate-form.component').then((m) => m.RateFormComponent),
      },
      {
        path: 'products/interest-rate-charts',
        loadComponent: () =>
          import('./features/products/interest-rate-charts/interest-rate-charts-list.component').then(
            (m) => m.InterestRateChartsListComponent,
          ),
      },
      {
        path: 'products/interest-rate-charts/create',
        loadComponent: () =>
          import('./features/products/interest-rate-charts/interest-rate-chart-form.component').then(
            (m) => m.InterestRateChartFormComponent,
          ),
      },
      {
        path: 'products/interest-rate-charts/edit/:id',
        loadComponent: () =>
          import('./features/products/interest-rate-charts/interest-rate-chart-form.component').then(
            (m) => m.InterestRateChartFormComponent,
          ),
      },
      {
        path: 'products/interest-rate-charts/:chartId/slabs',
        loadComponent: () =>
          import('./features/products/interest-rate-charts/interest-rate-chart-slabs.component').then(
            (m) => m.InterestRateChartSlabsComponent,
          ),
      },
      {
        path: 'products/loan/:productId/product-mix',
        loadComponent: () =>
          import('./features/products/product-mix/product-mix.component').then(
            (m) => m.ProductMixComponent,
          ),
      },
      {
        path: 'products/savings-accounts/:savingsAccountId/charges',
        loadComponent: () =>
          import('./features/products/savings-charges/savings-charges-list.component').then(
            (m) => m.SavingsChargesListComponent,
          ),
      },
      {
        path: 'products/savings-accounts/:savingsAccountId/charges/create',
        loadComponent: () =>
          import('./features/products/savings-charges/savings-charge-form.component').then(
            (m) => m.SavingsChargeFormComponent,
          ),
      },
      {
        path: 'products/shares/:productId/dividends',
        loadComponent: () =>
          import('./features/products/share-dividends/share-dividends-list.component').then(
            (m) => m.ShareDividendsListComponent,
          ),
      },
      {
        path: 'products/shares/:productId/dividends/create',
        loadComponent: () =>
          import('./features/products/share-dividends/share-dividend-form.component').then(
            (m) => m.ShareDividendFormComponent,
          ),
      },
      {
        path: 'products/fixed-deposits/:accountId/transactions',
        loadComponent: () =>
          import('./features/products/fixed-deposit-transactions/fixed-deposit-transactions-list.component').then(
            (m) => m.FixedDepositTransactionsListComponent,
          ),
      },
      {
        path: 'products/recurring-deposits/:accountId/transactions/create',
        loadComponent: () =>
          import('./features/products/recurring-deposit-transactions/recurring-deposit-transaction-form.component').then(
            (m) => m.RecurringDepositTransactionFormComponent,
          ),
      },
      {
        path: 'products/savings-accounts/:savingsId/on-hold-transactions',
        loadComponent: () =>
          import('./features/products/on-hold-transactions/on-hold-transactions-list.component').then(
            (m) => m.OnHoldTransactionsListComponent,
          ),
      },
      {
        path: 'clients/:clientId/charges',
        loadComponent: () =>
          import('./features/clients/charges/client-charges-list.component').then(
            (m) => m.ClientChargesListComponent,
          ),
      },
      {
        path: 'clients/:clientId/charges/create',
        loadComponent: () =>
          import('./features/clients/charges/client-charge-form.component').then(
            (m) => m.ClientChargeFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/collaterals',
        loadComponent: () =>
          import('./features/clients/collateral/client-collateral-list.component').then(
            (m) => m.ClientCollateralListComponent,
          ),
      },
      {
        path: 'clients/:clientId/collaterals/create',
        loadComponent: () =>
          import('./features/clients/collateral/client-collateral-form.component').then(
            (m) => m.ClientCollateralFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/collaterals/edit/:id',
        loadComponent: () =>
          import('./features/clients/collateral/client-collateral-form.component').then(
            (m) => m.ClientCollateralFormComponent,
          ),
      },
      {
        path: 'clients/:clientId/transactions',
        loadComponent: () =>
          import('./features/clients/transactions/client-transactions-list.component').then(
            (m) => m.ClientTransactionsListComponent,
          ),
      },
      {
        path: 'meetings/:entityType/:entityId',
        loadComponent: () =>
          import('./features/meetings/meetings-list.component').then(
            (m) => m.MeetingsListComponent,
          ),
      },
      {
        path: 'meetings/:entityType/:entityId/create',
        loadComponent: () =>
          import('./features/meetings/meeting-form.component').then((m) => m.MeetingFormComponent),
      },
      {
        path: 'meetings/:entityType/:entityId/edit/:id',
        loadComponent: () =>
          import('./features/meetings/meeting-form.component').then((m) => m.MeetingFormComponent),
      },
      {
        path: 'calendars/:entityType/:entityId',
        loadComponent: () =>
          import('./features/calendars/calendars-list.component').then(
            (m) => m.CalendarsListComponent,
          ),
      },
      {
        path: 'calendars/:entityType/:entityId/create',
        loadComponent: () =>
          import('./features/calendars/calendar-form.component').then(
            (m) => m.CalendarFormComponent,
          ),
      },
      {
        path: 'calendars/:entityType/:entityId/edit/:id',
        loadComponent: () =>
          import('./features/calendars/calendar-form.component').then(
            (m) => m.CalendarFormComponent,
          ),
      },
      {
        path: 'organization/group-levels',
        loadComponent: () =>
          import('./features/organization/group-levels/group-levels-list.component').then(
            (m) => m.GroupLevelsListComponent,
          ),
      },
      {
        path: 'products/loan-originators',
        loadComponent: () =>
          import('./features/products/loan-originators/loan-originators-list.component').then(
            (m) => m.LoanOriginatorsListComponent,
          ),
      },
      {
        path: 'products/loan-originators/create',
        loadComponent: () =>
          import('./features/products/loan-originators/loan-originator-form.component').then(
            (m) => m.LoanOriginatorFormComponent,
          ),
      },
      {
        path: 'products/loan-originators/edit/:id',
        loadComponent: () =>
          import('./features/products/loan-originators/loan-originator-form.component').then(
            (m) => m.LoanOriginatorFormComponent,
          ),
      },
      {
        path: 'products/collateral-management',
        loadComponent: () =>
          import('./features/products/collateral-management/collateral-management-list.component').then(
            (m) => m.CollateralManagementListComponent,
          ),
      },
      {
        path: 'products/collateral-management/create',
        loadComponent: () =>
          import('./features/products/collateral-management/collateral-management-form.component').then(
            (m) => m.CollateralManagementFormComponent,
          ),
      },
      {
        path: 'products/collateral-management/edit/:id',
        loadComponent: () =>
          import('./features/products/collateral-management/collateral-management-form.component').then(
            (m) => m.CollateralManagementFormComponent,
          ),
      },
      {
        path: 'loans/bulk-reassignment',
        loadComponent: () =>
          import('./features/loans/bulk-reassignment/bulk-reassignment.component').then(
            (m) => m.BulkReassignmentComponent,
          ),
      },
      {
        path: 'loans/:loanId/guarantors',
        loadComponent: () =>
          import('./features/loans/guarantors/guarantors-list.component').then(
            (m) => m.GuarantorsListComponent,
          ),
      },
      {
        path: 'loans/:loanId/guarantors/create',
        loadComponent: () =>
          import('./features/loans/guarantors/guarantor-form.component').then(
            (m) => m.GuarantorFormComponent,
          ),
      },
      {
        path: 'loans/:loanId/guarantors/edit/:id',
        loadComponent: () =>
          import('./features/loans/guarantors/guarantor-form.component').then(
            (m) => m.GuarantorFormComponent,
          ),
      },
      {
        path: 'loans/:loanId/interest-pauses',
        loadComponent: () =>
          import('./features/loans/interest-pauses/interest-pauses-list.component').then(
            (m) => m.InterestPausesListComponent,
          ),
      },
      {
        path: 'loans/:loanId/interest-pauses/create',
        loadComponent: () =>
          import('./features/loans/interest-pauses/interest-pause-form.component').then(
            (m) => m.InterestPauseFormComponent,
          ),
      },
      {
        path: 'loans/:loanId/post-dated-checks',
        loadComponent: () =>
          import('./features/loans/post-dated-checks/post-dated-checks-list.component').then(
            (m) => m.PostDatedChecksListComponent,
          ),
      },
      {
        path: 'loans/:loanId/post-dated-checks/edit/:id',
        loadComponent: () =>
          import('./features/loans/post-dated-checks/post-dated-check-form.component').then(
            (m) => m.PostDatedCheckFormComponent,
          ),
      },
      {
        path: 'working-capital/breach',
        loadComponent: () =>
          import('./features/working-capital/breach/wc-breach-list.component').then(
            (m) => m.WcBreachListComponent,
          ),
      },
      {
        path: 'working-capital/breach/create',
        loadComponent: () =>
          import('./features/working-capital/breach/wc-breach-form.component').then(
            (m) => m.WcBreachFormComponent,
          ),
      },
      {
        path: 'working-capital/breach/edit/:id',
        loadComponent: () =>
          import('./features/working-capital/breach/wc-breach-form.component').then(
            (m) => m.WcBreachFormComponent,
          ),
      },
      {
        path: 'working-capital/near-breach',
        loadComponent: () =>
          import('./features/working-capital/near-breach/wc-near-breach-list.component').then(
            (m) => m.WcNearBreachListComponent,
          ),
      },
      {
        path: 'working-capital/near-breach/create',
        loadComponent: () =>
          import('./features/working-capital/near-breach/wc-near-breach-form.component').then(
            (m) => m.WcNearBreachFormComponent,
          ),
      },
      {
        path: 'working-capital/near-breach/edit/:id',
        loadComponent: () =>
          import('./features/working-capital/near-breach/wc-near-breach-form.component').then(
            (m) => m.WcNearBreachFormComponent,
          ),
      },
      {
        path: 'working-capital/loan-products',
        loadComponent: () =>
          import('./features/working-capital/loan-products/wc-loan-products-list.component').then(
            (m) => m.WcLoanProductsListComponent,
          ),
      },
      {
        path: 'working-capital/loan-products/create',
        loadComponent: () =>
          import('./features/working-capital/loan-products/wc-loan-product-form.component').then(
            (m) => m.WcLoanProductFormComponent,
          ),
      },
      {
        path: 'working-capital/loan-products/edit/:id',
        loadComponent: () =>
          import('./features/working-capital/loan-products/wc-loan-product-form.component').then(
            (m) => m.WcLoanProductFormComponent,
          ),
      },
      {
        path: 'working-capital/loans',
        loadComponent: () =>
          import('./features/working-capital/loans/wc-loans-list.component').then(
            (m) => m.WcLoansListComponent,
          ),
      },
      {
        path: 'working-capital/loans/create',
        loadComponent: () =>
          import('./features/working-capital/loans/wc-loan-form.component').then(
            (m) => m.WcLoanFormComponent,
          ),
      },
      {
        path: 'working-capital/loans/view/:id',
        loadComponent: () =>
          import('./features/working-capital/loans/wc-loan-view.component').then(
            (m) => m.WcLoanViewComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
