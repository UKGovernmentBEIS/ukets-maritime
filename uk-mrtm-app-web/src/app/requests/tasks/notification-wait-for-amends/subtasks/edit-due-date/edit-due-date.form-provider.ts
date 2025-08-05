import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { waitForAmendsQuery } from '@requests/tasks/notification-wait-for-amends/+state';
import { futureDateValidator } from '@shared/validators';
import { afterGivenDateValidator } from '@shared/validators/after-given-date.validator';

export const editDueDateFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const currentDueDate = new Date(store.select(waitForAmendsQuery.selectFollowUpReviewDecisionDTO)().dueDate);

    return fb.group(
      {
        dueDate: fb.control(null, [
          GovukValidators.required('Enter a deadline'),
          futureDateValidator(),
          afterGivenDateValidator(currentDueDate, 'new due date', 'current due date'),
        ]),
      },
      { updateOn: 'change' },
    );
  },
};
