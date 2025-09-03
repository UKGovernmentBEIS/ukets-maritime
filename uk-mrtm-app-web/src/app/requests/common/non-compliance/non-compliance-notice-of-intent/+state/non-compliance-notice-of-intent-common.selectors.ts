import { NonComplianceNoticeOfIntentRequestTaskPayload } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK,
  NonComplianceNoticeOfIntentUpload,
} from '@requests/common/non-compliance';
import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';

const selectPayload: StateSelector<RequestTaskState, NonComplianceNoticeOfIntentRequestTaskPayload> =
  createDescendingSelector(
    requestTaskQuery.selectRequestTaskPayload,
    (payload) => payload as NonComplianceNoticeOfIntentRequestTaskPayload,
  );

const selectIsFormEditable: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  requestTaskQuery.selectIsEditable,
  requestTaskQuery.selectAllowedRequestTaskActions,
  (isEditable, allowedRequestTaskActions) =>
    isEditable && allowedRequestTaskActions.includes('NON_COMPLIANCE_NOTICE_OF_INTENT_SAVE_APPLICATION'),
);

const selectStatusForUploadSubtask: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  nonComplianceCommonQuery.selectSectionsCompleted,
  (sectionsCompleted) => {
    const taskStatus = sectionsCompleted?.[NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK] as TaskItemStatus;
    return taskStatus ?? TaskItemStatus.NOT_STARTED;
  },
);

const selectIsUploadSubtaskCompleted: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectStatusForUploadSubtask,
  (status) => (status as TaskItemStatus) === TaskItemStatus.COMPLETED,
);

const selectNonComplianceNoticeOfIntentUpload: StateSelector<RequestTaskState, NonComplianceNoticeOfIntentUpload> =
  createDescendingSelector(selectPayload, (payload) => ({
    noticeOfIntent: payload?.noticeOfIntent,
    comments: payload?.comments,
    nonComplianceAttachments: payload?.nonComplianceAttachments,
  }));

export const nonComplianceNoticeOfIntentCommonQuery = {
  selectPayload,
  selectIsFormEditable,
  selectStatusForUploadSubtask,
  selectIsUploadSubtaskCompleted,
  selectNonComplianceNoticeOfIntentUpload,
};
