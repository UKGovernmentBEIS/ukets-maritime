import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const canActivateAerTotalEmissionsSubtask: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const status = store.select(aerCommonQuery.selectStatusForTotalEmissions)();

  return status !== TaskItemStatus.CANNOT_START_YET || createUrlTreeFromSnapshot(route, ['../']);
};
