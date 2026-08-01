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

/**
 * Builds e2e fixture data directly against the Fineract REST API.
 *
 * The loan specs used to assemble their own prerequisites by driving the UI —
 * filling the client form, then the product form, then the loan form. That made
 * every one of them depend on the whole chain: a single flaky control failed the
 * test for a reason unrelated to what it was asserting. The client-search
 * dropdown was the usual culprit, since a newly created client is not always
 * returned by the search endpoint straight away.
 *
 * Seeding over HTTP removes that coupling. Setup is deterministic and takes
 * about a second, and the UI assertions are left to test only the behaviour they
 * name.
 *
 * Talks to the backend directly rather than through the dev-server proxy: this
 * runs in Node, where a relative path has nothing to resolve against.
 */

import { APIRequestContext, request as playwrightRequest } from '@playwright/test';

import { API_BASE, PASSWORD, TENANT_ID, USERNAME, assertBackendReachable } from './backend-env';

export { API_BASE };
/** Kept as `TENANT` for the existing call sites; `TENANT_ID` is the canonical name. */
export const TENANT = TENANT_ID;

const DATE_FORMAT = 'dd MMMM yyyy';
const LOCALE = 'en';
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Fineract expects `dd MMMM yyyy` when `dateFormat` is set as above. */
export function fineractDate(d: Date = new Date()): string {
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Short random token; loan product shortName is capped at 4 characters. */
export function seedSuffix(): string {
  return Date.now().toString(36).slice(-6);
}

export async function createApiContext(): Promise<APIRequestContext> {
  return playwrightRequest.newContext({
    // No baseURL: a leading-slash path resolves against the origin only, which
    // would drop the /fineract-provider/api/v1 prefix. post() builds full URLs.
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Fineract-Platform-TenantId': TENANT,
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')}`,
    },
  });
}

async function post<T>(api: APIRequestContext, path: string, body: unknown): Promise<T> {
  const res = await api.post(`${API_BASE}${path}`, { data: body });
  if (!res.ok()) {
    throw new Error(`POST ${path} -> ${res.status()}: ${(await res.text()).slice(0, 400)}`);
  }
  return (await res.json()) as T;
}

async function get<T>(api: APIRequestContext, path: string): Promise<T> {
  const res = await api.get(`${API_BASE}${path}`);
  if (!res.ok()) {
    throw new Error(`GET ${path} -> ${res.status()}: ${(await res.text()).slice(0, 400)}`);
  }
  return (await res.json()) as T;
}

/**
 * Brings a bare Fineract up to the baseline the specs assume, once per run.
 *
 * Everything here is checked before it is created, because the compose stack keeps
 * its database in a named volume: the second run of the day starts from whatever the
 * first one left behind, not from a migration-fresh instance.
 *
 * The currency step is the one that actually matters. Fineract ships 163 currency
 * definitions but *enables* only what is in `m_organisation_currency`, and a loan
 * product cannot be created in a currency that is not enabled — which surfaces as an
 * unhelpful validation error on the product form rather than as anything about
 * currencies.
 */
export async function ensureReferenceData(api: APIRequestContext): Promise<void> {
  await assertBackendReachable(api);

  const currencies = await get<{ selectedCurrencyOptions?: { code: string }[] }>(
    api,
    '/currencies',
  );
  const enabled = (currencies.selectedCurrencyOptions ?? []).map((c) => c.code);
  if (!enabled.includes('USD')) {
    await put(api, '/currencies', { currencies: [...enabled, 'USD'] });
  }

  const paymentTypes = await get<unknown[]>(api, '/paymenttypes');
  if (paymentTypes.length === 0) {
    await post(api, '/paymenttypes', {
      name: 'E2E Cash',
      description: 'Seeded by the e2e suite',
      isCashPayment: true,
      position: 1,
    });
  }
}

async function put<T>(api: APIRequestContext, path: string, body: unknown): Promise<T> {
  const res = await api.put(`${API_BASE}${path}`, { data: body });
  if (!res.ok()) {
    throw new Error(`PUT ${path} -> ${res.status()}: ${(await res.text()).slice(0, 400)}`);
  }
  return (await res.json()) as T;
}

