import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const recommendedImprovementsImprovementFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    const referenceParam = route.snapshot.paramMap.get('reference');
    const improvement = referenceParam
      ? store
          .select(aerVerificationSubmitQuery.selectRecommendedImprovements)()
          ?.recommendedImprovements?.find(({ reference }) => reference === referenceParam)
      : null;

    return formBuilder.group({
      explanation: formBuilder.control<string>(improvement?.explanation, [
        GovukValidators.required('Enter a recommended improvement for the maritime operator'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
      reference: formBuilder.control<string>(improvement?.reference),
    });
  },
};
