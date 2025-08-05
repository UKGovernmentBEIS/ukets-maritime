import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const overallVerificationDecisionCommentsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    const reasonIndex = route.snapshot.paramMap.get('reasonIndex');
    const reason = reasonIndex
      ? store.select(aerVerificationSubmitQuery.selectOverallVerificationDecisionReasons)()?.[reasonIndex]
      : null;

    return formBuilder.group({
      reason: formBuilder.control<string>(reason, [
        GovukValidators.required('Enter a reason'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
      reasonIndex: formBuilder.control<string>(reasonIndex),
    });
  },
};
