import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV file for its fields, checks that there is at least 1 row
 */
export function csvRowsEmptyValidator(message = 'The file cannot be empty'): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!data?.length) {
      return {
        ['csvFieldEmptyRow']: {
          rows: null,
          columns: null,
          message: message,
        },
      };
    }

    return null;
  };
}
