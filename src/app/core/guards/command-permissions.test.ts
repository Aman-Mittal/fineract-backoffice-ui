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

import {
  LOAN_COMMAND_PERMISSIONS,
  SAVINGS_COMMAND_PERMISSIONS,
  WC_LOAN_COMMAND_PERMISSIONS,
  commandPermission,
  loanCommandPermission,
  savingsCommandPermission,
  wcLoanCommandPermission,
} from './command-permissions';

/** A `paramMap` stand-in; the resolver only ever calls `get`. */
function params(values: Record<string, string>): { get(name: string): string | null } {
  return { get: (name) => values[name] ?? null };
}

/**
 * Commands the transaction form accepts but this map deliberately does not cover.
 *
 * Asserted as a list rather than left implicit, because the honest reason for each is that the
 * authorisation probe gave no clean answer — not that they were forgotten. If one of these ever
 * gains an entry, this test is where the claim that it was unknowable gets retired.
 */
const DELIBERATELY_UNMAPPED = ['undoContractTermination', 'reAmortize', 'undowriteoff'] as const;

describe('LOAN_COMMAND_PERMISSIONS', () => {
  it('maps every code to Fineract spelling: upper snake case, suffixed _LOAN', () => {
    // The defect class this guards against is a code that does not exist, which can never be
    // satisfied by any role and so refuses everyone silently.
    for (const [command, code] of Object.entries(LOAN_COMMAND_PERMISSIONS)) {
      expect(code, `${command} maps to a malformed code`).toMatch(/^[A-Z][A-Z0-9_]*_LOAN$/);
    }
  });

  it('never maps a command to UPDATE_LOAN', () => {
    // The whole point. UPDATE_LOAN is in Fineract's `portfolio` grouping and authorises none of
    // these commands; declaring it for all 29 is issue #691.
    expect(Object.values(LOAN_COMMAND_PERMISSIONS)).not.toContain('UPDATE_LOAN');
  });

  it('covers the three commands the loan view offers as buttons', () => {
    // Approve, Disburse and Repayment are the controls on the loan screen itself, so a gap here
    // is a dead-end control rather than an obscure menu item.
    expect(LOAN_COMMAND_PERMISSIONS['approve']).toBe('APPROVE_LOAN');
    expect(LOAN_COMMAND_PERMISSIONS['disburse']).toBe('DISBURSE_LOAN');
    expect(LOAN_COMMAND_PERMISSIONS['repayment']).toBe('REPAYMENT_LOAN');
  });

  it('treats a prepayment as a repayment, because the platform has no separate code', () => {
    expect(LOAN_COMMAND_PERMISSIONS['prepayLoan']).toBe('REPAYMENT_LOAN');
  });

  it('leaves the commands whose code could not be established unmapped', () => {
    for (const command of DELIBERATELY_UNMAPPED) {
      expect(LOAN_COMMAND_PERMISSIONS[command], `${command} should be unmapped`).toBeUndefined();
    }
  });
});

describe('SAVINGS_COMMAND_PERMISSIONS', () => {
  it('maps deposit and withdrawal to their transaction_savings codes', () => {
    expect(SAVINGS_COMMAND_PERMISSIONS).toEqual({
      deposit: 'DEPOSIT_SAVINGSACCOUNT',
      withdrawal: 'WITHDRAWAL_SAVINGSACCOUNT',
    });
  });

  it('never maps a command to UPDATE_SAVINGSACCOUNT', () => {
    expect(Object.values(SAVINGS_COMMAND_PERMISSIONS)).not.toContain('UPDATE_SAVINGSACCOUNT');
  });
});

