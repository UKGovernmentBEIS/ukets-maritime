import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  aerVoyageStepsCompletedMap,
  AerVoyagesWizardStep,
  isVoyageWizardCompleted,
  isWizardCompleted,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const canActivateAerVoyages: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const status = store.select(aerCommonQuery.selectStatusForVoyagesSubtask)();

  return status !== TaskItemStatus.CANNOT_START_YET || createUrlTreeFromSnapshot(route, ['../../']);
};

export const canActivateVoyageEmissionSummary: CanActivateFn = (route) => {
  const voyageId = route.params?.voyageId;
  if (!voyageId) {
    return false;
  }

  const store = inject(RequestTaskStore);
  const voyage = store.select(aerCommonQuery.selectVoyage(voyageId))();

  if (isVoyageWizardCompleted(voyage)) {
    return true;
  }

  return createUrlTreeFromSnapshot(route, ['./', AerVoyagesWizardStep.VOYAGE_DETAILS]);
};

export const canActivateListOfVoyages: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateVoyageDetails: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const voyageId = route?.params?.voyageId;
  if (!voyageId) {
    return false;
  }

  const store = inject(RequestTaskStore);
  const voyage = store.select(aerCommonQuery.selectVoyage(voyageId))();

  return (
    aerVoyageStepsCompletedMap.imoNumber(voyage) ||
    createUrlTreeFromSnapshot(route, ['../', AerVoyagesWizardStep.SELECT_SHIP])
  );
};

export const canActivateVoyageEmissions: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const voyageId = route?.params?.voyageId;

  if (!voyageId) {
    return false;
  }

  const store = inject(RequestTaskStore);

  const voyage = store.select(aerCommonQuery.selectVoyage(voyageId))();

  return (
    aerVoyageStepsCompletedMap.voyageDetails(voyage) ||
    createUrlTreeFromSnapshot(route, ['../', AerVoyagesWizardStep.SELECT_SHIP])
  );
};

export const canActivateAerVoyagesSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const subtaskStatus = store.select(aerCommonQuery.selectStatusForVoyagesSubtask)();
  const voyages = store.select(aerCommonQuery.selectVoyages)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (route.fragment === AerVoyagesWizardStep.LIST_OF_VOYAGES && !isWizardCompleted(voyages)) {
    return createUrlTreeFromSnapshot(route, ['../../']);
  }

  return (
    !isEditable ||
    (isEditable && (subtaskStatus === TaskItemStatus.COMPLETED || isWizardCompleted(voyages))) ||
    createUrlTreeFromSnapshot(route, ['./', AerVoyagesWizardStep.LIST_OF_VOYAGES])
  );
};
