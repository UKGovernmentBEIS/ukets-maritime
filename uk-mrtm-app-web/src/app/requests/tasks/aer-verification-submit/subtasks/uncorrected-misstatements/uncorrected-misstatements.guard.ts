import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { UncorrectedMisstatementsStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import {
  getNextIncompleteStep,
  isWizardCompleted,
} from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements.wizard';

export const canActivateUncorrectedMisstatementsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const uncorrectedMisstatements = store.select(aerVerificationSubmitQuery.selectUncorrectedMisstatements)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(uncorrectedMisstatements)) ||
    createUrlTreeFromSnapshot(route, [`./${getNextIncompleteStep(uncorrectedMisstatements)}`])
  );
};

export const canActivateUncorrectedMisstatementsExistFormStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateUncorrectedMisstatementsAddOrList: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const uncorrectedMisstatementsExist = store.select(aerVerificationSubmitQuery.selectUncorrectedMisstatements)()
    ?.exist;

  return (isEditable && uncorrectedMisstatementsExist) || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateUncorrectedMisstatementsEditOrRemove: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const issues = store.select(aerVerificationSubmitQuery.selectUncorrectedMisstatements)()?.uncorrectedMisstatements;
  const referenceParam = route.paramMap.get('reference');
  const hasEntry = referenceParam && issues?.length && !!issues.find(({ reference }) => reference === referenceParam);

  return (isEditable && hasEntry) || createUrlTreeFromSnapshot(route, [`../${UncorrectedMisstatementsStep.SUMMARY}`]);
};
