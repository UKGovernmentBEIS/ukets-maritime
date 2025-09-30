import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import {
  NonComplianceDetailsBase,
  NonComplianceUnionPayload,
} from '@requests/common/non-compliance/non-compliance.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, NonComplianceUnionPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as NonComplianceUnionPayload,
);

const selectNonComplianceAttachments: StateSelector<
  RequestTaskState,
  NonComplianceUnionPayload['nonComplianceAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload?.nonComplianceAttachments);

const selectAttachedFiles = (files?: string[]): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(
    requestTaskQuery.selectTasksDownloadUrl,
    selectNonComplianceAttachments,
    (downloadUrl, attachments) =>
      files?.map((id) => ({ downloadUrl: downloadUrl + id, fileName: attachments?.[id] })) ?? [],
  );

const selectSectionsCompleted: StateSelector<RequestTaskState, NonComplianceUnionPayload['sectionsCompleted']> =
  createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted);

const selectStatusForSubtask = (subtask: string): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(selectSectionsCompleted, (sectionsCompleted) => {
    return (sectionsCompleted?.[subtask] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED;
  });
};

const selectNonComplianceDetailsBase: StateSelector<RequestTaskState, NonComplianceDetailsBase> =
  createDescendingSelector(selectPayload, (payload) => ({
    reason: payload?.reason,
    nonComplianceDate: payload?.nonComplianceDate,
    complianceDate: payload?.complianceDate,
    nonComplianceComments: payload?.nonComplianceComments,
  }));

export const nonComplianceCommonQuery = {
  selectPayload,
  selectNonComplianceAttachments,
  selectAttachedFiles,
  selectSectionsCompleted,
  selectStatusForSubtask,
  selectNonComplianceDetailsBase,
};
