import { FormControl, ValidatorFn } from '@angular/forms';

import { formatDateFromString, isSameOrBefore } from '@shared/utils';

/**
 * Validates a CSV field for comparing the departureDate and arrivalDate
 * Returns the column and row the error was found at
 */
export function csvFieldDateComparisonValidator<T>(
  field: keyof T,
  earlierDateField: keyof T,
  laterDateField: keyof T,
  csvMap: Record<keyof T, string>,
  message: string,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const earlierDate = formatDateFromString(dataRow[earlierDateField], null, true);
      const laterDate = formatDateFromString(dataRow[laterDateField], null, true);

      if (!earlierDate || !laterDate || !isSameOrBefore(earlierDate, laterDate)) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldDateComparison' + field.toString()]: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: message,
        },
      };
    }

    return null;
  };
}
