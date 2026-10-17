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
 * The loan transaction type flags the loan screen branches on that the generated response type
 * leaves out.
 *
 * Fineract sends one JSON shape for a transaction's type and the generated client has two types
 * for it. `GetLoansLoanIdLoanTransactionEnumData` — the shape on the loan response, and so the
 * one the transactions table actually holds — is a strict subset of `LoanTransactionEnumData`,
 * missing ten flags: `accrualActivity`, `accrualAdjustment`, `chargeRefund`, `chargeback`,
 * `downPayment`, `interestPaymentWaiver`, `interestRefund`, `reAge`, `reAmortize` and
 * `repaymentType`. The payload carries whichever of them apply:
 *
 * ```json
 * {"id":31,"code":"loanTransactionType.reAge","value":"Re-age","reAge":true}
 * ```
 *
 * So the loan-response type is the one that is wrong, which is issue #653. Only the two this
 * screen branches on are declared here, rather than all ten — a flag nothing reads would be an
 * unused claim about the wire, and the subset is already written down above. Declaring them
 * keeps the correction in one place: a branch reads `transactionFlags(tx).reAge` rather than
 * casting at each use, and when the generated type is fixed this file is what gets deleted.
 */
export interface LoanTransactionTypeFlags {
  readonly reAge?: boolean;
  readonly reAmortize?: boolean;
}

/**
 * Reads the undeclared type flags off a transaction.
 *
 * Answers an empty object for a transaction with no type, so callers can read a flag without
 * first checking that there is a type to read it from.
 */
export function transactionFlags(transaction: { type?: unknown }): LoanTransactionTypeFlags {
  return (transaction.type ?? {}) as LoanTransactionTypeFlags;
}
