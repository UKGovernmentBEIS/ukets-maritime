import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV file for its rows length
 * Returns the column and row the error was found at
 */
export function csvRowsLengthValidator(maxRows: number, message: string): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (data?.length > maxRows) {
      return {
        ['csvRowsLength']: {
          rows: null,
          columns: null,
          message: message,
        },
      };
    }

    return null;
  };
}
