import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empVariationReviewQuery } from '@requests/common/emp/+state';
import { TASK_FORM } from '@requests/common/task-form.token';

export const overallDecisionVariationLogFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: FormBuilder, store: RequestTaskStore) => {
    const determination = store.select(empVariationReviewQuery.selectDetermination)();

    return fb.group({
      summary: fb.control<string | null>(determination?.summary ?? null, {
        validators: [
          GovukValidators.required('Enter a summary'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      }),
    });
  },
};
