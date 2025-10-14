import { InjectionToken } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

export const GUIDANCE_ROUTE_PREFIX = 'guidance';
export const MANAGE_GUIDANCE_FORM = new InjectionToken<UntypedFormGroup>('Manage guidance form');
