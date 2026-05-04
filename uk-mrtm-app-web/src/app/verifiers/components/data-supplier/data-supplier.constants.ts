import { InjectionToken } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { GovukTableColumn } from '@netz/govuk-components';

export const DATA_SUPPLIER_ROUTE_PREFIX = 'data-supplier';
export const APPOINT_DATA_SUPPLIER_FORM = new InjectionToken<UntypedFormGroup>('Appoint data supplier form');

export const getDataSupplierColumns = (editable: boolean): Array<GovukTableColumn> =>
  [
    { field: 'name', header: 'Name', isSortable: editable },
    editable ? { field: 'actions', header: 'Actions', hiddenHeader: true } : undefined,
  ].filter(Boolean);
