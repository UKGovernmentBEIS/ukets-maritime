import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field as boolean.
 * If required = true, prioritize missing values over invalid values
 * Returns the column and row the error was found at
 */
export function csvFieldBooleanValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  hiddenIfNull = true,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];

      if (hiddenIfNull && (currentField === null || currentField === undefined || currentField === '')) {
        return null;
      }

      if (currentField !== true && currentField !== false) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldBoolean' + field.toString()]: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' is in an invalid format`,
        },
      };
    }

    return null;
  };
}
