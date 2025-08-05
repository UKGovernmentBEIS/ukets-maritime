import { GovukTableColumn } from '@netz/govuk-components';

export const ACCOUNT_REPORTING_HISTORY_COLUMNS: Array<GovukTableColumn> = [
  {
    field: 'submissionDate',
    header: 'Date',
    widthClass: 'app-column-width-15-per',
  },
  {
    field: 'status',
    header: 'Reporting status',
    widthClass: 'app-column-width-20-per',
  },
  {
    field: 'reason',
    header: 'Reason',
  },
  {
    field: 'submitterName',
    header: 'Changed by',
    widthClass: 'app-column-width-20-per',
  },
];
