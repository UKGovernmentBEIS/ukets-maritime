import { ThirdPartyDataManagementTransactionItem } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

export const IMPORTED_RECORDS_COLUMNS: Array<
  GovukTableColumn<ThirdPartyDataManagementTransactionItem & { report?: boolean }>
> = [
  {
    header: 'Transaction ID',
    field: 'id',
  },
  {
    header: 'Date & time',
    field: 'createdOn',
    isSortable: true,
  },
  {
    header: 'User',
    field: 'submitterName',
  },
  {
    header: 'Tasks',
    field: 'itemType',
    widthClass: 'app-column-width-15-per',
  },
  {
    header: 'Status',
    field: 'status',
    widthClass: 'app-column-width-25-per',
  },
  {
    header: 'Report',
    field: 'report',
  },
];
