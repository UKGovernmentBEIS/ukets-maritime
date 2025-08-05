import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

export const canActivateSkipReview: CanActivateFn = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const allowedActions = store.select(requestTaskQuery.selectAllowedRequestTaskActions)();

  return allowedActions.includes('AER_COMPLETE_REVIEW') || createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../']);
};
