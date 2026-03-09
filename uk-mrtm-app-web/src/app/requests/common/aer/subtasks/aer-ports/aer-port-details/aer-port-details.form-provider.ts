import { Provider } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { isNil } from 'lodash-es';
import { areIntervalsOverlapping } from 'date-fns';

import { AerPort } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AerPortDetailsFormGroupModel,
  AerPortDetailsModel,
} from '@requests/common/aer/subtasks/aer-ports/aer-port-details/aer-port-details.types';
import { arrivalDepartureDateValidator, sameReportingYearValidator } from '@requests/common/aer/subtasks/utils';
import { TASK_FORM } from '@requests/common/task-form.token';
import { convertToUTCDate, mergeDatesToDate } from '@shared/utils';

const arrivalDepartureDateTimeOverlapOtherPortCall =
  (
    actualPortId: AerPortDetailsModel['uniqueIdentifier'],
    imoNumber: AerPort['imoNumber'],
    store: RequestTaskStore,
  ): ValidatorFn =>
  (group: FormGroup<AerPortDetailsFormGroupModel>): ValidationErrors => {
    const arrivalDateCtrl = group.get('arrivalDate');
    const arrivalTimeCtrl = group.get('arrivalTime');
    const departureDateCtrl = group.get('departureDate');
    const departureTimeCtrl = group.get('departureTime');

    const otherPortCalls = store
      .select(aerCommonQuery.selectPorts)()
      .filter((port) => port.uniqueIdentifier !== actualPortId && port.imoNumber === imoNumber);

    if (
      [arrivalDateCtrl.value, arrivalTimeCtrl.value, departureDateCtrl.value, departureTimeCtrl.value].some((value) =>
        isNil(value),
      ) ||
      [arrivalDateCtrl.valid, arrivalTimeCtrl.valid, departureDateCtrl.valid, departureTimeCtrl.valid].some(
        (isValid) => isValid === false,
      ) ||
      !otherPortCalls?.length
    ) {
      return null;
    }

    const arrivalTime = mergeDatesToDate(arrivalDateCtrl.value, arrivalTimeCtrl.value);
    const departureTime = mergeDatesToDate(departureDateCtrl.value, departureTimeCtrl.value);

    if (
      otherPortCalls.some(
        (port) =>
          !isNil(port?.portDetails?.departureTime) &&
          !isNil(port?.portDetails?.arrivalTime) &&
          areIntervalsOverlapping(
            {
              start: arrivalTime,
              end: departureTime,
            },
            {
              start: new Date(port?.portDetails?.arrivalTime),
              end: new Date(port?.portDetails?.departureTime),
            },
            {
              inclusive: true,
            },
          ),
      )
    ) {
      return {
        portDateOverlap: 'The Date of departure and the Date of Arrival overlap another port call of the same ship.',
        portTimeOverlap:
          'The actual time of departure and the actual time of arrival overlap another port call of the same ship',
      };
    }

    return null;
  };

export const aerPortDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    route: ActivatedRoute,
  ): FormGroup<AerPortDetailsFormGroupModel> => {
    const portId = route?.snapshot?.params?.portId;
    const port = store.select(aerCommonQuery.selectPort(portId))();
    const reportingYear = store.select(aerCommonQuery.selectReportingYear)();

    return formBuilder.group<AerPortDetailsFormGroupModel>(
      {
        uniqueIdentifier: formBuilder.control<AerPortDetailsModel['uniqueIdentifier']>(portId),
        country: formBuilder.control<AerPortDetailsModel['country'] | null>(port?.portDetails?.visit?.country, {
          validators: [GovukValidators.required('Enter a country')],
        }),
        port: formBuilder.control<AerPortDetailsModel['port'] | null>(port?.portDetails?.visit?.port, {
          validators: [GovukValidators.required('Enter a port')],
        }),
        arrivalDate: formBuilder.control<AerPortDetailsModel['arrivalDate'] | Date | null>(
          !isNil(port?.portDetails?.arrivalTime) ? convertToUTCDate(new Date(port?.portDetails?.arrivalTime)) : null,
          {
            validators: [GovukValidators.required('Enter date of arrival'), sameReportingYearValidator(+reportingYear)],
          },
        ),
        arrivalTime: formBuilder.control<AerPortDetailsModel['arrivalDate'] | Date | null>(
          !isNil(port?.portDetails?.arrivalTime) ? new Date(port?.portDetails?.arrivalTime) : null,
          {
            validators: [GovukValidators.required('Enter actual time of arrival')],
          },
        ),
        departureDate: formBuilder.control<AerPortDetailsModel['departureTime'] | Date | null>(
          !isNil(port?.portDetails?.departureTime)
            ? convertToUTCDate(new Date(port?.portDetails?.departureTime))
            : null,
          {
            validators: [
              GovukValidators.required('Enter date of departure'),
              sameReportingYearValidator(+reportingYear),
            ],
          },
        ),
        departureTime: formBuilder.control<AerPortDetailsModel['departureTime'] | Date | null>(
          !isNil(port?.portDetails?.departureTime) ? new Date(port?.portDetails?.departureTime) : null,
          {
            validators: [GovukValidators.required('Enter actual time of departure')],
          },
        ),
      },
      {
        validators: [
          arrivalDepartureDateValidator('ports'),
          arrivalDepartureDateTimeOverlapOtherPortCall(port?.uniqueIdentifier, port?.imoNumber, store),
        ],
      },
    );
  },
};
