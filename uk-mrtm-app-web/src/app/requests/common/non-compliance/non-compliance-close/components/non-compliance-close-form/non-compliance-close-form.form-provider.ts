import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NonComplianceCloseJustification } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';
import { TASK_FORM } from '@requests/common/task-form.token';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';

export const nonComplianceCloseFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, fileService: RequestTaskFileService) => {
    const nonComplianceAttachments = store.select(nonComplianceCommonQuery.selectNonComplianceAttachments)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

    return formBuilder.group({
      reason: formBuilder.control<NonComplianceCloseJustification['reason']>(null, [
        GovukValidators.required('Explain why you are closing this task'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
      files: fileService.buildFormControl(
        requestTaskId,
        [],
        nonComplianceAttachments,
        taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
        false,
        !isEditable,
      ),
    });
  },
};
