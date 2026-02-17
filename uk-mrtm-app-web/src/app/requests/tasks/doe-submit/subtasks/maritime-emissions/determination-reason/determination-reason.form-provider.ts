import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DoeDeterminationReason } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { doeSubmitQuery } from '@requests/tasks/doe-submit/+state';

export const determinationReasonFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: FormBuilder, store: RequestTaskStore): FormGroup => {
    const determinationReason = store.select(doeSubmitQuery.selectDeterminationReason)();

    return fb.group({
      details: fb.group({
        type: fb.control<DoeDeterminationReason['details']['type']>(determinationReason?.details?.type ?? null, {
          validators: [
            GovukValidators.required(
              'Select why are you determining the maritime emissions or emissions figure for surrender',
            ),
          ],
        }),
        noticeText: fb.control<DoeDeterminationReason['details']['noticeText']>(
          { value: determinationReason?.details?.noticeText ?? null, disabled: !determinationReason?.details?.type },
          {
            validators: [
              GovukValidators.required('Enter a notice text'),
              GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
            ],
          },
        ),
      }),
      furtherDetails: fb.control<DoeDeterminationReason['furtherDetails']>(
        determinationReason?.furtherDetails ?? null,
        { validators: [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')] },
      ),
    });
  },
};
