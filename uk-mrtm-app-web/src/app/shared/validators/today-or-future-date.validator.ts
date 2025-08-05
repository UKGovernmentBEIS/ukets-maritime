import { AbstractControl, ValidatorFn } from '@angular/forms';

export const todayOrFutureDateValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: string } | null => {
    const dateAndTime = new Date();
    const today = new Date(dateAndTime.toDateString());
    return control.value && control.value instanceof Date && new Date(control.value.toDateString()) < today
      ? { invalidDate: `The date must be today or in the future` }
      : null;
  };
};
