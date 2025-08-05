import { GovukTableColumn } from '@netz/govuk-components';

import { ShipEmissionTableListItem } from '@shared/types';

export const LIST_OF_SHIPS_TABLE_COLUMNS: GovukTableColumn<ShipEmissionTableListItem>[] = [
  { field: 'imoNumber', header: 'IMO number' },
  { field: 'name', header: 'Name' },
  { field: 'type', header: 'Type' },
  { field: 'status', header: 'Status' },
];
