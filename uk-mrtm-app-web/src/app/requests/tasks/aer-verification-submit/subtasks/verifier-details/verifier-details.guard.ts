import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { VerifierDetailsStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { isWizardCompleted } from '@requests/tasks/aer-verification-submit/subtasks/verifier-details/verifier-details.wizard';

export const canActivateVerifierDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const verifierDetails = store.select(aerVerificationSubmitQuery.selectVerifierDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(verifierDetails)) ||
    createUrlTreeFromSnapshot(route, [`./${VerifierDetailsStep.FORM}`])
  );
};

export const canActivateVerifierDetailsStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const verifierDetails = store.select(aerVerificationSubmitQuery.selectVerifierDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return ((!isWizardCompleted(verifierDetails) || isChange) && isEditable) || createUrlTreeFromSnapshot(route, ['../']);
};