describe('WC_LOAN_COMMAND_PERMISSIONS', () => {
  /**
   * Every action the Working Capital loan screen can reach through the action route, and the code
   * Fineract authorises it with. Spelled out rather than looped, because the pairing is the whole
   * content of the fix: a wrong entry here either locks out a user the platform would allow or
   * leads one into a 403, which is issue #777 reproduced one command at a time.
   */
  const EXPECTED: Readonly<Record<string, string>> = {
    approve: 'APPROVE_WORKINGCAPITALLOAN',
    undoapproval: 'APPROVALUNDO_WORKINGCAPITALLOAN',
    reject: 'REJECT_WORKINGCAPITALLOAN',
    disburse: 'DISBURSE_WORKINGCAPITALLOAN',
    undodisbursal: 'DISBURSALUNDO_WORKINGCAPITALLOAN',
    markasfraud: 'SETFRAUD_WORKINGCAPITALLOAN',
    discount: 'UPDATEDISCOUNT_WORKINGCAPITALLOAN',
    paymentrate: 'UPDATERATE_WORKINGCAPITALLOAN',
    repayment: 'REPAYMENT_WORKINGCAPITALLOAN',
    prepay: 'REPAYMENT_WORKINGCAPITALLOAN',
    goodwillCredit: 'GOODWILLCREDIT_WORKINGCAPITALLOAN',
    payoutRefund: 'PAYOUTREFUND_WORKINGCAPITALLOAN',
    creditBalanceRefund: 'CREDITBALANCEREFUND_WORKINGCAPITALLOAN',
    chargeOff: 'CHARGEOFF_WORKINGCAPITALLOAN',
    undoChargeOff: 'UNDOCHARGEOFF_WORKINGCAPITALLOAN',
    writeOff: 'WRITEOFF_WORKINGCAPITALLOAN',
    undoWriteOff: 'UNDOWRITEOFF_WORKINGCAPITALLOAN',
    recoveryPayment: 'RECOVERYPAYMENT_WORKINGCAPITALLOAN',
  };

  it('maps each command to the code Fineract authorises it with', () => {
    expect(WC_LOAN_COMMAND_PERMISSIONS).toEqual(EXPECTED);
  });

  it('never maps a command to UPDATE_WORKINGCAPITALLOAN', () => {
    // The defect: the route declared it for all of these, and it authorises none of them.
    expect(Object.values(WC_LOAN_COMMAND_PERMISSIONS)).not.toContain('UPDATE_WORKINGCAPITALLOAN');
  });

  it('maps every code to Fineract spelling for the module', () => {
    for (const [command, code] of Object.entries(WC_LOAN_COMMAND_PERMISSIONS)) {
      expect(code, `${command} maps to a malformed code`).toMatch(
        /^[A-Z][A-Z0-9]*_WORKINGCAPITALLOAN$/,
      );
    }
  });

  it('treats a prepayment as a repayment, as the term-loan map does', () => {
    // Fineract has no prepay command at all: the form posts `repayment` with the payoff amount.
    expect(WC_LOAN_COMMAND_PERMISSIONS['prepay']).toBe(WC_LOAN_COMMAND_PERMISSIONS['repayment']);
  });

  it('separates each undo from the action it reverses', () => {
    // Undo is the checker-ish half of each pair and is routinely granted to a different role, so
    // sharing a code with the forward action would hand it to whoever can perform that.
    expect(WC_LOAN_COMMAND_PERMISSIONS['undoChargeOff']).not.toBe(
      WC_LOAN_COMMAND_PERMISSIONS['chargeOff'],
    );
    expect(WC_LOAN_COMMAND_PERMISSIONS['undoWriteOff']).not.toBe(
      WC_LOAN_COMMAND_PERMISSIONS['writeOff'],
    );
    expect(WC_LOAN_COMMAND_PERMISSIONS['undoapproval']).not.toBe(
      WC_LOAN_COMMAND_PERMISSIONS['approve'],
    );
    expect(WC_LOAN_COMMAND_PERMISSIONS['undodisbursal']).not.toBe(
      WC_LOAN_COMMAND_PERMISSIONS['disburse'],
    );
  });

  it('resolves the code from the :command segment, not :type', () => {
    // The Working Capital route names the segment `:command`; the term-loan route names it
    // `:type`. Crossing them unmaps every command on one of the two.
    expect(wcLoanCommandPermission(params({ command: 'chargeOff' }))).toBe(
      'CHARGEOFF_WORKINGCAPITALLOAN',
    );
    expect(wcLoanCommandPermission(params({ type: 'chargeOff' }))).toBeUndefined();
  });
});

describe('commandPermission', () => {
  it('reads the command out of the parameter it was given', () => {
    const resolve = commandPermission('kind', { pay: 'PAY_THING' });
    expect(resolve(params({ kind: 'pay' }))).toBe('PAY_THING');
  });

  it('answers undefined for a command it does not know', () => {
    // Which the guard treats as "no client-side gate". A guessed code would refuse a user the
    // platform allows — the more damaging half of #691, and the harder half to notice.
    const resolve = commandPermission('kind', { pay: 'PAY_THING' });
    expect(resolve(params({ kind: 'somethingElse' }))).toBeUndefined();
  });

  it('answers undefined when the parameter is missing', () => {
    const resolve = commandPermission('kind', { pay: 'PAY_THING' });
    expect(resolve(params({}))).toBeUndefined();
  });

  it('reads the loan parameter as :type and the savings one as :command', () => {
    // The two routes name the segment differently, and crossing them would silently unmap
    // every command on one of them.
    expect(loanCommandPermission(params({ type: 'disburse' }))).toBe('DISBURSE_LOAN');
    expect(loanCommandPermission(params({ command: 'disburse' }))).toBeUndefined();
    expect(savingsCommandPermission(params({ command: 'deposit' }))).toBe('DEPOSIT_SAVINGSACCOUNT');
    expect(savingsCommandPermission(params({ type: 'deposit' }))).toBeUndefined();
  });
});
