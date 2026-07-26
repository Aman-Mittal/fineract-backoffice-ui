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

import { formatArrayDate, formatDateToFineract, toIsoDate } from './date-formatter';

const JAN_5_2026 = '2026-01-05';

describe('date-formatter', () => {
  describe('toIsoDate', () => {
    it('formats a Date as YYYY-MM-DD', () => {
      expect(toIsoDate(new Date(2026, 0, 5))).toBe(JAN_5_2026);
    });

    it('zero-pads single-digit months and days', () => {
      expect(toIsoDate(new Date(2026, 8, 9))).toBe('2026-09-09');
    });

    // toISOString() would convert to UTC and roll a late-evening local date back a day.
    it('uses local time rather than UTC', () => {
      expect(toIsoDate(new Date(2026, 2, 15, 23, 30))).toBe('2026-03-15');
    });

    it('takes the date part of an ion-datetime ISO string', () => {
      expect(toIsoDate('2026-07-26T14:30:00')).toBe('2026-07-26');
    });

    it('returns empty string for nullish or invalid input', () => {
      expect(toIsoDate(null)).toBe('');
      expect(toIsoDate(undefined)).toBe('');
      expect(toIsoDate('')).toBe('');
      expect(toIsoDate(new Date('nonsense'))).toBe('');
    });
  });

  describe('formatArrayDate', () => {
    it('formats a Fineract [year, month, day] array', () => {
      expect(formatArrayDate([2026, 1, 5])).toBe(JAN_5_2026);
    });

    it('returns a dash for anything that is not an array date', () => {
      expect(formatArrayDate(null)).toBe('-');
      expect(formatArrayDate([2026])).toBe('-');
      expect(formatArrayDate(JAN_5_2026)).toBe('-');
    });
  });

  describe('formatDateToFineract', () => {
    it('formats a Date in the display format', () => {
      expect(formatDateToFineract(new Date(2026, 0, 15))).toBe('15 January 2026');
    });

    it('accepts a Fineract array date', () => {
      expect(formatDateToFineract([2026, 1, 15])).toBe('15 January 2026');
    });

    it('returns empty string for invalid input', () => {
      expect(formatDateToFineract(null)).toBe('');
      expect(formatDateToFineract([2026])).toBe('');
    });
  });
});
