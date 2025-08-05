import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { empCommonQuery } from '@requests/common/emp/+state';
import { isEmpOperatorDetailsCompleted } from '@requests/common/emp/subtasks/operator-details/operator-details.wizard';

export const canActivateOperatorDetailsStep =
  (fallbackStep: OperatorDetailsWizardStep = OperatorDetailsWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';

    const operatorDetails = store.select(empCommonQuery.selectOperatorDetails)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [OperatorDetailsWizardStep.SUMMARY]);

    const fallbackRedirect =
      fallbackStep === OperatorDetailsWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return (
      !isEmpOperatorDetailsCompleted(operatorDetails) || change || createUrlTreeFromSnapshot(route, fallbackRedirect)
    );
  };

export const canActivateOperatorDetailsDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [OperatorDetailsWizardStep.SUMMARY]);

  return true;
};

export const canActivateOperatorDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const empOperatorDetails = store.select(empCommonQuery.selectOperatorDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isEmpOperatorDetailsCompleted(empOperatorDetails)) ||
    createUrlTreeFromSnapshot(route, ['./', OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM])
  );
};
