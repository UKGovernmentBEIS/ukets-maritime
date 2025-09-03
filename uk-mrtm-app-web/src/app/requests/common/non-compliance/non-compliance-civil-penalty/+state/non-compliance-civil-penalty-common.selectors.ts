import { NonComplianceCivilPenaltyRequestTaskPayload } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK,
  NonComplianceCivilPenaltyUpload,
} from '@requests/common/non-compliance';
import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';

const selectPayload: StateSelector<RequestTaskState, NonComplianceCivilPenaltyRequestTaskPayload> =
  createDescendingSelector(
    requestTaskQuery.selectRequestTaskPayload,
    (payload) => payload as NonComplianceCivilPenaltyRequestTaskPayload,
  );

const selectIsFormEditable: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  requestTaskQuery.selectIsEditable,
  requestTaskQuery.selectAllowedRequestTaskActions,
  (isEditable, allowedRequestTaskActions) =>
    isEditable && allowedRequestTaskActions.includes('NON_COMPLIANCE_CIVIL_PENALTY_SAVE_APPLICATION'),
);

const selectStatusForUploadSubtask: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  nonComplianceCommonQuery.selectSectionsCompleted,
  (sectionsCompleted) => {
    const taskStatus = sectionsCompleted?.[NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK] as TaskItemStatus;
    return taskStatus ?? TaskItemStatus.NOT_STARTED;
  },
);

const selectIsUploadSubtaskCompleted: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectStatusForUploadSubtask,
  (status) => (status as TaskItemStatus) === TaskItemStatus.COMPLETED,
);

const selectNonComplianceCivilPenaltyUpload: StateSelector<RequestTaskState, NonComplianceCivilPenaltyUpload> =
  createDescendingSelector(selectPayload, (payload) => ({
    civilPenalty: payload?.civilPenalty,
    penaltyAmount: payload?.penaltyAmount,
    dueDate: payload?.dueDate,
    comments: payload?.comments,
    nonComplianceAttachments: payload?.nonComplianceAttachments,
  }));

export const nonComplianceCivilPenaltyCommonQuery = {
  selectPayload,
  selectIsFormEditable,
  selectStatusForUploadSubtask,
  selectIsUploadSubtaskCompleted,
  selectNonComplianceCivilPenaltyUpload,
};
