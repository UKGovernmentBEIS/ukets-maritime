import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { OperatorImprovementResponse } from '@mrtm/api';

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

function resolveUploadEvidenceStep(
  route: ActivatedRouteSnapshot,
  canProceed: (isEditable: boolean, operatorResponse: OperatorImprovementResponse) => boolean,
  fallbackStep: VirRespondToRecommendationWizardStep,
) {
  const store = inject(RequestTaskStore);
  const key = route.params?.['key'];
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const operatorResponse = store.select(virCommonQuery.selectOperatorResponseData(key))();
  const isChange = route.queryParams?.['change'] === 'true';

  if (!isChange && isWizardCompleted(operatorResponse)) {
    return createUrlTreeFromSnapshot(route, [VirRespondToRecommendationWizardStep.SUMMARY]);
  }

  return canProceed(isEditable, operatorResponse) || createUrlTreeFromSnapshot(route, ['../', fallbackStep]);
}

export const canActivateUploadEvidenceQuestionForm: CanActivateFn = (route: ActivatedRouteSnapshot) =>
  resolveUploadEvidenceStep(
    route,
    (isEditable, operatorResponse) => isEditable && wizardStepCompletedMap.RESPOND_TO(operatorResponse),
    VirRespondToRecommendationWizardStep.RESPOND_TO,
  );

export const canActivateUploadEvidenceForm: CanActivateFn = (route: ActivatedRouteSnapshot) =>
  resolveUploadEvidenceStep(
    route,
    (isEditable, operatorResponse) =>
      isEditable &&
      wizardStepCompletedMap.UPLOAD_EVIDENCE_QUESTION(operatorResponse) &&
      operatorResponse?.uploadEvidence === true,
    VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_QUESTION,
  );
