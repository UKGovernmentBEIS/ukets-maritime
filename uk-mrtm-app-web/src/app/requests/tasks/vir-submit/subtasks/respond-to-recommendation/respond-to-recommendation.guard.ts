import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { virCommonQuery } from '@requests/common/vir/+state';
import { virSubmitQuery } from '@requests/tasks/vir-submit/+state';
import {
  isWizardCompleted,
  VirRespondToRecommendationWizardStep,
} from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/respond-to-recommendation.helpers';

export const canActivateVirRespondToRecommendationSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const key = route.params?.['key'];
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const subtaskStatus = store.select(virSubmitQuery.selectStatusForVerifierRecommendationData(key))();
  const operatorResponse = store.select(virCommonQuery.selectOperatorResponseData(key))();

  return (
    !isEditable ||
    (isEditable && (subtaskStatus === TaskItemStatus.COMPLETED || isWizardCompleted(operatorResponse))) ||
    createUrlTreeFromSnapshot(route, [VirRespondToRecommendationWizardStep.RESPOND_TO])
  );
};

export const canActivateVirRespondToRecommendationStep: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const key = route.params?.['key'];
  const isChange = route.queryParamMap.get('change') === 'true';
  const operatorResponse = store.select(virCommonQuery.selectOperatorResponseData(key))();

  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isWizardCompleted(operatorResponse) || isChange) && isEditable) ||
    createUrlTreeFromSnapshot(route, [VirRespondToRecommendationWizardStep.SUMMARY])
  );
};
