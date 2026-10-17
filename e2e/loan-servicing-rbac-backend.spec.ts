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
 * The loan servicing and charge command-to-permission map, against a running Fineract.
 *
 * `command-permissions.ts` claims a specific code authorises each command added by issues #754,
 * #778 and #779. The unit tests pin what the maps contain and the component tests pin that the
 * screens gate on them, but neither can say whether the claim is *true of the platform* — and
 * being wrong is costly in both directions. A wrong code locks out a user Fineract would have
 * allowed; the code a route or button used to declare instead lets a user into a control whose
 * every request answers 403. That is #691 and #777, and only a real backend settles it.
 *
 * ## Method
 *
 * Seed a role holding **exactly one** permission, create a user with it, and send the command
 * with an empty body. Fineract authorises before it validates or looks the resource up, so the
 * status separates the two questions without writing anything:
 *
 * ```
 * 403 error.msg.not.authorized → the code does not authorise this command
 * anything else                → it does, and only the body or the resource was wrong
 * ```
 *
 * The globalisation code rather than the bare status, because the platform also answers 403 for
 * a domain-rule violation and a status alone cannot tell "you may not" from "not like that".
 *
 * Neither the loan, the transaction, the charge nor the client needs to exist, which is what
 * keeps this spec to API calls and seconds rather than seeding a disbursed loan per command.
 *
 * ## Why the pairs are restated here
 *
 * `tsconfig.e2e.json` covers `e2e/**` only, so the production maps are not importable — but the
 * duplication is the point rather than a limitation: what this spec states is the *platform's*
 * side of the agreement, which is worth writing down independently of the map that is meant to
 * match it. If the two disagree, one of them is wrong and this is the one with evidence.
 */

import { test, expect } from './fixtures';
import { API_BASE, createApiContext, notAuthorisedAs, seedRestrictedUser } from './utils/seed-api';

// A role and a user per pair, each probed. API only — no browser, no stack beyond Fineract.
test.describe.configure({ mode: 'serial', timeout: 240_000 });

/**
 * Any loan, transaction, charge and client id. Authorisation happens before the lookup, so an
 * absent resource answers 404 once the caller is authorised — which is the signal this reads.
 */
const LOAN_ID = 1;
const TRANSACTION_ID = 1;
const CHARGE_ID = 1;
const CLIENT_ID = 1;
const SAVINGS_ID = 1;

interface Probe {
  /** What the UI calls this, for the failure message. */
  readonly command: string;
  /** The code the production map claims authorises it. */
  readonly code: string;
  readonly method: 'POST' | 'PUT';
  /** The endpoint the UI actually sends to. */
  readonly path: string;
}

const TRANSACTION = (command: string) => `/loans/${LOAN_ID}/transactions?command=${command}`;
const ON_TRANSACTION = (command: string) =>
  `/loans/${LOAN_ID}/transactions/${TRANSACTION_ID}?command=${command}`;

