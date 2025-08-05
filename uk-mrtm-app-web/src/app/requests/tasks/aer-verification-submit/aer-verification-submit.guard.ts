import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { getCanSubmitAerVerification } from '@requests/tasks/aer-verification-submit/aer-verification-submit.helpers';

export const canActivateAerVerificationSubmitSendReportAction: CanActivateFn = (route) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const canSubmitAer = getCanSubmitAerVerification();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  return (canSubmitAer && isEditable) || createUrlTreeFromSnapshot(route, ['../../']);
};
