import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { UncorrectedNonCompliancesStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { isWizardCompleted } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances.wizard';

export const canActivateUncorrectedNonCompliancesSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const uncorrectedNonCompliances = store.select(aerVerificationSubmitQuery.selectUncorrectedNonCompliances)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(uncorrectedNonCompliances)) ||
    createUrlTreeFromSnapshot(route, [`./${UncorrectedNonCompliancesStep.EXIST_FORM}`])
  );
};

export const canActivateUncorrectedNonCompliancesExistFormStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateUncorrectedNonCompliancesAddOrList: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const uncorrectedNonCompliancesExist = store.select(aerVerificationSubmitQuery.selectUncorrectedNonCompliances)()
    ?.exist;

  return (isEditable && uncorrectedNonCompliancesExist) || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateUncorrectedNonCompliancesEditOrRemove: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const issues = store.select(aerVerificationSubmitQuery.selectUncorrectedNonCompliances)()?.uncorrectedNonCompliances;
  const referenceParam = route.paramMap.get('reference');
  const hasEntry = referenceParam && issues?.length && !!issues.find(({ reference }) => reference === referenceParam);

  return (isEditable && hasEntry) || createUrlTreeFromSnapshot(route, [`../${UncorrectedNonCompliancesStep.SUMMARY}`]);
};
