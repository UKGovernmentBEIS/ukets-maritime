import { GovukTableColumn } from '@netz/govuk-components';

export const ACCOUNT_REPORTING_STATUS_COLUMNS: Array<GovukTableColumn> = [
  {
    field: 'year',
    header: 'Year',
  },
  {
    field: 'status',
    header: 'Status',
  },
  {
    field: 'actions',
    header: undefined,
  },
  {
    field: 'lastUpdate',
    header: 'Last update',
  },
];
