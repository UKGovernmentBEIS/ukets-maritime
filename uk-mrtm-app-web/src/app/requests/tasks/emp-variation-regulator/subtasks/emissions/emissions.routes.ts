import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { deleteShipsGuard } from '@requests/common/components/emissions/delete-ships/';
import {
  canActivateEmissionsDecision,
  canActivateEmissionsShipSummary,
  canActivateEmissionsSummary,
} from '@requests/common/emp/subtasks/emissions/emissions.guard';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { emissionsBacklinkResolver } from '@requests/common/emp/subtasks/emissions/emissions-backlink.resolver';
import { emissionShipSubtasksMap, emissionsSubTasksMap } from '@requests/common/emp/subtasks/subtask-list.map';

export const EMISSIONS_ROUTES: Routes = [
  {
    path: '',
    title: emissionsSubTasksMap.title,
    data: { breadcrumb: false },
    canActivate: [canActivateEmissionsSummary],
    resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.SUMMARY) },
    loadComponent: () => import('@requests/common/emp/subtasks/emissions').then((c) => c.ListOfShipsSummaryComponent),
  },
  {
    path: EmissionsWizardStep.VARIATION_REGULATOR_DECISION,
    title: emissionsSubTasksMap.variationRegulatorDecision.title,
    canActivate: [canActivateEmissionsDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-variation-regulator/subtasks/emissions').then(
        (c) => c.ListOfShipsVariationRegulatorDecisionComponent,
      ),
  },
  {
    path: EmissionsWizardStep.LIST_OF_SHIPS,
    title: emissionsSubTasksMap.title,
    data: { breadcrumb: false },
    resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.LIST_OF_SHIPS) },
    loadComponent: () => import('@requests/common/emp/subtasks/emissions').then((c) => c.ListOfShipsComponent),
  },
  {
    path: EmissionsWizardStep.UPLOAD_SHIPS,
    title: emissionsSubTasksMap.uploadShips.title,
    data: { backlink: `../${EmissionsWizardStep.LIST_OF_SHIPS}`, breadcrumb: false },
    loadComponent: () =>
      import('@requests/common/components/emissions/upload-ships').then((c) => c.UploadShipsComponent),
  },
  {
    path: EmissionsWizardStep.DELETE_SHIPS,
    title: 'Delete the selected ships',
    resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.DELETE_SHIPS) },
    data: { breadcrumb: false },
    canActivate: [deleteShipsGuard],
    loadComponent: () =>
      import('@requests/common/components/emissions/delete-ships/').then((c) => c.DeleteShipsComponent),
  },
  {
    path: 'ships/:shipId',
    title: emissionsSubTasksMap.title,
    data: { breadcrumb: false },
    children: [
      {
        path: '',
        data: { breadcrumb: false },
        canActivate: [canActivateEmissionsShipSummary],
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.SHIP_SUMMARY) },
        loadComponent: () => import('@requests/common/emp/subtasks/emissions').then((c) => c.ShipSummaryComponent),
      },
      {
        path: EmissionsWizardStep.BASIC_DETAILS,
        title: emissionShipSubtasksMap.details.title,
        data: { breadcrumb: false },
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.BASIC_DETAILS) },
        loadComponent: () =>
          import('@requests/common/components/emissions/basic-ship-details').then((c) => c.BasicShipDetailsComponent),
      },
      {
        path: EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST,
        title: emissionShipSubtasksMap.fuelsAndEmissionsFactors.title,
        data: { breadcrumb: false },
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST) },
        loadComponent: () =>
          import('@requests/common/emp/subtasks/emissions/fuels-and-emission-factors-list').then(
            (c) => c.FuelsAndEmissionFactorsListComponent,
          ),
      },
      {
        path: `${EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM}/:factoryId`,
        title: emissionShipSubtasksMap.fuelsAndEmissionsFactors.title,
        data: { breadcrumb: false },
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM) },
        loadComponent: () =>
          import('@requests/common/components/emissions/fuels-and-emissions-factors-form').then(
            (c) => c.FuelsAndEmissionsFactorsFormComponent,
          ),
      },
      {
        path: EmissionsWizardStep.EMISSION_SOURCES_LIST,
        title: emissionShipSubtasksMap.emissionsSources.title,
        data: { breadcrumb: false },
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.EMISSION_SOURCES_LIST) },
        loadComponent: () =>
          import('@requests/common/emp/subtasks/emissions/emission-sources-and-fuel-types-used-list').then(
            (c) => c.EmissionSourcesAndFuelTypesUsedListComponent,
          ),
      },
      {
        path: `${EmissionsWizardStep.EMISSION_SOURCES_FORM}/:sourceId`,
        title: emissionShipSubtasksMap.emissionsSources.title,
        data: { breadcrumb: false },
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.EMISSION_SOURCES_FORM) },
        loadComponent: () =>
          import('@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/').then(
            (c) => c.EmissionSourcesAndFuelTypesUsedFormComponent,
          ),
      },
      {
        path: EmissionsWizardStep.UNCERTAINTY_LEVEL,
        title: emissionShipSubtasksMap.uncertaintyLevel.title,
        data: { breadcrumb: false },
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.UNCERTAINTY_LEVEL) },
        loadComponent: () =>
          import('@requests/common/components/emissions/uncertainty-level').then((c) => c.UncertaintyLevelComponent),
      },
      {
        path: EmissionsWizardStep.MEASUREMENTS,
        title: emissionShipSubtasksMap.measurements.title,
        data: { breadcrumb: false },
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.MEASUREMENTS) },
        loadComponent: () => import('@requests/common/emp/subtasks/emissions').then((c) => c.MeasurementsComponent),
      },
      {
        path: EmissionsWizardStep.CARBON_CAPTURE,
        title: emissionShipSubtasksMap.carbonCapture.title,
        data: { breadcrumb: false },
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.CARBON_CAPTURE) },
        loadComponent: () => import('@requests/common/emp/subtasks/emissions').then((c) => c.CarbonCaptureComponent),
      },
      {
        path: EmissionsWizardStep.EXEMPTION_CONDITIONS,
        title: emissionShipSubtasksMap.exemptionConditions.title,
        data: { breadcrumb: false },
        resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.EXEMPTION_CONDITIONS) },
        loadComponent: () =>
          import('@requests/common/emp/subtasks/emissions').then((c) => c.ExemptionConditionsComponent),
      },
    ],
  },
];
