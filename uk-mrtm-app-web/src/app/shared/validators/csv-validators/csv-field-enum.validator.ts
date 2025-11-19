import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field of type ENUM according to its values
 * Returns the column and row the error was found at
 */
export function csvFieldEnumValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  enumType: any,
  hiddenIfNull = true,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];

      if (hiddenIfNull && (currentField === null || currentField === undefined)) {
        return null;
      }

      if (!Object.values(enumType).includes(currentField)) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldEnum' + field.toString()]: {
          rows: errorMessageRows,
          columns: [csvMap?.[field]],
          message: `The field '${columnHeader}' is in an invalid format`,
        },
      };
    }

    return null;
  };
}
