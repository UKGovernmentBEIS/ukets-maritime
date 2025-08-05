import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { followUpAmendQuery } from '@requests/tasks/notification-follow-up-amend/+state';
import { ResponseWizardStep } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.helper';
import { isWizardCompleted } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.wizard';

export const canActivateFollowUpResponseStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const payload = store.select(followUpAmendQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(payload) || change)) ||
    createUrlTreeFromSnapshot(route, [ResponseWizardStep.SUMMARY])
  );
};

export const canActivateFollowUpResponseSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const payload = store.select(followUpAmendQuery.selectPayload)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(payload)) ||
    createUrlTreeFromSnapshot(route, ['./', ResponseWizardStep.FOLLOW_UP_RESPONSE])
  );
};
