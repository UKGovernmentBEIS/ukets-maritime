import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { isWizardCompleted, MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';

export const canActivateMandateSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const mandate = store.select(empCommonQuery.selectExtendedMandate)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const ismShips = store.select(empCommonQuery.selectIsmShipImoNumbers)();
  const isSubtaskCompleted =
    isWizardCompleted(mandate, ismShips) &&
    store.select(empVariationReviewQuery.selectSubtaskHasDecision(MANDATE_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', MandateWizardStep.DECISION])
  );
};
