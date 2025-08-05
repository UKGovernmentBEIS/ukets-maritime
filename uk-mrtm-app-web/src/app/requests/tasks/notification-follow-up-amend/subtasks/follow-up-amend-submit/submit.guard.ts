import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { followUpAmendQuery } from '@requests/tasks/notification-follow-up-amend/+state';
import { SUBMIT_TO_REGULATOR_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-amend-submit/submit.helper';

export const canActivateConfirmComponent: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const submitToRegulatorStatus = store.select(
    followUpAmendQuery.selectStatusForSubtask(SUBMIT_TO_REGULATOR_SUB_TASK),
  )();
  return submitToRegulatorStatus !== TaskItemStatus.CANNOT_START_YET || createUrlTreeFromSnapshot(route, ['../../']);
};
