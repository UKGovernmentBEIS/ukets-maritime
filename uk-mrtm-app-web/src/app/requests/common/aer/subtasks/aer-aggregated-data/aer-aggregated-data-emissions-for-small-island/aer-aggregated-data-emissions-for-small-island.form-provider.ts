import { Provider } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { isNil } from 'lodash-es';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerAggregatedEmissionsFormGroupModel } from '@requests/common/aer/components/aer-aggregated-emissions-form/aer-aggregated-emissions-form.types';
import { provideAerAggregatedEmissionsFormGroup } from '@requests/common/aer/components/aer-aggregated-emissions-form/aer-aggregated-emissions-form.utils';
import { AER_AGGREGATED_DATA_PARAM } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataValidators } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.validators';
import {
  AerAggregatedDataEmissionsForSmallIslandFormGroupModel,
  AerAggregatedDataEmissionsForSmallIslandFormModel,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-emissions-for-small-island/aer-aggregated-data-emissions-for-small-island.types';
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

export const aerAggregatedDataEmissionsForSmallIslandFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    route: ActivatedRoute,
  ): FormGroup<AerAggregatedDataEmissionsForSmallIslandFormGroupModel> => {
    const dataId = route?.snapshot?.params?.[AER_AGGREGATED_DATA_PARAM];
    const aggregatedData = store.select(aerCommonQuery.selectAggregatedDataItem(dataId))();

    return formBuilder.group<AerAggregatedDataEmissionsForSmallIslandFormGroupModel>({
      uniqueIdentifier: formBuilder.control<
        AerAggregatedDataEmissionsForSmallIslandFormModel['uniqueIdentifier'] | null
      >(dataId),
      smallIslandSurrenderReduction: provideAerAggregatedEmissionsFormGroup(
        aggregatedData?.smallIslandSurrenderReduction,
        [
          emissionsGroupValidator('Enter emissions eligible for small island ferry operator surrender reduction'),
          aerAggregatedDataValidators.totalEmissionsValidator(
            'Total emissions eligible for small island ferry operator surrender reduction should be greater than 0',
          ),
        ],
      ),
    });
  },
};
