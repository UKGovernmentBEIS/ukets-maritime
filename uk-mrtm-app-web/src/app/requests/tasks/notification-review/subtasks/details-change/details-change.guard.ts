import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { nocReviewQuery } from '@requests/common/emp/+state/noc-review.selectors';
import {
  DetailsChangeWizardStep,
  isWizardCompleted,
} from '@requests/tasks/notification-review/subtasks/details-change';

export const canActivateDetailsChangeStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';

  const reviewDecision = store.select(nocReviewQuery.selectReviewDecision)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(reviewDecision) || change)) ||
    createUrlTreeFromSnapshot(route, [DetailsChangeWizardStep.SUMMARY])
  );
};

export const canActivateDetailsChangeSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const reviewDecision = store.select(nocReviewQuery.selectReviewDecision)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(reviewDecision)) ||
    createUrlTreeFromSnapshot(route, ['./', DetailsChangeWizardStep.REVIEW_DECISION])
  );
};
