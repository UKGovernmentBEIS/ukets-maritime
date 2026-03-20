import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { AerVoyage } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerVoyagesWizardStep } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { isNil } from '@shared/utils';

const selectShipBacklinkResolver = (
  returnToSummary: boolean,
  voyages: Array<AerVoyage>,
  activatedRoute: ActivatedRouteSnapshot,
): string => {
  const voyageId = activatedRoute.params.voyageId;
  return returnToSummary ? '../' : !isNil(voyageId) ? '../../' : '../';
};

const voyageDetailsBacklinkResolver = (returnToSummary: boolean): string => {
  return returnToSummary ? '../' : `../${AerVoyagesWizardStep.SELECT_SHIP}`;
};

const stepBacklinkResolvers: Partial<
  Record<
    AerVoyagesWizardStep,
    (returnToSummary: boolean, voyages: Array<AerVoyage>, activatedRoute: ActivatedRouteSnapshot) => string
  >
> = {
  [AerVoyagesWizardStep.SELECT_SHIP]: selectShipBacklinkResolver,
  [AerVoyagesWizardStep.VOYAGE_DETAILS]: voyageDetailsBacklinkResolver,
};

export const aerVoyagesBacklinkResolver =
  (step: AerVoyagesWizardStep): ResolveFn<any> =>
  (route: ActivatedRouteSnapshot) => {
    const isChange = route.queryParamMap.get('change') === 'true';
    const store = inject(RequestTaskStore);
    const voyages = store.select(aerCommonQuery.selectVoyages)();

    const resolverFn = stepBacklinkResolvers[step];
    return resolverFn ? resolverFn(!!isChange, voyages, route) : '/';
  };
