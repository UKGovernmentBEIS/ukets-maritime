import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerVerificationDecision } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const overallVerificationDecisionAssessmentProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const overallVerificationDecision = store.select(aerVerificationSubmitQuery.selectOverallVerificationDecision)();

    return formBuilder.group({
      type: formBuilder.control<AerVerificationDecision['type']>(overallVerificationDecision?.type ?? null, [
        GovukValidators.required('Select your assessment of this report'),
      ]),
    });
  },
};
