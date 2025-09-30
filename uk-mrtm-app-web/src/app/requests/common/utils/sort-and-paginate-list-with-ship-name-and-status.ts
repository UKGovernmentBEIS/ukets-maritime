import { SortEvent } from '@netz/govuk-components';

// Used on "List of Ships", "Voyages list", "Port calls list" and "Aggregated data list"
export const sortAndPaginateListWithShipNameAndStatus = <T>(
  sorting: SortEvent,
  tableData: Array<T>,
  currentPage: number,
  pageSize: number,
): Array<T> => {
  const sortedData = (tableData ?? [])
    .sort((a, b) => {
      // first sort rows by ship name ascending
      const shipNameKey = a['shipName'] ? 'shipName' : a['name'] ? 'name' : null;
      return shipNameKey ? a[shipNameKey].localeCompare(b[shipNameKey], 'en-GB', { sensitivity: 'base' }) : 0;
    })
    .sort((a, b) => {
      if (!sorting) {
        return 0;
      }
      const diff = a[sorting.column].localeCompare(b[sorting.column], 'en-GB', { sensitivity: 'base' });
      return diff * (sorting.direction === 'ascending' ? 1 : -1);
    });

  if (currentPage && pageSize) {
    const firstIndex = (currentPage - 1) * pageSize;
    const lastIndex = Math.min(firstIndex + pageSize, sortedData?.length);
    const paginatedDataSlice = sortedData?.length > firstIndex ? sortedData.slice(firstIndex, lastIndex) : [];
    return paginatedDataSlice;
  }

  return sortedData;
};
