import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';

export const canActivateEmpSubmitSendApplicationAction: CanActivateFn = (route) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const isEmpSectionCompleted = store.select(empCommonQuery.selectIsEmpSectionCompleted)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  return (isEmpSectionCompleted && isEditable) || createUrlTreeFromSnapshot(route, ['../../']);
};
