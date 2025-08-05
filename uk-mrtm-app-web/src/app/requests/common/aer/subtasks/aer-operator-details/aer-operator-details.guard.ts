import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  isOperatorDetailsCoreCompleted,
  OperatorDetailsWizardStep,
} from '@requests/common/components/operator-details';

export const canActivateAerOperatorDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const operatorDetails = store.select(aerCommonQuery.selectAerOperatorDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isOperatorDetailsCoreCompleted(operatorDetails)) ||
    createUrlTreeFromSnapshot(route, ['./', OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM])
  );
};

export const canActivateAerOperatorDetailsStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isChange = route.queryParamMap.get('change') === 'true';
  const operatorDetails = store.select(aerCommonQuery.selectAerOperatorDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isOperatorDetailsCoreCompleted(operatorDetails) || isChange) && isEditable) ||
    createUrlTreeFromSnapshot(route, [OperatorDetailsWizardStep.SUMMARY])
  );
};
