import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

export function requiredFieldsValidator(): ValidatorFn {
  return GovukValidators.builder('You must fill all required values', (group: UntypedFormGroup) =>
    Object.keys(group.controls).find((key) => group.controls[key].hasError('required'))
      ? { emptyRequiredFields: true }
      : null,
  );
}
