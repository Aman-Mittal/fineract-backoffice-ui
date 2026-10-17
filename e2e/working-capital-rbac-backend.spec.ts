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

/**
 * The Working Capital command-to-permission map, against a running Fineract.
 *
 * `command-permissions.ts` claims a specific code authorises each Working Capital command. The
 * unit test pins what the map contains and the mocked spec pins that the screen gates on it, but
 * neither can say whether the claim is *true of the platform* — and being wrong is costly in both
 * directions: a wrong code locks out a user Fineract would have allowed, while the code the route
 * used to declare let a user into a screen whose every request answers 403. That is issue #777,
 * and only a real backend can settle it.
 *
 * ## Method
 *
 * The same probe that established the term-loan map in #691: seed a role holding **exactly one**
 * permission, create a user with it, and send the command with an empty body. Fineract authorises
 * before it validates or looks the resource up, so the status separates the two questions without
 * writing anything:
 *
 * ```
 * 403            → the code does not authorise this command
 * anything else  → it does, and only the body or the loan id was wrong (404 here: loan 1 is absent)
 * ```
 *
 * The loan therefore does not need to exist, which is what keeps this spec to API calls and
 * seconds rather than seeding a Working Capital product and a disbursed loan per command.
 *
 * ## Why the pairs are restated here
 *
 * `tsconfig.e2e.json` covers `e2e/**` only, so the production map is not importable — but the
 * duplication is the point rather than a limitation: what this spec states is the *platform's*
 * side of the agreement, which is worth writing down independently of the map that is meant to
 * match it. If the two ever disagree, one of them is wrong and this is the one with evidence.
 */

import { test, expect } from './fixtures';
import { createApiContext, seedRestrictedUser, statusAs } from './utils/seed-api';

// Eighteen roles and users, each probed. API only — no browser, no stack beyond Fineract itself.
test.describe.configure({ mode: 'serial', timeout: 240_000 });

/** Fineract's answer when the permission does not authorise the command. */
const REFUSED = 403;

/**
 * Any loan id. Authorisation happens before the lookup, so an absent loan answers 404 once the
 * caller is authorised — which is exactly the signal this spec reads.
 */
const LOAN_ID = 1;

interface WcCommand {
  /** The `:command` segment the UI routes through, for the failure message. */
  readonly command: string;
  /** The code `WC_LOAN_COMMAND_PERMISSIONS` claims authorises it. */
  readonly code: string;
  readonly method: 'POST' | 'PUT';
  /** The endpoint the UI actually posts to. */
  readonly path: string;
}

const LIFECYCLE = (command: string) => `/working-capital-loans/${LOAN_ID}?command=${command}`;
const TRANSACTION = (command: string) =>
  `/working-capital-loans/${LOAN_ID}/transactions?command=${command}`;

