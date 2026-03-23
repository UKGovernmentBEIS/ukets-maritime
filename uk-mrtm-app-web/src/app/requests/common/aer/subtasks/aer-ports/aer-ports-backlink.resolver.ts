import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { isNil } from 'lodash-es';

import { AerPort } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';

const selectShipBacklinkResolver = (
  returnToSummary: boolean,
  ports: Array<AerPort>,
  activatedRoute: ActivatedRouteSnapshot,
): string => {
  const portId = activatedRoute.params.portId;
  return returnToSummary ? '../' : !isNil(portId) ? '../../' : '../';
};

const stepBacklinkResolvers: Partial<
  Record<
    AerPortsWizardStep,
    (returnToSummary: boolean, ports: Array<AerPort>, activatedRoute: ActivatedRouteSnapshot) => string
  >
> = {
  [AerPortsWizardStep.SELECT_SHIP]: selectShipBacklinkResolver,
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
