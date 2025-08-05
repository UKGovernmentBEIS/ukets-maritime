import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { REQUESTED_CHANGES_SUB_TASK } from '@requests/common/emp/subtasks/requested-changes';
import { RequestedChangesQuestionFormModel } from '@requests/common/emp/subtasks/requested-changes/requested-changes-question/requested-changes-question.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const requestedChangesQuestionComponentFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: FormBuilder, store: RequestTaskStore): FormGroup<RequestedChangesQuestionFormModel> => {
    const status = store.select(empCommonQuery.selectStatusForSubtask(REQUESTED_CHANGES_SUB_TASK))();

    return fb.group({
      accepted: fb.control<RequestedChangesQuestionFormModel['accepted'] | null>(
        (status === TaskItemStatus.COMPLETED ? [undefined] : null) as any,
        {
          validators: [
            GovukValidators.required('Check the box to confirm you have made changes and want to mark as complete'),
          ],
        },
      ),
    });
  },
};
