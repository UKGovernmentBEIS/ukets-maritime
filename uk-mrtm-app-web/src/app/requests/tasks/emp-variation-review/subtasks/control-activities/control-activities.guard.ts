import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
  isControlActivitiesCompleted,
} from '@requests/common/emp/subtasks/control-activities';

export const canActivateControlActivitiesSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const controlActivities = store.select(empCommonQuery.selectControlActivities)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const isSubtaskCompleted =
    isControlActivitiesCompleted(controlActivities) &&
    store.select(empVariationReviewQuery.selectSubtaskHasDecision(CONTROL_ACTIVITIES_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', ControlActivitiesWizardStep.DECISION])
  );
};
