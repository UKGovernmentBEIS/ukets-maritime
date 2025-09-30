import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isNil } from 'lodash-es';
import { isBefore } from 'date-fns';

import { AerFuelConsumption, AerFuelOriginFossilTypeName, AerShipEmissions } from '@mrtm/api';

import { mergeDatesToDate } from '@shared/utils';

export const arrivalDepartureDateValidator =
  (type: 'ports' | 'voyages'): ValidatorFn =>
  (
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
      !(departureDate instanceof Date) ||
      isNil(arrivalDate) ||
      !(arrivalDate instanceof Date) ||
      departureTimeCtrl.invalid ||
      isNil(departureTime) ||
      arrivalTimeCtrl.invalid ||
      isNil(arrivalTime)
    ) {
      return null;
    }

    const departureDateTime = mergeDatesToDate(departureDate, departureTime);
    const arrivalDateTime = mergeDatesToDate(arrivalDate, arrivalTime);
    const isAfterInvalid =
      type === 'ports' ? !isBefore(arrivalDateTime, departureDateTime) : !isBefore(departureDateTime, arrivalDateTime);

    if (isAfterInvalid) {
      const departureDateMsg =
        type === 'ports'
          ? 'The date of departure must be after the date of arrival'
          : 'The date of departure must be before the date of arrival';
      const arrivalDateMsg =
        type === 'ports'
          ? 'The date of arrival must be before the date of departure'
          : 'The date of arrival must be after the date of departure';
      departureDateCtrl.setErrors({ invalidDepartureDate: departureDateMsg });
      arrivalDateCtrl.setErrors({ invalidArrivalDate: arrivalDateMsg });
    } else {
      departureDateCtrl.setErrors(null);
      arrivalDateCtrl.setErrors(null);
    }

    return null;
  };

export const sameReportingYearValidator =
  (reportingYear: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors =>
    !control.valid ||
    isNil(control.value) ||
    !(control.value instanceof Date) ||
    new Date(control.value).getFullYear() === reportingYear
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