const PROBES: readonly Probe[] = [
  // #778. `reAge` and `reAmortize` are included although they were already offered: the first
  // probe could not settle `reAmortize`, and `command-permissions.ts` now claims it can.
  { command: 'reAge', code: 'REAGE_LOAN', method: 'POST', path: TRANSACTION('reAge') },
  {
    command: 'reAmortize',
    code: 'REAMORTIZE_LOAN',
    method: 'POST',
    path: TRANSACTION('reAmortize'),
  },
  {
    command: 'undoReAge',
    code: 'UNDO_REAGE_LOAN',
    method: 'POST',
    path: TRANSACTION('undoReAge'),
  },
  {
    command: 'undoReAmortize',
    code: 'UNDO_REAMORTIZE_LOAN',
    method: 'POST',
    path: TRANSACTION('undoReAmortize'),
  },

  // #779. The postings are commands on the loan; the adjustments are commands on one
  // transaction, which is not where the issue expected them — see the next test.
  {
    command: 'buyDownFee',
    code: 'BUYDOWNFEE_LOAN',
    method: 'POST',
    path: TRANSACTION('buyDownFee'),
  },
  {
    command: 'capitalizedIncome',
    code: 'CAPITALIZEDINCOME_LOAN',
    method: 'POST',
    path: TRANSACTION('capitalizedIncome'),
  },
  {
    command: 'buyDownFeeAdjustment',
    code: 'BUYDOWNFEEADJUSTMENT_LOAN',
    method: 'POST',
    path: ON_TRANSACTION('buyDownFeeAdjustment'),
  },
  {
    command: 'capitalizedIncomeAdjustment',
    code: 'CAPITALIZEDINCOMEADJUSTMENT_LOAN',
    method: 'POST',
    path: ON_TRANSACTION('capitalizedIncomeAdjustment'),
  },
  {
    command: 'adjust (generic)',
    code: 'ADJUST_LOAN',
    method: 'POST',
    path: `/loans/${LOAN_ID}/transactions/${TRANSACTION_ID}`,
  },

  // #754. Charge servicing, across the three entities whose charges the UI now services.
  {
    command: 'loan charge pay',
    code: 'PAY_LOANCHARGE',
    method: 'POST',
    path: `/loans/${LOAN_ID}/charges/${CHARGE_ID}?command=pay`,
  },
  {
    command: 'loan charge waive',
    code: 'WAIVE_LOANCHARGE',
    method: 'POST',
    path: `/loans/${LOAN_ID}/charges/${CHARGE_ID}?command=waive`,
  },
  {
    command: 'loan charge adjustment',
    code: 'ADJUSTMENT_LOANCHARGE',
    method: 'POST',
    path: `/loans/${LOAN_ID}/charges/${CHARGE_ID}?command=adjustment`,
  },
  {
    command: 'undo waive charge',
    code: 'UNDO_WAIVECHARGE',
    method: 'PUT',
    path: `/loans/${LOAN_ID}/transactions/${TRANSACTION_ID}`,
  },
  {
    command: 'savings charge paycharge',
    code: 'PAY_SAVINGSACCOUNTCHARGE',
    method: 'POST',
    path: `/savingsaccounts/${SAVINGS_ID}/charges/${CHARGE_ID}?command=paycharge`,
  },
  {
    command: 'savings charge waive',
    code: 'WAIVE_SAVINGSACCOUNTCHARGE',
    method: 'POST',
    path: `/savingsaccounts/${SAVINGS_ID}/charges/${CHARGE_ID}?command=waive`,
  },
  {
    command: 'savings charge inactivate',
    code: 'INACTIVATE_SAVINGSACCOUNTCHARGE',
    method: 'POST',
    path: `/savingsaccounts/${SAVINGS_ID}/charges/${CHARGE_ID}?command=inactivate`,
  },
  {
    command: 'client charge paycharge',
    code: 'PAY_CLIENTCHARGE',
    method: 'POST',
    path: `/clients/${CLIENT_ID}/charges/${CHARGE_ID}?command=paycharge`,
  },
  {
    command: 'client charge waive',
    code: 'WAIVE_CLIENTCHARGE',
    method: 'POST',
    path: `/clients/${CLIENT_ID}/charges/${CHARGE_ID}?command=waive`,
  },
];

/**
 * The portfolio write code for each entity, against that entity's own commands.
 *
 * This is the half of #691 and #777 that admits a user the platform refuses, and it is the
 * reason none of these maps falls back to a plausible-looking code.
 */
const PORTFOLIO_CODES: readonly { readonly code: string; readonly reads: string }[] = [
  { code: 'UPDATE_LOAN', reads: 'READ_LOAN' },
  { code: 'UPDATE_SAVINGSACCOUNT', reads: 'READ_SAVINGSACCOUNT' },
  { code: 'UPDATE_CLIENT', reads: 'READ_CLIENT' },
];

