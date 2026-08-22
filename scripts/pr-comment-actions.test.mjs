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
 * The two `pull_request_target` comment actions.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * Both hold a token that can write to this repository while reacting to a fork's pull
 * request, so the properties worth pinning are the ones that keep that safe and quiet:
 * exactly one comment per pull request however many times it is pushed, the comment removed
 * again once the problem is fixed, and no attacker-controlled text turned into a live
 * `@mention`. Neither can be exercised on the pull request that introduces it — a
 * `pull_request_target` workflow only runs from the base branch — so these tests are the
 * only pre-merge check that the logic is right.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import checkSignatures from '../.github/scripts/check-commit-signatures.js';
import welcome from '../.github/scripts/welcome-contributor.js';

const { buildBody, groupByReason, defuseReferences, MARKER } = checkSignatures;

/** A commit as `pulls.listCommits` returns it. */
function commit(sha, { verified = false, reason = 'no_user', message = 'chore: a change' } = {}) {
  return { sha, commit: { message, verification: { verified, reason } } };
}

/**
 * Records what the script asked the API to do, so a test can assert on the calls rather than
 * on a rendered string.
 */
function fakeGithub({ comments = [], commits = [] } = {}) {
  const calls = { created: [], updated: [], deleted: [] };
  const github = {
    paginate: async (fn) => fn(),
    rest: {
      issues: {
        listComments: async () => comments,
        createComment: async (args) => calls.created.push(args),
        updateComment: async (args) => calls.updated.push(args),
        deleteComment: async (args) => calls.deleted.push(args),
      },
      pulls: { listCommits: async () => commits },
    },
  };
  return { github, calls };
}

function fakeCore() {
  const state = { failed: null, errors: [] };
  return {
    state,
    core: {
      info: () => {},
      error: (message) => state.errors.push(message),
      setFailed: (message) => {
        state.failed = message;
      },
    },
  };
}

const context = { repo: { owner: 'apache', repo: 'fineract-backoffice-ui' } };
const pullEvent = (pull) => ({ ...context, payload: { pull_request: pull } });

/* ---------------------------------------------------------------- signatures */

test('a fully verified pull request fails nothing and posts no comment', async () => {
  const { github, calls } = fakeGithub({
    commits: [commit('aaaaaaaa', { verified: true, reason: 'valid' })],
  });
  const { core, state } = fakeCore();

  await checkSignatures({ github, context: pullEvent({ number: 7 }), core });

  assert.equal(state.failed, null);
  assert.equal(calls.created.length, 0);
});

test('an unverified commit fails the check and comments once', async () => {
  const { github, calls } = fakeGithub({ commits: [commit('deadbeef')] });
  const { core, state } = fakeCore();

  await checkSignatures({ github, context: pullEvent({ number: 7 }), core });

  assert.match(state.failed, /1 of 1 commit/);
  assert.equal(calls.created.length, 1);
  assert.ok(calls.created[0].body.includes(MARKER));
  assert.ok(calls.created[0].body.includes('deadbee'));
});

test('a re-run updates the existing comment instead of adding a second', async () => {
  const existing = { id: 99, user: { type: 'Bot' }, body: `${MARKER}\nstale` };
  const { github, calls } = fakeGithub({ comments: [existing], commits: [commit('deadbeef')] });
  const { core } = fakeCore();

  await checkSignatures({ github, context: pullEvent({ number: 7 }), core });

  assert.equal(calls.created.length, 0);
  assert.equal(calls.updated.length, 1);
  assert.equal(calls.updated[0].comment_id, 99);
});

test('fixing the signatures removes the comment the failure left behind', async () => {
  const existing = { id: 99, user: { type: 'Bot' }, body: `${MARKER}\nold failure` };
  const { github, calls } = fakeGithub({
    comments: [existing],
    commits: [commit('aaaaaaaa', { verified: true, reason: 'valid' })],
  });
  const { core, state } = fakeCore();

  await checkSignatures({ github, context: pullEvent({ number: 7 }), core });

  assert.equal(state.failed, null);
  assert.equal(calls.deleted.length, 1);
  assert.equal(calls.deleted[0].comment_id, 99);
});

test('a human comment quoting the marker is never overwritten', async () => {
  const human = { id: 5, user: { type: 'User' }, body: `I saw ${MARKER} in the logs` };
  const { github, calls } = fakeGithub({ comments: [human], commits: [commit('deadbeef')] });
  const { core } = fakeCore();

  await checkSignatures({ github, context: pullEvent({ number: 7 }), core });

  assert.equal(calls.updated.length, 0);
  assert.equal(calls.created.length, 1);
});

test('each reason is explained once, with its own remedy', () => {
  const groups = groupByReason([
    commit('a1', { reason: 'no_user' }),
    commit('a2', { reason: 'no_user' }),
    commit('b1', { reason: 'unsigned' }),
  ]);
  assert.deepEqual([...groups.keys()], ['no_user', 'unsigned']);
  assert.equal(groups.get('no_user').length, 2);
});

