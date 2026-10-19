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

import { Pipe, PipeTransform } from '@angular/core';

/**
 * An ISO `YYYY-MM-DD` date as the browser's locale writes it, or `'—'`.
 *
 * For the dates the adapters model, which are date-only. Two things make this worth a pipe
 * rather than another `toLocaleDateString()` in another component:
 *
 * - `new Date('2026-10-18')` is **UTC** midnight by specification, while the getters that print
 *   it read local time, so west of Greenwich a date-only string renders as the day before. The
 *   parts are read out and handed to the local-time constructor instead.
 * - every screen that needed this wrote its own `formatDate(date: unknown)`, and a template
 *   cannot call one it does not have — which is why two transaction lists simply interpolated
 *   the value and printed Fineract's `[year, month, day]` as "2026,10,18".
 *
 * A value that is not a date-only string is passed to `Date` unchanged, so an instant or an
 * `ion-datetime` value still formats rather than disappearing.
 */
@Pipe({
  name: 'appIsoDate',
  standalone: true,
})
export class IsoDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '—';

    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    const date = parts ? new Date(+parts[1], +parts[2] - 1, +parts[3]) : new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
  }
}
