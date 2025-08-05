import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TaskItemStatus } from '@requests/common';
import { TASK_FORM } from '@requests/common/task-form.token';
import { followUpAmendQuery } from '@requests/tasks/notification-follow-up-amend/+state';
import { AMENDS_DETAILS_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/amends-details/amends-details.helper';

export const amendsDetailsFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    return fb.group(
      {
        changesComplete: fb.control(
          store.select(followUpAmendQuery.selectStatusForSubtask(AMENDS_DETAILS_SUB_TASK))() ===
            TaskItemStatus.COMPLETED
            ? [true]
            : null,
          [GovukValidators.required('Check the box to confirm you have made changes')],
        ),
      },
      { updateOn: 'change' },
    );
  },
};
