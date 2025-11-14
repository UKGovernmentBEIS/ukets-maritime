import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field according to whether the value is included in an array of keys
 * Returns the column and row the error was found at
 */
export function csvFieldArrayIncludesValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  keysArray: any[],
  message: string,
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

      if (hiddenIfNull && (currentField === null || currentField === undefined)) {
        return null;
      }

      if (!keysArray.includes(currentField)) {
        errorMessageRows.push({
          rowIndex: index + 2,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldArrayIncludes' + field.toString()]: {
          rows: errorMessageRows,
          columns: [csvMap?.[field]],
          message,
        },
      };
    }

    return null;
  };
}
