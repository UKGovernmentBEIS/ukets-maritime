import { isAfter, isBefore, isSameDay } from 'date-fns';

export const dateFormatPattern = /(\d{1,2})([-/,. ])(\d{1,2})\2(\d{4})/;

export const timeFormatPattern = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

export const mergeDatesToString = (dateDate: Date, timeDate: Date): string => {
  return mergeDatesToDate(dateDate, timeDate).toISOString();
};

export const mergeDatesToDate = (dateDate?: Date, timeDate?: Date): Date | null => {
  if (dateDate instanceof Date && timeDate instanceof Date) {
    const currentDate = new Date(
      dateDate.getFullYear(),
      dateDate.getMonth(),
      dateDate.getDate(),
      timeDate.getUTCHours(),
      timeDate.getUTCMinutes(),
      timeDate.getUTCSeconds(),
    );
    const tzoffset = currentDate.getTimezoneOffset() * 60000;

    return new Date(currentDate.valueOf() - tzoffset);
  }

  return null;
};

export const convertToUTCDate = (date: Date): Date | null => {
  if (date instanceof Date) {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );
  }

  return null;
};

/**
 * Parses a date string and returns a Date object. Accepts formats "d/M/yyyy" and "dd/MM/yyyy".
 * @param dateString - The date string in format "d/M/yyyy" or "dd/MM/yyyy".
 * @param fallback - A fallback Date object to be returned if the parsing fails.
 * @param isUTC - Determines if the resulting `Date` should be in UTC format.
 */
export const formatDateFromString = (dateString: string, fallback = new Date(), isUTC = false): Date | null => {
  let formattedDate = null;

  if (!dateFormatPattern.test(dateString)) return fallback;

  const match = dateString.match(dateFormatPattern);
  const day = Number(match[1]);
  const month = Number(match[3]);
  const year = Number(match[4]);
  formattedDate = isUTC ? new Date(Date.UTC(year, month - 1, day)) : new Date(year, month - 1, day);
  if (formattedDate instanceof Date && !isNaN(formattedDate as any)) {
    return formattedDate;
  }

  return fallback;
};

export const formatDateTimeFromString = (dateString: string, timeString: string, isUTC = false): Date | null => {
  let formattedDate = null;
  if (!dateFormatPattern.test(dateString) || !timeFormatPattern.test(timeString)) return null;

  const dateMatch = dateString.match(dateFormatPattern);
  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[3]);
  const year = Number(dateMatch[4]);
  const timeMatch = timeString.match(timeFormatPattern);
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const seconds = Number(timeMatch[3]);

  formattedDate = isUTC
    ? new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds, 0))
    : new Date(year, month - 1, day, hours, minutes, seconds);
  if (formattedDate instanceof Date && !isNaN(formattedDate as any)) {
    return formattedDate;
  }

  return null;
};

export const isSameDayOrBefore = (shouldBeSameOrBeforeDate: Date, comparisonDate: Date): boolean => {
  return isBefore(shouldBeSameOrBeforeDate, comparisonDate) || isSameDay(shouldBeSameOrBeforeDate, comparisonDate);
};

export const isSameDayOrAfter = (shouldBeSameOrAfterDate: Date, comparisonDate: Date): boolean => {
  return isAfter(shouldBeSameOrAfterDate, comparisonDate) || isSameDay(shouldBeSameOrAfterDate, comparisonDate);
};
