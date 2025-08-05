import { Route } from '@angular/router';

import {
  canActivateGreenhouseGasStep,
  canActivateGreenhouseGasSummary,
} from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas.guard';
import { GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas.helper';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';

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
    path: GreenhouseGasWizardStep.FUEL,
    title: greenhouseGasMap.fuel.title,
    canActivate: [canActivateGreenhouseGasStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-fuel').then(
        (c) => c.GreenhouseGasFuelComponent,
      ),
  },
  {
    path: GreenhouseGasWizardStep.CROSS_CHECK,
    title: greenhouseGasMap.crossChecks.title,
    canActivate: [canActivateGreenhouseGasStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, GreenhouseGasWizardStep.FUEL),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-cross-checks').then(
        (c) => c.GreenhouseGasCrossChecksComponent,
      ),
  },
  {
    path: GreenhouseGasWizardStep.INFORMATION,
    title: greenhouseGasMap.information.title,
    canActivate: [canActivateGreenhouseGasStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, GreenhouseGasWizardStep.CROSS_CHECK),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-information').then(
        (c) => c.GreenhouseGasInformationComponent,
      ),
  },
  {
    path: GreenhouseGasWizardStep.QA_EQUIPMENT,
    title: greenhouseGasMap.qaEquipment.title,
    canActivate: [canActivateGreenhouseGasStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, GreenhouseGasWizardStep.INFORMATION),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-qa-equipment').then(
        (c) => c.GreenhouseGasQaEquipmentComponent,
      ),
  },
  {
    path: GreenhouseGasWizardStep.VOYAGES,
    title: greenhouseGasMap.voyages.title,
    canActivate: [canActivateGreenhouseGasStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(GreenhouseGasWizardStep.SUMMARY, GreenhouseGasWizardStep.QA_EQUIPMENT),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-voyages').then(
        (c) => c.GreenhouseGasVoyagesComponent,
      ),
  },
];
