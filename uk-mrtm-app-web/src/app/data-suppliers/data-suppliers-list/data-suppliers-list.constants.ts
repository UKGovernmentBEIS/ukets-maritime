import { GovukTableColumn } from '@netz/govuk-components';

import { DataSupplierItem } from '@data-suppliers/data-suppliers.types';

export const DATA_SUPPLIERS_LIST_COLUMNS: Array<GovukTableColumn<DataSupplierItem>> = [
  { header: 'Data supplier name', field: 'name', widthClass: 'govuk-!-width-one-third' },
  { header: 'Public key URL', field: 'jwksUrl', widthClass: 'govuk-!-width-one-third' },
  { header: 'Client ID', field: 'clientId', widthClass: 'govuk-!-width-one-third' },
];
