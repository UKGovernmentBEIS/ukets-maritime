import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { empVariationReviewQuery } from '@requests/common/emp/+state';

export const canActivateEmpVariationReviewActions: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);

  const hasAccess = store.select(empVariationReviewQuery.selectIsOverallDecisionCompleted)();

  if (!hasAccess) {
    return createUrlTreeFromSnapshot(route, ['../../']);
  }

  return true;
};
