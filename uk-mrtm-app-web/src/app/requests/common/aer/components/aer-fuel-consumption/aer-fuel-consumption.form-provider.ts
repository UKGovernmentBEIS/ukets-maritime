import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { AER_OBJECT_ROUTE_KEY } from '@requests/common/aer/aer.consts';
import {
  AER_FUEL_CONSUMPTION_SELECTOR,
  AerFuelConsumptionFormGroupModel,
  AerFuelConsumptionFormModel,
  FuelConsumptionSelector,
} from '@requests/common/aer/components/aer-fuel-consumption/aer-fuel-consumption.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { AllFuelOriginTypeName } from '@shared/types';
import { isLNG } from '@shared/utils';

export const aerFuelConsumptionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, AER_FUEL_CONSUMPTION_SELECTOR, AER_OBJECT_ROUTE_KEY, ActivatedRoute],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    fuelConsumptionSelector: FuelConsumptionSelector,
    routeParamName: string,
    route: ActivatedRoute,
  ): FormGroup<AerFuelConsumptionFormGroupModel> => {
    const objectId = route?.snapshot?.params?.[routeParamName];
    const fuelConsumptionId = route?.snapshot?.params?.fuelConsumptionId;
    const fuelConsumption = store.select(fuelConsumptionSelector(objectId, fuelConsumptionId))();
    const isLNGType = isLNG(fuelConsumption?.fuelOriginTypeName as AllFuelOriginTypeName);

    return formBuilder.group<AerFuelConsumptionFormGroupModel>({
      objectId: formBuilder.control<AerFuelConsumptionFormModel['objectId']>(objectId),
      fuelOrigin: formBuilder.control<AerFuelConsumptionFormModel['fuelOrigin'] | null>(
        fuelConsumption?.fuelOriginTypeName?.uniqueIdentifier,
        {
          validators: [GovukValidators.required('Select a fuel type')],
        },
      ),
      fuelDensity: formBuilder.control<AerFuelConsumptionFormModel['fuelDensity'] | null>(
        fuelConsumption?.fuelDensity,
        {
          validators: [
            GovukValidators.required('Enter the fuel Density'),
            GovukValidators.notNaN('Enter a numerical value'),
            GovukValidators.positiveOrZeroNumber('Must accept only positive numbers or zero'),
            GovukValidators.minMaxRangeNumberValidator(0, 1),
            GovukValidators.maxDecimalsValidator(3),
          ],
        },
      ),
      amount: formBuilder.control<AerFuelConsumptionFormModel['amount'] | null>(fuelConsumption?.amount, {
        validators: [
          GovukValidators.required('Enter the amount of fuel used'),
          GovukValidators.notNaN('Enter a numerical value'),
          GovukValidators.positiveOrZeroNumber('Must accept only positive numbers or zero'),
          GovukValidators.maxDecimalsValidator(5),
        ],
      }),
      name: formBuilder.control<AerFuelConsumptionFormModel['name'] | null>(fuelConsumption?.name ?? null),
      totalConsumption: formBuilder.control<AerFuelConsumptionFormModel['totalConsumption'] | null>(
        fuelConsumption?.totalConsumption,
        {
          validators: [GovukValidators.positiveNumber('Total emissions as CO2e should be greater than 0')],
        },
      ),
      measuringUnit: formBuilder.control<AerFuelConsumptionFormModel['measuringUnit'] | null>(
        fuelConsumption?.measuringUnit,
        {
          validators: [GovukValidators.required('Select a measuring unit')],
        },
      ),
      methaneSlip: formBuilder.control<number | string | null>(
        {
          value: fuelConsumption?.fuelOriginTypeName?.methaneSlip
            ? `${fuelConsumption?.fuelOriginTypeName?.methaneSlip}`
            : null,
          disabled: !isLNGType,
        },
        {
          validators: [GovukValidators.required('Select the methane slip')],
        },
      ),
      uniqueIdentifier: formBuilder.control<AerFuelConsumptionFormModel['uniqueIdentifier'] | null>(
        fuelConsumption?.uniqueIdentifier ?? crypto.randomUUID(),
      ),
    });
  },
};
