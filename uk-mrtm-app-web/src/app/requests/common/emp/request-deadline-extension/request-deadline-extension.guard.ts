import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, createUrlTreeFromSnapshot, Router, UrlTree } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { rdeQuery } from '@requests/common/emp/request-deadline-extension/+state';
import {
  RDE_TASK_NAME,
  RdeWizardSteps,
} from '@requests/common/emp/request-deadline-extension/request-deadline-extension.consts';
import {
  isRdeFormCompleted,
  isRdeSubmitCompleted,
} from '@requests/common/emp/request-deadline-extension/request-deadline-extension.helpers';
import { RequestDeadlineExtensionStore } from '@requests/common/emp/request-deadline-extension/services';

export const canActivateRdeSubmit = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const taskStore = inject(RequestTaskStore);
  const taskActions = taskStore.select(requestTaskQuery.selectAllowedRequestTaskActions)();

  if (!taskActions.includes(RDE_TASK_NAME)) {
    return createUrlTreeFromSnapshot(route, ['../']);
  }

  return true;
};

export const canDeactivateRdeSubmit: CanDeactivateFn<unknown> = () => {
  inject(RequestDeadlineExtensionStore).reset();
  return true;
};

export const canActivateRdeNotificationForm = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const rdeStore = inject(RequestDeadlineExtensionStore);

  const rdePayload = rdeStore.select(rdeQuery.selectRde)();

  if (!isRdeFormCompleted(rdePayload)) {
    return createUrlTreeFromSnapshot(route, [RdeWizardSteps.SUMMARY]);
  }
};

export const canActivateRdeSummary = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const rdeStore = inject(RequestDeadlineExtensionStore);

  const rdePayload = rdeStore.select(rdeQuery.selectRde)();

  if (!isRdeSubmitCompleted(rdePayload)) {
    return createUrlTreeFromSnapshot(route, [RdeWizardSteps.RDE_DEADLINE_EXTENSION]);
  }

  return true;
};

export const canActivateRdeSuccess = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const rdeStore = inject(RequestDeadlineExtensionStore);

  const rdePayload = rdeStore.select(rdeQuery.selectRde)();

  if (!isRdeSubmitCompleted(rdePayload)) {
    return createUrlTreeFromSnapshot(route, [RdeWizardSteps.SUMMARY]);
  }

  return true;
};

export const canActivateRdeDecisionSuccess = (route: ActivatedRouteSnapshot): UrlTree | boolean => {
  const router = inject(Router);
  const decision = router.currentNavigation()?.extras?.state?.decision;

  if (!decision) {
    return createUrlTreeFromSnapshot(route, ['../../../../']);
  }

  return true;
};
