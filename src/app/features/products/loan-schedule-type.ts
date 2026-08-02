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

export const LOAN_SCHEDULE_TYPE = {
  CUMULATIVE: 'CUMULATIVE',
  PROGRESSIVE: 'PROGRESSIVE',
} as const;

export const ADVANCED_PAYMENT_ALLOCATION_STRATEGY = 'advanced-payment-allocation-strategy';

/** What Fineract applies when a product does not name a strategy. Never valid for progressive. */
export const DEFAULT_TRANSACTION_PROCESSING_STRATEGY = 'mifos-standard-strategy';

export function isAdvancedPaymentAllocationStrategy(code: string | undefined | null): boolean {
  return code === ADVANCED_PAYMENT_ALLOCATION_STRATEGY;
}

export function isProgressiveScheduleType(code: string | undefined | null): boolean {
  return code === LOAN_SCHEDULE_TYPE.PROGRESSIVE;
}

/**
 * The only repayment strategy a product with this schedule type may carry.
 *
 * The two engines do not merely prefer different strategies — progressive *is* the advanced
 * payment allocation engine, and Fineract rejects the pairing outright the other way round. Any
 * code that has to pick a strategy without one to copy should ask here rather than assume the
 * standard one.
 */
export function requiredStrategyFor(scheduleTypeCode: string | undefined | null): string {
  return isProgressiveScheduleType(scheduleTypeCode)
    ? ADVANCED_PAYMENT_ALLOCATION_STRATEGY
    : DEFAULT_TRANSACTION_PROCESSING_STRATEGY;
}

/**
 * Reads `loanScheduleType` off a loan product.
 *
 * `GET /loanproducts` returns it, but the generated `GetLoanProductsResponse` list model omits
 * it, so it can only be reached through a cast. Kept here so the cast exists once rather than at
 * every call site that needs to tell the two engines apart.
 */
export function readScheduleTypeCode(product: unknown): string | undefined {
  return (product as { loanScheduleType?: { code?: string } } | null | undefined)?.loanScheduleType
    ?.code;
}

export function readScheduleTypeLabel(product: unknown): string {
  const label = (product as { loanScheduleType?: { value?: string } } | null | undefined)
    ?.loanScheduleType?.value;
  return (
    label ??
    (isProgressiveScheduleType(readScheduleTypeCode(product)) ? 'Progressive' : 'Cumulative')
  );
}
