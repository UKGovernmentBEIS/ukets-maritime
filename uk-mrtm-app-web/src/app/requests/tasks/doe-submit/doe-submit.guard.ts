import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { doeCommonQuery } from '@requests/common/doe';

export const canActivateSubmitActions: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const completed = store.select(doeCommonQuery.selectIsSubtaskCompleted('maritimeEmissions'))();

  return (isEditable && completed) || createUrlTreeFromSnapshot(route, ['../../']);
};
