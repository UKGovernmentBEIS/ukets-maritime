import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

export function atLeastOneRequiredValidator(message: string): ValidatorFn {
  return GovukValidators.builder(message, (group: UntypedFormGroup) =>
    Object.keys(group.controls).find((key) => !!group.controls[key].value) ? null : { atLeastOneRequired: true },
  );
}