test.describe('loan servicing and charge command permissions, on the platform', () => {
  test('each command is authorised by the code the UI declares for it', async () => {
    const api = await createApiContext();
    try {
      for (const { command, code, method, path } of PROBES) {
        // Exactly one permission, not even READ: the claim under test is that this code alone
        // authorises this command, and a second code in the role would blur it.
        const user = await seedRestrictedUser(api, [code]);
        const refused = await notAuthorisedAs(user, method, path);
        // Soft, so one wrong entry reports itself alongside every other rather than hiding them.
        expect
          .soft(refused, `${code} did not authorise ${command} (${method} ${path})`)
          .toBe(false);
      }
    } finally {
      await api.dispose();
    }
  });

  test('no portfolio write code authorises any of its entity commands', async () => {
    const api = await createApiContext();
    try {
      for (const { code, reads } of PORTFOLIO_CODES) {
        const user = await seedRestrictedUser(api, [reads, code]);
        for (const { command, method, path } of PROBES) {
          const refused = await notAuthorisedAs(user, method, path);
          expect.soft(refused, `${code} unexpectedly authorised ${command}`).toBe(true);
        }
      }
    } finally {
      await api.dispose();
    }
  });

  /**
   * The two deferred-income adjustments, at the URL issue #779 proposed for them.
   *
   * The issue expected `POST /loans/{id}/transactions?command=buyDownFeeAdjustment`. The
   * platform does not recognise either adjustment there, and says so with the #268
   * discriminator — `error.msg.query.parameter.value.unsupported` on the `command` parameter,
   * the same answer it gives for a command that does not exist at all. This is pinned because
   * it is the finding that moved the adjustment onto the transaction detail dialog: if a later
   * Fineract starts accepting them at loan level, this test is where that shows up.
   */
  test('the deferred-income adjustments are not commands at loan level', async () => {
    const api = await createApiContext();
    try {
      for (const command of ['buyDownFeeAdjustment', 'capitalizedIncomeAdjustment']) {
        const response = await api.post(`${API_BASE}${TRANSACTION(command)}`, { data: {} });
        const body = (await response.json()) as {
          errors?: { userMessageGlobalisationCode?: string; parameterName?: string }[];
        };

        // As admin, so authorisation cannot be what answers. An unrecognised command is a 400
        // naming the `command` parameter, which is exactly what a nonexistent command gets.
        expect.soft(response.status(), `${command} at loan level`).toBe(400);
        expect
          .soft(body.errors?.[0]?.userMessageGlobalisationCode, command)
          .toBe('error.msg.query.parameter.value.unsupported');
        expect.soft(body.errors?.[0]?.parameterName, command).toBe('command');
      }
    } finally {
      await api.dispose();
    }
  });

  /**
   * And they *are* commands on one transaction, which is where the UI sends them.
   *
   * The pairing is already covered above; this asserts the complement — that naming the command
   * gets past the command parser, so the 404 that follows is the absent loan and nothing else.
   */
  test('the deferred-income adjustments are commands on one transaction', async () => {
    const api = await createApiContext();
    try {
      for (const command of ['buyDownFeeAdjustment', 'capitalizedIncomeAdjustment']) {
        const response = await api.post(`${API_BASE}${ON_TRANSACTION(command)}`, { data: {} });
        const body = (await response.json()) as {
          errors?: { userMessageGlobalisationCode?: string; parameterName?: string }[];
        };

        const first = body.errors?.[0];

        // Stated as "the command parser accepted it" rather than as one status. What loan 1 is,
        // and whether it exists at all, depends on what else has run against this tenant —
        // issue #664 — so the assertion is about the one thing that cannot vary: an
        // unrecognised command is refused on the `command` parameter, and these are not. On a
        // seeded tenant the answer is a business rule about the loan, which is past the parser:
        // `validation.msg.loan.buyDownFeeAdjustment.not.progressive.loan`.
        expect
          .soft(
            first?.userMessageGlobalisationCode === 'error.msg.query.parameter.value.unsupported' &&
              first?.parameterName === 'command',
            `${command} should be recognised on the per-transaction URL`,
          )
          .toBe(false);
      }
    } finally {
      await api.dispose();
    }
  });
});
