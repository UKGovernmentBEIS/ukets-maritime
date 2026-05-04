import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { AerPort } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { isNil } from '@shared/utils';

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
  [AerPortsWizardStep.PORT_DETAILS]: (returnToSummary: boolean) => (returnToSummary ? '../' : '../../'),
  [AerPortsWizardStep.IN_PORT_EMISSIONS]: (returnToSummary: boolean) =>
    returnToSummary ? '../' : `../${AerPortsWizardStep.PORT_DETAILS}`,
  [AerPortsWizardStep.PORT_CALL_SUMMARY]: (returnToSummary: boolean) => (returnToSummary ? '../../' : '../'),
};

export const aerPortsBacklinkResolver =
  (step: AerPortsWizardStep): ResolveFn<any> =>
  (route: ActivatedRouteSnapshot) => {
    const isChange = route.queryParamMap.get('change') === 'true';
    const store = inject(RequestTaskStore);
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const ports = store.select(aerCommonQuery.selectPorts)();

    const resolverFn = stepBacklinkResolvers[step];
    return resolverFn ? resolverFn(isChange || !isEditable, ports, route) : '/';
  };
