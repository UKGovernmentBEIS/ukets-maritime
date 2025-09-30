import { ValidationErrors, ValidatorFn } from '@angular/forms';

import { FilterByShipAndDateRangeDatesFormGroup } from '@requests/common/components/list-filter-forms/filter-by-ship-and-date-range/filter-by-ship-and-date-range.interface';
import { isSameDayOrBefore } from '@shared/utils';

export const datesBothOrNoneValidator = (): ValidatorFn => {
  return (group: FilterByShipAndDateRangeDatesFormGroup): ValidationErrors => {
    const arrivalDate = group.value.arrivalDate;
    const departureDate = group.value.departureDate;

    if (
      (arrivalDate instanceof Date && departureDate === null) ||
      (departureDate instanceof Date && arrivalDate === null)
    ) {
      return { missingDate: 'Enter both departure and arrival dates' };
    }
    return null;
  };
};

export const arrivalDepartureDateValidator =
  (type: 'ports' | 'voyages'): ValidatorFn =>
  (group: FilterByShipAndDateRangeDatesFormGroup): ValidationErrors => {
    const arrivalDate = group.value.arrivalDate;
    const departureDate = group.value.departureDate;

    if (arrivalDate instanceof Date && departureDate instanceof Date) {
      if (type === 'voyages') {
        return isSameDayOrBefore(departureDate, arrivalDate)
          ? null
          : { invalidDateRange: 'The departure date must be before or on the same day as the arrival date' };
      } else if (type === 'ports') {
        return isSameDayOrBefore(arrivalDate, departureDate)
          ? null
          : { invalidDateRange: 'The arrival date must be before or on the same day as the departure date' };
      }
    }
    return null;
  };
