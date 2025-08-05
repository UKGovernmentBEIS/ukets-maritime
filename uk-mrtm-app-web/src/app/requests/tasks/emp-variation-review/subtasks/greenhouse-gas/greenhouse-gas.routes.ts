import { Route } from '@angular/router';

import {
  canActivateGreenhouseGasDecision,
  canActivateGreenhouseGasStep,
} from '@requests/common/emp/subtasks/greenhouse-gas';
import { GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas.helper';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';
import { canActivateGreenhouseGasSummary } from '@requests/tasks/emp-variation-review/subtasks/greenhouse-gas';

export const GREENHOUSE_GAS_ROUTES: Route[] = [
  {
    path: '',
    title: greenhouseGasMap.title,
    canActivate: [canActivateGreenhouseGasSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas').then((c) => c.GreenhouseGasSummaryComponent),
  },
  {
    path: GreenhouseGasWizardStep.DECISION,
    title: greenhouseGasMap.decision.title,
    canActivate: [canActivateGreenhouseGasDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-variation-review/subtasks/greenhouse-gas').then(
        (c) => c.GreenhouseGasVariationReviewDecisionComponent,
      ),
  },
  {
    path: GreenhouseGasWizardStep.FUEL,
    title: greenhouseGasMap.fuel.title,
    canActivate: [canActivateGreenhouseGasStep(GreenhouseGasWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas').then((c) => c.GreenhouseGasFuelComponent),
  },
  {
    path: GreenhouseGasWizardStep.CROSS_CHECK,
    title: greenhouseGasMap.crossChecks.title,
    canActivate: [canActivateGreenhouseGasStep(GreenhouseGasWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, GreenhouseGasWizardStep.FUEL),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas').then((c) => c.GreenhouseGasCrossChecksComponent),
  },
  {
    path: GreenhouseGasWizardStep.INFORMATION,
    title: greenhouseGasMap.information.title,
    canActivate: [canActivateGreenhouseGasStep(GreenhouseGasWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, GreenhouseGasWizardStep.CROSS_CHECK),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas').then((c) => c.GreenhouseGasInformationComponent),
  },
  {
    path: GreenhouseGasWizardStep.QA_EQUIPMENT,
    title: greenhouseGasMap.qaEquipment.title,
    canActivate: [canActivateGreenhouseGasStep(GreenhouseGasWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, GreenhouseGasWizardStep.INFORMATION),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas').then((c) => c.GreenhouseGasQaEquipmentComponent),
  },
  {
    path: GreenhouseGasWizardStep.VOYAGES,
    title: greenhouseGasMap.voyages.title,
    canActivate: [canActivateGreenhouseGasStep(GreenhouseGasWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, GreenhouseGasWizardStep.QA_EQUIPMENT),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas').then((c) => c.GreenhouseGasVoyagesComponent),
  },
];
