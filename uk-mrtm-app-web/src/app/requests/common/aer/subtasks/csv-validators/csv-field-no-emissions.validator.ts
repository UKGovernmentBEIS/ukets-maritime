import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates that at least one AerFuelConsumption or AerPortEmissionsMeasurement
 * exists in a single entry
 * Returns the row the error was found at
 */
export function csvFieldNoEmissionsValidator(message: string): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const origin = dataRow?.['fuelConsumptionOrigin'];
      const type = dataRow?.['fuelConsumptionType'];
      const amount = dataRow?.['fuelConsumptionAmount'];
      const co2 = dataRow?.['directEmissionsCO2'];
      const ch4 = dataRow?.['directEmissionsCH4'];
      const n2o = dataRow?.['directEmissionsN2O'];

      if (!origin && !type && !amount && !co2 && !ch4 && !n2o) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldNoEmissions']: {
          rows: errorMessageRows,
          columns: null,
          message: message,
        },
      };
    }

    return null;
  };
}
