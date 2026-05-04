import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { isShipWizardCompleted } from '@requests/common/emp/subtasks/emissions/emissions.wizard';

const basicDetailsBacklink = (returnToSummary: boolean) =>
  returnToSummary ? '../' : `../../../${EmissionsWizardStep.LIST_OF_SHIPS}`;
const fuelsAndEmissionsListBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${EmissionsWizardStep.BASIC_DETAILS}`;
const fuelsAndEmissionsFormBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`;
const emissionSourcesFormBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${EmissionsWizardStep.EMISSION_SOURCES_LIST}`;
const emissionSourcesListBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`;
const uncertaintyLevelBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../' : `../${EmissionsWizardStep.EMISSION_SOURCES_LIST}`;
const measurementsBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../' : `../${EmissionsWizardStep.UNCERTAINTY_LEVEL}`;
const carbonCaptureBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../' : `../${EmissionsWizardStep.MEASUREMENTS}`;
const exemptionConditionsBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../' : `../${EmissionsWizardStep.CARBON_CAPTURE}`;
const shipSummaryBacklinkResolver = (returnToSummary: boolean) =>
  returnToSummary ? '../../' : `../../${EmissionsWizardStep.LIST_OF_SHIPS}`;

const stepBacklinkResolvers: Record<EmissionsWizardStep, (returnToSummary: boolean) => string> = {
  [EmissionsWizardStep.BASIC_DETAILS]: basicDetailsBacklink,
  [EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM]: fuelsAndEmissionsFormBacklinkResolver,
  [EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST]: fuelsAndEmissionsListBacklinkResolver,
  [EmissionsWizardStep.EMISSION_SOURCES_FORM]: emissionSourcesFormBacklinkResolver,
  [EmissionsWizardStep.EMISSION_SOURCES_LIST]: emissionSourcesListBacklinkResolver,
  [EmissionsWizardStep.UNCERTAINTY_LEVEL]: uncertaintyLevelBacklinkResolver,
  [EmissionsWizardStep.MEASUREMENTS]: measurementsBacklinkResolver,
  [EmissionsWizardStep.CARBON_CAPTURE]: carbonCaptureBacklinkResolver,
  [EmissionsWizardStep.EXEMPTION_CONDITIONS]: exemptionConditionsBacklinkResolver,
  [EmissionsWizardStep.SHIP_SUMMARY]: shipSummaryBacklinkResolver,
  [EmissionsWizardStep.LIST_OF_SHIPS]: () => '../../../',
  [EmissionsWizardStep.SUMMARY]: () => '../../',
  [EmissionsWizardStep.UPLOAD_SHIPS]: () => `../${EmissionsWizardStep.LIST_OF_SHIPS}`,
  [EmissionsWizardStep.DELETE_SHIPS]: () => `../${EmissionsWizardStep.LIST_OF_SHIPS}`,
  [EmissionsWizardStep.VARIATION_REGULATOR_DECISION]: () => '../../',
  [EmissionsWizardStep.DECISION]: () => '../../',
};

export const emissionsBacklinkResolver =
  (step: EmissionsWizardStep): ResolveFn<any> =>
  (route) => {
    const shipId = route.params.shipId;
    const isChange = route.queryParamMap.get('change') === 'true';
    const store = inject(RequestTaskStore);
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const ship = store.select(empCommonQuery.selectShip(shipId))();

    const resolverFn = stepBacklinkResolvers[step];
    return resolverFn ? resolverFn(isShipWizardCompleted(ship) && (isChange || !isEditable)) : '/';
  };
