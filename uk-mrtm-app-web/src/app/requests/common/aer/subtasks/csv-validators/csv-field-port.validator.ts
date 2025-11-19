import { FormControl, ValidatorFn } from '@angular/forms';

import { AER_PORT_COUNTRY_PORTS } from '@shared/constants';

/**
 * Validates a CSV field for Port Code, based on the combination of selected PortCode and selected CountryCode combination found in AER_PORT_COUNTRY_PORTS
 * Returns the column and row the error was found at
 */
export function csvFieldPortValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  relatedCountryField: keyof T,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      const relatedCountryValue = dataRow[relatedCountryField];
      const portCountryExists =
        AER_PORT_COUNTRY_PORTS?.[currentField]?.countryCode === relatedCountryValue ||
        currentField === 'NOT_APPLICABLE';

      if (currentField && !portCountryExists) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldPort' + field.toString()]: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' contains values that are inconsistent with the Country code`,
        },
      };
    }

    return null;
  };
}
