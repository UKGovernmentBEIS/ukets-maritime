import { EmissionsMonitoringPlan } from '@mrtm/api';

import { createAggregateSelector, createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state/emp-common.selectors';
import { empReviewQuery } from '@requests/common/emp/+state/emp-review.selectors';
import { REQUESTED_CHANGES_SUB_TASK } from '@requests/common/emp/subtasks/requested-changes';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { TaskItemStatus } from '@requests/common/task-item-status';

const selectStatusForSubtask = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(
    empCommonQuery.selectEmpSectionsCompleted,
    (completed) => (completed?.[subtask] ?? TaskItemStatus.COMPLETED) as TaskItemStatus,
  );

const selectStatusForRequestedChangesSubtask: StateSelector<RequestTaskState, TaskItemStatus> =
  createDescendingSelector(
    empCommonQuery.selectEmpSectionsCompleted,
    (completed) => (completed?.[REQUESTED_CHANGES_SUB_TASK] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED,
  );

const selectIsChangesRequestedForSection = (
  subtask: keyof EmissionsMonitoringPlan | string,
): StateSelector<RequestTaskState, boolean> =>
  createDescendingSelector(empReviewQuery.selectReviewGroupDecisions, (decisions) => {
    const group = subtaskReviewGroupMap[subtask];
    const reviewGroupDecision = decisions?.[group];
    return reviewGroupDecision?.type === 'OPERATOR_AMENDS_NEEDED';
  });

export const selectIsEmpSectionCompleted: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  empCommonQuery.selectEmpSectionsCompleted,
  selectStatusForRequestedChangesSubtask,
  (completed, requestedChangesStatus) => {
    if (requestedChangesStatus !== TaskItemStatus.COMPLETED) {
      return false;
    }

    const sections: Array<keyof EmissionsMonitoringPlan> = [
      'operatorDetails',
      'emissions',
      'sources',
      'greenhouseGas',
      'dataGaps',
      'managementProcedures',
      'controlActivities',
      'abbreviations',
      'additionalDocuments',
    ];

    for (const key of sections) {
      const subtaskStatus = completed[key] as TaskItemStatus;

      if (
        subtaskStatus === TaskItemStatus.OPERATOR_AMENDS_NEEDED ||
        ([TaskItemStatus.NOT_STARTED, TaskItemStatus.IN_PROGRESS, TaskItemStatus.COMPLETED].includes(subtaskStatus) &&
          subtaskStatus !== TaskItemStatus.COMPLETED)
      ) {
        return false;
      }
    }

    return true;
  },
);

export const empAmendQuery = {
  selectStatusForSubtask,
  selectStatusForRequestedChangesSubtask,
  selectIsChangesRequestedForSection,
  selectIsEmpSectionCompleted,
};
