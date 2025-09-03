import { NonComplianceInitialPenaltyNoticeRequestTaskPayload } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK,
  NonComplianceInitialPenaltyNoticeUpload,
} from '@requests/common/non-compliance';
import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';

const selectPayload: StateSelector<RequestTaskState, NonComplianceInitialPenaltyNoticeRequestTaskPayload> =
  createDescendingSelector(
    requestTaskQuery.selectRequestTaskPayload,
    (payload) => payload as NonComplianceInitialPenaltyNoticeRequestTaskPayload,
  );

const selectIsFormEditable: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  requestTaskQuery.selectIsEditable,
  requestTaskQuery.selectAllowedRequestTaskActions,
  (isEditable, allowedRequestTaskActions) =>
    isEditable && allowedRequestTaskActions.includes('NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_SAVE_APPLICATION'),
);

const selectStatusForUploadSubtask: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  nonComplianceCommonQuery.selectSectionsCompleted,
  (sectionsCompleted) => {
    const taskStatus = sectionsCompleted?.[NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK] as TaskItemStatus;
    return taskStatus ?? TaskItemStatus.NOT_STARTED;
  },
);

const selectIsUploadSubtaskCompleted: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectStatusForUploadSubtask,
  (status) => (status as TaskItemStatus) === TaskItemStatus.COMPLETED,
);

const selectNonComplianceInitialPenaltyNoticeUpload: StateSelector<
  RequestTaskState,
  NonComplianceInitialPenaltyNoticeUpload
> = createDescendingSelector(selectPayload, (payload) => ({
  initialPenaltyNotice: payload?.initialPenaltyNotice,
  comments: payload?.comments,
  nonComplianceAttachments: payload?.nonComplianceAttachments,
}));

export const nonComplianceInitialPenaltyNoticeCommonQuery = {
  selectPayload,
  selectIsFormEditable,
  selectStatusForUploadSubtask,
  selectIsUploadSubtaskCompleted,
  selectNonComplianceInitialPenaltyNoticeUpload,
};
