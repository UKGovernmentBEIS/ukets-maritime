import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empAmendQuery } from '@requests/common/emp/+state';

export const canActivateEmpAmendSendApplicationAction: CanActivateFn = (route) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const isEmpSectionCompleted = store.select(empAmendQuery.selectIsEmpSectionCompleted)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  return (isEmpSectionCompleted && isEditable) || createUrlTreeFromSnapshot(route, ['../../']);
};
