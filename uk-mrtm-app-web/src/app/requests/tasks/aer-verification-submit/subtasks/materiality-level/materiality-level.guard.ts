import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import {
  getNextIncompleteStep,
  isMaterialityDetailsStepCompleted,
  isWizardCompleted,
} from '@requests/tasks/aer-verification-submit/subtasks/materiality-level/materiality-level.wizard';

export const canActivateMaterialityLevelSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const materialityLevel = store.select(aerVerificationSubmitQuery.selectMaterialityLevel)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(materialityLevel)) ||
    createUrlTreeFromSnapshot(route, [`./${getNextIncompleteStep(materialityLevel)}`])
  );
};

export const canActivateMaterialityLevelDetailsStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const materialityLevel = store.select(aerVerificationSubmitQuery.selectMaterialityLevel)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isWizardCompleted(materialityLevel) || isChange) && isEditable) || createUrlTreeFromSnapshot(route, ['../'])
  );
};

export const canActivateMaterialityLevelReferenceDocumentsStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const materialityLevel = store.select(aerVerificationSubmitQuery.selectMaterialityLevel)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isWizardCompleted(materialityLevel) || isChange) &&
      isMaterialityDetailsStepCompleted(materialityLevel) &&
      isEditable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