/**
 * A datatable registered against `m_loan`, so the loan view's Custom Fields tab has
 * something to show. Without one the tab renders SYSTEM.NO_DATA_TABLES_REGISTERED
 * and the demo's "add an entry" step silently does nothing.
 *
 * Reuses an existing e2e table rather than adding one per run — registered datatables
 * are DDL, so accumulating them would leave real tables behind in the volume.
 */
export async function seedLoanDatatable(api: APIRequestContext): Promise<string> {
  const existing = await get<{ registeredTableName: string; applicationTableName: string }[]>(
    api,
    '/datatables',
  );
  const found = existing.find(
    (t) => t.applicationTableName === 'm_loan' && t.registeredTableName.startsWith('e2e_loan_'),
  );
  if (found) {
    return found.registeredTableName;
  }

  const datatableName = `e2e_loan_remarks_${seedSuffix()}`;
  await post(api, '/datatables', {
    datatableName,
    apptableName: 'm_loan',
    multiRow: true,
    columns: [{ name: 'Remark', type: 'String', length: 200, mandatory: false }],
  });
  return datatableName;
}

/**
 * A collateral product, so the loan Collateral form opens with a non-empty product
 * dropdown instead of an unusable one.
 */
export async function seedCollateralProduct(api: APIRequestContext): Promise<number> {
  const existing = await get<{ id: number }[]>(api, '/collateral-management');
  if (existing.length > 0) {
    return existing[0].id;
  }

  const { resourceId } = await post<{ resourceId: number }>(api, '/collateral-management', {
    name: `E2E Gold ${seedSuffix()}`,
    quality: 'Fine',
    basePrice: 1000,
    pctToBase: 80,
    unitType: 'Grams',
    currency: 'USD',
    locale: LOCALE,
  });
  return resourceId;
}

export interface SeededOffice {
  officeId: number;
  officeName: string;
}

/**
 * A branch office under Head Office.
 *
 * A bare Fineract ships with exactly one office, so any screen that asks the user to
 * pick a branch has a single-entry dropdown and demonstrates nothing. Seeding a second
 * one gives those pickers something to actually choose between.
 */
export async function seedOffice(
  api: APIRequestContext,
  namePrefix = 'E2ESeed',
  parentId = 1,
): Promise<SeededOffice> {
  const officeName = `${namePrefix} Branch ${seedSuffix()}`;
  const { officeId } = await post<{ officeId: number }>(api, '/offices', {
    name: officeName,
    parentId,
    // Backdated so it is never rejected as being in the future relative to the
    // instance's business date.
    openingDate: '01 January 2020',
    dateFormat: DATE_FORMAT,
    locale: LOCALE,
  });
  return { officeId, officeName };
}

export interface SeededClient {
  clientId: number;
  firstName: string;
  lastName: string;
  displayName: string;
}

export async function seedClient(
  api: APIRequestContext,
  namePrefix = 'E2ESeed',
  officeId = 1,
): Promise<SeededClient> {
  const firstName = `${namePrefix}${seedSuffix()}`;
  const lastName = 'Tester';
  const { clientId } = await post<{ clientId: number }>(api, '/clients', {
    officeId,
    firstname: firstName,
    lastname: lastName,
    legalFormId: 1,
    active: true,
    activationDate: fineractDate(),
    dateFormat: DATE_FORMAT,
    locale: LOCALE,
  });
  return { clientId, firstName, lastName, displayName: `${firstName} ${lastName}` };
}

export interface SeededLoanProduct {
  productId: number;
  productName: string;
}

/**
 * Fineract's default payment allocation order, in the order the loan product
 * template returns it (GET /loanproducts/template -> advancedPaymentAllocationTypes).
 */
const ADVANCED_PAYMENT_ALLOCATION_ORDER = [
  'PAST_DUE_PENALTY',
  'PAST_DUE_FEE',
  'PAST_DUE_PRINCIPAL',
  'PAST_DUE_INTEREST',
  'DUE_PENALTY',
  'DUE_FEE',
  'DUE_PRINCIPAL',
  'DUE_INTEREST',
  'IN_ADVANCE_PENALTY',
  'IN_ADVANCE_FEE',
  'IN_ADVANCE_PRINCIPAL',
  'IN_ADVANCE_INTEREST',
];

/**
 * `isProgressive` switches the product to the progressive schedule + advanced
 * payment allocation pairing, which Fineract requires together.
 */
