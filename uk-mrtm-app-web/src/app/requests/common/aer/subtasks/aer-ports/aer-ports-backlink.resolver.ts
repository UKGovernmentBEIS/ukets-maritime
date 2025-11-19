import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { isNil } from 'lodash-es';

import { AerPort } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerPortsWizardStep, isWizardCompleted } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

const selectShipBacklinkResolver = (
  returnToSummary: boolean,
  ports: Array<AerPort>,
  activatedRoute: ActivatedRouteSnapshot,
): string => {
  const portId = activatedRoute.params.portId;
  return returnToSummary ? '../' : !isNil(portId) ? '../../' : '../';
};

const listOfPortsBacklinkResolver = (
  returnToSummary: boolean,
  ports: Array<AerPort & { status: TaskItemStatus }>,
): string => {
  return returnToSummary || isWizardCompleted(ports) ? '../' : '../../../';
};

const stepBacklinkResolvers: Partial<
  Record<
    AerPortsWizardStep,
    (returnToSummary: boolean, ports: Array<AerPort>, activatedRoute: ActivatedRouteSnapshot) => string
  >
> = {
  [AerPortsWizardStep.SELECT_SHIP]: selectShipBacklinkResolver,
  [AerPortsWizardStep.LIST_OF_PORTS]: listOfPortsBacklinkResolver,
};

export const aerPortsBacklinkResolver =
  (step: AerPortsWizardStep): ResolveFn<any> =>
  (route: ActivatedRouteSnapshot) => {
    const isChange = route.queryParamMap.get('change') === 'true';
    const store = inject(RequestTaskStore);
    const ports = store.select(aerCommonQuery.selectPorts)();

    const resolverFn = stepBacklinkResolvers[step];
    return resolverFn ? resolverFn(!!isChange, ports, route) : '/';
  };
