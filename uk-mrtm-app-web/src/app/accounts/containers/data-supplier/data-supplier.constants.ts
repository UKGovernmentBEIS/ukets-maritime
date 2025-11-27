import { InjectionToken } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

export const DATA_SUPPLIER_ROUTE_PREFIX = 'data-supplier';
export const APPOINT_DATA_SUPPLIER_FORM = new InjectionToken<UntypedFormGroup>('Appoint data supplier form');
