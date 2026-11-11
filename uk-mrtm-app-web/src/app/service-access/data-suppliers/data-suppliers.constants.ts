import { InjectionToken } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

export const DATA_SUPPLIERS_ROUTE_PREFIX = 'data-suppliers';
export const DATA_SUPPLIER_FORM = new InjectionToken<UntypedFormGroup>('Data suppliers form');
export const APPOINT_DATA_SUPPLIER_FORM = new InjectionToken<UntypedFormGroup>('Appoint data supplier form');
