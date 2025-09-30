import { createDescendingSelector, requestTaskQuery, RequestTaskState, StateSelector } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NonComplianceDetails,
  NonComplianceDetailsSummary,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance';
import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';

const selectPayload: StateSelector<RequestTaskState, NonComplianceSubmitTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as NonComplianceSubmitTaskPayload,
);

const selectStatusForDetailsSubtask: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  nonComplianceCommonQuery.selectSectionsCompleted,
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
    reason: payload?.reason,
    nonComplianceDate: payload?.nonComplianceDate,
    complianceDate: payload?.complianceDate,
    nonComplianceComments: payload?.nonComplianceComments,
    availableRequests: payload?.availableRequests,
    selectedRequests: payload?.selectedRequests,
    civilPenalty: payload?.civilPenalty,
    noCivilPenaltyJustification: payload?.noCivilPenaltyJustification,
    noticeOfIntent: payload?.noticeOfIntent,
    initialPenalty: payload?.initialPenalty,
  }),
);

const selectNonComplianceDetailsSummary: StateSelector<RequestTaskState, NonComplianceDetailsSummary> =
  createDescendingSelector(selectPayload, (payload) => ({
    reason: payload?.reason,
    nonComplianceDate: payload?.nonComplianceDate,
    complianceDate: payload?.complianceDate,
    nonComplianceComments: payload?.nonComplianceComments,
    selectedRequestsMapped: payload?.selectedRequests?.map((selectedId) =>
      payload?.availableRequests.find(({ id }) => id === selectedId),
    ),
    civilPenalty: payload?.civilPenalty,
    noCivilPenaltyJustification: payload?.noCivilPenaltyJustification,
    noticeOfIntent: payload?.noticeOfIntent,
    initialPenalty: payload?.initialPenalty,
  }));

export const nonComplianceSubmitQuery = {
  selectPayload,
  selectStatusForDetailsSubtask,
  selectIsDetailsSubtaskCompleted,
  selectNonComplianceDetails,
  selectNonComplianceDetailsSummary,
};
