import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_REVIEW_TASK } from '@requests/tasks/aer-review/aer-review.constants';

export const canActivateAerReviewSubtasks: CanActivateFn = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return AER_REVIEW_TASK.includes(requestTaskType) || createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../']);
};

export const canActivateAerReviewReportingObligation: CanActivateFn = (activatedRoute) => {
  const store = inject(RequestTaskStore);
  const hasReportingObligation = store.select(aerCommonQuery.selectReportingRequired)();

  return !hasReportingObligation || createUrlTreeFromSnapshot(activatedRoute, ['../../']);
};

export const canActivateAerReviewOperatorsOrVerifiersSubtasks: CanActivateFn = (activatedRoute) => {
  const store = inject(RequestTaskStore);
  const hasReportingObligation = store.select(aerCommonQuery.selectReportingRequired)();

  return hasReportingObligation || createUrlTreeFromSnapshot(activatedRoute, ['../../']);
};
