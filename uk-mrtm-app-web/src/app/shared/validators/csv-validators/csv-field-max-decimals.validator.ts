import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field of type date according to DD/MM/YYYY format
 * Returns the column and row the error was found at
 */
export function csvFieldMaxDecimalsValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  decimalDigits: number,
  isPositiveOnly = false,
  hiddenIfNull = true,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];
    const pattern = new RegExp(`^-?[0-9]+(\\.[0-9]{1,${decimalDigits}})?$`, '');

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];

      if (hiddenIfNull && (currentField === null || currentField === undefined)) {
        return null;
      }

      if (!pattern.test(currentField) || (isPositiveOnly && currentField < 0)) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldMaxDecimals' + field.toString()]: {
          rows: errorMessageRows,
          columns: [csvMap?.[field]],
          message: `The field '${columnHeader}' is in an invalid format`,
        },
      };
    }

    return null;
  };
}
