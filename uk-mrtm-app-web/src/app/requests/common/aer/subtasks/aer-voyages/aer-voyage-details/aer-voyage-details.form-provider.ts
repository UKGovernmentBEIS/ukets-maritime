import { Provider } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { isNil } from 'lodash-es';
import { areIntervalsOverlapping } from 'date-fns';

import { AerVoyage } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AerPortDetailsFormGroupModel,
  AerPortDetailsModel,
} from '@requests/common/aer/subtasks/aer-ports/aer-port-details/aer-port-details.types';
import {
  AerVoyageDetailsFormGroup,
  AerVoyageDetailsFormModel,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyage-details/aer-voyage-details.types';
import { arrivalDepartureDateValidator, sameReportingYearValidator } from '@requests/common/aer/subtasks/utils';
import { TASK_FORM } from '@requests/common/task-form.token';
import { mergeDatesToDate } from '@shared/utils';

const arrivalDepartureDateTimeOverlapOtherVoyage =
  (
    actualVoyageId: AerPortDetailsModel['uniqueIdentifier'],
    imoNumber: AerVoyage['imoNumber'],
    store: RequestTaskStore,
  ): ValidatorFn =>
  (group: FormGroup<AerPortDetailsFormGroupModel>): ValidationErrors => {
    const arrivalDateCtrl = group.get('arrivalDate');
    const arrivalTimeCtrl = group.get('arrivalTime');
    const departureDateCtrl = group.get('departureDate');
    const departureTimeCtrl = group.get('departureTime');

    const otherVoyages = store
      .select(aerCommonQuery.selectVoyages)()
      .filter((voyage) => voyage.uniqueIdentifier !== actualVoyageId && voyage.imoNumber === imoNumber);

    if (
      [arrivalDateCtrl.value, arrivalTimeCtrl.value, departureDateCtrl.value, departureTimeCtrl.value].some((value) =>
        isNil(value),
      ) ||
      [arrivalDateCtrl.valid, arrivalTimeCtrl.valid, departureDateCtrl.valid, departureTimeCtrl.valid].some(
        (isValid) => isValid === false,
      ) ||
      !otherVoyages?.length
    ) {
      return null;
    }

    const arrivalTime = mergeDatesToDate(arrivalDateCtrl.value, arrivalTimeCtrl.value);
    const departureTime = mergeDatesToDate(departureDateCtrl.value, departureTimeCtrl.value);

    if (
      otherVoyages.some(
        (voyage) =>
          !isNil(voyage?.voyageDetails?.departureTime) &&
          !isNil(voyage?.voyageDetails?.arrivalTime) &&
          areIntervalsOverlapping(
            {
              start: departureTime,
              end: arrivalTime,
            },
            {
              start: new Date(voyage?.voyageDetails?.departureTime),
              end: new Date(voyage?.voyageDetails?.arrivalTime),
            },
            {
              inclusive: true,
            },
          ),
      )
    ) {
      return {
        voyageDateOverlap: 'The Date of departure and the Date of Arrival overlap another voyage of the same ship.',
        voyageTimeOverlap:
          'The actual time of departure and the actual time of arrival overlap another voyage of the same ship',
      };
    }

    return null;
  };

export const aerVoyageDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    route: ActivatedRoute,
  ): FormGroup<AerVoyageDetailsFormGroup> => {
    const voyageId = route?.snapshot?.params?.voyageId;
    const { imoNumber, voyageDetails, uniqueIdentifier } = store.select(aerCommonQuery.selectVoyage(voyageId))() ?? {};
    const reportingYear = store.select(aerCommonQuery.selectReportingYear)();

    return formBuilder.group<AerVoyageDetailsFormGroup>(
      {
        uniqueIdentifier: formBuilder.control<AerVoyageDetailsFormModel['uniqueIdentifier']>(voyageId),
        departureCountry: formBuilder.control<AerVoyageDetailsFormModel['departureCountry'] | null>(
          voyageDetails?.departurePort?.country,
          {
            validators: [GovukValidators.required('Enter a departure country')],
          },
        ),
        departurePort: formBuilder.control<AerVoyageDetailsFormModel['departurePort'] | null>(
          voyageDetails?.departurePort?.port,
          {
            validators: [GovukValidators.required('Enter a departure port')],
          },
        ),
        arrivalCountry: formBuilder.control<AerVoyageDetailsFormModel['arrivalCountry'] | null>(
          voyageDetails?.arrivalPort?.country,
          {
            validators: [GovukValidators.required('Enter an arrival country')],
          },
        ),
        arrivalPort: formBuilder.control<AerVoyageDetailsFormModel['arrivalPort'] | null>(
          voyageDetails?.arrivalPort?.port,
          {
            validators: [GovukValidators.required('Enter an arrival port')],
          },
        ),
        arrivalDate: formBuilder.control<AerVoyageDetailsFormModel['arrivalDate'] | Date | null>(
          !isNil(voyageDetails?.arrivalTime) ? new Date(voyageDetails?.arrivalTime) : null,
          {
            validators: [GovukValidators.required('Enter date of arrival'), sameReportingYearValidator(+reportingYear)],
          },
        ),
        arrivalTime: formBuilder.control<AerVoyageDetailsFormModel['arrivalDate'] | Date | null>(
          !isNil(voyageDetails?.arrivalTime) ? new Date(voyageDetails?.arrivalTime) : null,
          {
            validators: [GovukValidators.required('Enter actual time of arrival')],
          },
        ),
        departureDate: formBuilder.control<AerVoyageDetailsFormModel['departureTime'] | Date | null>(
          !isNil(voyageDetails?.departureTime) ? new Date(voyageDetails?.departureTime) : null,
          {
            validators: [
              GovukValidators.required('Enter date of departure'),
              sameReportingYearValidator(+reportingYear),
            ],
          },
        ),
        departureTime: formBuilder.control<AerVoyageDetailsFormModel['departureTime'] | Date | null>(
          !isNil(voyageDetails?.departureTime) ? new Date(voyageDetails?.departureTime) : null,
          {
            validators: [GovukValidators.required('Enter actual time of departure')],
          },
        ),
      },
      {
        validators: [
          arrivalDepartureDateValidator('voyages'),
          arrivalDepartureDateTimeOverlapOtherVoyage(uniqueIdentifier, imoNumber, store),
        ],
      },
    );
  },
};
