import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import {
  ControlActivitiesWizardStep,
  isControlActivitiesCompleted,
} from '@requests/common/emp/subtasks/control-activities';

export const canActivateControlActivitiesStep =
  (fallbackStep: ControlActivitiesWizardStep = ControlActivitiesWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';

    const controlActivities = store.select(empCommonQuery.selectControlActivities)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [ControlActivitiesWizardStep.SUMMARY]);

    const fallbackRedirect =
      fallbackStep === ControlActivitiesWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];
    return (
      !isControlActivitiesCompleted(controlActivities) || change || createUrlTreeFromSnapshot(route, fallbackRedirect)
    );
  };

export const canActivateControlActivitiesDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [ControlActivitiesWizardStep.SUMMARY]);

  return true;
};

export const canActivateControlActivitiesSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const empControlActivities = store.select(empCommonQuery.selectControlActivities)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isControlActivitiesCompleted(empControlActivities)) ||
    createUrlTreeFromSnapshot(route, ['./', ControlActivitiesWizardStep.QUALITY_ASSURANCE])
  );
};
