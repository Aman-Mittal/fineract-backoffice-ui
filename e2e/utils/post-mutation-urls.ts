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

/** Record view the app opens after a successful client create or update. */
export const URL_CLIENT_VIEW = /\/clients\/view\/\d+$/;

/** Record view after a successful group create or update. */
export const URL_GROUP_VIEW = /\/groups\/view\/\d+$/;

/** Record view after a successful loan create or loan account action / transaction. */
export const URL_LOAN_VIEW = /\/loans\/view\/\d+$/;

export function urlLoanView(loanId: number): string {
  return `/loans/view/${loanId}`;
}

/** Record view after a successful savings account create or account action / transaction. */
export const URL_SAVINGS_ACCOUNT_VIEW = /\/products\/savings-accounts\/view\/\d+$/;

export function urlSavingsAccountView(savingsId: number): string {
  return `/products/savings-accounts/view/${savingsId}`;
}
