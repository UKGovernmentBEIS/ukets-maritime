import { Provider } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { isNil } from 'lodash-es';

import { AerShipAggregatedData } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AerAggregatedEmissionsFormGroupModel,
  provideAerAggregatedEmissionsFormGroup,
} from '@requests/common/aer/components';
import { AER_AGGREGATED_DATA_PARAM } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataValidators } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.validators';
import { AerAggregatedDataAnnualEmissionsFormGroupModel } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-annual-emissions/aer-aggregated-data-annual-emissions.types';
import { TASK_FORM } from '@requests/common/task-form.token';

const emissionsGroupValidator =
  (validationMessage: string): ValidatorFn =>
  (abstractControl: FormGroup<AerAggregatedEmissionsFormGroupModel>) => {
    const { co2, n2o, ch4, co2Captured } = abstractControl.value;
    if (isNil(ch4) || isNil(n2o) || isNil(co2) || isNil(co2Captured)) {
      return {
        invalidGroupValues: validationMessage,
      };
    }
    return null;
  };

export const aerAggregatedDataAnnualEmissionsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, ActivatedRoute, RequestTaskStore],
  useFactory: (
    formBuilder: FormBuilder,
    route: ActivatedRoute,
    store: RequestTaskStore,
  ): FormGroup<AerAggregatedDataAnnualEmissionsFormGroupModel> => {
    const dataId = route?.snapshot?.params?.[AER_AGGREGATED_DATA_PARAM];
    const aggregatedData = store.select(aerCommonQuery.selectAggregatedDataItem(dataId))();

    return formBuilder.group<AerAggregatedDataAnnualEmissionsFormGroupModel>({
      uniqueIdentifier: formBuilder.control<AerShipAggregatedData['uniqueIdentifier'] | null>(dataId),
      emissionsBetweenUKAndEEAVoyages: provideAerAggregatedEmissionsFormGroup(
        aggregatedData?.emissionsBetweenUKAndEEAVoyages,
        [emissionsGroupValidator('Enter the aggregated greenhouse gas emissions from all voyages between UK ports')],
      ),
      emissionsBetweenUKPorts: provideAerAggregatedEmissionsFormGroup(aggregatedData?.emissionsBetweenUKPorts, [
        emissionsGroupValidator('Enter aggregated greenhouse gas emissions from all voyages between the UK and EEA'),
      ]),
      emissionsWithinUKPorts: provideAerAggregatedEmissionsFormGroup(aggregatedData?.emissionsWithinUKPorts, [
        emissionsGroupValidator('Enter aggregated greenhouse gas emissions which occurred within UK ports'),
      ]),
      totalAggregatedEmissions: provideAerAggregatedEmissionsFormGroup(
        aggregatedData?.totalAggregatedEmissions,
        aerAggregatedDataValidators.totalEmissionsValidator('The total emissions should be greater than 0'),
        false,
      ),
    });
  },
};
