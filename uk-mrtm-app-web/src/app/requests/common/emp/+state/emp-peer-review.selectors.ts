import { createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpPeerReviewTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const selectDecision: StateSelector<RequestTaskState, EmpPeerReviewTaskPayload['decision']> =
  createDescendingSelector(empCommonQuery.selectPayload<EmpPeerReviewTaskPayload>(), (payload) => payload?.decision);

export const selectPeerReviewStatus = (key: string): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(
    empCommonQuery.selectEmpSectionsCompleted,
    (completed) => (completed?.[key] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED,
  );

export const empPeerReviewQuery = {
  selectDecision,
  selectPeerReviewStatus,
};
