import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { isShipWizardCompleted } from '@requests/common/aer/subtasks/aer-emissions';
import {
  AerEmissionsWizardStep,
  getNextIncompleteShipStep,
  isWizardCompleted,
} from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';

export const canActivateAerEmissionsShipSummary: CanActivateFn = (route) => {
  const shipId = route.params['shipId'];
  if (!shipId) {
    return false;
  }

  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const ship = store.select(aerCommonQuery.selectShip(shipId))();

  return (
    !isEditable ||
    (isEditable && isShipWizardCompleted(ship)) ||
    createUrlTreeFromSnapshot(route, [`./${getNextIncompleteShipStep(ship)}`])
  );
};

export const canActivateAerEmissionsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isSubtaskCompleted = store.select(aerCommonQuery.selectIsSubtaskCompleted(EMISSIONS_SUB_TASK))();
  const ships = store.select(aerCommonQuery.selectShips)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && (isSubtaskCompleted || isWizardCompleted(ships))) ||
    createUrlTreeFromSnapshot(route, ['./', AerEmissionsWizardStep.LIST_OF_SHIPS])
  );
};
