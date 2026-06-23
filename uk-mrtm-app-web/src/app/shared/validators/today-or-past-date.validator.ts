import { AbstractControl, ValidatorFn } from '@angular/forms';

import { isAfter, startOfDay } from 'date-fns';

export function todayOrPastDateValidator(message?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: string } | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const inputDate = value instanceof Date ? value : new Date(value);

    if (isNaN(inputDate.getTime())) {
      return null;
    }

    const today = new Date();

    const inputMidnight = startOfDay(
      new Date(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate()),
    );
    const todayMidnight = startOfDay(today);

    return isAfter(inputMidnight, todayMidnight)
      ? { futureDateError: message ?? 'The date must be today or in the past' }
      : null;
  };
}
