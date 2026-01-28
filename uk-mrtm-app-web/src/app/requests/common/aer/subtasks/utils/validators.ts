import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isNil } from 'lodash-es';
import { isAfter, isBefore } from 'date-fns';

import { AerFuelConsumption, AerShipEmissions } from '@mrtm/api';

import { AllFuelOriginTypeName } from '@shared/types';
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
      (departureTimeCtrl.invalid && !departureTimeCtrl.hasError('invalidDepartureTime')) ||
      isNil(departureTime) ||
      (arrivalTimeCtrl.invalid && !arrivalTimeCtrl.hasError('invalidArrivalTime')) ||
      isNil(arrivalTime)
    ) {
      return null;
    }

    const departureDateTime = mergeDatesToDate(departureDate, departureTime);
    const arrivalDateTime = mergeDatesToDate(arrivalDate, arrivalTime);

    const departureDateWithoutTime = getDateWithoutTime(departureDateTime);
    const arrivalDateWithoutTime = getDateWithoutTime(arrivalDateTime);

    const isDateAfterInvalid =
      type === 'ports'
        ? isAfter(arrivalDateWithoutTime, departureDateWithoutTime)
        : isAfter(departureDateWithoutTime, arrivalDateWithoutTime);
    const isTimeAfterInvalid =
      type === 'ports' ? !isBefore(arrivalDateTime, departureDateTime) : !isBefore(departureDateTime, arrivalDateTime);

    if (isDateAfterInvalid) {
      departureDateCtrl.setErrors({ invalidDepartureDate: errorMessagesMap[type].departureDate });
      arrivalDateCtrl.setErrors({ invalidArrivalDate: errorMessagesMap[type].arrivalDate });
      departureTimeCtrl.setErrors(null);
      arrivalTimeCtrl.setErrors(null);
    } else if (isTimeAfterInvalid) {
      departureDateCtrl.setErrors(null);
      arrivalDateCtrl.setErrors(null);
      departureTimeCtrl.setErrors({ invalidDepartureTime: errorMessagesMap[type].departureTime });
      arrivalTimeCtrl.setErrors({ invalidArrivalTime: errorMessagesMap[type].arrivalTime });
    } else {
      departureDateCtrl.setErrors(null);
      departureTimeCtrl.setErrors(null);
      arrivalDateCtrl.setErrors(null);
      arrivalTimeCtrl.setErrors(null);
    }

    return null;
  };

const getDateWithoutTime = (arrivalDateTime: Date) => {
  return new Date(arrivalDateTime.getFullYear(), arrivalDateTime.getMonth(), arrivalDateTime.getDate());
};

const errorMessagesMap: Record<
  'ports' | 'voyages',
  { arrivalTime: string; departureTime: string; arrivalDate: string; departureDate: string }
> = {
  ports: {
    arrivalTime: 'The time of arrival must be before the time of departure',
    departureTime: 'The time of departure must be after the time of arrival',
    arrivalDate: 'The date of arrival must be before the date of departure',
    departureDate: 'The date of departure must be after the date of arrival',
  },
  voyages: {
    arrivalTime: 'The time of arrival must be after the time of departure',
    departureTime: 'The time of departure must be before the time of arrival',
    arrivalDate: 'The date of arrival must be after the date of departure',
    departureDate: 'The date of departure must be before the date of arrival',
  },
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
  const errors: ValidationErrors = {};
  for (const fuel of fuels) {
    const fuelOriginTypeName = fuel.fuelOriginTypeName as AllFuelOriginTypeName;
    const isValid = relatedShip?.emissionsSources?.some((source) => {
      const emissionSourceNameFound = isNil(fuel?.name) ? true : source?.name === fuel?.name;
      return (
        emissionSourceNameFound &&
        source?.fuelDetails?.some((fuel) => {
          const methaneSlipValid = isNil(fuelOriginTypeName?.methaneSlip)
            ? true
            : fuel?.methaneSlip === fuelOriginTypeName?.methaneSlip;
          return (
            methaneSlipValid &&
            (fuel as AllFuelOriginTypeName)?.type === fuelOriginTypeName?.type &&
            fuel?.uniqueIdentifier === fuelOriginTypeName?.uniqueIdentifier
          );
        })
      );
    });

    if (!isValid) {
      errors[fuelOriginTypeName.uniqueIdentifier] = 'The highlighted entries have invalid values';
      return errors;
    }
  }

  return null;
};
