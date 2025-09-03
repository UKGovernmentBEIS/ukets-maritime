import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isNil } from 'lodash-es';
import { isAfter } from 'date-fns';

import { AerFuelConsumption, AerFuelOriginFossilTypeName, AerShipEmissions } from '@mrtm/api';

import { isSameOrBefore, mergeDatesToDate } from '@shared/utils';

export const portArrivalDepartureDateValidator: ValidatorFn = (
  group: FormGroup<{
    arrivalDate: AbstractControl;
    arrivalTime: AbstractControl;
    departureTime: AbstractControl;
    departureDate: AbstractControl;
  }>,
): ValidationErrors => {
  const { arrivalDate, departureDate } = group.value;
  const arrivalDateCtrl = group.get('arrivalDate');
  const departureDateCtrl = group.get('departureDate');

  if (
    (!departureDateCtrl.valid && !departureDateCtrl.hasError('invalidDepartureDate')) ||
    (!arrivalDateCtrl.valid && !arrivalDateCtrl.hasError('invalidArrivalDate')) ||
    isNil(departureDateCtrl.value) ||
    isNil(arrivalDateCtrl.value)
  ) {
    return null;
  }

  if (!isNil(arrivalDate) && !isNil(departureDate) && isSameOrBefore(departureDate, arrivalDate)) {
    group
      .get('arrivalDate')
      .setErrors({ invalidArrivalDate: 'The date of arrival must be before the date of departure' });
    group
      .get('departureDate')
      .setErrors({ invalidDepartureDate: 'The date of departure must be after the date of arrival' });
  } else {
    group.get('arrivalDate').setErrors(null);
    group.get('departureDate').setErrors(null);
  }

  return null;
};

export const voyageArrivalDepartureDateValidator: ValidatorFn = (
  group: FormGroup<{
    arrivalDate: AbstractControl;
    arrivalTime: AbstractControl;
    departureTime: AbstractControl;
    departureDate: AbstractControl;
  }>,
): ValidationErrors => {
  const { departureDate, departureTime, arrivalDate, arrivalTime } = group.value;
  const departureDateCtrl = group.get('departureDate');
  const departureTimeCtrl = group.get('departureTime');
  const arrivalDateCtrl = group.get('arrivalDate');
  const arrivalTimeCtrl = group.get('arrivalTime');

  if (
    (departureDateCtrl.invalid && !departureDateCtrl.hasError('invalidDepartureDate')) ||
    (arrivalDateCtrl.invalid && !arrivalDateCtrl.hasError('invalidArrivalDate')) ||
    isNil(departureDate) ||
    isNil(arrivalDate) ||
    departureTimeCtrl.invalid ||
    isNil(departureTime) ||
    arrivalTimeCtrl.invalid ||
    isNil(arrivalTime)
  ) {
    return null;
  }

  const departureDateTime = mergeDatesToDate(departureDate, departureTime);
  const arrivalDateTime = mergeDatesToDate(arrivalDate, arrivalTime);

  if (isAfter(departureDateTime, arrivalDateTime)) {
    departureDateCtrl.setErrors({ invalidDepartureDate: 'The date of departure must be before the date of arrival' });
    arrivalDateCtrl.setErrors({ invalidArrivalDate: 'The date of arrival must be after the date of departure' });
  } else {
    departureDateCtrl.setErrors(null);
    arrivalDateCtrl.setErrors(null);
  }

  return null;
};

export const sameReportingYearValidator =
  (reportingYear: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors =>
    !control.valid || isNil(control.value) || new Date(control.value).getFullYear() === reportingYear
      ? null
      : { incorrectReportingYear: `The date must be within the reporting period of ${reportingYear}` };

export const validateIfUsedFuelsExistInEmissionsValidator = (
  fuels: Array<AerFuelConsumption>,
  relatedShip: AerShipEmissions,
): ValidationErrors => {
  for (const fuel of fuels) {
    const fuelOriginTypeName = fuel.fuelOriginTypeName as unknown as AerFuelOriginFossilTypeName;
    if (
      !(relatedShip?.fuelsAndEmissionsFactors as unknown as Array<AerFuelOriginFossilTypeName>)?.find(
        (shipFuel: AerFuelOriginFossilTypeName) =>
          shipFuel?.origin === fuelOriginTypeName.origin &&
          shipFuel?.type === fuelOriginTypeName.type &&
          shipFuel?.name === fuelOriginTypeName.name,
      )
    ) {
      return { fuelConsumptions: 'The field “Fuel type” has an invalid value' };
    }
  }

  return null;
};
