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
 * What `GET /groups/{id}?associations=all` actually returns.
 *
 * The generated `GetGroupsGroupIdResponse` describes seven fields — id, name, externalId,
 * officeId, officeName, hierarchy and timeline. The endpoint returns those plus `status`,
 * `active`, `activationDate`, `staffId`, `staffName`, `groupLevel`, `clientMembers`,
 * `activeClientMembers` and `groupRoles`, none of which appear in the upstream OpenAPI
 * document. Every one of those is something this screen shows or gates an action on.
 *
 * Declaring the shape here rather than reaching through the generated type with
 * `as unknown as { … }` at each read keeps the guesswork in one reviewable place, and makes
 * the weekly spec sync (ADR-0002) a visible event: if upstream ever documents these fields,
 * this file is what gets deleted, and the compiler names every call site.
 */

/** Fineract renders dates as `[year, month, day]`, with month 1-based. */
export type FineractDate = number[];

export interface GroupStatus {
  id?: number;
  code?: string;
  value?: string;
}

export interface GroupClientMember {
  id?: number;
  accountNo?: string;
  displayName?: string;
  status?: GroupStatus;
  active?: boolean;
  officeName?: string;
  activationDate?: FineractDate;
}

export interface GroupRoleAssignment {
  /** The assignment's own id — this, not `role.id`, is what `unassignRole` takes. */
  id?: number;
  role?: { id?: number; name?: string };
  clientId?: number;
  clientName?: string;
}

export interface GroupTimeline {
  submittedOnDate?: FineractDate;
  submittedByUsername?: string;
  activatedOnDate?: FineractDate;
  closedOnDate?: FineractDate;
}

export interface GroupDetail {
  id?: number;
  accountNo?: string;
  name?: string;
  externalId?: string;
  status?: GroupStatus;
  active?: boolean;
  activationDate?: FineractDate;
  officeId?: number;
  officeName?: string;
  staffId?: number;
  staffName?: string;
  hierarchy?: string;
  groupLevel?: string;
  clientMembers?: GroupClientMember[];
  activeClientMembers?: GroupClientMember[];
  groupRoles?: GroupRoleAssignment[];
  timeline?: GroupTimeline;
}

/** A role the institution has defined, offered by `GET /groups/template`. */
export interface GroupRoleOption {
  id?: number;
  name?: string;
  position?: number;
  active?: boolean;
}

/**
 * Group status ids, which Fineract shares with clients — the codes come back as
 * `clientStatusType.pending` even for a group.
 *
 * Actions are gated on the id rather than on `value`, because `value` is the platform's
 * English label and changes with the server's locale.
 */
export const GROUP_STATUS = {
  PENDING: 100,
  ACTIVE: 300,
  CLOSED: 600,
} as const;
