import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isNil } from '@shared/utils';

export function addressedDescriptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }

    const isAddressed = parent.get('isAddressed')?.value;

    if (isNil(isAddressed)) {
      return null;
    }

    if (!control.value || control.value.trim() === '') {
      return {
        required: isAddressed
          ? 'State how the recommendation will be addressed'
          : 'State why you have not addressed this recommendation',
      };
    }

    return null;
  };
}
