import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { virCommonQuery } from '@requests/common/vir/+state';
import { virSubmitQuery } from '@requests/tasks/vir-submit/+state';
import {
  isWizardCompleted,
  VirRespondToRecommendationWizardStep,
  wizardStepCompletedMap,
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

export const canActivateUploadEvidenceQuestionForm: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const key = route.params?.['key'];
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const operatorResponse = store.select(virCommonQuery.selectOperatorResponseData(key))();

  return (
    (isEditable && wizardStepCompletedMap.RESPOND_TO(operatorResponse)) ||
    createUrlTreeFromSnapshot(route, ['../', VirRespondToRecommendationWizardStep.RESPOND_TO])
  );
};

export const canActivateUploadEvidenceForm: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const key = route.params?.['key'];
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const operatorResponse = store.select(virCommonQuery.selectOperatorResponseData(key))();

  return (
    (isEditable &&
      wizardStepCompletedMap.UPLOAD_EVIDENCE_QUESTION(operatorResponse) &&
      operatorResponse?.uploadEvidence === true) ||
    createUrlTreeFromSnapshot(route, ['../', VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_QUESTION])
  );
};
