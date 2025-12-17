import { isNil } from 'lodash-es';

import { SortEvent } from '@netz/govuk-components';

import { DiffItem, ShipEmissionTableListItem } from '@shared/types';

const compareValues = <T = unknown>(
  a: T[keyof T],
  b: T[keyof T],
  direction: SortEvent['direction'],
  nulls: 'first' | 'last' = 'last',
): number => {
  const aNil = isNil(a);
  const bNil = isNil(b);

  if (aNil || bNil) {
    if (aNil && bNil) return 0;
    const nilOrder = nulls === 'first' ? -1 : 1;
    return aNil ? nilOrder : -nilOrder;
  }

  let result = 0;

  // Dates (Date object)
  if (a instanceof Date && b instanceof Date) {
    result = a.valueOf() - b.valueOf();
  }
  // ISO date strings (or other date-like strings) - only if both parse to valid dates
  else if (typeof a === 'string' && typeof b === 'string') {
    const da = Date.parse(a);
    const db = Date.parse(b);
    if (!Number.isNaN(da) && !Number.isNaN(db)) {
      result = da - db;
    } else {
      result = a.localeCompare(b, 'en-GB', { sensitivity: 'base' });
    }
  }
  // Numbers
  else if (typeof a === 'number' && typeof b === 'number') {
    result = a - b;
  }
  // Fallback: compare as strings
  else {
    result = String(a).localeCompare(String(b), 'en-GB', { sensitivity: 'base' });
  }

  return direction === 'ascending' ? result : -result;
};

/**
 * Used on "List of Ships", "Voyages list", "Port calls list" and "Aggregated data list"
 */
export const sortAndPaginateListWithShipNameAndStatus = <T>(
  rules: Array<SortEvent<T>>,
  tableData: Array<T>,
  currentPage: number,
  pageSize: number,
): Array<T> => {
  const sortedData = [...tableData];
  sortedData.sort((left, right) => {
    for (const rule of rules) {
      const a = left[rule.column];
      const b = right[rule.column];

      const diff = compareValues<T>(a, b, rule.direction);
      if (diff !== 0) return diff;
    }
    return 0;
  });

  if (currentPage && pageSize) {
    const firstIndex = (currentPage - 1) * pageSize;
    const lastIndex = Math.min(firstIndex + pageSize, sortedData?.length);
    return sortedData?.length > firstIndex ? sortedData.slice(firstIndex, lastIndex) : [];
  }

  return sortedData;
};

/**
 * Used on List of ships with DiffComponent, e.g., mrtm-list-of-ships-summary-template
 */
export const sortDiffPaginateListWithShipNameAndStatus = (
  sorting: SortEvent,
  diffShips: DiffItem<ShipEmissionTableListItem>[],
  currentPage: number,
  pageSize: number,
): DiffItem<ShipEmissionTableListItem>[] => {
  const sortedData = diffShips.sort((a, b) => {
    if (!sorting) {
      return 0;
    }
    const diff = a?.current?.[sorting.column].localeCompare(b?.current?.[sorting.column], 'en-GB', {
      sensitivity: 'base',
    });
    return diff * (sorting.direction === 'ascending' ? 1 : -1);
  });

  if (currentPage && pageSize) {
    const firstIndex = (currentPage - 1) * pageSize;
    const lastIndex = Math.min(firstIndex + pageSize, sortedData?.length);
    return sortedData?.length > firstIndex ? sortedData.slice(firstIndex, lastIndex) : [];
  }

  return sortedData;
};
