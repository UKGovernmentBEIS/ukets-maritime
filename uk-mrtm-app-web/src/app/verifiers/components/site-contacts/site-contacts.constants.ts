import { GovukTableColumn } from '@netz/govuk-components';

export const SITE_CONTACTS_LIST_COLUMNS: GovukTableColumn[] = [
  { field: 'accountName', header: 'Operator name', isHeader: true },
  { field: 'type', header: 'Type' },
  { field: 'user', header: 'Assigned to' },
];
