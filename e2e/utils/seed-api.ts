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

export const API_BASE =
  process.env.FINERACT_API_BASE ?? 'https://localhost:8443/fineract-provider/api/v1';
export const TENANT = process.env.FINERACT_TENANT_ID ?? 'default';
const USERNAME = process.env.FINERACT_USERNAME ?? 'mifos';
const PASSWORD = process.env.FINERACT_PASSWORD ?? 'password';

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
