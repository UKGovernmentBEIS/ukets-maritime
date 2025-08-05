import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { NonComplianceDetailsStep } from '@requests/common/non-compliance';
import { nonComplianceSubmitQuery } from '@requests/tasks/non-compliance-submit/+state';
import { isWizardCompleted } from '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details.wizard';

export const canActivateNonComplianceDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const nonComplianceDetails = store.select(nonComplianceSubmitQuery.selectNonComplianceDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(nonComplianceDetails)) ||
    createUrlTreeFromSnapshot(route, [`./${NonComplianceDetailsStep.DETAILS_FORM}`])
  );
};

export const canActivateNonComplianceDetailsStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const nonComplianceDetails = store.select(nonComplianceSubmitQuery.selectNonComplianceDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isWizardCompleted(nonComplianceDetails) || isChange) && isEditable) || createUrlTreeFromSnapshot(route, ['../'])
  );
};

export const canActivateNonComplianceDetailsOptionalStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const nonComplianceDetails = store.select(nonComplianceSubmitQuery.selectNonComplianceDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (nonComplianceDetails.civilPenalty && (!isWizardCompleted(nonComplianceDetails) || isChange) && isEditable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
