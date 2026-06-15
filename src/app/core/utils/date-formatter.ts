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

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Formats a Date object (or date-like string/array) into the Fineract-preferred
 * 'D Month YYYY' format (e.g., '15 January 2026').
 *
 * @param date - The date to format.
 * @returns The formatted date string, or empty string if invalid.
 */
export function formatDateToFineract(date: Date | string | number[] | null | undefined): string {
  if (!date) return '';

  let d: Date;
  if (Array.isArray(date)) {
    if (date.length >= 3) {
      d = new Date(date[0], date[1] - 1, date[2]);
    } else {
      return '';
    }
  } else if (typeof date === 'string') {
    d = new Date(date);
  } else {
    d = date;
  }

  if (isNaN(d.getTime())) return '';

  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

export const FINERACT_DATE_FORMAT = 'dd MMMM yyyy';
export const FINERACT_LOCALE = 'en';

/**
 * Formats a Fineract array date (`[year, month, day]`) into a `YYYY-MM-DD` string for table display.
 *
 * @param value - The raw value from the API (expected to be a 3+ element number array).
 * @returns The formatted `YYYY-MM-DD` string, or `'-'` when the value is not a valid array date.
 */
export function formatArrayDate(value: unknown): string {
  if (!Array.isArray(value) || value.length < 3) {
    return '-';
  }
  return `${value[0]}-${String(value[1]).padStart(2, '0')}-${String(value[2]).padStart(2, '0')}`;
}
