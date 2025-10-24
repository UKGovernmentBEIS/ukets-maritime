import { EmissionsMonitoringPlan } from '@mrtm/api';

import { createAggregateSelector, createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state/emp-common.selectors';
import { EmpVariationAmendTaskPayload } from '@requests/common/emp/emp.types';
import { EMP_SUBTASKS } from '@requests/common/emp/emp-subtasks.constant';
import { REQUESTED_CHANGES_SUB_TASK } from '@requests/common/emp/subtasks/requested-changes';
import { TaskItemStatus } from '@requests/common/task-item-status';

const selectStatusForSubtask = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(
    empCommonQuery.selectEmpSectionsCompleted,
    (completed) => (completed?.[subtask] ?? TaskItemStatus.COMPLETED) as TaskItemStatus,
  );

const selectStatusForRequestChanges: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  empCommonQuery.selectEmpSectionsCompleted,
  (completed) => {
    return (completed?.[REQUESTED_CHANGES_SUB_TASK] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED;
  },
);

const selectStatusForVariationDetails: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationAmendTaskPayload>(),
  (payload) => {
    return payload?.empVariationDetailsReviewDecision?.type === 'OPERATOR_AMENDS_NEEDED' &&
      ![TaskItemStatus.IN_PROGRESS, TaskItemStatus.NOT_STARTED, TaskItemStatus.COMPLETED].includes(
        payload?.empVariationDetailsCompleted as TaskItemStatus,
      )
      ? TaskItemStatus.NOT_STARTED
      : (payload?.empVariationDetailsCompleted as TaskItemStatus);
  },
);

const selectIsEmpSectionCompleted: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  empCommonQuery.selectEmpSectionsCompleted,
  selectStatusForVariationDetails,
  (completed, variationDetailsStatus) => {
    if (
      variationDetailsStatus !== TaskItemStatus.COMPLETED ||
      completed?.[REQUESTED_CHANGES_SUB_TASK] !== TaskItemStatus.COMPLETED
    ) {
      return false;
    }

    for (const key of EMP_SUBTASKS) {
      const subtaskStatus = completed[key] as TaskItemStatus;

      if (
        subtaskStatus === TaskItemStatus.OPERATOR_AMENDS_NEEDED ||
        ([TaskItemStatus.NOT_STARTED, TaskItemStatus.IN_PROGRESS, TaskItemStatus.NEEDS_REVIEW].includes(
          subtaskStatus,
        ) &&
          subtaskStatus !== TaskItemStatus.COMPLETED)
      ) {
        return false;
      }
    }

    return true;
  },
);

const selectIsChangesRequestedForVariationDetails: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationAmendTaskPayload>(),
  (payload) => payload?.empVariationDetailsReviewDecision?.type === 'OPERATOR_AMENDS_NEEDED',
);

export const empVariationAmendsQuery = {
  selectStatusForSubtask,
  selectStatusForRequestChanges,
  selectIsEmpSectionCompleted,
  selectStatusForVariationDetails,
  selectIsChangesRequestedForVariationDetails,
};
