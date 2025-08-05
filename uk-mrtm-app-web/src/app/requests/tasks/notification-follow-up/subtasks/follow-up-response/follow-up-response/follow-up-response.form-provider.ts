import { inject } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { followUpQuery } from '@requests/tasks/notification-follow-up/+state';
import { RequestTaskFileService } from '@shared/services';

export const followUpResponseFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const fileService = inject(RequestTaskFileService);
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const payload = store.select(followUpQuery.selectPayload)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    return fb.group(
      {
        response: fb.control(payload?.followUpResponse ?? null, [
          GovukValidators.required('Enter a response'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ]),
        files: fileService.buildFormControl(
          requestTaskId,
          payload?.followUpFiles ?? [],
          payload?.followUpAttachments,
          'EMP_NOTIFICATION_FOLLOW_UP_UPLOAD_ATTACHMENT',
          false,
          !isEditable,
        ),
      },
      { updateOn: 'change' },
    );
  },
};
