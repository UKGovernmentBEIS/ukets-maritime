import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { AerVoyage } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_SUBTASK_NEW_ENTRY_FLOW } from '@requests/common/aer/aer.consts';
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

const voyageDetailsBacklinkResolver = (
  returnToSummary: boolean,
  voyages: Array<AerVoyage>,
  activatedRoute: ActivatedRouteSnapshot,
  isNewEntry: boolean,
): string => {
  switch (true) {
    case returnToSummary:
      return '../';
    case isNewEntry:
      return `../${AerVoyagesWizardStep.SELECT_SHIP}`;
    default:
      return '../../';
  }
};

const voyageSummaryBacklinkResolver = (
  returnToSummary: boolean,
  voyages: Array<AerVoyage>,
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
    AerVoyagesWizardStep,
    (
      returnToSummary: boolean,
      voyages: Array<AerVoyage>,
      activatedRoute: ActivatedRouteSnapshot,
      isNewEntry: boolean,
    ) => string
  >
> = {
  [AerVoyagesWizardStep.SELECT_SHIP]: selectShipBacklinkResolver,
  [AerVoyagesWizardStep.VOYAGE_DETAILS]: voyageDetailsBacklinkResolver,
  [AerVoyagesWizardStep.FUEL_EMISSIONS]: (returnToSummary: boolean) =>
    returnToSummary ? '../' : `../${AerVoyagesWizardStep.VOYAGE_DETAILS}`,
  [AerVoyagesWizardStep.VOYAGE_SUMMARY]: voyageSummaryBacklinkResolver,
};

export const aerVoyagesBacklinkResolver =
  (step: AerVoyagesWizardStep): ResolveFn<any> =>
  (route: ActivatedRouteSnapshot) => {
    const store = inject(RequestTaskStore);
    const isNew = inject(AER_SUBTASK_NEW_ENTRY_FLOW, { optional: true });

    const isChange = route.queryParamMap.get('change') === 'true';
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const voyages = store.select(aerCommonQuery.selectVoyages)();

    const resolverFn = stepBacklinkResolvers[step];
    return resolverFn ? resolverFn(isChange || !isEditable, voyages, route, isNew) : '/';
  };
