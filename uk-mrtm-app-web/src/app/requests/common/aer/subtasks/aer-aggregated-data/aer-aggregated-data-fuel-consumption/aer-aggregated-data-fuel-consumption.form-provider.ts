import { Provider } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AerAggregatedDataFuelConsumption } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AerAggregatedDataFuelConsumptionFormGroupModel,
  AerAggregatedDataFuelConsumptionFormModel,
  AerAggregatedDataFuelConsumptionItemFormGroupModel,
  AerAggregatedDataFuelConsumptionItemFormModel,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-fuel-consumption/aer-aggregated-data-fuel-consumption.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const addFuelConsumptionGroup = (
  data?: AerAggregatedDataFuelConsumption,
): FormGroup<AerAggregatedDataFuelConsumptionItemFormGroupModel> =>
  new FormGroup<AerAggregatedDataFuelConsumptionItemFormGroupModel>({
    fuelOriginTypeName: new FormControl<AerAggregatedDataFuelConsumptionItemFormModel['fuelOriginTypeName'] | null>(
      data?.fuelOriginTypeName?.uniqueIdentifier,
      { validators: [GovukValidators.required('Select a fuel type')] },
    ),
    totalConsumption: new FormControl<AerAggregatedDataFuelConsumption['totalConsumption'] | null>(
      data?.totalConsumption,
      {
        validators: [
          GovukValidators.required('Enter the total consumption of fuel used'),
          GovukValidators.notNaN('Enter a numerical value'),
          GovukValidators.positiveOrZeroNumber('Must accept only positive numbers or zero'),
          GovukValidators.maxDecimalsValidator(5),
        ],
      },
    ),
  });

const validateFuelConsumptionGroup: ValidatorFn = (
  formControl: FormArray<FormGroup<AerAggregatedDataFuelConsumptionItemFormGroupModel>>,
): ValidationErrors => {
  if ((formControl.value ?? []).some((x) => x?.totalConsumption < 0)) {
    return { invalidTotalConsumption: 'Total consumption should be greater than or equal to 0 per fuel type' };
  }
  return null;
};

export const aerAggregatedDataFuelConsumptionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    activatedRoute: ActivatedRoute,
  ): FormGroup<AerAggregatedDataFuelConsumptionFormGroupModel> => {
    const dataId = activatedRoute.snapshot.params?.dataId;
    const aggregatedData = store.select(aerCommonQuery.selectAggregatedDataItem(dataId))();
    const fuelConsumptions = aggregatedData?.fuelConsumptions ?? [];

    return formBuilder.group<AerAggregatedDataFuelConsumptionFormGroupModel>({
      uniqueIdentifier: formBuilder.control<AerAggregatedDataFuelConsumptionFormModel['uniqueIdentifier'] | null>(
        dataId,
      ),
      fuelConsumptions: formBuilder.array<FormGroup<AerAggregatedDataFuelConsumptionItemFormGroupModel>>(
        (fuelConsumptions.length ? fuelConsumptions : [undefined]).map((data) => addFuelConsumptionGroup(data)),
        { validators: [validateFuelConsumptionGroup] },
      ),
    });
  },
};
