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

/** Fineract command/create response bodies share these id fields. */
const RESOURCE_ID_KEYS = [
  'resourceId',
  'clientId',
  'groupId',
  'loanId',
  'savingsId',
  'officeId',
  'subResourceId',
] as const;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;
}

/** Reads the new or affected resource id from a Fineract command response. */
export function extractMutationResourceId(response: unknown): number | undefined {
  const record = asRecord(response);
  if (!record) {
    return undefined;
  }

  for (const key of RESOURCE_ID_KEYS) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      return value;
    }
  }

  return undefined;
}

/**
 * True when maker-checker queued the command and no resource id was returned yet.
 * When an id is present the change applied immediately even if commandId is set.
 */
export function isMakerCheckerPending(response: unknown): boolean {
  const record = asRecord(response);
  if (!record) {
    return false;
  }

  const commandId = record['commandId'];
  if (typeof commandId !== 'number' || commandId <= 0) {
    return false;
  }

  return extractMutationResourceId(response) === undefined;
}
