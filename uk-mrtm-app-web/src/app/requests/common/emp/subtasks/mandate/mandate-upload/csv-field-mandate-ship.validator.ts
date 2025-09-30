import { FormControl, ValidatorFn } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common';

/**
 * Validates that provided ShipImoNumber in Mandate exists in EmpEmissions
 * Returns the row the error was found at
 */
export function csvFieldMandateShip<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  store: RequestTaskStore,
  message: string,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];

      if (currentField === null || currentField === undefined) {
        return null;
      }

      const shipDetailsFound = store.select(empCommonQuery.selectRegisteredOwnerShipDetailByImoNumber(currentField))();

      if (!shipDetailsFound) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldMandateShip']: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: message,
        },
      };
    }

    return null;
  };
}
