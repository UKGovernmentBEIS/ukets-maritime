import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { isNil } from 'lodash-es';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

export const canActivateProvideNoteRedirect: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const requestInfo = store.select(requestTaskQuery.selectRequestInfo)();

  return !isNil(requestInfo?.accountId) && !isNil(requestInfo?.id)
    ? createUrlTreeFromSnapshot(
        route.root,
        [`./accounts/${requestInfo?.accountId}/workflows/${requestInfo?.id}`],
        null,
        'notes',
      )
    : false;
};
