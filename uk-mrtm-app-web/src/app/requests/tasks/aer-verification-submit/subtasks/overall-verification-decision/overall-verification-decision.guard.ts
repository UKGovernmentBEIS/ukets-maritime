import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { OverallVerificationDecisionStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import {
  getNextIncompleteStep,
  isWizardCompleted,
} from '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision.wizard';

export const canActivateOverallVerificationDecisionSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const overallVerificationDecision = store.select(aerVerificationSubmitQuery.selectOverallVerificationDecision)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(overallVerificationDecision)) ||
    createUrlTreeFromSnapshot(route, [`./${getNextIncompleteStep(overallVerificationDecision)}`])
  );
};

export const canActivateOverallVerificationDecisionAssessment: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateOverallVerificationDecisionReasons: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const type = store.select(aerVerificationSubmitQuery.selectOverallVerificationDecision)()?.type;

  return (isEditable && type === 'VERIFIED_AS_SATISFACTORY_WITH_COMMENTS') || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateOverallVerificationDecisionEditOrRemoveReason: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const reasons = store.select(aerVerificationSubmitQuery.selectOverallVerificationDecisionReasons)();
  const reasonIndex = route.paramMap.get('reasonIndex');
  const hasReason = reasonIndex && reasons?.length && !!reasons[reasonIndex];

  return (
    (isEditable && hasReason) || createUrlTreeFromSnapshot(route, [`../${OverallVerificationDecisionStep.SUMMARY}`])
  );
};
