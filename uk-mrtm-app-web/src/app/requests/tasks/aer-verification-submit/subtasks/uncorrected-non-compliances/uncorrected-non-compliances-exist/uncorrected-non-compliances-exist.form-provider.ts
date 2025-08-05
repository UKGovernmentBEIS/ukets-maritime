import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerUncorrectedNonCompliances } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const uncorrectedNonCompliancesExistProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const uncorrectedNonCompliances = store.select(aerVerificationSubmitQuery.selectUncorrectedNonCompliances)();

    return formBuilder.group({
      exist: formBuilder.control<AerUncorrectedNonCompliances['exist']>(uncorrectedNonCompliances?.exist, [
        GovukValidators.required(
          'Select yes if there have been any non-compliances with the maritime monitoring and reporting requirements in the UK ETS Order',
        ),
      ]),
    });
  },
};
