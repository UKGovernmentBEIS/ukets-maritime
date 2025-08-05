import { AbstractControl, ValidatorFn } from '@angular/forms';

export function todayOrPastDateValidator(message?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: string } | null => {
    const date = control.value;
    const today = new Date();

    return !date || `${date}`.trim() === 'Invalid Date' || date <= today
      ? null
      : { futureDateError: message ?? 'The date must be today or in the past' };
  };
}
