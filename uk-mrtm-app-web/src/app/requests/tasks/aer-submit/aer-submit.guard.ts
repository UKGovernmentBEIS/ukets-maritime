import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { getCanSubmitAer } from '@requests/tasks/aer-submit/aer-submit.helpers';

export const canActivateAerSubmitSendReportAction: CanActivateFn = (route) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const canSubmitAer = getCanSubmitAer();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  return (canSubmitAer && isEditable) || createUrlTreeFromSnapshot(route, ['../../']);
};
