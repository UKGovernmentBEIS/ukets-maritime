import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { AerAggregatedEmissionsMeasurement } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { AerAggregatedEmissionsFormGroupModel } from '@requests/common/aer/components/aer-aggregated-emissions-form/aer-aggregated-emissions-form.types';

const fieldValidators: Array<ValidatorFn> = [
  GovukValidators.notNaN('Enter a numerical value'),
  GovukValidators.positiveOrZeroNumber('Must accept only positive numbers or zero'),
  GovukValidators.required('Must accept only positive numbers or zero'),
  GovukValidators.maxDecimalsValidator(7),
];

export const provideAerAggregatedEmissionsFormGroup = (
  data?: AerAggregatedEmissionsMeasurement,
  validators?: ValidatorFn | Array<ValidatorFn>,
  useFieldValidators: boolean = true,
): FormGroup<AerAggregatedEmissionsFormGroupModel> =>
  new FormGroup<AerAggregatedEmissionsFormGroupModel>(
    {
      co2: new FormControl<AerAggregatedEmissionsMeasurement['co2'] | null>(data?.co2, {
        validators: useFieldValidators ? fieldValidators : undefined,
      }),
      ch4: new FormControl<AerAggregatedEmissionsMeasurement['ch4'] | null>(data?.ch4, {
        validators: useFieldValidators ? fieldValidators : undefined,
      }),
      n2o: new FormControl<AerAggregatedEmissionsMeasurement['n2o'] | null>(data?.n2o, {
        validators: useFieldValidators ? fieldValidators : undefined,
      }),
      co2Captured: new FormControl<AerAggregatedEmissionsMeasurement['co2Captured'] | null>(data?.co2Captured, {
        validators: useFieldValidators ? fieldValidators : undefined,
      }),
      total: new FormControl<AerAggregatedEmissionsMeasurement['total'] | null>(data?.total, {
        validators: fieldValidators,
      }),
    },
    { validators },
  );
