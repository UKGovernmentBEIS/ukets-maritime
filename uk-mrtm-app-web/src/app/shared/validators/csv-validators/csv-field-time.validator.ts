import { FormControl, ValidatorFn } from '@angular/forms';

import { timeFormatPattern } from '@shared/utils';

/**
 * Validates a CSV field of type time according to HH:MM:SS format
 * Returns the column and row the error was found at
 */
export function csvFieldTimeValidator<T>(
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
    const pattern = new RegExp(timeFormatPattern);

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];

      if (hiddenIfNull && (currentField === null || currentField === undefined)) {
        return null;
      }

      if (!pattern.test(currentField)) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldTime' + field.toString()]: {
          rows: errorMessageRows,
          columns: [csvMap?.[field]],
          message: `The field '${columnHeader}' is in an invalid format`,
        },
      };
    }

    return null;
  };
}
