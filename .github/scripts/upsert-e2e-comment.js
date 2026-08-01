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
 * Posts (or updates) one PR comment with the E2E summary for a single job.
 *
 * The suite runs as two independent jobs, so each keeps its own comment, keyed by
 * its own marker: neither has to wait for the other, and a re-run of one half does
 * not clobber the other half's result.
 *
 * Configured through the environment rather than arguments, so the workflow never
 * interpolates ${{ }} into a script body.
 */
const fs = require('node:fs');

module.exports = async ({ github, context }) => {
  const marker = process.env.REPORT_MARKER;
  const title = process.env.REPORT_TITLE;
  const artifact = process.env.REPORT_ARTIFACT;

  const summary = fs.readFileSync('/tmp/e2e-summary.md', 'utf8');
  const runUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
  const body = [
    marker,
    `### ${title}`,
    summary,
    '',
    `📼 [Download the HTML report, videos and traces](${runUrl}) — see the \`${artifact}\` artifact.`,
  ].join('\n');

  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request.number,
  });

  const existing = comments.find((comment) => comment.body.includes(marker));
  if (existing) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existing.id,
      body,
    });
  } else {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.pull_request.number,
      body,
    });
  }
};
