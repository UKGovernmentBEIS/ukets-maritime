import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import {
  GREENHOUSE_GAS_SUB_TASK,
  GreenhouseGasWizardStep,
  isGreenhouseGasCompleted,
} from '@requests/common/emp/subtasks/greenhouse-gas';

export const canActivateGreenhouseGasSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const greenhouseGas = store.select(empCommonQuery.selectGreenhouseGas)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const isSubtaskCompleted =
    isGreenhouseGasCompleted(greenhouseGas) &&
    store.select(empVariationReviewQuery.selectSubtaskHasDecision(GREENHOUSE_GAS_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', GreenhouseGasWizardStep.DECISION])
  );
};
