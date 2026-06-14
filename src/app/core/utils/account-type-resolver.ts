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
 * Resolves the account type segment used in action/transaction routes.
 *
 * @param account - The account object (standard savings, fixed deposit, or recurring deposit)
 * @returns 'savings' | 'fixed' | 'recurring'
 */
export function resolveAccountActionType(
  account: Record<string, unknown> | null | undefined,
): 'savings' | 'fixed' | 'recurring' {
  if (!account) return 'savings';

  let depositTypeId: number | undefined;

  // 1. Check nested depositType object (standard for SavingsAccountData)
  if (account['depositType']) {
    const depositType = account['depositType'] as Record<string, unknown>;
    depositTypeId = depositType['id'] as number | undefined;
  }

  // 2. Check root depositTypeId (sometimes returned by API)
  if (!depositTypeId && account['depositTypeId']) {
    depositTypeId = account['depositTypeId'] as number | undefined;
  }

  // 3. Fallback to product name if we still don't know
  if (!depositTypeId && account['productName'] && typeof account['productName'] === 'string') {
    const name = account['productName'].toLowerCase();
    if (name.includes('fixed')) return 'fixed';
    if (name.includes('recurring')) return 'recurring';
  }

  if (depositTypeId === 200) return 'fixed';
  if (depositTypeId === 300) return 'recurring';

  return 'savings';
}

/**
 * Resolves the route path prefix segment (e.g., 'savings-accounts', 'fixed-deposits', 'recurring-deposits').
 *
 * @param account - The account object
 * @returns 'savings-accounts' | 'fixed-deposits' | 'recurring-deposits'
 */
export function resolveAccountRoutePrefix(
  account: Record<string, unknown> | null | undefined,
): 'savings-accounts' | 'fixed-deposits' | 'recurring-deposits' {
  const type = resolveAccountActionType(account);
  if (type === 'fixed') return 'fixed-deposits';
  if (type === 'recurring') return 'recurring-deposits';
  return 'savings-accounts';
}
