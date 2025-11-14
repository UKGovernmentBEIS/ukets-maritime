import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const uncorrectedMisstatementsItemFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, route: ActivatedRoute) => {
    const referenceParam = route.snapshot.paramMap.get('reference');
    const item = referenceParam
      ? store
          .select(aerVerificationSubmitQuery.selectUncorrectedMisstatements)()
          ?.uncorrectedMisstatements?.find(({ reference }) => reference === referenceParam)
      : null;

    return formBuilder.group({
      explanation: formBuilder.control<string>(item?.explanation, [
        GovukValidators.required('Enter an explanation for the uncorrected misstatement'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
      materialEffect: formBuilder.control<boolean>(item?.materialEffect, [
        GovukValidators.required('Select yes if this has a material effect on the total emissions reported'),
      ]),
      reference: formBuilder.control<string>(item?.reference),
    });
  },
};
