import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { AerPort } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_SUBTASK_NEW_ENTRY_FLOW } from '@requests/common/aer/aer.consts';
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

const portDetailsBacklinkResolver = (
  returnToSummary: boolean,
  ports: Array<AerPort>,
  activatedRoute: ActivatedRouteSnapshot,
  isNewEntry: boolean,
): string => {
  switch (true) {
    case returnToSummary && isNewEntry:
    case returnToSummary:
      return '../';
    case isNewEntry:
      return `../${AerPortsWizardStep.SELECT_SHIP}`;
    default:
      return '../../';
  }
};

const portSummaryBacklinkResolver = (
  returnToSummary: boolean,
  voyages: Array<AerPort>,
  activatedRoute: ActivatedRouteSnapshot,
  isNewEntry: boolean,
): string => {
  switch (true) {
    case isNewEntry:
      return `../../`;
    default:
      return '../';
  }
};

const stepBacklinkResolvers: Partial<
  Record<
    AerPortsWizardStep,
    (returnToSummary: boolean, ports: Array<AerPort>, activatedRoute: ActivatedRouteSnapshot, isNew: boolean) => string
  >
> = {
  [AerPortsWizardStep.SELECT_SHIP]: selectShipBacklinkResolver,
  [AerPortsWizardStep.PORT_DETAILS]: portDetailsBacklinkResolver,
  [AerPortsWizardStep.IN_PORT_EMISSIONS]: (returnToSummary: boolean) =>
    returnToSummary ? '../' : `../${AerPortsWizardStep.PORT_DETAILS}`,
  [AerPortsWizardStep.PORT_CALL_SUMMARY]: portSummaryBacklinkResolver,
};

export const aerPortsBacklinkResolver =
  (step: AerPortsWizardStep): ResolveFn<any> =>
  (route: ActivatedRouteSnapshot) => {
    const store = inject(RequestTaskStore);
    const isNew = inject(AER_SUBTASK_NEW_ENTRY_FLOW, { optional: true });

    const isChange = route.queryParamMap.get('change') === 'true';
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const ports = store.select(aerCommonQuery.selectPorts)();

    const resolverFn = stepBacklinkResolvers[step];
    return resolverFn ? resolverFn(isChange || !isEditable, ports, route, isNew) : '/';
  };
