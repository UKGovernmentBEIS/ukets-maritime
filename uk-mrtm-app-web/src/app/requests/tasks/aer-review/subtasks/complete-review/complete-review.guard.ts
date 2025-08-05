import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { aerReviewQuery } from '@requests/tasks/aer-review/+state';

export const canActivateCompleteReview: CanActivateFn = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const canCompleteReport = store.select(aerReviewQuery.selectCanCompleteReport)();

  return canCompleteReport || createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../../']);
};
