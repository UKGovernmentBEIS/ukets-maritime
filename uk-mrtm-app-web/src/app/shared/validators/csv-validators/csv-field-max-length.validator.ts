import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field for its length
 * Returns the column and row the error was found at
 */
export function csvFieldMaxLengthValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  length: number,
  message?: string,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      if (currentField && currentField?.length > length) {
        errorMessageRows.push({
          rowIndex: index + 2,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      const errorMessage = message ? message : `The field '${columnHeader}' is too long (max characters ${length})`;
      return {
        ['csvFieldMaxLength' + field.toString()]: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: errorMessage,
        },
      };
    }

    return null;
  };
}
