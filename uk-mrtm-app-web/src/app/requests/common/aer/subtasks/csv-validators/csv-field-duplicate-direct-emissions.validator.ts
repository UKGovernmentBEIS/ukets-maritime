import { FormControl, ValidatorFn } from '@angular/forms';

import { FlattenedPort, FlattenedVoyage } from '@requests/common/aer/aer.types';
import {
  generatePortUuidFromFlattened,
  generateVoyageUuidFromFlattened,
  getVoyagePortUuidProperties,
  hasDirectEmission,
} from '@requests/common/aer/subtasks/utils';

/**
 * Validates that direct emissions cannot exist across 2 rows
 * Returns the column and row the error was found at
 */
export function csvFieldDuplicateDirectEmissionsValidator(type: 'voyages' | 'ports'): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];
    const combinations = new Map<string, number[]>();

    data.forEach((entry: FlattenedVoyage | FlattenedPort, index) => {
      const hasEmission = hasDirectEmission(entry);
      const fvp: FlattenedVoyage | FlattenedPort = getVoyagePortUuidProperties(entry, type);

      if (Object.values(fvp).some((value) => value === null) || !hasEmission) {
        return;
      }

      const entityUuid =
        type === 'voyages'
          ? generateVoyageUuidFromFlattened(fvp as FlattenedVoyage)
          : generatePortUuidFromFlattened(fvp as FlattenedPort);

      const existingRows = combinations.get(entityUuid);
      if (existingRows) {
        existingRows.push(index + 2);
      } else {
        combinations.set(entityUuid, [index + 2]);
      }
    });

    combinations.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((rowIndex) => {
          errorMessageRows.push({
            rowIndex: rowIndex,
          });
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldDuplicateDirectEmissions']: {
          rows: errorMessageRows,
          columns: null,
          message: `Direct emissions can only be added once`,
        },
      };
    }

    return null;
  };
}
