import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { isEmpOperatorDetailsCompleted } from '@requests/common/emp/subtasks/operator-details';

export const canActivateOperatorDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const operatorDetails = store.select(empCommonQuery.selectOperatorDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const isSubtaskCompleted =
    isEmpOperatorDetailsCompleted(operatorDetails) &&
    store.select(empVariationReviewQuery.selectSubtaskHasDecision(OPERATOR_DETAILS_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', OperatorDetailsWizardStep.DECISION])
  );
};
