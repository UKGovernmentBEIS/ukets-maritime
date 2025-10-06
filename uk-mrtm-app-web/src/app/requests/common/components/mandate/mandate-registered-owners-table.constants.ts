import { EmpRegisteredOwner } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

import { MandateRegisteredOwnerTableListItem } from '@shared/types';

export const MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS: Array<GovukTableColumn<EmpRegisteredOwner>> = [
  {
    field: 'name',
    header: 'Registered owner name and IMO number',
    widthClass: 'app-column-width-20-per',
  },
  {
    field: 'contactName',
    widthClass: 'app-column-width-20-per',
    header: 'Contact details',
  },
  {
    field: 'ships',
    header: 'Associated ships',
  },
  {
    field: 'effectiveDate',
    header: 'Date of written agreement',
    widthClass: 'app-column-width-20-per',
  },
];

export const MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS_WITH_ACTIONS: Array<
  GovukTableColumn<MandateRegisteredOwnerTableListItem>
> = [
  ...MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS,
  {
    field: 'actions',
    widthClass: 'app-column-width-10-per',
    header: null,
  },
];
