import { AbstractControl, ValidatorFn } from '@angular/forms';

export const futureDateValidator = (message?: string): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: string } | null => {
    return control.value && control.value < new Date()
      ? { invalidDate: message ?? 'The date must be in the future' }
      : null;
  };
};
