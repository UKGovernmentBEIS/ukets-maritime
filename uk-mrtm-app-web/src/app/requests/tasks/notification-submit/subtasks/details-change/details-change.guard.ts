import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { notificationQuery } from '@requests/tasks/notification-submit/+state';
import { DetailsChangeWizardStep } from '@requests/tasks/notification-submit/subtasks/details-change/details-change.helper';
import { isWizardCompleted } from '@requests/tasks/notification-submit/subtasks/details-change/details-change.wizard';

export const canActivateDetailsChangeStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const detailsOfChange = store.select(notificationQuery.selectDetailsOfChange)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(detailsOfChange) || change)) ||
    createUrlTreeFromSnapshot(route, [DetailsChangeWizardStep.SUMMARY])
  );
};

export const canActivateDetailsChangeSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const detailsOfChange = store.select(notificationQuery.selectDetailsOfChange)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(detailsOfChange)) ||
    createUrlTreeFromSnapshot(route, ['./', DetailsChangeWizardStep.NON_SIGNIFICANT_CHANGE])
  );
};
