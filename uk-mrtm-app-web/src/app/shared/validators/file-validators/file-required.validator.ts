import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Checks if file does not exist
 */
export function fileRequiredValidator(message: string): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const file = control.value;
    if (!file) {
      return { fileRequired: { message } };
    }
    return null;
  };
}
