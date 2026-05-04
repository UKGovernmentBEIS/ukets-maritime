import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  aerPortStepsCompletedMap,
  AerPortsWizardStep,
  isPortWizardCompleted,
  isWizardCompleted,
} from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const canActivateAerPorts: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const status = store.select(aerCommonQuery.selectStatusForPortsSubtask)();

  return status !== TaskItemStatus.CANNOT_START_YET || createUrlTreeFromSnapshot(route, ['../../']);
};

export const canActivatePortCallSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const portId = route?.params?.portId;
  if (!portId) {
    return false;
  }

  const store = inject(RequestTaskStore);
  const port = store.select(aerCommonQuery.selectPort(portId))();

  if (isPortWizardCompleted(port)) {
    return true;
  }

  return createUrlTreeFromSnapshot(route, ['.', AerPortsWizardStep.PORT_DETAILS]);
};

export const canActivateListOfPorts: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivatePortDetails: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const portId = route?.params?.portId;
  if (!portId) {
    return false;
  }

  const store = inject(RequestTaskStore);
  const port = store.select(aerCommonQuery.selectPort(portId))();

  return (
    aerPortStepsCompletedMap.imoNumber(port) ||
    createUrlTreeFromSnapshot(route, ['../', AerPortsWizardStep.SELECT_SHIP])
  );
};

export const canActivatePortEmissions: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const portId = route?.params?.portId;

  if (!portId) {
    return false;
  }

  const store = inject(RequestTaskStore);

  const port = store.select(aerCommonQuery.selectPort(portId))();

  return (
    aerPortStepsCompletedMap.portDetails(port) ||
    createUrlTreeFromSnapshot(route, ['../', AerPortsWizardStep.SELECT_SHIP])
  );
};

export const canActivatePortsSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const subtaskStatus = store.select(aerCommonQuery.selectStatusForPortsSubtask)();
  const ports = store.select(aerCommonQuery.selectPorts)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (route.fragment === AerPortsWizardStep.LIST_OF_PORTS && !isWizardCompleted(ports)) {
    return createUrlTreeFromSnapshot(route, ['../../']);
  }

  return (
    !isEditable ||
    (isEditable && (subtaskStatus === TaskItemStatus.COMPLETED || isWizardCompleted(ports))) ||
    createUrlTreeFromSnapshot(route, ['./', AerPortsWizardStep.LIST_OF_PORTS])
  );
};
