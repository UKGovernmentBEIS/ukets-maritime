import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { followUpQuery } from '@requests/tasks/notification-follow-up/+state';

export const canActivateConfirmComponent: CanActivateFn = () => {
  const store = inject(RequestTaskStore);
  return store.select(followUpQuery.selectPayload)().sectionsCompleted['followUpResponse'] === TaskItemStatus.COMPLETED;
};
