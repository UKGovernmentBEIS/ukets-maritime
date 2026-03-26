import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { isNil } from '@shared/utils';

export const canActivateProvideNoteRedirect: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const requestTaskWorkflowId = store.select(requestTaskQuery.selectRequestInfo)()?.id;
  const requestTaskAccountId = store.select(requestTaskQuery.selectRequestTaskAccountId)();

  return !isNil(requestTaskAccountId) && !isNil(requestTaskWorkflowId)
    ? createUrlTreeFromSnapshot(
        route.root,
        [`./accounts/${requestTaskAccountId}/workflows/${requestTaskWorkflowId}`],
        null,
        'notes',
      )
    : false;
};
