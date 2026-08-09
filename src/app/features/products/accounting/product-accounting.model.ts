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
 * What a product's accounting configuration is made of, as data.
 *
 * The five product families each map a different set of GL accounts, but they map them the same
 * way: pick a rule, then fill one account per slot the rule requires. Describing the slots as a
 * list means the section component renders any family without knowing which one it is, and a
 * family is added by writing its list rather than another form.
 */

/**
 * Fineract's `accountingRuleType` enum.
 *
 * The platform returns these as `accountingRuleOptions` on every product template, and the
 * section renders its selector from that response so the labels are the tenant's own. The ids
 * are named here because the *behaviour* keys off them — which slots a rule requires is a fact
 * about the rule, not a string the server sends.
 */
export const ACCOUNTING_RULE = {
  NONE: 1,
  CASH: 2,
  ACCRUAL_PERIODIC: 3,
  ACCRUAL_UPFRONT: 4,
} as const;

export type AccountingRuleId = (typeof ACCOUNTING_RULE)[keyof typeof ACCOUNTING_RULE];

/** Every rule that posts to the ledger — i.e. everything except `NONE`. */
export const ACCOUNTING_RULES_WITH_MAPPINGS: readonly AccountingRuleId[] = [
  ACCOUNTING_RULE.CASH,
  ACCOUNTING_RULE.ACCRUAL_PERIODIC,
  ACCOUNTING_RULE.ACCRUAL_UPFRONT,
];

/** The two accrual rules, which require the receivable slots on top of the cash ones. */
export const ACCRUAL_RULES: readonly AccountingRuleId[] = [
  ACCOUNTING_RULE.ACCRUAL_PERIODIC,
  ACCOUNTING_RULE.ACCRUAL_UPFRONT,
];

/**
 * The four GL account classes a product slot can draw from.
 *
 * Not cosmetic. Pointing a slot at an account of the wrong class is refused —
 * `403 validation.msg.domain.rule.violation`, "Passed in GLAccount fundSourceAccountId with Id 5
 * maps to the account Probe INC of type INCOME, the expected account type was ASSET" — so the
 * class each slot expects is what makes the picker able to only offer accounts that will work.
 */
export type GlAccountType = 'asset' | 'liability' | 'income' | 'expense';

/** A GL account as the product template offers it. */
export interface GlAccountOption {
  id?: number;
  name?: string;
  glCode?: string;
}

/**
 * The template's `accountingMappingOptions`, one list per account class.
 *
 * Every list is optional because the platform **omits the key entirely** when the tenant has no
 * accounts of that class — a fresh install has none at all. A form that assumed four lists would
 * render four empty dropdowns and no explanation; {@link ProductAccountingSectionComponent} says
 * so instead.
 */
export interface GlAccountOptions {
  assetAccountOptions?: Iterable<GlAccountOption>;
  liabilityAccountOptions?: Iterable<GlAccountOption>;
  incomeAccountOptions?: Iterable<GlAccountOption>;
  expenseAccountOptions?: Iterable<GlAccountOption>;
}

/** One account slot on a product. */
export interface AccountingMappingField {
  /** The key the create/update request carries, e.g. `fundSourceAccountId`. */
  readonly key: string;
  /** The key the product response carries under `accountingMappings`, e.g. `fundSourceAccount`. */
  readonly responseKey: string;
  /** Which class of account the platform expects here. */
  readonly accountType: GlAccountType;
  /** Translation key for the field label. */
  readonly label: string;
  /** The rules that require this slot. A rule outside this list must not send the key. */
  readonly rules: readonly AccountingRuleId[];
}

/** The id/name pair a product response carries for a mapped account. */
export interface MappedGlAccount {
  id?: number;
  name?: string;
}

/** Selected accounts, keyed by request key. */
export type AccountingMappings = Record<string, number | undefined>;

/**
 * The slots a **loan product** maps.
 *
 * Taken from the platform rather than from documentation: posting a loan product with a rule and
 * no mappings answers 400 and names every missing parameter, which enumerates the mandatory set
 * exactly. Against Fineract at the time of writing, `CASH` names nine and both accrual rules name
 * those nine plus the three receivables — including `incomeFromRecoveryAccountId`, which is easy
 * to miss because recovery is not part of the ordinary repayment story.
 *
 * Reproduce with:
 *
 *     POST /loanproducts  {"accountingRule": 2, …no mapping ids…}
 */
