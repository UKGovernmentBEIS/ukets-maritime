import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { DataGapsMethodologiesStep } from '@requests/common/aer/subtasks/data-gaps-methodologies/data-gaps-methodologies.helpers';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { isWizardCompleted } from '@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies/data-gaps-methodologies.wizard';

export const canActivateDataGapsMethodologiesSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const dataGapsMethodologies = store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(dataGapsMethodologies)) ||
    createUrlTreeFromSnapshot(route, [`./${DataGapsMethodologiesStep.METHOD_REQUIRED}`])
  );
};

export const canActivateDataGapsMethodologiesMethodRequiredStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const dataGapsMethodologies = store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isWizardCompleted(dataGapsMethodologies) || isChange) && isEditable) || createUrlTreeFromSnapshot(route, ['../'])
  );
};

export const canActivateDataGapsMethodologiesMethodApprovedStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const dataGapsMethodologies = store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isWizardCompleted(dataGapsMethodologies) || isChange) && dataGapsMethodologies.methodRequired && isEditable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};

export const canActivateDataGapsMethodologiesMethodConservativeOrMaterialMisstatementStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const dataGapsMethodologies = store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const methodNotApproved = dataGapsMethodologies.methodRequired && dataGapsMethodologies.methodApproved === false;

  return (
    ((!isWizardCompleted(dataGapsMethodologies) || isChange) && methodNotApproved && isEditable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
