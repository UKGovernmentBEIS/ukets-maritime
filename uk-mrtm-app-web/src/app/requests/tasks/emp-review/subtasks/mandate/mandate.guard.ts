import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empReviewQuery } from '@requests/common/emp/+state';
import { isWizardCompleted, MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';

export const canActivateMandateSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const mandate = store.select(empCommonQuery.selectExtendedMandate)();
  const ismShips = store.select(empCommonQuery.selectIsmShipImoNumbers)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const isSubtaskCompleted =
    isWizardCompleted(mandate, ismShips) && store.select(empReviewQuery.selectSubtaskHasDecision(MANDATE_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', MandateWizardStep.DECISION])
  );
};
