import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';

export const canActivateGuardedAerSubtask: CanActivateFn = (route) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const hasReportingObligation = store.select(aerCommonQuery.selectHasReportingObligation)();
  return hasReportingObligation || createUrlTreeFromSnapshot(route, ['../../']);
};
