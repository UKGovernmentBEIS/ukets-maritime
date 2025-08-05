import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerRecommendedImprovements } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const recommendedImprovementsExistProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const recommendedImprovements = store.select(aerVerificationSubmitQuery.selectRecommendedImprovements)();

    return formBuilder.group({
      exist: formBuilder.control<AerRecommendedImprovements['exist']>(recommendedImprovements?.exist, [
        GovukValidators.required('Select yes if there are any recommended improvements'),
      ]),
    });
  },
};
