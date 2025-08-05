import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NonComplianceDetails,
  NonComplianceDetailsSummary,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, NonComplianceSubmitTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as NonComplianceSubmitTaskPayload,
);

const selectNonComplianceAttachments: StateSelector<
  RequestTaskState,
  NonComplianceSubmitTaskPayload['nonComplianceAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload?.nonComplianceAttachments);

const selectAttachedFiles = (files?: string[]): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(
    requestTaskQuery.selectTasksDownloadUrl,
    selectNonComplianceAttachments,
    (downloadUrl, attachments) =>
      files?.map((id) => ({ downloadUrl: downloadUrl + id, fileName: attachments?.[id] })) ?? [],
  );

const selectSectionsCompleted: StateSelector<RequestTaskState, NonComplianceSubmitTaskPayload['sectionsCompleted']> =
  createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted);

const selectStatusForDetailsSubtask: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  selectSectionsCompleted,
  (sectionsCompleted) => {
    const taskStatus = sectionsCompleted?.[NON_COMPLIANCE_DETAILS_SUB_TASK] as TaskItemStatus;
    return taskStatus ?? TaskItemStatus.NOT_STARTED;
  },
);

const selectIsDetailsSubtaskCompleted: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectStatusForDetailsSubtask,
  (status) => (status as TaskItemStatus) === TaskItemStatus.COMPLETED,
);

const selectNonComplianceDetails: StateSelector<RequestTaskState, NonComplianceDetails> = createDescendingSelector(
  selectPayload,
  (payload) => ({
    reason: payload.reason,
    nonComplianceDate: payload.nonComplianceDate,
    complianceDate: payload.complianceDate,
    comments: payload.comments,
    availableRequests: payload.availableRequests,
    selectedRequests: payload.selectedRequests,
    civilPenalty: payload.civilPenalty,
    noCivilPenaltyJustification: payload.noCivilPenaltyJustification,
    noticeOfIntent: payload.noticeOfIntent,
    initialPenalty: payload.initialPenalty,
  }),
);

const selectNonComplianceDetailsSummary: StateSelector<RequestTaskState, NonComplianceDetailsSummary> =
  createDescendingSelector(selectPayload, (payload) => ({
    reason: payload.reason,
    nonComplianceDate: payload.nonComplianceDate,
    complianceDate: payload.complianceDate,
    comments: payload.comments,
    selectedRequestsMapped: payload.selectedRequests?.map((selectedId) =>
      payload.availableRequests.find(({ id }) => id === selectedId),
    ),
    civilPenalty: payload.civilPenalty,
    noCivilPenaltyJustification: payload.noCivilPenaltyJustification,
    noticeOfIntent: payload.noticeOfIntent,
    initialPenalty: payload.initialPenalty,
  }));

export const nonComplianceSubmitQuery = {
  selectPayload,
  selectNonComplianceAttachments,
  selectAttachedFiles,
  selectSectionsCompleted,
  selectStatusForDetailsSubtask,
  selectIsDetailsSubtaskCompleted,
  selectNonComplianceDetails,
  selectNonComplianceDetailsSummary,
};
