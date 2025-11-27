import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { AerPortEmissionsMeasurement } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { AerAggregatedEmissionsFormGroupModel } from '@requests/common/aer/components/aer-aggregated-emissions-form/aer-aggregated-emissions-form.types';

const fieldValidators: Array<ValidatorFn> = [
  GovukValidators.notNaN('Enter a numerical value'),
  GovukValidators.positiveOrZeroNumber('Must accept only positive numbers or zero'),
  GovukValidators.required('Must accept only positive numbers or zero'),
  GovukValidators.maxDecimalsValidator(7),
];

export const provideAerAggregatedEmissionsFormGroup = (
  data?: AerPortEmissionsMeasurement,
  validators?: ValidatorFn | Array<ValidatorFn>,
  useFieldValidators: boolean = true,
): FormGroup<AerAggregatedEmissionsFormGroupModel> =>
  new FormGroup<AerAggregatedEmissionsFormGroupModel>(
    {
      co2: new FormControl<AerPortEmissionsMeasurement['co2'] | null>(data?.co2, {
        validators: useFieldValidators ? fieldValidators : undefined,
      }),
      ch4: new FormControl<AerPortEmissionsMeasurement['ch4'] | null>(data?.ch4, {
        validators: useFieldValidators ? fieldValidators : undefined,
      }),
      n2o: new FormControl<AerPortEmissionsMeasurement['n2o'] | null>(data?.n2o, {
        validators: useFieldValidators ? fieldValidators : undefined,
      }),
      total: new FormControl<AerPortEmissionsMeasurement['total'] | null>(data?.total, {
        validators: fieldValidators,
      }),
    },
    { validators },
  );
