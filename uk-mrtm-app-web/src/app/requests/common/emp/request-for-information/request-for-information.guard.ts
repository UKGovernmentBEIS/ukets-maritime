import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, createUrlTreeFromSnapshot, Router, UrlTree } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { rfiQuery } from '@requests/common/emp/request-for-information/+state';
import {
  RFI_TASK_NAME,
  RfiWizardSteps,
} from '@requests/common/emp/request-for-information/request-for-information.consts';
import {
  isRfiFormCompleted,
  isRfiSubmitCompleted,
} from '@requests/common/emp/request-for-information/request-for-information.helpers';
import { RequestForInformationStore } from '@requests/common/emp/request-for-information/services';

export const canActivateRfiSubmit = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const taskStore = inject(RequestTaskStore);
  const taskActions = taskStore.select(requestTaskQuery.selectAllowedRequestTaskActions)();

  if (!taskActions.includes(RFI_TASK_NAME)) {
    return createUrlTreeFromSnapshot(route, ['../']);
  }

  return true;
};

export const canDeactivateRdeSubmit: CanDeactivateFn<unknown> = () => {
  inject(RequestForInformationStore).reset();
  return true;
};

export const canActivateRfiNotificationForm = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const rfiStore = inject(RequestForInformationStore);

  const rfiPayload = rfiStore.select(rfiQuery.selectRfi)();

  if (!isRfiFormCompleted(rfiPayload)) {
    return createUrlTreeFromSnapshot(route, [RfiWizardSteps.SUMMARY]);
  }

  return true;
};

export const canActivateRfiSummary = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const rfiStore = inject(RequestForInformationStore);

  const rfiPayload = rfiStore.select(rfiQuery.selectRfi)();

  if (!isRfiSubmitCompleted(rfiPayload)) {
    return createUrlTreeFromSnapshot(route, [RfiWizardSteps.RFI_REQUEST]);
  }

  return true;
};

export const canActivateRfiSuccess = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const rfiStore = inject(RequestForInformationStore);

  const rfiPayload = rfiStore.select(rfiQuery.selectRfi)();

  if (!isRfiSubmitCompleted(rfiPayload)) {
    return createUrlTreeFromSnapshot(route, [RfiWizardSteps.SUMMARY]);
  }

  return true;
};

export const canActivateRfiRespondSuccess = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const router = inject(Router);
  const responded = router.currentNavigation()?.extras?.state?.responded;

  if (!responded) {
    return createUrlTreeFromSnapshot(route, ['../../../../']);
  }

  return true;
};
