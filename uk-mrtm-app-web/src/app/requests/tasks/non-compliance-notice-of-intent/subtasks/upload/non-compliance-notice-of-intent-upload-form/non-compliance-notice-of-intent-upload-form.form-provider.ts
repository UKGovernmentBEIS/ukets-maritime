import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NonComplianceNoticeOfIntentRequestTaskPayload } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';
import { nonComplianceNoticeOfIntentCommonQuery } from '@requests/common/non-compliance/non-compliance-notice-of-intent/+state';
import { TASK_FORM } from '@requests/common/task-form.token';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';

export const nonComplianceNoticeOfIntentUploadFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, fileService: RequestTaskFileService) => {
    const nonComplianceNoticeOfIntentUpload = store.select(
      nonComplianceNoticeOfIntentCommonQuery.selectNonComplianceNoticeOfIntentUpload,
    )();
    const nonComplianceAttachments = store.select(nonComplianceCommonQuery.selectNonComplianceAttachments)();
    const isEditable = store.select(nonComplianceNoticeOfIntentCommonQuery.selectIsFormEditable)();
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

    return formBuilder.group({
      noticeOfIntent: fileService.buildFormControl(
        requestTaskId,
        nonComplianceNoticeOfIntentUpload?.noticeOfIntent ?? null,
        nonComplianceAttachments,
        taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
        true,
        !isEditable,
      ),
      comments: formBuilder.control<NonComplianceNoticeOfIntentRequestTaskPayload['comments']>(
        nonComplianceNoticeOfIntentUpload?.comments ?? null,
        [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
      ),
    });
  },
};
