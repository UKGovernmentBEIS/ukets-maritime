import { GovukTableColumn } from '@netz/govuk-components';

import { ShipEmissionTableListItem } from '@shared/types';

export const LIST_OF_SHIPS_TABLE_COLUMNS: GovukTableColumn<ShipEmissionTableListItem>[] = [
  { field: 'name', header: 'Ship name and IMO number', widthClass: 'govuk-!-width-one-third' },
  { field: 'type', header: 'Type', widthClass: 'govuk-!-width-one-third' },
  { field: 'status', header: 'Status', widthClass: 'govuk-!-width-one-third', isSortable: true },
];
