import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { isShipWizardCompleted } from '@requests/common/emp/subtasks/emissions/emissions.wizard';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const canActivateEmissionsShipSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const shipId = route.params['shipId'] ?? crypto.randomUUID();
  const ship = store.select(empCommonQuery.selectShip(shipId))();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isShipWizardCompleted(ship)) ||
    createUrlTreeFromSnapshot(route, ['./', EmissionsWizardStep.BASIC_DETAILS])
  );
};

export const canActivateEmissionsStep =
  (fallbackStep: EmissionsWizardStep = EmissionsWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const activatedRoute = inject(ActivatedRoute);
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';
    const changeFromPreviousRoute = !change && activatedRoute.snapshot.queryParamMap.get('change') === 'true';

    const shipEmissions = store.select(empCommonQuery.selectShips)();
    const isEmissionsCompleted = shipEmissions.length > 0 && shipEmissions.every((ship) => isShipWizardCompleted(ship));
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [EmissionsWizardStep.SUMMARY]);

    const fallbackRedirect = fallbackStep === EmissionsWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return (
      !isEmissionsCompleted ||
      change ||
      (changeFromPreviousRoute && createUrlTreeFromSnapshot(route, [], { change: true })) ||
      createUrlTreeFromSnapshot(route, fallbackRedirect)
    );
  };

export const canActivateEmissionsDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [EmissionsWizardStep.SUMMARY]);

  return true;
};

export const canActivateEmissionsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const status = store.select(empCommonQuery.selectStatusForSubtask('emissions'))();
  const ships = store.select(empCommonQuery.selectShips)();

  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable &&
      (status === TaskItemStatus.COMPLETED ||
        (ships.length > 0 &&
          ships.every((ship) => isShipWizardCompleted(ship) && ship.status === TaskItemStatus.COMPLETED)))) ||
    createUrlTreeFromSnapshot(route, ['./', EmissionsWizardStep.LIST_OF_SHIPS])
  );
};
