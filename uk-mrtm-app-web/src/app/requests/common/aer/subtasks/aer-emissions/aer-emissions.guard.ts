import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { isShipWizardCompleted } from '@requests/common/aer/subtasks/aer-emissions';
import {
  AerEmissionsWizardStep,
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
    ship?.dataInputType === 'EXTERNAL_PROVIDER' ||
    (isEditable && isShipWizardCompleted(ship)) ||
    createUrlTreeFromSnapshot(route, [`./${AerEmissionsWizardStep.BASIC_DETAILS}`])
  );
};

export const canActivateAerEmissionsShipEdit =
  (summaryPath: string = '../'): CanActivateFn =>
  (route) => {
    const shipId = route.params['shipId'];
    if (!shipId) {
      return false;
    }

    const isChange = route.queryParams?.['change'] === 'true';
    const store = inject(RequestTaskStore);

    const isEditable = store.select(aerCommonQuery.selectIsShipEditable(shipId))();
    const ship = store.select(aerCommonQuery.selectShip(shipId))();

    return (
      (isEditable && (isChange || !isShipWizardCompleted(ship))) || createUrlTreeFromSnapshot(route, [summaryPath])
    );
  };

export const canActivateAerEmissionsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isSubtaskCompleted = store.select(aerCommonQuery.selectIsSubtaskCompleted(EMISSIONS_SUB_TASK))();
  const ships = store.select(aerCommonQuery.selectShips)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const submit = route.queryParamMap.get('submit') === 'true';

  return (
    !isEditable ||
    (isEditable && (isSubtaskCompleted || (isWizardCompleted(ships) && submit))) ||
    createUrlTreeFromSnapshot(route, ['./', AerEmissionsWizardStep.LIST_OF_SHIPS])
  );
};
