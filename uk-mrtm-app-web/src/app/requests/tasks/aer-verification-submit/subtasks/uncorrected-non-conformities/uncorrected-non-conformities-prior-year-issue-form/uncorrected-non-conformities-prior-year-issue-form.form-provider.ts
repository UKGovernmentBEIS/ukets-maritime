import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const uncorrectedNonConformitiesPriorYearIssueFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    const referenceParam = route.snapshot.paramMap.get('reference');
    const item = referenceParam
      ? store
          .select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)()
          ?.priorYearIssues?.find(({ reference }) => reference === referenceParam)
      : null;

    return formBuilder.group({
      explanation: formBuilder.control<string>(item?.explanation, [
        GovukValidators.required('Enter an explanation'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
      reference: formBuilder.control<string>(item?.reference),
    });
  },
};
