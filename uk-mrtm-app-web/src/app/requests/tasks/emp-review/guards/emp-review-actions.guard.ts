import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskState, RequestTaskStore, StateSelector } from '@netz/common/store';

import { empReviewQuery } from '@requests/common/emp/+state';

const canActivateAction = (selector: StateSelector<RequestTaskState, boolean>, route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);

  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const hasAccess = store.select(selector)();

  return (isEditable && hasAccess) || createUrlTreeFromSnapshot(route, ['../../']);
};

export const canActivateEmpReviewActions: CanActivateFn = (route) =>
  canActivateAction(empReviewQuery.selectIsOverallDecisionCompleted, route);

export const canActivateEmpReviewOperatorAmendsAction = (route) =>
  canActivateAction(empReviewQuery.selectAnySubtaskNeedsAmend, route);
