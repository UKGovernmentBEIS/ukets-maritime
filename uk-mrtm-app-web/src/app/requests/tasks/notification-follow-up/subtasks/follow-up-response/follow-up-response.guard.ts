import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { followUpQuery } from '@requests/tasks/notification-follow-up/+state';
import { FollowUpResponseWizardStep } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.helper';
import { isWizardCompleted } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.wizard';
import { DetailsChangeWizardStep } from '@requests/tasks/notification-submit/subtasks/details-change/details-change.helper';

export const canActivateFollowUpResponseStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const payload = store.select(followUpQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(payload) || change)) ||
    createUrlTreeFromSnapshot(route, [DetailsChangeWizardStep.SUMMARY])
  );
};

export const canActivateFollowUpResponseSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const payload = store.select(followUpQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(payload)) ||
    createUrlTreeFromSnapshot(route, ['./', FollowUpResponseWizardStep.FOLLOW_UP_RESPONSE])
  );
};
