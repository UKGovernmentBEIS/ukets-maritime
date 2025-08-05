import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { virReviewQuery } from '@requests/tasks/vir-review/+state';
import {
  isWizardCompleted,
  VirRespondToOperatorWizardStep,
} from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator.helpers';

export const canActivateVirRespondToOperatorSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const key = route.params?.['key'];
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const subtaskStatus = store.select(virReviewQuery.selectStatusForVerifierRecommendationData(key))();
  const regulatorResponse = store.select(virReviewQuery.selectRegulatorResponseData(key))();

  return (
    !isEditable ||
    (isEditable && (subtaskStatus === TaskItemStatus.COMPLETED || isWizardCompleted(regulatorResponse))) ||
    createUrlTreeFromSnapshot(route, [VirRespondToOperatorWizardStep.RESPOND_TO])
  );
};
