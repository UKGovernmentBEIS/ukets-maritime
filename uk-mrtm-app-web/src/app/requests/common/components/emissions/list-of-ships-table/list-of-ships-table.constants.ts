import { GovukTableColumn } from '@netz/govuk-components';

import { AerShipEmissionTableListItem, ShipEmissionTableListItem } from '@shared/types';

export const LIST_OF_SHIPS_TABLE_COLUMNS: GovukTableColumn<ShipEmissionTableListItem>[] = [
  { field: 'name', header: 'Ship name and IMO number', widthClass: 'govuk-!-width-one-third' },
  { field: 'type', header: 'Type', widthClass: 'govuk-!-width-one-third' },
  { field: 'status', header: 'Status', widthClass: 'govuk-!-width-one-third', isSortable: true },
];

export const LIST_OF_SHIPS_TABLE_COLUMNS_WITH_DATA_SOURCE: GovukTableColumn<AerShipEmissionTableListItem>[] = [
  { field: 'name', header: 'Ship name and IMO number', widthClass: 'govuk-!-width-one-quarter' },
  { field: 'type', header: 'Type', widthClass: 'govuk-!-width-one-quarter' },
  { field: 'dataInputType', header: 'Initial source', widthClass: 'govuk-!-width-one-quarter' },
  { field: 'status', header: 'Status', widthClass: 'govuk-!-width-one-quarter', isSortable: true },
];
