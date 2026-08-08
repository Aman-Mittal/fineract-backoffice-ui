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
 * Client fields the platform returns but the generated client does not describe.
 *
 * `GetClientsClientIdResponse` declares sixteen fields; `GET /clients/{id}` returns the assigned
 * member of staff and the default savings account alongside them, and neither appears in the
 * generated model. The same gap exists on the way out: `PostClientsClientIdRequest` covers only
 * the activate/reject/withdraw/close family, so every transfer and staff command body has to be
 * cast on its way to `postClientsClientId`.
 *
 * The spec is regenerated from upstream on a schedule (ADR-0002) and is not edited here, so the
 * shapes the platform actually sends are declared in this file rather than patched into
 * `src/app/api`. Verified against a running instance rather than read off the spec.
 */

/** The client fields this feature reads that `GetClientsClientIdResponse` omits. */
export interface ClientServicingFields {
  /** Assigned field officer. Absent — not null — when nobody is assigned. */
  staffId?: number;
  staffName?: string;
  /** The account the platform uses when a client-level operation needs a savings destination. */
  savingsAccountId?: number;
}

/**
 * Client status ids, as `status.id` on the client response.
 *
 * Spelled out because the transfer commands are gated on the two the UI has never shown before,
 * and `303`/`304` in a template condition says nothing about which is which.
 */
export const CLIENT_STATUS = {
  PENDING: 100,
  ACTIVE: 300,
  TRANSFER_IN_PROGRESS: 303,
  TRANSFER_ON_HOLD: 304,
  WITHDRAWN: 400,
  REJECTED: 500,
  CLOSED: 600,
} as const;
