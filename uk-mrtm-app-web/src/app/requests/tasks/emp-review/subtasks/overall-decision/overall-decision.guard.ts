import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empReviewQuery } from '@requests/common/emp/+state';
import { OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';
import {
  isOverallDecisionAndReasonCompleted,
  isOverallDecisionCompleted,
} from '@requests/tasks/emp-review/subtasks/overall-decision';

export const canActivateOverallDecisionActions: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const determination = store.select(empReviewQuery.selectDetermination)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isOverallDecisionAndReasonCompleted(determination) || change)) ||
    createUrlTreeFromSnapshot(route, [OverallDecisionWizardStep.SUMMARY])
  );
};

export const canActivateOverallDecisionQuestion: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const determination = store.select(empReviewQuery.selectDetermination)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (isEditable && isOverallDecisionCompleted(determination)) {
    return true;
  }

  return (isEditable && change) || createUrlTreeFromSnapshot(route, [OverallDecisionWizardStep.SUMMARY]);
};

export const canActivateOverallDecisionSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const determination = store.select(empReviewQuery.selectDetermination)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isOverallDecisionAndReasonCompleted(determination)) ||
    createUrlTreeFromSnapshot(route, ['./', OverallDecisionWizardStep.OVERALL_DECISION_ACTIONS])
  );
};
