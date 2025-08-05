import { InjectionToken } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface TimeInputFormModel {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type TimeInputFormGroupModel = Record<keyof TimeInputFormModel, FormControl>;
export const TIME_INPUT_FORM: InjectionToken<FormGroup<TimeInputFormGroupModel>> = new InjectionToken<
  FormGroup<TimeInputFormGroupModel>
>('Time input form group');
