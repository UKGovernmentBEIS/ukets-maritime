import { inject, Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpFuelsAndEmissionsFactors } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import { fuelsAndEmissionsFormFlowMap } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.helper';
import {
  EmpFuelsAndEmissionFactorsFormModel,
  EmpFuelsAndEmissionsFactorsExtended,
  FuelsAndEmissionFactorsFormModel,
  FuelsAndEmissionsFactorsExtended,
  FuelsAndEmissionsFactorsFormType,
} from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { FuelsAndEmissionsFactors } from '@shared/types';
import { isAer, isNil } from '@shared/utils';

export const getNitrousOxideValidators = (): ValidatorFn[] => [
  GovukValidators.required('Enter emission factor for nitrous oxide'),
  GovukValidators.min(0, 'Emission factor for for nitrous oxide must be 0 or more'),
  GovukValidators.maxDecimalValidator(12),
];

export const fuelsAndEmissionFactorsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (fb: FormBuilder, store: RequestTaskStore, route: ActivatedRoute): FormGroup => {
    const commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
    const taskType = store.select(requestTaskQuery.selectRequestTaskType);

    const shipId = route.snapshot.params['shipId'];
    const factoryId = route.snapshot.params['factoryId'];

    const factory = store.select(
      commonSubtaskStepsQuery.selectShipFuelsAndEmissionsFactorsItem(shipId, factoryId),
    )() as FuelsAndEmissionsFactorsExtended;
    const listOfFuelsAndEmissions = (
      store.select(
        commonSubtaskStepsQuery.selectShipFuelsAndEmissionsFactors(shipId),
      )() as FuelsAndEmissionsFactorsExtended[]
    ).filter((item) => item.uniqueIdentifier !== factoryId);
    const origin = factory?.origin;
    const { nitrousOxideOptions } = fuelsAndEmissionsFormFlowMap?.[origin]?.[factory?.type] ?? {};
    const nitrousOxide = factory?.nitrousOxide;
    const isOtherNitrousOxide =
      nitrousOxideOptions?.length > 0 && !isNil(nitrousOxide) && !nitrousOxideOptions?.includes(+nitrousOxide);
    const nitrousOxideInitialValue = isOtherNitrousOxide ? 'OTHER' : nitrousOxide;
    const otherNitrousOxideInitialValue = isOtherNitrousOxide ? nitrousOxide : null;

    const originControl = fb.control<FuelsAndEmissionsFactors['origin'] | null>(factory?.origin, {
      validators: [GovukValidators.required('Select a fuel origin')],
    });
    const typeControl = fb.control<FuelsAndEmissionsFactorsFormType['type']>(factory?.type, {
      validators: [
        GovukValidators.required('Select a fuel type'),
        uniqueFuelType(listOfFuelsAndEmissions, originControl),
      ],
    });
    const nameControl = fb.control<string>(
      { value: factory?.name, disabled: factory?.type !== 'OTHER' },
      {
        validators: [
          GovukValidators.required('Enter a fuel name'),
          GovukValidators.maxLength(30, 'Fuel name must be 30 characters or less'),
          uniqueFuelName(listOfFuelsAndEmissions, originControl, typeControl),
        ],
      },
    );

    const baseFormGroup = {
      shipId: fb.control<FuelsAndEmissionsFactorsFormType['shipId']>(shipId),
      uniqueIdentifier: fb.control<FuelsAndEmissionsFactors['uniqueIdentifier'] | null>(factoryId),
      origin: originControl,
      type: typeControl,
      name: nameControl,
      carbonDioxide: fb.control<FuelsAndEmissionsFactors['carbonDioxide'] | null>(factory?.carbonDioxide, {
        validators: [
          GovukValidators.required('Enter emission factor for carbon dioxide'),
          GovukValidators.min(0, 'Emission factor for carbon dioxide must be 0 or more'),
          GovukValidators.maxDecimalValidator(12),
        ],
      }),
      methane: fb.control<FuelsAndEmissionsFactors['methane'] | null>(factory?.methane, {
        validators: [
          GovukValidators.required('Enter emission factor for methane'),
          GovukValidators.min(0, 'Emission factor for methane must be 0 or more'),
          GovukValidators.maxDecimalValidator(12),
        ],
      }),
      nitrousOxide: fb.control<FuelsAndEmissionsFactors['nitrousOxide'] | 'OTHER' | null>(nitrousOxideInitialValue, {
        validators: !isOtherNitrousOxide ? getNitrousOxideValidators() : null,
      }),
      otherNitrousOxide: fb.control<FuelsAndEmissionsFactors['nitrousOxide'] | null>(otherNitrousOxideInitialValue, {
        validators: isOtherNitrousOxide ? getNitrousOxideValidators() : null,
      }),
    };

    return isAer(taskType())
      ? fb.group<FuelsAndEmissionFactorsFormModel>(baseFormGroup)
      : fb.group<EmpFuelsAndEmissionFactorsFormModel>({
          ...baseFormGroup,
          densityMethodTank: fb.control<EmpFuelsAndEmissionsFactors['densityMethodTank'] | null>(
            (factory as EmpFuelsAndEmissionsFactorsExtended)?.densityMethodTank,
            {
              validators: [
                GovukValidators.required('Select a method to determine actual density values of fuel in tanks'),
              ],
            },
          ),
          densityMethodBunker: fb.control<EmpFuelsAndEmissionsFactors['densityMethodBunker'] | null>(
            (factory as EmpFuelsAndEmissionsFactorsExtended)?.densityMethodBunker,
            {
              validators: [
                GovukValidators.required('Select a method to determine actual density values of fuel bunkered'),
              ],
            },
          ),
        });
  },
};

const uniqueFuelType = (
  listOfFuelsAndEmissions: FuelsAndEmissionsFactorsExtended[],
  originControl: FormControl<FuelsAndEmissionsFactors['origin']>,
): ValidatorFn => {
  return GovukValidators.builder(
    'This fuel type already exists. Select a different type',
    (control: FormControl<FuelsAndEmissionsFactorsFormType['type']>) => {
      const duplicates = listOfFuelsAndEmissions.filter((item) =>
        control.value === 'OTHER' ? false : item.origin === originControl.value && item.type === control.value,
      );
      return duplicates.length > 0 ? { duplicateFuelOriginAndType: true } : null;
    },
  );
};

const uniqueFuelName = (
  listOfFuelsAndEmissions: FuelsAndEmissionsFactorsExtended[],
  originControl,
  typeControl,
): ValidatorFn => {
  return GovukValidators.builder(
    'This fuel name already exists. Enter a new fuel name',
    (control: FormControl<string>) => {
      const duplicates = listOfFuelsAndEmissions.filter((item) =>
        typeControl.value === 'OTHER'
          ? item.origin === originControl.value && item.name?.toUpperCase() === control.value?.toUpperCase()
          : false,
      );
      return duplicates.length > 0 ? { duplicateFuelOriginAndName: true } : null;
    },
  );
};
