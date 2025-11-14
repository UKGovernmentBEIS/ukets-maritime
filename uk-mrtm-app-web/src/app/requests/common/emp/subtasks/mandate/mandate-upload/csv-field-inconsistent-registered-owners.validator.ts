import { FormControl, ValidatorFn } from '@angular/forms';

import { EmpRegisteredOwner } from '@mrtm/api';

import { FlattenedRegisteredOwner } from '@requests/common/emp/subtasks/mandate/mandate-upload/mandate-upload.map';

const generateRegisteredOwnerUuid = (
  name: EmpRegisteredOwner['name'],
  imoNumber: EmpRegisteredOwner['imoNumber'],
  contactName: EmpRegisteredOwner['contactName'],
  email: EmpRegisteredOwner['email'],
  effectiveDate: EmpRegisteredOwner['effectiveDate'],
): string => name + imoNumber + contactName + email + effectiveDate;

/**
 * Validates that Registered Owners with the same imoNumber cannot have different details
 * Returns the column and row the error was found at
 */
export function csvFieldInconsistentRegisteredOwnersValidator(): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];
    const combinations = new Map<string, string>();

    data.forEach((entry: FlattenedRegisteredOwner, index) => {
      const entityUUID = generateRegisteredOwnerUuid(
        entry?.name,
        entry?.imoNumber,
        entry?.contactName,
        entry?.email,
        entry?.effectiveDate,
      );

      const currentUUID = combinations.get(entry?.imoNumber);
      if (currentUUID && currentUUID !== entityUUID) {
        errorMessageRows.push({
          rowIndex: index + 2,
        });
      } else {
        combinations.set(entry?.imoNumber, entityUUID);
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldInconsistentRegisteredOwners']: {
          rows: errorMessageRows,
          columns: null,
          message: `The same IMO numbers are assigned to multiple registered owners in the file. Check the information entered and reupload the file`,
        },
      };
    }

    return null;
  };
}
