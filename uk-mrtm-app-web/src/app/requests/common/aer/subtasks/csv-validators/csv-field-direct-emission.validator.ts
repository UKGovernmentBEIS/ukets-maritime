import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates that an AerPortEmissionsMeasurement object is valid
 * Returns the row the error was found at
 */
export function csvFieldDirectEmissionValidator(message: string): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const co2 = dataRow?.['directEmissionsCO2'];
      const ch4 = dataRow?.['directEmissionsCH4'];
      const n2o = dataRow?.['directEmissionsN2O'];

      if (
        (co2 || ch4 || n2o) &&
        (!isValidDirectEmission(co2) || !isValidDirectEmission(ch4) || !isValidDirectEmission(n2o))
      ) {
        errorMessageRows.push({
          rowIndex: index + 2,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldDirectConsumption']: {
          rows: errorMessageRows,
          columns: null,
          message: message,
        },
      };
    }

    return null;
  };
}

/**
 * Validates that a direct emission is positive and up to 7 decimal places.
 */
const isValidDirectEmission = (value: string) => {
  const pattern = new RegExp('^[0-9]+(\\.[0-9]{1,7})?$');
  return pattern.test(value);
};