test('no_user is explained as an identity problem, not a signing one', () => {
  const body = buildBody({ unverified: [commit('a1', { reason: 'no_user' })], total: 1 });
  assert.match(body, /user\.email/);
  assert.match(body, /not a signing one/);
});

test('an unrecognised reason still produces a usable comment', () => {
  const body = buildBody({ unverified: [commit('a1', { reason: 'something_new' })], total: 1 });
  assert.match(body, /something_new/);
  assert.match(body, /CONTRIBUTING/);
});

test('a commit subject cannot mention anyone from the comment', () => {
  const body = buildBody({
    unverified: [commit('a1', { reason: 'unsigned', message: 'fix @maintainer per #1234' })],
    total: 1,
  });
  assert.ok(!/@maintainer/.test(body), 'mention should be defused');
  assert.ok(!/#1234/.test(body), 'issue reference should be defused');
});

test('an overlong commit subject is truncated', () => {
  const body = buildBody({
    unverified: [commit('a1', { reason: 'unsigned', message: 'x'.repeat(200) })],
    total: 1,
  });
  assert.ok(body.includes('…'));
  assert.ok(!body.includes('x'.repeat(100)));
});

test('defuseReferences keeps the text readable', () => {
  assert.equal(defuseReferences('@user').normalize('NFKD').replace(/​/g, ''), '@user');
});

/**
 * Regression: the body was assembled with `.filter(Boolean)`, which silently dropped every
 * intentional `''` separator along with the optional truncation notice. The Markdown still
 * "worked" as a string and every assertion above still passed — it just rendered with the
 * headings welded to the paragraph above them. Only reading the posted output showed it.
 */
test('every heading is preceded by a blank line', () => {
  const body = buildBody({
    unverified: [commit('a1', { reason: 'no_user' }), commit('b1', { reason: 'unsigned' })],
    total: 2,
  });
  const lines = body.split('\n');
  let inFence = false;
  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      inFence = !inFence;
      return;
    }
    // `#` inside a fence is a shell comment, not a heading.
    if (inFence || i === 0 || !line.startsWith('#')) return;
    assert.equal(lines[i - 1], '', `heading "${line}" must have a blank line before it`);
  });
});

/* ------------------------------------------------------------------ welcome */

test('a first-time contributor is greeted', async () => {
  const { github, calls } = fakeGithub();
  const { core } = fakeCore();

  await welcome({
    github,
    context: pullEvent({
      number: 3,
      author_association: 'FIRST_TIME_CONTRIBUTOR',
      user: { login: 'newcomer', type: 'User' },
    }),
    core,
  });

  assert.equal(calls.created.length, 1);
  const body = calls.created[0].body;
  assert.ok(body.includes(welcome.MARKER));
  assert.match(body, /Code of Conduct/);
  assert.match(body, /dev@fineract\.apache\.org/);
  assert.match(body, /matrix\.to/);
  assert.match(body, /Verified/);
});

test('the greeting renders as Markdown, with every heading separated', () => {
  const lines = welcome.buildBody('newcomer').split('\n');
  let inFence = false;
  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      inFence = !inFence;
      return;
    }
    if (inFence || i === 0 || !line.startsWith('#')) return;
    assert.equal(lines[i - 1], '', `heading "${line}" must have a blank line before it`);
  });
});

test('every link in the greeting is an absolute URL', () => {
  const body = welcome.buildBody('newcomer');
  for (const [, url] of body.matchAll(/\]\(([^)]+)\)/g)) {
    assert.match(url, /^https:\/\//, `"${url}" must be absolute — the comment has no repo context`);
  }
});

test('a returning contributor is not greeted again', async () => {
  const { github, calls } = fakeGithub();
  const { core } = fakeCore();

  await welcome({
    github,
    context: pullEvent({
      number: 3,
      author_association: 'CONTRIBUTOR',
      user: { login: 'regular', type: 'User' },
    }),
    core,
  });

  assert.equal(calls.created.length, 0);
});

test('a bot is not greeted', async () => {
  const { github, calls } = fakeGithub();
  const { core } = fakeCore();

  await welcome({
    github,
    context: pullEvent({
      number: 3,
      author_association: 'FIRST_TIME_CONTRIBUTOR',
      user: { login: 'dependabot[bot]', type: 'Bot' },
    }),
    core,
  });

  assert.equal(calls.created.length, 0);
});

test('reopening a pull request does not stack up greetings', async () => {
  const existing = { id: 12, user: { type: 'Bot' }, body: `${welcome.MARKER}\nhello` };
  const { github, calls } = fakeGithub({ comments: [existing] });
  const { core } = fakeCore();

  await welcome({
    github,
    context: pullEvent({
      number: 3,
      author_association: 'FIRST_TIME_CONTRIBUTOR',
      user: { login: 'newcomer', type: 'User' },
    }),
    core,
  });

  assert.equal(calls.created.length, 0);
});
