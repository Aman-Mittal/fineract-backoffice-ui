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

import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { InstitutionConfigService, InstitutionFeature } from './institution-config.service';
import { environment } from '../../../environments/environment';

/**
 * A single entry in the application's navigation tree. Group headers omit
 * `route`; leaf items omit `children`. A `divider` entry is a purely visual
 * separator within a group and carries no other meaningful fields.
 */
export interface NavItemConfig {
  /** Router path. Omitted for group headers with no direct destination. */
  route?: string;
  /** i18n translation key, or a literal label where no key exists yet. */
  labelKey: string;
  /** Material icon name. */
  icon?: string;
  /** Permission(s) required to see this item. Omitted = always visible. */
  requiredPermissions?: string | string[];
  /** AND semantics for a `requiredPermissions` array. Default is OR (any match). */
  requiredAllPermissions?: boolean;
  /** Institution feature gate, checked via {@link InstitutionConfigService}. */
  featureFlag?: InstitutionFeature;
  /** Nested items, for group headers. */
  children?: NavItemConfig[];
  /** Marks a purely visual separator between sibling items; no other field applies. */
  divider?: boolean;
}

/**
 * The application's full navigation tree, transcribed from the sidebar
 * template. Permission and feature-flag gates match the ones already applied
 * to `sidebar.component.ts` — no new gates are introduced here.
 */
