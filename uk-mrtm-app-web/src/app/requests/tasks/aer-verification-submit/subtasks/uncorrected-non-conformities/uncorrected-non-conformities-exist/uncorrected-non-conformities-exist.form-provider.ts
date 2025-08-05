import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerUncorrectedNonConformities } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const uncorrectedNonConformitiesExistProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const uncorrectedNonConformities = store.select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)();

    return formBuilder.group({
      exist: formBuilder.control<AerUncorrectedNonConformities['exist']>(uncorrectedNonConformities?.exist, [
        GovukValidators.required(
          'Select yes if there have been any uncorrected non-conformities with the approved emissions monitoring plan',
        ),
      ]),
    });
  },
};
