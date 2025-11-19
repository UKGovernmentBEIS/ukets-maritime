import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field based on the Reporting Year
 * Returns the column and row the error was found at
 */
export function csvFieldReportingYearValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  reportingYear: string,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentYear = dataRow[field]?.split('/')?.[2]?.toString();

      if (currentYear && currentYear !== reportingYear) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldReportingYear' + field.toString()]: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' must be within the Reporting year`,
        },
      };
    }

    return null;
  };
}
