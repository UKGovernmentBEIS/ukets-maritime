import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { isNil } from 'lodash-es';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

export const canActivatePeerReviewDecision: CanActivateFn = () => {
  const store = inject(RequestTaskStore);
  const authStore = inject(AuthStore);
  const currentUserId = authStore.select(selectUserId)();
  const assigneeUserId = store.select(requestTaskQuery.selectAssigneeUserId)();

  return !isNil(currentUserId) && !isNil(assigneeUserId) && currentUserId === assigneeUserId;
};
