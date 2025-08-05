import { GovukTableColumn } from '@netz/govuk-components';

export const PAGE_SIZE = 30;

export const TABLE_COLUMNS: Array<GovukTableColumn> = [
  { header: 'ID', field: 'id', isHeader: true },
  { header: 'Created by', field: 'createdBy' },
  { header: 'Date created', field: 'createdDate' },
  { header: 'Emitters', field: 'emitters' },
];