export async function seedLoanProduct(
  api: APIRequestContext,
  namePrefix = 'E2ESeed',
  isProgressive = false,
): Promise<SeededLoanProduct> {
  const suffix = seedSuffix();
  const productName = `${namePrefix} Product ${suffix}`;
  const body: Record<string, unknown> = {
    name: productName,
    shortName: suffix.slice(-4).toUpperCase(),
    currencyCode: 'USD',
    digitsAfterDecimal: 2,
    principal: 1000,
    numberOfRepayments: 3,
    repaymentEvery: 1,
    repaymentFrequencyType: 2,
    interestRatePerPeriod: 10,
    interestRateFrequencyType: 2,
    amortizationType: 1,
    interestType: 0,
    interestCalculationPeriodType: 1,
    accountingRule: 1,
    daysInYearType: 1,
    daysInMonthType: 1,
    isInterestRecalculationEnabled: false,
    transactionProcessingStrategyCode: isProgressive
      ? 'advanced-payment-allocation-strategy'
      : 'mifos-standard-strategy',
    locale: LOCALE,
    dateFormat: DATE_FORMAT,
  };
  if (isProgressive) {
    body['loanScheduleType'] = 'PROGRESSIVE';
    body['loanScheduleProcessingType'] = 'HORIZONTAL';
    // Fineract rejects the advanced-payment-allocation strategy outright unless a
    // DEFAULT allocation accompanies it ("no DEFAULT payment allocation was
    // provided"). This mirrors buildDefaultPaymentAllocation() in
    // features/products/loan-product-form.component.ts, so a seeded product matches
    // what the form would have created.
    body['paymentAllocation'] = [
      {
        transactionType: 'DEFAULT',
        futureInstallmentAllocationRule: 'NEXT_INSTALLMENT',
        paymentAllocationOrder: ADVANCED_PAYMENT_ALLOCATION_ORDER.map((rule, index) => ({
          order: index + 1,
          paymentAllocationRule: rule,
        })),
      },
    ];
  }
  const { resourceId } = await post<{ resourceId: number }>(api, '/loanproducts', body);
  return { productId: resourceId, productName };
}

export interface SeededLoan extends SeededClient, SeededLoanProduct {
  loanId: number;
}

/**
 * Creates a client, a loan product and a loan application, then approves and
 * disburses it — leaving an Active loan, the starting point the servicing specs
 * (repayment, notes, adjustment, write-off) assume.
 */
export async function seedActiveLoan(
  api: APIRequestContext,
  namePrefix = 'E2ESeed',
): Promise<SeededLoan> {
  const client = await seedClient(api, namePrefix);
  const product = await seedLoanProduct(api, namePrefix);
  const today = fineractDate();

  const { loanId } = await post<{ loanId: number }>(api, '/loans', {
    clientId: client.clientId,
    productId: product.productId,
    principal: 1000,
    loanTermFrequency: 3,
    loanTermFrequencyType: 2,
    numberOfRepayments: 3,
    repaymentEvery: 1,
    repaymentFrequencyType: 2,
    interestRatePerPeriod: 10,
    amortizationType: 1,
    interestType: 0,
    interestCalculationPeriodType: 1,
    transactionProcessingStrategyCode: 'mifos-standard-strategy',
    expectedDisbursementDate: today,
    submittedOnDate: today,
    loanType: 'individual',
    dateFormat: DATE_FORMAT,
    locale: LOCALE,
  });

  await post(api, `/loans/${loanId}?command=approve`, {
    approvedOnDate: today,
    dateFormat: DATE_FORMAT,
    locale: LOCALE,
  });
  await post(api, `/loans/${loanId}?command=disburse`, {
    actualDisbursementDate: today,
    dateFormat: DATE_FORMAT,
    locale: LOCALE,
  });

  return { ...client, ...product, loanId };
}

/** Repayment against an active loan — the precondition for adjustment specs. */
export async function seedRepayment(
  api: APIRequestContext,
  loanId: number,
  amount = 100,
): Promise<void> {
  await post(api, `/loans/${loanId}/transactions?command=repayment`, {
    transactionDate: fineractDate(),
    transactionAmount: amount,
    dateFormat: DATE_FORMAT,
    locale: LOCALE,
  });
}
