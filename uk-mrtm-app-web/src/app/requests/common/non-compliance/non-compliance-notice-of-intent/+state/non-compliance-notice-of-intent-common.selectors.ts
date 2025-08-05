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
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, NonComplianceNoticeOfIntentRequestTaskPayload> =
  createDescendingSelector(
    requestTaskQuery.selectRequestTaskPayload,
    (payload) => payload as NonComplianceNoticeOfIntentRequestTaskPayload,
  );

const selectNonComplianceAttachments: StateSelector<
  RequestTaskState,
  NonComplianceNoticeOfIntentRequestTaskPayload['nonComplianceAttachments']
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
  NonComplianceNoticeOfIntentRequestTaskPayload['sectionsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted);

const selectStatusForSubtask = (subtask: string): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(selectSectionsCompleted, (sectionsCompleted) => {
    return (sectionsCompleted?.[subtask] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED;
  });
};

const selectStatusForUploadSubtask: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  selectSectionsCompleted,
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
  selectNonComplianceAttachments,
  selectAttachedFiles,
  selectSectionsCompleted,
  selectStatusForSubtask,
  selectStatusForUploadSubtask,
  selectIsUploadSubtaskCompleted,
  selectNonComplianceNoticeOfIntentUpload,
};