const COMMANDS: readonly WcCommand[] = [
  {
    command: 'approve',
    code: 'APPROVE_WORKINGCAPITALLOAN',
    method: 'POST',
    path: LIFECYCLE('approve'),
  },
  {
    command: 'undoapproval',
    code: 'APPROVALUNDO_WORKINGCAPITALLOAN',
    method: 'POST',
    path: LIFECYCLE('undoapproval'),
  },
  {
    command: 'reject',
    code: 'REJECT_WORKINGCAPITALLOAN',
    method: 'POST',
    path: LIFECYCLE('reject'),
  },
  {
    command: 'disburse',
    code: 'DISBURSE_WORKINGCAPITALLOAN',
    method: 'POST',
    path: LIFECYCLE('disburse'),
  },
  {
    command: 'undodisbursal',
    code: 'DISBURSALUNDO_WORKINGCAPITALLOAN',
    method: 'POST',
    path: LIFECYCLE('undodisbursal'),
  },

  // The three PUT sub-resources the action form also serves.
  {
    command: 'markasfraud',
    code: 'SETFRAUD_WORKINGCAPITALLOAN',
    method: 'PUT',
    path: `/working-capital-loans/${LOAN_ID}/mark-as-fraud`,
  },
  {
    command: 'discount',
    code: 'UPDATEDISCOUNT_WORKINGCAPITALLOAN',
    method: 'PUT',
    path: `/working-capital-loans/${LOAN_ID}/discount`,
  },
  {
    command: 'paymentrate',
    code: 'UPDATERATE_WORKINGCAPITALLOAN',
    method: 'PUT',
    path: `/working-capital-loans/${LOAN_ID}/payment-rate`,
  },

  // Transactions. `prepay` is absent on purpose: it posts `repayment`, which is the row above it,
  // and Fineract has no prepay command at all — `command=prepayLoan` answers
  // `error.msg.query.parameter.value.unsupported`, which is why the UI maps it this way.
  {
    command: 'repayment',
    code: 'REPAYMENT_WORKINGCAPITALLOAN',
    method: 'POST',
    path: TRANSACTION('repayment'),
  },
  {
    command: 'goodwillCredit',
    code: 'GOODWILLCREDIT_WORKINGCAPITALLOAN',
    method: 'POST',
    path: TRANSACTION('goodwillCredit'),
  },
  {
    command: 'payoutRefund',
    code: 'PAYOUTREFUND_WORKINGCAPITALLOAN',
    method: 'POST',
    path: TRANSACTION('payoutRefund'),
  },
  {
    command: 'creditBalanceRefund',
    code: 'CREDITBALANCEREFUND_WORKINGCAPITALLOAN',
    method: 'POST',
    path: TRANSACTION('creditBalanceRefund'),
  },
  {
    command: 'chargeOff',
    code: 'CHARGEOFF_WORKINGCAPITALLOAN',
    method: 'POST',
    path: TRANSACTION('chargeOff'),
  },
  {
    command: 'undoChargeOff',
    code: 'UNDOCHARGEOFF_WORKINGCAPITALLOAN',
    method: 'POST',
    path: TRANSACTION('undoChargeOff'),
  },
  {
    command: 'writeOff',
    code: 'WRITEOFF_WORKINGCAPITALLOAN',
    method: 'POST',
    path: TRANSACTION('writeOff'),
  },
  {
    command: 'undoWriteOff',
    code: 'UNDOWRITEOFF_WORKINGCAPITALLOAN',
    method: 'POST',
    path: TRANSACTION('undoWriteOff'),
  },
  {
    command: 'recoveryPayment',
    code: 'RECOVERYPAYMENT_WORKINGCAPITALLOAN',
    method: 'POST',
    path: TRANSACTION('recoveryPayment'),
  },
];

test.describe('Working Capital command permissions, on the platform', () => {
  test('each command is authorised by the code the UI declares for it', async () => {
    const api = await createApiContext();
    try {
      for (const { command, code, method, path } of COMMANDS) {
        // Exactly one permission, not even READ: the claim under test is that this code alone
        // authorises this command, and a second code in the role would blur it.
        const user = await seedRestrictedUser(api, [code]);
        const status = await statusAs(user, method, path);
        // Soft, so one wrong entry reports itself alongside every other rather than hiding them.
        expect
          .soft(status, `${code} did not authorise ${command} (${method} ${path})`)
          .not.toBe(REFUSED);
      }
    } finally {
      await api.dispose();
    }
  });

  test('UPDATE_WORKINGCAPITALLOAN authorises none of them', async () => {
    // The defect this map replaced: every action route declared this one code, and the platform
    // accepts it for no Working Capital command. Both halves of #777 follow from that.
    const api = await createApiContext();
    try {
      const editor = await seedRestrictedUser(api, [
        'READ_WORKINGCAPITALLOAN',
        'UPDATE_WORKINGCAPITALLOAN',
      ]);
      for (const { command, method, path } of COMMANDS) {
        const status = await statusAs(editor, method, path);
        expect
          .soft(status, `UPDATE_WORKINGCAPITALLOAN unexpectedly authorised ${command}`)
          .toBe(REFUSED);
      }
    } finally {
      await api.dispose();
    }
  });
});
