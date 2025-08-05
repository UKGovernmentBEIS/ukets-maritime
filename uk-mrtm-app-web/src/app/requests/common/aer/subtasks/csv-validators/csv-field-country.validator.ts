import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field for Country Code, based on AER_PORT_COUNTRIES
 * Returns the column and row the error was found at
 */
export function csvFieldCountryValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  allCountriesKeys: Array<string>,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      if (currentField && !allCountriesKeys.includes(currentField)) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldCountry' + field.toString()]: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' is in an invalid format`,
        },
      };
    }

    return null;
  };
}
