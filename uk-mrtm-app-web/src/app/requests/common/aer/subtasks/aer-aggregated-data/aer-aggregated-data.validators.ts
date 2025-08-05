import { FormGroup, ValidatorFn } from '@angular/forms';

import { isNil } from 'lodash-es';

import { AerAggregatedEmissionsFormGroupModel } from '@requests/common/aer/components';
import BigNumber from 'bignumber.js';

const totalEmissionsValidator =
  (message: string): ValidatorFn =>
  (abstractControl: FormGroup<AerAggregatedEmissionsFormGroupModel>) => {
    const { total } = abstractControl.value;
    if (abstractControl.valid && !isNil(total) && new BigNumber(total).lte(0)) {
      return {
        invalidGroupValues: message,
      };
    }
    return null;
  };

export const aerAggregatedDataValidators = {
  totalEmissionsValidator,
};
