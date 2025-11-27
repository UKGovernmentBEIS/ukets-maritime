import { InjectionToken } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

export const DATA_SUPPLIERS_ROUTE_PREFIX = 'data-suppliers';
export const DATA_SUPPLIER_FORM = new InjectionToken<UntypedFormGroup>('Data suppliers form');
