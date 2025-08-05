import { AbstractControl, ValidatorFn } from '@angular/forms';

export const futureDateValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: string } | null => {
    return control.value && control.value < new Date() ? { invalidDate: `The date must be in the future` } : null;
  };
};