const NAV_CONFIG: readonly NavItemConfig[] = [
  { route: '/dashboard', labelKey: 'nav.dashboard', icon: 'dashboard' },
  { route: '/notifications', labelKey: 'nav.notifications', icon: 'notifications' },
  { route: '/search', labelKey: 'SIDEBAR.SEARCH', icon: 'search' },
  { route: '/profile', labelKey: 'SIDEBAR.PROFILE', icon: 'account_circle' },
  { route: '/clients', labelKey: 'nav.clients', icon: 'people' },
  { route: '/clients/search', labelKey: 'nav.clientSearchV2', icon: 'manage_search' },
  { route: '/groups', labelKey: 'nav.groups', icon: 'group', featureFlag: 'groups' },
  { route: '/centers', labelKey: 'nav.centers', icon: 'place', featureFlag: 'centers' },
  {
    route: '/collection-sheet',
    labelKey: 'nav.collectionSheet',
    icon: 'receipt_long',
    featureFlag: 'collection_sheet',
  },
  { route: '/loans', labelKey: 'nav.loans', icon: 'payments' },
  { route: '/loans/bulk-reassignment', labelKey: 'nav.bulkReassignment', icon: 'swap_horiz' },
  { route: '/loans/point-in-time', labelKey: 'nav.loansPointInTime', icon: 'schedule' },
  { route: '/loans/account-locks', labelKey: 'LOAN_ACCOUNT_LOCK.TITLE', icon: 'lock' },
  { route: '/loans/cob-catchup', labelKey: 'LOAN_COB_CATCHUP.TITLE', icon: 'update' },
  {
    route: '/loans/schedule-modify',
    labelKey: 'LOAN_SCHEDULE_MODIFY.TITLE',
    icon: 'edit_calendar',
  },
  {
    labelKey: 'nav.transfers',
    children: [
      {
        route: '/transfers/account-transfer',
        labelKey: 'nav.accountTransfer',
        icon: 'swap_horiz',
        requiredPermissions: 'READ_ACCOUNTTRANSFER',
      },
      {
        route: '/transfers/standing-instructions',
        labelKey: 'nav.standingInstructions',
        icon: 'schedule_send',
        requiredPermissions: 'READ_STANDINGINSTRUCTION',
      },
      {
        route: '/transfers/standing-instructions/history',
        labelKey: 'nav.standingInstructionsHistory',
        icon: 'history',
        requiredPermissions: 'READ_STANDINGINSTRUCTION',
      },
      { route: '/transfers/history', labelKey: 'nav.transferHistory', icon: 'history' },
    ],
  },
  {
    labelKey: 'nav.products',
    children: [
      { route: '/products/loan', labelKey: 'nav.loanProducts', icon: 'currency_exchange' },
      { route: '/products/savings', labelKey: 'nav.savingsProducts', icon: 'savings' },
      { route: '/products/fixed', labelKey: 'nav.fixedDepositProducts', icon: 'account_balance' },
      {
        route: '/products/recurring',
        labelKey: 'nav.recurringDepositProducts',
        icon: 'autorenew',
      },
      { route: '/products/share', labelKey: 'nav.shareProducts', icon: 'pie_chart' },
      { route: '/products/tax-components', labelKey: 'nav.taxComponents', icon: 'percent' },
      { route: '/products/tax-groups', labelKey: 'nav.taxGroups', icon: 'receipt_long' },
      { route: '/products/floating-rates', labelKey: 'nav.floatingRates', icon: 'trending_up' },
      { route: '/products/rates', labelKey: 'nav.rates', icon: 'percent' },
      {
        route: '/products/interest-rate-charts',
        labelKey: 'nav.interestRateCharts',
        icon: 'show_chart',
      },
      {
        route: '/products/loan-originators',
        labelKey: 'nav.loanOriginators',
        icon: 'groups',
      },
      {
        route: '/products/collateral-management',
        labelKey: 'nav.collateralManagement',
        icon: 'inventory_2',
      },
      { labelKey: '', divider: true },
      { route: '/products/savings-accounts', labelKey: 'nav.savingsAccounts', icon: 'wallet' },
      { route: '/products/fixed-deposits', labelKey: 'nav.fixedDeposits', icon: 'lock' },
      { route: '/products/recurring-deposits', labelKey: 'nav.recurringDeposits', icon: 'history' },
      { route: '/products/shares', labelKey: 'nav.shares', icon: 'show_chart' },
    ],
  },
  {
    labelKey: 'nav.workingCapital',
    children: [
      {
        route: '/working-capital/loans',
        labelKey: 'nav.wcLoans',
        icon: 'account_balance',
        requiredPermissions: 'READ_WORKINGCAPITALLOAN',
      },
      {
        route: '/working-capital/loan-products',
        labelKey: 'nav.wcLoanProducts',
        icon: 'account_balance_wallet',
        requiredPermissions: 'READ_WORKINGCAPITALLOANPRODUCT',
      },
      {
        route: '/working-capital/breach',
        labelKey: 'nav.wcBreach',
        icon: 'report_problem',
        requiredPermissions: 'READ_WORKINGCAPITALBREACH',
      },
      {
        route: '/working-capital/near-breach',
        labelKey: 'nav.wcNearBreach',
        icon: 'warning_amber',
        requiredPermissions: 'READ_WORKINGCAPITALNEARBREACH',
      },
      {
        route: '/working-capital/loans/account-locks',
        labelKey: 'WC_LOAN_ACCOUNT_LOCK.TITLE',
        icon: 'lock',
      },
      {
        route: '/working-capital/loans/cob-catchup',
        labelKey: 'WC_LOAN_COB_CATCHUP.TITLE',
        icon: 'update',
      },
      { route: '/admin/wc-cob-tools', labelKey: 'WC_COB_TOOLS.TITLE', icon: 'settings_suggest' },
    ],
  },
  {
    labelKey: 'nav.spmMix',
    children: [
      { route: '/spm/surveys', labelKey: 'nav.spmSurveys', icon: 'poll' },
      { route: '/spm/poverty-line', labelKey: 'nav.povertyLine', icon: 'trending_down' },
      { route: '/spm/likelihood', labelKey: 'nav.likelihood', icon: 'analytics' },
      { route: '/mix/mapping', labelKey: 'nav.mixMapping', icon: 'link' },
      { route: '/mix/report', labelKey: 'nav.mixReport', icon: 'summarize' },
      { route: '/mix/taxonomy', labelKey: 'nav.mixTaxonomy', icon: 'schema' },
      { route: '/spm/survey-responses', labelKey: 'SURVEY_RESPONSES.TITLE', icon: 'quiz' },
    ],
  },
  {
    labelKey: 'Campaigns',
    children: [
      {
        route: '/campaigns/email',
        labelKey: 'EMAIL_CAMPAIGNS.TITLE',
        icon: 'campaign',
        requiredPermissions: 'READ_EMAIL_CAMPAIGN',
      },
      {
        route: '/campaigns/sms',
        labelKey: 'SMS_CAMPAIGNS.TITLE',
        icon: 'sms',
        requiredPermissions: 'READ_SMSCAMPAIGN',
      },
      { route: '/campaigns/email-messages', labelKey: 'EMAIL_MESSAGES.TITLE', icon: 'mail' },
    ],
  },
  {
    labelKey: 'Interop',
    children: [
      {
        route: '/interop/parties',
        labelKey: 'INTEROP.PARTY_TITLE',
        icon: 'people',
        requiredPermissions: 'READ_INTERID',
      },
      { route: '/interop/accounts', labelKey: 'INTEROP.ACCOUNT_TITLE', icon: 'account_balance' },
      {
        route: '/interop/quotes',
        labelKey: 'INTEROP.QUOTES_TITLE',
        icon: 'request_quote',
        requiredPermissions: 'READ_INTERQUOTE',
      },
      {
        route: '/interop/transfers',
        labelKey: 'INTEROP.TRANSFER_TITLE',
        icon: 'transfer_within_a_station',
        requiredPermissions: 'READ_INTERTRANSFER',
      },
      { route: '/interop/health', labelKey: 'INTEROP.HEALTH_TITLE', icon: 'monitor_heart' },
    ],
  },
  {
    labelKey: 'Admin',
    requiredPermissions: 'READ_SCHEDULER',
    children: [
      {
        route: '/admin/batch-operations',
        labelKey: 'BATCH_OPERATIONS.TITLE',
        icon: 'batch_prediction',
      },
      { route: '/admin/inline-job', labelKey: 'INLINE_JOB.TITLE', icon: 'play_circle' },
      { route: '/admin/cob-tools', labelKey: 'COB_TOOLS.TITLE', icon: 'engineering' },
      { route: '/admin/wc-cob-tools', labelKey: 'WC_COB_TOOLS.TITLE', icon: 'build' },
      { route: '/admin/external-events', labelKey: 'EXTERNAL_EVENTS.TITLE', icon: 'event_note' },
      {
        route: '/admin/progressive-loan',
        labelKey: 'PROGRESSIVE_LOAN.TITLE',
        icon: 'trending_up',
      },
    ],
  },
  {
    labelKey: 'nav.fintech',
    children: [
      {
        route: '/fintech/asset-owners',
        labelKey: 'nav.assetOwners',
        icon: 'admin_panel_settings',
      },
    ],
  },
  {
    labelKey: 'nav.accounting',
    requiredPermissions: 'READ_GLACCOUNT',
    children: [
      {
        route: '/accounting/chart-of-accounts',
        labelKey: 'nav.chartOfAccounts',
        icon: 'account_tree',
      },
      {
        route: '/accounting/journal-entries',
        labelKey: 'nav.journalEntries',
        icon: 'menu_book',
      },
      {
        route: '/accounting/closures',
        labelKey: 'nav.accountingClosures',
        icon: 'assignment_turned_in',
      },
      { route: '/accounting/rules', labelKey: 'nav.accountingRules', icon: 'gavel' },
      {
        route: '/accounting/financial-activity-mappings',
        labelKey: 'nav.financialActivityMappings',
        icon: 'swap_horiz',
      },
      { route: '/accounting/charges', labelKey: 'nav.charges', icon: 'percent' },
      {
        route: '/accounting/provisioning-categories',
        labelKey: 'nav.provisioningCategories',
        icon: 'category',
      },
      {
        route: '/accounting/provisioning-criteria',
        labelKey: 'nav.provisioningCriteria',
        icon: 'rule',
      },
      {
        route: '/accounting/provisioning-entries',
        labelKey: 'nav.provisioningEntries',
        icon: 'receipt',
      },
      { route: '/accounting/run-accruals', labelKey: 'nav.runAccruals', icon: 'calculate' },
    ],
  },
  {
    labelKey: 'nav.tasks',
    children: [{ route: '/tasks/checker-inbox', labelKey: 'nav.checker_inbox', icon: 'inbox' }],
  },
  {
    labelKey: 'nav.security',
    requiredPermissions: ['READ_USER', 'READ_ROLE', 'READ_AUDIT'],
    children: [
      { route: '/security/users', labelKey: 'nav.users', icon: 'person_outline' },
      { route: '/security/roles', labelKey: 'nav.roles', icon: 'manage_accounts' },
      { route: '/security/audits', labelKey: 'nav.audits', icon: 'history_edits' },
    ],
  },
  {
    labelKey: 'nav.reporting',
    children: [{ route: '/reporting', labelKey: 'nav.reports', icon: 'assessment' }],
  },
  {
    labelKey: 'nav.settings',
    requiredPermissions: 'READ_CONFIGURATION',
    children: [
      {
        route: '/settings/configurations',
        labelKey: 'nav.globalConfigurations',
        icon: 'tune',
      },
      { route: '/settings/holidays', labelKey: 'nav.holidays', icon: 'event_busy' },
      { route: '/settings/working-days', labelKey: 'nav.workingDays', icon: 'calendar_today' },
      {
        route: '/settings/two-factor',
        labelKey: 'TWO_FACTOR_CONFIG.TITLE',
        icon: 'security',
      },
      {
        route: '/auth/forgot-password',
        labelKey: 'FORGOT_PASSWORD.TITLE',
        icon: 'lock_reset',
      },
    ],
  },
  {
    labelKey: 'nav.tellerOperations',
    children: [
      { route: '/tellers', labelKey: 'nav.tellers', icon: 'storefront' },
      {
        route: '/tellers/cashier-journals',
        labelKey: 'nav.cashierJournals',
        icon: 'menu_book',
      },
    ],
  },
  {
    labelKey: 'nav.organization',
    children: [
      { route: '/organization/offices', labelKey: 'nav.offices', icon: 'corporate_fare' },
      { route: '/organization/staff', labelKey: 'nav.staff', icon: 'badge' },
      { route: '/organization/funds', labelKey: 'nav.funds', icon: 'savings' },
      {
        route: '/organization/payment-types',
        labelKey: 'nav.paymentTypes',
        icon: 'payments',
      },
      {
        route: '/organization/group-levels',
        labelKey: 'nav.groupLevels',
        icon: 'account_tree',
      },
      {
        route: '/organization/currencies',
        labelKey: 'nav.currencies',
        icon: 'currency_exchange',
      },
      {
        route: '/organization/account-number-formats',
        labelKey: 'nav.accountNumberFormats',
        icon: 'format_list_numbered',
      },
      {
        route: '/organization/office-transactions',
        labelKey: 'OFFICE_TRANSACTIONS.TITLE',
        icon: 'swap_horiz',
      },
    ],
  },
  {
    labelKey: 'nav.system',
    requiredPermissions: ['READ_DATATABLE', 'READ_HOOK'],
    children: [
      { route: '/system/data-tables', labelKey: 'nav.dataTables', icon: 'table_chart' },
      { route: '/system/bulk-import', labelKey: 'nav.bulkImport', icon: 'publish' },
      { route: '/system/delinquency', labelKey: 'nav.delinquency', icon: 'gavel' },
      { route: '/system/hooks', labelKey: 'nav.hooks', icon: 'webhook' },
      {
        route: '/system/credit-bureau-config',
        labelKey: 'nav.creditBureauConfig',
        icon: 'credit_score',
      },
      { route: '/system/adhoc-query', labelKey: 'nav.adhocQuery', icon: 'query_stats' },
      { route: '/system/sms', labelKey: 'nav.sms', icon: 'sms' },
      {
        route: '/system/report-mailing-jobs',
        labelKey: 'nav.reportMailingJobs',
        icon: 'mark_email_read',
      },
      {
        route: '/system/entity-data-table-checks',
        labelKey: 'nav.entityDataTableChecks',
        icon: 'fact_check',
      },
      {
        route: '/system/entity-mapping',
        labelKey: 'nav.entityMapping',
        icon: 'account_tree',
      },
      {
        route: '/system/scheduler-jobs',
        labelKey: 'nav.schedulerJobs',
        icon: 'schedule',
      },
      { route: '/system/permissions', labelKey: 'nav.permissions', icon: 'verified_user' },
      {
        route: '/system/business-steps',
        labelKey: 'nav.businessSteps',
        icon: 'linear_scale',
      },
      { route: '/system/cache', labelKey: 'nav.cache', icon: 'memory' },
      {
        route: '/system/external-events',
        labelKey: 'nav.externalEvents',
        icon: 'event_note',
      },
      {
        route: '/system/external-services',
        labelKey: 'nav.externalServices',
        icon: 'cloud',
      },
      {
        route: '/system/password-preferences',
        labelKey: 'nav.passwordPreferences',
        icon: 'password',
      },
      {
        route: '/system/notifications-config',
        labelKey: 'nav.notificationsConfig',
        icon: 'notifications',
      },
      {
        route: '/system/instance-mode',
        labelKey: 'nav.instanceMode',
        icon: 'tune',
      },
      { route: '/system/oidc-config', labelKey: 'nav.oidcConfig', icon: 'vpn_key' },
      {
        route: '/system/field-configuration',
        labelKey: 'nav.fieldConfiguration',
        icon: 'view_column',
      },
      {
        route: '/system/loan-product-details',
        labelKey: 'nav.loanProductDetails',
        icon: 'description',
      },
      { route: '/system/codes', labelKey: 'nav.codes', icon: 'code' },
      {
        route: '/system/business-dates',
        labelKey: 'nav.businessDates',
        icon: 'today',
      },
      { route: '/system/templates', labelKey: 'nav.templates', icon: 'description' },
    ],
  },
];

