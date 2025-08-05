import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot, UrlTree } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

export const canActivateRfiOrRdeRequestGuard =
  (redirectPath: string): CanActivateFn =>
  (route: ActivatedRouteSnapshot): UrlTree | boolean => {
    const taskStore = inject(RequestTaskStore);
    const relatedTasks = taskStore.select(requestTaskQuery.selectRelatedTasks)();

    return relatedTasks.find((task) =>
      ['_WAIT_FOR_RDE_RESPONSE', '_WAIT_FOR_RFI_RESPONSE']
        .map((suffix) => task.taskType.endsWith(suffix))
        .includes(true),
    )
      ? createUrlTreeFromSnapshot(route, [redirectPath])
      : true;
  };
