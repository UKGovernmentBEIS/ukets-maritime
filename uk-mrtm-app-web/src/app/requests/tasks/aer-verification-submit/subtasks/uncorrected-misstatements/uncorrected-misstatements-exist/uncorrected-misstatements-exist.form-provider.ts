import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerUncorrectedMisstatements } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const uncorrectedMisstatementsExistProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const uncorrectedMisstatements = store.select(aerVerificationSubmitQuery.selectUncorrectedMisstatements)();

    return formBuilder.group({
      exist: formBuilder.control<AerUncorrectedMisstatements['exist']>(uncorrectedMisstatements?.exist, [
        GovukValidators.required(
          'Select yes if there are any misstatements that were not corrected before issuing this report',
        ),
      ]),
    });
  },
};
