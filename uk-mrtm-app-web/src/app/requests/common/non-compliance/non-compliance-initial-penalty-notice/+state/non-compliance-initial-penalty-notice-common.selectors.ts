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
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, NonComplianceInitialPenaltyNoticeRequestTaskPayload> =
  createDescendingSelector(
    requestTaskQuery.selectRequestTaskPayload,
    (payload) => payload as NonComplianceInitialPenaltyNoticeRequestTaskPayload,
  );

const selectNonComplianceAttachments: StateSelector<
  RequestTaskState,
  NonComplianceInitialPenaltyNoticeRequestTaskPayload['nonComplianceAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload?.nonComplianceAttachments);

const selectAttachedFiles = (files?: string[]): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(
    requestTaskQuery.selectTasksDownloadUrl,
    selectNonComplianceAttachments,
    (downloadUrl, attachments) =>
      files?.map((id) => ({ downloadUrl: downloadUrl + id, fileName: attachments?.[id] })) ?? [],
  );

const selectSectionsCompleted: StateSelector<
  RequestTaskState,
  NonComplianceInitialPenaltyNoticeRequestTaskPayload['sectionsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted);

const selectStatusForSubtask = (subtask: string): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(selectSectionsCompleted, (sectionsCompleted) => {
    return (sectionsCompleted?.[subtask] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED;
  });
};

const selectStatusForUploadSubtask: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  selectSectionsCompleted,
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
  selectNonComplianceAttachments,
  selectAttachedFiles,
  selectSectionsCompleted,
  selectStatusForSubtask,
  selectStatusForUploadSubtask,
  selectIsUploadSubtaskCompleted,
  selectNonComplianceInitialPenaltyNoticeUpload,
};
