import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { NonComplianceFinalDeterminationDetailsStep } from '@requests/common/non-compliance';
import { nonComplianceFinalDeterminationQuery } from '@requests/tasks/non-compliance-final-determination/+state';
import { isWizardCompleted } from '@requests/tasks/non-compliance-final-determination/subtasks/non-compliance-final-determination-details/non-compliance-final-determination-details.wizard';

export const canActivateNonComplianceFinalDeterminationDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const nonComplianceFinalDetermination = store.select(
    nonComplianceFinalDeterminationQuery.selectNonComplianceFinalDetermination,
  )();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(nonComplianceFinalDetermination)) ||
    createUrlTreeFromSnapshot(route, [`./${NonComplianceFinalDeterminationDetailsStep.DETAILS_FORM}`])
  );
};

export const canActivateNonComplianceFinalDeterminationDetailsStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const nonComplianceFinalDetermination = store.select(
    nonComplianceFinalDeterminationQuery.selectNonComplianceFinalDetermination,
  )();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isWizardCompleted(nonComplianceFinalDetermination) || isChange) && isEditable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
