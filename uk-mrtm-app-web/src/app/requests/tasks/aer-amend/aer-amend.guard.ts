import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { getCanSubmitAmendAer } from '@requests/tasks/aer-amend/aer-amend.helpers';

export const canActivateAerAmendSendReportAction: CanActivateFn = (route) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const canSubmitAmendAer = getCanSubmitAmendAer();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (canSubmitAmendAer && isEditable) || createUrlTreeFromSnapshot(route, ['../../']);
};
