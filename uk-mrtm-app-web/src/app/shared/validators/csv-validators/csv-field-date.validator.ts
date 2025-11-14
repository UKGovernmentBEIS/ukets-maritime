import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field of type date according to DD/MM/YYYY format
 * Returns the column and row the error was found at
 */
export function csvFieldDateValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  message?: string,
  hiddenIfNull = true,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];
    const pattern = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/([0-9]{4})$/);

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];

      if (hiddenIfNull && (currentField === null || currentField === undefined)) {
        return null;
      }

      if (!pattern.test(currentField) || !isRealDate(currentField)) {
        errorMessageRows.push({
          rowIndex: index + 2,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      const errorMessage = message ? message : `The field '${columnHeader}' is in an invalid format`;

      return {
        ['csvFieldDate' + field.toString()]: {
          rows: errorMessageRows,
          columns: [csvMap?.[field]],
          message: errorMessage,
        },
      };
    }

    return null;
  };
}

const isRealDate = (currentField: string) => {
  const dateFragments = currentField.split('/');
  const day = parseInt(dateFragments[0], 10);
  const month = parseInt(dateFragments[1], 10);
  const year = parseInt(dateFragments[2], 10);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};
