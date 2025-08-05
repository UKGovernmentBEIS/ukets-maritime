import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  ReductionClaimExistFormGroupModel,
  ReductionClaimExistFormModel,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim-exist/reduction-claim-exist.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const reductionClaimExistFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore): FormGroup<ReductionClaimExistFormGroupModel> => {
    const reductionClaim = store.select(aerCommonQuery.selectReductionClaim)();

    return formBuilder.group<ReductionClaimExistFormGroupModel>({
      exist: formBuilder.control<ReductionClaimExistFormModel['exist'] | null>(reductionClaim?.exist ?? null, {
        validators: [
          GovukValidators.required(
            'Select yes if you will be making an emissions reduction claims as a result of the purchase',
          ),
        ],
      }),
    });
  },
};
