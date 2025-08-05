import { GovukTableColumn } from '@netz/govuk-components';

import { ShipEmissionTableListItem } from '@shared/types';

export const LIST_OF_SHIPS_TABLE_COLUMNS: GovukTableColumn<ShipEmissionTableListItem>[] = [
  { field: 'imoNumber', header: 'IMO number', widthClass: 'govuk-!-width-one-quarter' },
  { field: 'name', header: 'Name', widthClass: 'govuk-!-width-one-quarter' },
  { field: 'type', header: 'Type', widthClass: 'govuk-!-width-one-quarter' },
  { field: 'status', header: 'Status', widthClass: 'govuk-!-width-one-quarter' },
];
