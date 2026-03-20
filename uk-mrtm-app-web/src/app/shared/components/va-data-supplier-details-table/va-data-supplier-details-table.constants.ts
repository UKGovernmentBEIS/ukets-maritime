import { GovukTableColumn } from '@netz/govuk-components';

export const getDataSupplierColumns = (editable: boolean, withUserType: boolean): Array<GovukTableColumn> =>
  [
    { field: 'name', header: 'Name', isSortable: editable, widthClass: 'app-column-width-30-per' },
    withUserType ? { field: 'userType', header: 'User type' } : undefined,
    editable ? { field: 'actions', header: 'Actions', hiddenHeader: true } : undefined,
  ].filter(Boolean);
