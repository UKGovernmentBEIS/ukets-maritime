import { isNil } from 'lodash-es';

import { SortEvent } from '@netz/govuk-components';

import { DiffItem, ShipEmissionTableListItem } from '@shared/types';

/**
 * Used on "List of Ships", "Voyages list", "Port calls list" and "Aggregated data list"
 */
export const sortAndPaginateListWithShipNameAndStatus = <T>(
  baseSorting: Array<SortEvent<T>>,
  sorting: SortEvent<T>,
  tableData: Array<T>,
  currentPage: number,
  pageSize: number,
): Array<T> => {
  let sortedData = tableData ?? [];

  for (const sort of baseSorting) {
    const { column, direction } = sort;
    sortedData = sortedData.sort((a, b) => {
      const objA = (direction === 'ascending' ? a[column] : b[column]) as any;
      const objB = (direction === 'ascending' ? b[column] : a[column]) as any;
      return column && !isNil(objA) ? objA.localeCompare(objB, 'en-GB', { sensitivity: 'base' }) : 0;
    });
  }

  sortedData.sort((a, b) => {
    if (!sorting) {
      return 0;
    }
    const diff = a[sorting.column as string].localeCompare(b[sorting.column], 'en-GB', { sensitivity: 'base' });
    return diff * (sorting.direction === 'ascending' ? 1 : -1);
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
