import { AbstractControl, ValidatorFn } from '@angular/forms';

import { isBefore, isSameDay } from 'date-fns';

export function todayOrPastDateValidator(message?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: string } | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      return null;
    }

    const today = new Date();

    return isSameDay(date, today) || isBefore(date, today)
      ? null
      : { futureDateError: message ?? 'The date must be today or in the past' };
  };
}
