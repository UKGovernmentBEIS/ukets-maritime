import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import {
  SkipReviewFormGroupModel,
  SkipReviewFormModel,
} from '@requests/tasks/aer-review/subtasks/skip-review/skip-review-form/skip-review-form.types';

export const provideSkipReviewForm: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder],
  useFactory: (fb: FormBuilder): SkipReviewFormGroupModel =>
    fb.group({
      type: fb.control<SkipReviewFormModel['type'] | null>(null, {
        validators: GovukValidators.required('Select an option'),
      }),
      reason: fb.control<SkipReviewFormModel['reason'] | null>(null, {
        validators: [
          GovukValidators.required('Enter a reason'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      }),
    }),
};
