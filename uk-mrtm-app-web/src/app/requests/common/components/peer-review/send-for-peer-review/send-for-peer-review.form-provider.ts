import { FactoryProvider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';

export const sendForPeerReviewFormProvider: FactoryProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder],
  useFactory: (fb: UntypedFormBuilder) => {
    return fb.group({
      assignees: [null, GovukValidators.required('Select a peer reviewer')],
    });
  },
};
