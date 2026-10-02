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

import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';

import { OfficesService } from '../../../api';
import type { GetOfficesResponse } from '../../../api';
import type { Office, OfficeApi } from './office.api';

/**
 * What `GET /offices` actually sends, where that differs from the generated type.
 *
 * Writing the disagreement down as a type is the point: `openingDate` has to be widened through
 * `Omit`, because declaring `string | number[]` on a subtype of a `string` field is not a legal
 * override — which is TypeScript stating, correctly, that the generated type and the payload
 * are not compatible. See issue #653 for the captured payloads.
 */
type OfficePayload = Omit<GetOfficesResponse, 'openingDate'> & {
  /** Declared `string` upstream; sent as `[year, month, day]`. */
  readonly openingDate?: string | number[];
  /** Sent by Fineract, absent from the generated model. */
  readonly parentId?: number;
  readonly parentName?: string;
};

/**
 * Converts a Fineract date to ISO-8601 `YYYY-MM-DD`.
 *
 * Accepts the array form Fineract sends and the string form the spec claims, so a corrected
 * spec upstream would need no change here.
 *
 * Named to distinguish it from `toIsoDate()` in `core/utils/date-formatter.ts`, which converts
 * a `Date` or an `ion-datetime` string on the way *out* to Fineract. This converts what comes
 * *in*.
 *
 * Deliberately not `formatArrayDate()` from the same file: that returns `'-'`
 * for anything it cannot read, which is the right answer for a table cell and the wrong one for
 * a model. A placeholder stored as data cannot be formatted, compared or sorted, and it hides
 * the difference between "no opening date" and "an opening date we failed to read". This
 * returns `null` and lets the view decide how to show that.
 */
export function toIsoFineractDate(value: string | number[] | undefined): string | null {
  if (value === undefined || value === null) return null;

  if (Array.isArray(value)) {
    // Fineract's month is 1-based here, unlike `Date`'s. No arithmetic, so no conversion.
    const [year, month, day] = value;
    if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
      return null;
    }
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // Already a date-shaped string; keep the date part, drop any time.
  return value === '' ? null : (value.split('T', 1)[0] ?? null);
}

/**
 * Maps one office payload onto the application model.
 *
 * Exported for its own test. This is where an upstream shape change is meant to surface.
 */
export function mapOffice(payload: OfficePayload): Office {
  return {
    // Fineract always sends both; an office with no id cannot be navigated to, and defaulting
    // it would route somewhere wrong, so it fails loudly instead of plausibly.
    id: required(payload.id, 'id'),
    name: payload.name ?? '',
    // Falls back to the plain name rather than an empty string: this is what a tree view
    // renders, and an empty cell is worse than an unindented one.
    nameDecorated: payload.nameDecorated ?? payload.name ?? '',
    externalId: payload.externalId ?? null,
    hierarchy: payload.hierarchy ?? '',
    parentId: payload.parentId ?? null,
    parentName: payload.parentName ?? null,
    openingDate: toIsoFineractDate(payload.openingDate),
  };
}

function required<T>(value: T | undefined, field: string): T {
  if (value === undefined || value === null) {
    throw new Error(`Fineract returned an office with no ${field}`);
  }
  return value;
}

/**
 * {@link OfficeApi} over the generated OpenAPI client.
 *
 * One of the few places allowed to import `src/app/api` — see ADR 0006 and the `files` override
 * in `eslint.config.js`.
 */
@Injectable({ providedIn: 'root' })
export class FineractOfficeApi implements OfficeApi {
  private readonly offices = inject(OfficesService);

  list(includeAllOffices?: boolean): Observable<Office[]> {
    return this.offices.getOffices(includeAllOffices).pipe(
      // `|| []` rather than `?? []`: this endpoint has been seen to return an empty body, which
      // arrives as `null` through HttpClient, and the previous call sites all guarded for it.
      map((payloads) => (payloads || []).map((payload) => mapOffice(payload as OfficePayload))),
    );
  }
}
