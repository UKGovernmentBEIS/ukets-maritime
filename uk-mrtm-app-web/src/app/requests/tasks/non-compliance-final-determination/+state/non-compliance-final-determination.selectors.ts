import { NonComplianceFinalDetermination } from '@mrtm/api';

import { createDescendingSelector, requestTaskQuery, RequestTaskState, StateSelector } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK,
  NonComplianceFinalDeterminationTaskPayload,
} from '@requests/common/non-compliance';
import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';

const selectPayload: StateSelector<RequestTaskState, NonComplianceFinalDeterminationTaskPayload> =
  createDescendingSelector(
    requestTaskQuery.selectRequestTaskPayload,
    (payload) => payload as NonComplianceFinalDeterminationTaskPayload,
  );

const selectStatusForDetailsSubtask: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  nonComplianceCommonQuery.selectSectionsCompleted,
  (sectionsCompleted) => {
    const taskStatus = sectionsCompleted?.[NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK] as TaskItemStatus;
    return taskStatus ?? TaskItemStatus.NOT_STARTED;
  },
);

const selectIsDetailsSubtaskCompleted: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectStatusForDetailsSubtask,
  (status) => (status as TaskItemStatus) === TaskItemStatus.COMPLETED,
);

const selectNonComplianceFinalDetermination: StateSelector<RequestTaskState, NonComplianceFinalDetermination> =
  createDescendingSelector(selectPayload, (payload) => ({
    complianceRestored: payload.complianceRestored,
    complianceRestoredDate: payload.complianceRestoredDate,
    comments: payload.comments,
    reissuePenalty: payload.reissuePenalty,
    operatorPaid: payload.operatorPaid,
    operatorPaidDate: payload.operatorPaidDate,
  }));

export const nonComplianceFinalDeterminationQuery = {
  selectPayload,
  selectStatusForDetailsSubtask,
  selectIsDetailsSubtaskCompleted,
  selectNonComplianceFinalDetermination,
};
