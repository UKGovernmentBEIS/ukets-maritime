import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NonComplianceInitialPenaltyNoticeRequestTaskPayload } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { nonComplianceInitialPenaltyNoticeCommonQuery } from '@requests/common/non-compliance/non-compliance-initial-penalty-notice/+state';
import { TASK_FORM } from '@requests/common/task-form.token';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';

export const nonComplianceInitialPenaltyNoticeUploadFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, fileService: RequestTaskFileService) => {
    const nonComplianceInitialPenaltyNoticeUpload = store.select(
      nonComplianceInitialPenaltyNoticeCommonQuery.selectNonComplianceInitialPenaltyNoticeUpload,
    )();
    const nonComplianceAttachments = store.select(
      nonComplianceInitialPenaltyNoticeCommonQuery.selectNonComplianceAttachments,
    )();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

    return formBuilder.group({
      initialPenaltyNotice: fileService.buildFormControl(
        requestTaskId,
        nonComplianceInitialPenaltyNoticeUpload?.initialPenaltyNotice ?? null,
        nonComplianceAttachments,
        taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
        true,
        !isEditable,
      ),
      comments: formBuilder.control<NonComplianceInitialPenaltyNoticeRequestTaskPayload['comments']>(
        nonComplianceInitialPenaltyNoticeUpload?.comments ?? null,
        [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
      ),
    });
  },
};
