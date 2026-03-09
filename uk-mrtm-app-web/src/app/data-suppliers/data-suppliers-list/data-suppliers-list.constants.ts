import { GovukTableColumn } from '@netz/govuk-components';

import { DataSupplierItem } from '@data-suppliers/data-suppliers.types';

export const DATA_SUPPLIERS_LIST_COLUMNS: Array<GovukTableColumn<DataSupplierItem & { actions?: unknown }>> = [
  { header: 'Data supplier name', field: 'name', widthClass: 'govuk-!-width-one-third' },
  { header: 'Client ID', field: 'clientId', widthClass: 'govuk-!-width-one-third' },
  { header: 'Client secret', field: 'clientSecret', widthClass: 'govuk-!-width-one-third' },
  { header: null, field: 'actions' },
];
