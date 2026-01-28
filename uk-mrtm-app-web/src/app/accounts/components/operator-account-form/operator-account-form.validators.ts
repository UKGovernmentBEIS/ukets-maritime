import { UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { endOfYear, isWithinInterval, startOfDay } from 'date-fns';

export const commencementDateValidator = (minYear: string, stateCommencementDate?: Date): ValidatorFn => {
  return (group: UntypedFormGroup): ValidationErrors => {
    if (!new Date(group.value).getTime()) {
      return null;
    }

    const currentCommencementDate = new Date(group.value);
    const minDate = startOfDay(new Date(minYear));
    const maxYear = stateCommencementDate
      ? stateCommencementDate.getFullYear().toString()
      : new Date().getFullYear().toString();
    const maxDate = endOfYear(new Date(maxYear));

    return isWithinInterval(currentCommencementDate, { start: minDate, end: maxDate })
      ? null
      : {
          invalidCommencementDate: `The year must be the same as or after ${minYear} and it cannot be later than ${stateCommencementDate ? 'previously set' : 'current year'}`,
        };
  };
};
