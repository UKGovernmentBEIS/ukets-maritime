import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { empCommonQuery, empReviewQuery } from '@requests/common/emp/+state';
import { isShipWizardCompleted } from '@requests/common/emp/subtasks/emissions';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';

export const canActivateEmissionsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const shipEmissions = store.select(empCommonQuery.selectShips)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const isEmissionsCompleted = shipEmissions.length > 0 && shipEmissions.every((ship) => isShipWizardCompleted(ship));
  const isSubtaskCompleted =
    isEmissionsCompleted && store.select(empReviewQuery.selectSubtaskHasDecision(EMISSIONS_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', EmissionsWizardStep.DECISION])
  );
};
