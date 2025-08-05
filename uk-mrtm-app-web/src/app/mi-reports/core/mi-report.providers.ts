import { InjectionToken, Type } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';

export const MI_REPORT_FORM_GROUP: InjectionToken<() => FormGroup | UntypedFormGroup> = new InjectionToken<
  () => FormGroup | UntypedFormGroup
>('Mi report form group');

export const MI_REPORT_FORM_COMPONENT: InjectionToken<Type<unknown>> = new InjectionToken<Type<unknown>>(
  'Mi report form component',
);
