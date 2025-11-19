import { FormControl, ValidatorFn } from '@angular/forms';

import { isAfter } from 'date-fns';

import { formatDateTimeFromString } from '@shared/utils';

/**
 * Validates a CSV field for comparing the departureDate and arrivalDate
 * Returns the column and row the error was found at
 */
export function csvFieldDateComparisonValidator<T>(
  field: keyof T,
  earlierDateField: keyof T,
  earlierTimeField: keyof T,
  laterDateField: keyof T,
  laterTimeField: keyof T,
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
      const earlierDateTime = formatDateTimeFromString(dataRow[earlierDateField], dataRow[earlierTimeField], true);
      const laterDateTime = formatDateTimeFromString(dataRow[laterDateField], dataRow[laterTimeField], true);

      if (!earlierDateTime || !laterDateTime || !isAfter(laterDateTime, earlierDateTime)) {
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
