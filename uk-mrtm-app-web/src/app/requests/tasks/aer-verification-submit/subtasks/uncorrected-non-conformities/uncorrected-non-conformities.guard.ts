import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import {
  getNextIncompleteStep,
  isUncorrectedNonConformitiesListCompleted,
  isWizardCompleted,
} from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities.wizard';

export const canActivateUncorrectedNonConformitiesSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const uncorrectedNonConformities = store.select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(uncorrectedNonConformities)) ||
    createUrlTreeFromSnapshot(route, [`./${getNextIncompleteStep(uncorrectedNonConformities)}`])
  );
};

export const canActivateUncorrectedNonConformitiesExistFormStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateUncorrectedNonConformitiesAddOrList: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const uncorrectedNonConformitiesExist = store.select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)()
    ?.exist;

  return (isEditable && uncorrectedNonConformitiesExist) || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateUncorrectedNonConformitiesEditOrRemove: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const issues = store.select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)()
    ?.uncorrectedNonConformities;
  const referenceParam = route.paramMap.get('reference');
  const hasEntry = referenceParam && issues?.length && !!issues.find(({ reference }) => reference === referenceParam);

  return (isEditable && hasEntry) || createUrlTreeFromSnapshot(route, [`../${UncorrectedNonConformitiesStep.SUMMARY}`]);
};

export const canActivateUncorrectedNonConformitiesPriorYearIssuesExistFormStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const uncorrectedNonConformities = store.select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)();

  return (
    (isEditable && isUncorrectedNonConformitiesListCompleted(uncorrectedNonConformities)) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};

export const canActivateUncorrectedNonConformitiesPriorYearIssuesAddOrList: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const uncorrectedNonConformities = store.select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)();

  return (
    (isEditable &&
      isUncorrectedNonConformitiesListCompleted(uncorrectedNonConformities) &&
      uncorrectedNonConformities?.existPriorYearIssues) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};

export const canActivateUncorrectedNonConformitiesPriorYearIssuesEditOrRemove: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const uncorrectedNonConformities = store.select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)();
  const priorYearIssues = uncorrectedNonConformities?.priorYearIssues;
  const referenceParam = route.paramMap.get('reference');
  const hasEntry =
    referenceParam &&
    priorYearIssues?.length &&
    !!priorYearIssues.find(({ reference }) => reference === referenceParam);

  return (
    (isEditable && isUncorrectedNonConformitiesListCompleted(uncorrectedNonConformities) && hasEntry) ||
    createUrlTreeFromSnapshot(route, [`../${UncorrectedNonConformitiesStep.SUMMARY}`])
  );
};