export const LOAN_ACCOUNTING_FIELDS: readonly AccountingMappingField[] = [
  {
    key: 'fundSourceAccountId',
    responseKey: 'fundSourceAccount',
    accountType: 'asset',
    label: 'PRODUCTS.ACCOUNTING.FUND_SOURCE',
    rules: ACCOUNTING_RULES_WITH_MAPPINGS,
  },
  {
    key: 'loanPortfolioAccountId',
    responseKey: 'loanPortfolioAccount',
    accountType: 'asset',
    label: 'PRODUCTS.ACCOUNTING.LOAN_PORTFOLIO',
    rules: ACCOUNTING_RULES_WITH_MAPPINGS,
  },
  {
    key: 'transfersInSuspenseAccountId',
    responseKey: 'transfersInSuspenseAccount',
    accountType: 'asset',
    label: 'PRODUCTS.ACCOUNTING.TRANSFERS_IN_SUSPENSE',
    rules: ACCOUNTING_RULES_WITH_MAPPINGS,
  },
  {
    key: 'receivableInterestAccountId',
    responseKey: 'receivableInterestAccount',
    accountType: 'asset',
    label: 'PRODUCTS.ACCOUNTING.RECEIVABLE_INTEREST',
    rules: ACCRUAL_RULES,
  },
  {
    key: 'receivableFeeAccountId',
    responseKey: 'receivableFeeAccount',
    accountType: 'asset',
    label: 'PRODUCTS.ACCOUNTING.RECEIVABLE_FEE',
    rules: ACCRUAL_RULES,
  },
  {
    key: 'receivablePenaltyAccountId',
    responseKey: 'receivablePenaltyAccount',
    accountType: 'asset',
    label: 'PRODUCTS.ACCOUNTING.RECEIVABLE_PENALTY',
    rules: ACCRUAL_RULES,
  },
  {
    key: 'interestOnLoanAccountId',
    responseKey: 'interestOnLoanAccount',
    accountType: 'income',
    label: 'PRODUCTS.ACCOUNTING.INTEREST_ON_LOANS',
    rules: ACCOUNTING_RULES_WITH_MAPPINGS,
  },
  {
    key: 'incomeFromFeeAccountId',
    responseKey: 'incomeFromFeeAccount',
    accountType: 'income',
    label: 'PRODUCTS.ACCOUNTING.INCOME_FROM_FEES',
    rules: ACCOUNTING_RULES_WITH_MAPPINGS,
  },
  {
    key: 'incomeFromPenaltyAccountId',
    responseKey: 'incomeFromPenaltyAccount',
    accountType: 'income',
    label: 'PRODUCTS.ACCOUNTING.INCOME_FROM_PENALTIES',
    rules: ACCOUNTING_RULES_WITH_MAPPINGS,
  },
  {
    key: 'incomeFromRecoveryAccountId',
    responseKey: 'incomeFromRecoveryAccount',
    accountType: 'income',
    label: 'PRODUCTS.ACCOUNTING.INCOME_FROM_RECOVERY',
    rules: ACCOUNTING_RULES_WITH_MAPPINGS,
  },
  {
    key: 'writeOffAccountId',
    responseKey: 'writeOffAccount',
    accountType: 'expense',
    label: 'PRODUCTS.ACCOUNTING.LOSSES_WRITTEN_OFF',
    rules: ACCOUNTING_RULES_WITH_MAPPINGS,
  },
  {
    key: 'overpaymentLiabilityAccountId',
    responseKey: 'overpaymentLiabilityAccount',
    accountType: 'liability',
    label: 'PRODUCTS.ACCOUNTING.OVERPAYMENT_LIABILITY',
    rules: ACCOUNTING_RULES_WITH_MAPPINGS,
  },
];

/** The slots `rule` requires, in declaration order. */
export function fieldsForRule(
  fields: readonly AccountingMappingField[],
  rule: number | undefined,
): AccountingMappingField[] {
  return fields.filter((field) => field.rules.includes(rule as AccountingRuleId));
}

/**
 * The mapping keys to send for `rule`, and nothing else.
 *
 * Two things this exists to prevent. A rule of `NONE` must send no mapping keys at all — the
 * platform rejects a stray `null`. And a slot left over from a previously selected rule must not
 * ride along: switching accrual → cash while three receivable ids sit in the model would send
 * receivables the cash rule has no slot for.
 */
export function mappingsForRule(
  fields: readonly AccountingMappingField[],
  rule: number | undefined,
  mappings: AccountingMappings,
): AccountingMappings {
  const payload: AccountingMappings = {};
  for (const field of fieldsForRule(fields, rule)) {
    const accountId = mappings[field.key];
    if (accountId !== undefined && accountId !== null) {
      payload[field.key] = accountId;
    }
  }
  return payload;
}

/**
 * The mappings a loaded product already has, keyed the way the form holds them.
 *
 * The response nests each one as `{ id, name }` under a key without the `Id` suffix, so this is
 * the only place that knows the two spellings are the same slot. Reading it is what stops an
 * edit from blanking a configured product.
 */
export function mappingsFromResponse(
  fields: readonly AccountingMappingField[],
  accountingMappings: object | undefined,
): AccountingMappings {
  const mappings: AccountingMappings = {};
  if (!accountingMappings) return mappings;

  // The generated `GetLoanAccountingMappings` (and its four siblings) declare their slots as
  // named properties with no index signature, so they cannot be read by a computed key without
  // this. Widened rather than narrowed: each family's response names a different subset, and the
  // field list is already the authority on which of them this product has.
  const source = accountingMappings as Record<string, MappedGlAccount | undefined>;

  for (const field of fields) {
    const accountId = source[field.responseKey]?.id;
    if (accountId !== undefined) {
      mappings[field.key] = accountId;
    }
  }
  return mappings;
}
