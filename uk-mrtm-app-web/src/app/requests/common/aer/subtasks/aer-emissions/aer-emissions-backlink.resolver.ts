import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AerEmissionsWizardStep,
  isShipWizardCompleted,
} from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';

const basicDetailsBacklink = (returnToSummary: boolean) =>
  returnToSummary ? '../' : `../../../${AerEmissionsWizardStep.LIST_OF_SHIPS}`;
const fuelsAndEmissionsListBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${AerEmissionsWizardStep.BASIC_DETAILS}`;
const fuelsAndEmissionsFormBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`;
const emissionSourcesFormBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${AerEmissionsWizardStep.EMISSION_SOURCES_LIST}`;
const emissionSourcesListBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`;
const uncertaintyLevelBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../' : `../${AerEmissionsWizardStep.EMISSION_SOURCES_LIST}`;
const derogationsBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../' : `../${AerEmissionsWizardStep.UNCERTAINTY_LEVEL}`;
const shipSummaryBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${AerEmissionsWizardStep.LIST_OF_SHIPS}`;

const stepBacklinkResolvers: Record<AerEmissionsWizardStep, (returnToSummary: boolean) => string> = {
  [AerEmissionsWizardStep.BASIC_DETAILS]: basicDetailsBacklink,
  [AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST]: fuelsAndEmissionsListBacklinkResolver,
  [AerEmissionsWizardStep.FUELS_AND_EMISSIONS_FORM]: fuelsAndEmissionsFormBacklinkResolver,
  [AerEmissionsWizardStep.EMISSION_SOURCES_LIST]: emissionSourcesListBacklinkResolver,
  [AerEmissionsWizardStep.EMISSION_SOURCES_FORM]: emissionSourcesFormBacklinkResolver,
  [AerEmissionsWizardStep.UNCERTAINTY_LEVEL]: uncertaintyLevelBacklinkResolver,
  [AerEmissionsWizardStep.DEROGATIONS]: derogationsBacklinkResolver,
  [AerEmissionsWizardStep.SHIP_SUMMARY]: shipSummaryBacklinkResolver,
  [AerEmissionsWizardStep.LIST_OF_SHIPS]: () => '../../../',
  [AerEmissionsWizardStep.SUMMARY]: () => '../../',
  [AerEmissionsWizardStep.FETCH_FROM_EMP]: () => `../${AerEmissionsWizardStep.LIST_OF_SHIPS}`,
  [AerEmissionsWizardStep.UPLOAD_SHIPS]: () => `../${AerEmissionsWizardStep.LIST_OF_SHIPS}`,
  [AerEmissionsWizardStep.DELETE_SHIPS]: () => `../${AerEmissionsWizardStep.LIST_OF_SHIPS}`,
};

export const aerEmissionsBacklinkResolver =
  (step: AerEmissionsWizardStep): ResolveFn<any> =>
  (route) => {
    const shipId = route.params.shipId;
    const isChange = route.queryParamMap.get('change') === 'true';
    const store = inject(RequestTaskStore);
    const ship = store.select(aerCommonQuery.selectShip(shipId))();

    const resolverFn = stepBacklinkResolvers[step];
    return resolverFn ? resolverFn(isShipWizardCompleted(ship) && isChange) : '/';
  };
