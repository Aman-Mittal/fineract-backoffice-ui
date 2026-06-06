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
