import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { followUpReviewQuery } from '@requests/tasks/notification-follow-up-review/+state';
import { REVIEW_DECISION_SUB_TASK } from '@requests/tasks/notification-follow-up-review/subtasks/review-decision';

export const canActivateReturnForAmends: CanActivateFn = (route) => {
  return commonActivateFunctionality(route, TaskItemStatus.AMENDS_NEEDED);
};

export const canActivateNotifyOperator: CanActivateFn = (route) => {
  return commonActivateFunctionality(route, TaskItemStatus.ACCEPTED);
};

const commonActivateFunctionality = (route: ActivatedRouteSnapshot, targetStatus: TaskItemStatus) => {
  const store = inject(RequestTaskStore);
  return (
    (store.select(followUpReviewQuery.selectIsSubtaskCompleted(REVIEW_DECISION_SUB_TASK))() &&
      store.select(followUpReviewQuery.selectStatusForSubtask(REVIEW_DECISION_SUB_TASK))() === targetStatus) ||
    createUrlTreeFromSnapshot(route, ['../../'])
  );
};
