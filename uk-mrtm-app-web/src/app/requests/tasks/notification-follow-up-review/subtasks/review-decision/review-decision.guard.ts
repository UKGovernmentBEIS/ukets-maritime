import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { followUpReviewQuery } from '@requests/tasks/notification-follow-up-review/+state';
import {
  isWizardCompleted,
  ReviewDecisionWizardStep,
} from '@requests/tasks/notification-follow-up-review/subtasks/review-decision';

export const canActivateReviewDecisionStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';

  const reviewDecision = store.select(followUpReviewQuery.selectReviewDecision)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(reviewDecision) || change)) ||
    createUrlTreeFromSnapshot(route, [ReviewDecisionWizardStep.SUMMARY])
  );
};

export const canActivateReviewDecisionSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const reviewDecision = store.select(followUpReviewQuery.selectReviewDecision)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(reviewDecision)) ||
    createUrlTreeFromSnapshot(route, ['./', ReviewDecisionWizardStep.REVIEW_DECISION_QUESTION])
  );
};
