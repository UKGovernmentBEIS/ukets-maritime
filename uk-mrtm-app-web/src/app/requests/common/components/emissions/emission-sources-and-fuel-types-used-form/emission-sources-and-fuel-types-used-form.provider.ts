import { inject, Provider } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { isNil } from 'lodash-es';

import { AerFuelsAndEmissionsFactors, EmissionsSources, EmpEmissionsSources, FuelOriginTypeName } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import {
  EmissionSourcesAndFuelTypesUsedFormModel,
  EmissionSourcesAndFuelTypesUsedFormType,
  EmpEmissionSourcesAndFuelTypesUsedFormModel,
  EmpEmissionSourcesAndFuelTypesUsedFormType,
  FuelDetailsFormGroupModel,
} from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { EMISSION_SOURCES_METHANE_SLIP_SELECT_ITEMS } from '@shared/constants';
import { AllFuels, FuelsAndEmissionsFactors } from '@shared/types';
import { isAer, isLNG } from '@shared/utils';

const uniqueNameValidation =
  (emissionsSources: EmissionsSources[], sourceId: EmissionsSources['uniqueIdentifier']): ValidatorFn =>
  (control: AbstractControl): ValidationErrors => {
    if (
      emissionsSources.filter(
        (emissionsSource) => emissionsSource.uniqueIdentifier !== sourceId && emissionsSource.name === control.value,
      ).length > 0
    ) {
      return { nameExist: 'This emission source name already exists. Enter a unique name.' };
    }

    return null;
  };

export const addFuelDetailsFormControl = (
  fuelFactors?: FuelsAndEmissionsFactors[] | AerFuelsAndEmissionsFactors[],
  fuelOriginTypeName?: FuelOriginTypeName,
): FormGroup<FuelDetailsFormGroupModel> => {
  const methaneSlipValue = isNil(fuelOriginTypeName?.methaneSlipValueType)
    ? null
    : fuelOriginTypeName?.methaneSlipValueType === 'PRESELECTED'
      ? fuelOriginTypeName?.methaneSlip
      : 'OTHER';

  const methaneSlipOtherValue =
    isNil(fuelOriginTypeName?.methaneSlip) ||
    EMISSION_SOURCES_METHANE_SLIP_SELECT_ITEMS.some((values) => values.value === fuelOriginTypeName?.methaneSlip)
      ? null
      : fuelOriginTypeName?.methaneSlip;

  const currentFuelFactor = fuelFactors?.find(
    (item) => item.uniqueIdentifier === fuelOriginTypeName?.uniqueIdentifier,
  ) as AllFuels;

  return new FormGroup<FuelDetailsFormGroupModel>({
    uniqueIdentifier: new FormControl<FuelOriginTypeName['uniqueIdentifier'] | null>(
      fuelOriginTypeName?.uniqueIdentifier,
      {
        validators: [GovukValidators.required('Select potential fuel types used')],
      },
    ),
    methaneSlip: new FormControl<FuelOriginTypeName['methaneSlip'] | FuelOriginTypeName['methaneSlipValueType'] | null>(
      { value: methaneSlipValue, disabled: !isLNG(currentFuelFactor) },
      {
        validators: [GovukValidators.required('Select the methane slip')],
      },
    ),
    methaneSlipOther: new FormControl<FuelOriginTypeName['methaneSlip'] | null>(
      { value: methaneSlipOtherValue, disabled: methaneSlipValue !== 'OTHER' },
      {
        validators: [
          GovukValidators.required('Enter the methane slip'),
          GovukValidators.min(0, 'Must accept only positive values'),
          GovukValidators.percentageValidator(
            2,
            'The methane slip must be less or equal than 100% with up to 2 decimal places',
          ),
        ],
      },
    ),
  });
};

export const emissionSourcesAndFuelTypesUsedFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (fb: FormBuilder, store: RequestTaskStore, route: ActivatedRoute): FormGroup => {
    const commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
    const taskType = store.select(requestTaskQuery.selectRequestTaskType);
    const shipId: string = route.snapshot.params['shipId'];
    const sourceId: string = route.snapshot.params['sourceId'];

    const sources = store.select(commonSubtaskStepsQuery.selectShipEmissionSources(shipId))();
    const source = sources.find((source) => source.uniqueIdentifier === sourceId);
    const fuelFactors = store.select(commonSubtaskStepsQuery.selectShipFuelsAndEmissionsFactors(shipId))();

    const baseFormGroup = {
      name: fb.control<EmissionSourcesAndFuelTypesUsedFormType['name'] | null>(source?.name, {
        validators: [
          GovukValidators.required('Enter a name'),
          GovukValidators.maxLength(255, 'Enter up to 255 characters'),
          uniqueNameValidation(sources, sourceId),
        ],
      }),
      type: fb.control<EmissionSourcesAndFuelTypesUsedFormType['type'] | null>(source?.type, {
        validators: [GovukValidators.required('Select a type')],
      }),
      sourceClass: fb.control<EmissionSourcesAndFuelTypesUsedFormType['sourceClass'] | null>(source?.sourceClass, {
        validators: [GovukValidators.required('Select the emission source class')],
      }),
      fuelDetails: fb.array(
        source?.fuelDetails?.length > 0
          ? source.fuelDetails.map((fuelOriginTypeName) => addFuelDetailsFormControl(fuelFactors, fuelOriginTypeName))
          : [addFuelDetailsFormControl(fuelFactors)],
      ),
      monitoringMethod: fb.control<EmissionSourcesAndFuelTypesUsedFormType['monitoringMethod'] | null>(
        source?.monitoringMethod,
        {
          validators: [GovukValidators.required('Select a monitoring method')],
        },
      ),
      uniqueIdentifier: fb.control<EmissionSourcesAndFuelTypesUsedFormType['uniqueIdentifier'] | null>(sourceId),
      shipId: fb.control<EmissionSourcesAndFuelTypesUsedFormType['shipId'] | null>(shipId),
    };

    return isAer(taskType())
      ? fb.group<EmissionSourcesAndFuelTypesUsedFormModel>(baseFormGroup)
      : fb.group<EmpEmissionSourcesAndFuelTypesUsedFormModel>({
          ...baseFormGroup,
          referenceNumber: fb.control<EmpEmissionSourcesAndFuelTypesUsedFormType['referenceNumber'] | null>(
            (source as EmpEmissionsSources)?.referenceNumber,
            { validators: [GovukValidators.maxLength(30, 'Enter up to 30 characters')] },
          ),
        });
  },
};
