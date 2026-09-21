import { InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';

export const IMPORT_DATA_ROUTE_PREFIX = 'import-data';
export const IMPORT_DATA_FORM_PROVIDER = new InjectionToken<FormGroup>('ImportDataFormGroup');