/**
 * Recursively filters a navigation tree using the given visibility predicate.
 * Dividers always pass through. A group whose children are all filtered out
 * is itself omitted, so consumers never need to special-case an empty group
 * header. Pure and Angular-free, so it is directly unit-testable with
 * synthetic trees.
 *
 * @param items - The nav tree (or subtree) to filter
 * @param isVisible - Predicate deciding whether a single, non-divider item passes
 */
export function filterNavItems(
  items: readonly NavItemConfig[],
  isVisible: (item: NavItemConfig) => boolean,
): NavItemConfig[] {
  return items.reduce<NavItemConfig[]>((visible, item) => {
    if (item.divider) {
      visible.push(item);
      return visible;
    }

    if (!isVisible(item)) {
      return visible;
    }

    if (item.children) {
      const filteredChildren = filterNavItems(item.children, isVisible);
      if (filteredChildren.length === 0) {
        return visible;
      }
      visible.push({ ...item, children: filteredChildren });
      return visible;
    }

    visible.push(item);
    return visible;
  }, []);
}

/**
 * Provides the application's navigation tree, filtered by the current user's
 * permissions and institution configuration.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationConfigService {
  private readonly authService = inject(AuthService);
  private readonly institutionConfig = inject(InstitutionConfigService);

  /** The full, unfiltered navigation tree. */
  readonly navConfig: readonly NavItemConfig[] = NAV_CONFIG;

  /**
   * Reactive, filtered navigation tree — recomputed whenever the current
   * user's permissions or the institution type change.
   */
  readonly filteredNavItems = computed(() => {
    // Access the signals so this computed re-evaluates when either changes.
    this.authService.currentUser();
    this.institutionConfig.institutionType();
    return filterNavItems(NAV_CONFIG, (item) => this.isItemVisible(item));
  });

  private isItemVisible(item: NavItemConfig): boolean {
    if (!environment.rbacEnabled) {
      return true;
    }

    if (item.featureFlag && !this.institutionConfig.isFeatureEnabled(item.featureFlag)) {
      return false;
    }

    if (
      item.requiredPermissions &&
      !this.authService.hasPermission(
        item.requiredPermissions,
        item.requiredAllPermissions ?? false,
      )
    ) {
      return false;
    }

    return true;
  }
}
