import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { AER_OBJECT_ROUTE_KEY } from '@requests/common/aer/aer.consts';
import {
  AER_DIRECT_EMISSIONS_SELECTOR,
  AerDirectEmissionsFormGroupModel,
  AerDirectEmissionsFormModel,
  DirectEmissionsSelector,
} from '@requests/common/aer/components/aer-direct-emission/aer-direct-emission.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import BigNumber from 'bignumber.js';

const assignValidators = (requiredMessage: string) => [
  GovukValidators.required(requiredMessage),
  GovukValidators.notNaN('Enter a numerical value'),
  GovukValidators.positiveOrZeroNumber('Must accept only positive numbers or zero'),
  GovukValidators.maxDecimalsValidator(7),
];

export const aerDirectEmissionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, AER_DIRECT_EMISSIONS_SELECTOR, AER_OBJECT_ROUTE_KEY, ActivatedRoute],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    directEmissionSelector: DirectEmissionsSelector,
    routeParamName: string,
    route: ActivatedRoute,
  ): FormGroup<AerDirectEmissionsFormGroupModel> => {
    const objectId = route?.snapshot?.params?.[routeParamName];
    const directEmissions = store.select(directEmissionSelector(objectId))();

    return formBuilder.group<AerDirectEmissionsFormGroupModel>({
      uniqueIdentifier: formBuilder.control<AerDirectEmissionsFormModel['uniqueIdentifier']>(objectId),
      co2: formBuilder.control<AerDirectEmissionsFormModel['co2']>(directEmissions?.co2, {
        validators: assignValidators('Enter CO2 emissions (t)'),
      }),
      ch4: formBuilder.control<AerDirectEmissionsFormModel['ch4']>(directEmissions?.ch4, {
        validators: assignValidators('Enter CH4 emissions (tCO2e)'),
      }),
      n2o: formBuilder.control<AerDirectEmissionsFormModel['n2o']>(directEmissions?.n2o, {
        validators: assignValidators('Enter N2O emissions (tCO2e)'),
      }),
      total: formBuilder.control<AerDirectEmissionsFormModel['total']>(
        new BigNumber(directEmissions?.total ?? '0').decimalPlaces(5).toFixed(),
        {
          validators: [
            GovukValidators.positiveNumber('Total emissions as tCO2e should be greater than 0'),
            GovukValidators.maxDecimalsValidator(7),
          ],
        },
      ),
    });
  },
};
